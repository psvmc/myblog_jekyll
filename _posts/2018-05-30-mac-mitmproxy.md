---
layout: post
title: Mac中使用Mitmproxy拦截移动设备网络请求
description: Mac中使用Mitmproxy拦截移动设备网络请求
keywords: mac
categories: mac

---



## 背景

拦截http proxy的软件很多，如 `Fiddler`，`Charles`等，能够实现对http通信的拦截，可以查验Request和Response参数，特别是移动设备快速普及，此类软件逐渐被用于移动设备APP的网络请求拦截。 



## Mac上安装 启动

[`官网`](https://mitmproxy.org/)

安装方式

```bash
brew install mitmproxy
```

启动

```
mitmweb
```

清空请求

```
 点击"mitmproxy" 点击"new" 可将所有的请求清空
```



## 拦截Https请求

如今很多APP都开始使用Https请求，以确保数据安全，按照以上设计可以拦截Release版APP的https请求，但是Debug版APP的Https请求需要在手机设备上安装mitmproxy的https认证证书。（这个是针对自己开发APP总结的经验，对其他APP不一定适用）   

在你的移动设备上[`打开`](http://mitm.it/)  <http://mitm.it/>链接，下载相应证书，然后安装。   

Android 手机可以在“设置/安全/从SD卡安装证书”中安装刚才下载的证书。重新链接代理无线网络即可。