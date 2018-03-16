---
layout: post
title: Android 中的那些圆角
description: Android 中的那些圆角
keywords: android
categories: android
---



## 引用关键字

[`implement、api和compile区别`](http://blog.csdn.net/marvinhq/article/details/73477128)

## 图片圆角

### 加载处理原图圆角

Glide和Picasso

#### Glide

+ 下载地址：https://github.com/bumptech/glide
+ 使用文档：https://muyangmin.github.io/glide-docs-cn/

使用扩展Glide Transformations

+ 扩展地址：https://github.com/wasabeef/glide-transformations

```json
repositories {
    jcenter()
}

dependencies {
    implementation 'jp.wasabeef:glide-transformations:3.1.1'
    // If you want to use the GPU Filters
    implementation 'jp.co.cyberagent.android.gpuimage:gpuimage-library:1.4.1'
}
```

设置代码

```java
Glide.with(this).load(url)
        .apply(bitmapTransform(new BlurTransformation(25)))
        .into((ImageView) findViewById(R.id.image));
```

#### Picasso

使用扩展**picasso-transformations**

- 下载地址：https://github.com/wasabeef/picasso-transformations

引用

```json
repositories {
    jcenter()
}

dependencies {
    compile 'jp.wasabeef:picasso-transformations:2.2.1'
    // If you want to use the GPU Filters
    compile 'jp.co.cyberagent.android.gpuimage:gpuimage-library:1.4.1'
}
```

使用

```java
Picasso.with(mContext).load(R.drawable.demo)
    .transform(transformation)
    .transform(new CropCircleTransformation())
    .into(holder.image);
```



### Fresco

- Fresco：https://github.com/facebook/fresco
- 使用文档：https://www.fresco-cn.org/docs/index.html
- 扩展：Fresco Processors https://github.com/wasabeef/fresco-processors

第一步：引入支持

```json
dependencies {
  implementation 'com.facebook.fresco:fresco:1.8.1'
}
```

第二步：使用SimpleDraweeView代替ImageView

```xml
<?xml version="1.0" encoding="utf-8"?>
<RelativeLayout xmlns:android="http://schemas.android.com/apk/res/android"
                xmlns:app="http://schemas.android.com/apk/res-auto"
                android:layout_width="wrap_content"
                android:layout_height="match_parent">>

    <com.facebook.drawee.view.SimpleDraweeView
        android:id="@+id/iamgeView"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        app:roundedCornerRadius="2dp"/>

</RelativeLayout>
```

注意其中的：

> app:roundedCornerRadius="2dp"

这样你就得到了一个2dp圆角的ImageView。

初始化

```java
public class MyApplication extends Application {
	@Override
	public void onCreate() {
		super.onCreate();
		Fresco.initialize(this);
	}
}
```

加载图片

```java
Uri uri = Uri.parse("https://raw.githubusercontent.com/facebook/fresco/gh-pages/static/logo.png");
SimpleDraweeView draweeView = (SimpleDraweeView) findViewById(R.id.my_image_view);
draweeView.setImageURI(uri);
```



### 圆角图片组件

[`RoundedImageView`](https://github.com/vinc3m1/RoundedImageView)

```json
repositories {
    mavenCentral()
}

dependencies {
    compile 'com.makeramen:roundedimageview:2.3.0'
}
```

XML中应用

```xml
<com.makeramen.roundedimageview.RoundedImageView
        xmlns:app="http://schemas.android.com/apk/res-auto"
        android:id="@+id/imageView1"
        android:src="@drawable/photo1"
        android:scaleType="fitCenter"
        app:riv_corner_radius="30dip"
        app:riv_border_width="2dip"
        app:riv_border_color="#333333"
        app:riv_mutate_background="true"
        app:riv_tile_mode="repeat"
        app:riv_oval="true" />
```

代码中应用

```java
RoundedImageView riv = new RoundedImageView(context);
riv.setScaleType(ScaleType.CENTER_CROP);
riv.setCornerRadius((float) 10);
riv.setBorderWidth((float) 2);
riv.setBorderColor(Color.DKGRAY);
riv.mutateBackground(true);
riv.setImageDrawable(drawable);
riv.setBackground(backgroundDrawable);
riv.setOval(true);
riv.setTileModeX(Shader.TileMode.REPEAT);
riv.setTileModeY(Shader.TileMode.REPEAT);
```



## 背景圆角

```xml
<?xml version="1.0" encoding="utf-8"?>  
<shape xmlns:android="http://schemas.android.com/apk/res/android">  
	<solid android:color="#60000000"/>  
	<stroke android:width="3dp" color="#ff000000"/>  
	<corners android:radius="10dp" />  
</shape>  
```



## 容器圆角(CardView)

引用

```json
dependencies {  
    implementation 'com.android.support:cardview-v7:27.0.2'
} 
```

设置

```xml
<android.support.v7.widget.CardView xmlns:android="http://schemas.android.com/apk/res/android"  
    xmlns:app="http://schemas.android.com/apk/res-auto"  
    android:id="@+id/cardview"  
    app:cardCornerRadius="8dp"  
    app:cardBackgroundColor="@color/black"  
    android:layout_margin="8dp"  
    android:layout_height="80dp"  
    android:layout_width="match_parent">  
    
</android.support.v7.widget.CardView> 
```

