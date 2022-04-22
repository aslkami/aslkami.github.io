---
title: 服务与包管理
order: 6
---

## `服务简介和分类`

### `运行级别`

`1. 运行级别分类`

| 运行级别 | 含义                                                                         |
| :------- | :--------------------------------------------------------------------------- |
| 0        | 关机                                                                         |
| 1        | 单用户,类似于 Window 的安全模式，主要用于系统修复                            |
| 2        | 不完全多用户，类似于字符界面，但不包含 NFS(Linux 和 Window 进行文件共享)服务 |
| 3        | 完整的命令行模式，就是标准的字符界面                                         |
| 4        | 系统保留未使用                                                               |
| 5        | 图形界面                                                                     |
| 6        | 重启                                                                         |

`2. 查看上一个级别和当前级别`

```shell
runLevel
# N 3
```

`3. 切换运行级别`

```shell
init 5
```

`4. 设置默认运行级别`

```shell
vi /etc/inittab
id:3:initdefault:
```

### `服务的分类`

- 系统开启的服务越少，服务器就会更加稳定和安全
- 服务安装方式不同，启动的方式也不同

`1. 服务管理的方式`

- RPM 包安装的服务,由软件包作者指定安装位置,独立的服务，绝大多数服务都是独立运行在内存中的，可以直接响应客户端的请求
- 源码包安装的服务，由我们用户决定安装位置

`2. 查看RPM包安装的服务`

```shell
chkconfig --list
```

`3. 查看源码包安装的服务`

- 查看自定义的安装位置，默认为/usr/local 下
- usr= Unix System Resource 系统资源

`4. 启动和自启动`

- 启动服务就是指让此服务在当前系统中运行，并向客户端提供服务
- 服务自启动就是指通过设置，让此服务在开机或者重启后随着系统启动而自动启动

### `服务与端口`

```shell
ps -aux # 查看系统中的运行中的进程
cat /etc/services # 查看常见服务端口
```

### `查询系统中监听的端口`

- netstat -tulnp

| 参数 | 含义                           |
| :--- | :----------------------------- |
| -t   | 列出 tcp 数据                  |
| -u   | 列出 udp 数据                  |
| -l   | 列出正在监听的网络服务         |
| -n   | 用端口号来显示服务，而非服务名 |
| -p   | 列出该服务的进程 ID            |

## `软件包管理`

- RPM 是 RedHat Package Manager（RedHat 软件包管理工具）类似 Windows 里面的"添加/删除程序"
- RPM 是 Red Hat 公司随 Redhat Linux 推出了一个软件包管理器，通过它能够更加轻松容易地实现软件的安装
- RPM 是 LINUX 下的一种软件的可执行程序，你只要安装它就可以了。这种软件安装包通常是一个 RPM 包（Redhat Linux Packet Manager，就是 Redhat 的包管理器），后缀是.rpm

### `软件包的分类`

- 源码包(需要经过编译，把人所编写的源代码编译成机器语言才能运行)

  - 优点
    - 开源免费
    - 可以自由配置功能
    - 编译安装更适合自己系统，更稳定
    - 卸载方便
  - 缺点
    - 安装过程比较复杂
    - 编译过程比较长
    - 安装过程一旦报错，非常难以排查

- 二进制包(把源代码包经过编译生成 0/1 二进制，PRM 包、系统默认的安装包)

  - 优点
    - 包管理系统比较简单，只要通过简单的命令就可以实现包的安装、升级、查询和卸载
    - 安装速度比源码包快很多
  - 缺点
    - 经过编译则不能看到源代码
    - 功能选择不灵活
    - 依赖性比较麻烦

- 脚本安装包(就是把复杂的安装过程写成了脚本，可以一键安装，本质上安装的还是源代码包和二进制包)
  - 优点是安装简单
  - 缺点是失去了自定义性

### `RPM 命令`

| 用途 | 命令 | 注释 |
| :-- | :-- | :-- |
| 安装软件 | 执行 rpm -ivh rpm 包名 | 其中 i 表示安装 install，v 表示显示安装过程 verbose，h 表示显示进度 |
| 升级软件 | 执行 rpm -Uvh rpm 包名 | U 表示升级 update |
| 反安装 | 执行 rpm -e rpm 包名 |  |
| 查询软件包的详细信息 | 执行 rpm -qpi rpm 包名 |  |
| 查询某个文件是属于那个 rpm 包的 | 执行 rpm -qf rpm 包名 |  |
| 查该软件包会向系统里面写入哪些文件 | 执行 rpm -qpl rpm 包名 |  |

### `repo`

- repo 文件是 yum 源（软件仓库）的配置文件，通常一个 repo 文件定义了一个或者多个软件仓库的细节内容，例如我们将从哪里下载需要安装或者升级的软件包，repo 文件中的设置内容将被 yum 读取和应用
- 服务器端：在服务器上面存放了所有的 RPM 软件包，然后以相关的功能去分析每个 RPM 文件的依赖性关系，将这些数据记录成文件存放在服务器的某特定目录内。
- 客户端：如果需要安装某个软件时，先下载服务器上面记录的依赖性关系文件(可通过 WWW 或 FTP 方式)，通过对服务器端下载的纪录数据进行分析，然后取得所有相关的软件，一次全部下载下来进行安装。

```shell
cat /etc/yum.conf
/etc/yum.repos.d
/etc/yum.repos.d/nginx.repo
```

### `RPM包的默认安装位置`

| 文件           | 含义                   |
| :------------- | :--------------------- |
| /etc           | 配置文件位置           |
| /etc/init.d    | 启动脚本位置           |
| /etc/sysconfig | 初始化环境配置文件位置 |
| /var/lib       | 服务产生的数据放在这里 |
| /var/log       | 日志                   |

### `启动命令`

| 服务名                   | 命令                      | 注释                |
| :----------------------- | :------------------------ | :------------------ |
| /etc/init.d/独立的服务名 | start stop status restart | Linux 通用命令      |
| service 独立的服务名     | start stop status restart | ReactHat 特有的命令 |

```shell
rpm -ivh http://nginx.org/packages/centos/6/noarch/RPMS/nginx-release-centos-6-0.el6.ngx.noarch.rpm
yum info nginx
yum install -y nginx
/etc/init.d/nginx start
netstat -ltun
service nginx status
curl http://localhost
```

### ` 防火墙`

| 操作           | 命令                     |
| :------------- | :----------------------- |
| 查询防火墙状态 | service iptables status  |
| 停止防火墙     | service iptables stop    |
| 启动防火墙     | service iptables start   |
| 重启防火墙     | service iptables restart |
| 永久关闭防火墙 | chkconfig iptables off   |
| 永久关闭后启用 | chkconfig iptables on    |
| 查看防火墙状态 | service iptables status  |

### `自启动服务`

`1. chkconfig`

- chkconfig --list
- chkconfig [--level 运行级别] [独立服务名] [on|off]

```shell
chkconfig --list | grep nginx
chkconfig --level 2345 nginx on
chkconfig nginx off
```

`2. ntsysv`

- Red Hat 公司遵循 GPL 规则所开发的程序，它具有互动式操作界面，您可以轻易地利用方向键和空格键等，开启，关闭操作系统在每个执行等级中，设置系统的各种服务。

`3. /etc/rc.d/rc.local`

- /etc/rc.d/rc.local 是系统启动之后把所有的服务都启动完在用户看到登录之前执行的命令
- /etc/rc.local

```shell
/etc/rc.d/rc.local
/etc/init.d/nginx start
```

## `YUM在线管理`

- yum = Yellow dog Updater, Modified 主要功能是更方便的添加/删除/更新 RPM 包.它能自动解决包的倚赖性问题.
- 这是 rpm 包的在线管理命令
- 将所有的软件名放到官方服务器上，当进行 YUM 在线安装时，可以自动解决依赖性问题
- /etc/yum.repos.d/
  - CentOS-Base.repo
  - epel.repo

## `YUM命令`

- yum 安装只需要写包名即可

| 命令                | 含义                                                       |
| :------------------ | :--------------------------------------------------------- |
| yum list            | 查询所有可用软件包列表                                     |
| yum search          | 关键字 搜索服务器上所有和关键字相关的包                    |
| yum -y install 包名 | -y 自动回答 yes install 安装                               |
| yum -y update 包名  | -y 自动回答 yes update 升级                                |
| yum -y remove 包名  | -y 自动回答 yes remove 卸载,卸载有依赖性，所以尽量不要卸载 |
| yum grouplist       | 列出所有可用的软件组列表                                   |
| yum groupinstall    | 软件组名 安装指定的组，组名可以用 grouplist 查询           |
| yum groupremove     | 软件组名 卸载指定软件组                                    |

```shell
yum -y install gcc  # 安装C语言安装包
```

## `源码包服务管理`

- 使用绝对路径，调用启动脚本来启动。
- 不同的源码包的启动脚本不一样
- 要通过阅读源码包安装说明的方式来查看启动的方法

### `安装nginx`

`1. root安装依赖`

```shell
yum install gcc gcc-c++ perl -y
```

`2. 下载源文件`

- PCRE
- [官网](http://www.pcre.org/)
- [FTP](ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/)
- [HTTP](https://sourceforge.net/projects/pcre/files/pcre/)

```shell
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.43.tar.gz
```

- zlib
- [官网](http://www.zlib.net/)
- [HTTP](http://prdownloads.sourceforge.net/libpng/zlib-1.2.11.tar.gz)

```shell
wget http://prdownloads.sourceforge.net/libpng/zlib-1.2.11.tar.gz
```

- openssl
- [官网](https://www.openssl.org/)

```shell
wget https://www.openssl.org/source/openssl-1.0.2n.tar.gz
```

- ngnix
- [官网](http://nginx.org/en/docs/configure.html)

```shell
wget http://nginx.org/download/nginx-1.10.1.tar.gz
```

`3. 解压文件`

```shell
tar -zxvf nginx-1.10.1.tar.gz
tar -zxvf openssl-1.0.2h.tar.gz
tar -zxvf pcre-8.43.tar.gz
tar -zxvf zlib-1.2.11.tar.gz
```

`4. 配置和安装`

```shell
cd nginx-1.10.1
./configure --prefix=/usr/local/nginx \
--pid-path=/usr/local/nginx/nginx.pid \
--error-log-path=/usr/local/nginx/error.log \
--http-log-path=/usr/local/nginx/access.log \
--with-http_ssl_module \
--with-mail --with-mail_ssl_module \
--with-stream --with-threads \
--user=comex --group=comexgroup \
--with-pcre=/root/package/pcre-8.43 \
--with-zlib=/root/package/zlib-1.2.11 \
--with-openssl=/root/package/openssl-1.0.2n
make && make install

sudo /home/www/nginx/sbin/nginx -t
nginx: [emerg] getpwnam("comex") failed
vi /home/www/nginx/conf/nginx.conf
user  www;
sudo /home/www/nginx/sbin/nginx
```

`5. 管理命令`

功能 命令启动 /usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf 从容停止 ps -ef grep nginx;kill -QUIT 2072 快速停止 ps -ef grep nginx;kill -TERM 2132; kill -INT 2132 强制停止 pkill -9 nginx 验证 nginx 配置文件是否正确 nginx -t 重启 Nginx 服务 nginx -s reload 查找当前 nginx 进程号 kill -HUP 进程号

`6. 自动启动`

```shell
vi /etc/rc.local
/home/www/nginx/sbin/nginx
```

`7. service`

- Nginx 启动、关闭、重新加载脚本
- 创建文件 etc/init.d/nginx

```shell
/etc/init.d/nginx start
service nginx start
```

```shell
#! /bin/bash
# chkconfig: 35 86 76
# description: nginx manager
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: starts the nginx web server

NAME=nginx
DAEMON=/usr/local/nginx/sbin/$NAME
CONFIGFILE=/usr/local/nginx/conf/$NAME.conf
PIDFILE=/usr/local/nginx/logs/$NAME.pid
SCRIPTNAME=/etc/init.d/$NAME

set -e
[ -x "$DAEMON" ] || exit 0

do_start() {
 $DAEMON -c $CONFIGFILE  || echo -n "nginx already running"
 pid=$(ps -ef | grep nginx | grep master | awk '{print $2}')
 echo $pid > "$PIDFILE"
}

do_stop() {
 kill -INT `cat $PIDFILE` || echo -n "nginx not running"
}

do_reload() {
 kill -HUP `cat $PIDFILE` || echo -n "nginx can't reload"
}

case "$1" in
 start)
 echo -n "Starting  $NAME"
 do_start
 echo "."
 ;;
 stop)
 echo -n "Stopping  $NAME"
 do_stop
 echo "."
 ;;
 reload|graceful)
 echo -n "Reloading  configuration"
 do_reload
 echo "."
 ;;
 restart)
 echo -n "Restarting  $NAME"
 do_stop
 do_start
 echo "."
 ;;
 *)
 echo "Usage: $SCRIPTNAME {start|stop|reload|restart}" >&2
 exit 3
 ;;
esac

exit 0
```

`8. chkconfig 和 ntsysv`

- 指定 nginx 脚本可以被 chkconfig 命令和 ntsysv 管理
- 添加 nginx, chkconfig --add nginx
- 配置脚本
  - /etc/init.d/nginx
  - /etc/rc3.d
  - chkconconfig 运行级别 启动顺序 关闭顺序

```shell
#! /bin/bash
# chkconfig: 35 86 76
# description: nginx manager
```
