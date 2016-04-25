---

layout: post
title: Tomcat 日志及参数的乱码问题
description: Tomcat 日志及参数的乱码问题
keywords: tomcat
category: tomcat

---

## 查看系统语言

`echo $LANG`

显示`zh_CN.UTF-8`说明系统支持中文编码

## 查看系统是否有中文包

`locale`

## 安装中文包

`yum groupinstall chinese-support`

## Tomcat乱码解决

假设编码用`utf-8`
 
### tomcat日志乱码

#### 设置系统编码

先设置系统编码

`vi /etc/sysconfig/i18n`

默认为:

``` 
LANG="en_US.UTF-8"
SYSFONT="latarcyrheb-sun16"
```
修改为:

```
LANG="zh_CN.UTF-8"
SUPPORTED="zh_CN.UTF-8:zh_CN:zh"
SYSFONT="latarcyrheb-sun16"
```

保存后执行

```
source /etc/sysconfig/i18n
```

#### 设置jvm编码

1) 从tomcat的bin目录的sh启动tomcat

在`catalina.sh`找到`JAVA_OPTS`配置为`JAVA_OPTS="-Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8"`

注：这个参数必须在jvm启动时加上，在程序中通过设置`system property`的方式是没有效果的，原因是jvm启动时读取`file.encoding`并`cache`，后续只使用启动时读取的编码。	
后续:

我之前直接在`catalina.sh`的最上方添加了`JAVA_OPTS="-Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8"`配置   
但是发现配置并不生效  日志仍为乱码  
原来`catalina.sh`中间位置有个这样的配置`JAVA_OPTS=`  
他又把`JAVA_OPTS`给置空了 怪不得配置不生效  

解决方法有两种  

+ 在`JAVA_OPTS=`后面直接添加编码配置
+ 在下一行添加 `JAVA_OPTS="$JAVA_OPTS -Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8"`

推荐后面这一种  不修改原配置  添加新配置才更合理

2) 从服务中启动tomcat

如果tomcat已配置为服务 则要修改修改`/etc/rc.d/init.d`目录下对应的文件  
假如服务为`tomcat`  就修改`tomcat`文件  修改方式同上



### tomcat参数的乱码问题

这里不建议下面配置，尽量不更改服务器的配置，因为这个可以从代码中解决

解决：在`server.xml`的`connector`中增`URIEncoding="utf-8"`

## Tomcat启动老是端口占用

我启动Tomcat的时候有删日志的习惯 但是老是停止tomcat `service tomcat stop`后  
再启动tomcat`service tomcat start` 就会报端口占用

原来日志目录`tomcat/logs`下有一个文件`catalina-daemon.pid` 它是用来保存tomcat启动的进程ID  
一旦把这个文件删了  停用tomcat时  它就没杀死对应的进程 导致再次启动时 端口占用  
所以删日志文件时  千万别删`catalina-daemon.pid`这个文件