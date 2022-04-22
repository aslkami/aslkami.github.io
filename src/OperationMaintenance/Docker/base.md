---
title: Docker 基础
order: 2
---

## `docker安装`

- docker 分为企业版(EE)和社区版(CE)
- [docker-ce](https://docs.docker.com/engine/install/centos/)
- [hub.docker](https://hub.docker.com/)

### `安装`

```shell
yum install -y yum-utils   device-mapper-persistent-data   lvm2
yum-config-manager     --add-repo     https://download.docker.com/linux/centos/docker-ce.repo
yum install docker-ce docker-ce-cli containerd.io -y
```

### `启动`

```shell
systemctl start docker
```

### `查看docker版本`

```shell
$ docker version
$ docker info
```

### `卸载`

```shell
docker info
yum remove docker
rm -rf /var/lib/docker
```

## `Docker架构`

![docer 架构](/images/docker/docker-arch.jpeg)

## `阿里云加速`

[镜像仓库](https://promotion.aliyun.com/ntms/act/kubernetes.html) [镜像加速器](https://cr.console.aliyun.com/cn-hangzhou/instances/mirrors)

```shell
sudo mkdir -p /etc/docker
sudo tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://fwvjnv59.mirror.aliyuncs.com"]
}
EOF
# 重载所有修改过的配置文件
//daemon-reload: 重新加载某个服务的配置文件
sudo systemctl daemon-reload
sudo systemctl restart docker
```

## `image镜像`

- Docker 把应用程序及其依赖，打包在 image 文件里面。只有通过这个文件，才能生成 Docker 容器
- image 文件可以看作是容器的模板
- Docker 根据 image 文件生成容器的实例
- 同一个 image 文件，可以生成多个同时运行的容器实例
- 镜像不是一个单一的文件，而是有多层
- 容器其实就是在镜像的最上面加了一层读写层，在运行容器里做的任何文件改动，都会写到这个读写层里。如果容器删除了，最上面的读写层也就删除了，改动也就丢失了
- 我们可以通过 docker history <ID/NAME> 查看镜像中各层内容及大小，每层对应着 Dockerfile 中的一条指令

| 命令 | 含义 | 语法 | 案例 |
| :-- | :-- | :-- | :-- |
| ls | 查看全部镜像 | docker image ls |  |
| search | 查找镜像 | docker search [imageName] |  |
| history | 查看镜像历史 | docker history [imageName] |  |
| inspect | 显示一个或多个镜像详细信息 | docker inspect [imageName] |  |
| pull | 拉取镜像 | docker pull [imageName] |  |
| push | 推送一个镜像到镜像仓库 | docker push [imageName] |  |
| rmi | 删除镜像 | docker rmi [imageName] docker image rmi 2 |  |
| prune | 移除未使用的镜像，没有标记或补任何容器引用 | docker image prune | docker image prune |
| tag | 标记本地镜像，将其归入某一仓库 | docker tag [OPTIONS] IMAGE[:TAG] [REGISTRYHOST/][username/]NAME[:TAG] | docker tag centos:7 aslkami/centos:v1 |
| export | 将容器文件系统作为一个 tar 归档文件导出到 STDOUT | docker export [OPTIONS] CONTAINER | docker export -o hello-world.tar b2712f1067a3 |
| import | 导入容器快照文件系统 tar 归档文件并创建镜像 | docker import [OPTIONS] file/URL/- [REPOSITORY[:TAG]] | docker import hello-world.tar |
| save | 将指定镜像保存成 tar 文件 | docker save [OPTIONS] IMAGE [IMAGE...] | docker save -o hello-world.tar hello-world:latest |
| load | 加载 tar 文件并创建镜像 |  | docker load -i hello-world.tar |
| build | 根据 Dockerfile 构建镜像 | docker build [OPTIONS] PATH / URL / - | docker build -t zf/ubuntu:v1 . |

- 用户既可以使用 docker load 来导入镜像存储文件到本地镜像库，也可以使用 docker import 来导入一个容器快照到本地镜像库
- 这两者的区别在于容器(import)快照文件将丢弃所有的历史记录和元数据信息（即仅保存容器当时的快照状态），而镜像(load)存储文件将保存完整记录，体积也要大
- 此外，从容器(import)快照文件导入时可以重新指定标签等元数据信息

### `查看镜像`

```shell
docker image ls
```

| 字段       | 含义     |
| :--------- | :------- |
| REPOSITORY | 仓库地址 |
| TAG        | 标签     |
| IMAGE_ID   | 镜像 ID  |
| CREATED    | 创建时间 |
| SIZE       | 镜像大小 |

### `查找镜像`

```shell
docker search ubuntu
```

| 字段        | 含义       |
| :---------- | :--------- |
| NAME        | 名称       |
| DESCRIPTION | 描述       |
| STARTS      | 星星的数量 |
| OFFICIAL    | 是否官方源 |

### `拉取镜像`

```shell
docker  pull docker.io/hello-world
```

- docker image pull 是抓取 image 文件的命令
- docker.io/hello-world 是 image 文件在仓库里面的位置，其中 docker.io 是 image 的作者，hello-world 是 image 文件的名字
- Docker 官方提供的 image 文件，都放在 docker.io 组里面，所以它的是默认组，可以省略 docker image pull hello-world

### `删除镜像`

```shell
docker rmi  hello-world
```

### `export`

- 将容器文件系统作为一个 tar 归档文件导出到 STDOUT

```shell
docker export -o hello-world.tar b2712f1067a3
```

### `import`

```shell
docker import hello-world.tar
```

### `save`

```shell
docker save -o hello-world.tar hello-world:latest
```

### `load`

```shell
docker load -i hello-world.tar
```

## `容器`

- docker run 命令会从 image 文件，生成一个正在运行的容器实例。
- docker container run 命令具有自动抓取 image 文件的功能。如果发现本地没有指定的 image 文件，就会从仓库自动抓取
- 输出提示以后，hello world 就会停止运行，容器自动终止。
- 有些容器不会自动终止
- image 文件生成的容器实例，本身也是一个文件，称为容器文件
- 容器生成，就会同时存在两个文件： image 文件和容器文件
- 关闭容器并不会删除容器文件，只是容器停止运行

### `命令`

| 命令 | 含义 | 案例 |  |
| :-- | :-- | :-- | --- |
| run | 从镜像运行一个容器 | docker run ubuntu /bin/echo 'hello-world' |
| ls | 列出容器 | docker container ls |
| inspect | 显示一个或多个容器详细信息 | docker inspect |
| attach | 要 attach 上去的容器必须正在运行，可以同时连接上同一个 container 来共享屏幕 | docker attach [OPTIONS] CONTAINER | docker attach 6d1a25f95132 |
| stats | 显示容器资源使用统计 | docker container stats |
| top | 显示一个容器运行的进程 | docker container top |
| update | 更新一个或多个容器配置 |  | docker update -m 500m --memory-swap -1 6d1a25f95132 |
| port | 列出指定的容器的端口映射 | docker run -d -p 8080:80 nginx docker container port containerID |
| ps | 查看当前运行的容器 | docker ps -a -l |
| kill [containerId] | 终止容器(发送 SIGKILL ) | docker kill [containerId] |
| rm [containerId] | 删除容器 | docker rm [containerId] |
| start [containerId] | 启动已经生成、已经停止运行的容器文件 | docker start [containerId] |
| stop [containerId] | 终止容器运行 (发送 SIGTERM ) | docker stop [containerId] docker container stop $(docker container ps -aq) |
| logs [containerId] | 查看 docker 容器的输出 | docker logs [containerId] |
| exec [containerId] | 进入一个正在运行的 docker 容器执行命令 | docker container exec -it f6a53629488b /bin/bash |
| cp [containerId] | 从正在运行的 Docker 容器里面，将文件拷贝到本机 | docker container cp f6a53629488b:/root/root.txt . |
| commit [containerId] | 根据一个现有容器创建一个新的镜像 | docker commit -a "aslkami" -m "mynginx" a404c6c174a2 mynginx:v1 |

- docker 容器的主线程（dockfile 中 CMD 执行的命令）结束，容器会退出
  - 以使用交互式启动 docker run -i [CONTAINER_NAME or CONTAINER_ID]
  - tty 选项 docker run -dit [CONTAINER_NAME or CONTAINER_ID]
  - 守护态（Daemonized）形式运行 docker run -d ubuntu /bin/sh -c "while true; do echo hello world; sleep 1; done"

### `启动容器`

```shell
docker run ubuntu /bin/echo "Hello world"
```

- docker: Docker 的二进制执行文件。
- run:与前面的 docker 组合来运行一个容器。
- ubuntu 指定要运行的镜像，Docker 首先从本地主机上查找镜像是否存在，如果不存在，Docker 就会从镜像仓库 Docker Hub 下载公共镜像。
- /bin/echo "Hello world": 在启动的容器里执行的命令

> Docker 以 ubuntu 镜像创建一个新容器，然后在容器里执行 bin/echo "Hello world"，然后输出结果
>
> - Docker attach 必须是登陆到一个已经运行的容器里。需要注意的是如果从这个容器中 exit 退出的话，就会导致容器停止

| 参数 | 含义 |  |
| :-- | :-- | --- |
| -i | --interactive 交互式 |
| -t | --tty 分配一个伪终端 |
| -d | --detach 运行容器到后台 |
| -a | --attach list 附加到运行的容器 |
| -e | --env list 设置环境变量 | docker run -d -p 1010:80 -e username="aslkami" nginx \ docker container exec -it 3695dc5b9c2d /bin/bash |
| -p | --publish list 发布容器端口到主机 |
| -P | --publish-al |

### `查看容器`

```shell
docker ps
docker -a
docker -l
```

- -a 显示所有的容器，包括已停止的
- -l 显示最新的那个容器

| 字段         | 含义           |
| :----------- | :------------- |
| CONTAINER ID | 容器 ID        |
| IMAGE        | 使用的镜像     |
| COMMAND      | 使用的命令     |
| CREATED      | 创建时间       |
| STATUS       | 状态           |
| PORTS        | 端口号         |
| NAMES        | 自动分配的名称 |

### `运行交互式的容器`

```shell
docker run -i -t ubuntu /bin/bash
exit
```

- -t=--interactive 在新容器内指定一个伪终端或终端。
- -i=--tty 允许你对容器内的标准输入 (STDIN) 进行交互。

  > 我们可以通过运行 exit 命令或者使用 CTRL+D 来退出容器。

### `后台运行容器`

```shell
docker run --detach centos ping www.baidu.com
docker ps
docker logs --follow ad04d9acde94
docker stop ad04d9acde94
```

### `kill`

```shell
docker kill 5a5c3a760f61
```

> kill 是不管容器同不同意，直接执行 kill -9，强行终止；stop 的话，首先给容器发送一个 TERM 信号，让容器做一些退出前必须的保护性、安全性操作，然后让容器自动停止运行，如果在一段时间内，容器还是没有停止，再进行 kill -9，强行终止

### `删除容器`

- docker rm 删除容器
- docker rmi 删除镜像
- docker rm $(docker ps -a -q)

```shell
docker rm 5a5c3a760f61
```

### `启动容器`

```shell
docker start [containerId]
```

### `停止容器`

```shell
docker stop [containerId]
```

### `进入一个容器`

```shell
docker attach [containerID]
```

### `进入一个正在运行中的容器`

```shell
docker container -exec -it [containerID] /bin/bash
```

### `拷贝文件`

```shell
docker container cp [containerID]/readme.md .
```

### `自动删除`

```shell
docker run --rm ubuntu /bin/bash
```

### `stats`

- 显示容器资源使用统计

```sbell
docker container stats
```

### `top`

- 显示一个容器运行的进程

```shell
docker container top
```

### `update`

- 更新一个或多个容器配置

```shell
docker update -m 500m  6d1a25f95132
```

### `port`

- 列出指定的容器的端口映射

```shell
docker run -d -p 8080:80 nginx
docker container port containerID
```

### `logs`

- 查看 docker 容器的输出

```shell
docker logs [containerId]
```
