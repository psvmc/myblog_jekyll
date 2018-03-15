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



## 批量卖卡

QQ浏览器下载 `暴力猴` 插件:浏览器加载运行JS

[`Steam-Economy-Enhancer`](https://github.com/Sneer-Cat/Steam-Economy-Enhancer)：添加批量卖卡按钮的JS



## 挂卡

[`ASF`](https://github.com/JustArchi/ArchiSteamFarm/releases)

需要配合第一个工具使用

