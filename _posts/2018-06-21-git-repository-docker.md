---
layout: post
title: Docker下部署Git仓库
description: Docker下部署Git仓库
keywords: docker git
categories: 
        - docker
        - git

---



## 概要



+ [`Gitea仓库地址`](https://github.com/go-gitea/gitea)
+ [`官方文档`](https://docs.gitea.io/zh-cn/)
+ [`docker-compose的安装`](https://docs.docker.com/compose/install/)



## 从Docker安装

拉取镜像

```bash
docker pull gitea/gitea:latest
```

创建镜像保存位置

其中`data`目录是自己建的

```bash
sudo mkdir -p /data/tools/gitea
```

然后就可以运行 docker 容器了，这很简单。 当然你需要定义端口数数据目录：

```bash
docker run -d --name=gitea -p 10022:22 -p 10080:3000 -v /data/tools/gitea:/data --restart=always gitea/gitea:latest
```

然后 容器已经运行成功，在浏览器中访问 <http://hostname:10080> 就可以看到界面了


配置的时候如果要用`mysql`数据库 就要先在服务器上安装`mysql`