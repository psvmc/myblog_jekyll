---

layout: post
title: Android图片相关
description: Android图片相关
keywords: android
category: android

---

### 一、概念区别

`Bitmap` - 称作位图，一般位图的文件格式后缀为bmp，当然编码器也有很多如RGB565、RGB8888。作为一种逐像素的显示对象执行效率高，但是缺点也很明显存储效率低。我们理解为一种存储对象比较好。

`Drawable` - 作为Android平下通用的图形对象，它可以装载常用格式的图像，比如GIF、PNG、JPG，当然也支持BMP，当然还提供一些高级的可视化对象，比如渐变、图形等。

`Canvas` - 名为画布，我们可以看作是一种处理过程，使用各种方法来管理Bitmap、GL或者Path路径，同时它可以配合Matrix矩阵类给图像做旋转、缩放等操作，同时Canvas类还提供了裁剪、选取等操作。

`Paint` - 我们可以把它看做一个画图工具，比如画笔、画刷。他管理了每个画图工具的字体、颜色、样式。

### 二、Android读取图片资源

#### Drawable目录

已将图片保存到drawable目录下，通过图片id获得Drawable或者Bitmap，此方式最常用。（若只知道图片的名称，还可以通过图片的名称获得图片的id）

（1）通过图片id获得Drawable

```java

Resources res = context.getResources();
Drawable drawable= res.getDrawable(R.drawable.xxx);
```

（2）通过图片id获得Bitmap

```java

Resources res = context.getResources();
Bitmap bitmap=BitmapFactory.decodeResource(res, id);
```

（3）通过图片的名称获得图片的id(两种方法)

```java

Resources res = context.getResources();
int id =res.getIdentifier(name, defType, defPackage); 
//name:图片的名，defType：资源类型（drawable，string。。。）,defPackage:工程的包名
Drawable drawable= res.getDrawable(id);
```

#### Assest目录

已将图片保存到assest目录下，知道图片的名称，通过inputstream获得图片Drawabl

或者 Bitmap

```java
AssetManager asm=getAssetMg();
InputStream is=asm.open(name);//name:图片的名称
```

（1）获得Drawable

```java
Drawable da = Drawable.createFromStream(is, null);
```

（2）获得Bitmap

```java
Bitmap bitmap=BitmapFactory.decodeStream(is);
```

#### 内存卡

图片保存在sdcard

```java
String imgFilePath = Environment.getExternalStorageDirectory().toString()+ "/DCIM/device.png";
```

(1)文件输入流

```java
fis = new FileInputStream(new File(imgFilePath));//文件输入流
Bitmap bmp = BitmapFactory.decodeStream(fis);
```

(2) 资源ID

```java
ImageView iv = (ImageView) findViewById(R.id.image);
Bitmap bit = BitmapFactory.decodeFile(/sdcard/android.bmp);
iv.setImageBitmap(bit);
iv.setImageDrawable(Drawable.createFromPath(new File(Environment.getExternalStorageDirectory(), camera.jpg).getAbsolutePath()));
```

### 三、Drawable、Bitmap、byte[]之间的转换

#### 1) Drawble转Bitmap

```java
public static Bitmap drawableToBitmap(Drawable drawable) {
    Bitmap bitmap = Bitmap.createBitmap(
            drawable.getIntrinsicWidth(),
            drawable.getIntrinsicHeight(),
            drawable.getOpacity() != PixelFormat.OPAQUE ? Bitmap.Config.ARGB_8888 : Bitmap.Config.RGB_565
    );
    Canvas canvas = new Canvas(bitmap);
    drawable.setBounds(0, 0, drawable.getIntrinsicWidth(), drawable.getIntrinsicHeight());
    drawable.draw(canvas);
    return bitmap;
}

```

#### 2) 从资源中获取Bitmap

```java
Resources res=getResources();
Bitmap bmp=BitmapFactory.decodeResource(res, R.drawable.pic);
```
 

#### 3) Bitmap → byte[]

```java
private byte[] Bitmap2Bytes(Bitmap bm){
    ByteArrayOutputStream baos = new ByteArrayOutputStream();
    bm.compress(Bitmap.CompressFormat.PNG, 100, baos);
    return baos.toByteArray();
}
```

#### 4) byte[] → Bitmap

```java
private Bitmap Bytes2Bimap(byte[] b){
    if(b.length!=0){
        return BitmapFactory.decodeByteArray(b, 0, b.length);
    }
    else {
        return null;
    }

}

//将assets文件中资源取出,并将图片从bitmap转换成drawable格式

public static Drawable getDrawableFromAssetFile(Context context,String fileName){
    Bitmap image = null;
    BitmapDrawable drawable=null;
    try{
        AssetManager am = context.getAssets();
        InputStream is = am.open(fileName);
        image = BitmapFactory.decodeStream(is);
        drawable= new BitmapDrawable(context.getResources(), image);
        is.close();
    }catch(Exception e){
    
    }
    return drawable;
}
```

### 四、drawable目录

APK程序里的drawable目录详解

自己DIY过APK程序的达人们肯定会对于android中放置图片的地方`drawable—hdpi`、`drawable—mdpi`、`drawable—ldpi`等感到好奇。  
肯定心里会想，放在哪一个都行，只要是在android中的`res`目录下的`drawable`中就行，系统会自己找到。 
drawable—hdpi看他的单词名肯定知道他是放置高分辨率的图片，`drawable—mdpi`放置中等分辨率的图片，`drawable—ldpi`放置低分辨率的图片。  
大部分人都把的图片放在`drawable—mdpi`中。  
在分辨率低于`480*800`时把图片放在`drawable—mdpi`中是不会有什么影响，但是当分辨率为`420*800`或高于它时就会出问题了。你的手机屏幕有那么大但是他会将图片拉伸，当加载图片后让你感觉该屏幕没有实际的大小，而如果将图片放到`drawable—hdpi`中则该问题就不会存在了。  
比如手机屏幕的大小为`420*800`如果你将图片放在`drawable—mdpi`中，那么你就要准备一张`340*525`分辨率的图片。

#### 1）不同的layout

Android手机屏幕大小不一，有480×320, 640×360, 800×480.怎样才能让App自动适应不同的屏幕呢？

其实很简单，只需要在res目录下创建不同的layout文件夹，比如layout-640×360,layout-800×480,layout-xhdpi,layout-xhdpi-v19所有的layout文件在编译之后都会写入R.java里，而系统会根据屏幕的大小自己选择合适的layout进行使用。

```java
layout-640×360 根据屏幕尺寸
layout-xhdpi 根据屏幕尺寸
layout-xhdpi-v19 根据屏幕尺寸和sdk版本
```

#### 2）hdpi、mdpi、ldpi

在之前的版本中，只有一个drawable，而2.1版本中有drawable-mdpi、drawable-ldpi、drawable-hdpi三个，这三个主要是为了支持多分辨率。现在还有drawable-xhdpi、drawable-xxhdpi、drawable-xxxhdpi

区别：

```java
drawable-xxxhdpi里面存放?高分辨率的图片,(1080x?)
drawable-xxhdpi里面存放?高分辨率的图片,(960x?)
drawable-xhdpi里面存放?高分辨率的图片,(640x?)
drawable-hdpi里面存放高分辨率的图片,如WVGA (480×800),FWVGA (480×854)
drawable-mdpi里面存放中等分辨率的图片,如HVGA (320×480)
drawable-ldpi里面存放低分辨率的图片,如QVGA (240×320)
```

系统会根据机器的分辨率来分别到这几个文件夹里面去找对应的图片。

在开发程序时为了兼容不同平台不同屏幕，建议各自文件夹根据需求均存放不同版本图片。
　　

相关概念

PPI = Pixels per inch，每英寸上的像素数,即 “像素密度”

```java
xxxhdpi: 4.0
xxhdpi: 3.0
xhdpi: 2.0
hdpi: 1.5
mdpi: 1.0 (baseline)
ldpi: 0.75
```
比如一个48dp x 48dp的图片在不同文件夹下的px大小

```java
xxxhdpi:192*192
xxhdpi:144*144
xhdpi:96*96
hdpi:72*72
mdpi:48*48
ldpi:36*36
```

`dp`是虚拟像素，在不同的像素密度的设备上会自动适配，比如:

```java
在320×480分辨率，像素密度为160,1dp=1px
在480×800分辨率，像素密度为240,1dp=1.5px
计算公式:1dp*像素密度/160 = 实际像素数
```

#### 3）横屏竖屏

每个activity都有这个属性`screenOrientation`，每个activity都需要设置，可以设置为竖屏（`portrait`），也可以设置为无重力感应（`nosensor`）。

要让程序界面保持一个方向，不随手机方向转动而变化的处理办法：

在AndroidManifest.xml里面配置一下就可以了。加入这一行  

```java
android:screenOrientation="landscape"
```

其中（`landscape`是横向，`portrait`是纵向）：

