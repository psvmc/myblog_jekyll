---

layout: post
title: xmpp乱码解决方案
description: xmpp乱码解决方案
keywords: xmpp
category: xmpp

---


## 描述

openfire是一个非常不错的IM服务器，而且是纯Java实现，具有多个平台的版本，他的数据存储可以采用多种数据库，如MySQL，Oracle等。  

在实际使用时大家遇到最多的就是采用MySQL数据库后的中文乱码问题，这个问题十分有趣，而且从现象上可以看出openfire内部的一些机制。  

实际问题是这样的：首先启动openfire服务器，然后利用客户端或直接登录到后台新建一个帐户，为该帐户指定一些中文的属性，如姓名等。如果不重启服务器，你永远不会觉得有什么不对的地方，因为所有的中文显示都是正常的。接下来重启一下openfire，再用建立的帐号登录客户端或进入后台管理端查看，会发现所有的中文全都变成了问号。登录到数据库中进行查看，发现所有的中文字符也均为问号，这说明了两个问题：  

1. openfire具有应用层缓存
2. 数据库编码存在问题

## 解决方法

### 数据库设置

解决办法其实也很简单，首先要保证你为openfire创建的数据库编码是utf8的，建表语句如下：

	create database openfire default character set utf8 default collate utf8_general_ci

当你原来就创建好数据库时，你可以用：

 	alter database openfire default character set utf8 default collate utf8_general_ci;


### 连接字符串设置

其次，在初始化openfire数据库，即第一次配置openfire服务器时，在连接数据库那里的连接串要加入字符编码格式，必须在连接里增加UTF8的编码要求，连接字符串设置如下：

	jdbc:mysql://127.0.0.1:3306/openfire?useUnicode=true&characterEncoding=utf8

如果已经安装完成，这个配置也是可以改动的，直接到openfire的安装目录下，找到conf/openfire.xml这样一个文件，打开找到如下的XML节，修改其中的serverURL即可

	<database>
	<defaultProvider>
	<driver>com.mysql.jdbc.Driver</driver>
	<serverURL>jdbc:mysql://127.0.0.1:3306/openfire?useUnicode=true&amp;characterEncoding=utf8</serverURL>

注意：由于&具有特殊含义，因此原`&`符号必须被转义为`&amp`;

