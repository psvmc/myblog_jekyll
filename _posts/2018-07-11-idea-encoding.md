---
layout: post
title: IDEA 控制台中文乱码的解决方式
description: IDEA 控制台中文乱码的解决方式
keywords: idea 乱码
categories: 
        - idea
        - encoding

---



## 正文

### 项目编码及IDE编码

进入`Preferences  `-> `Editor`->`File Encodings`

+ 把`IDE Encoding`和`Project Encoding`配置为`UTF-8`
+ 同时将下面的`Default encoding for properties files`也配置为`UTF-8`

### 项目启动服务器参数

在tomcat配置中

在`Server`->`VM options` 项中添加 

```bash
-Dfile.encoding=UTF-8
```

`Startup/Connection` 中`Run`中添加`environment variables`

```bash
JAVA_TOOL_OPTIONS=-Dfile.encoding=UTF-8
```



