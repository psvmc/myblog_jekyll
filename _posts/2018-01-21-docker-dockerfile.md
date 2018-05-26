---

layout: post
title: Docker 自定义Dockerfile构建镜像
description: Docker 自定义Dockerfile构建镜像
keywords: 
    - docker
categories: 
        - docker
        - linux

---

## Dockerfile文件

```bash
# Pull base image  
FROM centos  
  
MAINTAINER psvmc "psvmc@outlook.com"  

# Set Charset 
ENV LANG en_US.UTF-8    
ENV LANGUAGE en_US:en    
ENV LC_ALL en_US.UTF-8 
  
# Install curl  
RUN yum -y install curl  
  
# Install JDK 8  
RUN cd /tmp &&  curl -L 'http://download.oracle.com/otn-pub/java/jdk/8u162-b12/0da788060d494f5095bf8624735fa2f1/jdk-8u162-linux-x64.tar.gz' -H 'Cookie: oraclelicense=accept-securebackup-cookie; gpw_e24=Dockerfile' | tar -xz  
RUN mkdir -p /usr/lib/jvm  
RUN mv /tmp/jdk1.8.0_162/ /usr/lib/jvm/java-8-oracle/  
  
# Set Oracle JDK 8 as default Java  
RUN update-alternatives --install /usr/bin/java java /usr/lib/jvm/java-8-oracle/bin/java 300     
RUN update-alternatives --install /usr/bin/javac javac /usr/lib/jvm/java-8-oracle/bin/javac 300     
  
ENV JAVA_HOME /usr/lib/jvm/java-8-oracle/  
  
# Install tomcat8  
RUN cd /tmp && curl -L 'https://mirrors.tuna.tsinghua.edu.cn/apache/tomcat/tomcat-8/v8.5.24/bin/apache-tomcat-8.5.24.tar.gz' | tar -xz  
RUN mv /tmp/apache-tomcat-8.5.24/ /opt/tomcat8/  
  
ENV CATALINA_HOME /opt/tomcat8  
ENV PATH $PATH:$CATALINA_HOME/bin  
  
ADD catalina.sh /opt/tomcat8/bin/catalina.sh
RUN chmod 755 /opt/tomcat8/bin/catalina.sh  
  
# Expose ports.  
EXPOSE 8080  
  
# Define default command.  
WORKDIR /opt/tomcat8/bin/
ENTRYPOINT startup.sh && tail -F /opt/tomcat8/logs/catalina.out
```

添加的文件`catalina.sh`覆盖原来文件  
其实这个文件就是tomcat中的`catalina.sh`文件添加了一下配置  具体参照[`Github地址`](https://github.com/psvmc/docker_tomcat8)
`JAVA_OPTS="-Dfile.encoding=UTF8 -Dsun.jnu.encoding=UTF8"`



## 构建

```bash
docker build -t psvmc/docker_tomcat8 . 
```

当然也可以用阿里云构建

构建后的地址

```bash
docker pull registry.cn-hangzhou.aliyuncs.com/psvmc/oraclejdk-tomcat8
```



在[`阿里云镜像地址`](https://cr.console.aliyun.com)自己创建镜像用[`Github地址`](https://github.com/psvmc/docker_tomcat8)的Dockerfile（jdk1.8+tomcat8+支持中文日志）



## 使用

+ 查看镜像ID

  ```bash
  docker images
  ```

+ 运行镜像

  镜像中的tomcat在`/opt/tomcat8`位置下

  ```bash
  docker run -d -p 8087:8080 --name tomcat07 -v /data/wwwroot/tomcat07/:/opt/tomcat8/webapps/  -v /data/wwwroot/tomcat07_log/:/opt/tomcat8/logs/ -v /data/wwwroot/tomcat07/ROOT/static/:/data/wwwroot/tomcat07/ROOT/static/ --restart=always d14cec374f33
  ```

  里面映射了`webapps` `logs` `上传文件位置`三个文件夹 根据自身需求设置

+ 查看容器运行状态

  ```bash
  docker ps -a
  ```

+ 查看`tomcat`启动日志

  ```bash
  docker logs tomcat07
  ```
  **命令格式：**

  ```bash
  $ docker logs [OPTIONS] CONTAINER 
    Options: 
  	--details 显示更多的信息 
  	-f, --follow 跟踪实时日志 
  	--since string 显示自某个timestamp之后的日志，或相对时间，如42m（即42分钟） 
  	--tail string 从日志末尾显示多少行日志， 默认是all 
  	-t, --timestamps 显示时间戳 
  	--until string 显示自某个timestamp之前的日志，或相对时间，如42m（即42分钟）
  ```

  **例子：**

  查看指定时间后的日志，只显示最后100行：

  ```bash
  docker logs -f -t --since="2018-02-08" --tail=100 CONTAINER_ID/NAMES
  ```

  查看最近30分钟的日志:

  ```bash
  docker logs --since 30m CONTAINER_ID/NAMES
  ```

  查看某时间之后的日志：

  ```bash
  docker logs -t --since="2018-02-08T13:23:37" CONTAINER_ID/NAMES
  ```

  查看某时间段日志：

  ```bash
  docker logs -t --since="2018-02-08T13:23:37" --until "2018-02-09T12:23:37" CONTAINER_ID/NAMES
  ```

   

+ 我们运行了`tomcat` 那么怎样进入`tomcat`运行的环境呢

  ```bash
  // docker exec意思是：在`tomcat07`下面运行一个命令，在这里，运行的是/bin/bash
  // -t 表示分配一个pseudo-TTY，-i 表示可交互
  docker exec -t -i tomcat07 /bin/bash
  ```

+ 接下来 我们退出`tomcat`的运行环境(`Ctrl+P+Q`)  

+ 把文件拷贝到容器中

  如果做了目录映射就不用吧项目copy到docker容器中了

  直接复制到映射的docker外层的目录中即可

  ```bash
  docker cp /root/test.war tomcat07:/opt/tomcat8/webapps/test.war
  ```

  





