---
title: Nginx 基础
order: 2
---

## `nginx安装`

### `版本分类`

- Mainline version 开发版
- Stable version 稳定版
- Legacy versions 历史版本

### `下载地址`

[nginx](http://nginx.org/en/download.html) [linux_packages](http://nginx.org/en/linux_packages.html#stable)

### `CentOS下YUM安装`

- vi /etc/yum.repos.d/nginx.repo

```shell
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/centos/7/$basearch/
gpgcheck=0
enabled=1


yum install nginx -y # 安装nginx
nginx -v # 查看安装的版本
nginx -V # 查看编译时的参数
```

## `目录`

### `安装目录`

查看 nginx 安装的配置文件和目录

```shell
rpm -ql nginx
```

### `日志切割文件`

/etc/logrotate.d/nginx

- 对访问日志进行切割

```shell
/var/log/nginx/*.log {
daily
}

ls /var/log/nginx/*.log
/var/log/nginx/access.log  /var/log/nginx/error.log
```

### `主配置文件`

| 路径                           | 用途                     |
| :----------------------------- | :----------------------- |
| /etc/nginx/nginx.conf          | 核心配置文件             |
| /etc/nginx/conf.d/default.conf | 默认 http 服务器配置文件 |

### `守护进程管理`

- 用于配置系统守护进程管理器管理方式

```shell
systemctl restart nginx.service
```

### `nginx模块目录`

- nginx 安装的模块

| 路径               | 用途                     |
| :----------------- | :----------------------- |
| /etc/nginx/modules | 最基本的共享库和内核模块 |

- 目的是存放用于启动系统和执行 root 文件系统的命令的如/bin 和/sbin 的二进制文件的共享库，或者存放 32 位，或者 64 位(file 命令查看)| | /usr/lib64/nginx/modules |64 位共享库|

### `文档`

- nginx 的手册和帮助文件

| 路径                                  | 用途     |
| :------------------------------------ | :------- |
| /usr/share/doc/nginx-1.14.2           | 帮助文档 |
| /usr/share/doc/nginx-1.14.0/COPYRIGHT | 版权声明 |
| /usr/share/man/man8/nginx.8.gz        | 手册     |

### `缓存目录`

| 路径             | 用途             |
| :--------------- | :--------------- |
| /var/cache/nginx | nginx 的缓存目录 |

### `日志目录`

| 路径           | 用途             |
| :------------- | :--------------- |
| /var/log/nginx | nginx 的日志目录 |

### `可执行命令`

- nginx 服务的启动管理的可执行文件

| 路径                  | 用途               |
| :-------------------- | :----------------- |
| /usr/sbin/nginx       | 可执行命令         |
| /usr/sbin/nginx-debug | 调试执行可执行命令 |

## `编译参数`

### `安装目录和路径`

```shell
--prefix=/etc/nginx # 安装目录
--sbin-path=/usr/sbin/nginx # 可执行文件
--modules-path=/usr/lib64/nginx/modules # 安装模块
--conf-path=/etc/nginx/nginx.conf  # 配置文件路径
--error-log-path=/var/log/nginx/error.log  # 错误日志
--http-log-path=/var/log/nginx/access.log  # 访问日志
--pid-path=/var/run/nginx.pid # 进程ID
--lock-path=/var/run/nginx.lock # 加锁对象
```

### `指定用户`

- 设置 nginx 进程启动的用户和用户组

```shell
--user=nginx   # 指定用户
--group=nginx  # 指定用户组
```

## `配置文件`

- /etc/nginx/nginx.conf #主配置文件
- /etc/nginx/conf.d/\*.conf #包含 conf.d 目录下面的所有配置文件
- /etc/nginx/conf.d/default.conf

### `nginx配置语法`

```shell
# 使用#可以添加注释,使用$符号可以使用变量
# 配置文件由指令与指令块组成,指令块以{}将多条指令组织在一起
http {
# include语句允许把多个配置文件组合起来以提升可维护性
    include       mime.types;
# 每条指令以;(分号)结尾，指令与参数之间以空格分隔
    default_type  application/octet-stream;
    sendfile        on;
    keepalive_timeout  65;
    server {
        listen       80;
        server_name  localhost;
# 有些指令可以支持正则表达式
        location / {
            root   html;
            index  index.html index.htm;
        }
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }
    }
```

### `全局配置`

| 分类 | 配置项           | 作用                           |
| :--- | :--------------- | :----------------------------- |
| 全局 | user             | 设置 nginx 服务的系统使用用户  |
| 全局 | worker_processes | 工作进程数,一般和 CPU 数量相同 |
| 全局 | error_log        | nginx 的错误日志               |
| 全局 | pid              | nginx 服务启动时的 pid         |

### `事件配置`

| 分类 | 配置项 | 作用 |
| :-- | :-- | :-- |
| events | worker_connections | 每个进程允许的最大连接数 10000 |
| events | use | 指定使用哪种模型(select/poll/epoll),建议让 nginx 自动选择,linux 内核 2.6 以上一般能使用 epoll 可以提高性能 |

### `http配置`

- /etc/nginx/nginx.conf
- 一个 HTTP 下面可以配置多个 server

```shell
user  nginx;   设置nginx服务的系统使用用户
worker_processes  1;  工作进程数,一般和CPU数量相同

error_log  /var/log/nginx/error.log warn;   nginx的错误日志
pid        /var/run/nginx.pid;   nginx服务启动时的pid

events {
    worker_connections  1024;每个进程允许的最大连接数 10000
}

http {
    include       /etc/nginx/mime.types;//文件后缀和类型类型的对应关系
    default_type  application/octet-stream;//默认content-type

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';  //日志记录格式

    access_log  /var/log/nginx/access.log  main;//默认访问日志

    sendfile        on;//启用sendfile
    #tcp_nopush     on;//懒发送

    keepalive_timeout  65;//超时时间是65秒

    #gzip  on; # 启用gzip压缩

    include /etc/nginx/conf.d/*.conf;//包含的子配置文件
}
```

### `server`

- /etc/nginx/conf.d/default.conf
- 一个 server 下面可以配置多个 location

```shell
server {
    listen       80;  //监听的端口号
    server_name  localhost;  //用域名方式访问的地址

    #charset koi8-r; //编码
    #access_log  /var/log/nginx/host.access.log  main;//访问日志文件和名称

    location / {
        root   /usr/share/nginx/html;  //静态文件根目录
        index  index.html index.htm;  //首页的索引文件
    }

    #error_page  404              /404.html;  //指定错误页面

    # redirect server error pages to the static page /50x.html
    # 把后台错误重定向到静态的50x.html页面
    error_page   500 502 503 504  /50x.html;
    location = /50x.html {
        root   /usr/share/nginx/html;
    }
}
```

### `Systemd`

- 系统启动和服务器守护进程管理器，负责在系统启动或运行时，激活系统资源，服务器进程和其他进程，根据管理，字母 d 是守护进程（daemon）的缩写

`1. 配置目录`

| 配置目录 | 用途 |
| :-- | :-- |
| /usr/lib/systemd/system | 每个服务最主要的启动脚本设置，类似于之前的/etc/initd.d |
| /run/system/system | 系统执行过程中所产生的服务脚本，比上面的目录优先运行 |
| /etc/system/system | 管理员建立的执行脚本，类似于/etc/rc.d/rcN.d/Sxx 类的功能，比上面目录优先运行，在三者之中，此目录优先级最高 |

`2. systemctl`

- 监视和控制 systemd 的主要命令是 systemctl
- 该命令可用于查看系统状态和管理系统及服务

```shell
命令：systemctl  command name.service
启动：service name start –>systemctl start name.service
停止：service name stop –>systemctl stop name.service
重启：service name restart–>systemctl restart name.service
状态：service name status–>systemctl status name.service
```

### `启动和重新加载`

```shell
systemctl restart nginx.service
systemctl reload nginx.service
nginx -s reload
```

### `日志`

- curl -v http://localhost

`1. 日志类型`

- /var/log/nginx/access.log 访问日志
- /var/log/nginx/error.log 错误日志

`2. log_format`

| 类型    | 用法                                          |
| :------ | :-------------------------------------------- |
| 语法    | log_format name [escape=default[json] string] |
| 默认    | log_format combined " "                       |
| Context | http                                          |

- 内置变量

[ngx_http_log_module](http://nginx.org/en/docs/http/ngx_http_log_module.html) [log_format](http://nginx.org/en/docs/http/ngx_http_log_module.html#log_format)

| 名称             | 含义                     |
| :--------------- | :----------------------- |
| $remote_addr     | 客户端地址               |
| $remote_user     | 客户端用户名称           |
| $time_local      | 访问时间和时区           |
| $request         | 请求行                   |
| $status          | HTTP 请求状态            |
| $body_bytes_sent | 发送给客户端文件内容大小 |

- HTTP 请求变量
  - 注意要把-转成下划线,比如 User-Agent 对应于$http_user_agent

| 名称 | 含义 | 例子 |
| :-- | :-- | :-- |
| arg_PARAMETER | 请求参数 | $arg_name |
| http_HEADER | 请求头 | $http_referer $http_host $http_user_agent $http_x_forwarded_for(代理过程) |
| sent_http_HEADER | 响应头 | sent_http_cookie |

> IP1->IP2(代理)->IP3 会记录 IP 地址的代理过程,
>
> - http_x_forwarded_for=Client IP,Proxy(1) IP,Proxy(2) IP

`3, 示例`

```shell
 # 定义一种日志格式
 log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

 log_format  zfpx  '$arg_name $http_referer sent_http_date"';
 # 指定写入的文件名和日志格式
 access_log  /var/log/nginx/access.log  main;
```

```shell
tail -f /var/log/nginx/access.log

221.216.143.110 - - [09/Jun/2018:22:41:18 +0800] "GET / HTTP/1.1" 200 612 "-" "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36" "-"
```

## `nginx工作流`

### `配置块`

- 请求到来时先按域名找到 server 块
- 再按请求路径找到 location 块
- Context 是指本指令出现在哪个块内

```shell
main
http{
    upstream {}
    server {
        if(){}
        location{

        }
        location{
            location{

            }
        }
    }
    server{

    }
}
```

### `值指令继承规则`

- 值指令可以合并，动作类指令不可以合并
- 值指令是向上覆盖的，子配置不存在，可以使用父配置块的指令，如果子指令存在，会覆盖父配置块中的指令

```shell
server {
    listen 80;
    root /home/nginx/html;
    access_log logs/access.log main;
    location /image{
       access_log logs/access.log image;
    }
    location /video{
    }
}
```

### `server匹配`

- 精确匹配
- \*在前
- \*在后
- 按文件中的顺序匹配正则式域名
- default server

### `HTTP请求处理`

| 阶段           | 名称           | 对应模块                       |
| :------------- | :------------- | :----------------------------- |
| 读取请求后     | POST_READ      | realip                         |
| 重写           | SERVER_REWRITE | rewrite                        |
| 匹配 location  | FIND_CONFIG    | rewrite                        |
| 重写           | REWRITE        | rewrite                        |
| 重写后         | POST_REWRITE   |                                |
| 访问前限制     | PREACCESS      | limit_conn,limit_req           |
| 是否有权限访问 | ACCESS         | auth_basic,access,auth_request |
| 判断权限后     | POST_ACCESS    |                                |
| 响应前         | PRECONTENT     | try_files                      |
| 生成响应内容   | CONTENT        | index,autoindex,concat         |
| 打印日志       | LOG            | access_log                     |

![nginx_http_request_process](/images/nginx/nginx_http_request_process.jpeg)

上面的图片 访问控制之前，还有一个 匹配 location 的流程
