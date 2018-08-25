---
layout: post
title: Linux搭建SS/SSR代理服务器
description: Linux搭建SS/SSR代理服务器
keywords: linux 科学上网
categories: linux ss ssr

---



## 前言

`shadowsocks`/`shadowsocksR`这两个**只需要搭建一个**就可以了！！！！

`SS` vs `SSR`一直是各有各的说法，互相看不起对方。

我用的是`SS`，因为`SS`的`iOS`版本比较容易下载，并且并没有觉得`SS`容易被探查到。



`Shadowsocks` 的数据传输是建立在 `SOCKS5` 协议之上的，`SOCKS5` 是 `TCP/IP` 层面的网络代理协议。 `ss-server` 端解密出来的数据就是采用 `SOCKS5` 协议封装的，通过 `SOCKS5` 协议 `ss-server` 端能读出本机软件想访问的服务的真正地址以及要传输的原数据



## SS的搭建

### 下载

下载一键搭建ss脚本文件

```bash
git clone https://github.com/psvmc/ss-fly
```

### 运行

运行搭建ss脚本代码

```bash
ss-fly/ss-fly.sh -i password 1024
```

+ 其中**password**换成你要设置的shadowsocks的密码即可，密码最好**只包含密码+数字**，一些特殊字符可能会导致冲突。

+ 而第二个参数**1024**是**端口号**，也可以不加，不加默认是1024~

  **举个例子**，脚本命令可以是`ss-fly/ss-fly.sh -i pass123456`，

  也可以是`ss-fly/ss-fly.sh -i pass123456 8585`，

  后者指定了服务器端口为8585，前者则是默认的端口号1024

>  注：如果需要改密码或者改端口，只需要重新**再执行一次搭建ss脚本代码**就可以了

### 卸载

卸载ss服务

```bash
ss-fly/ss-fly.sh -uninstall
```

### 客户端下载

1. Windows客户端下载地址：Windows对Framework的版本要求比价高，我的是4.0.2的要求Framework4.6.2。如果是XP或者Framework比较低的，可以直接下载低版本的ss（windows 2.3.1下载地址：[https://github.com/shadowsocks/shadowsocks-windows/releases?after=2.5.1](https://github.com/shadowsocks/shadowsocks-windows/releases?after=2.5.1)）。  
2. Mac客户端下载地址：[https://github.com/shadowsocks/ShadowsocksX-NG/releases](https://github.com/shadowsocks/ShadowsocksX-NG/releases)。  
3. Linux客户端下载地址：[https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation](https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation)。  
4. Android/安卓客户端下载地址：[https://github.com/shadowsocks/shadowsocks-android/releases](https://github.com/shadowsocks/shadowsocks-android/releases)。  
5. iOS/苹果客户端直接在App Store里搜索shadowsock关键字（或者wingy关键字），软件经常被下架，我目前用的是Wingy & Shadowrocket~如果找不到，你也可以通过**PP助手**去下载Shadowrocket。

百度云地址 

+ 链接: https://pan.baidu.com/s/1SLZuEaYYyR0f_6YLngw-PA 
+ 密码: s8i8

### 客户端配置

在状态栏右击shadowsocks

勾选**开机启动**和**启动系统代理**

在**系统代理模式**中选择**PAC模式**

**服务器**->**编辑服务器**，一键安装shadowsocks的脚本默认服务器端口是1024，加密方式是aes-256-cfb，密码是你设置的密码，ip是你自己的VPS ip，保存即可~  

**PAC模式**是指国内可以访问的站点直接访问，不能直接访问的再走shadowsocks代理~  

OK！一键脚本搭建shadowsocks完毕！科学上网吧，兄弟！[Google](https://www.google.com/)



### 查看连接

```bash
netstat -an | grep 1024
```



## SSR的搭建

**再次提醒**，如果安装了SS，就不需要再安装SSR了，如果要改装SSR，请按照上一部分内容的教程先卸载SS！！！

### 下载

下载一键搭建ssr脚本文件(与SS的脚本一致)

```bash
git clone https://github.com/psvmc/ss-fly
```

### 运行

运行搭建ssr脚本代码

```bash
ss-fly/ss-fly.sh -ssr
```

输入对应的参数

执行完上述的脚本代码后，会进入到输入参数的界面，包括服务器端口，密码，加密方式，协议，混淆。可以直接输入回车选择默认值，也可以输入相应的值选择对应的选项

### 相关命令

```bash
启动：/etc/init.d/shadowsocks start
停止：/etc/init.d/shadowsocks stop
重启：/etc/init.d/shadowsocks restart
状态：/etc/init.d/shadowsocks status
配置文件路径：/etc/shadowsocks.json
日志文件路径：/var/log/shadowsocks.log
代码安装目录：/usr/local/shadowsocks
```

### 卸载

卸载ssr服务

```bash
./shadowsocksR.sh uninstall
```

### 客户端下载

1. Windows客户端下载地址：[https://github.com/shadowsocksrr/shadowsocksr-csharp/releases](https://github.com/shadowsocksrr/shadowsocksr-csharp/releases)  
2. Mac客户端下载地址：[https://github.com/52geyan/ss-ssr-clients/raw/master/ssr/SS-X-R.zip](https://github.com/flyzy2005/ss-ssr-clients/raw/master/ssr/SS-X-R.zip)  
3. Linux客户端下载地址：[https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation](https://github.com/shadowsocks/shadowsocks-qt5/wiki/Installation)  
4. Android/安卓客户端下载地址：[https://github.com/52geyan/ss-ssr-clients/raw/master/ssr/ShadowsocksR-3.4.0.8.apk](https://github.com/flyzy2005/ss-ssr-clients/raw/master/ssr/ShadowsocksR-3.4.0.8.apk)  
5. iOS/iPad/苹果客户端我目前用的是Wingy & Shadowrocket，支持ssr，可以通过**PP助手**去下载，当然你可以直接去申请一个美国App Store，然后去美区下载。

百度云下载

+ 链接: https://pan.baidu.com/s/1tALRhWdN19yfVg97AMMsXg 
+ 密码: r6wn

### 客户端设置

![20180825153516130027108.png](http://image.psvmc.cn/20180825153516130027108.png)

在状态栏右击**shadowsocksR**，

在**系统代理模式**中选择**PAC模式**，再左击两次状态栏的图标打开编辑服务器界面，

如上图所示，按照自己的服务器配置填充内容**，**保存即可~  

**PAC模式**是指国内可以访问的站点直接访问，不能直接访问的再走**shadowsocksR**代理~  

OK！一键脚本搭建**shadowsocksR**完毕！科学上网吧，兄弟！[Google](https://www.google.com/)

### 查看连接

```bash
netstat -an | grep 1024
```
