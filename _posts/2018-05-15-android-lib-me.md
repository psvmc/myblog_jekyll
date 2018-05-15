---
layout: post
title: 我常用的Android库
description: 我常用的Android库
keywords: android
categories: android

---

## Android官方

```bash
implementation 'com.android.support:appcompat-v7:27.1.1'
implementation 'com.android.support.constraint:constraint-layout:1.1.0'
implementation 'com.android.support:design:27.1.1'
implementation 'com.android.support:cardview-v7:27.1.1'
implementation 'com.android.support:support-v4:27.1.1'
```



## 我的必备组件



+ Kotlin & [`anko`](https://github.com/Kotlin/anko)

  project - build.gradle

  ```bash
  buildscript {
      ext.kotlin_version = '1.1.51'
  	//....
      dependencies {
          //...
          classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
      }
  }
  ```

  app - build.gradle

  ```bash
  apply plugin: 'kotlin-android'
  apply plugin: 'kotlin-android-extensions'
  apply plugin: 'kotlin-kapt'
  
  dependencies {
      implementation "org.jetbrains.kotlin:kotlin-stdlib-jre7:$kotlin_version"
      compile "org.jetbrains.anko:anko-commons:0.10.4"
  }
  ```

  

+ 权限 [`PermissionsDispatcher`](https://github.com/permissions-dispatcher/PermissionsDispatcher)

  Kotlin

  ```bash
  apply plugin: 'kotlin-kapt'
  
  dependencies {
    compile("com.github.hotchemi:permissionsdispatcher:3.2.0") {
        // if you don't use android.app.Fragment you can exclude support for them
        exclude module: "support-v13"
    }
    kapt "com.github.hotchemi:permissionsdispatcher-processor:3.2.0"
  }
  ```

  

+ Adapter [`BaseRecyclerViewAdapterHelper`](https://github.com/CymChad/BaseRecyclerViewAdapterHelper)

  ```bash
  implementation 'com.github.CymChad:BaseRecyclerViewAdapterHelper:2.9.30'
  ```

  

+ RX [`RxAndroid`](https://github.com/ReactiveX/RxAndroid)

  ```bash
  implementation 'io.reactivex.rxjava2:rxandroid:2.0.2'
  implementation 'io.reactivex.rxjava2:rxjava:2.1.10'
  implementation 'com.jakewharton.rxbinding2:rxbinding:2.1.1'
  implementation 'com.trello.rxlifecycle2:rxlifecycle:2.2.1'
  implementation 'com.trello.rxlifecycle2:rxlifecycle-components:2.2.1'
  ```



+ HTTP [`okhttp-OkGo`](https://github.com/jeasonlzy/okhttp-OkGo)  JSON[`fastjson`](https://github.com/alibaba/fastjson)

  ```bash
  //网络请求
  implementation 'com.lzy.net:okgo:3.0.4'
  implementation 'com.lzy.net:okrx2:2.0.2'
  //JSON
  implementation 'com.alibaba:fastjson:1.2.46'
  ```



+ 数据库 [`android-lite-orm`](https://github.com/litesuits/android-lite-orm)

  ```bash
  引用Jar包
  ```

  

+ 事件总线 [`EventBus`](https://github.com/greenrobot/EventBus)

  ```bash
  implementation 'org.greenrobot:eventbus:3.0.0'
  ```

  

+ 图片加载[`Glide`](https://github.com/bumptech/glide) OR [`glide-transformations`](https://github.com/wasabeef/glide-transformations) 选其一

  ```bash
  //Glide
  implementation 'com.github.bumptech.glide:glide:3.7.0'
  //glide-transformations
  implementation 'jp.wasabeef:glide-transformations:3.1.1'
  implementation 'jp.co.cyberagent.android.gpuimage:gpuimage-library:1.4.1'
  ```

  

+ 图片圆角[`RoundedImageView`](https://github.com/vinc3m1/RoundedImageView) 背景圆角[`FlycoRoundView`](https://github.com/H07000223/FlycoRoundView)

  ```bash
  //图片圆角
  implementation 'com.makeramen:roundedimageview:2.3.0'
  //背景圆角
  implementation 'com.flyco.roundview:FlycoRoundView_Lib:1.1.4@aar'
  ```

  

+ 消息提示 [`Toasty`](https://github.com/GrenderG/Toasty)

  ```bash
  implementation 'com.github.GrenderG:Toasty:1.2.8'
  ```



+ 弹出窗口 [`Material Dialogs`](https://github.com/afollestad/material-dialogs)

  ```bash
  dependencies {
      implementation 'com.afollestad.material-dialogs:core:0.9.6.0'
  }
  ```

  

+ 事件视图绑定 [`Butterknife`](https://github.com/JakeWharton/butterknife)

  ```bash
  dependencies {
    implementation 'com.jakewharton:butterknife:8.8.1'
    annotationProcessor 'com.jakewharton:butterknife-compiler:8.8.1'
  }
  ```

  如果编程语言为`Kotlin`, 替换 `annotationProcessor` 为 `kapt`



+ 圆状进度 [`CircleProgressBar`](https://github.com/dinuscxj/CircleProgressBar)

  ```bash
  //圆状进度
  implementation 'com.dinuscxj:circleprogressbar:1.1.1'
  ```

  

+ Banner [`BGABanner-Android`](https://github.com/bingoogolapple/BGABanner-Android)

  ```bash
  //Banner
  implementation 'cn.bingoogolapple:bga-banner:2.2.4@aar'
  ```



+ 标签云 [`TagCloudView`](https://github.com/kingideayou/TagCloudView)

  ```bash
  //标签云
  compile 'com.github.kingideayou:tagcloudview:1.0.2'
  ```



+ 多条件筛选菜单  [`DropDownMenu`](https://github.com/dongjunkun/DropDownMenu)

  ```bash
  allprojects {
      repositories {
          ...
          maven { url "https://jitpack.io" }
      }
  }
  
  dependencies {
      compile 'com.github.dongjunkun:DropDownMenu:1.0.4'
  }
  ```

  

+ 仿iOS Segment [`SHSegmentControl`](https://github.com/7heaven/SHSegmentControl)  

  ```bash
  implementation 'com.7heaven.widgets:segmentcontrol:1.17'
  ```



+ 加载HTML的TextView [`html-textview`](https://github.com/psvmc/html-textview)

  ```bash
  dependencies {
      implementation 'org.sufficientlysecure:html-textview:3.5'
  }
  ```

  

+ 自定义弹出层 [`CustomPopwindow`](https://github.com/pinguo-zhouwei/CustomPopwindow)

  ```bash
  allprojects {
      epositories {
          //...
          maven {
              url 'https://jitpack.io'
          }
  }
  
  dependencies {
  	compile 'com.github.pinguo-zhouwei:CustomPopwindow:2.1.1'
  }
  ```

  

