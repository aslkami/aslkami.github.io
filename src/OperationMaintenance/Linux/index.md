---
title: 基础
order: 1
---

## `linux`

- Linux 是一套免费使用和自由传播的类 Unix 操作系统
- 在服务器端领域和嵌入式领域有非常广泛的应用

## `linux 和 window 区别`

- Linux 严格区分大小写
- Linux 中所有的内容以文件形式保存，包括硬件、用户和文件。
- Linux 不靠扩展名区分文件类型，是靠权限来区分，但是有一些约定的扩展名，是给管理员看的

  - 压缩包 .gz .bz2 .tar.bz2 .tgz
  - 二进制文件 .rpm
  - 网页文件 .html .php
  - 脚本文件 .sh
  - 配置文件 .conf

- Windows 下的程序不能直接在 Linux 中安装和运行
- Linux 更多使用字符界面
  - 占用的系统资源更少
  - 减少了出错和被攻击的可能性，会让系统更稳定

## `硬件设备文件名`

- 只要插入硬盘，Linux 会自动检测和分配名称
- 一个硬盘可以分成多个分区，每个分区都会有一个系统分配的名称
- 第一块 SCSI 硬盘名称叫 sda,它的第一个分区叫 sda1
- 第一块虚拟化环境的磁盘是 vda,它的第一个分区叫 vda1
- df(disk free) 命令用于显示目前在 Linux 系统上的文件系统磁盘使用情况统计, df -h

| 硬件               | 设备文件名   |
| :----------------- | :----------- |
| IDE 硬盘           | /dev/hd[a-d] |
| SCSI/SATA/USB 硬盘 | /dev/sd[a-p] |
| virtio 磁盘        | /dev/vd[a-p] |

## `分区`

- 磁盘分区是使用分区编辑器在磁盘上划分几个逻辑部分
- 磁盘一旦划分成多个分区，不同类的目录与文件可以存储进不同的分区内

## `挂载点`

- 为了让 Linux 系统中可以访问这些分区，需要把这些分区挂载到对应的目录上
- 在 Linux 中是把目录称为挂载点
- 把目录和分区链接在一起的过程成为挂载
- /为根目录，必须挂载到一个分区上，默认所有子目录都会写入这个分区
- 同一级目录下面的所有子目录可以有自己的独立存储空间
- 必须有的分区

  - / 根分区
  - swap 分区(交换分区，虚拟内存，一般为内存的 2 倍，不要超过 2G)

- 推荐分区

  - /boot (启动分区,200M) 单独分区，避免分区写满造成系统无法启动

- `/dev/sd2` 挂载到了 `/` 目录上,也就是说向 `/` 目录下在写文件就是往 `/dev/sd2` 分区里写文件
- `/dev/sd1` 挂载到了 `/boot` 目录上,也就是说向 `/boot` 目录下在写文件就是往 `/dev/sd1 `分区里写文件
- `/dev/sd3` 挂载到了 `/home` 目录上,也就是说向 `/home` 目录下在写文件就是往 `/dev/sd3` 分区里写文件

## `常见目录`

| 目录      | 用途                                                                             |
| :-------- | :------------------------------------------------------------------------------- |
| /         | 根目录                                                                           |
| /boot     | 启动目录，启动相关文件                                                           |
| /dev      | 设备文件                                                                         |
| /boot     | 启动目录，启动相关文件                                                           |
| /etc      | 配置文件                                                                         |
| /home     | 普通用户的家目录,可以操作                                                        |
| /lib      | 系统库保存目录                                                                   |
| /mnt      | 移动设备挂载目录                                                                 |
| /media    | 光盘挂载目录                                                                     |
| /misc     | 磁带机挂载目录                                                                   |
| /root     | 超级用户的家目录,可以操作                                                        |
| /tmp      | 临时目录,可以操作                                                                |
| /proc     | 正在运行的内核信息映射, 主要输出进程信息、内存资源信息和磁盘分区信息等等         |
| /sys      | 硬件设备的驱动程序信息                                                           |
| /var      | 变量                                                                             |
| /bin      | 普通的基本命令，如 ls,chmod 等,一般的用户也都可以使用                            |
| /sbin     | 基本的系统命令，如 shutdown，reboot，用于启动系统，修复系统,只有管理员才可以运行 |
| /usr/bin  | 是你在后期安装的一些软件的运行脚本                                               |
| /usr/sbin | 放置一些用户安装的系统管理的必备程序                                             |

## `常见命令`

1. `ls -a -l -d -h`

   - a 显示所有文件，包括隐藏文件
   - l 显示详细信息
   - d 查看目录本身的属性而非子文件 ls /etc/
   - h 人性化的方式显示文件大小

2. `mkdir` make directory, `mkdir -p hello`, -p 递归创建

3. `cd` change directory

4. `pwd` 显示当前目录

5. `rmdir` 删除目录 remove empty directory

6. `rm` 删除文件或者目录 remove, `rm -rf` [文件或者目录] 递归强制删除所有目录, `-r` 删除目录, `-f` 强制删除

7. `cp`, `-r` 复制目录,默认是复制文件,`-i` 会在复制文件的时候给提示,如果复制的目标文件存在,会给你提示是否要覆盖

8. `mv`, 移动文件或者改名 move, `mv [源文件或者目录] [目标文件]`

9. `ln`, 链接命令,生成链接文件 link, `ln -s [源文件] [目标文件`, `-s 创建软链接`, 类似 Windows 快捷方式, 修改任意一个文件，另一个都会改变, 删除源文件，软链接不能使用, 软链接源文件必须写绝对路径

10. `locate`, 在后台数据库中按文件名搜索，速度比较快, 数据保存在 `/var/lib/mlocate/mlocate.db` 后台数据库，每天更新一次, 可以 `updatedb` 命令立刻更新数据库, 只能搜索文件名, `yum -y install mlocate`

11. `whereis`, 搜索命令所在路径以及帮助文档所在位置, `-b` 只查找可执行文件, `-m` 只查找帮助文件, 以查看 Shell 自带的命令，如 `whereis cd`

12. `which`, 可以看到别名 `which ls`, 能看到的都是外部安装的命令, 无法查看 Shell 自带的命令，如 `which cd`

13. 环境变量, `/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin`, 定义的是系统搜索命令的路径, `echo $PATH`

14. `find`, 文件搜索命令, `find [搜索范围] [搜索条件]`

```shell
find / -name 11.txt # 按名称搜索, 避免大范围的搜索，会非常消耗系统资源
find . -name "ab[cdef].txt" # * 匹配任意内容, ? 匹配任意一个字符, [] 匹配任意一个中括号内的字符
find . -iname "Ab[cdef].txt" # -i 不区分大小写
find /root -user root #  -user 按所有者进行搜索
find /root -nouser
find . -mtime +5 # 按时间搜索, atime 文件访问时间 ctime 改变文件属性 mtime 修改文件内容
# -5	5天内修改的文件, 5	5天前当前修改的文件, +5	5天前修改的文件
find . -size +0k # k小写, M大写, -8k	小于8K, 8k	等于8K, +8k	大于8K, +8M	大于8M
find /tmp -size +10k -a -size -20k # 综合应用
find /tmp -size +10k -a -size -20k -exec ls -lh {} \; # 查找/etc目录下，大于10KB并且小于20KB的文件, -a and 逻辑与，两个条件都满足, -o or 逻辑或，两个条件满足一个就可以, exec 对上个命令的结果进行操作
```

15. `grep` 在文件当中匹配符合条件的字符串, `-i` 忽略大小写, `-v` 排除指定字符串

- find 命令，在系统当中搜索符合条件的文件名，如果需要匹配，使用通配符匹配，通配符是完全匹配
- grep 命令 在文件当中搜索符合条件的字符串，如果需要匹配，使用正则表达式进行匹配，正则表达式时包含匹配

```shell
vi a.txt
grep b a.txt
grep -v b a.txt
grep -i f a.txt
```

16. `压缩与解压缩命令`

    16.1 `zip格式`, 压缩文件或目录,是一种压缩格式, 压缩文件 zip 压缩文件名.zip 源文件, 压缩目录 zip -r 压缩目录名.zip 源目录, 解压 unzip 压缩目录名.zip

    ```shell
    yum install -y unzip zip
    mkdir book
    touch book/1.txt
    touch book/2.txt
    zip -r book.zip book
    rm -rf book/ rmdir book
    unzip book.zip
    ```

    16.2 `gzip`, gzip 为高压，可以把文件压缩得更小, gzip 命令不支持目录

    | 命令 | 实例 | 含义 |
    | :-- | :-- | :-- |
    | gzip 源文件 | gzip book.txt | 压缩为.gz 格式的压缩文件，源文件会消失 |
    | gzip -c 源文件 > 压缩文件 | gzip -c book.txt > book.txt.gz | 压缩为.gz 格式的压缩文件，源文件不会消失 |
    | gzip -r 目录 | gzip -r book | 把目录下的每个子文件都变成压缩包，并删除原文件，当前目录无变化 |
    | gzip -d 压缩文件名 | gzip -d 1.txt.gz | 解压缩文件,不保留压缩包 |
    | gunzip 压缩文件 | gunzip 2.txt.gz | 解压缩文件,也不保留压缩包 |

    - 压缩是压缩目录下的文件

    ```shell
    touch book.txt
    mkdir book
    touch book/1.txt
    touch book/2.txt
    gzip book.txt # 源文件会消失
    gzip -c 1.txt > 1.txt.gz # 源文件不消失
    gzip book.txt  # 压缩为.gz格式文件，源文件会消失
    gzip -r book # 把目录下的每个子文件都变成压缩包
    cd book
    gzip -d 1.txt.gz  # 解压缩文件,不保留压缩包
    gunzip 2.txt.gz
    ```

    16.3 `tar`

    - 打包命令,只打包并不压缩
    - tar -cvf 打包文件名 源文件
      - -c 打包
      - -v 显示过程
      - -f 指定打包后的文件名
    - `tar -cvf book.tar book` , 会打包出一个 book.tar 文件
    - `tar -xvf book.tar`, x 解开包

      16.4 `tar.gz压缩格式`

    - zip 可以压缩目录但压缩效率不高,gzip 压缩效率高但不支持目录
    - 可以先打包为.tar 格式，再压缩为.gz 格式 -c 压缩为.tar.gz 格式 -x 解压缩.tar.gz 格式

    | 命令 | 示例 | 含义 |
    | :-- | :-- | :-- |
    | tar -zcvf 压缩包名 .tar.gz 源文件 | tar -zcvf book.tar.gz book | 可以先打包为.tar 格式，再压缩为.gz 格式 |
    | tar -zxvf 压缩包名.tar.gz | tar -zxvf book.tar.gz | 解压 tar.gz 压缩包 |

17. `关机和重启命令`

- shutdown 关机命令
- -c 取消前一个关机命令
- -h 关机
- -r 重启, `shutdown -r 06:00`
- init 0 关机
- init 6 重启
- logout 退出登录

18. `查看登录用户信息`

- w 查看登录用户信息

  - USER 登录的用户名
  - TTY 登录的终端 tty1 本地终端 pts/0 远程终端
  - FROM 登录的 IP
  - LOGIN 登录时间
  - IDLE 用户闲置时间
  - JCPU 该终端所有进程占用的时间
  - PCPU 当前进程所占用的时间
  - WHAT 正在执行的命令

- who 查看登录用户信息

  - USER 登录的用户名
  - TTY 登录的终端 tty1 本地终端 pts/0 远程终端
  - LOGIN 登录时间（登录的 IP）

- last 查看当前登录和过去登录的用户信息

  - 默认读取 /var/log/wtmp 文件
    - 用户名
    - 登录终端
    - 登录 IP
    - 登录时间
    - 退出时间(在线时间)

- lastlog 查看所有用户的最后一次登录时间
  - 用户名
  - 登录终端
  - 登录 IP
  - 最后一次登录时间

19. `文件查看命令`

- cat, 用于连接文件并打印到标准输出设备上, `cat [-AbeEnstTuv] [--help] [--version] fileName`

  - cat -n textfile1, -n 或 --number：由 1 开始对所有输出的行数编号

- more, Linux more 命令类似 cat ，不过会以一页一页的形式显示，更方便使用者逐页阅读，而最基本的指令就是按空白键（space）就往下一页显示，按 b 键就会往回（back）一页显示，而且还有搜寻字串的功能（与 vi 相似），使用中的说明文件，请按 h 。

  - more fileName

- head, 用来显示开头某个数量的文字区块, `head -5 readme.txt`
- tail, 可用于查看文件的内容, 有一个常用的参数 -f 常用于查阅正在改变的日志文件。`tail [参数] [文件]`,

  - -f 循环读取, tail -f access.log
  - -n<行数> 显示文件的尾部 n 行内容, tail -5 mail.txt

- 第二页, `head -10 file | tail -5`
