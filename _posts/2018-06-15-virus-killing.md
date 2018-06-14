---
layout: post
title: Centos上病毒查杀方式
description: Centos上病毒查杀方式
keywords: centos
categories: 
	- centos
	- linux	

---



## 删除恶意定时任务

常见定时任务文件位置

```bash
cd /var/spool/cron/
```

位置2

```bash
cd /etc/cron.d
```



## 挖矿恶意程序

挖矿程序

```bash
ps aux | grep minerd
```

查找位置

```bash
ps -ef|grep minerd
```

查找

```bash
find / -name minerd
```



```bash
cd /var/tmp/ 
```



查看所有的服务

```bash
chkconfig --list
```

关闭访问挖矿服务器的访问

```bash
iptables -A INPUT -s xmr.crypto-pool.fr -j DROP
iptables -A OUTPUT -d xmr.crypto-pool.fr -j DROP
```

删除进程

```bash
pkill minerd
```

