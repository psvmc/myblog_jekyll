---

layout: post
title: linux基本操作
description: linux基本操作
keywords: linux
category: linux

---

## 查看系统信息

`lsb_release -a`

结果类似于

```
LSB Version:	:core-4.1-amd64:core-4.1-noarch
Distributor ID:	CentOS
Description:	CentOS Linux release 7.2.1511 (Core) 
Release:	7.2.1511
Codename:	Core
```

## 清屏

`clear` 

## 创建文件夹

`mkdir abc`

## 修改权限

`chmod 777 ./test`   
`chmod -R 777 ./test`  包含子目录

## 复制

`cp` 
 
## 查找 

`find -name "*case.html*"`

## 删除文件

`rm -rf ./a.txt`  
 
- -r 递归删除
- -f不提示
- -i交互式删除  

## 移动

`mv 1.txt 2.txt` `重命名`  
`mv ./1.txt ./2/2.txt` `移动`

## 压缩

`zip -r  ./aa.zip ./aa`

## 分卷压缩  

`zip -r -s 100m ./test.zip ./test/`

## 解压缩 
 
`unzip -o ./test.zip `

## 查看文件/文件夹大小 
 
`du -sh /home`

## 查看端口占用  

`lsof -i:8009`


## 查询内存信息
`top`  

+ m:按内存占用率排序  

## 根据端口查询进程id

`lsof -i:8080`

## 根据进程名查询进程id

`ps -ef | grep java`

## 结束PID为1000的进程 
 
`kill -9 1000`

## 查询IP地址

`ifconfig | grep "inet " | grep -v 127.0.0.1`



 
