---
layout: post
title: Nginx安装配置注意点
description: Nginx安装配置注意点
keywords: nginx linux
categories: 
	    - nginx
	    - linux

---



## 设置阿里yum镜像

1) 备份

```bash
mv /etc/yum.repos.d/CentOS-Base.repo /etc/yum.repos.d/CentOS-Base.repo.backup
```

2) 下载新的CentOS-Base.repo 到/etc/yum.repos.d/

- CentOS 7

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-7.repo
  ```

- CentOS 6

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
  ```

- CentOS 5

  ```bash
  wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-5.repo
  ```

3) 生成缓存

```
yum makecache
```



## 安装


安装 

```bash
yum install -y nginx
```


卸载  

```bash
yum -y remove nginx*
```

启动

```bash
service nginx start
```

停止

```bash
service nginx stop
```

设为开机启动  

```bash
chkconfig nginx on
```

或

```bash
systemctl enable nginx.service
```



重新加载配置

```bash
service nginx reload
```

查看版本

```bash
nginx -v
```

配置文件路径`/etc/nginx/conf.d`



## 配置

### 负载均衡

```nginx
upstream git_xhkjedu {   
    server xxx.xxx.xxx.xxx:10080;
    server xxx.xxx.xxx.xxx:10080;
}  

server {  
    listen 80;  
    server_name git.xhkjedu.com;
    client_max_body_size  200m;  
    location / {  
          proxy_pass http://git_xhkjedu/;  
          proxy_cookie_path / /;
          proxy_redirect  / /; 
          proxy_set_header Host $host;  
          proxy_set_header X-Real-IP $remote_addr;  
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;  
          client_max_body_size 200m;  
          client_body_buffer_size 128k;   
          proxy_connect_timeout 300s;
          proxy_send_timeout 300s;
          proxy_read_timeout 300s;
          proxy_busy_buffers_size 64k;  
          proxy_temp_file_write_size 64k; 
          proxy_buffer_size 64k; 
          proxy_buffers 8 64k; 
          fastcgi_buffer_size 128k; 
          fastcgi_buffers 4 128k;
          send_timeout 60;   
    }
}
```

上传文件时注意一下配置

```nginx
client_max_body_size 200m;  
client_body_buffer_size 128k;   
proxy_connect_timeout 300s;
```



### 静态项目

```nginx
upstream www_xhkjedu {   
    server 127.0.0.1:8086;   
}  

server {  
    listen 80;  
    server_name www.xhkjedu.com;  
    location / {
        root  /data/wwwroot/tomcat06/ROOT;
        index index.html;
        proxy_pass http://www_xhkjedu/;  
        proxy_cookie_path / /;
        proxy_redirect   / /; 
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

静态项目主要添加了

```nginx
root  /data/wwwroot/tomcat06/ROOT;
index index.html;
```

不添加的话 部分浏览器访问不到默认首页


