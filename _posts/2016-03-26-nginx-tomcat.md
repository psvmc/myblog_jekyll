---

layout: post
title: Nginx Tomcat 负载均衡 集群
description: Nginx Tomcat 负载均衡 集群
keywords: nginx
category: nginx

---

## 前言

Nginx和Tomcat的负载均衡配置 只能用http 协议  但是nginx的优秀性能 值得你去尝试  

## 负载均衡

```nginx
upstream a_psvmc {  
      server a.psvmc.cn:8080;  
      server a.psvmc.cn:9080;   
      ip_hash;
}  

server {  
      listen 80;  
      server_name a.psvmc.cn;  
location / {  
          proxy_pass http://a_psvmc;  
          proxy_redirect off;  
          proxy_set_header Host $host;  
          proxy_set_header X-Real-IP $remote_addr;  
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
          client_max_body_size 10m;  
          client_body_buffer_size 128k;  
          proxy_connect_timeout 90;  
          proxy_send_timeout 90;  
          proxy_read_timeout 90;  
          proxy_buffer_size 4k;  
          proxy_buffers 4 32k;  
          proxy_busy_buffers_size 64k;  
          proxy_temp_file_write_size 64k;  
  }
}
```

### Tomcat下多个项目配置

如果Tomcat下时多个项目该怎么配

先说一种错误配法

#### 错误配法

Nginx配置同上    

Tomcat中又配置了多个Host节点 

```xml
<Host name="a.psvmc.cn"  appBase="webapps/aaa" unpackWARs="true" autoDeploy="true">
	<Context path="/" docBase="" debug="0"/>
</Host>
<Host name="b.psvmc.cn"  appBase="webapps/bbb" unpackWARs="true" autoDeploy="true">
	<Context path="/" docBase="" debug="0"/>
</Host>
```
这样配置的话大部分情况下是没问题的，但是如果页面上有验证码的话 会生成两个SessionID，导致验证码不可用

#### 正确的配法

Nginx中

```nginx
upstream a_psvmc {  
      server a.psvmc.cn:8080;  
      server a.psvmc.cn:9080;
      ip_hash;
}  

  
server {  
      listen 80;  
      server_name a.psvmc.cn;  
  location / {  
          proxy_pass http://a_psvmc/test/;  
          proxy_cookie_path /test/ /;
          proxy_redirect /test/ /; 
          proxy_redirect off;
          proxy_set_header Host $host;  
          proxy_set_header X-Real-IP $remote_addr;  
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
          client_max_body_size 10m;  
          client_body_buffer_size 128k;  
          proxy_connect_timeout 90;  
          proxy_send_timeout 90;  
          proxy_read_timeout 90;  
          proxy_buffer_size 4k;  
          proxy_buffers 4 32k;  
          proxy_busy_buffers_size 64k;  
          proxy_temp_file_write_size 64k;  
  }
}
```

Tomcat中用默认的配置

```
<Host name="localhost"  appBase="webapps" unpackWARs="true" autoDeploy="true">
```

注意

变动项有

```nginx
proxy_pass http://a_psvmc/test/;  
proxy_cookie_path /test/ /;
proxy_redirect  /test/ /; 
```

因为`proxy_pass http://a_psvmc/test/; `  
访问`http://a.psvmc.cn`，url会变成`http://a.psvmc.cn/test/`,  
cookie中的path会变成`/test/`,    
`proxy_cookie_path /test/ /;`会把cookie中的path改为`/`,    
`proxy_redirect  /test/ /; `会吧url重定向到`http://a.psvmc.cn`

### 总结

当我们的直接访问Tomcat下的不同项目时，可以配置多个Host  
但是如果我们是从Apache或者Nginx代理过来的，就使用默认配置就行了

情景

上面的例子用在  一台服务器上有两个tomcat  
通过**a.psvmc.cn**访问进来的请求分摊在两个tomcat上,但是因为设置了`黏性Session`  
所以只会访问一个服务器

建议每一个nginx配置都建一个`nginx-vhosts-a.psvmc.cn.conf`文件  放在`/etc/nginx/conf.d`目录下 这样方便管理

### 黏性Session的其它方式

Nginx配置类似Apache的黏性Session有很多方式

1）ip_hash(原生支持)

ip_hash使用源地址哈希算法，将同一客户端的请求总是发往同一个后端服务器，除非该服务器不可用。  
ip_hash简单易用，但有如下问题：  
当后端服务器宕机后，session会丢失；  
来自同一局域网的客户端会被转发到同一个后端服务器，可能导致负载失衡；  
不适用于CDN网络，不适用于前段还有代理的情况。  

```nginx
upstream a_psvmc {  
    ip_hash;
     server a.psvmc.cn:8080;  
     server a.psvmc.cn:9080;   

} 
```

2）其它方式

可以参看[官方](http://nginx.org/en/docs/http/ngx_http_upstream_module.html)

### 两个Tomcat上的配置

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
0) 要修改tomcat的server.xml

添加`jvmRoute="tomcat7_8080"`  

```xml
<Engine name="Catalina" defaultHost="localhost" jvmRoute="tomcat7_8080">
```
`jvmRoute="tomcat7_8080"`该配置在Apache做`粘性Session`时时必要的  
在Nginx中用`ip_hash;`方式 就不需要


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
