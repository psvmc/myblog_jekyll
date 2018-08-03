---
layout: post
title: Mac上用Flutter来开发--Android
description: Mac上用Flutter来开发--Android
keywords: flutter
category: flutter

---



## 安装



### 下载Flutter

```bash
cd ~
git clone -b beta https://github.com/flutter/flutter.git
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export PATH=`pwd`/flutter/bin:$PATH
```

> 克隆的地址也可以从[`码云`](https://gitee.com/search?utf8=%E2%9C%93&q=flutter&type=)上找

Windows执行如下操作

添加环境变量

```
PUB_HOSTED_URL      https://pub.flutter-io.cn
FLUTTER_STORAGE_BASE_URL     https://storage.flutter-io.cn
```

接下来运行

```bash
cd ./flutter
flutter doctor
```

这个命令会告诉你你的flutter还缺少什么依赖

接着运行

```bash
flutter
```

第一次运行`flutter`它会自动下载一些依赖，并且进行自动编译。

随后再次运行flutter就会跳过这些步骤。



安装完flutter以后google analytics默认是自动打开的，如果有同学不喜欢flutter在后台默默上传你的使用数据和错误信息可以选择关闭：

```bash
flutter config --no-analytics
```



### 安装插件

`Android Studio`中`Plugins` 查找`dart`和`flutter`并安装。

## 问题

Waiting for another flutter command to release the startup lock

+ 1、打开`flutter`的安装目录`/bin/cache/`  
+ 2、删除`lockfile`文件   
+ 3、重启`AndroidStudio`

