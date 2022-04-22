---
title: Docker 进阶
order: 3
---

## `commit制作个性化镜像`

- docker commit :从容器创建一个新的镜像。
- docker commit [OPTIONS] CONTAINER [REPOSITORY[:TAG]]
  - -a :提交的镜像作者
  - -c :使用 Dockerfile 指令来创建镜像
  - -m :提交时的说明文字
  - -p :在 commit 时，将容器暂停
- 停止容器后不会自动删除这个容器，除非在启动容器的时候指定了 --rm 标志
- 使用 docker ps -a 命令查看 Docker 主机上包含停止的容器在内的所有容器
- 停止状态的容器的可写层仍然占用磁盘空间。要清理可以使用 docker container prune 命令

```shell
docker container commit -m"我的nginx" -a"aslkami" 3695dc5b9c2d aslkami/mynginx:v1
docker image ls
docker container run aslkami/mynginx /bin/bash
docker container rm b2839066c362
docker container prune
docker image rmi c79ef5b3f5fc
```

## `制作Dockerfile`

- Docker 的镜像是用一层一层的文件组成的
- docker inspect 命令可以查看镜像或者容器
- Layers 就是镜像的层文件，只读不能修改。基于镜像创建的容器会共享这些文件层

```shell
docker inspect centos
```

### `编写Dockerfile`

- -t --tag list 镜像名称
- -f --file string 指定 Dockerfile 文件的位置

| 指令 | 含义 | 示例 |
| :-- | :-- | :-- |
| FROM | 构建的新镜像是基于哪个镜像 | FROM centos:6 |
| MAINTAINER | 镜像维护者姓名或邮箱地址 | MAINTAINER aslkami |
| RUN | 构建镜像时运行的 shell 命令 | RUN yum install httpd |
| CMD | CMD 设置容器启动后默认执行的命令及其参数，但 CMD 能够被 docker run 后面跟的命令行参数替换 | CMD /usr/sbin/sshd -D |
| EXPOSE | 声明容器运行的服务器端口 | EXPOSE 80 443 |
| ENV | 设置容器内的环境变量 | ENV MYSQL_ROOT_PASSWORD 123456 |
| ADD | 拷贝文件或目录到镜像中，如果是 URL 或者压缩包会自动下载和解压 | ADD ,ADD https://xxx.com/html.tar.gz /var/www.html, ADD html.tar.gz /var/www/html |
| COPY | 拷贝文件或目录到镜像 | COPY ./start.sh /start.sh |
| ENTRYPOINT | 配置容器启动时运行的命令 | ENTRYPOINT /bin/bash -c '/start.sh' |
| VOLUME | 指定容器挂载点到宿主自动生成的目录或其它容器 | VOLUME ["/var/lib/mysql"] |
| USER | 为 RUN CMD 和 ENTRYPOINT 执行命令指定运行用户 | USER aslkami |
| WORKDIR | 为 RUN CMD ENTRYPOINT COPY ADD 设置工作目录 | WORKDIR /data |
| HEALTHCHECK | 健康检查 | HEALTHCHECK --interval=5m --timeout=3s --retries=3 CMS curl -f htp://localhost |
| ARG | 在构建镜像时指定一些参数 | ARG user |

- cmd 给出的是一个容器的默认的可执行体。也就是容器启动以后，默认的执行的命令。重点就是这个"默认"。意味着，如果 docker run 没有指定任何的执行命令或者 dockerfile 里面也没有 entrypoint，那么，就会使用 cmd 指定的默认的执行命令执行。同时也从侧面说明了 entrypoint 的含义，它才是真正的容器启动以后要执行命令

### `dockerignore`

表示要排除，不要打包到 image 中的文件路径

```shell
.git
node_modules
```

### `Dockerfile`

`1. 安装node`

[nvm](https://github.com/nvm-sh/nvm/blob/master/README.md)

```shell
wget -qO- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
source /root/.bashrc
nvm install stable
node -v
npm config set registry https://registry.npmmirror.com/
npm i cnpm -g  --registry https://registry.npmmirror.com/
npm i nrm -g  --registry https://registry.npmmirror.com/
```

`2. 安装express项目生成器`

```js
npm install express-generator -g
express app
```

`3. Dockerfile`

```shell
FROM node
COPY ./app /app
WORKDIR /app
RUN npm install
EXPOSE 3000
```

- FROM 表示该镜像继承的镜像 :表示标签
- COPY 是将当前目录下的 app 目录下面的文件都拷贝到 image 里的/app 目录中
- WORKDIR 指定工作路径，类似于执行 cd 命令
- RUN npm install 在/app 目录下安装依赖，安装后的依赖也会打包到 image 目录中
- EXPOSE 暴露 3000 端口，允许外部连接这个端口

### `创建image`

```shell
docker build -t express-demo .
```

- -t 用来指定 image 镜像的名称，后面还可以加冒号指定标签，如果不指定默认就是 latest
- . 表示 Dockerfile 文件的所有路径,.就表示当前路径

### `用新的镜像运行容器`

```shell
docker container run -p 3333:3000 -it express-demo /bin/bash
```

```js
npm start
```

- -p 参数是将容器的 3000 端口映射为本机的 3333 端口
- -it 参数是将容器的 shell 容器映射为当前的 shell,在本机容器中执行的命令都会发送到容器当中执行
- express-demo image 的名称
- /bin/bash 容器启动后执行的第一个命令,这里是启动了 bash 容器以便执行脚本
- --rm 在容器终止运行后自动删除容器文件

### `CMD`

Dockerfile

```js
+ CMD npm start
```

重新制作镜像

```shell
docker build -t express-demo .
docker container run -p 3333:3000 express-demo
```

- RUN 命令在 image 文件的构建阶段执行，执行结果都会打包进入 image 文件；CMD 命令则是在容器启动后执行
- 一个 Dockerfile 可以包含多个 RUN 命令，但是只能有一个 CMD 命令
- 指定了 CMD 命令以后，docker container run 命令就不能附加命令了（比如前面的/bin/bash），否则它会覆盖 CMD 命令

### `发布image`

- [注册账户](https://hub.docker.com/)
- 83687401 Abc
- docker tag SOURCE_IMAGE[:TAG] TARGET_IMAGE[:TAG]

```shell
docker login
docker image tag [imageName] [username]/[repository]:[tag]
docker image build -t [username]/[repository]:[tag] .

docker tag express-demo aslkami/express-demo:v1
docker push aslkami/express-demo:v1
```

## `数据盘`

- 删除容器的时候，容器层里创建的文件也会被删除掉，如果有些数据你想永久保存，比如 Web 服务器的日志，数据库管理系统中的数据，可以为容器创建一个数据盘

![数据盘](/images/docker/bindmount.png)

### `volume`

- volumes Docker 管理宿主机文件系统的一部分(/var/lib/docker/volumes)
- 如果没有指定卷，则会自动创建
- 建议使用--mount ,更通用

`1. 创建数据卷`

```shell
docker volume --help
docker volume create nginx-vol
docker volume ls
docker volume inspect nginx-vol
```

```shell
# 把nginx-vol数据卷挂载到/usr/share/nginx/html,挂载后容器内的文件会同步到数据卷中
docker run -d  --name=nginx1 --mount src=nginx-vol,dst=/usr/share/nginx/html nginx
docker run -d  --name=nginx2  -v nginx-vol:/usr/share/nginx/html -p 3000:80 nginx
```

`2. 删除数据卷`

```shell
docker container stop nginx1 # 停止容器
docker container rm nginx1 # 删除容器
docker volume rm nginx-vol #  删除数据库
```

`3. 管理数据盘`

```shell
docker volume ls # 列出所有的数据盘
docker volume ls -f dangling=true # 列出已经孤立的数据盘
docker volume rm xxxx # 删除数据盘
docker volume ls      # 列出数据盘
```

### `Bind mounts`

- 此方式与 Linux 系统的 mount 方式很相似，即是会覆盖容器内已存在的目录或文件，但并不会改变容器内原有的文件，当 umount 后容器内原有的文件就会还原
- 创建容器的时候我们可以通过-v 或--volumn 给它指定一下数据盘
- bind mounts 可以存储在宿主机系统的任意位置
- 如果源文件/目录不存在，不会自动创建，会抛出一个错误
- 如果挂载目标在容器中非空目录，则该目录现有内容将被隐藏

`1. 默认数据盘`

- -v 参数两种挂载数据方式都可以用

```shell
docker run -v /mnt:/mnt -it --name logs centos bash
cd /mnt
echo 1 > 1.txt
exit
```

```shell
docker inspect logs
"Mounts": [
    {
        "Source":"/mnt/sda1/var/lib/docker/volumes/dea6a8b3aefafa907d883895bbf931a502a51959f83d63b7ece8d7814cf5d489/_data",
        "Destination": "/mnt",
    }
]
```

- Source 的值就是我们给容器指定的数据盘在主机上的位置
- Destination 的值是这个数据盘在容器上的位置

`2. 指定数据盘`

```shell
mkdir ~/data
docker run -v ~/data:/mnt -it --name logs2 centos bash
cd /mnt
echo 3 > 3.txt
exit
cat ~/data/3.txt
```

- ~/data:/mnt 把当前用户目录中的 data 目录映射到/mnt 上

`3. 指定数据盘容器`

- docker create [OPTIONS] IMAGE [COMMAND] [ARG...] 创建一个新的容器但不启动

```shell
docker create -v /mnt:/mnt --name logger centos
docker run --volumes-from logger --name logger3 -i -t centos bash
cd /mnt
touch logger3
docker run --volumes-from logger --name logger4 -i -t centos bash
cd /mnt
touch logger4
```

## `网络`

- 安装 Docker 时，它会自动创建三个网络，bridge（创建容器默认连接到此网络）、 none 、host
  - None：该模式关闭了容器的网络功能,对外界完全隔离
  - host：容器将不会虚拟出自己的网卡，配置自己的 IP 等，而是使用宿主机的 IP 和端口。
  - bridge 桥接网络，此模式会为每一个容器分配 IP
- 可以使用该--network 标志来指定容器应连接到哪些网络

### `bridge(桥接)`

- bridge 网络代表所有 Docker 安装中存在的网络
- 除非你使用该 `docker run --network=<NETWORK>` 选项指定，否则 Docker 守护程序默认将容器连接到此网络
- bridge 模式使用 --net=bridge 指定，默认设置

```shell
docker network ls #列出当前的网络
docker inspect bridge #查看当前的桥连网络
docker run -d --name nginx1 nginx
docker run -d --name nginx2 --link nginx1 nginx
docker exec -it nginx2 bash
apt update
apt install -y inetutils-ping  #ping
apt install -y dnsutils        #nslookup
apt install -y net-tools       #ifconfig
apt install -y iproute2        #ip
apt install -y curl            #curl
cat /etc/hosts
ping nginx1
```

### `none`

- none 模式使用--net=none 指定

```shell
# --net 指定无网络
docker run -d --name nginx_none --net none nginx
docker inspect none
docker exec -it nginx_none bash
ip addr2
```

### `host`

- host 模式使用 --net=host 指定

```shell
docker run -d --name nginx_host --net host nginx
docker inspect host
docker exec -it nginx_host bash
ip addr
```

### `端口映射`

```shell
# 查看镜像里暴露出的端口号
docker image inspect nginx
"ExposedPorts": {"80/tcp": {}}
# 让宿主机的8080端口映射到docker容器的80端口
docker run -d --name port_nginx -p 8080:80  nginx
# 查看主机绑定的端口
docker container port port_nginx
```

### `指向主机的随机端口`

```shell
docker run -d --name random_nginx --publish 80 nginx
docker port random_nginx

docker run -d --name randomall_nginx --publish-all nginx
docker run -d --name randomall_nginx --P nginx
```

### `创建自定义网络`

- 可以创建多个网络，每个网络 IP 范围均不相同
- docker 的自定义网络里面有一个 DNS 服务，可以通过容器名称访问主机

```shell
# 创建自定义网络
docker network create --driver bridge myweb
# 查看自定义网络中的主机
docker network inspect myweb
# 创建容器的时候指定网络
docker run -d --name mynginx1  --net myweb nginx
docker run -d --name mynginx2  --net myweb nginx
docker exec -it mynginx2 bash
ping mynginx1
```

### `连接到指定网络`

```shell
docker run -d --name mynginx3   nginx
docker network connect  myweb mynginx3
docker network disconnect myweb mynginx3
```

### `移除网络`

```shell
docker network rm myweb
```

## `Compose`

- Compose 通过一个配置文件来管理多个 Docker 容器
- 在配置文件中，所有的容器通过 services 来定义，然后使用 docker-compose 脚本来启动、停止和重启应用和应用中的服务以及所有依赖服务的容器
- 步骤：
  - 最后，运行 docker-compose up，Compose 将启动并运行整个应用程序 配置文件组成
  - services 可以定义需要的服务，每个服务都有自己的名字、使用的镜像、挂载的数据卷所属的网络和依赖的其它服务
  - networks 是应用的网络，在它下面可以定义使用的网络名称，类性
  - volumes 是数据卷，可以在此定义数据卷，然后挂载到不同的服务上面使用

### `安装compose`

```shell
yum -y install epel-release
yum -y install python-pip
yum clean all
pip install docker-compose
```

```shell
sudo curl -L "https://github.com/docker/compose/releases/download/1.25.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
# 添加可执行权限
sudo chmod +x /usr/local/bin/docker-compose
# 查看版本信息
docker-compose -versio
```

### `编写docker-compose.yml`

- 在 docker-compose.yml 中定义组成应用程序的服务，以便它们可以在隔离的环境中一起运行
- 空格缩进表示层次
- 冒号空格后面有空格

docker-compose.yml

```yaml
version: '2'
services:
  nginx1:
    image: nginx
    ports:
      - '8080:80'
  nginx2:
    image: nginx
    ports:
      - '8081:80'
```

### `启动服务`

- docker 会创建默认的网络

| 命令                            | 服务                 |
| :------------------------------ | :------------------- |
| docker-compose up               | 启动所有的服务       |
| docker-compose up -d            | 后台启动所有的服务   |
| docker-compose ps               | 打印所有的容器       |
| docker-compose stop             | 停止所有服务         |
| docker-compose logs -f          | 持续跟踪日志         |
| docker-compose exec nginx1 bash | 进入 nginx1 服务系统 |
| docker-compose rm nginx1        | 删除服务容器         |
| docker network ls               | 查看网络网络不会删除 |
| docker-compose down             | 删除所有的网络和容器 |

> 删除所有的容器 `docker container rm docker container ps -a -q`

### `网络互ping`

```shell
docker-compose up -d
docker-compose exec nginx1 bash
apt update && apt install -y inetutils-ping
#可以通过服务的名字连接到对方
ping nginx2
```

### `配置数据卷`

- networks 指定自定义网络
- volumes 指定数据卷
- 数据卷在宿主机的位置 `/var/lib/docker/volumes/nginx-compose_data/_data`

```yml
version: '3'
services:
  nginx1:
    image: nginx
    ports:
      - '8081:80'
    networks:
      - 'newweb'
    volumes:
      - 'data:/data'
      - './nginx1:/usr/share/nginx/html'
  nginx2:
    image: nginx
    ports:
      - '8082:80'
    networks:
      - 'default'
    volumes:
      - 'data:/data'
      - './nginx2:/usr/share/nginx/html'
  nginx3:
    image: nginx
    ports:
      - '8083:80'
    networks:
      - 'default'
      - 'newweb'
    volumes:
      - 'data:/data'
      - './nginx3:/usr/share/nginx/html'
networks:
  newweb:
    driver: bridge
volumes:
  data:
    driver: local
```

```shell
docker exec nginx-compose_nginx1_1  bash
cd /data
touch 1.txt
exit
cd /var/lib/docker/volumes/nginx-compose_data/_data
ls
```
