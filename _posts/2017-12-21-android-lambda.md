---

layout: post
title: Android开发使用Lambda表达式
description: Android开发使用Lambda表达式
keywords: android,java
category: android

---


## 前言

  `AndroidStudio从2.1`开始官方通过`Jack`支持`Java8`，从而使用`Lambda`等特性。
    
  `Lambda`表达式能有效减少代码量 使代码的结构更清晰 那么怎样在项目中使用呢。 

有两种方式：

+ 使用第三方的Java8兼容插件
+ 使用官方Jack支持Java8

## 使用第三方的Java8兼容插件(建议)

Github地址:[`retrolambda`](https://github.com/evant/gradle-retrolambda)

+ 使用`JDK1.8`

+ 在project的根build.gradle里添加：

```
dependencies {
	classpath 'me.tatarka:gradle-retrolambda:3.7.0'
}
```

+ 然后在module的build.gradle里添加：

```
apply plugin: 'me.tatarka.retrolambda'

android {
	compileOptions {
		sourceCompatibility JavaVersion.VERSION_1_8
		targetCompatibility JavaVersion.VERSION_1_8
	}
}
```


## 使用官方Jack支持Java8(不建议)

配置

```
android {
  //必须24以上
  buildToolsVersion "24.0.3"
  ...
  //JDK1.8
  compileOptions {
    sourceCompatibility JavaVersion.VERSION_1_8
    targetCompatibility JavaVersion.VERSION_1_8
  }

  defaultConfig {
    ...
    //使用jack
    jackOptions {
      enabled true
    }
  }
  ...
}

```

但是如果打开`jackOptions`，意味着`ButterKnife`，`Dagger`等基于`APT`的注解框架将无法使用(当然很多库例如`ButterKnife`的新版本已经不再依赖`apt`了)。  

会提示如下错误：

```
Error:Could not find property 'options' on task ':app:compileDebugJavaWithJack'.
```

所以要去除`apt`插件

```
apply plugin: 'android-apt'
```

需要 `Build Tools 24.0.0 or later`

```
Error:Execution failed for task ':app:jillDebugPackagedLibraries'.
> Jack requires Build Tools 24.0.0 or later
```

很直观的缺点

+ build超级慢 耗内存，而且没有Instant Run

总的来说 还是不建议使用这种形式(要求太多了)

### 如果你还不了解Jack & Jill

那么现在你已经不用了解了!

[`Google 又弃坑了，Jack+Jill vs. javac+dx`](https://zhuanlan.zhihu.com/p/25814519)

官方post：

[`Future of Java 8 Language Feature Support on Android`](https://android-developers.googleblog.com/2017/03/future-of-java-8-language-feature.html)

原文：

> At Google, we always try to do the right thing. Sometimes this means adjusting our plans. We know how much our Android developer community cares about good support for Java 8 language features, and we're changing the way we support them.  

---
 
> We've decided to add support for Java 8 language features directly into the current javac and dx set of tools, and deprecate the Jack toolchain. With this new direction, existing tools and plugins dependent on the Java class file format should continue to work. Moving forward, Java 8 language features will be natively supported by the Android build system. We're aiming to launch this as part of Android Studio in the coming weeks, and we wanted to share this decision early with you. 

---
  
> We initially tested adding Java 8 support via the Jack toolchain. Over time, we realized the cost of switching to Jack was too high for our community when we considered the annotation processors, bytecode analyzers and rewriters impacted. Thank you for trying the Jack toolchain and giving us great feedback. You can continue using Jack to build your Java 8 code until we release the new support. Migrating from Jack should require little or no work.   

---

> We hope the new plan will pave a smooth path for everybody to take advantage of Java 8 language features on Android. We'll share more details when we release the new support in Android Studio.  


## 实例对比

### 点击事件

+ 使用前

```java
btn = (Button) findViewById(R.id.btn);
btn.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View v) {
          Toast.makeText(getApplicationContext(), "按钮点击了", Toast.LENGTH_LONG).show()
      }
});
```

+ 使用后

```java
btn = (Button) findViewById(R.id.btn);
btn.setOnClickListener(v -> {
    Toast.makeText(getApplicationContext(), "按钮点击了", Toast.LENGTH_LONG).show();
});
```

Snackbar的点击事件

```java
final Snackbar snackbar = Snackbar.make(outLayoyt, "服务器地址尚未设置!", Snackbar.LENGTH_LONG);
snackbar.setAction("设置",v -> {

});
```

### 线程处理

+ 使用前

```java
new Thread(new Runnable() {
    @Override
    public void run() {
        Log.i("TAG", "定义一个简单测试例子...");
    }
}).start();
```

+ 使用后

```java
new Thread(
    () -> {
        Log.i("TAG", "使用Lambda表达式的例子...");
    }
).start();
```

