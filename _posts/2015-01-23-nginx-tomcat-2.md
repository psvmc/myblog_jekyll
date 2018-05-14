---

layout: post
title: Nginx与Tomcat动静分离与端口转发
description: 动静分离与端口转发
keywords: nginx
category: nginx

---

## Nginx虚拟主机配置

```nginx
server {
    listen       80;
    server_name  www.yojob.cn; 
    root /alidata1/webapps/www.yojob.cn/yprm;
    
    location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$
    {
        expires      1d;
    }

    location / { 
        proxy_pass    http://www.yojob.cn:8080; 
        proxy_redirect off ;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header REMOTE-HOST $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        client_max_body_size 50m;
        client_body_buffer_size 256k;
        proxy_connect_timeout 30;
        proxy_send_timeout 30;
        proxy_read_timeout 60;
        proxy_buffer_size 256k;
        proxy_buffers 4 256k;
        proxy_busy_buffers_size 256k;
        proxy_temp_file_write_size 256k;
        proxy_next_upstream error timeout invalid_header http_500 http_503 http_404;
        proxy_max_temp_file_size 128m;
    }
    access_log  /alidata/log/nginx/access/yprm.log;
}
	
```

## Tomcat配置

```xml
<Host name="www.yojob.cn"  appBase="/alidata1/webapps/www.yojob.cn" unpackWARs="false" autoDeploy="false">
    <Context path="" docBase="yprm" debug="0"/>
</Host>
```









