---
title: WSL2 端口转发完整指南
description: WSL2 里跑起 dev server 本机能开、同事却访问不到？讲透 NAT 网络拓扑、portproxy 方案、防火墙放行与开机自动化脚本。
date: 2026-05-27
category: devops
tags: [wsl2, network, port-forwarding, guide, troubleshooting]
---

> 在 WSL2 里跑 `npm run serve`，本机 `localhost:25011` 能开，但同事用你的局域网 IP 怎么也访问不到？这篇文档把整个网络拓扑、所有方案、所有踩坑、一键脚本和开机自动化全部讲透。

## 一、问题描述

典型场景：

1. 你在 WSL2 Ubuntu 里跑了一个 Vue/React/Node 的 dev server（端口 25011）
2. 本机 Chrome 打开 `http://localhost:25011/` 能加载页面 ✅
3. 让同事访问 `http://192.168.1.99:25011/`（你的 Windows LAN IP）—— **连接不上** ❌

**期望**：像 VMware 桥接模式那样，给虚拟机一个 192.168.x.x 的局域网 IP，物理机和虚拟机平级，局域网其他机器直接访问。

**现实**：WSL2 不是这么设计的，需要做端口转发。

---

## 二、网络拓扑 —— 为什么默认访问不到

```
                  +-------------------------+
                  |  局域网（路由器/交换机） |
                  +-----------+-------------+
                              |
                              |  192.168.1.0/24
                              |
                  +-----------+-------------+
                  |  Windows 主机           |
                  |  以太网: 192.168.1.99   |
                  |                         |
                  |  vEthernet (WSL):       |
                  |  172.20.144.1           |   ← Hyper-V 内部 NAT 网关
                  |       |                 |
                  |       | NAT             |
                  |       v                 |
                  |  WSL2: 172.20.151.103   |
                  |  (Ubuntu 容器)          |
                  +-------------------------+

  局域网 ──> Windows (192.168.1.99) ──[NAT]──> WSL (172.20.151.103)
                  ↑                                    ↑
              实体 LAN IP                          内部 NAT IP

  ❌ 局域网 → Windows IP → WSL：默认不转发
  ✅ Windows本机 → localhost → WSL：localhostForwarding 自动转发
```

**关键认知**：

- WSL2 是 Hyper-V 内部的"轻量虚拟机"，跑在隔离的 NAT 子网（如 `172.20.0.0/16`）
- 外部世界看不到这个网段
- WSL 出网时，包经过 Windows NAT 转出（`172.20.144.1` 是网关）
- **入站要从 Windows 主动转发到 WSL**，否则到达不了

`localhostForwarding=true` 这个设置只让 **Windows 本机** 的 `localhost:port` 自动转给 WSL，**不会主动暴露给局域网**。

---

## 三、三种方案对比

| 方案 | 等效 VMware 模式 | 优点 | 缺点 | 推荐度 |
|------|---------------|------|------|--------|
| **A. Bridged（桥接）** | Bridged | WSL 拿 192.168.x.x，跟物理机平级 | 多虚拟化环境必然冲突，配置复杂 | ❌ |
| **B. Mirrored（镜像）** | NAT 自动同步 | 端口自动同步，最优雅 | VMware/Docker 共存时报 `0x8007054f` | ⚠️ 看环境 |
| **C. NAT + 批量 portproxy** | NAT + 手动端口映射 | 稳、可控、对其他虚拟化无影响 | 需要预先配端口段 | ✅ |

### 为什么选方案 C（portproxy）

**Bridged 模式**虽然听起来很美好（WSL 拿到 192.168.x.x），但要在 Hyper-V 管理器创建"外部虚拟交换机"，它会**接管你的物理网卡**，跟 VMware Workstation 的 NAT/桥接虚拟网卡严重冲突，可能导致整机网络抽风。

**Mirrored 模式**：

```ini
[wsl2]
networkingMode=mirrored
dnsTunneling=true
firewall=true
autoProxy=true
```

它让 WSL **共用 Windows 网络栈**，WSL 监听 `0.0.0.0:8080` = Windows 监听 `0.0.0.0:8080`，局域网直接访问 Windows IP 即可。**理论上是终极方案**。

但是！**多虚拟化环境（VMware Workstation + Hyper-V + Docker Desktop）**必然报错：

```
wsl: 出现了内部错误。
错误代码: CreateInstance/CreateVm/ConfigureNetworking/0x8007054f
wsl: 无法配置网络 (networkingMode Mirrored)，回退到 networkingMode None。
```

更糟的是 **WSL 不会回退到 NAT**，而是回退到 **None 模式（完全无网络）**。

**所以只剩方案 C：NAT + 批量 portproxy**。下面详细讲。

---

## 四、方案 C 完整实施

### 4.1 让 WSL 内的服务监听 `0.0.0.0`（最容易遗漏的一步）

如果你的服务只监听 `127.0.0.1` 或 `localhost`，**它只接受 WSL 内部连接**，Windows 都转发不进去，更别提局域网。

**Vue CLI（vue.config.js）**：

```js
module.exports = {
  devServer: {
    host: '0.0.0.0',           // ← 关键
    port: 25011,
    allowedHosts: 'all',       // 允许任意 Host 头访问（局域网 IP 访问时需要）
    client: {
      webSocketURL: 'auto://0.0.0.0:0/ws',  // HMR WebSocket 自适应
    },
  }
}
```

**Vite（vite.config.js）**：

```js
export default {
  server: {
    host: '0.0.0.0',
    port: 25011,
    strictPort: true,    // 端口被占就报错，不自动找下一个
  }
}
```

**Node/Express**：

```js
app.listen(25011, '0.0.0.0', ...)   // 别写 'localhost' 或 '127.0.0.1'
```

**验证 WSL 内监听情况**：

```bash
ss -tlnp | grep 25011
# 预期：LISTEN  0  511  0.0.0.0:25011  0.0.0.0:*  users:(("node",pid=...))
#                       ↑ 必须是 0.0.0.0，不能是 127.0.0.1
```

### 4.2 端口段规划

**铁律：选 Windows 不会用的高位端口段**。

Windows 端常见预留端口（**别给 WSL 用**）：

| 端口 | 用途 |
|------|------|
| 80, 443 | IIS / 系统 Web |
| 135, 139, 445 | Windows 网络共享 |
| 1433, 1434 | SQL Server |
| 3306 | MySQL |
| 3389 | RDP（**绝对不能动**） |
| 5432 | PostgreSQL |
| 5900-5910 | VNC |
| 6379 | Redis |
| 7890, 7891, 9090 | Clash |
| 8081 | Nexus（很多公司私服） |
| 49152-65535 | Windows 动态端口范围 |

**推荐策略：用 2xxxx 高位端口**（24011-26064 这种），跟 Windows 系统服务完全不打架。

我自己的端口约定示例：

| 服务类型 | 端口段 |
|---------|--------|
| 前端 dev server | 24011-24064 |
| 后端 API | 25011-25064 |
| 备用 | 26011-26064 |

**写到团队 README**，避免冲突。

### 4.3 查看哪些端口已经被 Windows 占用

```powershell
# 管理员 PowerShell
Get-NetTCPConnection -State Listen |
  Select-Object LocalPort, OwningProcess,
    @{N='Process';E={(Get-Process -Id $_.OwningProcess -ErrorAction SilentlyContinue).Name}} |
  Sort-Object LocalPort | Format-Table -AutoSize
```

输出会显示所有 Windows 上正在监听的端口和对应进程，**用来确认你选的端口段没被占用**。

---

## 五、批量端口转发脚本（完整版）

### 5.1 脚本本体

保存为 **`C:\Users\<你的用户名>\scripts\wsl-port-forward-batch.ps1`**。

**重要：文件必须是 UTF-8 with BOM 编码**，否则 Windows PowerShell 5.x 会按 GBK 解读，中文崩、语法崩。

用记事本/VS Code 保存时选 "UTF-8 with BOM"。

```powershell
# WSL2 batch port-forward script (run as Administrator)
# Forwards specified port ranges from Windows to WSL so LAN peers can access WSL services
# Ports already bound by Windows processes are automatically skipped

# ---------- Configuration ----------
$portRanges = @(
    @{ Start = 24011; End = 24064 },
    @{ Start = 25011; End = 25064 },
    @{ Start = 26011; End = 26064 }
)
# -----------------------------------

function Test-PortInUse {
    param([int]$Port)
    $conn = Get-NetTCPConnection -State Listen -LocalPort $Port -ErrorAction SilentlyContinue
    if ($conn) {
        foreach ($c in $conn) {
            $proc = Get-Process -Id $c.OwningProcess -ErrorAction SilentlyContinue
            # portproxy 自己是 svchost 跑的，不算冲突
            if ($proc -and $proc.Name -ne 'svchost') {
                return $true
            }
        }
    }
    return $false
}

# 获取 WSL IP
$wslIP = (wsl hostname -I).Trim().Split()[0]
if (-not $wslIP) {
    Write-Error "WSL not running. Start WSL first (e.g. open Ubuntu terminal)."
    exit 1
}
Write-Host "WSL IP: $wslIP" -ForegroundColor Green

$skipped = @()
$added = @()

foreach ($range in $portRanges) {
    for ($port = $range.Start; $port -le $range.End; $port++) {
        # 先清掉旧规则
        netsh interface portproxy delete v4tov4 listenport=$port listenaddress=0.0.0.0 2>$null | Out-Null

        # 检查端口是否被 Windows 进程占用
        if (Test-PortInUse -Port $port) {
            $conn = Get-NetTCPConnection -State Listen -LocalPort $port -ErrorAction SilentlyContinue | Select-Object -First 1
            $procName = (Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue).Name
            $skipped += "$port ($procName)"
            continue
        }

        netsh interface portproxy add v4tov4 listenport=$port listenaddress=0.0.0.0 connectport=$port connectaddress=$wslIP | Out-Null
        $added += $port
    }

    # 防火墙规则按段添加
    $ruleName = "WSL2 Range $($range.Start)-$($range.End)"
    Remove-NetFirewallRule -DisplayName $ruleName -ErrorAction SilentlyContinue
    New-NetFirewallRule -DisplayName $ruleName -Direction Inbound -Protocol TCP -LocalPort "$($range.Start)-$($range.End)" -Action Allow | Out-Null
}

Write-Host ""
Write-Host "Added portproxy for $($added.Count) ports to WSL ($wslIP)" -ForegroundColor Green
if ($skipped.Count -gt 0) {
    Write-Host "Skipped ports already used by Windows:" -ForegroundColor Yellow
    $skipped | ForEach-Object { Write-Host "  - $_" -ForegroundColor Yellow }
}

Write-Host ""
Write-Host "Windows LAN IPs (use these to access from other machines):" -ForegroundColor Cyan
Get-NetIPAddress -AddressFamily IPv4 -PrefixOrigin Dhcp, Manual -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike "169.254.*" -and $_.IPAddress -ne "127.0.0.1" } |
    Select-Object IPAddress, InterfaceAlias |
    Format-Table -AutoSize
```

### 5.2 脚本关键设计

| 设计 | 原因 |
|------|------|
| 检测端口占用，跳过 Windows 已用端口 | 避免抢占 Windows 服务 |
| 防火墙规则按"段"加一条，而不是每端口一条 | 防火墙列表干净 |
| `Test-PortInUse` 排除 svchost 进程 | portproxy 自己是 svchost，不算冲突 |
| 最后打印 Windows LAN IPs | 方便告诉同事访问地址 |

### 5.3 用 PowerShell 写入正确编码的方法

如果用代码生成脚本文件，避免编码问题：

```powershell
$content = @'
脚本内容...
'@

# Write with UTF-8 BOM
$utf8Bom = New-Object System.Text.UTF8Encoding $true
[System.IO.File]::WriteAllText("C:\Users\<用户名>\scripts\wsl-port-forward-batch.ps1", $content, $utf8Bom)

# 验证 BOM
$bytes = [System.IO.File]::ReadAllBytes("C:\Users\<用户名>\scripts\wsl-port-forward-batch.ps1")
Write-Host "First 3 bytes: $($bytes[0..2] -join ',')"
# 期望输出: 239,187,191 (= UTF-8 BOM)
```

### 5.4 执行

**必须管理员权限**（New-NetFirewallRule、netsh portproxy 都需要）：

```powershell
# 启动管理员 PowerShell（搜索 powershell → 右键 → 以管理员身份运行）
powershell -ExecutionPolicy Bypass -File "C:\Users\<用户名>\scripts\wsl-port-forward-batch.ps1"
```

预期输出：

```
WSL IP: 172.20.151.103

Added portproxy for 162 ports to WSL (172.20.151.103)

Windows LAN IPs (use these to access from other machines):

IPAddress      InterfaceAlias
---------      --------------
192.168.1.99   以太网
192.168.3.69   WLAN
```

---

## 六、验证 + 测试

### 6.1 看 portproxy 规则

```powershell
netsh interface portproxy show all
```

应该看到所有 24011-26064 的规则。

### 6.2 看 Windows 实际监听情况（关键）

```powershell
Get-NetTCPConnection -State Listen |
  Where-Object { $_.LocalPort -ge 24011 -and $_.LocalPort -le 26064 } |
  Select-Object LocalAddress, LocalPort, OwningProcess |
  Format-Table -AutoSize
```

**必须看到大量 `0.0.0.0:24011`、`0.0.0.0:25011` ... 的监听项**，OwningProcess 是 svchost。

如果输出为空 —— 即使 portproxy 规则在，但 Windows 端没真正监听，**就是踩坑了**。看第七节排查。

### 6.3 三层测试

```bash
# WSL 内（验证服务本身）
curl http://localhost:25011/
curl http://0.0.0.0:25011/

ip addr show eth0 | grep "inet "   # 拿到 WSL IP
```

```powershell
# Windows 内
# A) 直连 WSL IP（绕过 portproxy）
curl http://172.20.151.103:25011/

# B) 走 localhostForwarding
curl http://localhost:25011/
curl http://127.0.0.1:25011/

# 注意：Windows 自己访问自己的 LAN IP 走 loopback 优化，结果不代表局域网体验，别用这个测
```

```bash
# 局域网另一台机器 / 手机（关键测试）
curl http://192.168.1.99:25011/    # 用 Windows 的 LAN IP
```

---

## 七、踩坑排查

### 7.1 浏览器报 `ERR_CONNECTION_REFUSED`

**REFUSED ≠ TIMED_OUT**：

- **REFUSED**：TCP 包到了 Windows，但端口没在监听 → portproxy 没真正工作
- **TIMED_OUT**：包都到不了 Windows → 防火墙拦截 / 网络不通

REFUSED 几乎肯定是：**portproxy 规则注册了，但 Windows 端实际没在监听**。

#### 诊断

```powershell
# 看 25011 端口的 Windows 监听情况
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -eq 25011 }
```

如果输出为空 → portproxy 失效，按下面修复。

#### 修复：重置 IP Helper + 重新建规则

```powershell
# 管理员 PowerShell
netsh interface portproxy reset                # 清空所有 portproxy
Restart-Service iphlpsvc -Force                # 重启 IP Helper
powershell -ExecutionPolicy Bypass -File "C:\Users\<用户名>\scripts\wsl-port-forward-batch.ps1"
Restart-Service iphlpsvc -Force                # 再重启一次让规则生效

# 验证
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 24011 -and $_.LocalPort -le 26064 } | Format-Table -AutoSize
```

#### 修复进阶：重启 WinNAT（如果上面无效）

```powershell
net stop hns      # Host Network Service
net stop winnat   # Windows NAT Driver
netsh interface portproxy reset
net start winnat
net start hns
# 重新跑脚本
```

> ⚠️ **winnat 经常停不下来**（被 Hyper-V/hns 依赖），停止失败也别慌，**直接重启电脑**是终极方案。重启后第一时间跑脚本，winnat 干净的初始状态下 portproxy 几乎一定能工作。

### 7.2 Hyper-V 动态端口排除范围

WSL2 / Docker Desktop 装好后，Hyper-V 会保留一批 TCP 端口作为自己的动态端口池。这些端口 `netsh portproxy` 加规则不报错，但实际监听失败。

#### 查看排除范围

```powershell
netsh interface ipv4 show excludedportrange protocol=tcp
```

输出示例：

```
开始端口    结束端口
----------    --------
        80          80
      5357        5357
     10620       10719
     ...
     24719       24818     ← 这种段是动态保留的
     25209       25308
     ...
     50000       50059  *
```

#### 如果你选的端口段撞上排除范围

**方案 1**：换端口段（最简单）

```powershell
$portRanges = @(
    @{ Start = 52011; End = 52064 },    # 50000+ 几乎肯定空闲
    @{ Start = 53011; End = 53064 }
)
```

WSL 内 dev server 端口跟着改。

**方案 2**：把 Hyper-V 动态端口起点挪开

```powershell
# 让 Hyper-V 的动态端口范围改到 50000 起，留出低位段
netsh int ipv4 set dynamic tcp start=50000 num=15000

# 重启网络服务
net stop hns
net stop winnat
net start winnat
net start hns
```

### 7.3 PowerShell 中文注释报错

**症状**：

```
所在位置 C:\Users\...\xxx.ps1:23 字符: 1
+ }
+ ~
表达式或语句中包含意外的标记"}"。
```

**原因**：脚本是 UTF-8 无 BOM，Windows PowerShell 5.x 按 GBK 解读中文，字节流被打乱，解析崩。

**修复方法 1**：用 UTF-8 with BOM 保存

- VS Code：右下角点编码 → "UTF-8 with BOM" → 重新保存
- 记事本：另存为时下拉"编码" → UTF-8（自动带 BOM）

**修复方法 2**：用 PowerShell 7 跑

```powershell
# 装 PowerShell 7
winget install Microsoft.PowerShell

# 跑（注意是 pwsh 不是 powershell）
pwsh -ExecutionPolicy Bypass -File "..."
```

PowerShell 7+ 默认 UTF-8 解码，永久解决。

**修复方法 3**：注释全英文，避开编码问题

### 7.4 同事访问 TIMED_OUT 而不是 REFUSED

如果同事访问超时（不是拒绝），通常是：

1. **Windows 防火墙拦了入站**：脚本应该加了防火墙规则，但有可能被组策略覆盖
2. **火绒 / 360 等安全软件的应用规则拦了入站连接**：临时关一下试试
3. **路由器隔离**：公司网络可能开了"客户端隔离"，同一 WiFi 下的设备互不可见

#### 排查命令（在 Windows 上）

```powershell
# 看防火墙规则有没有
Get-NetFirewallRule -DisplayName "WSL2 Range*" | Format-Table DisplayName, Enabled, Direction

# 临时关 Windows 防火墙试试（小心！测试完恢复）
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled False
# 测完恢复
Set-NetFirewallProfile -Profile Domain,Public,Private -Enabled True
```

### 7.5 WSL IP 变化导致 portproxy 失效

`wsl --shutdown` 或重启 Windows 后，WSL 的 IP 可能从 `172.20.151.103` 变成 `172.20.x.x` 其他值。原 portproxy 规则指向旧 IP，全部失效。

**症状**：之前能访问，重启后突然 REFUSED。

**修复**：重跑脚本（脚本会自动获取新 IP 并重建规则）。

**最优**：用任务计划程序开机自动跑（见下一节）。

### 7.6 Windows 本机用 localhost 访问 portproxy 端口不通

```powershell
curl http://localhost:25011/     # ❌ Failed to connect
curl http://172.20.151.103:25011/  # ✅ OK
```

**这是 Windows + WSL2 已知 quirk**，**不影响局域网访问**。

原因：Windows 的 loopback 接口有内核优化，访问 `localhost:25011` 不走 portproxy 链路，而是直接查 127.0.0.1 上的实际监听 —— portproxy 不在 127.0.0.1 上挂监听 socket，所以失败。

**不用管这个**，你的目标是局域网访问，不是 localhost。

如果你想用 localhost 也能访问：

```ini
# .wslconfig
[wsl2]
networkingMode=NAT
localhostForwarding=true    ← 显式开启
```

`wsl --shutdown` 重启 WSL 即可（这是 Windows 自己劫持 localhost 流量转给 WSL 的机制，跟 portproxy 是两条独立路径）。

### 7.7 复制粘贴 PowerShell 命令报错

**症状**：

```
ParserError:
Line | 1 | $wslIP = (wsl hostname -I).Trim().Split()[0] Write-Host "WSL IP: $wsl …
     | Unexpected token 'Write-Host'
```

**原因**：复制时把多行挤成一行，PowerShell 不像 bash 自动识别分隔。

**修复**：用 `;` 分隔或真换行：

```powershell
# ❌ 错
$wslIP = (wsl hostname -I).Trim().Split()[0] Write-Host "WSL IP: $wslIP"

# ✅ 用分号
$wslIP = (wsl hostname -I).Trim().Split()[0]; Write-Host "WSL IP: $wslIP"

# ✅ 或真换行（最稳）
$wslIP = (wsl hostname -I).Trim().Split()[0]
Write-Host "WSL IP: $wslIP"
```

---

## 八、开机自动运行（任务计划程序）

每次重启都手动跑脚本太烦。用任务计划程序自动化。

### 8.1 一键注册任务

**管理员 PowerShell** 跑一次即可：

```powershell
$scriptPath = "C:\Users\<你的用户名>\scripts\wsl-port-forward-batch.ps1"

$action = New-ScheduledTaskAction `
    -Execute "powershell.exe" `
    -Argument "-ExecutionPolicy Bypass -WindowStyle Hidden -File `"$scriptPath`""

$trigger = New-ScheduledTaskTrigger -AtLogOn -User "$env:USERDOMAIN\$env:USERNAME"
$trigger.Delay = "PT30S"   # 登录后延迟 30 秒再跑，等 WSL 起来

$principal = New-ScheduledTaskPrincipal `
    -UserId "$env:USERDOMAIN\$env:USERNAME" `
    -LogonType Interactive `
    -RunLevel Highest          # 用管理员权限跑

$settings = New-ScheduledTaskSettingsSet `
    -AllowStartIfOnBatteries `
    -DontStopIfGoingOnBatteries `
    -StartWhenAvailable `
    -ExecutionTimeLimit (New-TimeSpan -Minutes 5)

Register-ScheduledTask `
    -TaskName "WSL Port Forward" `
    -Action $action `
    -Trigger $trigger `
    -Principal $principal `
    -Settings $settings `
    -Description "Auto-configure WSL2 portproxy rules on login" `
    -Force
```

### 8.2 验证

```powershell
# 查看任务
Get-ScheduledTask -TaskName "WSL Port Forward"

# 立即手动触发一次
Start-ScheduledTask -TaskName "WSL Port Forward"

# 等 10 秒看结果
Start-Sleep 10
Get-ScheduledTaskInfo -TaskName "WSL Port Forward" | Select-Object LastRunTime, LastTaskResult
# LastTaskResult: 0 = 成功
```

`LastTaskResult` 常见值：

| 数值 | 含义 |
|------|------|
| 0 | 成功 |
| 267011 | 任务从未运行 |
| 1 | 脚本里有错误 |
| 2147942402 | WSL 没启动（增加 Delay） |

### 8.3 关键设计点

| 设置 | 作用 |
|------|------|
| `-AtLogOn` | 用户登录时触发（不是开机时，因为开机时 WSL 还没起来） |
| `Delay PT30S` | 等 WSL 启动完毕，避免拿不到 IP |
| `RunLevel Highest` | 自动以管理员权限运行，不弹 UAC |
| `WindowStyle Hidden` | 不弹黑窗口，后台静默执行 |
| `ExecutionTimeLimit 5min` | 超时保护，万一卡住自动结束 |
| `-Force` | 已存在同名任务会覆盖 |

### 8.4 调整 / 删除

```powershell
# 调整延迟
$task = Get-ScheduledTask -TaskName "WSL Port Forward"
$task.Triggers[0].Delay = "PT60S"
$task | Set-ScheduledTask

# 删除
Unregister-ScheduledTask -TaskName "WSL Port Forward" -Confirm:$false
```

---

## 九、完整工作流（每次新项目）

1. **服务端**：dev server `host: '0.0.0.0'`，端口选 24011-26064 之一
2. **客户端**：
   - 本机：`http://localhost:25011/`
   - 局域网：`http://<Windows的LAN IP>:25011/`
3. **不需要任何手动操作** —— 开机时任务计划自动跑脚本

新项目零配置，**端口段一次定好用一辈子**。

---

## 十、附录：诊断命令速查

### Windows 侧

```powershell
# 看 portproxy 规则
netsh interface portproxy show all

# 看 Windows 监听情况
Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -ge 24011 -and $_.LocalPort -le 26064 } | Format-Table

# 看 Hyper-V 端口排除范围
netsh interface ipv4 show excludedportrange protocol=tcp

# 看防火墙规则
Get-NetFirewallRule -DisplayName "WSL2 Range*"

# 拿 WSL IP
wsl hostname -I

# 拿 Windows LAN IP
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like "192.168.*" -or $_.IPAddress -like "10.*" }

# IP Helper 服务状态
Get-Service iphlpsvc

# 清空所有 portproxy
netsh interface portproxy reset
```

### WSL 侧

```bash
# 看服务监听情况
ss -tlnp | grep 25011

# 拿 WSL IP
ip addr show eth0 | grep "inet "

# 测试本地服务
curl -v http://localhost:25011/
curl -v http://0.0.0.0:25011/
```

---

## 十一、其他相关方案（不推荐但记录一下）

### 11.1 WSL Bridged 模式

技术上可以实现"WSL 拿 192.168.x.x"：

```ini
[wsl2]
networkingMode=bridged
vmSwitch=WSLExternal       # 需要先在 Hyper-V 管理器手动建一个"外部"虚拟交换机
ipv6=true
```

**为什么不推荐**：
- 外部虚拟交换机会"接管"物理网卡，跟 VMware NAT/桥接虚拟网卡打架
- `0x8007054f` 复发风险高
- 火绒 ARP 防护可能再次干扰
- 公司交换机 DHCP Snooping / 端口隔离可能让 WSL 拿不到 IP
- DNS 和 Clash 配置都得重做

### 11.2 ssh 反向隧道

如果只是临时给某个同事看一下：

```bash
# WSL 内
ssh -R 0.0.0.0:25011:localhost:25011 user@some-public-server.com
```

但这是云端方案，跟"局域网访问"不同。

### 11.3 ngrok / frp / sish

云隧道服务，适合**公网展示**（让外部互联网访问你的 dev 环境），不适合**局域网内部访问**。

---

## 十二、结语

WSL2 网络的痛点根源是 **NAT 子网隔离**，但 Windows 没有提供像 VMware "桥接模式"那样的开箱即用方案（mirrored 又坑多）。所以**手动 portproxy 是务实之选**。

把这套配置一次做好：

- ✅ 项目端口固定 → 团队规范
- ✅ 批量转发脚本 → 一次配好整段
- ✅ 任务计划程序 → 开机自动跑
- ✅ 端口冲突自动跳过 → 不抢 Windows 服务

之后开发体验跟 Linux 物理机一致：写代码、起 dev server、丢给同事 URL，一气呵成。

如果你的环境跟我一样有 **Clash TUN + 火绒**，强烈建议同时看：[WSL2 + Clash TUN + 火绒的网络踩坑记录](/blog/wsl2-clash-huorong-troubleshooting)。

入门请看：[WSL2 初始使用与开发环境完整配置指南](/blog/wsl2-setup-guide)。
