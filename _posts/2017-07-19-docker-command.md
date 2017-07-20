---

layout: post
title: Docker常用命令
description: Docker常用命令
keywords: docker
category: docker

---

## 前言 

什么是Docker？  
Docker就是一个容器，但是这个容器里什么都没有，所以我们根据需求不同就要不同的环境，这些环境就是`镜像`，我们可以用一个镜像生成多个`容器`，每个容器都有它的`ID`或`NAME`。

所以对于Docker的操作命令就可以分为三类：`Docker命令` `镜像命令` 和 `容器命令`

## Docker命令

+ 查看docker版本 

``` 
$docker version  
```
  
+ 显示docker系统的信息  

```
$docker info 
```

## 镜像命令


+ 检索镜像  

```
$docker search image_name
```  
  
+ 下载镜像  

```
$docker pull image_name 
``` 
  
+ 列出镜像列表

```
$docker images
```
  
+ 删除一个或者多个镜像 

``` 
$docker rmi image_name 
``` 
  
+ 显示一个镜像的历史

``` 
$docker history image_name  
```

+ 保存和加载镜像（save、load）

当需要把一台机器上的镜像迁移到另一台机器的时候，需要保存镜像与加载镜像。

```
# 保存镜像到一个tar包  
$docker save image_name -o file_path  
# 加载一个tar包格式的镜像  
$docker load -i file_path  
  
# 机器a导出tar包 
$docker save image_name > /home/save.tar  
# 使用scp将save.tar拷到机器b上，然后：  
$docker load < /home/save.tar 
```

+ 添加镜像的名字和tag

```
docker tag imageid name:tag
```

## 容器命令

+ 启动容器

```
# 在容器中运行"echo"命令，输出"hello word"  
$docker run image_name echo "hello word"  
  
# 交互式进入容器中  
$docker run -i -t image_name /bin/bash  
  
  
# 在容器(ubuntu)中安装新的程序  
$docker run image_name apt-get install -y app_name  
```

举例

```
docker run -i -t -v /root/software/:/mnt/software/ 25c5298b1a36 /bin/bash

docker run -d -p 58080:8080 --name javaweb huangyong/javaweb:0.1 /root/run.sh
```

这条命令比较长，我们稍微分解一下，其实包含以下三个部分：

```
docker run <相关参数> <镜像 ID> <初始命令>
```

> 其中，相关参数包括：

> + -i：表示以“交互模式”运行容器
> + -t：表示容器启动后会进入其命令行
> + -v：表示需要将本地哪个目录挂载到容器中，格式：-v <宿主机目录>:<容器目录>.  
>       假设我们的所有安装程序都放在了宿主机的/root/software/目录下，现在需要将其挂载到容器的/mnt/software/目录下。
> + -d：表示以`守护模式`执行`/bin/bash`脚本，此时 Tomcat 控制台不会出现在输出终端上。
> + -p：表示宿主机与容器的端口映射，此时将容器内部的 8080 端口映射为宿主机的 58080 端口，这样就向外界暴露了 58080 端口，可通过 Docker 网桥来访问容器内部的 8080 端口了。
> + --name：表示容器名称，用一个有意义的名称命名即可。

> 需要说明的是，不一定要使用“镜像 ID”，也可以使用“仓库名:标签名”，例如：docker.cn/docker/centos:centos6。



+ 查看容器

```
# 列出当前所有正在运行的container  
$docker ps  
# 列出所有的container  
$docker ps -a  
# 列出最近一次启动的container  
$docker ps -l  
```

+ 容器保存为镜像（commit）

``` 
$docker commit ID new_image_name  
```

如：

```
docker commit 57c312bbaad1 psvmc/javaweb:0.1
```

该容器的 ID 是`57c312bbaad1`，所创建的镜像名是`psvmc/javaweb:0.1`，随后可使用镜像来启动 Java Web 容器。

+ 导入导出

```
#可以使用 docker export 命令，导出容器快照到本地文件。
$ sudo docker export 7691a814370e > ubuntu.tar

#可以使用 docker import 从容器快照文件中再导入为镜像
$ sudo docker import - test/ubuntu:v1.0
```

+ 对容器的操作（rm、stop、start、kill、logs、diff、top、cp、restart、attach）

```
# 删除所有容器  
$docker rm `docker ps -a -q`  
  
# 删除单个容器
$docker rm Name/ID  
  
# 停止、启动、杀死一个容器  
$docker stop Name/ID  
$docker start Name/ID  
$docker kill Name/ID  
  
# 从一个容器中取日志; -t 显示时间 
$docker logs Name/ID  
  
# 列出一个容器里面被改变的文件或者目录，list列表会显示出三种事件，A 增加的，D 删除的，C 被改变的  
$docker diff Name/ID  
  
# 显示一个运行的容器里面的进程信息  
$docker top Name/ID  
  
# 从容器里面拷贝文件/目录到本地一个路径  
$docker cp Name:/container_path to_path  
$docker cp ID:/container_path to_path  
  
# 重启一个正在运行的容器; 
$docker restart Name/ID  
  
# 运行已运行容器的命令
$docker attach ID 

# 退出attach
Ctrl+P+Q
```



## 常见问题

+ 怎样在一运行的容器中添加端口映射？  
	不能直接添加端口映射。只能先保存(commit)为镜像 再重新运行(run)
	
+ import/export 与 save/load 的区别？   
	import应用于容器 save应用于镜像

