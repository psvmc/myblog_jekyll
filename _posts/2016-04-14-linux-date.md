---

layout: post
title: Linux 时间设置
description: Linux时间设置
keywords: linux
category: linux

---



## 阿里时间同步(推荐)

### 1. 安装chrony（时间同步客户端）

ubuntu/debian:

```
apt-get install chrony
```
Centos/redhat/alios:

```
yum install chrony
```

### 2. 删除默认Server

```
sed -i "/server/d" /etc/chrony.conf
```

### 3. 打开/etc/chrony.conf，新增一行:

```
server ntp.aliyun.com iburst
```

### 4. 重启chrony

```
/etc/init.d/chronyd restart
```

或者

```
systemctl restart chronyd
```

### 5. 查看是否正常

```
chronyc tracking
```



## 时间设置

### 查看当前时间

`date`

### 设置日期

`date -s 06/18/14`

### 设置时间

`date -s 14:20:50`

### 将当前时间写入BIOS

`hwclock -w`
或
`hwclock --systohc`


## 硬件时间设置

### 查看硬件时间(BIOS时间)

`hwclock  --show` 
或 
`hwclock  -r` 
或 
`clock  --show` 
或
`clock  -r`


### 设置硬件时间

`hwclock --set --date="04/14/16 07:37"` （月/日/年 时:分:秒）

或者

`clock --set --date="04/14/16 07:37"` （月/日/年 时:分:秒）

## 时间同步

### 设置系统时间为当前的硬件时间

`hwclock --hctosys`  

或者   

`clock --hctosys`   

或者

`hwclock -s`  

或者   

`clock -s`   


**hc**代表**硬件时间**，**sys**代表**系统时间**，即用硬件时钟同步系统时钟

### 设置硬件时间为当前的系统时间

`hwclock --systohc` 

或者

`clock --systohc`  

或者

`hwclock -w`  

或者

`clock -w`  


## 修改时区

不用重启立即生效的方法

比如我的`时区`是`中国上海`，那么就可以使用如下的命令来使得时区的更改生效

```
yum -y install ntp
rm -rf /etc/localtime
ln -s /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
/usr/sbin/ntpdate -u pool.ntp.org
```

## 同步网络时间

tpd是linux`自动同步时间服务`，它提供`ntpdate`命令让用户可以手动同步时间服务器的时间

如果机器上没有安装该服务 可以用yum安装

`yum install ntp -y`

同步时间命令

`ntpdate 0.centos.pool.ntp.org`

返回类似

```
14 Apr 08:25:58 ntpdate[11181]: adjust time server 110.75.186.247 offset -0.002516 sec
```

就说明成功了

## 自动同步时间

### 推荐用该方法 效果与下面的一样

输入命令

`crontab -e`

添加如下内容 保存

`*/10 * * * *  /usr/sbin/ntpdate -u pool.ntp.org >/dev/null 2>&1`

重启服务

`service crond restart`

### 让linux从time.windows.com自动同步时间

输入命令

`vi /etc/crontab`  

添加如下内容 保存  

`*/10 * * * * root ntpdate -s time.windows.com`  
`time.windows.com` 是一个时间服务器.

重启服务

`service crond restart`

### 同步本地服务器时间

如果我们有一个服务器群  其中只有一个服务器(服务器A)能访问外网  这时候就需要设置其它的服务器来同步服务器A的时间 服务器A则同步国际标准时间服务器的时间

#### 服务器A上设置时间服务器

假设`服务器A`的IP为`192.168.0.110`

1) 安装服务

`yum -y install ntp`  或者自己下载rpm安装`rpm -ivh ntp-4.1.2-4.EL3.1.i386.rpm`

2) 修改配置

打开配置文件

`vi /etc/ntp.conf`

注释一行

`restrict default ignore`

加入一行

`restrict default mask 255.255.255.0 notrust nomodify notrap`

3) 服务器A同步国际服务器时间

`vi /etc/ntp/step-tickers`

加入一行

`pool.ntp.org`

这样每次ntpd启动时，会自动连接该国际标准时间服务器；

4) 启动时间服务器

`service ntpd start`

5) 查看端口是否以udp方式开放

`netstat -an | grep 123`

#### 时间客户端配置

1) 验证时间服务器是否可用

`ntpdate 192.168.0.110`

2) 配置定时任务

`crond -e`

添加一下配置 保存退出

`0-59/10 * * * * /usr/sbin/ntpdate 192.168.0.110`

表示每隔10分钟同步一次时间


### 科普定时任务的相关命令

直接修改`vi /etc/crontab`相当于系统级的定时任务  
需要指定用户  
一般情况下不推荐

用`crontab`操作则会以创建者的身份运行定时任务  
添加的任务保存在`/var/spool/cron`目录下  
比如root用户的定时任务 就会生成一个`root文件`

```
crontab

-u  指定一个用户
-l  列出某个用户的任务计划
-r  删除某个用户的任务
-e  编辑某个用户的任务
```

如

1）查询用户root的所有定时任务

`crontab -u root -l`  
也可以用`crontab -l` 列出当前用户的所有定时任务

2）编辑当前用户定时任务  

`crontab -e`

3）删除当前用户所有定时任务  

`crontab -r`



## 常用命令组合

先同步时间 查看后 写入BIOS 查看硬件时间

```
ntpdate 0.centos.pool.ntp.org
date
hwclock -w
hwclock -r
```