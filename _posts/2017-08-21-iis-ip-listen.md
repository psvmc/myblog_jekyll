---

layout: post
title: IIS项目只监听127.0.0.1导致外网无法访问
description: IIS项目只监听127.0.0.1导致外网无法访问
keywords: iis
category: iis

---



服务器莫名其妙只能内网访问  网上基本上都是说是防火墙的问题  
发现用命令查看
  
```
netstat -ano|findstr 9000
```  

发现里面没有类似 `0.0.0.0:9000`的


解决方法

+ 【`httpcfg delete iplisten -i 127.0.0.1`】（IIS6适用）
+ 【`netsh http delete iplisten ipaddress=127.0.0.1`】（IIS7/7.5适用）