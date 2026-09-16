---
title: WSL2 初始使用与开发环境配置指南
description: 从安装发行版到搭好可用的前端开发环境，涵盖磁盘迁移、镜像加速、终端配置与常见初始化陷阱。
date: 2026-05-27
category: devops
tags: [wsl2, linux, windows, guide]
---

# WSL2 初始使用与开发环境完整配置指南

> 从零开始把一台干净的 Windows 11 + WSL2 Ubuntu 配成趁手的前端/全栈开发环境。本文记录每一步的「为什么」和「怎么做」，包含我自己踩过的所有坑。

## 环境前置

| 项目       | 版本/说明                          |
| ---------- | ---------------------------------- |
| 操作系统   | Windows 11 Pro 26200               |
| WSL 版本   | 2.7.3.0（内核 6.6.114.1-1）        |
| WSL 发行版 | Ubuntu 24.04                       |
| 默认 Shell | Zsh + Oh My Zsh                    |
| 代理方案   | Mihomo Party（Clash 系列）TUN 模式 |
| 网络模式   | NAT                                |

WSL 安装本身不在本文范围（一句话：`wsl --install -d Ubuntu-24.04`）。本文从「Ubuntu 已装好，第一次进系统」开始。

---

## 一、`.wslconfig` —— WSL2 全局配置

文件位置：`C:\Users\<你的用户名>\.wslconfig`（Windows 端，不在 WSL 里）。

### 推荐配置

```ini
[wsl2]
networkingMode=NAT          # 网络模式：NAT（默认）
memory=4GB                  # WSL 可用内存上限（按机器内存的 1/2 ~ 1/4）
processors=4                # CPU 核心数（按物理核数的一半）
swap=2GB                    # 交换分区
localhostForwarding=true    # 启用 localhost 转发（默认就是 true，显式写保险）
```

### 各项说明

- **`networkingMode=NAT`**：WSL 在 Hyper-V 内部 NAT 子网（如 `172.20.x.x`），通过 Windows 主机 NAT 出网。这是默认且最稳定的模式。
- **`memory` / `processors`**：不限制的话 WSL 默认能吃掉一半物理内存。运行大型构建时（webpack、TypeScript）很容易把 Windows 拖到卡死，**必须显式限制**。
- **`localhostForwarding=true`**：Windows 主机访问 `localhost:port` 自动转到 WSL。这是单向的，**不会让局域网其他机器访问 WSL**（这是另一篇文档的话题）。
- **不要用 `networkingMode=mirrored`**：理论上是最优雅的方案（WSL 共用 Windows 网络栈），但跟 VMware / Hyper-V / Docker Desktop 多虚拟化环境严重冲突，会报错 `0x8007054f`。

### 让配置生效

```powershell
wsl --shutdown
# 等 8 秒确保完全关闭
wsl
```

### 验证

```bash
# WSL 内
free -h       # 看内存上限
nproc         # 看 CPU 核数
```

---

## 二、Ubuntu 系统初始化

### 2.1 换国内源（重要）

Ubuntu 24.04 用了新的 deb822 格式，源文件在 `/etc/apt/sources.list.d/ubuntu.sources`（不是老版的 `/etc/apt/sources.list`）。

换清华源：

```bash
sudo sed -i \
  's@//.*archive.ubuntu.com@//mirrors.tuna.tsinghua.edu.cn@g; s@//security.ubuntu.com@//mirrors.tuna.tsinghua.edu.cn@g' \
  /etc/apt/sources.list.d/ubuntu.sources
```

更新软件包列表：

```bash
sudo apt update && sudo apt upgrade -y
```

### 2.2 安装基础工具链

```bash
sudo apt install -y \
  build-essential \
  git curl wget vim \
  zsh unzip \
  ca-certificates gnupg lsb-release \
  net-tools dnsutils
```

各包用途：

| 包                   | 作用                                                                             |
| -------------------- | -------------------------------------------------------------------------------- |
| `build-essential`    | gcc/g++/make，**几乎所有 native 模块编译都需要**（如 sqlite3、bcrypt、node-gyp） |
| `git curl wget`      | 必备                                                                             |
| `vim`                | 命令行编辑器                                                                     |
| `zsh`                | 我们要换的 shell                                                                 |
| `net-tools dnsutils` | `ifconfig`、`nslookup`、`dig` 等网络诊断工具                                     |

---

## 三、Zsh + Oh My Zsh + 插件 + 随机主题

为什么换 zsh：tab 补全更智能、插件生态丰富、自动建议、语法高亮。**写过几天就回不去 bash 了**。

### 3.1 安装 Oh My Zsh

```bash
sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
```

> 如果你开了 TUN 代理直连 GitHub 稳定，直接用官方脚本也行：
>
> ```bash
> sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
> ```

### 3.2 设置 Zsh 为默认 Shell

```bash
chsh -s $(which zsh)
```

**重要**：`chsh` 改的是登录 shell，**需要退出 WSL 重新进**才能生效（或者直接关闭再打开 WSL 终端窗口）。

### 3.3 安装两个必备插件

```bash
# 自动建议（敲一半命令时显示历史里的灰色补全）
git clone https://github.com/zsh-users/zsh-autosuggestions \
  ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions

# 语法高亮（命令存在=绿色，不存在=红色）
git clone https://github.com/zsh-users/zsh-syntax-highlighting \
  ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
```

> ⚠️ 我最开始踩的坑：用了一个不存在的 gitee 镜像 URL（`gitee.com/playjokes/...`），404。要么用 GitHub 原版（开代理直连），要么去 gitee 搜真实可用的镜像（如 `gitee.com/mirrors/zsh-autosuggestions`）。

### 3.4 启用插件 + 随机主题

编辑 `~/.zshrc`，修改两处：

```bash
# 主题：用随机
ZSH_THEME="random"

# 候选池：避开需要 Nerd Font 字体的主题（agnoster、bira 等会乱码）
ZSH_THEME_RANDOM_CANDIDATES=(
  "robbyrussell"
  "ys"
  "bureau"
  "candy"
  "clean"
  "fishy"
  "gnzh"
  "jonathan"
  "kolo"
  "mh"
  "muse"
  "sorin"
  "fox"
  "kphoen"
)

# 插件
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)
```

应用：

```bash
exec zsh
```

每次开新终端随机切主题，**用一段时间就能挑出自己最爱的那个**。看当前用的是哪个：`echo $RANDOM_THEME`。

### 3.5 想用酷炫主题（可选）

如果想用 `agnoster`、`powerlevel10k` 这类带图标、Git 状态、电池显示的主题，需要：

1. Windows Terminal 设置一款 Nerd Font 字体（如 `MesloLGS NF`、`FiraCode Nerd Font`）
2. 下载：https://www.nerdfonts.com/font-downloads
3. Windows Terminal → 设置 → Ubuntu profile → 外观 → 字体改成 Nerd Font

不急的话先用纯 ASCII 主题就够。

### 3.6 常见踩坑：`compinit` 报错

如果你装过 Docker Desktop 然后又卸了（或 Docker Desktop 的 WSL Integration 在装），开终端时可能看到：

```
compinit:527: no such file or directory: /usr/share/zsh/vendor-completions/_docker
```

这是 Docker Desktop 残留的死链。修复：

```bash
ls -la /usr/share/zsh/vendor-completions/_docker
# 如果是个 -> 指向已不存在的路径，确认后删掉
sudo rm -f /usr/share/zsh/vendor-completions/_docker
rm -f ~/.zcompdump*
exec zsh
```

---

## 四、Git 配置

### 4.1 全局基础配置

```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global init.defaultBranch main
git config --global core.autocrlf input    # 重要：避免换行符跨平台问题
git config --global pull.rebase false
```

`core.autocrlf input` 解释：

- WSL 是 Linux，提交时用 LF
- Windows 上签出别人的代码会自动转 CRLF
- `input` 模式：提交时 CRLF → LF，签出时不转换。**最适合跨平台团队**。

### 4.2 SSH key 配置

#### 方案 A：WSL 内独立生成（推荐，最干净）

```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
# 一路回车，默认存到 ~/.ssh/id_ed25519
# passphrase 可以留空（个人开发机）
```

把公钥贴到 GitHub：

```bash
cat ~/.ssh/id_ed25519.pub
# 复制输出 → https://github.com/settings/ssh/new
```

#### 方案 B：复用 Windows 已有的 SSH key

```bash
mkdir -p ~/.ssh
cp /mnt/c/Users/<你的用户名>/.ssh/id_ed25519 ~/.ssh/
cp /mnt/c/Users/<你的用户名>/.ssh/id_ed25519.pub ~/.ssh/
cp /mnt/c/Users/<你的用户名>/.ssh/known_hosts ~/.ssh/ 2>/dev/null

# 关键：权限必须严格
chmod 700 ~/.ssh
chmod 600 ~/.ssh/id_ed25519
chmod 644 ~/.ssh/id_ed25519.pub
```

> ⚠️ **不要用软链 `ln -s /mnt/c/...`**！  
> `/mnt/c` 是 9P 文件系统挂载，不支持 Linux 权限模型，SSH 看到 .ssh 是 777 会拒绝使用私钥（"Permissions are too open"）。**必须复制**。

#### 方案 C：用旧版 RSA key（兼容老内部仓库）

如果公司老仓库只认 RSA：

```bash
ssh-keygen -t rsa -b 4096 -C "your-email"
```

### 4.3 GitHub SSH 连接 22 端口失败 → 走 443

国内 ISP 偶尔对 GitHub 的 22 端口做干扰。症状：

```bash
ssh -T git@github.com
# Connection closed by 20.205.243.166 port 22
```

解决：让 SSH 走 GitHub 官方提供的 443 端口入口（`ssh.github.com:443`，伪装成 HTTPS）。

编辑 `~/.ssh/config`：

```
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

权限：

```bash
chmod 600 ~/.ssh/config
```

测试：

```bash
ssh -T git@github.com
# Hi <你的用户名>! You've successfully authenticated...
```

### 4.4 多 Key 场景：内部仓库 RSA + GitHub Ed25519

公司老仓库要 RSA、GitHub 用 Ed25519 是典型组合。完整 `~/.ssh/config`：

```
# GitHub 走 443 + Ed25519
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes

# 公司内部仓库走 22 + RSA
Host company
    Hostname 192.168.1.201
    Port 8022
    User git
    IdentityFile ~/.ssh/id_rsa
    IdentitiesOnly yes

# Gitee
Host gitee.com
    Hostname gitee.com
    Port 22
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
```

`IdentitiesOnly yes` **必加**，否则 SSH 会按 agent 里所有 key 轮询尝试，触发 GitHub "Too many authentication failures" 拒绝。

之后 `git clone` 可以用别名：

```bash
git clone company:group/repo.git   # 等价于 git@192.168.1.201:group/repo.git，端口 8022
```

### 4.5 SSH 首次连接的 "authenticity" 提示

```
The authenticity of host '[ssh.github.com]:443 ...' can't be established.
ED25519 key fingerprint is SHA256:+DiY3wvvV6TuJJhbpZisF/zLDA0zPMSvHdkr4UvCOqU.
Are you sure you want to continue connecting (yes/no)?
```

这是 SSH 的 TOFU（Trust On First Use）机制，所有新主机第一次连都会问。回答 `yes`，host key 会存到 `~/.ssh/known_hosts`，下次不再问。

如果未来看到 **`WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!`** 这种感叹号警告，**那才是真问题**（服务器 key 变了，可能被替换或中间人攻击）。

---

## 五、Node.js / nvm 配置

### 5.1 安装 nvm

```bash
curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
```

> 用 zsh 之前装：自动写入 `~/.zshrc`  
> 用 zsh 之后装：也会自动写入 `~/.zshrc`  
> **检查方法**：看 `~/.zshrc` 末尾有没有：
>
> ```bash
> export NVM_DIR="$HOME/.nvm"
> [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
> [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
> ```

### 5.2 关键：配 nvm 下载源

nvm 装 Node 时从 `nodejs.org` 下载二进制，**国内访问极不稳定**，即使开了代理也常超时。改用淘宝镜像：

```bash
# 写入 ~/.zshrc
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node
```

`source ~/.zshrc` 后再装：

```bash
nvm install 18.20.8
nvm install --lts
nvm alias default lts/*
nvm use default
```

### 5.3 npm 镜像 —— 不一定需要改

**关键认知**：nvm 下载源 ≠ npm registry。

| 工具    | 下载位置                  | 是否要改                |
| ------- | ------------------------- | ----------------------- |
| **nvm** | nodejs.org 下 node 二进制 | ✅ **要改**（国内极慢） |
| **npm** | registry.npmjs.org 下包   | ❌ 不一定改             |

如果你开了 TUN 代理，**npm 直连 npmjs.org 就走代理了**，速度完全 OK，**不必改 registry**。改成淘宝镜像反而：

- 套娃延迟（代理 → 阿里云镜像）
- 私有包丢失（公司私库的包淘宝没同步）
- 关代理后不一定更快

如果确实要改：

```bash
npm config set registry https://registry.npmmirror.com    # 改
npm config delete registry                                # 还原
npm config get registry                                   # 查
```

### 5.4 `.npmrc` 配置最佳实践

#### 用户级 `~/.npmrc`（一次配，全局生效）

```bash
npm config set audit false
npm config set fund false
```

`audit=false` 不只是关广告，**它治 npm 8 + 私服环境下的 EPIPE 报错**（详见下面踩坑部分）。

#### 项目级 `.npmrc`（commit 到 git，团队共享）

放跟项目相关的配置：

```ini
registry=http://192.168.1.100:8081/repository/npm-group/
strict-ssl=false
fund=false
audit=false
```

公司私服的内网 HTTP registry 写在项目里，新人 clone 就能用。

#### npm 配置优先级（从高到低）

```
1. 命令行 --xxx=yyy
2. 项目根 .npmrc
3. 项目父目录的 .npmrc（向上递归）
4. 用户级 ~/.npmrc
5. 全局 $(npm prefix -g)/etc/npmrc
6. npm 内置默认值
```

查当前生效：

```bash
npm config list           # 当前所有非默认配置
npm config list -l        # 含默认值的所有配置
```

### 5.5 npm 安装报 `EPIPE` 怎么办

我亲历的真实场景：在大型 Vue2 + webpack4 老项目里跑 `npm i`，所有 http fetch 都 200 OK，但 reify 阶段（解压写入 `node_modules`）报：

```
npm ERR! code EPIPE
npm ERR! syscall write
npm ERR! errno -32
npm ERR! write EPIPE
```

**真凶**：npm install 完成后会自动发起 `npm audit` 漏洞扫描，**npm 8 + 私服（Nexus / Verdaccio）+ 大项目** 的组合下，audit 的并发 stream 处理有 bug，会触发 EPIPE。

**修复**：在项目 `.npmrc` 或用户级 `~/.npmrc` 加 `audit=false`。

附加修复（提高文件描述符限制，防大项目踩坑）：

```bash
# 临时
ulimit -n 65536

# 永久（加到 ~/.zshrc）
echo 'ulimit -n 65536' >> ~/.zshrc

# 系统级（/etc/security/limits.conf）
sudo tee -a /etc/security/limits.conf <<'EOF'
* soft nofile 65536
* hard nofile 65536
EOF
```

### 5.6 npm 还崩 → 直接换 pnpm

如果 npm 各种调都不行，**用 pnpm**。它用硬链接 + 内容寻址存储，并发控制更稳，在 WSL2 上实测比 npm 稳定 10 倍。

```bash
# 通过 npm 装（如果 npm i -g 都崩，下一条）
npm install -g pnpm

# 或者用 pnpm 官方独立安装器（不依赖 npm）
curl -fsSL https://get.pnpm.io/install.sh | sh -
source ~/.zshrc
```

用法兼容 npm：

```bash
pnpm install
pnpm add react
pnpm run dev
```

`.npmrc` 配置 pnpm 也认。

### 5.7 ENOTEMPTY 错误

```
npm ERR! code ENOTEMPTY
npm ERR! ENOTEMPTY: directory not empty, rename '.../node_modules/body-parser' -> '...'
```

这是上次 npm i 半成功留下的脏状态。**彻底清理重来**：

```bash
rm -rf node_modules
rm -f package-lock.json yarn.lock pnpm-lock.yaml
npm cache clean --force
ulimit -n 65536
npm i    # 或 pnpm install
```

---

## 六、Python / uv 配置

`uv` 是 Astral 出的 Python 包管理器，**一站式替代** pyenv + pip + pipx + poetry + virtualenv，用 Rust 写的，比 pip 快 10-100 倍。**2024-2025 Python 圈的事实标准**。

### 6.1 安装

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.zshrc
uv --version
```

### 6.2 常用命令速查

| 用途             | 命令                                |
| ---------------- | ----------------------------------- |
| 装 Python 解释器 | `uv python install 3.12`            |
| 列出已装版本     | `uv python list`                    |
| 创建项目         | `uv init myproject && cd myproject` |
| 加依赖           | `uv add requests`                   |
| 删依赖           | `uv remove requests`                |
| 运行脚本         | `uv run python xxx.py`              |
| 同步依赖         | `uv sync`                           |
| 单文件脚本依赖   | `uv run --with requests script.py`  |
| 临时跑工具       | `uvx ruff check .`（类似 npx）      |
| 装独立 CLI 工具  | `uv tool install ruff`              |

### 6.3 基础工作流

```bash
uv python install 3.12             # 装 Python 3.12（uv 自己管理，不污染系统）
uv init test-proj && cd test-proj  # 创建项目
uv add requests                    # 加依赖（自动建 venv）
uv run python -c "import requests; print(requests.__version__)"
```

不再需要手动 `python -m venv .venv && source .venv/bin/activate`，**uv 自动管理 venv**。

---

## 七、跨系统协作

### 7.1 Git 凭据复用 Windows（HTTPS 场景）

如果你不用 SSH 而走 HTTPS clone，可以复用 Windows 的 Git Credential Manager（GCM）：

```bash
# 验证 Windows Git 是否能被 WSL 调用
which git-credential-manager.exe

# 如果有输出（说明 Windows 装了 Git for Windows）
git config --global credential.helper manager

# 如果要写完整路径（注意外单引号 + 内双引号，避免 sh 转义吃掉空格）
git config --global credential.helper '"/mnt/c/Program Files/Git/mingw64/bin/git-credential-manager.exe"'
```

但**推荐还是用 SSH key**（方案 A），更纯粹。

### 7.2 VS Code 集成

Windows 装好 VS Code 后，WSL 里：

```bash
cd ~/projects/myproject
code .
```

会自动装 Remote-WSL server 端，本地 VS Code 通过 WSL Remote 打开项目，**编辑器在 Windows，运行在 WSL**。

### 7.3 文件位置铁律

| 用途                      | 路径                                                    |
| ------------------------- | ------------------------------------------------------- |
| WSL 访问 Windows 用户目录 | `/mnt/c/Users/<你的用户名>/`                            |
| Windows 访问 WSL 文件系统 | 资源管理器输入 `\\wsl$\Ubuntu-24.04\home\<你的用户名>\` |
| 项目存放位置              | **必须放 WSL 原生路径** `~/projects/`                   |

**🚫 项目千万别放 `/mnt/c/` 或 `/mnt/f/`**：

- 9P 协议挂载的 Windows 盘，IO 慢 10 倍以上
- `git status`、`npm install` 会卡到怀疑人生
- 文件监听（HMR）也会出问题

如果项目本来在 Windows 盘，**git clone 一份到 `~/projects/` 用**。

---

## 八、踩坑速查表

| 现象                                    | 原因                                                   | 修复                                                                |
| --------------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------- |
| WSL 内 ping IP 通但解析域名失败         | Clash TUN 拦了 DNS / 镜像模式问题                      | NAT 模式 + Clash 排除内网网段不包含 WSL 网段                        |
| `Destination Host Unreachable`          | ARP 失败（火绒「对外 ARP 攻击拦截」误伤 Hyper-V 网卡） | 关闭火绒「对外 ARP 攻击拦截」                                       |
| `ssh: Connection closed by ... port 22` | ISP 干扰 GitHub 22 端口                                | 用 `ssh.github.com:443`                                             |
| `npm ERR! EPIPE`                        | npm 8 + 私服 audit 流崩                                | `.npmrc` 加 `audit=false`                                           |
| `ENOTEMPTY: directory not empty`        | 上次 npm i 半成功                                      | 删 `node_modules` + `package-lock.json` + `npm cache clean --force` |
| `nvm install` 卡住                      | 下载 nodejs.org 超时                                   | `export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node`   |
| `No acceptable C compiler found`        | 没装 build-essential                                   | `sudo apt install build-essential`                                  |
| `compinit:527: no such file ...`        | Docker Desktop 死链残留                                | 删死链 + `rm ~/.zcompdump*` + `exec zsh`                            |
| `rm: cannot remove ...: Is a directory` | 用 `rm` 删目录                                         | `rmdir`（空）或 `rm -r`（非空）                                     |
| PowerShell 脚本中文注释报错             | UTF-8 无 BOM 被按 GBK 解码                             | 用记事本另存为 "UTF-8 with BOM" 或改用 PowerShell 7 (`pwsh`)        |
| `rm -rf` 误删                           | 没有回收站，永久消失                                   | 装 `trash-cli`，用 `trash` 替代                                     |

---

## 九、`~/.zshrc` 完整参考

```bash
# Path to Oh My Zsh
export ZSH="$HOME/.oh-my-zsh"

# 随机主题 + 候选池
ZSH_THEME="random"
ZSH_THEME_RANDOM_CANDIDATES=(
  "robbyrussell" "ys" "bureau" "candy" "clean" "fishy"
  "gnzh" "jonathan" "kolo" "mh" "muse" "sorin" "fox" "kphoen"
)

# 插件
plugins=(git zsh-autosuggestions zsh-syntax-highlighting)

source $ZSH/oh-my-zsh.sh

# ---------- 自定义 ----------

# 文件描述符上限（大型项目 npm install）
ulimit -n 65536

# nvm
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"

# nvm 下载源（淘宝镜像）
export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node

# 代理开关（备用，TUN 模式下不需要）
proxy_on() {
  export hostip=$(ip route show | grep -i default | awk '{print $3}')
  export http_proxy="http://$hostip:7890"
  export https_proxy="http://$hostip:7890"
  export all_proxy="socks5://$hostip:7890"
  echo "Proxy on: $http_proxy"
}
proxy_off() {
  unset http_proxy https_proxy all_proxy
  echo "Proxy off"
}

# 常用别名
alias ll='ls -lah'
alias ..='cd ..'
alias ...='cd ../..'
```

---

## 十、初始化清单（按顺序执行）

```bash
# 1. 换源 + 基础工具
sudo sed -i 's@//.*archive.ubuntu.com@//mirrors.tuna.tsinghua.edu.cn@g; s@//security.ubuntu.com@//mirrors.tuna.tsinghua.edu.cn@g' /etc/apt/sources.list.d/ubuntu.sources
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential git curl wget vim zsh unzip ca-certificates gnupg net-tools dnsutils

# 2. Zsh + Oh My Zsh
sh -c "$(curl -fsSL https://gitee.com/mirrors/oh-my-zsh/raw/master/tools/install.sh)"
chsh -s $(which zsh)
git clone https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions
git clone https://github.com/zsh-users/zsh-syntax-highlighting ~/.oh-my-zsh/custom/plugins/zsh-syntax-highlighting
# 然后编辑 ~/.zshrc 改主题和 plugins

# 3. Git 基础
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
git config --global core.autocrlf input
git config --global init.defaultBranch main

# 4. SSH key + GitHub 443
ssh-keygen -t ed25519 -C "邮箱"
cat > ~/.ssh/config <<'EOF'
Host github.com
    Hostname ssh.github.com
    Port 443
    User git
    IdentityFile ~/.ssh/id_ed25519
    IdentitiesOnly yes
EOF
chmod 600 ~/.ssh/config
# 把 ~/.ssh/id_ed25519.pub 加到 GitHub
ssh -T git@github.com

# 5. nvm + Node
curl -o- https://gitee.com/mirrors/nvm/raw/master/install.sh | bash
echo 'export NVM_NODEJS_ORG_MIRROR=https://npmmirror.com/mirrors/node' >> ~/.zshrc
exec zsh
nvm install --lts
nvm alias default lts/*

# 6. npm 全局配置
npm config set audit false
npm config set fund false

# 7. uv (Python)
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.zshrc
uv python install 3.12
```

跑完上面这一坨，你的 WSL 开发环境就和我现在一样了。

---

## 结语

WSL2 不是 Linux 的"轻量替代品"，而是 Windows 上**真正能用**的 Linux 开发环境。配好之后：

- **编辑用 Windows**（VS Code 体验、字体、显示）
- **运行用 Linux**（命令行、容器、原生工具）
- **资源用 Hyper-V**（隔离、限制、快照）

第一次配会有不少坑，但只要把这份文档跟着走一遍，能少踩 90% 的坑。剩下 10% 是新版本的新坑（笑）。

如果你的网络环境也有 Clash TUN + 火绒，强烈建议同时看我另一篇：[WSL2 + Clash TUN + 火绒的网络踩坑记录](/blog/wsl2-clash-huorong-troubleshooting)。

如果需要让 WSL 内的服务给局域网其他机器访问，看：[WSL2 端口转发完整指南](/blog/wsl2-port-forwarding-guide)。
