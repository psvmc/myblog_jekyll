---

layout: post
title: Android动画-Drawable Animation(帧动画)
description: Android动画-Drawable Animation(帧动画)
keywords: android
category: android

---

## 文章导航

+ [Android动画-概述](http://www.psvmc.cn/android-animations-0.html)
+ [Drawable Animation使用方式](http://www.psvmc.cn/android-animations-1.html)
+ [View Animation使用方式](http://www.psvmc.cn/android-animations-2.html)
+ [Property Animation使用方式](http://www.psvmc.cn/android-animations-3.html)

## 概述

`Drawable Animation`是逐帧动画，就像GIF图片，通过一系列Drawable依次显示来模拟动画的效果，那么使用它之前必须先定义好各个帧。我们可以通过代码定义，也可以使用xml文件定义，一般使用后者


### 动画定义

```xml
<animation-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="true">
    <item android:drawable="@drawable/frame_1" android:duration="200" />
    <item android:drawable="@drawable/frame_2" android:duration="200" />
    <item android:drawable="@drawable/frame_3" android:duration="200" />
    <item android:drawable="@drawable/frame_4" android:duration="200" />
</animation-list>
```

其中`android:oneshot="true"`表示该动画只播放一次，等于`false`时则循环播放  
平常我们加载中动画就可以这样实现

有时我们想每一帧是由多个图片组成怎么办

```xml
<animation-list xmlns:android="http://schemas.android.com/apk/res/android"
    android:oneshot="true">
    <item android:duration="100">  
        <layer-list>  
            <item android:drawable="@drawable/login_loading_00" />  
            <item android:drawable="@drawable/login_loading_10" />  
        </layer-list>  
    </item> 
</animation-list> 
```

这样图片就一层层的叠起来了

### 动画调用


```java
public class MainActivity extends Activity {
	
	private AnimationDrawable loadingAnimation;

	@Override
	protected void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);

		setContentView(R.layout.activity_main);
		
		//将该逐帧xml文件设置为ImageView的背景
		ImageView loadingImg = (ImageView) findViewById(R.id.loading);
		loadingImg.setBackgroundResource(R.drawable.loading);
		loadingAnimation = (AnimationDrawable) loadingImg.getBackground();
	}

	/**
	 * 触摸屏幕，结束动画
	 */
	public boolean onTouchEvent(MotionEvent event) {
		if (event.getAction() == MotionEvent.ACTION_DOWN) {
			loadingAnimation.stop();
			return true;
		}
		return super.onTouchEvent(event);
	}

	/**
	 * activity显示到屏幕则开启动画
	 */
	@Override
	public void onWindowFocusChanged(boolean hasFocus) {
		// TODO Auto-generated method stub
		super.onWindowFocusChanged(hasFocus);
		if (hasFocus)
			loadingAnimation.start();
	}

}
```


需要注意的是，不能在`onCreate()`方法中调用`AnimationDrawable`的`start()`方法，因为此时`AnimationDrawable`还未真正加载到界面中。所以，如果想启动界面就自动运行动画，可以在`OnWindowFocusChanged(boolean hasFocus)`中启动动画。