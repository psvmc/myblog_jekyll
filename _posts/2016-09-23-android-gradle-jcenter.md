---

layout: post
title: Android 发布个人组件到JCenter
description: Android 发布个人组件到JCenter
keywords: android
category: android

---

## 前言

直接发布个人的组件后，可以方便的在`gradle`中引用  

我们可以把组件发布到[JCenter](https://bintray.com/)或者[JitPack](https://jitpack.io/)中

+ 发布到[JCenter](https://bintray.com/)上网上可以看到两种配置方式 有一种复杂的这里就不说了 怎么方便怎么来
+ 想对来说复杂的发布到JCenter方式可以看[这篇文章](https://my.oschina.net/weiCloudS/blog/384865)
+ 发布到[JitPack](https://jitpack.io/)想对来说就特别简单了


### 发布到JCenter

#### 1.注册Bintray帐号

+ 打开[Bintray官网](https://bintray.com/)进行注册
+ 登录后 在`Owned Repositories`下点击`Add` 添加一个名字为`maven`的仓库 点击创建
+ 然后创建包[网址](https://bintray.com/psvmc/maven/new/package?pkgPath=)
+ 输入几个必输项   
`Name(项目名字)` 例如:`ZJDateTimeSelecterNew`   
`Licenses`   
`Version control(github中的地址)`例如:`https://github.com/psvmc/ZJDateTimeSelecterNew.git` 点击创建

#### 2.项目配置与发布

在项目`根目录`的`build.gradle`的`dependencies`节点中添加  

```bash
classpath 'com.novoda:bintray-release:0.3.4'
```

添加后类似于

```bash
buildscript {
    repositories {
        jcenter()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:2.1.0'
        classpath 'com.novoda:bintray-release:0.3.4'
    }
}
```

---

在项目的`模块目录`的`build.gradle`中的

```bash
apply plugin: 'com.android.library'
```

后添加

```bash
apply plugin: 'com.novoda.bintray-release'
```

android节点里添加

```bash
lintOptions {
    abortOnError false
}
```

android同级节点添加

```bash
publish {
    userOrg = 'psvmc'
    groupId = 'cn.psvmc'
    artifactId = 'ZJDateTimeSelecterNew'
    publishVersion = '1.1.2'
}
```

添加后类似于

```bash
apply plugin: 'com.android.library'
apply plugin: 'com.novoda.bintray-release'
android {
    compileSdkVersion 23
    buildToolsVersion "23.0.2"

    defaultConfig {
        minSdkVersion 15
        targetSdkVersion 23
        versionCode 2
        versionName "1.1.2"
    }
    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }

    lintOptions {
        abortOnError false
    }
}

dependencies {
    compile fileTree(dir: 'libs', include: ['*.jar'])
    testCompile 'junit:junit:4.12'
    compile 'com.android.support:appcompat-v7:23.+'
}

publish {
    userOrg = 'psvmc'
    groupId = 'cn.psvmc'
    artifactId = 'ZJDateTimeSelecterNew'
    publishVersion = '1.1.2'
}
```

`artifactId`与第一步的包名保持一致

---

在`终端`中cd到项目的根目录中运行

```bash
./gradlew clean build bintrayUpload -PbintrayUser=BINTRAY_USERNAME -PbintrayKey=BINTRAY_KEY -PdryRun=false
```

把`BINTRAY_USERNAME` 替换成你的`bintary上组册的用户名`  
`BINTRAY_KEY` 替换成你的 `Bintray的API Key` 即可  

这两个值可以在这[查看](https://bintray.com/profile/edit)

#### 3.链接到JCenter

登录[https://bintray.com](https://bintray.com)  
打开个人中心  打开上传的包详情 会看到下图

![生命周期](https://raw.githubusercontent.com/psvmc/psvmc.github.io/master/images/android/jcenter/jcenter.png)

如果没有链接到JCenter 在`Linked to`后会有个按钮 点击  
输入公司域名反向(类似于cn.psvmc) 保存即可

---

当然也可以打开[https://bintray.com/bintray/jcenter](https://bintray.com/bintray/jcenter)  
输入包名(例如：ZJDateTimeSelecterNew) 也可以

### 发布到JitPack

+ 打开[官网](https://jitpack.io/)
+ 在输入框中输入项目的git地址 如`https://github.com/psvmc/ZJDateTimeSelecterNew.git`
+ 在要发布的版本上点击`Get it` 等左边的进度走完后 点击看看Log中是否成功 成功后就可以使用了

使用方式

在根目录的`build.gradle`中添加

```bash
allprojects {
	repositories {
		...
		maven { url "https://jitpack.io" }
	}
}
```

项目中就可以添加依赖

```bash
dependencies {
        compile 'com.github.psvmc:ZJDateTimeSelecterNew:1.1.2'
}
```

以为这个`无需审核` 发布后就能使用 是不是简单方便 各种嗨  
一定要在发布后看一下`Log` 看看是否成功  
不成功的话根据提示修改后再发布




