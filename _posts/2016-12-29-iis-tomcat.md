---

layout: post
title: IIS 反向代理 Tomcat中的网站
description: IIS 反向代理 Tomcat中的网站
keywords: iis
categories: iis

---

## 前言

之前说过用`Apache`和`Nginx`做代理来访问`Tomcat`中的项目  
现在因工作需要 只能用IIS作为Web服务器来把请求转发到Tomcat  

我现在知道的共有四种实现方式  

+ 使用`isapi_redirect.dll`实现
+ Weblogic的插件包中的`iisforward.dll`、`iisproxy.dll`来实现
+ ARR(Application Request Routing)
+ HttpPlatformHandler

我最终使用的是第三种方式 下面说一下各个方式的优缺点  

+ 第一种方式需要修改注册表（网上说的也可以不用添加注册表 我通过这种方式没有成功）  
+ 第二种方式 新版本的Weblogic的插件包中不包含**iisforward.dll**
+ 第三种只支持IIS7以上
+ 第四种 相当于 Tomcat由IIS托管 不但要配置IIS 还有修改Tomcat的默认配置 所以不建议


## 安装软件

在Win10以下的系统中直接在官网下载[ARR](https://www.iis.net/downloads/microsoft/application-request-routing)和[Microsoft URL 重写模块 2.0](http://www.microsoft.com/zh-cn/download/details.aspx?id=7435) 安装就可以了  

但是 他要求的`IIS7`以上 却不能识别`Win10`上的`IIS10` 但其实是能用的    
这里放出我修改过的安装包[ARR](https://pan.baidu.com/s/1kV0lPrD)和[Microsoft URL 重写模块 2.0](https://pan.baidu.com/s/1c2Ftq9M)

安装之后重启iis 

```
iisreset
```

## 配置


安装完成后 在服务器级别的功能试图中 会多出两项 

+ `Application Request Routing`
+ `URL重写`

网站级别的功能试图中 会多一项

+ `URL重写`

点击 `Application Request Routing`后  
点击右边的`Server Proxy Settings`  
勾选`Enable proxy`后  点击右侧的`应用`

点击项目级别的功能试图中的`URL重写`

首先需要知道的是  
IIS不能配置如Apache中的`ProxyPassReverseCookiePath /yxemail /`来矫正Cookie的路径  
所以IIS配置反向代理的时候就**不能带项目名** 带项目名就会导致Session失效  
也就是说IIS做反向代理 又要考虑Session 就必须去掉Tomcat中项目访问链接中的项目名  
Tomcat中要配置一个HOST  
IIS中要配置**URL地址的入站规则** 和 **HTTP响应头或内容的出站规则**


### 配置Tomcat

```
<Host name="www.aaa.com"  appBase="C:/Program Files/Tomcat 7.0/webapps_me" unpackWARs="true" autoDeploy="true">  
	<Context path="" docBase="yxemail" debug="0"/>  
</Host>  
```

需要注意的是 appBase一定要换一个路径 因为每个`Host` 中 `appBase`中的项目 在`Tomcat`启动时会重新加载  
所以多个`Host`中的`appBase`一样的话 就会导致一个项目被加载多遍

这样 网站目前可以用`www.aaa.com:8080`访问

### 配置IIS

添加一个网站 主机名设置为`www.aaa.com`  端口`80`

点击 `URL重写`  

#### 入站规则

添加规则 选择`入站规则`中的`空白规则`  

|设置项名称|设置项内容|
|-|-| 
|名称|随便写|
|模式|{SERVER_PORT}设置为80  {HTTP_HOST}设置为www.aaa.com|
|条件|(.*)|
|重写URL|http://www.aaa.com:8080/{R:0}|

#### 出站规则

所谓的出站规则就是返回的html内容根据规则替换里面的url

添加规则 选择`出站规则`中的`空白规则`  

|设置项名称|设置项内容|
|-|-| 
|名称|随便写|
|匹配范围|响应|
|匹配一下范围中的内容|除自定义外全选|
|模式|(.*):8080/(.*)|
|操作类型|重写|
|操作属性|http://www.aaa.com/{R:2}|


这样的话就能用`www.aaa.com`来访问`www.aaa.com:8080`的网站了

