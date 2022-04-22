---
title: Nginx 介绍
order: 1
---

## `nginx应用场景`

- 静态资源服务器
- 反向代理服务
- API 接口服务(Lua&Javascript)

![nginx2](/images/nginx/nginx2.jpeg)

## `nginx优势`

- 高并发高性能
- 可扩展性好
- 高可靠性
- 热布署
- 开源许可证

## `学习环境`

### `操作系统`

centos7 64 位 等

### `环境确认`

`1. 关闭防火墙`

| 功能           | 命令                                |
| :------------- | :---------------------------------- |
| 停止防火墙     | systemctl stop firewalld.service    |
| 永久关闭防火墙 | systemctl disable firewalld.service |

`2. 确认停用 selinux`

- 安全增强型 Linux（Security-Enhanced Linux）简称 SELinux，它是一个 Linux 内核模块，也是 Linux 的一个安全子系统。
- SELinux 主要作用就是最大限度地减小系统中服务进程可访问的资源（最小权限原则）。

| 功能     | 命令                                                        |
| :------- | :---------------------------------------------------------- |
| 检查状态 | getenforce                                                  |
| 检查状态 | /usr/sbin/sestatus -v                                       |
| 临时关闭 | setenforce 0                                                |
| 永久关闭 | /etc/selinux/config SELINUX=enforcing 改为 SELINUX=disabled |

`3. 安装依赖模块`

```shell
yum  -y install gcc gcc-c++ autoconf pcre pcre-devel make automake openssl openssl-devel
```

| 软件包 | 描述 |
| :-- | :-- |
| gcc | gcc 是指整个 gcc 的这一套工具集合，它分为 gcc 前端和 gcc 后端（我个人理解为 gcc 外壳和 gcc 引擎），gcc 前端对应各种特定语言（如 c++/go 等）的处理（对 c++/go 等特定语言进行对应的语法检查, 将 c++/go 等语言的代码转化为 c 代码等），gcc 后端对应把前端的 c 代码转为跟你的电脑硬件相关的汇编或机器码 |
| gcc-c++ | 而就软件程序包而言，gcc.rpm 就是那个 gcc 后端，而 gcc-c++.rpm 就是针对 c++这个特定语言的 gcc 前端 |
| autoconf | autoconf 是一个软件包，以适应多种 Unix 类系统的 shell 脚本的工具 |
| pcre | PCRE(Perl Compatible Regular Expressions)是一个 Perl 库，包括 perl 兼容的正则表达式库 |
| pcre-devel | devel 包主要是供开发用,包含头文件和链接库 |
| make | 常指一条计算机指令，是在安装有 GNU Make 的计算机上的可执行指令。该指令是读入一个名为 makefile 的文件，然后执行这个文件中指定的指令 |
| automake | automake 可以用来帮助我们自动地生成符合自由软件惯例的 Makefile |
| wget | wget 是一个从网络上自动下载文件的自由工具，支持通过 HTTP、HTTPS、FTP 三个最常见的 TCP/IP 协议 下载，并可以使用 HTTP 代理 |
| httpd-tools | apace 压力测试 |
| vim | Vim 是一个类似于 Vi 的著名的功能强大、高度可定制的文本编辑器 |

| 目录名   |                        |
| :------- | :--------------------- |
| app      | 存放代码和应用         |
| backup   | 存放备份的文件         |
| download | 下载下来的代码和安装包 |
| logs     | 放日志的               |
| work     | 工作目录               |

## `nginx的架构`

### `轻量`

- 源代码只包含核心模块
- 其它非核心功能都是通过模块实现，可以自由选择

### `架构`

- Nginx 采用的是多进程(单线程)和多路 IO 复用模型

`1. 工作流程`

1. Nginx 在启动后，会有一个 master 进程和多个相互独立的 worker 进程。
2. 接收来自外界的信号,向各 worker 进程发送信号,每个进程都有可能来处理这个连接。
3. master 进程能监控 worker 进程的运行状态，当 worker 进程退出后(异常情况下)，会自动启动新的 worker 进程。

![nginxcomplex](/images/nginx/nginxcomplex.png)

- worker 进程数，一般会设置成机器 cpu 核数。因为更多的 worker 数，只会导致进程相互竞争 cpu，从而带来不必要的上下文切换
- 使用多进程模式，不仅能提高并发率，而且进程之间相互独立，一个 worker 进程挂了不会影响到其他 worker 进程

`2. IO多路复用`

- 多个文件描述符的 IO 操作都能在一个线程里并发交替顺序完成，复用线程

![iomulti](/images/nginx/iomulti.jpeg)

`3. CPU亲和`

- 把 CPU 内核和 nginx 的工作进程绑定在一起，让每个 worker 进程固定在一个 CPU 上执行，从而减少 CPU 的切换并提高缓存命中率，提高 性能

`4. sendfile`

- sendfile 零拷贝传输模式, 就是不用拷贝到应用程序缓冲区， 直接 到 socket 缓冲区（网卡）

![sendfile](/images/nginx/sendfile.jpeg)
