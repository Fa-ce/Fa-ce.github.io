---
title: WSL2 + Clash + 火绒 踩坑排查记录
description: 代理开着 WSL2 就断网，关掉又访问不了外网。记录一次从 ARP 拦截日志追到 TUN 模式冲突的完整排查过程，以及重建 Hyper-V 网络栈的正确恢复步骤。
date: 2026-05-28
category: devops
tags: [wsl2, proxy, network, troubleshooting, debugging]
---

# WSL2 + Clash TUN + 火绒：一次 DNS 故障牵出的网络断网踩坑记录

> 起因只是 WSL 内 DNS 解析失败，结果一路改配置改到彻底断网，最后发现真凶是火绒安全的 **ARP 防护**误伤了 Hyper-V 虚拟网卡。
> 本文完整记录排查过程、走过的弯路和最终方案，给同样环境的朋友参考。

## 环境信息

| 项目       | 版本/配置                            |
| ---------- | ------------------------------------ |
| 操作系统   | Windows 11 Pro 26200                 |
| WSL 版本   | 2.7.3.0（内核 6.6.114.1-1）          |
| WSL 发行版 | Ubuntu                               |
| 代理工具   | Mihomo Party（Clash 系列），TUN 模式 |
| 安全软件   | 火绒安全                             |
| 其他虚拟化 | VMware Workstation、Hyper-V          |

---

## 初始症状

Windows 上 Clash TUN 模式工作正常，浏览器、终端访问外网都没问题。但 WSL 内表现异常：

```bash
peanut@Snow:~$ ping 8.8.8.8
64 bytes from 8.8.8.8: icmp_seq=1 ttl=106 time=175 ms     # IP 可达

peanut@Snow:~$ ping baidu.com
ping: baidu.com: Temporary failure in name resolution    # 域名解析失败
```

**典型症状**：IP 层通，DNS 层不通。第一直觉是 DNS 配置问题。

---

## 排查过程（按时间顺序）

### 第一阶段：怀疑 DNS（方向错误）

第一反应是检查 `/etc/resolv.conf`，WSL 默认自动生成的 DNS 指向 Windows 主机网关（`172.28.32.1`），但 Clash TUN 接管全局后，这个网关的 DNS 转发可能被破坏。

最初尝试的方案有三个：

1. 手动覆盖 `/etc/resolv.conf` 写入 `223.5.5.5`（最快，治标）
2. 调整 Clash DNS 配置（`dns-hijack: ['any:53']`）（治本）
3. 启用 WSL2 **镜像网络模式**（最优雅，复用 Windows 网络栈）

**选了方案 3**，准备一劳永逸。结果，灾难开始。

### 第二阶段：镜像模式失败，全面断网

修改 `C:\Users\<用户>\.wslconfig`：

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

`wsl --shutdown` 后重启 WSL，报错：

```
wsl: 出现了内部错误。
错误代码: CreateInstance/CreateVm/ConfigureNetworking/0x8007054f
wsl: 无法配置网络 (networkingMode Mirrored)，回退到 networkingMode None。
```

**关键陷阱**：WSL 没有回退到 NAT，而是回退到 **None 模式**（完全无网络）。

```bash
peanut@Snow:~$ ip a
1: lo: <LOOPBACK,UP,LOWER_UP> ...                # 只剩回环
peanut@Snow:~$ ip route
                                                  # 空
```

`0x8007054f` 是 ERROR_INTERNAL_ERROR，Hyper-V 网络初始化失败。后来怀疑跟 VMware/Docker/其他 Hyper-V 配置冲突有关，但当时没深究。

### 第三阶段：回退到 NAT，仍然不通

把 `.wslconfig` 简化：

```ini
[wsl2]
networkingMode=NAT
```

`wsl --shutdown` 后重启，eth0 终于回来了：

```bash
peanut@Snow:~$ ip a
2: eth0: ... inet 172.28.46.118/20 ...
peanut@Snow:~$ ip route
default via 172.28.32.1 dev eth0 proto kernel
```

但 ping 不通网关：

```bash
peanut@Snow:~$ ping 172.28.32.1
From 172.28.46.118 icmp_seq=1 Destination Host Unreachable
```

`Destination Host Unreachable` 来自 WSL 自己，说明包根本送不到主机。

### 第四阶段：怀疑 Clash TUN 排除网段

打开 Mihomo Party 的 TUN 设置（**虚拟网卡模式**），看到："排除自定义网段"里有：

```
172.16.0.0/12
192.168.0.0/16
10.0.0.0/8
```

**问题来了**：`172.16.0.0/12` 包含了 WSL2 的 `172.28.0.0/20` 网段！这意味着：

- Windows 路由被 Clash TUN 全局接管
- 但 Clash TUN 又把 WSL 网段**排除**了
- 结果：WSL 流量既不走原路由、也不被 Clash 接管 → 死循环

**修复**：把 `172.16.0.0/12` 从排除列表删除，只保留 `192.168.0.0/16` 和 `10.0.0.0/8`。

Clash DNS 配置同时保持默认（fake-ip 模式、监听 `0.0.0.0:53`、`dns-hijack: ['any:53']`），这部分本身没问题。

```
TUN 模式堆栈      : System
虚拟网卡名称      : Mihomo
自动设置全局路由  : 开
DNS 劫持         : any:53
排除自定义网段    : 192.168.0.0/16, 10.0.0.0/8   ← 已删除 172.16.0.0/12
```

```
DNS 监听地址 : 0.0.0.0:53
增强模式     : fake-ip
Fake IP 范围 : 198.18.0.1/16
```

**但还是 ping 不通**。继续深挖。

### 第五阶段：网卡被禁用（自己挖的坑）

排查过程中我执行过 `Disable-NetAdapter`，但配套的 `Enable-NetAdapter -Confirm:$false` 因为 PowerShell 多行语法被分成两条命令执行，启用失败了。

> **PowerShell 坑**：跨行命令需要用反引号 `` ` `` 续行，或者直接写成一行。bash 用户容易踩这个坑。

检查所有网卡状态：

```powershell
Get-NetAdapter -IncludeHidden | Format-Table Name,Status,InterfaceDescription -AutoSize
```

输出关键行：

```
vEthernet (WSL (Hyper-V firewall))    Disabled    Hyper-V Virtual Ethernet Adapter #2
```

**网卡是 Disabled 状态**！主机侧的虚拟网卡都没启用，WSL 当然 ping 不到网关。

启用它：

```powershell
Enable-NetAdapter -Name "vEthernet (WSL (Hyper-V firewall))" -Confirm:$false
```

验证：

```powershell
Get-NetIPAddress -InterfaceAlias "vEthernet (WSL (Hyper-V firewall))" -AddressFamily IPv4 | Format-Table IPAddress,InterfaceAlias

IPAddress   InterfaceAlias
---------   --------------
172.28.32.1 vEthernet (WSL (Hyper-V firewall))
```

IP 出来了。但 WSL 内 `ping 172.28.32.1` —— **还是 Destination Host Unreachable**。

### 第六阶段：怀疑 Hyper-V 防火墙（错误方向）

新版 Windows 11 引入了 **Hyper-V 虚拟机防火墙**。网卡名带着 `(Hyper-V firewall)` 不是巧合。

```powershell
Get-NetFirewallHyperVProfile | Format-Table Name,Enabled,DefaultInboundAction,DefaultOutboundAction

Name                                   Enabled         DefaultInboundAction
----                                   -------         --------------------
{40E0AC32-46A5-438A-A0B2-2B479E8F2E90} NotConfigured   Allow
```

`Enabled = NotConfigured` + `DefaultInboundAction = Allow` → Hyper-V 防火墙**没启用**，**排除**这个嫌疑。

新版 PowerShell 也不支持传统的 `Set-NetFirewallHyperVProfile -Name Public,Private,Domain` 写法了（会报 No MSFT_NetFirewallHyperVProfile objects found），新模型用的是 VMCreatorId GUID。

### 第七阶段：检查网卡绑定 —— 找到真凶

ARP 状态显示：

```bash
peanut@Snow:~$ ip neigh show
172.28.32.1 dev eth0 FAILED

peanut@Snow:~$ arp -an
? (172.28.32.1) at <incomplete> on eth0
```

**ARP 解析失败**！WSL 发出 ARP 请求查询网关 MAC，**没有响应回来**。ARP 是 L2 协议，虚拟交换机内部应该秒回，包被某个东西拦截了。

检查 vEthernet (WSL) 网卡上绑定的所有驱动：

```powershell
Get-NetAdapterBinding -Name "vEthernet (WSL (Hyper-V firewall))" | Where-Object {$_.Enabled -eq $true} | Format-Table ComponentID,DisplayName -AutoSize
```

输出里有这一行非常醒目：

```
hrndis6   Huorong NDIS Filter Driver
```

**火绒的 NDIS 过滤驱动绑定在 WSL 网卡上**！立刻去翻火绒日志。

### 第八阶段：火绒 ARP 防护是元凶

打开火绒 **ARP 防火墙 → 日志记录**：

![火绒 ARP 拦截日志](/images/a-wsl/03-huorong-arp-logs.png)

日志清清楚楚：

- 大量 "**对外 ARP 攻击拦截**" 条目
- IP 地址 `172.28.32.1`（就是 WSL 网关）
- MAC 前缀 `00:15:5D:xx:xx:xx`（**Hyper-V 虚拟网卡固定 OUI**）
- 处理结果：**已拦截**

**真相大白**：火绒把 Hyper-V 虚拟交换机发出的 ARP 响应误判为"对外 ARP 攻击"，把整个 WSL 的二层连通性给阻断了。

打开火绒 ARP 防护界面：

![火绒 ARP 防护设置](/images/a-wsl/04-huorong-arp-protection.png)

火绒在"对外 ARP 攻击拦截"开关旁边自己挂了个提示：

> **开启时可能会影响桥接模式的虚拟机或模拟器的网络**

等于官方确认这个开关与虚拟机网络不兼容。

### 第九阶段：修复 + 验证

**关闭"对外 ARP 攻击拦截"**（保留另外两个开关）：

| 选项                  | 作用                          | 处理                |
| --------------------- | ----------------------------- | ------------------- |
| ARP 攻击防御          | 防止**别人**对你做 ARP 欺骗   | ✅ 保留             |
| **对外 ARP 攻击拦截** | 防止**你的电脑**发出 ARP 攻击 | ❌ **关闭**（元凶） |
| IP 冲突拦截           | 检测 IP 冲突                  | ✅ 保留             |

关闭后 `wsl --shutdown` 重启 WSL，发现 WSL 自动重新分配了新网段：

```
wsl: 无法创建地址范围为"172.28.32.0/20"的虚拟网络，已创建具有以下范围的新网络:"172.20.144.0/20"
wsl: 无法创建地址为"172.28.46.118"的网络端点，已分配新地址:"172.20.151.103"
```

立即验证：

```bash
peanut@Snow:~$ ip neigh show
172.20.144.1 dev eth0 lladdr 00:15:5d:be:6f:4a REACHABLE   ✅ ARP 通了

peanut@Snow:~$ ping 8.8.8.8
64 bytes from 8.8.8.8: icmp_seq=1 ttl=106 time=178 ms       ✅ 外网通

peanut@Snow:~$ ping baidu.com
PING baidu.com (198.18.0.42) 56(84) bytes of data.
64 bytes from 198.18.0.42: icmp_seq=1 ttl=62 time=0.239 ms  ✅ Clash fake-ip 工作

peanut@Snow:~$ curl -I https://www.google.com
HTTP/2 200                                                  ✅ 代理穿透成功
```

**网络完全恢复。**

> ⚠️ **后续补充（重要）**：这次我只做了「关掉 ARP 拦截 + `wsl --shutdown`」就恢复了，但后来多次复现发现**这一步并不可靠**。
>
> Clash TUN 接管过全局路由之后，Hyper-V 的宿主网络服务（HNS）里会残留脏状态——虚拟交换机的路由与端点信息不会随 WSL 关闭而重建。所以经常出现「TUN 也关了、WSL 也重启了，但网络依然不通」的情况，让人误以为是别的问题。
>
> 可靠的做法是把 Hyper-V 网络服务一起重启，见下文《故障恢复的完整步骤》。

> ⚠️ 注意：新网段 `172.20.144.0/20` 仍然在 `172.16.0.0/12` 范围内，所以 Clash TUN 排除网段中**移除 `172.16.0.0/12` 的修改必须保留**。

---

## 关于 ping 网关不通

完成后还有一个小现象：`ping 172.20.144.1` 不通，但 ARP REACHABLE、其他流量全通。

```bash
peanut@Snow:~$ ping 172.20.144.1
11 packets transmitted, 0 received, 100% packet loss
peanut@Snow:~$ ip neigh show
172.20.144.1 dev eth0 lladdr 00:15:5d:be:6f:4a REACHABLE
```

这是 **Windows 主机防火墙默认拒绝来自 Hyper-V 虚拟网卡的 ICMP Echo 请求**，纯粹是 ICMP 响应被禁，**不影响 TCP/UDP 流量**。

类比：很多公网服务器（Google、AWS）也不响应 ping，但完全不影响访问。**ARP 通 + 路由通 = 网络通**，ping 网关失败可以忽略。

强迫症修复（可选）：

```powershell
New-NetFirewallRule -DisplayName "Allow ICMPv4 from WSL" `
  -Direction Inbound -Protocol ICMPv4 `
  -InterfaceAlias "vEthernet (WSL (Hyper-V firewall))" -Action Allow
```

---

## 最终配置清单

### 1. 火绒安全

- 打开 **ARP 防火墙**
- **关闭"对外 ARP 攻击拦截"开关**
- 保留 "ARP 攻击防御" 和 "IP 冲突拦截"

### 2. Clash（Mihomo Party）

- TUN 排除自定义网段：**仅保留** `192.168.0.0/16` 和 `10.0.0.0/8`
  - **绝对不要加回 `172.16.0.0/12`**（会覆盖 WSL 网段）
- DNS 配置保持默认：fake-ip 模式、监听 `0.0.0.0:53`、劫持 `any:53`
- 建议**关闭"设置系统代理"开关**（TUN 模式不需要，否则 WSL 启动会报 localhost 代理警告）

### 3. WSL `.wslconfig`

- 路径：`C:\Users\<用户>\.wslconfig`
- 内容：

```ini
[wsl2]
networkingMode=NAT
```

> 不要用 `mirrored` 模式（本机存在 VMware/Docker/Hyper-V 多虚拟化环境会冲突，错误码 `0x8007054f`）。

### 4. Windows 系统设置

- **关闭系统代理**：`Win + I` → 网络和 Internet → 代理 → 关闭"使用代理服务器"

---

## 故障恢复的完整步骤

如果你已经踩进「WSL 断网」这个坑，**只关掉 TUN 再重启 WSL 往往是不够的**。

原因前面提过：Clash TUN 接管全局路由后，Hyper-V 的宿主网络服务会残留脏状态，虚拟交换机的路由与端点不会随 `wsl --shutdown` 重建。必须把 Hyper-V 的网络服务一并重启，网络栈才会真正回到干净状态。

按顺序执行：

**第一步，先断开代理对网络栈的接管**

1. 关闭 Clash 的 **TUN / 虚拟网卡模式**
2. **完全退出 Clash**（托盘退出，不是只关窗口——进程还在就仍然占着路由）

**第二步，以管理员身份打开 PowerShell，依次执行**

```powershell
wsl --shutdown          # 先关掉 WSL，释放它对虚拟网络的占用
net stop hns            # 停止 主机网络服务(Host Network Service)
net start hns           # 重新启动，重建虚拟交换机状态
Restart-Service vmms    # 重启 Hyper-V 虚拟机管理服务
```

> 这四条必须**按顺序**执行。`wsl --shutdown` 放在最前面，是因为 WSL 运行时会占用 HNS，不先关掉的话 `net stop hns` 可能失败或让服务停在异常状态。

**第三步，重新进入 WSL**

```bash
wsl
```

进去之后网络就恢复了。验证一下：

```bash
ip neigh show        # 网关应为 REACHABLE，不是 FAILED
ping 8.8.8.8         # 外网 IP 通
ping baidu.com       # DNS 解析通
```

**几个容易踩的点**

- 必须是**管理员权限**的 PowerShell，否则 `net stop hns` 会直接报权限错误
- `net stop hns` 偶尔会因为有容器/虚拟机正在使用而失败，此时先把 Docker Desktop、VMware 等一并退出再试
- 重启 HNS 后 WSL 的 IP 网段**大概率会变**（我这次就从 `172.28.x` 变成了 `172.20.x`），这是正常现象；只要 Clash TUN 的排除网段里没有 `172.16.0.0/12`，新网段照样能用
- 如果你只是想临时用一下 WSL，不想每次都折腾，那就别开 TUN——这套流程是给「已经断网了要救回来」用的

---

## 排查思路与诊断命令汇总

### WSL 内（Linux）

```bash
ip a                 # 查看网卡和 IP
ip route             # 查看路由表
ip neigh show        # 查看 ARP 邻居表（关键诊断！）
arp -an              # 同上（旧风格）
ping <网关>          # 测 L2/L3 连通
ping 8.8.8.8         # 测外网 IP
ping baidu.com       # 测 DNS + 代理
curl -I https://www.google.com  # 测 HTTPS + 代理
cat /etc/resolv.conf # 查看 DNS 配置
```

### Windows PowerShell（管理员）

```powershell
# 网卡状态
Get-NetAdapter -IncludeHidden | Format-Table Name,Status,InterfaceDescription -AutoSize

# 启用/禁用网卡
Enable-NetAdapter -Name "vEthernet (WSL (Hyper-V firewall))" -Confirm:$false
Disable-NetAdapter -Name "<名字>" -Confirm:$false

# IP 地址
Get-NetIPAddress -AddressFamily IPv4 | Format-Table IPAddress,InterfaceAlias

# 网卡上绑定的所有协议/驱动（找拦截元凶用！）
Get-NetAdapterBinding -Name "<网卡名>" | Where-Object {$_.Enabled -eq $true} | Format-Table ComponentID,DisplayName

# Hyper-V 虚拟交换机
Get-VMSwitch | Format-Table Name,SwitchType,NetAdapterInterfaceDescription

# Hyper-V 防火墙状态
Get-NetFirewallHyperVProfile | Format-Table Name,Enabled,DefaultInboundAction,DefaultOutboundAction

# WSL 重启（只重启 WSL，不会重建 Hyper-V 网络栈）
wsl --shutdown

# 完整重建 Hyper-V 网络栈 —— TUN 断网后的救命组合，需管理员权限
# 并且要先关闭 clash 的 tun 模式，再退出之后，进行下面操作
wsl --shutdown
net stop hns
net start hns
Restart-Service vmms
```

---

## 复盘：踩坑链总结

| #   | 误判/失误                            | 实际后果                                        |
| --- | ------------------------------------ | ----------------------------------------------- |
| 1   | 看到 DNS 不通就以为是 DNS 问题       | 没意识到 IP 层也可能受影响                      |
| 2   | 直接上 mirrored 模式想一步到位       | 触发 `0x8007054f`，WSL 回退到 None 模式彻底断网 |
| 3   | 误以为 mirrored 失败会回退到 NAT     | 实际回退到 None（没网络）                       |
| 4   | Clash TUN 排除网段含 `172.16.0.0/12` | 屏蔽了 WSL 整个网段，流量出不去                 |
| 5   | 手动 `Disable-NetAdapter` 后启用失败 | PowerShell 多行命令换行符问题，没注意           |
| 6   | 怀疑 Hyper-V 防火墙是元凶            | 实际是 NotConfigured，方向错误                  |
| 7   | 忽略火绒的影响                       | 真正的元凶藏在网卡绑定列表里                    |

---

## 关键经验

1. **`Destination Host Unreachable` 来自本机 = ARP 失败 / 包出不去网卡**，第一时间查 `ip neigh show` 和 `Get-NetAdapterBinding`。

2. **网卡绑定列表是排查"无形拦截"的金矿**。各种 NDIS 过滤驱动（安全软件、抓包工具、虚拟网络）都会出现在这里，挨个排查。

3. **国产安全软件的 ARP 防护是 Hyper-V/WSL/虚拟机的常见杀手**。火绒、360、腾讯电脑管家等都有类似机制。出问题先检查它们的"网络保护"或"ARP 防火墙"。

4. **mirrored 模式不是银弹**。它要求干净的 Hyper-V 环境，存在 VMware、Docker、其他 Hyper-V 虚拟交换机时容易冲突。**NAT 模式 + Clash TUN 排除网段配置正确**已经足够好用。

5. **PowerShell 跨行命令必须用反引号** `` ` ``，否则会被拆成多条独立命令执行。

6. **WSL 的 IP 网段可能在重启后变化**（如本案例 `172.28.0.0/20` → `172.20.144.0/20`），但都在 `172.16.0.0/12` 范围内，所以 Clash TUN 排除网段配置具有稳定性。

7. **ping 网关不通 ≠ 网络不通**。判断网络可用性应该看 ARP 表、路由表、TCP 流量，而不是单纯的 ICMP 响应。

8. **关掉 TUN 不等于网络会自己好**。Clash TUN 接管过全局路由后，Hyper-V 的宿主网络服务（HNS）会残留脏状态，`wsl --shutdown` 只重启 WSL、不重建虚拟交换机。必须 `net stop hns` → `net start hns` → `Restart-Service vmms` 把网络栈整个重建。这是最容易让人误判的一环——以为「我明明已经关掉代理了」，于是把方向引向别处。

---

## 后记

整个排查过程从"WSL DNS 不通"开始，中途经历了"彻底断网"的灾难，最终定位到火绒。

回头看，**最快的捷径是第七阶段就执行 `Get-NetAdapterBinding`** 检查网卡绑定，那一刻 `Huorong NDIS Filter Driver` 就在眼前。但因为前面被 Clash 配置、`mirrored` 模式、网卡禁用等问题分散了注意力，直到 ARP FAILED 才回到这条路。

希望这份记录能帮到同样环境的朋友 —— **WSL2 + Clash TUN + 火绒** 这个组合，火绒 ARP 防护是绕不开的坑。
**本来我只关了 ARP 就能用了，但是我担心后续其他影响索性把三个全关了**

最后补一句后来才摸清的事：**排查这类问题时，「先关掉代理试试」这一步本身就不可靠**。TUN 模式下 HNS 残留的脏状态不会随着代理退出而清除，必须走完《故障恢复的完整步骤》里那四条命令，才能真正判断"网络到底还有没有问题"。我当时要是知道这点，第二到第六阶段绕的那些弯路能省掉一大半。
