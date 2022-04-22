---
title: Shell
order: 5
---

## `Shell 基础`

- shell 是一个命令行解释器，它为用户提供了一个向 Linux 内核发送请求以便运行程序的界面系统级程序
- 用户可以用 Shell 来启动、挂起、停止或者编写一些程序
- Shell 还是一个功能相当强大的编程语言，易编写，易调试，灵活性较强。
- Shell 是解释执行的脚本语言，在 Shell 中可以直接调用 Linux 系统命令。

### `echo`

- 输出命令
- -e：激活转义字符

```shell
echo hello
echo -e "a\tb"
```

### `编写执行shell`

```shell
# hello.sh

#!/bin/bash
echo hello

# 通过Bash调用执行脚本
sh hello.sh
# 赋予执行权限，直接运行
chmod 755 hello.sh
chmod u+x hello.sh
./hello.sh
```

### `别名`

- 命令别名就是小名
- 临时生效 alias cp="cp -i"
- 写入环境变量配置文件 vi ~/.bashrc
- source ~/.bashrc
- 删除别名 unalias 别名

### `命令的生效顺序`

- 绝对路径或者相对路径
- 别名
- bash 内部命令
- 按照$PATH 环境变量定义的目录查找顺序找到的第一个命令

### `命令快捷键`

- ctrl+c 强制终止当前命令
- ctrl+l 清屏
- ctrl+a 光标移动到命令行首
- ctrl+e 光标移动到命令行尾
- ctrl+u 从光标所在的位置删除到行首

### `历史命令`

- history [选项] [历史命令保存文件]
- 选项

  - -c 清空历史命令
  - -w 把缓存中的历史命令写入历史命令保存文件 ~/.bash_history -

- 默认保存 1000 条 /etc/profile HISSIZE=10000

### `调用`

- 使用上下箭头调用以前的历史命令
- 使用 !n 重复执行第 n 条历史命令
- 使用 !! 重复执行上一条命令
- 使用 !字符 重复执行最后一条以该字符串开头的命令

```shell
history -c
1  echo 1
2  echo 2
3  echo 3
!2
!!
!echo
```

### `输出重定向`

- 标准输入输出

| 设备   | 设备文件名  | 文件描述符 | 类型         |
| :----- | :---------- | :--------- | :----------- |
| 键盘   | /dev/stdin  | 0          | 标准输入     |
| 显示器 | /dev/stdout | 1          | 标准输出     |
| 显示器 | /dev/stderr | 2          | 标准错误输出 |

| 类型 | 符号 | 作用 |
| :-- | :-- | :-- |
| 标准输出重定向 | 命令 > 文件 | 以覆盖的方式，把命令的正确输出输出到指定的文件或设备当中 |
| 标准输出重定向 | 命令 >> 文件 | 以追加的方式，把命令的正确输出输出到指定的文件或设备当中 |
| 错误输出重定向 | 命令>文件 | 以覆盖的方式，把命令的错误输出输出到指定的文件或设备当中 |
| 错误输出重定向 | 命令>>文件 | 以追加的方式，把命令的错误输出输出到指定的文件或设备当中 |
| 正确输出和错误输出同时保存 | 命令>文件 2>&1 | 以覆盖的方式，把正确输出和错误输出都保存到同一个文件当中 |
| 正确输出和错误输出同时保存 | 命令>文件 2>>&1 | 以追加的方式，把正确输出和错误输出都保存到同一个文件当中 |
| 正确输出和错误输出同时保存 | 命令&>文件 | 以覆盖的方式，把正确输出和错误输出都保存到同一个文件当中 |
| 正确输出和错误输出同时保存 | 命令&>>文件 | 以追加的方式，把正确输出和错误输出都保存到同一个文件当中 |
| 正确输出和错误输出同时保存 | 命令>>文件 1 2>文件 2 | 以覆盖的方式，正确的输出追加到文件 1 中，把错误输出追加到文件 2 中 |

- 输入重定向

  - wc 命令的功能为统计指定文件中的行数、字数、字节数, 并将统计结果显示输出
  - 命令 < 文件把文件做为命令的输入
  - wc < a.txt

### `管道符号`

- 多命令顺序执行

| 多命令执行符 | 格式 | 作用 | 案例 |
| :-- | :-- | :-- | :-- |
| ; | 命令 1;命令 2 | 多个命令执行，命令之间没有任何逻辑联系 | echo 1;echo 2; |
| && | 命令 1&&命令 2 | 逻辑与 当命令 1 正确执行，则命令 2 才会执行 当命令 1 执行不正确，则命令 2 不会执行 | echo 1&&echo 2; |
| \|\| | 命令 1 \|\| 命令 2 | 逻辑或 当命令 1 执行不正确，则命令 2 才会执行 当命令 1 正确执行，则命令 2 不会执行 | echo 1 \|\| echo 2; |

```shell
echo 1;echo 2;
echo 1&&echo 2;
echo 1||echo 2;
```

- 管道符号

  - 命令 1 的正确输出会作为命令 2 的操作对象
  - 命令 1|命令 2

  ```shell
  ls /etc/ | more
  netstat -an | grep ESTABLISHED | wc -l
  ```

- 通配符

  - 匹配文件名和目录名

| 通配符                         | 作用                                        |
| :----------------------------- | :------------------------------------------ |
| ?                              | 匹配一个任意字符                            |
| \*                             | 匹配 0 个或任意字符，也就是可以匹配任意内容 |
| []                             | 匹配中括号中任意一个字符                    |
| [-] 匹配中括号中任意一个字符,- | 代表范围                                    |
| [^]                            | 匹配不是中括号中的一个字符                  |

- 其它符号

| 符号 | 作用 |
| :-- | :-- |
| '' 单引号。在单引号中所有的特殊符号，如$和` | 都没有特殊含义 |
| "" 双引号，在双引号里特殊符号都没有特殊含义，但是 $ ` \  | 例外，拥有调用变量值，引用命令和转义的含义 |
|  | 反引号，扩起来的是系统命令 |
| $() | 和反引号一样 |
| # 在 shell 脚本中，# | 开头的行代表注释 |
| $ | 用于调用变量的值 |
| \  | 转义符号 |

```shell
echo '$PATH'
echo "$PATH"
echo `ls`
echo $(ls)
echo -e "a\tb"
```

## `变量`

### `什么是变量`

- 可以变化的量
- 变量必须以字母或下划线开头，名字中间只能由字母，数字和下划线组成
- 变量名的长度不得超过 255 个字符
- 变量名在有效范围内必须唯一
- 变量默认类型都是字符串

### `变量的分类`

- 字符串
- 整型
- 浮点型
- 日期型

### `用户自定义变量`

- 这些变量的值是自己定义的
- 变量名不能为数字开头
- 等号左右两边不能有空格

  - 定义变量

  ```shell
  name="aslkami"
  age=10
  ```

  - 输出变量值

  ```shell
  echo $变量名
  ```

  - 值默认都是字符串

  ```shell
  $ x=1
  $ y=2
  $ z=3
  $ k=$x+$y+$z
  $ echo $k
  1+2+3
  ```

  - 在赋值的时候引用变

  ```shell
  m="$x"2
  n=${x}2
  echo $m $n
  ```

  - set
    - 查询系统中默认所有已经生效的变量，包括系统变量,也包括自定义变量

  ```shell
  set | grep aslkami
  ```

  - unset, 删除变量

  ```shell
  unset a
  ```

### `环境变量`

- 环境变量是全局变量，而自定义变量是局部变量
- 自定义变量会在当前的 shell 中生效，而环境变量会在当前 shell 以及其子 shell 中生效
- 这种变量主要保存的是和系统操作环境相关的数据
- 变量可以自定义，但是对系统生效的环境变量名和变量作用是固定的

`1. 自定义环境变量`

```shell
export 变量名=变量值
export envName=prod
```

`2. env`

- 仅仅用来查看环境变量，而不看到本地变量

```shell
env | grep envName
```

`3. 常用环境变量`

| 变量名 | 含义 | 示例 |
| :-- | :-- | :-- |
| HOSTNAME | 主机名 | HOSTNAME=localhost |
| SHELL | 当前的 shell | SHELL=/bin/bash |
| HISTSIZE | 历史命令条数 | HISTSIZE=1000 |
| SSH_CLIENT | 当前操作环境如果是用 SSH 连接的话，这里会记录客户端 IP SSH_CLIENT=192.168.1.100 57596 | 22 |
| USER | 当前登录的用户 | USER=root |

```shell
echo $HOSTNAME
echo $SHELL
echo $HISTSIZE
echo $SSH_CLIENT
echo $USER
```

`4. path`

- 系统搜索路径

```shell
# echo $PATH
/usr/lib/qt-3.3/bin:/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin:/root/bin
```

- 如果想把一个自定义的脚本直接可以执行，或者把这个文件拷贝到目标目录下，或者把脚本所在目录添加到环境变量中的 PATH 路径中
- /root/shells/hello.sh

```shell
#!/bin/bash
echo hello

export PATH="$PATH":/root/shells
hello.sh
```

`5. 语系环境变量`

- 查询当前系统语系
- 在 Linux 中通过 locale 来设置程序运行的不同语言环境，locale 由 ANSI C 提供支持。locale 的命名规则为<语言>\_<地区>.<字符集编码>，如 zh_CN.UTF-8，zh 代表中文，CN 代表大陆地区，UTF-8 表示字符集。
- LANG: 定义系统主语系的变量

```shell
locale
LANG=zh_CN.UTF-8

echo $LANG
```

`6. 中文支持`

- 图形界面可以支持中文
- 第三方工具比如 xshell 语系设置正确可以支持中文
- 虚拟机中的纯字符界面不支持中文

### `位置参数变量`

- 这种变量主要是用来向脚本当中传递参数或数据的,变量名不能自定义,变量作用是固定的

| 位置参数变量 | 作用 |
| :-- | :-- |
| $n | n 为数字，$0代表命令本身，$1-$9代表第1到第9个参数，10以上的参数需要用大括号包含,如${10} |
| $\* | 这个变量代表命令中所有的参数，$\*把所有的变看数看成一个整体 |
| $@ | 这个变量也代表命令行中所有的参数，不过$@把每个参数进行区分 |
| $# | 这个变量代表命令行中所有参数的个数 |

sum.sh

```shell
#!/bin/bash
num1=$1
num2=$2
sum=$((num1+num2))
echo $sum
```

vi for.sh

```shell
#!/bin/bash
for i in "$@"
 do
   echo "i=$i"
 done

# excute
sh for.sh 1 2 3
i=1
i=2
```

vi for2.sh

```shell
#!/bin/bash
for i in "$#"
 do
   echo "i=$i"
 done

# excute
sh for2.sh 1 2 3
i=1 2 3
```

vi for3.sh

```shell
#!/bin/bash
echo "$#"

# excute
sh for3.sh 1 2 3
3
```

### `预定义变量`

- 是脚本中已经定义好的变量，变量名不能自定义，变量作用也是固定的

| 位置参数变量 | 作用                                                              |
| :----------- | :---------------------------------------------------------------- |
| $?           | 最后一次执行的命令的返回状态。0 表示正确执行，非 0 表示不正确执行 |
| $$           | 当前进程的进程号(PID)                                             |

```shell
echo $?
echo $$
```

### `read`

- read [选项] [变量名]

| 选项 | 含义                                                            |
| :--- | :-------------------------------------------------------------- |
| -p   | 提示信息，在等待 read 输入时，输出提示信息                      |
| -t   | f 秒数: read 命令会一直等待用户输入，使用此选项可以指定等待时间 |
| -n   | 字符数，read 命令只接受指定的字符数，就会执行                   |
| -s   | 隐藏输入的数据，适用于机密信息的输入                            |

```shell
#!/bin/bash
read -p 'please input your name:' -t 5 name
echo -e "\n"
read -p 'please input you gender[m/f]:' -n 1 gender
echo -e "\n"
read -p 'please input your password:' -s password
echo -e "\n"
echo $name,$gender,$password

# excute
sh read.sh
```

## `运算符`

- 弱类型并且默认是字符串类型

### `declare命令`

`1. declare命令`

- 用来声明变量类型
- declare [+/-] [选项] 变量名

| 选项 | 含义                       |
| :--- | :------------------------- |
| -    | 给变量设定类型属性         |
| +    | 取消变量的类型属性         |
| -a   | 将变量声明为数组类型       |
| -i   | 将变量声明为整数型         |
| -x   | 将变量声明为环境变量       |
| -r   | 将变量声明为只读变量       |
| -p   | 显示指定变量的被声明的类型 |

```shell
a=1
b=2
c=$a+$b
echo $c
1+2
declare -i c=$a+$b # 声明成整型
echo $c
3
declare +i c # 取消变量的类型属性
c=$a+$b
echo $c
1+2
declare -i c="3" # 给变量设定类型属性
declare -p c # 显示指定变量的被声明的类型
# declare -i c="3"

# 声明环境变量
declare -x kk=1
set | grep kk      # 查看所有变量
env | grep kk      # 只查看系统变量

declare -r x # 只读
x=2  # bash: x: readonly variable
```

`2. 数组`

```shell
# 声明为数组类型
declare -a names;

names[0]=zhangsan
names[1]=lisi

# 默认只打印第一个元素
echo ${names}
zhangsan
# 打印第2个元素
echo ${names[1]}
lisi
# 打印全部
echo ${names[*]}
zhangsan lisi
```

`3. 声明环境变量`

- export 最终执行的是 declare -x 命令
- declare -p 可以查看所有的类型

```shell
export NAME=aslkami
declare -x NAME=aslkami
```

`4. 只读属性`

```shell
declare -r gender=m
gender=f
-bash: gender: readonly variable
```

`5. 查询变量属性`

- declare -p 查询所有变量的属性
- declare -p 变量名 查询指定变量的属性

### `数值运算的方法`

- 只要用 declare 声明变量的时候指定类型就可以进行数值运算

`1. expr或let `

- \+ 号左右两侧必须有空格,否则还是整块输出

```shell
num1=2
num2=3
sum=$(expr $num1 + $num2)
echo $sum
5
```

```shell
sum2=$(($num1+$num2))
echo $sum2
5
sum3=$[$num1+$num2]
echo $sum3
5

d=$(date)
echo $d
```

`2. 优先级`

![运算符](/images/linux/linux-priority.png)

```shell
result=$(((1+2)*4/2))
echo $result
6
```

## ` 环境变量配置文件`

### `source 命令`

- 修改完配置文件后，必须注销重新登录才能生效，使用 source 命令可以不用重新登录
- source 配置文件
- . 配置文件

### `环境变量配置文件简介`

- PATH、HISTSIZE、PS1、HOSTNAME 等环境变量写入对应的环境变量配置文件
- 环境变量配置文件中主要是定义地系统操作环境生效的系统默认环境变量，如 PATH 等此文件登录时起作用的环境变量

| 路径            | 说明               |
| :-------------- | :----------------- |
| /etc/profile    |                    |
| /etc/bashrc     |                    |
| ~/.bash_profile | 只会对当前用户生效 |
| ~/.bashrc       | 只会对当前用户生效 |

![环境变量路径](/images/linux/linux-path.png)

### `环境变量配置文件的功能`

`1. /etc/profile`

- 在这里修改系统变量

```shell
cat  /etc/profile | grep USER
```

| 变量名               | 含义     |
| :------------------- | :------- |
| USER                 | 用户名   |
| LOGNAME              | 登录名   |
| MAIL                 | 邮箱地址 |
| PATH                 | 查找路径 |
| HOSTNAME             | 主机名   |
| umask                | 权限掩码 |
| /etc/profile.d/\*.sh |          |

`2. ~/.bash_profile`

- 在这里修改 PATH 路径
- 调用 ~/.bashrc

`3. ~/.bashrc`

- 在这里改别名,配置 alias
- 调用 /etc/bashrc

`4. /etc/bashrc`

- PS1 登录提示符在这里修改
- umask
- PATH 变量
- 调用 /etc/profile.d/\*.sh 文件

`5. 其它配置文件`

- 注销时生效的环境变量配置文件

  - ~/.bash_logout

- 脚本历史

  - 当正确退出计算机的时候会历史记录会写入文件
  - ~/.bash_history

- Shell 登录信息

  - 本地终端欢迎信息 /etc/issue
  - 远程终端欢迎信息 /etc/issue.net
  - 不管远程还是本地都可以生效 /etc/motd

| 参数 | 含义                         |
| :--- | :--------------------------- |
| \d   | 当前系统日期                 |
| \s   | 显示操作系统名称             |
| \l   | 显示登录的终端号             |
| \m   | 显示硬件体系结构，如 i386 等 |
| \n   | 显示主机名                   |
| \o   | 显示域名                     |
| \r   | 显示内核版本                 |
| \t   | 显示当前系统时间             |
| \u   | 显示当前登录用户的序列号     |

```shell
vi /etc/ssh/sshd_config
Banner /etc/issue.net
service sshd restart
```

## `正则表达式`

[regexper](https://regexper.com/)

### `概念`

- 正则表达式是用于描述字符排列和匹配模式的一种语法规则
- 它主要用于字符串的模式分割、匹配查找及替换操作

### `通配符`

- 通配符用来匹配符合条件的文件名，通配符是完全匹配。
- ls find 这些命令不支持正则，只能使用通配符

| 符号 | 含义                         |
| :--- | :--------------------------- |
| ?    | 匹配任意一个字符             |
| \*   | 匹配任意多个字符             |
| []   | 匹配中括号中范围内的一个字符 |

### `正则表达式`

- 正则表达式是用来在文件中匹配符合条件的字符串，是包含匹配。
- grep awk sed 等都可以支持正则表达式

### `元字符`

- alias grep='grep --color=auto'

| 元字符 | 作用 | 示例 |
| :-- | :-- | :-- |
| \* | 前一个字符匹配 0 次或任意多次 | grep 1\* reg.txt |
| . | 匹配除换行符外的任意一个字符 | grep . reg.txt |
| ^ | 匹配行首。例如，^hello 会匹配以 hello 开头的行 | grep ^a reg.txt |
| $ | 匹配行尾。例如，hello& 会匹配以 hello 结尾的行 | grep a$ reg.txt |
| [] | 匹配屮柄号屮指定的任意一个字符，而且只匹配一个字符。例如.[aoeiu]匹配任意一个元音字母， [0-9] 匹配任意一位数字，[a-z][0-9] 匹配由小写字母和一位数字构成的两位字符 | grep ab[bc]c reg.txt |
| [^] | 匹配除中括号中的字符以外的任意一个字符。例如，[^0-9] 匹配任意一位非数字字符，[^a-z] 匹配任意一位非小写字母 | grep a[^fg]c reg.txt |
| \  | 转义符，用于取消特殊符号的含义 | grep \.$ reg.txt |
| {n} | 表示其前面的字符恰好出现 n 次。例如，[0-9]{4} 匹配 4 位数字，[1][3-8][0-9]{9} 匹配手机号码 | grep "a{1}" reg.txt |
| {n,} | 表示其前面的字符出现不少于 n 次。例如，[0-9]{2,} 匹配两位及以上的数字 | grep "a{1,}" reg.txt |
| {n,m} | 表示其前面的字符至少出现 n 次，最多出现 m 次。例如，[a-z]{6,8} 匹配 6〜8 位的小写字母 | grep "a{2,3}" reg.txt |

### `cut`

- cut 用来提取文本中的某一部分文本
- cut [选项] 文件名
  - -f 列号，用来指定要提取的列
  - -d 分隔符，按照指定分隔符分割列,默认分隔符是 TAB 制表符

提取用户名和它使用的 shell

```shell
cat /etc/passwd | cut -f 1,7 -d :
```

### `printf`

- 按规定格式输出
- printf 输出类型 输出内容

| 参数 | 含义 |
| :-- | :-- |
| %ns | 输出字符串,n 是数字指代输出几个字符 |
| %ni | 输出整数,n 是指输出几个数字 |
| %m.nf | 输出浮点数,m 和 n 是数字，指代输出的整数位数和小数位数，如% 6.2f 代表输出 6 位位，2 位小数，4 位整数 |

```shell
printf "%s\t%s\t%s\t%s\t%s\t\%s\n" $(df -h | grep /dev/vda1) | cut -f 1,5
```

### `awk`

- awk '条件 1{动作 1} 条件 2{动作 2}...' 文件名
- 条件(Pattern)
  - 一般使用关系表达式作为条件
  - x > 10 判断变量 x 是否大于 10
  - x >=10 大于等于
  - x <=10 小于等于
- 动作(Action)

  - 格式化输出 $0 整行 $1 第一列...

- $0 整行 $1 第一列...

```shell
df -h | grep /dev/vda1 |awk '{print $5}'| cut -d '%' -f 1
```

`1. begin end`

- awk 可以正确截取制表符和空格
- begin 在所有的输出之前打印
- end 在所有的输出之后打印

```shell
echo "" > numbers.txt
awk 'BEGIN{print "开始"}END{print "结束"}' numbers.txt
```

`2. FS`

- Field Separator，字段分隔符

```shell
awk 'BEGIN{FS=":"}{print $1"\t"$2}' /etc/passwd
```

`3. 声明变量`

numbers.txt

```shell
1
2
3

awk 'BEGIN{sum=0}{sum=sum+$1}END{print sum}' numbers.txt
6
```

`4. 多条件`

score.txt

```shell
zhangsan 91
li 81
wangwu 71

awk '$2>90{print $1"\t优秀"}$2>80{print $2"\t良好"}' score.txt
```

`5. NR`

- NR,表示 awk 开始执行程序后所读取的数据行数

```shell
awk '{print NR,$0}' score.txt
```

`6. OFS`

- OFS Out of Field Separator，输出字段分隔符

```shell
echo "i love you" | awk 'BEGIN{ FS=" ";OFS="-" }{print $1,$2,$3}'
```

### `sed命令`

- sed 是一个轻量级编辑器，主要用来对数据进行选取、替换、替换和新增操作
- sed [选项] '[动作]' 文件名
- 所有的动作都必须用单号号括起来
- 类型类似于批量 vi 操作

`1. 动作`

| 参数 | 含义 | 示例 |
| :-- | :-- | :-- |
| a | 追加，在每一行或者指定行下面添加一行或多行 | sed '1a newline' score.txt |
| c | 行替换，用 c 后面的字符串替换掉原始整个数据行 | sed 'c newline' score.txt |
| s | 字符串替换,用一个字符串替换另外一个字符串，格式为 "行范围 s/旧字符串/新字符串/g" | sed '3s/lisi/lisisi/g' score.txt |
| i | 插入，在当前行插入一行或多行 | sed '1i newline' score.txt |
| d | 删除指定的行 | sed '1,2d' score.txt |
| p | 打印,输出指定的行 | sed -n '2p' score.txt |

`2. 选项`

| 参数 | 含义 | 示例 |
| :-- | :-- | :-- |
| -n | 一般 sed 命令会把所有的数据都输出到屏幕上，如果加入此选项则只会把处理过的行输出到屏幕上 | sed -n '2p' score.txt |
| -e | 允许对输入数据应用多条 sed 编辑命令 | sed -e 's/91/92/g;s/81/82/g' score.txt |
| -i | 用 sed 的修改直接修改编辑的文件，而不是在屏幕上输出 | sed -i '1i newline' score.txt |

### `排序命令sort`

- sort [选项] 文件名
- 选项

| 选项 | 含义 | 命令 |
| :-- | :-- | :-- |
| -f | 忽略大小写 | sort -f -t ":" -n -k 5,5 /etc/passwd |
| -n | 以数值型进行排序，默认使用字符串顺序 | sort -t ":" -n -k 3,3 /etc/passwd |
| -r | 反向排序，默认从小到大 | sort -r /etc/passwd |
| -t | 指定分割符，默认分割符是制表符 | sort -t ":" -k 3,3 /etc/passwd |
| -k n[,m] | 按照指定的字段范围排序。从第 n 个字段开始，到第 m 个字段结束，默认是到行尾 | sort -t ":" -k 3,3 /etc/passwd |

```shell
sort /etc/passwd
sort -r /etc/passwd
sort -t ":" -k 3,3 /etc/passwd
```

### `wc`

- wc [选项] 文件名, wc wc.txt
- -l 只统计行数
- -w 只允许单词数
- -m 只统计字符数

## `流程控制`

### `条件判断`

`1. 按照文件类型进行判断`

| 选项 | 含义                           |
| :--- | :----------------------------- |
| -d   | 文件是否存在并且是目录         |
| -e   | 文件是否存在                   |
| -f   | 文件是否存在并且是普通文件     |
| -b   | 文件是否存在并且是块设备文件   |
| -c   | 文件是否存在并且是字符设备文件 |
| -L   | 文件是否存在并且是链接文件     |
| -p   | 文件是否存在并且是管道文件     |
| -s   | 文件是否存在并且是否为非空     |
| -S   | 文件是否存在并且是套接字文件   |

```shell
touch 1.txt
test -e 1.txt
[-e 1.txt]
echo $?
```

exist.sh

```shell
[ -e 1.txt ]&&echo "yes"|| echo "no"
yes
[ -e 11.txt ]&&echo "yes"|| echo "no"
no
```

`2. 按照文件权限进行判断`

| 选项 | 含义                               |
| :--- | :--------------------------------- |
| -r   | 文件是否存在，并且是否拥有读权限   |
| -w   | 文件是否存在，并且是否拥有写权限   |
| -x   | 文件是否存在，并且是否拥有执行权限 |

```shell
echo read  > read.txt
echo write  > write.txt
echo execute  > execute.txt

chmod u+w write.txt
chmod u+x execute.txt

[ -r read.txt ]&&echo "read yes"|| echo "no"
[ -w write.txt ]&&echo "write yes"|| echo "no"
[ -x execute.txt ]&&echo "execute yes"|| echo "no"
```

`3. 个文件间的比较`

| 选项   | 含义                                                                |
| :----- | :------------------------------------------------------------------ |
| 文件 1 | -nt 文件 2 判断文件 1 的修改时间是否比文件 2 的新                   |
| 文件 1 | -ot 文件 2 判断文件 1 的修改时间是否比文件 2 的旧                   |
| 文件 1 | -ef 文件 2 判断文件 1 和文件 2 的 inode 号是否一致,可用于判断硬链接 |

```shell
[ write.txt -nt read.txt ]&&echo "write is older than read"|| echo "no"
[ read.txt -ot write.txt ]&&echo "read is older than write"|| echo "no"
ln execute.txt execute2.txt
[ execute.txt -ef execute2.txt ]&&echo "execute and execute2.txt are the same"|| echo "no"
```

`4. 两个整数间的比较`

| 选项   | 含义                                      |
| :----- | :---------------------------------------- |
| 整数 1 | -eq 整数 2 判断整数 1 是否和整数 2 相等   |
| 整数 1 | -ne 整数 2 判断整数 1 是否和整数 2 不相等 |
| 整数 1 | -gt 整数 2 判断整数 1 是否大于整数 2      |
| 整数 1 | -lt 整数 2 判断整数 1 是否小于整数 2      |
| 整数 1 | -ge 整数 2 判断整数 1 是否大于等于整数 2  |
| 整数 1 | -le 整数 2 判断整数 1 是否小于等于整数 2  |

```shell
[ 2 -eq 2 ]&&echo "2==2"|| echo "no"
[ 3 -ne 2 ]&&echo "2!=2"|| echo "no"
[ 3 -gt 2 ]&&echo "2>2"|| echo "no"
[ 1 -lt 2 ]&&echo "2<2"|| echo "no"
[ 2 -ge 2 ]&&echo "2>=2"|| echo "no"
[ 2 -le 2 ]&&echo "2<=2"|| echo "no"
```

`5. 字符串的判断`

| 选项                 | 含义                               |
| :------------------- | :--------------------------------- |
| -z 字符串            | 判断字否串是否为空                 |
| -n 字符中            | 判断字符串是否为非空               |
| 字符串 1 == 字符串 2 | 判断字符串 1 是否和字符串 2 相等   |
| 字符串 1 != 字符串 2 | 判断字符串 1 是否和字符串 2 不相等 |

```shell
name=aslkami
[ -z "$name" ]&&echo "空"|| echo "非空"
[ -n "$name" ]&&echo "非空"|| echo "空"
name2=aslkami
[ "$name" == "$name2" ]&&echo "相等"|| echo "不相等"
[ "$name" != "$name2" ]&&echo "不相等"|| echo "相等"
```

`6. 多重条件判断 `

| 选项   | 含义             |
| :----- | :--------------- |
| 判断 1 | -a 判断 2 逻辑与 |
| 判断 1 | -o 判断 2 逻辑或 |
| !判断  | 逻辑非           |

```shell
[ 2 -gt 1 -a 3 -gt 2 ]&&echo "yes"|| echo "no"
[ 2 -gt 1 -a 3 -gt 4 ]&&echo "yes"|| echo "no"
[ 2 -gt 1 -o 3 -gt 4 ]&&echo "yes"|| echo "no"
[ ! 3 -gt 4 ]&&echo "yes"|| echo "no"
```

### `单分支if语句`

- if 语句使用 fi 结尾
- [条件判断式]就是使用 test 命令进行判断，所以中括号和条件判断式之间必须有空格
- then 后面跟符合条件之后执行的程序，可以放在[]之后，用;分隔，也可以换行，不用;

`1. 语法`

```sehll
if [条件判断];then
 代码体
fi

if [条件判断]
then
 代码体
fi

if [ 2 -gt 1 ];then echo bigger; fi

if [ 2 -gt 1 ]
then
 echo bigger
fi
```

`2. 判断当前用户是否是root用户`

isRoot.sh

```shell
#!/bin/bash
user=$(whoami)
user=`whoami`
if [ "$user" == root ]
then
echo "我是root用户"
fi
```

### `双分支if语句`

`1. 语法`

```shell
if [条件判断]
then
 代码体1
else
 代码体2
fi
```

`2. 判断是否目录`

isDir.sh

```shell
#!/bin/bash
read -t 10 -p "请输入一个路径" dir
if [ -d "$dir" ]
then
  echo "$dir是目录"
else
  echo "$dir不是目录"
fi
```

### `多分支if语句`

`1. 语法`

```shell
if [条件判断1]
then
 代码体1
elif [条件判断2]
 代码体2
else
 代码体3
fi
```

grade.sh

```shell
#!/bin/bash
read -p "请输入一个分数" grade
if [ "$grade" -gt 90 ]
 then
  echo 优秀
elif [ "$grade" -gt 80 ]
  then
   echo 良
else
   echo 差
fi
```

### `case 语句`

- case 和 if 都是多分支判断语句,if 能判断多个条件,case 只能判断一个条件

`1. 语法`

```shell
case 变量名 in
值1)
  代码块1
  ;;
值2)
  代码块2
 ;;
*)
  代码块3
 ;;
esac
```

case.sh

```shell
#!/bin/bash
read -p "yes or no?" -t 30 choose
case $choose in
  "yes")
    echo '是'
    ;;
  "no")
    echo "否"
   ;;
  *)
    echo 其它
   ;;
esac
```

### `for循环`

`1. 语法`

```shell
for 变量 in 值1 值2 值3
do
代码块
done
```

for.sh

```shell
#!/bin/bash
for i in 1 2 3
do
 echo $i
done
```

`2. 语法`

```shell
#!/bin/bash
for((i=1;i<=10;i++));
do
 echo $(($i));
done
```

### ` while循环`

- while 循环是不定循环，也称为条件循环，只要条件判断成立，就会一直继续

```shell
while [条件判断式]
do
 代码块
done
```

while.sh

```shell
#!/bin/bash
i=1
result=0
while [ $i -le 100 ]
 do
   result=$(($result+i))
   i=$(($i+1))
 done
echo $result
```

### `until循环`

- 直到条件不成立停止

until.sh

```shell
#!/bin/bash
i=1
result=0
until [ $i -gt 100 ]
 do
   result=$(($result+i))
   i=$(($i+1))
 done
echo $result
```

## `函数`

- linux shell 可以用户定义函数，然后在 shell 脚本中可以随便调用
- 可以带 function fun() 定义，也可以直接 fun() 定义,不带任何参数
- 调用函数不需要加()

### `简单函数`

```shell
[ function ] funcName [()]
{
    action;
    [return int;]
}

start(){
>  echo start
> }
 start


 #!/bin/bash
start(){
 echo start
}
start
```

### `返回值`

- 参数返回，可以显示加：return 返回，如果不加，将以最后一条命令运行结果，作为返回值

```shell
sum(){
>  result=$(($1+$2))
>  return $result
> }
sum4 2 3
echo $?
5
```

### `参数说明`

| 参数处理 | 说明                                                         |
| :------- | :----------------------------------------------------------- |
| $#       | 传递到脚本的参数个数                                         |
| $\*      | 以一个单字符串显示所有向脚本传递的参数                       |
| $@       | 与$\*相同，但是使用时加引号，并在引号中返回每个参数          |
| $$       | 脚本运行的当前进程 ID 号                                     |
| $?       | 显示最后命令的退出状态。0 表示没有错误，其他任何值表明有错误 |

## `shell实战`

### `注意事项`

- 开头加解释器: #/bin/bash 和注释说明
- 命名建议规则: 变量名大写、局部变量小写，函数名小写，名字体现出实际作用
- 默认变量是全局的，在函数中变量 local 指定为局部变量，避免污染其它作用域
- set -e 遇到执行非 0 时退出脚本, set -x 打印执行过程
- 写脚本一定要先测试再上生产环境

### `检查主机存活状态`

ip.sh

```shell
#!/bin/bash
for IP in $@; do
  if ping -c 1 $IP &>/dev/null; then
     echo "$IP is ok."
  else
     echo "$IP is wrong!"
  fi
done

sh ip.sh 127.0.0.1
```
