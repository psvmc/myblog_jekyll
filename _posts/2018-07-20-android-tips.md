---
layout: post
title: Android开发常用的知识点
description: Android开发常用的知识点
keywords: android
categories: android
---



# 环境

## 引入外部jar

```json
android {
    ......
    sourceSets {
        main {
            jniLibs.srcDirs = ['libs']
        }
    }
}

dependencies {
    implementation fileTree(include: ['*.jar'], dir: 'libs')
    ......
}
```

## 支持HttpClient

```json
android {
    ......
    useLibrary 'org.apache.http.legacy'
}
```



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



## 设置横屏竖屏

### 代码中配置

```java
//设置横屏代码
setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);//横屏
//设置竖屏代码
setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);//竖屏
```

 因为横屏有两个方向的横法，而这个设置横屏的语句，如果不是默认的横屏方向，会把已经横屏的屏幕旋转180°。

 所以可以先判断是否已经为横屏了，如果不是再旋转，不会让用户觉得转的莫名其妙啦！代码如下：

```java
if(this.getResources().getConfiguration().orientation ==Configuration.ORIENTATION_PORTRAIT){
  setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
}
```

### XML中配置

在`AndroidManifest.xml`中配置

找到你所指定的`activity`中加上`android:screenOrientation`属性，它有以下几个参数：

+ unspecified--默认值，由系统来判断显示方向.判定的策略是和设备相关的，所以不同的设备会有不同的显示方向 
+ landscape--横屏显示（宽比高要长） 
+ portrait--竖屏显示(高比宽要长) 
+ user--用户当前首选的方向 
+ behind--和该Activity下面的那个Activity的方向一致(在Activity堆栈中的) 
+ sensor--有物理的感应器来决定。如果用户旋转设备这屏幕会横竖屏切换
+ nosensor--忽略物理感应器，这样就不会随着用户旋转设备而更改了（"unspecified"设置除外）



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
android:translationZ="4dp"
```

`translationZ` 相当于灯光的高度 值越大 阴影约淡也越大



## 绘制虚线

### 代码方式

```java
import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.DashPathEffect;
import android.graphics.LinearGradient;
import android.graphics.Paint;
import android.graphics.Path;
import android.graphics.Shader;
import android.util.AttributeSet;
import android.view.View;

public class DashLineView extends View {
    private Paint mPaint;
    private Path mPath;

    public DashLineView(Context context, AttributeSet attrs) {
        super(context, attrs);
        mPaint = new Paint(Paint.ANTI_ALIAS_FLAG);
        mPaint.setColor(Color.LTGRAY); // 需要加上这句，否则画不出东西
        mPaint.setStyle(Paint.Style.STROKE);
        mPaint.setStrokeWidth(3);
        mPaint.setPathEffect(new DashPathEffect(new float[]{15, 5}, 0));
        mPath = new Path();
    }

    @Override
    protected void onDraw(Canvas canvas) {
        int centerY = getHeight() / 2;
        mPath.reset();
        mPath.moveTo(0, centerY);
        mPath.lineTo(getWidth(), centerY);
        canvas.drawPath(mPath, mPaint);
    }

    @Override
    protected void onSizeChanged(int w, int h, int oldw, int oldh) {
        super.onSizeChanged(w, h, oldw, oldh);
        // 前四个参数没啥好讲的，就是起点和终点而已。
        // color数组的意思是从浅灰 -> 灰 -> 灰 -> 浅灰。
        // float数组与color数组对应：
        // 0 -> 0.3 (变深)
        // 0.3 - 0.7 (不变色)
        // 0.7 -> 1 (变浅)
        mPaint.setShader(
                new LinearGradient(
                        0,
                        0,
                        getWidth(),
                        0,
                        new int[]{
                                Color.argb(255,220,220,220),
                                Color.LTGRAY,
                                Color.LTGRAY,
                                Color.argb(255,220,220,220)
                        },
                        new float[]{0, 0.3f, 0.7f, 1f},
                        Shader.TileMode.CLAMP
                )
        );
    }
}
```

> `onSizeChanged` 方法是为了做渐变

### XML方式

建一个 `shape_line_dash.xml` 放在 `drawable` 目录中

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
    android:shape="line">

    <!--线宽为dashWith，线之间空隙dashGap，dashGap=0dp时，是实线 -->
    <stroke
        android:width="1px"
        android:color="#dfdfdf"
        android:dashGap="2dp"
        android:dashWidth="3dp" />
</shape>
```

使用方式

```xml
<View
    android:layout_width="match_parent"
    android:layout_height="1dp"
    android:layout_marginLeft="10dp"
    android:layout_marginRight="10dp"
    android:background="@drawable/shape_line_dash"
    android:layerType="software" />
```

> 注意点
>
> + View的高度要比虚线的`android:width="1px"`的值大 相等是不显示的
> + 要添加 `android:layerType="software"`关闭硬件加速 否则显示为实线

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

### 去掉下划线 

```
android:background="@null"
```

### 光标颜色和文字一样 

```xml
android:textCursorDrawable="@null"
```

### 自定义光标颜色

```xml
<?xml version="1.0" encoding="utf-8"?>
<shape xmlns:android="http://schemas.android.com/apk/res/android"
  android:shape="rectangle" >
  <size android:width="2dp" />
  <solid android:color="#ff7200" />
</shape>
```

然后 `android:textCursorDrawable="@drawable/edit_cursor_color"`



### 光标置顶

```xml
android:gravity="top"
```



### 光标显示在最后

```kotlin
name_edittext.setSelection(name_edittext.text.toString().length)
```



### 软键盘不遮挡

[`解决Android软键盘在全屏下设置adjustResize无效的问题`](http://www.psvmc.cn/article/android-adjustresize.html)

### 页面显示时不显示输入法

```kotlin
getWindow().setSoftInputMode(WindowManager.LayoutParams.SOFT_INPUT_STATE_HIDDEN);
```

### 键盘上显示搜索

```xml
android:imeOptions="actionSearch"
android:maxLines="1"
```

Kotlin代码

```kotlin
search_edittext.setOnEditorActionListener { textView, i, keyEvent ->
  if (i == EditorInfo.IME_ACTION_SEARCH) {

  }
  false
}
```

  

## 获取资源

```java
ContextCompat.getDrawable(context, drawableId);
```



## ScrollView 设置内部充满全屏

```xml
<ScrollView
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:fillViewport="true"
    android:scrollbars="none" >
```





## 登录自动切换输入框

```xml
<EditText
    android:id="@+id/username_edittext"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@null"
    android:hint="请输入您的账号"
    android:imeOptions="actionNext"
    android:nextFocusForward="@+id/userpwd_edittext"
    android:paddingLeft="110dp"
    android:paddingRight="10dp"
    android:singleLine="true"
    android:textCursorDrawable="@null" />
<EditText
    android:id="@+id/userpwd_edittext"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@null"
    android:hint="请输入您的密码"
    android:imeOptions="actionDone"
    android:inputType="textPassword"
    android:nextFocusForward="@+id/login_button"
    android:paddingLeft="110dp"
    android:paddingRight="10dp"
    android:singleLine="true"
    android:textCursorDrawable="@null" />
<Button
    android:id="@+id/login_button"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="@drawable/login_button_bg_anim"
    android:text="立即登录"
    android:textColor="@color/zj_blue"
    android:textSize="23sp" />
```

主要是这几行

```
//账号输完 键盘中就可以跳转到下一个输入框
android:imeOptions="actionNext"
android:nextFocusForward="@+id/userpwd_edittext"
//密码输完后 把焦点放到登录按钮上
android:imeOptions="actionDone"
android:nextFocusForward="@+id/login_button"
```

但是这样并没有点击登录 要想密码输入后也触发提交 就添加如下代码

```kotlin
userpwd_edittext.setOnEditorActionListener { textView, i, keyEvent ->
    if (i == EditorInfo.IME_ACTION_DONE) {
        toLogin()
    }
    false
}
```



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



## 隐藏软键盘

Kotlin

```kotlin
object ZJInputUtils {
    fun hideInput(activity: Activity) {
        //得到InputMethodManager的实例
        val imm = activity.getSystemService(Context.INPUT_METHOD_SERVICE) as InputMethodManager
        if (imm.isActive) {
            //如果开启
            imm.hideSoftInputFromWindow(activity.window.decorView.windowToken, 0)
        }
    }
}
```




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



## Fragment

XML

```xml
<FrameLayout
    android:id="@+id/main_fragment"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

Kotlin

```kotlin
fun initFragment() {
    var fragmentManager = mContext.supportFragmentManager
    var fragmentTransaction = fragmentManager.beginTransaction()
    if(null == fragmentManager.findFragmentByTag("question_card")) {
        var questionCardFragment = SQuestionCardFragment()
        fragmentTransaction.add(R.id.main_fragment,questionCardFragment,"question_card")
        fragmentTransaction.commit()
    }
}
```

对于宿主Activity，`getSupportFragmentManager()`获取的`FragmentActivity`的`FragmentManager`对象;

对于Fragment，`getFragmentManager()`是获取的是父Fragment(如果没有，则是FragmentActivity)的FragmentManager对象，而`getChildFragmentManager()`是获取自己的FragmentManager对象。

## 跑马灯效果

```xml
<TextView    
    android:layout_width="fill_parent"    
    android:layout_height="wrap_content"    
    android:ellipsize="marquee"    
    android:focusable="true"    
    android:focusableInTouchMode="true"    
    android:marqueeRepeatLimit="marquee_forever"    
    android:scrollHorizontally="true"    
    android:singleLine="true"    
    android:text="哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈"    
    android:textSize="17sp" /> 
```

主要属性

```xml
//设置为跑马灯显示
android:ellipsize="marquee"
//获取焦点
android:focusable="true"
//可以通过toucth来获得focus
android:focusableInTouchMode="true"
//设置重复的次数
android:marqueeRepeatLimit="marquee_forever"
//单行显示文字
android:singleLine="true"
```



## getColor getDrawable 的替代方法

Kotlin

```kotlin
ContextCompat.getColor(mContext,android.R.color.background_light)
```



## BottomSheetBehavior使用

用这种方式作出的BottomSheet效果可以拖动高度 要想禁止拖动还是要用`Popwindow`

网上有说设置`behavior_hideable`的值 但其实上它只能禁止拖动关闭 拖动高度变高依旧没法禁用

必须外层是`CoordinatorLayout`

弹出的Layout用一下属性

```xml
app:behavior_hideable="true"
app:behavior_peekHeight="400dp"
app:elevation="4dp"
app:layout_behavior="@string/bottom_sheet_behavior"
```

XML

```xml
    <android.support.design.widget.CoordinatorLayout
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:layout_weight="1">
		<!--原页面-->
        <LinearLayout
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:orientation="vertical">

            
        </LinearLayout>
        <!--弹出层-->
        <LinearLayout
            android:id="@+id/design_bottom_sheet"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="@color/zj_blue_transparent"
            android:orientation="vertical"
            app:behavior_hideable="true"
            app:behavior_peekHeight="400dp"
            app:elevation="4dp"
            app:layout_behavior="@string/bottom_sheet_behavior">

        </LinearLayout>
    </android.support.design.widget.CoordinatorLayout>
```

获取BottomSheetBehavior

 ```kotlin
var behavior = BottomSheetBehavior.from(design_bottom_sheet)
    behavior.setState(BottomSheetBehavior.STATE_HIDDEN);
 ```

显示隐藏

```kotlin
private fun showBottomSheet(behavior: BottomSheetBehavior<LinearLayout>) {
    if (behavior.state == BottomSheetBehavior.STATE_HIDDEN) {
        behavior.setState(BottomSheetBehavior.STATE_COLLAPSED);
    } else {
        behavior.setState(BottomSheetBehavior.STATE_HIDDEN);
    }
}
```



## CustomPopWindow

[`CustomPopWindow`](https://github.com/pinguo-zhouwei/CustomPopwindow)

```kotlin
private fun showPopListView() {
    val contentView = LayoutInflater.from(this).inflate(R.layout.pop_list_view, null)
    //处理popWindow 显示内容
    handleListView(contentView)
    //创建并显示popWindow
    mPopWindow = CustomPopWindow.PopupWindowBuilder(this)
        .setView(contentView)
        .enableBackgroundDark(true)
        .setAnimationStyle(R.style.CustomPopWindowStyle)
        .size(
            ViewGroup.LayoutParams.MATCH_PARENT,
            (400 * resources.displayMetrics.density).toInt()
        )
        .create()
    mPopWindow?.showAtLocation(
        window.decorView,
        Gravity.BOTTOM or Gravity.CENTER_HORIZONTAL,
        0,
        0
    )
}

private fun handleListView(contentView: View) {
    val recyclerView = contentView.findViewById<View>(R.id.recyclerView) as RecyclerView
    val manager = LinearLayoutManager(this)
    manager.orientation = LinearLayoutManager.VERTICAL
    recyclerView.layoutManager = manager
    val adapter = MyAdapter()
    adapter.setData(mockData())
    recyclerView.adapter = adapter
    adapter.notifyDataSetChanged()
}
```

# 常用方法

+ `TextUtils.isEmpty()` 如果传入的String 为NULL或者Length为0的话就返回 true

+ `Fastjson` 转对象带泛型

  Java

  ```java
  JSON.parseObject(bodyInfo, new TypeReference<ResultVo<TUserBean>>() {});
  ```

  Kotlin

  ```kotlin
  JSON.parseObject(bodyInfo, object : TypeReference<ResultVo<TUserBean>>() {
  })
  ```




## ListView获取子视图

`ListView`有一个`getChildAt()`方法，参数传的不是子视图的`position`，而是当前显示区域的位置，所以正确的获取`position`位置视图的方法为

```java
int firstVisiblePosition = mListView.getFirstVisiblePosition();
mListView.getChildAt(position - firstVisiblePosition));
```


## 华为设备不显示日志

+ 华为手机无法显示log解决方案,.拨号界面输入 `*#*#2846579#*#*`

  依次选择ProjectMenu---后台设置----LOG设置---AP日志 点击打开

+ 华为平板 打开计算器 横屏状态 输入`()()2846579()()`






# Eventbus

注册

```kotlin
override fun onStart() {
    super.onStart()
    EventBus.getDefault().register(this)
}

override fun onStop() {
    EventBus.getDefault().unregister(this)
    super.onStop()
}
```

发送粘性事件

```kotlin
EventBus.getDefault().postSticky(questionBean)
```

接收粘性事件

```kotlin
@Subscribe(threadMode = ThreadMode.MAIN, sticky = true)
fun onMessageEvent(event: TQuestionBean) {
    questionBean = event;
    initView()
}
```

