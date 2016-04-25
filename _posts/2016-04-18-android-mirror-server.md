---

layout: post
title: Android sdk镜像服务器
description: Android sdk镜像服务器
keywords: android
category: android

---

## 前言

解决Android SDK无法下载的问题

### 配置步骤

+ 启动 `Android SDK Manager` ，打开主界面，依次选择「`Tools`」、「`Options...`」，弹出『`Android SDK Manager - Settings`』窗口；
+ 在『`Android SDK Manager - Settings`』窗口中，在「`HTTP Proxy Server`」和「`HTTP Proxy Port`」输入框内填入`mirrors.neusoft.edu.cn`和`80`，并且选中「`Force https://... sources to be fetched using http://...`」复选框。设置完成后单击「`Close`」按钮关闭『`Android SDK Manager - Settings`』窗口返回到主界面；
+ 依次选择「`Packages`」、「`Reload`」。
+ 由于某些网络接入商进行了劫持，会弹出用户认证界面无法使用，和本镜像服务器配置无关。 