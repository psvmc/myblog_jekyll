---

layout: post
title: Android Gradle 设置导出APK的名称
description: Android Gradle 设置导出APK的名称
keywords: gradle
category: android

---

## 修改导出APK名称

在 `app` moudle 中打开 `build.gradle`   
找到配置 `android{...}`  

在里层添加如下配置

```groovy
android.applicationVariants.all { variant ->
    variant.outputs.each { output ->
        def releaseTime = new Date().format("yyyy-MM-dd", TimeZone.getTimeZone("UTC"))
        def outputFile = output.outputFile
        if (outputFile != null && outputFile.name.endsWith('.apk')) {
            //这里修改apk文件名
            def fileName = "应用名称-${defaultConfig.versionName}(Build ${defaultConfig.versionCode})-${releaseTime}.apk"
            output.outputFile = new File(outputFile.parent, fileName)
        }
    }
}
```

这样导出的apk的名称就会类似于这样 `应用名称-1.0(Build 2)-2015-10-10.apk`

