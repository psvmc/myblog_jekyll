---

layout: post
title: Xcode 不显示多余的日志
description: if we're in the real pre-commit handler we can't actually add any new fences due to CA restriction
keywords: ios
category: ios

---

## Xcode 不显示多余的日志

运行程序的时候老是提示一堆`if we’re in the real pre-commit handler we can’t actually add any new fences due`。这是编译器内部的显示,与 app 正常使用无关.

解决方式

第一步

![](http://image.psvmc.cn/20171109092526786.png!github)

第二步

![](http://image.psvmc.cn/20171109092606005.png!github)

> 也就是配置了`OS_ACTIVITY_MODE`为`disable`。 
