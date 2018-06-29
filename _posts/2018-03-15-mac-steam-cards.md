---
layout: post
title: Mac上Steam 挂卡 卖卡
description: Mac上Steam 挂卡 卖卡
keywords: steam
categories: steam mac
---



## 访问社区

Windows上常用`302`  

Mac上可以用[`AnotherSteamCommunityFix`](https://steamcn.com/t339641-1-1)

下载地址

百度云：<https://pan.baidu.com/s/1nvBW8qP>

使用步骤:

- 下载并解压缩

- 打开终端（Terminal），进入到ascf程序目录：
  如`ascf`程序在 `/Users/Makazeu/Downloads/`文件夹中，那么在终端中输入

  ```bash
  cd /Users/Makazeu/Downloads
  ```

- 赋予程序可执行权限，在终端中输入命令：

  ```bash
  chmod +x ./ascf
  ```

- 使用root用户（管理员用户）运行程序，在终端中输入

  ```bash
  sudo ./ascf
  ```

  输入root用户密码后，看程序是否运行
  因为程序涉及到hosts文件修改，需要高权限，所以你需要输入root密码

- 若程序已经成功运行，此时就不要关闭终端窗口了，否则程序就会退出！试下Steam社区能否正常打开

- 一切都没问题后，在终端窗口中退出程序（按Ctrl+C），然后以后台的方式运行程序，输入

  ```bash
  nohup sudo ./ascf &
  ```

  之后就可以关闭终端窗口了，此时程序在后台运行！现在steamcommunity可以打开咯！



## 插件脚本地址

脚本搜索网站

+ [`Greasy Fork`](https://greasyfork.org/zh-CN)

Chrome

- [`Tampermonkey`](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) 
-  [`Violent monkey`](https://chrome.google.com/webstore/detail/violent-monkey/jinjaccalgkegednnccohejagnlnfdag)

火狐

- [`Violentmonkey`](https://addons.mozilla.org/zh-CN/firefox/addon/violentmonkey/)

- [`Tampermonkey`](https://addons.mozilla.org/zh-CN/firefox/addon/tampermonkey/) 

Safari

+ [`Tampermonkey`](http://tampermonkey.net/?browser=safari)

Microsoft Edge

+ [`Tampermonkey`](https://www.microsoft.com/store/p/tampermonkey/9nblggh5162s)

Opera

+ [`Tampermonkey`](https://addons.opera.com/extensions/details/tampermonkey-beta/)

Maxthon 

+ [`Violentmonkey`](http://extension.maxthon.com/detail/index.php?view_id=1680)

QQ浏览器

+ `暴力猴` 插件



## 常用插件



+ 批量卖卡[`Steam-Economy-Enhancer`](https://github.com/Sneer-Cat/Steam-Economy-Enhancer/raw/master/code.user.js)：添加批量卖卡按钮的脚本
+ 显示游戏最低价格及进包次数[`SteamHistoryLowestPrice`](https://greasyfork.org/zh-CN/scripts/30877-steamhistorylowestprice)
+ 批量刮开 激活[`Steam Bundle Sites Extension`](https://github.com/clancy-chao/Steam-Bundle-Sites-Extension/raw/master/SBSE.user.js)
+ [`Steam自动探索队列`](https://greasyfork.org/zh-CN/scripts/369701-steam%E8%87%AA%E5%8A%A8%E6%8E%A2%E7%B4%A2%E9%98%9F%E5%88%97)
+ [`Steam 绿光/创意工坊图片修复`](https://greasyfork.org/zh-CN/scripts/955-steam-%E7%BB%BF%E5%85%89-%E5%88%9B%E6%84%8F%E5%B7%A5%E5%9D%8A%E5%9B%BE%E7%89%87%E4%BF%AE%E5%A4%8D)
+ [`Steam Gems-to-Price Helper`](https://greasyfork.org/zh-CN/scripts/25735-steam-gems-to-price-helper)
+ 批量激活[`SteamRedeemKeys`](https://greasyfork.org/zh-CN/scripts/32718-steamredeemkeys)



## 挂卡

[`ASF`](https://github.com/JustArchi/ArchiSteamFarm/releases)

需要配合第一个工具使用

