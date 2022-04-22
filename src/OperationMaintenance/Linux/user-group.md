---
title: 用户和用户组
order: 3
---

## `用户和用户组`

- 使用操作系统的人都是用户
- 用户组是具有相同系统权限的一组用户

## `配置文件`

- /etc/group

  - /etc/group 存储当前系统中所有用户组信息
  - root 组编号为 0
  - 1-499 系统预留的编号 预留给安装的软件和服务的
  - 用户手动创建的用户组从 500 开始
  - 组密码占位符都是 x
  - 如果组内只有一个用户，而且用户名和组名相同的话，是可以省略用户名的
  - root:x:0:root
    - root 组的名称
    - x 密码占位符
    - 0 组编号
    - root 组中用户名列表

- /etc/gshadow

  - 存放当前系统中用户组的密码信息
  - 和/etc/group 中的记录一一对应
  - root:\*::root
    - root 组的名称
    - 组密码, \*为空, 组管理者,为空表示都可以管理这个组
    - root 组中用户名列表

- /etc/passwd

  - 存储当前系统中所有用户的信息
  - root:x:0:0:root:/root:/bin/bash
    - root 用户名
    - x 密码占位符
    - 0 用户编号
    - 0 用户组编号
    - root 用户注释信息
    - /root 用户主目录
    - /bin/bash shell 类型

- /etc/shadow

  - 存放当前系统中所有用户的密码信息
  - user:xxx:::::::
  - 用户名:密码:
  - root:password:17982:0:99999:7:::

  | 内容 | 含义 |
  | :-- | :-- |
  | root | 用户名 |
  | password | 单向加密后的密码 |
  | 17982 | 修改日期,这个是表明上一次修改密码的日期与 1970-1-1 相距的天数密码不可改的天数：假如这个数字是 8，则 8 天内不可改密码，如果是 0，则随时可以改 |
  | 0 | 这个是表明上一次修改密码的日期与 1970-1-1 相距的天数密码不可改的天数：假如这个数字是 8，则 8 天内不可改密码，如果是 0，则随时可以改 |
  | 99999 | 如果是 99999 则永远不用改。如果是其其他数字比如 12345，那么必须在距离 1970-1-1 的 12345 天内修改密码，否则密码失效 |
  | 7 | 修改期限前 N 天发出警告 |
  |  | 密码过期的宽限天数 |
  |  | 帐号失效日期 |
  |  | 保留：被保留项，暂时还没有被用上 |

## `用户命令`

- whoami, 显示登录的用户名
- id student, 显示指定用户信息，包括用户编号，用户名 主要组的编号及名称，附属组列表
- groups student, 显示 zhangsan 用户所在的所有组

## `用户和用户组操作`

- 添加用户组

```shell
groupadd stu
cat  /etc/group
```

- 修改用户组名称

```shell
groupmod -n student stu
cat  /etc/group
```

- 修改用户组编号

```shell
groupmod -g 666 student
cat  /etc/group
```

- 创建分组并指定编号

```shell
groupadd -g 888 teacher
```

- 删除用户组

```shell
groupdel student
```

- 添加用户

```shell

groupadd stu  # 添加用户组
useradd -g stu zhangsan  # 创建用户并指定用户组
useradd -g stu lisi      # 创建用户并指定用户组

id zhangsan
id lisi

useradd -d /home/wangwu wangwu   # 创建用户并指定家目录
passwd zhangsan # root用户可以设置用户的密码
```

- 指定个人文件夹

```shell
usermod -d /home/wangwu2 wangwu
```

- 修改用户组

```shell
usermod -g student wangwu
```

- 删除用户

```shell
userdel wangwu
userdel -r wangwu # 删除用户的时候级联删除对应的目录
```
