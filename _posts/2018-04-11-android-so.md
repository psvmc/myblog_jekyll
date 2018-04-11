---
layout: post
title: Android 引用第三方so文件
description: Android 引用第三方so文件
keywords: android
categories: 
        - android

---



## 前言

应用程序二进制接口（Application Binary Interface）定义了二进制文件（尤其是.so文件）如何运行在相应的系统平台上，从使用的指令集，内存对齐到可用的系统函数库。在Android 系统上，每一个CPU架构对应一个`ABI：armeabi`，`armeabi-v7a`，`x86`，`mips`，`arm64- v8a`，`mips64`，`x86_64`。

so文件和jar包存放到工程的libs目录下。 

另外，可以将apk解压出来，查看lib目录，也能分析该apk的so文件目录。



不同CPU架构的Android手机加载时会在libs下找自己对应的目录，从对应的目录下寻找需要的.so文件；

如果没有对应的目录，就会去**armeabi**下去寻找，如果已经有对应的目录，但是如果没有找到对应的.so文件，也不会去armeabi下去寻找了。

所以，这里需要注意工程有几个so文件目录，就需要放入对应的so文件，不然会报错。

如何适配各个目录，例如有一些第三方的类库只提供了armeabi下的.so文件，而工程配置不止armeabi一个目录，这就需要将armeabi下的.so文件复制到其他对应的目录下。如果第三方提供了不同平台的.so文件，则复制不同平台的.so文件到项目中对应的文件夹下即可。

so文件也会影响编译出的apk大小（将apk解压出来，lib目录下就为so文件目录），所以只配置armeabi一个目录，既能适配各CPU架构的手机，也能精简apk大小（微信就是只有armeabi一个目录）。



就现在（2017 年）来说，基本上，市面上绝大部分机器，都是 64 位，可以只给 arm64-v8a。

`armeabi-v7a` 与 `arm64-v8a` 都可以兼容 `armeabi`，而市面上的 x86 机器，也基本上都可以使用 intel 的 libhounini 项目直接在 x86 机器上运行仅含 armeabi 的动态库代码。

如果不是为了性能，只需要提供 armeabi 的架构就好，你看微信，就只给 armeabi。但是，armeabi 不支持硬件浮点，所以微信还自带的部分的 v7a 版本库，用于动态加载。

从Android开发上看armeabi是指 so库用于ARM的通用CPU ，不支持硬件浮点运算 。如果你没有在so库中使用硬件浮点运算的ARM手机都是armeabi。包括（骁龙、海思）

但从Android so库支持的CPU架构进程角度，`armeabi`是指arm v5和arm v6架构的CPU，对应的arm内核是arm9 和arm11。

现在貌似都在用cortex 内核（对应`armeabi v7a`）



## 配置

使用 app源根文件夹下`build.gradle`文件的配置：

```
android {
    defaultConfig {
        // 不声明ndk标签,项目默认会创建一个libapp.so的文件
        ndk {
            //声明启用Android日志, 在c/c++的源文件中使用的#include <android/log.h> 日志将得到输出
            ldLibs "log"
            // 声明创建指定cpu架构的so库, 不声明的话, 默认(gradle 1.5.0)会生成4中架构 多一种mips架构
            abiFilters "armeabi", "armeabi-v7a", "x86"
        }

    }

    sourceSets {
        main {
            // 1. 配置在根目录libs下可以加载第三方so库, (最好不要创建jniLibs, 在众多的开源库中可能会引起冲突,还没发现)
            // 2. 运行时会自动将libs目录下的so库拷贝到指定目录
            // 3. 如果自己创建的so不需要重新编译,可以将(app/build/intermediates/transforms)生成的so拷贝到这个目录
            jniLibs.srcDirs = ['libs']
        }    
    }
}
```

此外，要再 `gradle.properties` 文件中添加

```json
android.useDeprecatedNdk=true
```

重新编译工程即可。

