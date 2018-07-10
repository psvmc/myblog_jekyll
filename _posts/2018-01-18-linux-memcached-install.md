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

### 服务形式


#### CentOS7

启动

```bash
systemctl restart memcached.service
```

配置文件路径

```bash
vi /etc/sysconfig/memcached
```

#### CentOS6

启动

```bash
service memcached start
```

配置文件路径

```bash
vi /etc/init.d/memcached
```



### 非服务形式

启动

```bash
/usr/bin/memcached -p 11211 -u root -m 256 -c 10240
```



**memcached的基本设置**：

+ -p 监听的端口
+ -l 连接的IP地址, 默认是本机
+ -d start 启动memcached服务
+ -d restart 重起memcached服务
+ -d stop|shutdown 关闭正在运行的memcached服务
+ -d install 安装memcached服务
+ -d uninstall 卸载memcached服务
+ -u 以的身份运行 (仅在以root运行的时候有效)
+ -m 最大内存使用，单位MB。默认64MB
+ -M 内存耗尽时返回错误，而不是删除项
+ -c 最大同时连接数，默认是1024
+ -f 块大小增长因子，默认是1.25
+ -n 最小分配空间，key+value+flags默认是48
+ -h 显示帮助



关闭

```bash
pkill -9 memcached
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

