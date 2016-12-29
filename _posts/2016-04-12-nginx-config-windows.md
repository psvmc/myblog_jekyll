---

layout: post
title: Windows下Nginx配置
description: Windows下Nginx配置
keywords: nginx
category: nginx

---

## 运行 停止 重载配置

打开nginx所在目录

```
D:
cd nginx
```

然后就可以执行下面的命令了

```
start nginx           // 启动Nginx
nginx -s stop         // 停止nginx
nginx -s reload       // 重新加载配置文件
nginx -s quit         // 退出nginx
```

## 配置文件

nginx在windows下设置网站时建议在`conf`目录下新建一个`conf.d`

在`nginx.conf`添加引用

```worker_processes  1;events {    worker_connections  1024;}http {    include       mime.types;    default_type  application/octet-stream;    server_names_hash_bucket_size 64;
	    sendfile        on;    keepalive_timeout  65;    server {        listen       80;        server_name  localhost;
                location / {            root   html;            index  index.html index.htm;        }        error_page   500 502 503 504  /50x.html;        location = /50x.html {            root   html;        }    }	include D:/soft/nginx-1.8.1/conf/conf.d/*.conf;}
```

### 引用配置

引用配置的时候路径可以是绝对路径 类似于(注意斜杠的方向)

```
include D:/soft/nginx-1.8.1/conf/conf.d/*.conf;
```

也可以是

```
include conf.d/*.conf;
```

> 上面的配置要在`http`内部

但是以下两种是**错误**的

```
include ./conf.d/*.conf;
```

```
include /conf.d/*.conf;
```

### 错误解决

我在配置后 报了如下错误

```
could not build the server_names_hash, you should increase server_names_hash_bucket_size: 32
```

解决方式

在http块中添加(如上面代码所示)

```
server_names_hash_bucket_size 64;
```

