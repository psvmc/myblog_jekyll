---

layout: post
title: Android 自定义View中的onMeasure onLayout onDraw
description: Android 自定义View中的onMeasure onLayout onDraw
keywords: android
category: android

---


## 正文

  Android自定义View时常重写三个方法`onMeasure`和`onLayout`以及`onDraw`。 
  
  他们的作用
  
  + `onMeasure` 计算当前View的宽高
  + `onLayout` 处理子View的布局
  + `onDraw` 绘制当前View

  调用的顺序为`onMeasure`-->`onLayout`-->`onDraw`
  
  
### View中还有三个比较重要的方法

+ `requestLayout`  
View重新调用一次layout过程。

+ `invalidate`  
View重新调用一次draw过程

+ `forceLayout`  
标识View在下一次重绘，需要重新调用layout过程。

> 如果我们的自定义View内容变了 但大小位置不变的话。只需要调用`invalidate`. 
> 如果我们的自定义View内容变了 大小位置也变的话。就需要先调用`requestLayout` 再调用`invalidate`

### onMeasure细要

```java
@Override
protected void onMeasure(int widthMeasureSpec, int heightMeasureSpec) {
    super.onMeasure(widthMeasureSpec, heightMeasureSpec);
    // 获取宽-测量规则的模式和大小
    int widthMode = MeasureSpec.getMode(widthMeasureSpec);
    int widthSize = MeasureSpec.getSize(widthMeasureSpec);

    // 获取高-测量规则的模式和大小
    int heightMode = MeasureSpec.getMode(heightMeasureSpec);
    int heightSize = MeasureSpec.getSize(heightMeasureSpec);

    int sigleHeight = 50;
    int mWidth = sigleHeight;
    int mHeight = sigleHeight * letters.length;

    if (widthMode == MeasureSpec.AT_MOST && heightMode == MeasureSpec.AT_MOST) {
        setMeasuredDimension(mWidth, mHeight);
    } else if (widthMode == MeasureSpec.AT_MOST) {
        setMeasuredDimension(mWidth, heightSize);
    } else if (heightMode == MeasureSpec.AT_MOST) {
        setMeasuredDimension(widthSize, mHeight);
    } else {
        setMeasuredDimension(widthSize, heightSize);
    }

}
```

我们可以重写onMeasure来重新定义View的宽高。  
其中`setMeasuredDimension()`方法，设置了measure过程中View的宽高  `getSuggestedMinimumWidth()`返回View的最小Width，Height也有对应的方法。  

 
插几句，`MeasureSpec`类是View类的一个内部静态类，它定义了三个常量`UNSPECIFIED`、`AT_MOST`、`EXACTLY`，  
其实我们可以这样理解它，它们分别对应`LayoutParams`中`match_parent`、`wrap_content`、`xxxdp`。 

这里对比两个方法

+ `getMeasuredHeight()` 获取测量的高度 可能和View真实的高度不一样  
    如果我们不调用`requestLayout`重新`layout`的话 `getHeight()`获取的一直会是之前的高度
+ `getHeight()` 获取真实的高度

### 自定义属性

1. 在`values`文件夹下，打开`attrs.xml`，其实这个文件名称可以是任意的，写在这里更规范一点
2. 假设我们用到了两个属性一个宽度，一个颜色值的属性

```xml
<declare-styleable name="zjslide">
  <attr name="slide_border_width" format="dimension"></attr>
  <attr name="slide_border_color" format="color"></attr>
</declare-styleable>
```

使用方式

```java
int slideBorderWidth = Utils.dpToPx(1, getResources());
int slideBorderColor = Color.parseColor("#1E88E5");

public ZJSlideBar(Context context) {
    super(context);
}

public ZJSlideBar(Context context, AttributeSet attrs) {
    super(context, attrs,0);
}

public ZJSlideBar(Context context, AttributeSet attrs, int defStyle) {
    super(context, attrs, defStyle);
    TypedArray t = context.obtainStyledAttributes(attrs,R.styleable. zjslide, 0, 0);
    slideBorderWidth = t.getDimensionPixelSize(R.styleable. slide_border_width, slideBorderWidth);
    slideBorderColor = t.getColor(R.styleable. slide_border_color, slideBorderColor);
    t.recycle();// we should always recycle after used
}
```


View有了三个构造方法需要我们重写，这里介绍下三个方法会被调用的场景:

+ 第一个方法，一般我们这样使用时会被调用:`View view = new View(context)`
+ 第二个方法，当我们在xml布局文件中使用View时，会在inflate布局时被调用

```xml
<View
layout_width="match_parent"
layout_height="match_parent"/>
```

+ 第三个方法，跟第二种类似，但是增加`style`属性设置，这时inflater布局时会调用第三个构造方法。

```xml
<View
style="@styles/MyCustomStyle"
layout_width="match_parent"
layout_height="match_parent"/>
```

像上边的例子一样  为了避免代码冗余  我们把获取属性的代码都写在了第三个方法中了





