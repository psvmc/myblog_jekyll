---

layout: post
title: Apache Tomcat 负载均衡 集群
description: Apache Tomcat 负载均衡 集群
keywords: apache
category: apache

---

## 前言

Apache配置负载均衡和集群使用mod_jk的方式比较多。  
但是mod_jk已经停止更新，并且配置相对复杂。  
Apache2.2以后,提供了一种原生的方式配置负载均衡和集群，比mod_jk简单很多。  

## 负载均衡

### 开启所需的插件

如果下面的扩展没开启  就开启下(新版默认都开了)

去掉以下模块的注释：

```
LoadModule proxy_module modules/mod_proxy.so   #提供代理服务器功能
LoadModule proxy_balancer_module modules/mod_proxy_balancer.so  #提供负载均衡功能
LoadModule proxy_http_module modules/mod_proxy_http.so  #让代理服务器能支持HTTP协议
LoadModule proxy_ajp_module modules/mod_proxy_ajp.so #让代理服务器能支持ajp协议
# 下面是几种负载均衡策略  按需开启
LoadModule lbmethod_bybusyness_module modules/mod_lbmethod_bybusyness.so
LoadModule lbmethod_byrequests_module modules/mod_lbmethod_byrequests.so
LoadModule lbmethod_bytraffic_module modules/mod_lbmethod_bytraffic.so
LoadModule lbmethod_heartbeat_module modules/mod_lbmethod_heartbeat.so
```

添加以下模块(新版默认没开)

```
LoadModule headers_module modules/mod_headers.so
LoadModule status_module modules/mod_status.so
Header add Set-Cookie "ROUTEID=.%{BALANCER_WORKER_ROUTE}e; path=/" env=BALANCER_ROUTE_CHANGED
```

我把上面的配置直接放在`/etc/httpd/conf.modules.d`文件夹下的`00-proxy.conf`配置中了(注意：不同apache版本不一样)

#### apache2.4版本注意事项

`httpd.conf`中的配置

要配置`SRVROOT` 必须为绝对路径

```
Define SRVROOT "C:\Software\Apache24"
```

去掉以下的注释

```
Include conf/extra/httpd-vhosts.conf
LoadModule slotmem_shm_module modules/mod_slotmem_shm.so
```


## 添加负载均衡配置

建议在`httpd.conf`的同级目录创建文件夹`conf.d` 里面放自定义配置 `httpd.conf`中添加引用

```
Include conf/conf.d/*.conf
```

### 配置示例(Tomcat下单个项目)

> 即：访问项目时直接通过域名或IP就可以访问 不需要添加项目名的情况下

新建文件 `vhost_a.psvmc.cn.conf`

```xml
#虚拟机配置,负载均衡配置
<VirtualHost *:80>
    ServerName a.psvmc.cn
    ServerAlias a.psvmc.cn
    ProxyPass / balancer://cluster/ nofailover=On
    ProxyPassReverse / balancer://cluster/
</VirtualHost> 

#The ProxyRequests directive should usually be set off when using ProxyPass.

ProxyRequests Off
<proxy balancer://cluster>
    BalancerMember ajp://localhost:8009 loadfactor=1 route=tomcat7_8080  smax=5 max=20 ttl=120 retry=300 timeout=15
    BalancerMember ajp://localhost:9009 loadfactor=1 route=tomcat7_9080  smax=5 max=20 ttl=120 retry=300 timeout=15
    ProxySet lbmethod=byrequests
    ProxySet stickysession=ROUTEID
</proxy>
```

上面的代理也可以用http(不推荐使用,没ajp效率高)

```xml
<proxy balancer://cluster>
    BalancerMember http://localhost:8080  route=tomcat7_8080
    BalancerMember http://localhost:9080 loadfactor=1 route=tomcat7_9080
    ProxySet lbmethod=byrequests
    ProxySet stickysession=ROUTEID
</proxy>
```

### Tomcat下多个项目配置

> 即webapp目录下有多个项目 访问项目需要添加项目名的情况下

如果Tomcat下时多个项目该怎么配

先说一种错误配法

#### 错误配法

Apache配置同上  
Tomcat中又配置了多个Host节点 

```xml
<Host name="a.psvmc.cn"  appBase="webapps/aaa" unpackWARs="true" autoDeploy="true">
	<Context path="/" docBase="" debug="0"/>
</Host>
<Host name="b.psvmc.cn"  appBase="webapps/bbb" unpackWARs="true" autoDeploy="true">
	<Context path="/" docBase="" debug="0"/>
</Host>
```

这样配置的话大部分情况下是没问题的，但是如果页面上有验证码的话 会生成两个`SessionID`，导致验证码不可用

#### 正确的配法

Apache中

```xml
ProxyRequests Off
<VirtualHost *:80>
    ServerName a.psvmc.cn
    ServerAlias a.psvmc.cn
    ProxyPass "/" "balancer://mycluster/" nofailover=On
    ProxyPassReverse "/" "balancer://mycluster/"
    ProxyPassReverseCookiePath /aaa /
</VirtualHost> 

<Proxy "balancer://mycluster">
    BalancerMember "ajp://a.psvmc.cn:8009/aaa" loadfactor=1 route=tomcat7_8080
    BalancerMember "ajp://a.psvmc.cn:9009/aaa" loadfactor=1 route=tomcat7_9080
    ProxySet lbmethod=bytraffic
    ProxySet stickysession=ROUTEID
</Proxy>
```

Tomcat中用默认的配置

```
<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
```

注意

Apache中多了`ProxyPassReverseCookiePath /aaa /`  
因为`ajp://a.psvmc.cn:8009/aaa`的原因 cookie的path会变成`/aaa`  
然后在`/aaa`下并没有对应的cookie 就会生成新的session

### 总结

当我们的直接访问Tomcat下的不同项目时，可以配置多个Host  
但是如果我们是从Apache或者Nginx代理过来的，就使用默认配置就行了

### 疑问

网上大部分教程都是配了一个`stickysession=JSESSIONID|jsessionid`  
但是那样配SessionID还是一直变，尚不知原因

### 情景

上面的例子用在  一台服务器上有两个tomcat  
通过**a.psvmc.cn**访问进来的请求分摊在两个tomcat上,但是因为设置了`黏性Session`  
所以只会访问一个服务器

建议每一个apache配置都建一个`httpd-vhosts-a.psvmc.cn.conf`文件  放在`/etc/httpd/conf.d`目录下 这样方便管理

### 两个Tomcat上的配置

开启**粘性Session**时**jvmRoute**的配置是必须的   
只做负载均衡时(如app接口 不需要Session)就不用配**jvmRoute**
两个Tomcat**端口的修改**是因为放在**同一台服务器**上了，**不同服务器**就**不用修改**

TomcatA

```xml
<Server port="8005" shutdown="SHUTDOWN">

    <!-- 中间省略... -->
    
    <Connector port="8080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
               
    <Connector port="8009" protocol="AJP/1.3" redirectPort="8443" />
    
    <Engine name="Catalina" defaultHost="localhost" jvmRoute="tomcat7_8080">
    
    <!-- 中间省略... -->
    
    </Engine>
  </Service>
</Server>
```

TomcatB

```xml
<Server port="9005" shutdown="SHUTDOWN">

    <!-- 中间省略... -->
    
    <Connector port="9080" protocol="HTTP/1.1"
               connectionTimeout="20000"
               redirectPort="8443" />
               
    <Connector port="9009" protocol="AJP/1.3" redirectPort="8443" />
    
    <Engine name="Catalina" defaultHost="localhost" jvmRoute="tomcat7_9080">
    
    <!-- 中间省略... -->
    
    </Engine>
  </Service>
</Server>
```
### 注意点
0) 修改tomcat的server.xml

添加`jvmRoute="tomcat7_8080"`

```xml
<Engine name="Catalina" defaultHost="localhost" jvmRoute="tomcat7_8080">
```

1) ProxyPassReverse / balancer://cluster/  
反向代理将所有的`/`请求都转发给名叫`cluster`的`balancer`。  
所以`cluster`可以自定义

2) loadfactor表示请求的权值  
该值默认为1，可以将该值设置为1到100之间的任何值。

    
3) lbmethod表示负载均衡的算法  
lbmethod可能的取值有： 

+ lbmethod=byrequests 按照请求次数均衡(默认)                 
+ lbmethod=bytraffic 按照流量均衡 
+ lbmethod=bybusyness 按照繁忙程度均衡(总是分配给活跃请求数最少的服务器)

4) stickySession表示开启**粘性Session**。  
他的意思是如果第一次请求分到了**tomcat7_8080**的Tomcat,那么这个用户的后续请求，都会分配给**tomcat7_8080**的这个Tomcat。

5) nofailover=On   
如果设为‘On’，当工作单元被禁用或者出错时，会话则立即中断。可以将该值设为On如果后端服务器不支持会话复制（Session replication）

## 测试文件

我们可以在参与负载均衡或集群的项目下新建一个**index.jsp**的测试文件  文件代码如下

```html
<%@ page contentType="text/html; charset=UTF8" %>
<%@ page import="java.util.*" %>
<html><head><title>负载均衡-集群测试</title></head>
  <body>
  服务器信息:
  <% out.println(request.getLocalAddr() + " : " + request.getLocalPort()+"<br /><br />");%>

  RequestURI:
  <% out.println(request.getRequestURI() + "<br>");%>
  <%
    out.println("<br> SessionID: " + session.getId()+"<br>");
    // 如果有新的 Session 属性设置
    String dataName = request.getParameter("dataName");
    if (dataName != null && dataName.length() > 0) {
       String dataValue = request.getParameter("dataValue");
       session.setAttribute(dataName, dataValue);
    }
    out.print("<h2>Session 列表</h2>");
    Enumeration e = session.getAttributeNames();
    while (e.hasMoreElements()) {
       String name = (String)e.nextElement();
       String value = session.getAttribute(name).toString();
       out.println( name + " = " + value+"<br>");
     }
  %>
    <br />
    <br />
    <h2>Session赋值</h2>
    <form action="index.jsp" method="POST">
       <input type=text size=20 name="dataName">=<input type=text size=20 name="dataValue">
      <input type=submit>
     </form>
  </body>
</html>
```

访问测试的网页  我们会发现  
`SessionID: F342BA5723DBE6ACE4B3C21E4F34FE4F.tomcat7_8080`  

SessionID的后面都会显示我们在**Tomcat**的**server.xml**中配置的**jvmRoute**  
所以上面我们配置的**jvmRoute**在**真正部署的时候是不需要的**，只是让我们测试是能比较容易的看出访问的是哪个服务器  

+ 如果只配置了**负载均衡** 我们会发现**SessionID**的**.**的前面和后面都会变化
+ 如果只配置了**负载均衡**和**粘性Session** 我们会发现**SessionID**是不会变的，除非重启浏览器
+ 如果配置了**负载均衡**和**Session复制**并且**取消粘性Session**  我们会发现**SessionID**变化的只会是**.**后面的**jvmRoute**   

## 集群

如果设置**Session复制**,最好取消**粘性Session**，因为设置**Session复制**后，各个服务器上Session已经同步了，就没必要让同一个用户只访问一个服务器了   

**Session复制**和**粘性Session**是集群的两种策略，各有利弊  
如果参与集群的服务器过多就不建议用**Session复制**  
使用**粘性Session**的话，用户访问的那台服务器崩溃的话，用户的Session就回丢失，不会故障转移

集群和负载均衡的区别就是集群包括Session复制和故障转移。  
Session复制是广义的,实际上就是故障转移的时候,还可以继续读取这个用户的Session。  
Session复制只是其中的一种方式，也可以采用Session服务器的方式。  

Tomcat Session复制很简单 只需要两步

### 第一步

只需要把所有参与集群的Tomcat的配置文件server.xml中的一下配置取消注释就行了

`<Cluster className="org.apache.catalina.ha.tcp.SimpleTcpCluster"/>`  

这里使用的是默认配置，如果需要更详细的配置，可以参看[官网](http://tomcat.apache.org/tomcat-7.0-doc/cluster-howto.html)

参与集群的服务器要在一个内网中，因为Tomcat的**Session复制**用的是**组播**  
**组播**会导致**网络风暴**的问题，因此在公网上的交换机或者路由器通常将此功能禁止。  
原则上，只要没有禁止，其功能和在局域网上一样。



### 第二步

在所有参与集群的项目中的**web.xml**中的**web-app**节点下添加`<distributable/>`  
告诉Tomcat我要参加集群   

如果项目没有**web.xml**  

我们就在项目的根目录添加文件夹**WEB-INF**，再在文件夹下新建文件**web.xml** ，复制下面的配置

```
<?xml version="1.0" encoding="UTF-8"?>
<web-app version="3.0" 
	xmlns="http://java.sun.com/xml/ns/javaee" 
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
	xsi:schemaLocation="http://java.sun.com/xml/ns/javaee 
	http://java.sun.com/xml/ns/javaee/web-app_3_0.xsd">
  <display-name></display-name>	
  <welcome-file-list>
    <welcome-file>index.jsp</welcome-file>
  </welcome-file-list>
  <distributable/>
</web-app>
```

就这样集群就配好了
