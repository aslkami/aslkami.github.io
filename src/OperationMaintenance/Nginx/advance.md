---
title: Nginx 进阶
order: 3
---

## `核心模块`

### `监控nginx客户端的状态`

`1. 模块名`

- --with-http_stub_status_module 监控 nginx 客户端的状态

`2. 语法`

```shell
Syntax: stub_status on/off;
Default: -
Context: server->location
```

`3. 实战`

/etc/nginx/conf.d/default.conf

```shell
server {
+    location /status{
+       stub_status  on;
+    }
```

```shell
systemctl reload nginx.service

http://192.171.207.104/status

Active connections: 2
server accepts handled requests
 3 3 10
Reading: 0 Writing: 1 Waiting: 1
```

| 参数     | 含义                                                             |
| :------- | :--------------------------------------------------------------- |
| Active   | connections 当前 nginx 正在处理的活动连接数                      |
| accepts  | 总共处理的连接数                                                 |
| handled  | 成功创建握手数                                                   |
| requests | 总共处理请求数                                                   |
| Reading  | 读取到客户端的 Header 信息数                                     |
| Writing  | 返回给客户端的 Header 信息数                                     |
| Waiting  | 开启 keep-alive 的情况下,这个值等于 active – (reading + writing) |

### `随机主页`

`1. 模块名`

- --with-http_random_index_module 在根目录里随机选择一个主页显示

`2. 语法`

```shell
Syntax: random_index on/off;
Default: off
Context: location
```

`3. 实战`

/etc/nginx/conf.d/default.conf

```shell
+    location / {
+       root /opt/app;
+       random_index on;
+    }
```

```shell
mkdir /opt/app
cd /opt/app
ls
echo red  > read.html
echo yellow  > yellow.html
echo blue  > blue.html
```

### `内容替换`

`1. 模块名`

- --with-http_sub_module 内容替换

`2. 语法`

- 文本替换

```shell
Syntax: sub_filter string replacement;
Default: --
Context: http,service,location
```

`3. 实战`

/etc/nginx/conf.d/default.conf

```shell
location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
+   sub_filter 'name' 'aslkami';
}
```

### `请求限制`

`1. 模块名`

- --with-limit_conn_module 连接频率限制
- --with-limit_req_module 请求频率限制
- 一次 TCP 请求至少产生一个 HTTP 请求
- SYN > SYN,ACK->ACK->REQUEST->RESPONSE->FIN->ACK->FIN->ACK

`2. ab`

- Apache 的 ab 命令模拟多线程并发请求，测试服务器负载压力，也可以测试 nginx、lighthttp、IIS 等其它 Web 服务器的压力
  - -n 总共的请求数
  - -c 并发的请求数

```shell
yum -y install httpd-tools
ab -n 40 -c 20 http://127.0.0.1/
```

`3. 连接限制`

- ngx_http_limit_conn_module 模块会在 NGX_HTTP_PREACCESS_PHASE 阶段生效
- 针对全部的 worker 生效，依赖 realip 模块获得到的真实 IP

语法

- limit_conn_zone 定义共享内存(大小)，以及 key 关键字

```shell
# 可以以IP为key zone为空间的名称 size为申请空间的大小
Syntax: limit_conn_zone key zone=name:size;
Default: --
Context: http(定义在server以外)
```

limit_conn

```shell
# zone名称 number限制的数量
Syntax: limit_conn  zone number;
Default: --
Context: http,server,location
```

```shell
Syntax: limit_conn_log_level  info|notice|warn|error;
Default: limit_conn_log_level error;
Context: http,server,location
```

```shell
Syntax: limit_conn_status  code;
Default: limit_conn_status 503;
Context: http,server,location
```

案例

- $binary_remote_addr 是二进制格式的，比较短

```shell
limit_conn_zone $binary_remote_addr zone=conn_zone:10m;
server {
  location /{
      limit_conn_status 500;
      limit_conn_status warn;
      limit_rate 50; //每秒最多返回50字节
      limit_conn conn_zone 1; //并发连接数最多是1
  }
}
```

- 表明以 ip 为 key，来限制每个 ip 访问文件时候，最多只能有 1 个在线，否则其余的都要返回不可用

`4. 请求限制`

- ngx_http_limit_req_module 模块是在 NGX_HTTP_PREACCESS_PHASE 阶段生效
- 生效算法是漏斗算法(Leaky Bucket) 把突出的流量限定为每秒恒定多少个请求
- Traffic Shaping 的核心理念是等待，Traffic Policing 的核心理念是丢弃
- limit_req 生效是在 limit_conn 之前的

语法

- limit_req_zone 定义共享内存，以及 key 和限制速度

```shell
# 可以以IP为key zone为空间的名称 size为申请空间的大小
Syntax: limit_req_zone key zone=name:size rate=rate;
Default: --
Context: http(定义在server以外)
```

limit_req 限制并发请求数

```shell
# zone名称 number限制的数量
Syntax: limit_req  zone=name [burst=number] [nodelay];
Default: --
Context: http,server,location
```

- burst 是 bucket 的数量，默认为 0
- nodelay 是对 burst 中的请求不再采用延迟处理的做法，而是立刻处理, (令牌桶算法)

案例

```shell
limit_req_zone $binary_remote_addr zone=req_zone:10m rate=1r/s;
server {
  location /{
      //缓存区队列burst=3个,不延期，即每秒最多可处理rate+burst个.同时处理rate个
      //limit_req zone=req_zone;
      limit_req zone=one burst=5 nodelay;
  }
}
```

- $binary_remote_addr 表示远程的 IP 地址
- zone=req_zone:10m 表示一个内存区域大小为 10m,并且设定了名称为 req_zone
- rate=1r/s 表示允许相同标识的客户端的访问频次，这里限制的是每秒 1 次，即每秒只处理一个请求
- zone=req_zone 表示这个参数对应的全局设置就是 req_zone 的那个内存区域
- burst 设置一个大小为 3 的缓冲区,当有大量请求（爆发）过来时，超过了访问频次限制的请求可以先放到这个缓冲区内等待，但是这个等待区里的位置只有 3 个，超过的请求会直接报 503 的错误然后返回。
- nodelay 如果设置，会在瞬时提供处理(burst + rate)个请求的能力，请求超过（burst + rate）的时候就会直接返回 503，永远不存在请求需要等待的情况,如果没有设置，则所有请求会依次等待排队

```shell
netstat -n | awk '/^tcp/ {++S[$NF]} END {for(a in S) print a, S[a]}'
```

### `访问控制`

- 基于 IP 的访问控制 -http_access_module
- 基于用户的信任登录 -http_auth_basic_module

`1. http_access_module`

```shell
Syntax: allow address|all;
Default: --
Context: http,server,location,limit_except
```

```shell
Syntax: deny address|CIDR|all;
Default: --
Context: http,server,location,limit_except
```

```shell
server {
+ location ~ ^/admin.html{
+      deny 192.171.207.100;
+      allow all;
+    }
}
```

## `静态资源Web服务`

### `静态和动态资源`

- 静态资源：一般客户端发送请求到 web 服务器，web 服务器从内存在取到相应的文件，返回给客户端，客户端解析并渲染显示出来。
- 动态资源：一般客户端请求的动态资源，先将请求交于 web 容器，web 容器连接数据库，数据库处理数据之后，将内容交给 web 服务器，web 服务器返回给客户端解析渲染处理。

| 类型       | 种类           |
| :--------- | :------------- |
| 浏览器渲染 | HTML、CSS、JS  |
| 图片       | JPEG、GIF、PNG |
| 视频       | FLV、MPEG      |
| 下载文件   | Word、Excel    |

### `CDN`

- CDN 的全称是 Content Delivery Network，即内容分发网络。
- CDN 系统能够实时地根据网络流量和各节点的连接、负载状况以及到用户的距离和响应时间等综合信息将用户的请求重新导向离用户最近的服务节点上。其目的是使用户可就近取得所需内容，解决 Internet 网络拥挤的状况，提高用户访问网站的响应速度。

![CDN](/images/nginx/cdn.jpeg)

### `配置语法`

`1. sendfile`

- 不经过用户内核发送文件

| 类型   | 种类                                |
| :----- | :---------------------------------- |
| 语法   | sendfile on / off                   |
| 默认   | sendfile off;                       |
| 上下文 | http,server,location,if in location |

`2. tcp_nopush`

- 在 sendfile 开启的情况下，合并多个数据包，提高网络包的传输效率

| 类型   | 种类                 |
| :----- | :------------------- |
| 语法   | tcp_nopush on / off  |
| 默认   | tcp_nopush off       |
| 上下文 | http,server,location |

`3. tcp_nodelay`

- 在 keepalive 连接下，提高网络包的传输实时性

| 类型   | 种类                 |
| :----- | :------------------- |
| 语法   | tcp_nodelay on / off |
| 默认   | tcp_nodelay on;      |
| 上下文 | http,server,location |

`4. gzip`

- 压缩文件可以节约带宽和提高网络传输效率

| 类型   | 种类                 |
| :----- | :------------------- |
| 语法   | gzip on / off        |
| 默认   | gzip off;            |
| 上下文 | http,server,location |

`5. gzip_comp_level`

- 压缩比率越高，文件被压缩的体积越小

| 类型   | 种类                  |
| :----- | :-------------------- |
| 语法   | gzip_comp_level level |
| 默认   | gzip_comp_level 1;    |
| 上下文 | http,server,location  |

`6. gzip_http_version`

- 压缩版本

| 类型   | 种类                      |
| :----- | :------------------------ |
| 语法   | gzip_http_version 1.0/1.1 |
| 默认   | gzip_http_version 1.1;    |
| 上下文 | http,server,location      |

`7. http_gzip-static_module`

- 先找磁盘上找同名的.gz 这个文件是否存在,节约 CPU 的压缩时间和性能损耗
- http_gzip_static_module 预计 gzip 模块
- http_gunzip_module 应用支持 gunzip 的压缩方式

| 类型   | 种类                 |
| :----- | :------------------- |
| 语法   | gzip_static on/off   |
| 默认   | gzip_static off;     |
| 上下文 | http,server,location |

`8. 案例`

```shell
echo color > color.html
gzip color.html
```

/etc/nginx/conf.d/default.conf

```shell
mkdir -p /data/www/images
mkdir -p /data/www/html
echo color > /data/www/html/color.html
gzip /data/www/html/color.html
mkdir -p /data/www/js
mkdir -p /data/www/css
mkdir -p /data/www/download
```

```shell
 location ~ .*\.(jpg|png|gif)$ {
        gzip off;#关闭压缩
        root /data/www/images;
    }

    location ~ .*\.(html|js|css)$ {
        gzip_static on; # 优先 找 xxx.gz 文件返回
        gzip on; #启用压缩， 启用了 发 压缩文件， 未启用发送返回 源文件
        gzip_min_length 1k;    #只压缩超过1K的文件
        gzip_http_version 1.1; #启用gzip压缩所需的HTTP最低版本
        gzip_comp_level 9;     #压缩级别，压缩比率越高文件被压缩的体积越小
        gzip_types  text/css application/javascript;#进行压缩的文件类型
        root /data/www/html;
    }

    location ~ ^/download {
        gzip_static on; #启用压缩
        tcp_nopush on;  # 不要着急发，攒一波再发
        root /data/www; # 注意此处目录是`/data/www`而不是`/data/www/download`
    }
```

## `浏览器缓存`

- 校验本地缓存是否过期

![cache control](/images/nginx/cachecontrol.png)

| 类型          | 种类                            |
| :------------ | :------------------------------ |
| 检验是否过期  | Expires、Cache-Control(max-age) |
| Etag          | Etag                            |
| Last-Modified | Last-Modified                   |

### `expires`

- 添加 Cache-Control、Expires 头

| 类型   | 种类                 |
| :----- | :------------------- |
| 语法   | expires time         |
| 默认   | expires off;         |
| 上下文 | http,server,location |

```shell
location ~ .*\.(jpg|png|gif)$ {
    expires 24h;
}
```

## `跨域`

- 跨域是指一个域下的文档或脚本试图去请求另一个域下的资源

| 类型   | 种类                  |
| :----- | :-------------------- |
| 语法   | add_header name value |
| 默认   | add_header --;        |
| 上下文 | http,server,location  |

```shell
mkdir -p /data/json
cd /data/json
vi user.json
{"name":"fate"}
```

```shell
location ~ .*\.json$ {
  add_header Access-Control-Allow-Origin http://127.0.0.1:8080;
  add_header Access-Control-Allow-Methods GET,POST,PUT,DELETE,OPTIONS;
  root /data/json;
}
```

index.html

```html
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<html>
  <head> </head>
  <body>
    <script>
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'http://115.29.148.6/user.json', true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log(xhr.responseText);
        }
      };
      xhr.send();
    </script>
  </body>
</html>
```

```shell
http-server
```

## `防盗链`

- 防止网站资源被盗用
- 保证信息安全
- 防止流量过量
- 需要区别哪些请求是非正常的用户请求
- 使用 http_refer 防盗链

| 类型   | 种类                                         |
| :----- | :------------------------------------------- |
| 语法   | valid_referers none、block、server_names、IP |
| 默认   | -                                            |
| 上下文 | server,location                              |

```shell
location ~ .*\.(jpg|png|gif)$ {
        expires 1h;
        gzip off;
        gzip_http_version 1.1;
        gzip_comp_level 3;
        gzip_types image/jpeg image/png image/gif;
        # none没有refer blocked非正式HTTP请求 特定IP
+       valid_referers none blocked 115.29.148.6;
+       if ($invalid_referer) { # 验证通过为0，不通过为1
+           return 403;
+       }
        root /data/images;
    }

```

```shell
-e, --referer       Referer URL (H)
curl -v -e "115.29.148.6" http://115.29.148.6/kf.jpg
curl -v -e "http://www.baidu.com" http://115.29.148.6/kf.jpg

```

## `代理服务`

### `配置`

| 类型   | 种类            |
| :----- | :-------------- |
| 语法   | proxy_pass URL  |
| 默认   | -               |
| 上下文 | server,location |

### `正向代理`

- 正向代理的对象是客户端,服务器端看不到真正的客户端
- 通过公司代理服务器上网

![正向代理](/images/nginx/positiveproxy.jpeg)

设置本地 host C:\Windows\System32\drivers\etc

```shell
115.29.148.6 www.fate.com
```

```shell
resolver 8.8.8.8; #谷歌的域名解析地址
location / {
    # $http_host 要访问的主机名 $request_uri请求路径
    proxy_pass http://$http_host$request_uri;
}
```

- 按 Win+R 系统热键打开运行窗口，输入 ipconfig /flushdns 命令后按回车，就可以清空电脑的 DNS 缓存

### `反向代理`

- 反向代理的对象的服务端,客户端看不到真正的服务端
- nginx 代理应用服务器

![反向代理](/images/nginx/fanproxy.jpeg)

```shell
location ~ ^/api {
  proxy_pass http://localhost:3000; proxy_redirect default; #重定向

  proxy_set_header Host $http_host;        #向后传递头信息
  proxy_set_header X-Real-IP $remote_addr; #把真实IP传给应用服务器

  proxy_connect_timeout 30; #默认超时时间
  proxy_send_timeout 60;    # 发送超时
  proxy_read_timeout 60;    # 读取超时


  proxy_buffering on;             # 在proxy_buffering 开启的情况下，Nginx将会尽可能的读取所有的upstream端传输的数据到buffer，直到proxy_buffers设置的所有buffer们 被写满或者数据被读取完(EOF)
  proxy_buffers 4 128k;           # proxy_buffers由缓冲区数量和缓冲区大小组成的。总的大小为number*size
  proxy_busy_buffers_size 256k;   # proxy_busy_buffers_size不是独立的空间，他是proxy_buffers和proxy_buffer_size的一部分。nginx会在没有完全读完后端响应的时候就开始向客户端传送数据，所以它会划出一部分缓冲区来专门向客户端传送数据(这部分的大小是由proxy_busy_buffers_size来控制的，建议为proxy_buffers中单个缓冲区大小的2倍)，然后它继续从后端取数据，缓冲区满了之后就写到磁盘的临时文件中。
  proxy_buffer_size 32k;          # 用来存储upstream端response的header
  proxy_max_temp_file_size 256k; # response的内容很大的 话，Nginx会接收并把他们写入到temp_file里去，大小由proxy_max_temp_file_size控制。如果busy的buffer 传输完了会从temp_file里面接着读数据，直到传输完毕。

}

```

```shell
curl http://localhost/api/users.json
```

`1. proxy_pass`

- 如果 proxy_pass 的 URL 定向里不包括 URI，那么请求中的 URI 会保持原样传送给后端 server
- 为了方便记忆和规范配置，建议所有的 proxy_pass 后的 url 都以/结尾

- proxy_pass 后的 url 最后加上/就是绝对根路径，location 中匹配的路径部分不走代理,也就是说会被替换掉

```shell
location /a/ {
    proxy_pass http://127.0.0.1/b/;
}
请求http://example.com/a/test.html 会被代理到http://127.0.0.1/b/test.html
```

- 如果 proxy_pass 的 URL 定向里不包括 URI，那么请求中的 URI 会保持原样传送给后端 server,如果没有/，表示相对路径
- proxy_pass 后的 url 最后没有/就是相对路径，location 中匹配的路径部分会走代理,也就是说会保留

```shell
location /a/ {
    proxy_pass http://127.0.0.1;
}

请求http://example/a/test.html 会被代理到http://127.0.0.1/a/test.html
```

- 在 proxy_pass 前面用了 rewrite，如下，这种情况下，proxy_pass 是无效的

```shell
location /getName/ {
  rewrite    /getName/([^/]+) /users?name=$1 break;
  proxy_pass http://127.0.0.1;
}
```

## `负载均衡`

![负载均衡](/images/nginx/nginxbalance.jpeg)

- 使用集群是网站解决高并发、海量数据问题的常用手段。
- 当一台服务器的处理能力、存储空间不足时，不要企图去换更强大的服务器，对大型网站而言，不管多么强大的服务器，都满足不了网站持续增长的业务需求。
- 这种情况下，更恰当的做法是增加一台服务器分担原有服务器的访问及存储压力。通过负载均衡调度服务器，将来自浏览器的访问请求分发到应用服务器集群中的任何一台服务器上，如果有更多的用户，就在集群中加入更多的应用服务器，使应用服务器的负载压力不再成为整个网站的瓶颈。

### `upstream`

- nginx 把请求转发到后台的一组 upstream 服务池

| 类型   | 种类             |
| :----- | :--------------- |
| 语法   | upstream name {} |
| 默认   | -                |
| 上下文 | http             |

```js
var http = require('http');
var server = http.createServer(function (request, response) {
  response.end('server3 000');
});
server.listen(3000, function () {
  console.log('HTTP服务器启动中，端口：3000');
});
```

```shell
upstream aslkami {
  server 127.0.0.1:3000 weight=10;
  server 127.0.0.1:4000;
  server 127.0.0.1:5000;
}

server {
    location / {
        proxy_pass http://aslkami;
    }

```

### `后端服务器调试状态`

| 状态         | 描述                                                              |
| :----------- | :---------------------------------------------------------------- |
| down         | 当前的服务器不参与负载均衡                                        |
| backup       | 当其它节点都无法使用时的备份的服务器                              |
| max_fails    | 允许请求失败的次数,到达最大次数就会休眠                           |
| fail_timeout | 经过 max_fails 失败后，服务暂停的时间,默认 10 秒                  |
| max_conns    | 限制每个 server 最大的接收的连接数,性能高的服务器可以连接数多一些 |

```shell
upstream zfpx {
  server localhost:3000 down;
  server localhost:4000 backup;
  server localhost:5000 max_fails=1 fail_timeout=10s;
}
```

### `分配方式`

| 类型 | 种类 |
| :-- | :-- |
| 轮询(默认) | 每个请求按时间顺序逐一分配到不同的后端服务器，如果后端服务器 down 掉，能自动剔除 |
| weight(加权轮询) | 指定轮询几率，weight 和访问比率成正比，用于后端服务器性能不均的情况 |
| ip_hash | 每 哪个机器上连接数少就分发给谁 |
| url_hash(第三方) | 按访问的 URL 地址来分配 请求，每个 URL 都定向到同一个后端 服务器上(缓存) |
| fair(第三方) | 按后端服务器的响应时间来分配请求，响应时间短的优先分配 |
| 正定义 hash | hash 自定义 key |

```shell
upstream aslkami{
  ip_hash;
  server 127.0.0.1:3000;
}
```

```shell
upstream aslkami{
  least_conn;
  server 127.0.0.1:3000;
}
```

```shell
upstream aslkami{
  url_hash;
  server 127.0.0.1:3000;
}
```

```shell
upstream aslkami{
  fair;
  server 127.0.0.1:3000;
}
```

```shell
upstream aslkami{
  hash $request_uri;
  server 127.0.0.1:3000;
}
```

## `缓存`

- 应用服务器端缓存
- 代理缓存
- 客户端缓存

[proxy_cache](https://blog.csdn.net/dengjiexian123/article/details/53386586)

```shell
http{
    # 缓存路径 目录层级 缓存空间名称和大小 失效时间为7天 最大容量为10g
    proxy_cache_path /data/nginx/cache levels=1:2 keys_zone=cache:100m inactive=60m max_size=10g;
}
```

| 键值             | 含义                                                       |
| :--------------- | :--------------------------------------------------------- |
| proxy_cache_path | 缓存文件路径                                               |
| levels           | 设置缓存文件目录层次；levels=1:2 表示两级目录              |
| keys_zone        | 设置缓存名字和共享内存大小                                 |
| inactive         | 在指定时间内没人访问则被删除                               |
| max_size         | 最大缓存空间，如果缓存空间满，默认覆盖掉缓存时间最长的资源 |

```shell
    if ($request_uri ~ ^/cache/(login|logout)) {
      set $nocache 1;
    }
    location / {
       proxy_pass http://aslkami;
    }
    location ~ ^/cache/ {
     proxy_cache cache;
     proxy_cache_valid  200 206 304 301 302 60m;   # 对哪些状态码缓存，过期时间为60分钟
     proxy_cache_key $uri;  #缓存的维度
     proxy_no_cache $nocache;
     proxy_set_header Host $host:$server_port;  #设置头
     proxy_set_header X-Real-IP $remote_addr;   #设置头
     proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;   #设置头
     proxy_pass http://127.0.0.1:6000;
    }

```

| 键值              | 含义                                                     |
| :---------------- | :------------------------------------------------------- |
| proxy_cache       | 使用名为 cache 的对应缓存配置                            |
| proxy_cache_valid | 200 206 304 301 302 10d; 对 httpcode 为 200 的缓存 10 天 |
| proxy_cache_key   | $uri 定义缓存唯一 key,通过唯一 key 来进行 hash 存取      |
| proxy_set_header  | 自定义 http header 头，用于发送给后端真实服务器          |
| proxy_pass        | 指代理后转发的路径，注意是否需要最后的/                  |

## `location`

### `正则表达式`

| 类型  | 种类                                                        |
| :---- | :---------------------------------------------------------- |
| .     | 匹配除换行符之外的任意字符                                  |
| ?     | 重复 0 次或 1 次                                            |
| +     | 重复 1 次或更多次                                           |
| \*    | 重复零次或多次                                              |
| ^     | 匹配字符串的开始                                            |
| $     | 匹配字符串的结束                                            |
| {n}   | 重复 n 次                                                   |
| {n,}  | 重复 n 次或更多次                                           |
| [abc] | 匹配单个字符 a 或者 b 或者 c                                |
| a-z   | 匹配 a-z 小写字母的任意一个                                 |
| \     | 转义字符                                                    |
| ()    | 用于匹配括号之间的内容，可以通过$1、$2 引用                 |
| \w    | 的释义都是指包含大 小写字母数字和下划线 相当于([0-9a-zA-Z]) |

### `语法规则`

- location 仅匹配 URI，忽略参数
- 前缀字符串
  - 常规
  - = 精确匹配
  - ^~ 匹配上后则不再进行正则表达式的匹配
- 正则表达式
  - ~ 大小写敏感的正则表达式匹配
  - ~\*忽略大小写的正则表达式匹配
- 内部调转
  - 用于内部跳转的命名 location @

```shell
Syntax location [=|~|~*|^~] uri {...}
       location @name{...}
default -
Context server,location
```

### `匹配规则`

- 等号类型（=）的优先级最高。一旦匹配成功，则不再查找其他匹配项。
- ^~类型表达式。一旦匹配成功，则不再查找其他匹配项。
- 正则表达式类型（~ ~\*）的优先级次之。如果有多个 location 的正则能匹配的话，则使用正则表达式最长的那个。
- 常规字符串匹配类型按前缀匹配

![匹配规则流程](/images/nginx/match_process.jpeg)

### `案例`

```shell
location ~ /T1/$ {
    return 200 '匹配到第一个正则表达式';
}
location ~* /T1/(\w+)$ {
    return 200 '匹配到最长的正则表达式';
}
location ^~ /T1/ {
    return 200 '停止后续的正则表达式匹配';
}
location  /T1/T2 {
    return 200 '最长的前缀表达式匹配';
}
location  /T1 {
    return 200 '前缀表达式匹配';
}
location = /T1 {
    return 200 '精确匹配';
}

```

```shell
/T1     # 精确匹配
/T1/    # 停止后续的正则表达式匹配
/T1/T2  # 匹配到最长的正则表达式
/T1/T2/ # 最长的前缀表达式匹配
/t1/T2  # 匹配到最长的正则表达式
```

## `rewrite`

- 可以实现 url 重写及重定向

```shell
syntax: rewrite regex replacement [flag]
Default: —
Context: server, location, if
```

- 如果正则表达式（regex）匹配到了请求的 URI（request URI），这个 URI 会被后面的 replacement 替换
- rewrite 的定向会根据他们在配置文件中出现的顺序依次执行
- 通过使用 flag 可以终止定向后进一步的处理

```shell
rewrite ^/users/(.*)$ /show?user=$1? last;=
```

### `用途`

- URL 页面跳转
- 兼容旧版本
- SEO 优化(伪静态)
- 维护(后台维护、流量转发)
- 安全(伪静态)

### `语法`

| 类型   | 种类                             |
| :----- | :------------------------------- |
| 语法   | rewrite regex replacement [flag] |
| 默认   | -                                |
| 上下文 | server,location,if               |

- regex 正则表达式指的是要被改写的路径
- replacement 目标要替换成哪个 URL
- flag 标识

例子

```shell
rewrite ^(.*)$ /www/reparing.html break;
```

### `flag`

- 标志位是标识规则对应的类型

| flag      | 含义                                                                          |
| :-------- | :---------------------------------------------------------------------------- |
| last      | 先匹配自己的 location,然后通过 rewrite 规则新建一个请求再次请求服务端         |
| break     | 先匹配自己的 location,然后生命周期会在当前的 location 结束,不再进行后续的匹配 |
| redirect  | 返回 302 昨时重定向,以后还会请求这个服务器                                    |
| permanent | 返回 301 永久重定向,以后会直接请求永久重定向后的域名                          |

`1. last`

- 结束当前的请求处理,用替换后的 URI 重新匹配 location
- 可理解为重写（rewrite）后，发起了一个新请求，进入 server 模块，匹配 location
- 如果重新匹配循环的次数超过 10 次，nginx 会返回 500 错误
- 返回 302 http 状态码
- 浏览器地址栏显示重定向后的 url

`2. break`

- 结束当前的请求处理，使用当前资源，不再执行 location 里余下的语句
- 返回 302 http 状态码
- 浏览器地址栏显示重定向后的 url

`3. redirect`

- 临时跳转，返回 302 http 状态码
- 浏览器地址栏显示重地向后的 url

`4. permanent`

- 永久跳转，返回 301 http 状态码；
- 浏览器地址栏显示重定向后的 url

```shell
location ~ ^/break {
    rewrite ^/break /test break;
    root /data/html;
}

location ~ ^/last {
    rewrite ^/last /test last;
}

location /test {
      default_type application/json;
      return 200 '{"code":0,"msg":"success"}';
}

location ~ ^/redirect {
 rewrite ^/redirect http://www.baidu.com redirect;
}
location ~ ^/permanent {
 rewrite ^/permanent http://www.baidu.com permanent;
}
```

```shell
curl http://115.29.148.6/break
test
curl http://115.29.148.6/last
{"code":0,"msg":"success"}
curl -vL http://115.29.148.6/redirect
curl -vL http://115.29.148.6/permanent
```
