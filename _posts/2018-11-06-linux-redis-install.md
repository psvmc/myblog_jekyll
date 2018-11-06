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

## 连接             

使用redis  desktop manager连接redis