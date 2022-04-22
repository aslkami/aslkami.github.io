---
title: 网络
order: 8
---

## `配置IP地址`

- ifconfig, 查看与配置网络状态
- DNS 配置文件

```shell
# cat /etc/resolv.conf
nameserver 8.8.8.8  DNS服务器
search localhost
nameserver 8.8.8.8
```

## `查看网络环境`

### `查询网络状态`

- netstat 选项

| 选项 | 含义                                       |
| :--- | :----------------------------------------- |
| -t   | 列出 TCP 协议端口                          |
| -u   | 列出 UDP 协议端口                          |
| -n   | 不使用域名与服务名，而使用 IP 地址和端口号 |
| -l   | 仅列出在监听状态网络服务                   |
| -a   | 列出所有的网络连接                         |

```shell
netstat -tlun
netstat -an | more
netstat -unt | grep  ESTABLISHED
```

## `网络测试命令`

### `ping`

- ping [选项] ip 或域名
- 测试指定 IP 或域名的网络状况
- 选项
  - -c 次数指定 ping 包的次数

```shell
ping www.baidu.com -c 3
```

### `wget`

- 下载命令

```shell
wget http://www.baidu.com
```

## `域名解析命令`

- nslookup [主机名或 IP]
- 进行域名与 IP 地址解析
- 查看本机的 DNS 服务器

```shell
# nslookup www.baidu.com
Server:        192.171.207.1
Address:    192.171.207.1#53

Name:    www.baidu.com
Address: 61.135.169.125
```

查看当前的 DNS 服务器

```shell
[root@192-171-207-101-static ~]# nslookup
> server
Default server: 192.171.207.1
Address: 192.171.207.1#53
```

## `远程登录`

### `SSH协议原理`

`1. 对称加密算法`

- 采用单密钥系统的加密方法，同一个密钥可以同时用作信息的加密和解密，这种加密被称为对称加密。
- 非对称加密算法 需要公钥和私钥

`2. SSH 安全外壳协议`

- ssh 用户名@ip
- 远程管理指定 Linux 服务器

```shell
[root@192-171-207-101-static ~]# ssh root@192.171.207.101
The authenticity of host '192.171.207.101 (192.171.207.101)' can't be established.
RSA key fingerprint is a4:97:52:eb:0a:0b:35:a0:98:7d:4f:c8:3b:dc:f9:0a.
Are you sure you want to continue connecting (yes/no)? yes
Warning: Permanently added '192.171.207.101' (RSA) to the list of known hosts.
```

/root/.ssh/known_hosts

```shell
192.171.207.101 ssh-rsa AAAAB3NzaC1yc2EAAAABIwAAAQEAomDpQxV3RmjJyKkf7elMTInbdm+/ZLnFpfbAryi5PSb2ewfYbwRaBcVl1lBta6yjFuz0J12p9qy90DBhadvoBsfwTB8lQhmlT8B2eCcHr0bfLa1IdKMcjImxRJiD4v0emCGFquHnHIr41vs8uxQ2Ek28mH/1JC0e/+VPEvylBB4+Kk2789ACdAlmhGTtlu7zgeUoLaWQSl1/6g7zfSLIz+/U8qGiRSPaGT+M40oqx/PZdoGOMTRhHgNIR5qgvcNaJXhlZGYT42fLFSmtzUHJ030hP7JGZ99oXS20/mnc8qvonC9itp0+K/nCj5g6uR/gPFb5B0NmTZCM2/gcLkHumw==
```

`3. scp`

- scp 是 secure copy 的缩写, scp 是 linux 系统下基于 ssh 登陆进行安全的远程文件拷贝命令
- linux 的 scp 命令可以在 linux 服务器之间复制文件和目录
- 命令格式 scp [参数] [原路径] [目标路径]

| 参数 | 含义             |
| :--- | :--------------- |
| -r   | 递归复制整个目录 |
| -v   | 详细方式显示输出 |

- 从本地服务器复制到远程服务器

```shell
scp local_file remote_username@remote_ip:remote_folder
scp -r local_folder remote_username@remote_ip:remote_folder
```

- 从远程服务器复制到本地服务器

```shell
scp  remote_username@remote_ip:remote_folder  local_file
scp -r  remote_username@remote_ip:remote_folder local_folder
```

## `网络连接`

- VMWare 提供了三种工作模式，它们是 bridged(桥接模式)、NAT(网络地址转换模式)和 host-only(主机模式)

### `bridged(桥接模式)`

- 在这种模式下，VMWare 虚拟出来的操作系统就像是局域网中的一台独立的主机，它可以访问网内任何一台机器。
- 在桥接模式下，你需要手工为虚拟系统配置 IP 地址、子网掩码，而且还要和宿主机器处于同一网段，这样虚拟系统才能和宿主机器进行通信
- 如果你想利用 VMWare 在局域网内新建一个虚拟服务器，为局域网用户提供网络服务，就应该选择桥接模式
- bridged 模式下的 VMnet0 虚拟网络不提供 DHCP 服务
- vmnet0，实际上就是一个虚拟的网桥，这个网桥有若干个端口，一个端口用于连接你的 Host，一个端口用于连接你的虚拟机，他们的位置是对等的，谁也不是谁的网关

![桥接](/images/linux/bridge.jpeg)

### `host-only(主机模式)`

- 所有的虚拟系统是可以相互通信的，但虚拟系统和真实的网络是被隔离开的
- 虚拟系统和宿主机器系统是可以相互通信的
- 虚拟系统的 TCP/IP 配置信息(如 IP 地址、网关地址、DNS 服务器等)，都是由 VMnet1(host-only)虚拟网络的 DHCP 服务器来动态分配的,IP 地址是随机生成的

![主机模式](/images/linux/hostonly.gif)

### `NAT(网络地址转换模式)`

- 使用 NAT 模式，就是让虚拟系统借助 NAT(网络地址转换)功能，通过宿主机器所在的网络来访问公网
- 使用 NAT 模式可以实现在虚拟系统里访问互联网。NAT 模式下的虚拟系统的 TCP/IP 配置信息是由 VMnet8(NAT)虚拟网络的 DHCP 服务器提供的，无法进行手工修改
- 使用 Vmnet8 虚拟交换机，此时虚拟机可以通过主机单向访问网络上的其他工作站，其他工作站不能访问虚拟机

![nat](/images/linux/nat.jpeg)

## `搭建FTP服务器`

### `查询是否安装了vsftpd服务`

```shell
rpm -q vsftpd
```

### `安装vsftpd`

```shell
yum install -y vsftpd
```

### `修改vsftpd配置文件`

- vi /etc/vsftpd/vsftpd.conf 修改 vsftpd 配置文件

```shell
anonymous_enable=NO  是否允许匿名用户登录
local_enable=YES 允许本地用户登录
Write_enable=YES     是否可以写入
chroot_local_user=YES #是否将所有用户限制在主目录,YES为启用 NO禁用
chroot_list_enable=YES #是否启动限制用户的名单
chroot_list_file=/etc/vsftpd/chroot_list  #是否限制在主目录下的用户名单
```

### `设置用户可以访问home文件夹`

```shell
getsebool -a|grep ftp  #查看selinux配置
setsebool -P ftp_home_dir 1 #更改设置(-P 是开机自动使用，无需每次开机都输入该命令)
service vsftpd restart 重启vsftpd

vi /etc/selinux/config
SELINUX=disabled
```

### `启动服务`

```shell
chmod -R 777 /home/zhangsan2
chkconfig vsftpd on
service iptables stop
service vsftpd restart
```

### `创建用户`

```shell
adduser lisi
passwd zhaoliu 设置密码 zhaoliu
```

### `CMD中的FTP命令`

| 命令                        | 含义                                                               |
| :-------------------------- | :----------------------------------------------------------------- |
| ftp 192.168.1.3             | 登陆 ftp                                                           |
| dir                         | 显示远程主机目录                                                   |
| help[cmd]                   | 显示 ftp 内部命令 cmd 的帮助信息                                   |
| get remote-file[local-file] | 将远程主机的文件 remote-file 传至本地硬盘的 local-file(本地文件夹) |
| put local-file[remote-file] | 将本地文件 local-file 传送至远程主机                               |
| quit                        | 同 bye,退出 ftp 会话                                               |
