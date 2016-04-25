---

layout: post
title: iOS发布app Missing iOS Distribution signing identity
description:  iOS发布app Missing iOS Distribution signing identity
keywords: ios
category: ios

---


## 问题描述

关于16年2月14日以后上传AppStore出现：`Missing iOS Distribution signing identity for...`的问题
![](http://www.psvmc.cn/images/20160227/001.png)

导致问题的原因是：
下边这个**证书过期**了

![](http://www.psvmc.cn/images/20160227/002.png)

## 解决办法
1，打开钥匙串

![](http://www.psvmc.cn/images/20160227/003.png)

2，显示所有已过期的证书

![](http://www.psvmc.cn/images/20160227/004.png)

3，在‘登陆’和‘系统’中删除已过期的[Apple Worldwide Developer Relations Certification Authority](https://developer.apple.com/certificationauthority/AppleWWDRCA.cer)证书（‘系统’需要解除权限才能删除）

记得用右侧的搜索**Apple Worldwide**  

![](http://www.psvmc.cn/images/20160227/005.png)

4，下载新的[Apple Worldwide Developer Relations Certification Authority](https://developer.apple.com/certificationauthority/AppleWWDRCA.cer)证书，双击安装

这时你的开发、发布等证书就正常了

转载自[简书](http://www.jianshu.com/p/9dc2aad90539)