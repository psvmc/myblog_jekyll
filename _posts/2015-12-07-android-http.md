---

layout: post
title: android http请求
description: android http请求
keywords: android http
categories: android

---


### 前言

android开发如果使用`sdk23`以上会发现之前很多http库都不能用了，原因是`sdk23`
中已不提供`org.apache.http.*`，推荐使用
`HttpURLConnection`,这个API的效率更高，可以减少网络使用，降低耗电量，好处是不少但是没啥好用的封装库，要是还想用`Apache HTTP API`也是有办法的。


### 解决方法

#### Android studio中的解决办法

在app目录下的`build.gradle`文件中声明编译时的依赖:

```java
android {
    useLibrary 'org.apache.http.legacy'
}
```

#### Eclipse中的解决办法

`lib`中添加`org.apache.http.legacy.jar`

### 基于Apache HTTP API的封装库

`android-async-http`使用起来还是比较好用的

`android studio`中使用要添加依赖

```java
dependencies {
    compile 'com.loopj.android:android-async-http:1.4.9'
}
```

`eclipse` 中在`lib`中添加此jar包

[官方下载地址及使用说明](https://loopj.com/android-async-http/)


