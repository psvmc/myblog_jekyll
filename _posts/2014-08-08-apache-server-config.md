---

layout: post
title: Apache配置
description: Apache配置
keywords: apache,虚拟主机,反向代理
category: apache

---
## 配置为服务（windows）

	httpd -k install -n "httpd"
>"httpd"为配置的服务名，可自定义

## 配置虚拟主机

### 加载其他配置文件

	Include conf/vhosts.conf
	
### 虚拟主机

	NameVirtualHost *:80
	<VirtualHost *:80>
	    ServerName www.abc.cn
	    DocumentRoot "D:/wwwroot/abc/"
	</VirtualHost>
	
### 别名 
  
> `用于同一域名多个站`

	NameVirtualHost *:80
	<VirtualHost *:80>
	    ServerName www.abc.cn
	    DocumentRoot "D:/wwwroot/abc/"
		Alias /blog/ "D:/wwwroot/blog/"
	</VirtualHost>
> 访问`www.abc.cn`找的路径为`D:/wwwroot/abc/`  
> 访问`www.abc.cn/blog/`找的路径为`D:/wwwroot/blog/`  


### 代理

	<VirtualHost *:80>
	    ProxyPreserveHost On 
	    ServerName www.abc.com    
	    ProxyPass / http://www.abc.com:8080/  
	    ProxyPassReverse / http://www.abc.com:8080/
	</VirtualHost>

#### 开启代理：

	LoadModule proxy_module modules/mod_proxy.so
	LoadModule proxy_connect_module modules/mod_proxy_connect.so
	LoadModule proxy_ftp_module modules/mod_proxy_ftp.so
	LoadModule proxy_http_module modules/mod_proxy_http.so
> 注意：  
> `ProxyPass`：正向代理 即：如果访问`www.abc.com`实际上访问的是`http://www.abc.com:8080/`  
> `ProxyPassReverse`：反向代理 如果`http://www.abc.com:8080/`页面中又重定向到了`login.jsp`  
> 访问`www.abc.com`实际上访问的是`http://www.abc.com:8080/`  
> 如果不配反向代理那么get请求的url是`http://www.abc.com:8080/login.jsp`  
> 配反向代理后则会get请求的url则为`http://www.abc.com/login.jsp`

## 监听多个端口

### 添加多个端口 
 
	Listen 8011
	Listen 8088 

### 建立多个虚拟主机目录  

	NameVirtualHost *:80
	<VirtualHost *:80>
	ServerName localhost
	DocumentRoot "E:/web1"
	</VirtualHost>
	 
	NameVirtualHost *:8011
	<VirtualHost *:8011>
	ServerName localhost
	DocumentRoot "E:/web2"
	</VirtualHost>
	 
	NameVirtualHost *:8088
	<VirtualHost *:8088>
	ServerName localhost
	DocumentRoot "E:/web3"
	</VirtualHost>

### 重启Apache服务

	即可以用   
	localhost   
	localhost:8011   
	localhost:8088   
	访问你不同的网站了  