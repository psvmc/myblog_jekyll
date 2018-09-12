---

layout: post
title: 常用的Android库
description: 常用的Android库
keywords: android
categories: android

---

## Android官方

```
compile 'com.android.support:appcompat-v7:23.0.0'
compile 'com.android.support:cardview-v7:23.0.0'
compile 'com.android.support:gridlayout-v7:23.0.0'
compile 'com.android.support:recyclerview-v7:23.0.0'
compile 'com.android.support:design:23.0.0'
compile 'com.android.support:support-v4:23.0.0'
```



## 功能相关

### HTTP

|名称|引用方式|个人推荐|
|---|---|---|
|[`okhttp-OkGo`](https://github.com/jeasonlzy/okhttp-OkGo)|`compile 'com.lzy.net:okgo:3.0.4'`|`★★★`|
|[`okhttputils`](https://github.com/hongyangAndroid/okhttputils)|`compile 'com.zhy:okhttputils:2.6.2'`|`★★`停止维护|
|[`retrofit`](https://github.com/square/retrofit)|`compile 'com.squareup.retrofit2:retrofit:2.1.0'`|`★★`|
|[`xUtils3`](https://github.com/wyouflf/xUtils3)|`compile 'org.xutils:xutils:3.3.38'`|`★★`|

### JSON解析

|名称|引用方式|个人推荐|
|---|---|---|
|[`fastjson`](https://github.com/alibaba/fastjson)|`compile 'com.alibaba:fastjson:1.2.46'`|`★★★`|
|[`gson`](https://github.com/google/gson)|`compile 'com.google.code.gson:gson:2.8.0'`|`★★`泛型支持不好|

### 事件总线

|名称|引用方式|个人推荐|
|---|---|---|
|[`EventBus`](https://github.com/greenrobot/EventBus)|`compile 'org.greenrobot:eventbus:3.0.0'`|`★★★`项目未使用Rxjava|
|[`RxBus`](https://github.com/AndroidKnife/RxBus)|`compile 'com.hwangjr.rxbus:rxbus:1.0.5'`|`★★`项目使用Rxjava <br />作者好长时间未更新|
|[`otto`](https://github.com/square/otto)|`compile 'com.squareup:otto:1.3.8'`|`★★`|

### 数据库

|名称|引用方式|个人推荐|
|---|---|---|
|[`android-lite-orm`](https://github.com/litesuits/android-lite-orm)|`引用jar包`|`★★★`|
|[`greenDAO`](https://github.com/greenrobot/greenDAO)|`见官网`|`★★`|
|[`xUtils3`](https://github.com/wyouflf/xUtils3)|`compile 'org.xutils:xutils:3.3.38'`|`★★`|

### 图片圆角

|名称|引用方式|个人推荐|
|---|---|---|
|[`RoundedImageView`](https://github.com/vinc3m1/RoundedImageView)|`compile 'com.makeramen:roundedimageview:2.2.1'`|`★★★`|

### 图片异步加载

|名称|引用方式|个人推荐|
|---|---|---|
|[`Glide`](https://github.com/bumptech/glide)|`compile 'com.github.bumptech.glide:glide:3.7.0'`|`★★★`|
|[`Picasso`](https://github.com/square/picasso)|`compile 'compile 'com.squareup.picasso:picasso:2.5.2'`|`★★`自定义ImageView无法加载图片|
|[`xUtils3`](https://github.com/wyouflf/xUtils3)|`compile 'org.xutils:xutils:3.3.38'`|`★★`|

### 事件视图绑定

|名称|引用方式|个人推荐|
|---|---|---|
|[`butterknife`](https://github.com/JakeWharton/butterknife)|`见官网`|`★★★`|
|[`xUtils3`](https://github.com/wyouflf/xUtils3)|`compile 'org.xutils:xutils:3.3.38'`|`★★`|

### RxAndroid

[RxAndroid](https://github.com/ReactiveX/RxAndroid)

```bash
implementation 'io.reactivex.rxjava2:rxandroid:2.0.2'
implementation 'io.reactivex.rxjava2:rxjava:2.1.10'
```

### 权限

| 名称                                                         | 引用方式 | 个人推荐 |
| ------------------------------------------------------------ | -------- | -------- |
| [`PermissionsDispatcher`](https://github.com/permissions-dispatcher/PermissionsDispatcher) | `见官网` | `★★★`    |

## UI相关

我常用的UI组件

| 作用         | 名称                                                         | 引用方式                                                     |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 圆状进度     | [**CircleProgressBar**](https://github.com/dinuscxj/CircleProgressBar) | `implementation 'com.dinuscxj:circleprogressbar:1.1.1'`      |
| 图片圆角     | [**RoundedImageView**](https://github.com/vinc3m1/RoundedImageView) | `implementation 'com.makeramen:roundedimageview:2.3.0'`      |
| 背景圆角     | [**FlycoRoundView**](https://github.com/H07000223/FlycoRoundView) | `compile 'com.flyco.roundview:FlycoRoundView_Lib:1.1.4@aar'` |
| 加载处理图片 | [**glide-transformations**](https://github.com/wasabeef/glide-transformations) | `implementation 'jp.wasabeef:glide-transformations:3.1.1'`    <br />`implementation 'jp.co.cyberagent.android.gpuimage:gpuimage-library:1.4.1'` |
| 消息提示     | [**Toasty**](https://github.com/GrenderG/Toasty)             | `implementation 'com.github.GrenderG:Toasty:1.2.8'`          |
|              |                                                              |                                                              |



## 相册图片选择

[`PictureSelector`](https://github.com/LuckSiege/PictureSelector) 

所需权限

```xml
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android:name="android.permission.CAMERA" />
```

项目根目录build.gradle加入

```bash
allprojects {
   repositories {
      jcenter()
      maven { url 'https://jitpack.io' }
   }
}
```

compile引入

```bash
dependencies {
    implementation 'com.github.LuckSiege.PictureSelector:picture_library:v2.2.3'
}
```