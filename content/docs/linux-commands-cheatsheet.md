---
title: Linux 常用命令与权限管理速查
description: cp/mv/rm、目录导航、查找、压缩、网络等基础命令速查，以及 chmod/chown 的数字与符号写法、常用组合和 WSL 下的坑。
date: 2026-05-28
category: toolchain
tags: [linux, wsl2, cheatsheet]
---

# Linux 常用命令与权限管理速查

## 文件操作核心命令

### 复制 `cp`

```bash
cp file.txt ~/Desktop/          # 复制文件到目标目录
cp file.txt newfile.txt         # 复制并重命名
cp -r myfolder/ ~/Desktop/      # 复制整个目录（-r 递归）
cp -rp myfolder/ ~/backup/      # 复制并保留权限、时间戳
```

### 移动 / 重命名 `mv`

```bash
mv file.txt ~/Desktop/          # 移动文件
mv oldname.txt newname.txt      # 重命名文件 mv 原名称 新名称
mv myfolder/ ~/Desktop/         # 移动整个目录（不需要 -r）
```

### 删除 `rm`

```bash
rm file.txt                     # 删除文件
rm -r myfolder/                 # 删除目录及其内容
rm -rf myfolder/                # 强制删除，不提示（⚠️ 慎用）
```

> Linux 没有"粘贴"概念，`cp`/`mv` 就是复制+粘贴、剪切+粘贴。

## 目录导航

```bash
pwd                  # 显示当前所在路径
ls                   # 列出当前目录文件
ls -la               # 详细列表，包含隐藏文件
cd ~                 # 回到用户主目录
cd ..                # 返回上一级目录
cd /path/to/dir      # 进入指定目录
```

## 文件查看

```bash
cat file.txt         # 查看文件全部内容
less file.txt        # 分页查看（q 退出）
head -n 20 file.txt  # 查看前 20 行
tail -n 20 file.txt  # 查看后 20 行
tail -f log.txt      # 实时追踪文件内容（看日志常用）
```

## 文件创建与编辑

```bash
touch file.txt       # 创建空文件
mkdir myfolder       # 创建目录
mkdir -p a/b/c       # 递归创建多级目录
nano file.txt        # 简单编辑器（新手友好）
vim file.txt         # 强大编辑器（i 进入编辑，:wq 保存退出）
echo "内容" > file.txt   # 写入内容（会覆盖）
echo "内容" >> file.txt  # 追加内容（不覆盖）
```

## 查找文件

```bash
find . -name "*.txt"           # 在当前目录递归查找 txt 文件
find /home -name "file.txt"    # 在指定路径查找
locate filename                # 快速查找（需要数据库，更快）
which python3                  # 查找命令所在路径
```

## 系统信息

```bash
uname -a             # 查看系统内核信息
df -h                # 查看磁盘使用情况
du -sh myfolder/     # 查看目录占用大小
free -h              # 查看内存使用情况
top                  # 实时进程监控（q 退出）
htop                 # 更好看的 top（需安装）
```

## 权限管理：chmod 与 chown

两个核心命令：`chmod` 改权限，`chown` 改属主。需要管理员权限时在命令前加 `sudo`。

### chmod 改权限

**数字方式（最常用）**。权限是三组数字，分别对应属主 / 属组 / 其他人：

| 数字 | 权限 | 含义 |
| --- | --- | --- |
| 7 | `rwx` | 读+写+执行 |
| 6 | `rw-` | 读+写 |
| 5 | `r-x` | 读+执行 |
| 4 | `r--` | 只读 |
| 0 | `---` | 无权限 |

常用组合：

```bash
chmod 755 文件夹           # 属主全权限，其他人读+执行（目录常用）
chmod 644 文件             # 属主读写，其他人只读（普通文件常用）
chmod 700 文件夹           # 只有属主能访问（私密目录，如 ~/.ssh）
chmod 777 文件夹           # 所有人全权限（不推荐，仅临时调试用）
chmod 600 文件             # 只有属主能读写（密钥文件常用）
chmod -R 755 ~/myproject   # -R 递归，文件夹及内部所有文件
```

**符号方式（增量修改）**：

```bash
chmod +x script.sh   # 给所有人加执行权限
chmod u+x script.sh  # 只给属主加执行权限
chmod g-w file.txt   # 取消属组的写权限
chmod o=r file.txt   # 设置其他人为只读
chmod a+r file.txt   # all（所有人）加读权限
```

符号含义：`u` 属主 / `g` 属组 / `o` 其他人 / `a` 所有人；`+` 添加 / `-` 移除 / `=` 设置为。

### chown 改属主 / 属组

```bash
chown user file                        # 改属主
chown user:group file                  # 同时改属主和属组
chown -R user:group 文件夹             # 递归修改
sudo chown -R $USER:$USER ~/myproject  # 把目录所有权改给当前用户
```

### 查看当前权限

```bash
ls -l 文件      # 看单个文件
ls -la 文件夹   # 看文件夹内所有文件（含隐藏）
stat 文件       # 详细权限信息
```

`ls -l` 输出的解读：

```
drwxr-xr-x 3 user group 4096 Nov 27 10:00 myproject
│└┬┘└┬┘└┬┘   └┬─┘ └─┬─┘
│ │  │  │    属主   属组
│ │  │  └──── 其他人权限 r-x
│ │  └─────── 属组权限 r-x
│ └────────── 属主权限 rwx
└──────────── d 表示目录（- 文件、l 软链）
```

### 实操速查

| 场景 | 命令 |
| --- | --- |
| 让脚本可执行 | `chmod +x script.sh` |
| 标准代码目录 | `chmod -R 755 项目目录` |
| 私密配置目录 | `chmod 700 ~/.ssh` |
| 把目录归属当前用户 | `sudo chown -R $USER:$USER 目录` |
| SSH 私钥（必须 600） | `chmod 600 ~/.ssh/id_rsa` |

### 常见坑

- WSL 下 `/mnt/c`、`/mnt/f` 的 Windows 文件，`chmod` 改不了真实权限（DrvFs 文件系统限制），只会改 metadata 显示。
- 改权限前先 `ls -l` 看看现状，避免改错。
- `777` 慎用，等于完全开放，安全风险高。

## 压缩与解压

```bash
# tar.gz
tar -czvf archive.tar.gz myfolder/   # 压缩
tar -xzvf archive.tar.gz             # 解压

# zip
zip -r archive.zip myfolder/         # 压缩
unzip archive.zip                    # 解压
```

## 网络常用

```bash
ping google.com          # 测试网络连通性
curl https://example.com # 发起 HTTP 请求
wget https://example.com/file.zip  # 下载文件
ssh user@192.168.1.1     # 远程连接
```

## 实用小技巧

```bash
Ctrl + C        # 终止当前命令
Ctrl + Z        # 暂停当前命令
Ctrl + L        # 清屏（等同于 clear）
Tab             # 自动补全命令/路径
↑ / ↓          # 翻历史命令
history         # 查看命令历史
command --help  # 查看命令帮助
man command     # 查看命令完整手册
```

## 路径符号速记

| 符号 | 含义 |
| --- | --- |
| `~` | 当前用户主目录 `/home/username` |
| `.` | 当前目录 |
| `..` | 上一级目录 |
| `/` | 根目录 |
| `-` | 上一次所在目录（`cd -` 快速切换） |
