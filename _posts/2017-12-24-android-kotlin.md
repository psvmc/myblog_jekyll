---

layout: post
title: Android Kotlin启程
description: Android Kotlin启程
keywords: android
categories: 
        - kotlin
        - android

---


## 前言

  Android 官方已经推荐使用`Kotlin`   足以见`Kotlin`的优秀   
  并且可以在原项目中直接用`Kotlin` 完全没有什么可担心的  
  代码比`Swift`还好用 强烈推荐

推荐

+ [`kotlin 官方文档翻译`](https://github.com/huanglizhuo/kotlin-in-chinese)
+ [`From Java to Kotlin(推荐)`](https://link.zhihu.com/?target=https%3A//fabiomsr.github.io/from-java-to-kotlin/)

## Android获取视图的实例

项目的配置文件

```
buildscript {
    ext.kotlin_version = '1.1.51'
    //...
    dependencies {
        //...
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}
```

模块的配置文件

```
dependencies {
    //...
    compile "org.jetbrains.kotlin:kotlin-stdlib-jre7:$kotlin_version"
}

apply plugin: 'kotlin-android'
apply plugin: 'kotlin-android-extensions'
```

直接用视图定义的ID即可  超级方便

 ```xml
<EditText
    android:id="@+id/loginNameEditText"
    android:layout_width="0dp"
    android:layout_height="0dp"
    android:layout_marginStart="16dp"
    android:layout_marginLeft="16dp"
    android:background="@null"
    android:ems="10"
    android:hint="请输入用户名"
    android:inputType="textPersonName"/>
 ```

 如上不用再`findViewById(R.id. loginNameEditText)`  
 直接用`loginNameEditText`就行了

## Set List Map

首先要说的是没有`new`了  

集合的分类：

+ Set（集）
+ List（列表）
+ Map（映射）


在`Kotlin`中，明确的区分了`只读`和`可变`的集合  
代码如下 前三个是只读 后三个是可变的

```java
var list = listOf<String>("aa", "bb", "cc")
list.forEach { item ->
  Log.i("Kotlin", item)
}

var set = setOf<String>("aa", "bb", "cc")
set.forEach { item ->
  Log.i("Kotlin", item)
}


val map = mapOf("a" to 1, "b" to 2, "c" to 3)

var map = mapOf<String, String>(Pair("aa", "AA"), Pair("bb", "BB"), Pair("cc", "CC"));
for ((key,value) in map){
  Log.i("Kotlin", "key:$key value:$value")
}


var mList = mutableListOf<String>();
mList.add("aa")
Log.i("Kotlin", mList[0])

var mSet = mutableSetOf<String>();
mSet.add("aa")
Log.i("Kotlin", mSet.elementAt(0))

var mMap = mutableMapOf<String, String>()
mMap["aa"] = "AA"
Log.i("Kotlin", "$mMap")
```


## 循环

```
for (i in 1..4) print(i) //打印1234
for (i in 4 downTo 1 step 1) print(i) //打印4321
```

## 数据类(pojo)

```java
data class Customer(val name: String, val email: String)
```
自动添加的方法:

+ 为所有属性添加 `getters` ，如果为 `var` 类型同时添加 `setters` 
+ equals()   
+ haseCode()  
+ toString()   
+ copy()   


## 枚举

```java
enum class Color(val rgb: Int) {
    RED(0xFF0000),
    GREEN(0x00FF00),
    BLUE(0x0000FF)
}
```

## 如果不为空执行某操作

```java
val date = ...
data?.let{
    ...//如果不为空执行该语句块
}
```


## When 表达式

when 取代了 C 风格语言的 switch 

```java
when (x) {
    1 -> print("x == 1")
    2 -> print("x == 2")
    else -> { // Note the block
        print("x is neither 1 nor 2")
    }
}
```


## 类扩展

```java
fun <T> MutableList<T>.swap(x: Int, y: Int) {
  val tmp = this[x] // 'this' corresponds to the list
  this[x] = this[y]
  this[y] = tmp
}
```

调用方式

```java
val l = mutableListOf(1, 2, 3)
l.swap(0, 2)// 在 `swap()` 函数中 `this` 持有的值是 `l`
```

> 扩展是被`静态解析`的
