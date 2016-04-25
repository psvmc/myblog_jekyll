---

layout: post
title: Android Activity的启动模式
description: Android Activity的启动模式
keywords: android
category: android

---


## 简介

 Activity有四种加载模式
 
 + standard
 + singleTop
 + singleTask
 + singleInstance

设置方式 `android:launchMode="singleTask"`
 
### standard: 标准(默认)模式

当通过这种模式来启动Activity时,Android`总会`为目标
Activity创建一个**新的实例**,并将该Activity添加到`当前
Task栈`中.注意,这种方式`不会启动新的Task`,只是将新的
Activity添加到原有的Task
   
假设  栈结构为 `ABC` 再打开`C`  就会变成 `ABCC`

### singleTop: Task顶单例模式

该模式和standard模式基本一致,但有一点不同:当将要被
启动的Activity**已经位于Task栈顶**时,系统**不会重新创建
目标Activity实例**,而是直接**复用Task栈顶的Activity**

+ 假设  栈结构为 `ABC` 再打开`C` `C`为`singleTop` 就会变成 `ABC`
+ 假设  栈结构为 `ABCD` 再打开`C` `C`为`singleTop` 就会变成 `ABCDC`


### singleTask: Task内单例模式

采用该加载模式时,Activity在**同一个Task内只有一个实例**.  

当系统采用singleTask模式加载Activity时,又分为以下
三种情况:
   
+ (1)如果将要启动的Activity不存在,那么系统将会创建该
  实例,并将其加入Task栈顶
+ (2)如果将要启动的Activity已存在,且存在栈顶,那么此时
  与singleTop模式的行为相同
+ (3)如果将要启动的Activity存在但是没有位于栈顶,那么
  此时系统会把位于该Activity上面的所有其他Activity
  全部移出Task,从而使得该目标Activity位于栈顶

---

+ 假设  栈结构为 `ABC` 再打开`B` `B`为`singleTask ` 就会变成 `AB`
   
### singleInstance: 全局单例模式

在此种加载模式下,无论从哪个Task中启动目标Activity,只会
创建一个目标`Activity`实例且会用一个`全新的Task栈`来装载该
`Activity实例`.并且该Task栈**有且仅有一个Activity实例**
   
当系统采用**singleInstance**模式加载Activity时,又分为以下
两种情况:
   
+ (1)如果将要启动的Activity不存在,那么系统将会先创建一个
  全新的Task,再创建目标Activity实例并将该Activity实例
  放入此全新的Task中
  
+ (2)如果将要启动的Activity已存在,那么无论它位于哪个应用
  程序,哪个Task中;系统都会把该Activity所在的Task转到
  前台,从而使该Activity显示出来
 
---
 
+ 1) 假设  栈结构(Task1)为 `A`，再打开`B`，`B`为`singleInstance `，就会新建一个栈结构(Task2)，栈结构(Task1)中为`A`，栈结构(Task2)中为`B`   
+ 2) 如果再打开`C`,那么 栈结构(Task1)中为`AC`
+ 3) 如果点后退键的话，栈结构(Task1)中为`A` 也就是显示的是`A页面`而不是`B页面`
+ 4) 如果再点后退的话，会显示 栈结构(Task2)中的`B`页面  而不是退出程序
+ 5) 如果再点击`Home键` 退出程序 再点击后台进程图标显示的是B页面 ，如果点击桌面图标的话则显示的是A页面

---

+ 4) 如果接着上面的第3)步 点`Home键` 就会清空栈结构(Task2)  再次点击后台进入  如果再点后退的话，就会退出程序