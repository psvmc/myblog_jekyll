---

layout: post
title: Tomcat配置
description: Tomcat虚拟主机配置
keywords: tomcat配置
category: tomcat

---
## 配置为服务(windows)

	service.bat install tomcat7
	
> tomcat7为配置成的服务名，可自定义

## 内存配置-绿色版（catalina.bat）

在开始添加
<pre>
set JAVA_OPTS=-Xms256m -Xmx512m -Xss256K -XX:PermSize=64m -XX:MaxPermSize=128m 
</pre>

## 内存配置-安装版

在java选项卡的Java Options中添加
<pre>
-XX:PermSize=64M
-XX:MaxPermSize=128M
-XX:ReservedCodeCacheSize=24M
</pre>

## 主机头配置

### 默认配置

	<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
		<Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs" prefix="localhost_access_log." suffix=".txt"  pattern="%h %l %u %t &quot;%r&quot; %s %b" />
	</Host>

### 配置1

	<Host name="www.aaa.com"  appBase="webapps" unpackWARs="true" autoDeploy="true">
		<Context path="" docBase="aaa" debug="0"/>
	</Host>

### 配置2

	<Host name="www.bbb.com"  appBase="webapps" unpackWARs="true" autoDeploy="true">
		<Context path="" docBase="D:/Program Files (x86)/apache-tomcat-7.0.55/webapps/bbb" debug="0"/>
	</Host>

### 配置3

	<Host name="www.ccc.com"  appBase="D:/webapps" unpackWARs="true" autoDeploy="true">
		<Alias>www.ddd.com</Alias>
		<Context path="" docBase="ccc" debug="0"/>
	</Host>

### 测试准备

> tomcat的`webapps`目录下有两个项目为`aaa`和`bbb`  
> 在`D:/webapps`目录下有一个项目`ccc`

### 测试结果

- 默认配置
> 加了日志 
> > 可以通过`http://localhost:8080/aaa`访问aaa项目   
> > 可以通过`http://localhost:8080/bbb`访问bbb项目   
> > 可以通过`http://localhost:8080/ccc`访问ccc项目   

- 配置1
> 添加了域名 
> 添加了Context配置
> > 只能通过`http://www.aaa.com:8080`访问aaa项目   

- 配置2
> docBase用了绝对路径 
> > 只能通过`http://www.bbb.com:8080`访问bbb项目  

- 配置3
> appBase用了绝对路径  
> 使用了别名Alias 
> > 可以通过`http://www.ccc.com:8080`访问ccc项目  
> > 可以通过`http://www.ddd.com:8080`访问ccc项目 

### 总结

>  appBase与docBase没有什么必然的关系  
>  如果docBase用相对路径，则是相对appBase来看的  
>  别名只能为域名，不能为www.aaa.com/aa这样的  
>  个人建议：如果一个tomcat带多个项目的话，并且有的是测试的有的已绑定域名，最好把绑定域名的和测试的分到两个appBase中
  
## 配置多个端口

	<Connector port="8080" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />
	<Connector port="8088" protocol="HTTP/1.1" connectionTimeout="20000" redirectPort="8443" />

> 只需多添加一个Connector就行，但只是8080与8088访问同样的东西，没啥用    
> 不建议配置多个端口   
> 多个项目不要放在同一个文件夹中,也就是host配置下的appBase目录中只有一个项目   

## 推荐设置

应该把如上项目分别再放到a和b文件夹中  

	<Host name="www.aaa.com"  appBase="data/webapps/a" unpackWARs="true" autoDeploy="true">
		<Context path="" docBase="aaa" debug="0"/>
	</Host>
	<Host name="www.bbb.com"  appBase="data/webapps/b" unpackWARs="true" autoDeploy="true">
		<Context path="" docBase="bbb" debug="0"/>
	</Host>

如下配置会导致项目名为aaa和bbb项目各重复发布两次  

	<Host name="www.aaa.com"  appBase="data/webapps" unpackWARs="true" autoDeploy="true">
		<Context path="" docBase="aaa" debug="0"/>
	</Host>
	<Host name="www.bbb.com"  appBase="data/webapps" unpackWARs="true" autoDeploy="true">
		<Context path="" docBase="bbb" debug="0"/>
	</Host>

