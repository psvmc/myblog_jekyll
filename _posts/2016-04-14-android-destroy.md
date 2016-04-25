---

layout: post
title: Android 退出应用
description: Android 退出应用
keywords: android
category: android

---

## 前言

Android是个神奇的东西 当程序进入后台时 即使时`application`也会被销毁   
如果`application`中保存着某些变量就会丢失  
所以我们可以在`application`销毁时 退出应用 

可以给`application`注册一个`onDestroy`事件，即销毁时触发的事件。  
在Android中,Activity有个栈,一个Activity结束掉,会回到上一个Activity,并不是退出应用程序。  
Android中,退出应用程序的方式有以下两种

### 通过pid

```java
int pid = android.os.Process.myPid();//获取当前应用程序的PID
android.os.Process.killProcess(pid);//杀死当前进程
```

这种方法退出应用，是会`保留`某些后进程,例如:`Service,Notifications`等。

### 通过ActivityManager

```
ActivityManager manager = (ActivityManager)context.getSystemService(ACTIVITY_SERVICE); //获取应用程序管理器 
manager.killBackgroundProcesses(getPackageName()); //强制结束当前应用程序
```

这种方式退出应用，会`结束`本应用程序的`一切活动`,因为本方法会根据应用程序的包名`杀死`所有进程包括`Activity,Service,Notifications`等。