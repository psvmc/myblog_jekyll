---

layout: post
title: Linux 安装Memcached
description: Linux 安装Memcached
keywords: memcached linux
categories: 
        - memcached
        - linux

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
