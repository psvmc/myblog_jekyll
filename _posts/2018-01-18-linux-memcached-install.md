---
layout: post
title: Linux 安装Memcached
description: Linux 安装Memcached
keywords: memcached linux yum
categories: memcached linux yum

---

## 安装Memcached

安装依赖

```bash
yum install libevent libevent-deve
```

安装MemCached

```bash
yum install memcached
```

## 运行Memcached

```bash
service memcached start
```

或者

```bash
/usr/bin/memcached -p 11211 -m 128m -d -uroot
```

## 设置开机自启

```bash
chkconfig memcached on
```

## 验证

连接

```bash
telnet 192.168.1.55 11211
```

设置并保存值

```bash
set psmvc 0 100 9
zhangjian
```

+ `psvmc`:存储的key
+ `0`:可以包括键值对的整型参数，客户机使用它存储关于键值对的额外信息 
+ `100`:过期的时间(以秒为单位, 0 表示永远)
+ `9`:缓存中存储的字节数
+ `zhangjian`:存储的内容

取值

```bash
get psvmc
```

退出

```bash
quit
```

## 防火墙添加信任规则

打开文件

```bash
vim /etc/sysconfig/iptables
```

添加规则

```
-A INPUT -m state --state NEW -m tcp -p tcp --dport 11211 -j ACCEPT
```

重启防火墙

```
service iptables restart 
```

