---
layout: post
title: Android开发小贴士
description: Android开发小贴士
keywords: android
categories: android java
---



## UI

+ `setBackgroundResource(0)` 可以移除 View 的背景色
+ `Resources.getSystem().getDisplayMetrics().density` 可以不用 Context 也能获取屏幕密度哦



## 功能

+ `TextUtils.isEmpty()` 如果传入的String 为NULL或者Length为0的话就返回 true



## 兼容

+ 华为手机无法显示log解决方案,.拨号界面输入(*#*#2846579#*#*) Service menu will appear.Go to 
  "ProjectMenu" -> "Background Setting" -> "Log Setting"Open "Log 
  switch" and set it to ON.Open "Log level setting" and set the log level 
  you wish.