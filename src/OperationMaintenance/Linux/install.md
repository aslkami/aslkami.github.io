---
title: 常用软件安装
order: 9
---

## `nginx`

```shell
yum install nginx  -y

whereis nginx # 查看安装位置
```

启动服务

```shell
/bin/systemctl start nginx.service
/bin/systemctl stop nginx.service

curl http://115.29.148.6/ # test service started or not
```

## `mongodb`

### `添加安装源`

- vim /etc/yum.repos.d/mongodb-org-3.4.repo

添加以下内容：

```shell
[mongodb-org-3.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/3.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-3.4.asc
```

- 这里可以修改 gpgcheck=0, 省去 gpg 验证
- yum makecache 就是把服务器的包信息下载到本地电脑缓存起来

### `更新缓存`

```shell
yum makecache
```

### `安装`

```shell
yum -y install mongodb-org
```

### `修改配置文件`

```shell
whereis mongod
vi /etc/mongod.conf
```

/etc/mongod.conf

```shell
net:
  port: 27017
#  bindIp: 127.0.0.1
```

### `启动服务`

```shell
systemctl start mongod.service
systemctl stop mongod.service
systemctl status mongod.service
systemctl restart mongod.service
```

### `远程连接`

```shell
systemctl stop firewalld.service #停止firewall
systemctl disable firewalld.service #禁止firewall开机启动
mongo 115.29.148.6
```

## `redis`

### `安装软件`

```shell
yum install redis -y
```

### `启动服务`

```shell
systemctl start redis.service
systemctl stop redis.service
systemctl status redis.service
systemctl restart redis.service
```

## ` mysql`

### `查看最新的安装包`

[msyql](https://dev.mysql.com/downloads/repo/yum/)

### `下载MySQL源安装包`

```shell
wget http://dev.mysql.com/get/mysql57-community-release-el7-11.noarch.rpm
```

### `安装源`

- yum -y install mysql57-community-release-el7-11.noarch.rpm
- yum repolist enabled | grep mysql.\*

### `安装MYSQL服务器`

- yum install mysql-community-server -y

```shell
/var/cache/yum/x86_64/7/mysql57-community/packages
https://mirrors.ustc.edu.cn/mysql-ftp/Downloads/MySQL-5.7/
wget https://img.zhufengpeixun.com/mysql5.7-centos7.zip
```

### `启动服务器`

```shell
systemctl start mysqld.service
systemctl stop mysqld.service
systemctl status mysqld.service
systemctl restart mysqld.service
```

### `初始化数据库密码`

- grep "password" /var/log/mysqld.log
- mysql -uroot -p
- ALTER USER 'root'@'localhost' IDENTIFIED BY 'abcd1#EFG';
- SHOW VARIABLES LIKE 'validate_password%';

### `支持远程访问`

- GRANT ALL PRIVILEGES ON . TO 'root'@'%' IDENTIFIED BY 'abcd1#EFG' WITH GRANT OPTION;
- FLUSH PRIVILEGES;

```shell
mysql -h115.29.148.6 -uroot -p # test, C:\program1\mysql-5.7.31-winx64\bin\mysqld MySQL
```

### `开机自动访问`

- systemctl enable mysqld
- systemctl daemon-reload
