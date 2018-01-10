---

layout: post
title: Mac 上安装Jekyll生成静态网页
description: Mac 上安装Jekyll生成静态网页
keywords: jekyll
categories: 
        - jekyll
        - mac

---

## 安装

安装最新版的jekyll [`参见网页`](http://jekyllcn.com/docs/installation/) 
 
```bash
sudo gem install jekyll -n /usr/local/bin
```

## 安装分页插件

安装`jekyll-paginate`

```bash
sudo gem install jekyll-paginate
```

在配置文件`_config.yml`中添加

```
gems: [jekyll-paginate]
```

## 使用

[详细介绍](http://jekyllcn.com/docs/usage/)

当前文件夹中的内容将会生成到 ./_site 文件夹中

```bash
jekyll build
```

当前文件夹中的内容将会生成到 ./_site 文件夹中,监测改变，并且自动再生成。

```
jekyll build --watch
```






