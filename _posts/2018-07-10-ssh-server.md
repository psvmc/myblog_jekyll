---
layout: post
title: 服务器默认过一段时间就自动断开SSH连接的解决方法
description: 服务器默认过一段时间就自动断开SSH连接的解决方法
keywords: ssh 阿里云
categories: 
        - ssh
        - centos

---



## 正文

阿里云服务器默认过一段时间就自动断开SSH连接了，很是蛋疼。
下面写一下解决办法:

```bash
vim /etc/ssh/sshd_config
```

找到下面两行

```bash
#ClientAliveInterval 0
#ClientAliveCountMax 3
```

去掉注释，改成

```bash
ClientAliveInterval 30
ClientAliveCountMax 86400
```

这两行的意思分别是

+ 1、客户端每隔多少秒向服务发送一个心跳数据
+ 2、客户端多少秒没有相应，服务器自动断掉连接

重启sshd服务

```bash
service sshd restart
```


