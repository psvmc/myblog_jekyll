---
layout: post
title: Android开发小贴士
description: Android开发小贴士
keywords: android
categories: android java
---



# 界面UI相关

## 状态栏透明(沉浸式体验)

![016032813323867](https://ws2.sinaimg.cn/large/006tKfTcly1fptmrokuphj30lf0el42i.jpg)

Style

```xml
<style name="AppTheme" parent="Theme.AppCompat.Light.NoActionBar">
    <item name="android:windowTranslucentStatus">
        true
    </item>
    <!--设置方向-->
    <item name="android:screenOrientation">portrait</item>
</style>
```

Java

```java
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    Window window = getWindow();
    window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS);
    window.getDecorView().setSystemUiVisibility(View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN | View.SYSTEM_UI_FLAG_LAYOUT_STABLE);
    window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
    window.setStatusBarColor(Color.TRANSPARENT);
}
```

Kotlin

```kotlin
if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
    val window = window
    window.clearFlags(WindowManager.LayoutParams.FLAG_TRANSLUCENT_STATUS)
    window.decorView.systemUiVisibility = View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN or View.SYSTEM_UI_FLAG_LAYOUT_STABLE
    window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
    window.statusBarColor = Color.TRANSPARENT
}
```



## 移除 View 的背景色

+ `setBackgroundResource(0)` 可以移除 View 的背景色




## Activity 背景透明

```xml
<style name="TransparentTheme" parent="AppTheme"> <!--window背景透明-->
    <item name="android:windowBackground">@color/transparent</item>
    <item name="android:colorBackgroundCacheHint">@null</item> <!--window透明-->
    <item name="android:windowIsTranslucent">true</item> <!--去掉过渡动画-->
    <item name="android:windowAnimationStyle">@null</item>
</style>
```



## 添加阴影

```xml
android:elevation="2dp"
```

## 获取屏幕宽高

`Resources.getSystem().getDisplayMetrics().density` 可以不用 Context 也能获取屏幕密度哦

Kotlin

```kotlin
val resources = this.resources
val dm = resources.displayMetrics
val density = dm.density// 屏幕密度（0.75 / 1.0 / 1.5 / 2 / 3）
val width = dm.widthPixels
val height = dm.heightPixels
val densityDpi = dm.densityDpi     // 屏幕密度dpi（120 / 160 / 240）
// 屏幕宽度算法:屏幕宽度（像素）/屏幕密度
val screenWidth = (width / density).toInt()  // 屏幕宽度(dp)
val screenHeight = (height / density).toInt()// 屏幕高度(dp)

Log.d(TAG,"width_px:$width")
Log.d(TAG,"height_px:$height")

Log.d(TAG,"width_dp:$screenWidth")
Log.d(TAG,"height_dp:$screenHeight")

Log.d(TAG,"density:$density")
Log.d(TAG,"densityDpi:$densityDpi")
```

屏幕的密度与资源的关系

|            |  ldpi   |  mdpi   |  hdpi   |  xhdpi   |  xxhdpi   |
| ---------- | :-----: | :-----: | :-----: | :------: | :-------: |
| 密度       |  0.75   |    1    |   1.5   |    2     |     3     |
| 密度DPI    |   120   |   160   |   240   |   320    |    480    |
| 代表分辨率 | 240x320 | 320x480 | 480x800 | 720x1280 | 1080x1920 |

注意的是并不一定是尺寸超过`1080x1920`就要用`xxhdpi`的资源

- 比如华为M3平板 就还是建议做`xhdpi`的图

|  分辨率   |   DP    | 密度 | 密度DPI |
| :-------: | :-----: | :--: | :-----: |
| 1920x1200 | 853x533 | 2.25 |   360   |

用原图上切图 在`853x533`尺寸上做标注

## EditText

+ `EditText`去掉下划线 `android:background="@null"`

+ `EditText `光标颜色和文字一样 `android:textCursorDrawable="@null"`


  自定义光标颜色

  ```xml
  <?xml version="1.0" encoding="utf-8"?>
  <shape xmlns:android="http://schemas.android.com/apk/res/android"
      android:shape="rectangle" >
      <size android:width="2dp" />
      <solid android:color="#ff7200" />
  </shape>
  ```

  然后 `android:textCursorDrawable="@drawable/edit_cursor_color"`

## Button

- 去阴影

  ```xml
  style="?android:attr/borderlessButtonStyle"
  ```


- 去背景

  ```xml
  android:background="@null"
  ```




## TextView

+ 行间距

  ```xml
  android:lineSpacingExtra="0dp"
  android:lineSpacingMultiplier="1.3"
  ```

+ 字间距

  ```xml
  android:letterSpacing="0.1"
  ```

  ​

## 涟漪效果

drawable

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="false" android:drawable="@android:color/white"/>
    <item android:state_pressed="true" android:drawable="@color/zj_gay_light"/>
</selector>
```

drawable-v21

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- ripple 是5.0才出现的新标签-->
<ripple xmlns:android="http://schemas.android.com/apk/res/android"
        android:color="@color/zj_gay_light">
    <item android:drawable="@android:color/white"/>
</ripple>
```



## 背景圆角

```xml
<?xml version="1.0" encoding="utf-8"?>

<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="rectangle">
    <!--圆角度数-->
    <corners android:radius="6dp" />
    <!--边宽宽度及边宽颜色-->
    <stroke
        android:width="1dp"
        android:color="#ccffffff" />
    <!--背景-->
    <solid android:color="@color/zj_blue" />
</shape>
```



## Button背景圆角+涟漪

涟漪效果用的色值`#9ccc`

本来的设想是设置圆角的XML 再设置涟漪效果  但是实际发现效果是 涟漪的效果并不是圆角的

所以就变通了一下 背景只设置颜色  再在外层添加一个`android.support.v7.widget.CardView`

+ login_button_bg_anim.xml(drawable)

```xml
<?xml version="1.0" encoding="utf-8"?>
<selector xmlns:android="http://schemas.android.com/apk/res/android">
    <item android:state_pressed="false" android:drawable="@color/zj_white"/>
    <item android:state_pressed="true" android:drawable="@color/zj_button_press"/>
</selector>
```

+ login_button_bg_anim.xml(drawable-v21)

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- ripple 是5.0才出现的新标签-->
<ripple xmlns:android="http://schemas.android.com/apk/res/android"
    android:color="@color/zj_button_press">
    <item android:drawable="@color/zj_white"/>
</ripple>
```

+ layout

```xml
<android.support.v7.widget.CardView
    android:layout_width="match_parent"
    android:layout_height="60dp"
    android:layout_marginTop="54dp"
    app:cardCornerRadius="30dp">

    <Button
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="@drawable/login_button_bg_anim"
        android:text="立即登录"
        android:textColor="#0c9cee"
        android:textSize="23sp" />
</android.support.v7.widget.CardView>
```

## 软键盘默认不弹出

方法一：在`OnCreate()`函数中，加上下面的代码

```java
getWindow().setSoftInputMode( WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
```

方法二：在`AndroidManifest.xml`中，在所要设置的activity中设置以下属性就行了

```xml
activity android:windowSoftInputMode = "stateAlwaysHidden | adjustPan"
```

属性值的介绍：

+ stateUnspecified

  这个是软件盘行为默认的设置。软键盘的状态(是否它是隐藏或可见)没有被指定。系统将选择一个合适的状态或依赖于主题的设置。

+ stateUnchanged

  当主窗口出现在前面时，软键盘被保持它上次是什么状态，无论上次是可见或隐藏。

+ stateHidden

  当用户选择该Activity时，软键盘被隐藏——也就是说，当用户确定导航到该Activity时，不管他离开的Activity的软键盘是可见还是隐藏都会被隐藏，不过当用户离开一个Activity而导致另一个被覆盖的Activity显示出来时，软键盘会使用默认的设置。

+ stateAlwaysHidden

  当该Activity主窗口获取焦点时，软键盘总是被隐藏的，不管是确认导航到该Activity还是Activity被覆盖后显示出来。

+ stateVisible

  当用户导航到Activity主窗口时，软键盘是可见的。不过当用户离开一个Activity而导致另一个被覆盖的Activity显示出来时，软键盘会使用默认的设置。

+ stateAlwaysVisible

  当该Activity主窗口获取焦点时，软键盘总是显示的，不管是确认导航到该Activity还是Activity被覆盖后显示出来。

+ adjustUnspecified

  这个是软件盘行为默认的设置。它不被指定是否该Activity主窗口调整大小以便留出软键盘的空间，或是否窗口上的内容得到屏幕上当前的焦点是可见的。系统将自动选择这些模式中一种主要依赖于是否窗口的内容有任何布局视图能够滚动他们的内容。如果有这样的一个视图，这个窗口将调整大小，这样的假设可以使滚动窗口的内容在一个较小的区域中可见的。

+ adjustResize

  该Activity主窗口总是被调整屏幕的大小以便留出软键盘的空间

+ adjustPan

  该Activity主窗口并不调整屏幕的大小以便留出软键盘的空间。相反，当前窗口的内容将自动移动以便当前焦点从不被键盘覆盖和用户能总是看到输入内容的部分。这个通常是不期望比调整大小，因为用户可能关闭软键盘以便获得与被覆盖内容的交互操作。




## 点击空白隐藏键盘

Kotlin

```kotlin
/**
 * 点击空白区域隐藏键盘.
 */
override fun onTouchEvent(event: MotionEvent): Boolean {
    val imm = getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
    if (event.action == MotionEvent.ACTION_DOWN) {
        if (this@LoginActivity.getCurrentFocus() != null) {
            if (this@LoginActivity.getCurrentFocus().getWindowToken() != null) {
                imm.hideSoftInputFromWindow(this@LoginActivity.getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS)
            }
        }
    }
    return super.onTouchEvent(event)
}
```



## Kotlin中Fragment获取实例

必须在`onViewCreated`中获取

```kotlin
override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
    super.onViewCreated(view, savedInstanceState)
    register_button?.setOnClickListener {
        activity?.finish()
    }
}
```



# 常用方法

+ `TextUtils.isEmpty()` 如果传入的String 为NULL或者Length为0的话就返回 true


# 华为设备不显示日志

+ 华为手机无法显示log解决方案,.拨号界面输入 `*#*#2846579#*#*`

  依次选择ProjectMenu---后台设置----LOG设置---AP日志 点击打开

+ 华为平板 打开计算器 横屏状态 输入`()()2846579()()`


