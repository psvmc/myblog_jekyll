---
layout: post
title: Linux 安装Redis
description: Linux 安装Redis
keywords: redis linux yum
categories: redis linux yum

---

## 安装Redis

直接安装

```bash
yum install redis
```



没有源 下载并安装

```bash
yum install epel-release
yum install redis
```



## 开启服务

开启方式一

```bash
service redis start
```

开启方式二

```bash
redis-server /etc/redis.conf
```

关闭服务

```bash
redis-cli  shutdown
```



## 设置开机自启

```bash
chkconfig redis on
```



## 查看运行状态

```
ps -ef | grep redis
```



## 赋值取值

进入redis服务

```bash
redis-cli
```

赋值取值

```bash
set psvmc 123456
get psvmc
```



## 防火墙设置

开放端口6379、6380的防火墙

```bash
/sbin/iptables -I INPUT -p tcp --dport 6379  -j ACCEPT   开启6379
/sbin/iptables -I INPUT -p tcp --dport 6380 -j ACCEPT  开启6380
```

保存

```bash
/etc/rc.d/init.d/iptables save  
```

## 远程连接

yum方式安装的redis配置文件通常在`/etc/redis.conf`中，打开配置文件找到

注释`bind 127.0.0.1` 就可以远程访问 如下

```bash
# bind 127.0.0.1
```

Redis3.2之后还要修改`protected-mode` 默认的`yes`改为`no`

```bash
protected-mode no
```

重启
```bash
sudo service redis restart
```




## 设置连接密码

yum方式安装的redis配置文件通常在`/etc/redis.conf`中，打开配置文件找到

```bash
#requirepass foobared  
```

去掉行前的注释，并修改密码为所需的密码,保存文件

```bash
requirepass myRedis
```

重启redis

```bash
sudo service redis restart
```

带密码连接

```bash
redis-cli -h 127.0.0.1 -p 6379 -a myRedis
```




## 客户端下载 

使用`Redis Desktop Manager`连接Redis

+ 下载地址:[`Redis Desktop Manager`](https://pan.baidu.com/s/1urtM9Uo7mS7InvIXHi56rg)  
+ 密码:h13m