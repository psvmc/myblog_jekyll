---
layout: post
title: 邮件服务器异常排查
description: 邮件服务器异常排查
keywords: email
categories: email

---



## 各端口作用



+ 25：smtp是服务器用来接收和发送邮件的，客户端来发送邮件的。（这个端口是不能更改的）
+ 110：是pop客户端用来接收邮件的
+ 143：imap客户端用来接收邮件的。
+ 465：smtp的加密端口用来发送邮件的
+ 995：pop的加密端口客户端用来接收邮件的。



## 无法接收邮件

首先邮件发送的过程中，需要解析“收件人的域名”的MX与A记录，下面是测试这2个记录的步骤。

+ 测试MX解析和A解析
+ 测试25端口

只有对方域名的解析记录都正常，才可以成功发送邮件到达对方

解析MX和A记录后还需要连接“收件人邮件服务器”的25端口，这里也将介绍怎么测试对方服务器的25端口通不通。（只有对方服务器的25端口正常，才可以成功发送邮件到达对方）。

我在测试时一下的都没问题  后来发现是安装了一个邮件网关导致的 卸载就好了

### 测试MX纪录

打开命令提示符窗口，先输入`nslookup`

然后输入`set type=mx`

接着输入您的域名（这里以`psvmc.cn`域名为例)

```bash
nslookup
set type=mx
psvmc.cn
```

出现一下 则证明成功

```
Non-authoritative answer:
psvmc.cn mail exchanger = 10 mail.psvmc.cn.
```

记得以上的`mai.psvmc.cn`

是因为我们配置的`MX`纪录

| 记录类型 | 主机纪录 | 纪录值          |
| -------- | -------- | --------------- |
| MX       | @        | mai.psvmc.cn    |
| A        | mail     | xxx.xxx.xxx.xxx |

然后要测试A解析是否成功

### 测试A纪录

打开命令提示符窗口，先输入`nslookup`

然后输入`set type=a`

接着输入您的域名`mai.psvmc.cn`

```bash
nslookup
set type=a
mail.psvmc.cn
```

出现一下这成功

```
Non-authoritative answer:
Name:	mail.psvmc.cn
Address: xxx.xxx.xxx.xxx
```

### 测试25端口

打开命令提示符窗口 输入

```bash
telnet mail.psvmc.cn 25
```

出现一下则25端口可以访问

```bash
220 mail.psvmc.cn ESMTP
```

退出

```bash
quit
```



## 无法发送邮件

