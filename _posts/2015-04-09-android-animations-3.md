---

layout: post
title: Android动画-Property Animation
description: Android动画-Property Animation
keywords: android
category: android

---

## 文章导航

+ [Android动画-概述](http://www.psvmc.cn/android-animations-0.html)
+ [Drawable Animation使用方式](http://www.psvmc.cn/android-animations-1.html)
+ [View Animation使用方式](http://www.psvmc.cn/android-animations-2.html)
+ [Property Animation使用方式](http://www.psvmc.cn/android-animations-3.html)

## 概述

Property Animation故名思议就是通过动画的方式改变对象的属性了，所以他也是功能最为强大的，可以这样说前面的帧动画和视图动画能做到的，他都能做到，并且更为强大

### 相关的属性

+ Duration动画的持续时间，默认300ms。
+ Time interpolation：时间差值，乍一看不知道是什么，但是我说 LinearInterpolator、AccelerateDecelerateInterpolator，大家一定知道是干嘛的了，定义动画的变化率。
+ Repeat count and behavior：重复次数、以及重复模式；可以定义重复多少次；重复时从头开始，还是反向。
+ Animator sets: 动画集合，你可以定义一组动画，一起执行或者顺序执行。
+ Frame refresh delay：帧刷新延迟，对于你的动画，多久刷新一次帧；默认为10ms，但最终依赖系统的当前状态；基本不用管。

### 相关的类

+ ObjectAnimator  动画的执行类，后面详细介绍
+ ValueAnimator 动画的执行类，后面详细介绍 
+ AnimatorSet 用于控制一组动画的执行：线性，一起，每个动画的先后执行等。
+ AnimatorInflater 用户加载属性动画的xml文件
+ TypeEvaluator  类型估值，主要用于设置动画操作属性的值。
+ TimeInterpolator 时间插值，上面已经介绍。


总的来说，属性动画就是，动画的执行类来设置动画操作的对象的属性、持续时间，开始和结束的属性值，时间差值等，然后系统会根据设置的参数动态的变化对象的属性。

### ObjectAnimator实现动画

之所以选择ObjectAnimator为第一个~~是因为，这个实现最简单~~一行代码，秒秒钟实现动画，下面看个例子：

我们想实现ListView的item的折叠和展开

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout xmlns:android="http://schemas.android.com/apk/res/android"
              android:layout_width="match_parent"
              android:layout_height="wrap_content"
              android:orientation="vertical">

    <LinearLayout
        android:id="@+id/file_list_item"
        android:layout_width="match_parent"
        android:layout_height="60dp"
        android:orientation="vertical">

        <LinearLayout
            android:id="@+id/file_item_top"
            android:layout_width="match_parent"
            android:layout_height="60dp"
            android:orientation="horizontal"
            android:background="@color/zj_qianlan"
            android:paddingBottom="4dp"
            android:paddingTop="4dp">

        </LinearLayout>
        
        <LinearLayout
            android:id="@+id/file_item_bottom"
            android:layout_width="match_parent"
            android:layout_height="60dp"
            android:orientation="horizontal"
            android:background="@color/zj_qianlan"
            android:paddingBottom="4dp"
            android:paddingTop="4dp">

        </LinearLayout>

    </LinearLayout>

</LinearLayout>
```

如上所示  我们外层`LinearLayout`的高度为`60dp`,里面也有两个都是`60dp`，这样我们动态改变外层的高度来实现展开和折叠的动画

先说个简单的翻转动画

```java
file_list_item = (LinearLayout)convertView.findViewById(R.id.file_list_item);

file_item_fold_layout.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
    ObjectAnimator
            .ofFloat(file_list_item, "rotationX", 0.0F, 360.0F)
            .setDuration(500)
            .start();
    }
});
```

这里`rotationX`是怎么来的，原来`file_list_item`有`setRotationX(float rotationX)`和`getRotationX(float rotationX)`方法，所以可以这样做，但是我们想设置高度，但并没有`setHeight()`和`getHeight()`方法，怎们办呢，我们可以定义一个内部类

```java
private static class ViewWrapper {
    private ViewGroup mTarget;

    public ViewWrapper(ViewGroup target) {
        mTarget = target;
    }

    public int getHeight() {
        return mTarget.getLayoutParams().height;
    }

    public void setHeight(int height) {
        ViewGroup.LayoutParams vg = mTarget.getLayoutParams();
        vg.height = height;
        mTarget.setLayoutParams(vg);
    }
}
```

然后就可以这样使用了

```java
file_item_fold_layout.setOnClickListener(new View.OnClickListener() {
    @Override
    public void onClick(View v) {
        Integer height = file_list_item.getLayoutParams().height;

        Integer targetHeight = 0;
        if (height == DensityUtils.dp2px(getContext(), 60)) {
            targetHeight = DensityUtils.dp2px(getContext(), 120);
        } else {
            targetHeight = DensityUtils.dp2px(getContext(), 60);
        }

        ViewWrapper viewWrapper = new ViewWrapper(file_list_item);
        ObjectAnimator
                .ofInt(viewWrapper, "height", targetHeight)
                .setDuration(120)
                .start();
    }
});
```

注意的是`ofInt()`方法 如果改的值为Int的话一定要用`ofInt()`,用`ofFloat()`是不会生效的

如果你操作对象的该属性方法里面，比如上例的setRotationX如果内部没有调用view的重绘，则你需要自己按照下面方式手动调用

```java
anim.addUpdateListener(new AnimatorUpdateListener(){
	@Override
	public void onAnimationUpdate(ValueAnimator animation)
	{
    //view.postInvalidate();
    //view.invalidate();
	}
});
```

#### 多动画同时执行

方式

```java
public void rotateyAnimRun(final View view)
{
	ObjectAnimator anim = ObjectAnimator
			.ofFloat(view, "rotationX", 0.0F, 360.0F)
			.setDuration(500);
	anim.start();
	anim.addUpdateListener(new AnimatorUpdateListener()
	{
		@Override
		public void onAnimationUpdate(ValueAnimator animation)
		{
			float cVal = (Float) animation.getAnimatedValue();
			view.setAlpha(cVal/360);
			view.setScaleX(cVal/360);
			view.setScaleY(cVal/360);
		}
	});
}
```

方式2

```java
public void propertyValuesHolder(View view){
	PropertyValuesHolder pvhX = PropertyValuesHolder.ofFloat("alpha", 1f,
			0f, 1f);
	PropertyValuesHolder pvhY = PropertyValuesHolder.ofFloat("scaleX", 1f,
			0, 1f);
	PropertyValuesHolder pvhZ = PropertyValuesHolder.ofFloat("scaleY", 1f,
			0, 1f);
	ObjectAnimator.ofPropertyValuesHolder(view, pvhX, pvhY,pvhZ).setDuration(1000).start();
}
```

### ValueAnimator实现动画


`ValueAnimator`是`ObjectAnimator`的父类它没有`ObjectAnimator`强大，但是会相对自由，他只会改变值，而我们可以设置View的属性值来实现动画

```java
public void rotateyAnimRun(final View view)
{
    ValueAnimator animator = ValueAnimator.ofFloat(0, 1.0f);
    animator.setTarget(view);
    animator.setDuration(300).start();
    animator.addUpdateListener(new ValueAnimator.AnimatorUpdateListener()
    {
        @Override
        public void onAnimationUpdate(ValueAnimator animation)
        {
            Float value = (Float) animation.getAnimatedValue();
            view.setAlpha(value);
            view.setScaleX(value);
            view.setScaleY(value);
        }
    });
}
```

### AnimatorSet的使用

AnimatorSet就是动画组 可以设置动画同时执行或先后执行

```java
public void togetherRun(View view){  
    ObjectAnimator anim1 = ObjectAnimator.ofFloat(mBlueBall, "scaleX",  
            1.0f, 2f);  
    ObjectAnimator anim2 = ObjectAnimator.ofFloat(mBlueBall, "scaleY",  
            1.0f, 2f);  
    AnimatorSet animSet = new AnimatorSet();  
    animSet.setDuration(2000);  
    animSet.setInterpolator(new LinearInterpolator());  
    //两个动画同时执行  
    animSet.playTogether(anim1, anim2);  
    animSet.start();  
} 
```