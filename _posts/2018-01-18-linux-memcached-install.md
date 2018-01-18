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
/usr/bin/memcached -p 11211 -m 128m -i 10.0.42.1 -d -uroot
```

