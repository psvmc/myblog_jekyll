---

layout: post
title: Idea运行Tomcat 报 java.net.UnknownHostException
description: Idea运行Tomcat 报 java.net.UnknownHostException
keywords: idea
categories: idea

---


## 前言

Idea中使用Tomcat作为应用服务器启动时经常 报

```java
java.net.MalformedURLException: Local host name unknown: java.net.UnknownHostException
```

并且只有JDK为`1.7`的时候才会出现  `1.6`和`1.8`均正常   

这是OSX上JDK的一个BUG

解决方法   

```bash
sudo scutil --set HostName localhost
```

查看

```bash
scutil --get HostName
```