---

layout: post
title: CentOS安装后 没有分配IP的解决方法
description: CentOS安装后 没有分配IP的解决方法
keywords: linux
category: linux

---

## CentOS无法获取IP地址

## 查询IP信息

`ifconfig`

## 设置步骤

Centos 初次安装时不能获取IP地址，需要做一些简单设置 

+ 进入`/etc/sysconfig/network-scripts/`目录中，可以看到`ifcfg-eth0`文件 
+ `vi ifcfg-eth0`编辑文件 
+ 将`ONBOOT=no`选项改成`ONBOOT=yes`
+ 保存退出 
+ 重新启动网络服务 
+ `service network restart` 
+ 网卡即激活成功。



