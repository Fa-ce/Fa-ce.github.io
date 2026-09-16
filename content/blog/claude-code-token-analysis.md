---
title: 我分析了 99 个会话、76MB 日志，终于搞懂 Claude Code 的 token 到底烧在哪
description: 用脚本量化本地会话日志后发现，输出只占成本约 12%，缓存重建才是 75% 的大头。记录三大烧钱黑洞、对应优化与可复用清单。
date: 2026-07-17
category: ai-agent
tags: [claude-code, ai, performance, best-practice]
---

# 我分析了 99 个会话、76MB 日志，终于搞懂 Claude Code 的 token 到底烧在哪

> 省 token 的关键，居然**不是"少说话"**。

如果你也在用 Claude Code，大概率有过这种体感：活儿是真干得漂亮，但 token 也是真烧得心疼。于是你开始凭感觉优化——让它少输出点、回答简短点、少啰嗦……

**然后发现并没有什么用。**

这篇文章记录了我一次完整的"数据驱动"优化过程：不拍脑袋，而是把本地 99 个会话、76MB 的对话日志捞出来做量化分析，找到真正的烧钱黑洞，再动手优化，最后把经验固化成规则。全程有脚本、有数据、有实操、有结果，你可以照着复刻到自己的环境。

先剧透最反直觉的结论：**在我的数据里，输出（output）只占总成本的约 12%，而一个你几乎从没注意过的东西，占了约 75%。**

---

## 一、别凭感觉，先让数据说话

优化的第一原则：**没有测量就没有优化**。

Claude Code 会把每个会话的完整记录（含每次请求的 token 用量）以 JSONL 格式存在本地。路径长这样：

```
C:\Users\<你>\.claude\projects\<项目名>\*.jsonl
```

先看看规模——一个 Python 脚本就够了（**这段脚本你可以直接拿去分析自己的数据**）：

```python
import os, glob, json
from collections import Counter

d = r'C:\Users\<你>\.claude\projects\<项目名>'
files = sorted(glob.glob(os.path.join(d, '*.jsonl')), key=os.path.getmtime)[-15:]  # 最近15个会话

usage = Counter()          # token 结构
tools = Counter()          # 工具调用次数
tool_errors = 0            # 工具失败次数
models = Counter()         # 模型分布
read_files = Counter()     # 被反复读取的文件
read_full = read_partial = 0

for f in files:
    for line in open(f, encoding='utf-8', errors='replace'):
        try: rec = json.loads(line)
        except: continue
        m = rec.get('message', {})
        if rec.get('type') == 'assistant':
            u = m.get('usage', {})
            usage['input']        += u.get('input_tokens', 0)
            usage['cache_read']   += u.get('cache_read_input_tokens', 0)
            usage['cache_create'] += u.get('cache_creation_input_tokens', 0)
            usage['output']       += u.get('output_tokens', 0)
            models[m.get('model', '?')] += 1
            for c in (m.get('content') or []):
                if isinstance(c, dict) and c.get('type') == 'tool_use':
                    tools[c.get('name', '?')] += 1
                    if c.get('name') == 'Read':
                        inp = c.get('input', {})
                        read_files[os.path.basename(str(inp.get('file_path','')))] += 1
                        if 'limit' in inp or 'offset' in inp: read_partial += 1
                        else: read_full += 1

total_in = usage['input'] + usage['cache_read'] + usage['cache_create']
print('=== Token 结构 ===')
for k, v in usage.items():
    print(f'  {k:14s} {v/1e6:7.1f}M')
print(f'  缓存命中率: {usage["cache_read"]/max(total_in,1)*100:.0f}%')
print('=== 工具调用 Top ===')
for t, n in tools.most_common(8): print(f'  {t:10s} {n}')
print(f'Read 全文/部分: {read_full}/{read_partial}')
print('=== 模型分布 ===')
for mdl, n in models.most_common(): print(f'  {mdl:32s} {n}')
print('=== 被反复 Read 的文件 ===')
for fn, n in read_files.most_common(6): print(f'  {fn:28s} {n}次')
```

> 💡 **省 token 小技巧（元级别的）**：分析日志时**别把原始 JSONL 直接丢给 AI 读**——76MB 会瞬间撑爆上下文、烧掉一大笔。用脚本在本地聚合成几十行统计结果，再交给 AI 分析。这本身就是第一课。

跑出来的真实结果（最近 15 个会话累计）：

```
=== Token 结构 ===
  input            0.9M
  cache_read     212.4M
  cache_create   127.0M
  output           5.2M
  缓存命中率: 62%
=== 工具调用 Top ===
  Read       237
  Edit       231
  Bash       200
  Grep        66
  Write       34
=== 模型分布 ===
  claude-opus-4-8                  1126
  claude-fable-5                    536
  claude-haiku-4-5-20251001         353
=== 被反复 Read 的文件 ===
  EmbedChat.vue                17次
  schema.ts                    11次
  nodeCapabilities.ts          10次
```

数据一摆出来，问题立刻就不一样了。

---

## 二、核弹级发现：你以为的成本大头，根本不是大头

先把这四个数字换算成**真实成本占比**。关键在于 Claude 的 **Prompt Caching（提示缓存）** 定价系数各不相同：

| Token 类型 | 定价系数（相对基础 input） | 含义 |
| --- | --- | --- |
| `input` | 1× | 全新的、没缓存的输入 |
| `cache_read`（读缓存） | **0.1×** | 命中缓存，超便宜 |
| `cache_create`（写缓存） | **1.25×** | 把内容写进缓存，有溢价 |
| `output` | ~5× | 模型的输出 |

按这组系数给上面的 token 量加权，得到成本结构：

| 成本项 | 占比（加权估算） |
| --- | --- |
| `cache_create` 写缓存 | 约 75% |
| `output` 输出 | 约 13% |
| `cache_read` 读缓存 | 约 11% |
| `input` 全新输入 | 约 1% |

**看清楚了吗？**

- 你拼命想压缩的 **output（输出），只占约 12–13%**；
- 而 **`cache_create`（写缓存）独占约 75%**——这才是真正的碎钞机。

> **省 token 的本质，不是让模型少说话，而是减少"缓存重建"。**

这就是为什么凭感觉"让它回答简短点"几乎没用——你在优化那 12%，却对着 75% 的黑洞视而不见。

那么问题来了：**什么会疯狂触发 `cache_create`？** 我从数据里挖出了三个元凶。

---

## 三、三大烧钱黑洞

### 🕳️ 黑洞一：会话中途切换模型

看模型分布那组数据——**同一批会话里，opus、fable、haiku 三个模型混着用**（1126 / 536 / 353 条消息）。

这里有个很多人不知道的机制：

> **Prompt 缓存是和模型绑定的。你在会话中途每 `/model` 切一次，之前积累的全部上下文缓存，对新模型全部失效，必须从头重写一遍。**

也就是说，一段几万 token 的上下文，如果你在会话里切了 3 次模型，最坏情况要付 **3 次 `cache_create` 的写入费**。这正是 `cache_create` 高达 127M 的头号推手。

切一次模型，链条上发生的事：

1. 会话上下文已缓存 ✅
2. 执行 `/model` 切换
3. 缓存对新模型失效 ❌
4. 整段上下文重新写缓存 💸
5. `cache_create` 暴涨

**✅ 对策**：模型选择尽量在**会话开始前**定好；确实要切，就挑一个**自然断点**，切完顺手 `/clear` 或开新会话，别让旧上下文拖着重写。

---

### 🕳️ 黑洞二：臃肿的"系统提示底座"

每次会话，系统提示里都会注入一大坨固定内容：所有 Skill 的描述、启用插件的清单、全局与项目的 `CLAUDE.md`……这坨东西每次缓存失效都要重新计费。而我的底座当时**肥得离谱**：

- 全局装了 **90+ 个 Skill**，每个的描述都往系统提示里塞；
- 多个插件"**整包注入**"——一个插件条目就带进十几个 Skill 的描述；
- 全局 `CLAUDE.md` 里，**同一套"模型选择/委派矩阵"翻来覆去写了三遍**。

这坨底座越大，每次 `cache_create` 就越贵。

---

### 🕳️ 黑洞三：行为层的隐性浪费

这个藏在工具调用里，最容易被忽略：

| 浪费行为 | 数据实锤 | 为什么烧钱 |
| --- | --- | --- |
| 大文件反复**全文读** | `EmbedChat.vue` 被整读 **17 次** | 每次全读都把整个文件塞进上下文 |
| 工具调用**失败重试** | 累计 **38 次**失败 | 每次失败=多一轮重复上下文 |
| Read 全文 vs 局部 | 全文 **138** 次 / 局部仅 99 次 | 全文读比 `offset/limit` 局部读贵得多 |

每一次"整读一个 400 行的大文件"，都是往上下文里灌了一大桶水，而这桶水会跟着后续每一次缓存重建反复计费。

---

## 四、动手优化（有前后对比）

找到黑洞，就可以精准下刀了。原则只有一条：**只砍冗余，绝不牺牲能力。**

### 4.1 给 CLAUDE.md 瘦身

把三段重复的"模型/委派矩阵"合并成一张表，语义零丢失：

```
全局 CLAUDE.md：169 行  ➜  131 行   （-22%）
```

删掉的全是重复表述——增量信息一条没少，只是不再"写三遍"。

### 4.2 Skill 大清理：90 ➜ 28

这是最狠的一刀。我把 90 个 Skill 按"和我的实际工作（Vue 前端 + 文档）相关度"分组，逐组清理：

| 分组 | 数量 | 处理 |
| --- | --- | --- |
| 与插件重复 | 16 | 删全局留插件版，零损失 |
| 记忆系统系列 | 9 | 删除 |
| 部署平台 | 4 | 删除 |
| SaaS 平台特定 | 9 | 删除 |
| 技术栈不匹配 | 3 | 删除 |
| 杂项 / 与 MCP 重复 | 9 | 删除 |
| 娱乐 / 商业及其他 | 12 | 删除 |
| 工作相关 | 28 | ✅ 保留 |

删除操作本身也有坑——这里插播一个**血泪教训**。

Claude Code 的 `!` 命令前缀在我的 Windows 机器上跑的是 **Git Bash**，不是 PowerShell。我一开始想当然给了 PowerShell 语法：

```powershell
# ❌ 错误：Remove-Item 是 PowerShell 命令，Git Bash 不认；
#         反斜杠 \ 在 bash 里是转义符，路径会被吞掉
cd $HOME\.claude\skills; Remove-Item -Recurse -Force ponytail,yeet
# 报错：Remove-Item: command not found
#       cd: /c/Users/xxx.claudeskills: No such file or directory
```

正确姿势是 **Git Bash 语法**（正斜杠 `/`、`~` 家目录、空格分隔、`rm -rf`）：

```bash
# ✅ 正确
cd ~/.claude/skills && rm -rf ponytail ponytail-audit ponytail-review yeet
```

> ⚠️ **安全提示**：`rm -rf` 删的是全局配置，**不可逆**。删前先用只读命令 `ls` 确认目标，删后再 `ls` 验证清零。

### 4.3 插件层审查：真正的注入大头

清完 Skill 我才意识到一个更关键的点，也是本文我最想分享的洞察：

> **注入成本 ≠ 目录数量。** 那些启用中的插件（`enabledPlugins = True`）是"**整包注入**"——一个插件条目就带进十几个 Skill 的描述，比你手动删十几个散装 Skill 目录，影响还大。

所以优化配置的正确顺序应该是：**先看 `enabledPlugins` 启用清单（大头），再清散装 Skill（小头）。** 我据此关掉了用不上的插件，并保留了确实高频的（代码审查、文档处理等）——**关掉的是能力冗余，不是能力本身，随时能在 `/plugin` 里重新开。**

---

## 五、把经验固化成"肌肉记忆"

一次性优化会随时间腐化。真正的杀招是把结论**写进规则**，让它每次自动生效。我把这次的发现沉淀成了一份"行为准则"（写进记忆 / `CLAUDE.md`）：

1. **大文件先 `Grep` 定位再局部读**，禁止习惯性全文 `Read`；
2. **Edit 失败一次，立刻精确重读再改**，禁止盲目重试第二次；
3. **已定位的小改动主会话直接改**，不为省事去委派子代理（委派的上下文开销反而更大）；
4. **会话中途切模型时主动提醒**：缓存会失效，建议自然断点切换；
5. **能用一次脚本聚合查询的，绝不用多轮读原始文件**。

---

## 六、成果总账

| 优化项 | Before | After | 效果 |
| --- | --- | --- | --- |
| 全局 CLAUDE.md | 169 行 | **131 行** | 去掉三段重复矩阵 |
| 全局 Skill | 90 个 | **28 个** | 砍掉 69%，零能力损失 |
| 插件层 | 全量启用 | 按需启用 | 掐掉整包注入大头 |
| 行为准则 | 无 | **5 条固化** | 持续生效，防腐化 |

配合"三大黑洞"对策（不中途切模型、瘦底座、改行为），**系统提示底座与 `cache_create` 的重建成本被显著压下来**，而 Claude Code 的实际能力**一点没减**——删的每一样，要么是重复注入，要么是和工作八竿子打不着的东西。

---

## 七、给你的可复用 Checklist

想复刻的话，照这个清单走：

- [ ] 用文中的 **Python 脚本**分析自己的 `~/.claude/projects/*/*.jsonl`，先看清成本结构；
- [ ] 盯住 `cache_create` 占比——**它才是大头，不是 output**；
- [ ] 固定模型，**不在会话中途乱切**；要切就 `/clear` 开新局；
- [ ] 先审 **`enabledPlugins`**（整包注入），再清散装 Skill；
- [ ] 删掉和你技术栈无关的 Skill/插件（部署、SaaS、异栈、娱乐类）；
- [ ] 合并 `CLAUDE.md` 里的重复段落；
- [ ] 把优化结论**写成规则**，别指望下次还记得。

---

## 写在最后

这次优化最大的收获，其实不是省了多少钱，而是那个思维转变：

> **凭感觉优化，你会一直对着"输出"这 12% 使劲；用数据说话，你才会看见"缓存重建"那 75% 的真黑洞。**

工具再智能，也替代不了你"先测量、再动手"的工程习惯。希望这篇能帮你把 Claude Code 用得又爽又省。
