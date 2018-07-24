---
layout: post
title: Android 沉浸式状态栏的实现
description: Android 沉浸式状态栏的实现
keywords: android
category: android

---



## 前言

Android沉浸式体验有几个注意点

+ Android4.4(api19)及以上的版本才支持
+ Android5.0(api21)及以上的版本状态栏多了一个半透的黑色层
+ Android5.0(api21)的黑色层通过style去掉后 应用切出去后再切进来后会再次出现

## 我的解决方案

目前这种方案 不管是各个版本 还是是否有侧滑都没有问题



首先先建两个文件夹 `layout-v19`和`values-v19`

之所以不添加`values-v21`是因为 Android5.0(api21)的黑色层通过`style`去掉后 应用切出去后再切进来后会再次出现

所以用代码去除



`values`文件夹下的`styles.xml`

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
</style>
```

`values-v19`文件夹下的`styles.xml

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowTranslucentStatus">true</item>
    <item name="android:windowTranslucentNavigation">true</item>

    <item name="colorPrimary">@color/colorPrimary</item>
    <item name="colorPrimaryDark">@color/colorPrimaryDark</item>
    <item name="colorAccent">@color/colorAccent</item>
</style>
```

`onCreate`方法中添加(Kotlin代码)

用这种方式去除`Android5.0`以上 状态栏的黑色半透层 在重新切回应用时也不会被再次添上

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    val window = window
    window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
    window.decorView.systemUiVisibility =
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
    window.statusBarColor = Color.TRANSPARENT
}
```

接下来就是设置状态栏的背景了 

我的方式是建了适配`api19`前后的两个`layout`文件直接添加到了页面中

`layout`文件夹下的`zj_statusbar.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:layout_width="match_parent"
              android:layout_height="0dp">
</LinearLayout>
```

`layout-19`文件夹下的`zj_statusbar.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:layout_width="match_parent"
              android:layout_height="24dp"
              android:background="@color/zj_orange">
</LinearLayout>
```

不建议用以下方式(在有侧滑的时候有问题)

```xml
android:fitsSystemWindows="true"
android:clipToPadding="true"
android:background="@android:color/holo_blue_light"
```

这种方式首先最外层必须要设置为背景色 它会用该背景色来填充状态栏和虚拟按键栏

一个页面只有一个该属性会生效 如果页面有侧滑的时候不太好处理