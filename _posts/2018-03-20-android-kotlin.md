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
for (i in 1 until 4)print(i) //打印123
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

## 类对比

Java

```java
Intent t = new Intent();
t.setClass(this,LoginActivity.class);
startActivity(t);
```

Kotlin

```kotlin
val t = Intent()
t.setClass(this, LoginActivity::class.java)
startActivity(t)
```

## 自定义输出日志

```kotlin
object LoggerPrinter {
    private val MIN_STACK_OFFSET = 3
    
    private val TOP_LEFT_CORNER = '╔'
    private val BOTTOM_LEFT_CORNER = '╚'
    private val MIDDLE_CORNER = '╟'
    private val HORIZONTAL_DOUBLE_LINE = '║'
    private val DOUBLE_DIVIDER = "════════════════════════════════════════════"
    private val SINGLE_DIVIDER = "────────────────────────────────────────────"
    val TOP_BORDER = TOP_LEFT_CORNER + DOUBLE_DIVIDER + DOUBLE_DIVIDER
    val BOTTOM_BORDER = BOTTOM_LEFT_CORNER + DOUBLE_DIVIDER + DOUBLE_DIVIDER
    val MIDDLE_BORDER = MIDDLE_CORNER + SINGLE_DIVIDER + SINGLE_DIVIDER

    val JSON_INDENT = 2

    fun getStackOffset(trace: Array<StackTraceElement>): Int {
        var i = MIN_STACK_OFFSET
        while (i < trace.size) {
            val e = trace[i]
            val name = e.className
            if (name != LoggerPrinter::class.java.name && name != L::class.java.name) {
                return --i
            }
            i++
        }
        return -1
    }
}
```

L类

```kotlin
import android.util.Log
import org.json.JSONArray
import org.json.JSONException
import org.json.JSONObject

object L {
    enum class LogLevel {
        ERROR {
            override val value: Int
                get() = 0
        },
        WARN {
            override val value: Int
                get() = 1
        },
        INFO {
            override val value: Int
                get() = 2
        },
        DEBUG {
            override val value: Int
                get() = 3
        };

        abstract val value: Int
    }

    private var TAG = "SAF_L"
    var logLevel = LogLevel.DEBUG // 日志的等级，可以进行配置，最好在Application中进行全局的配置
    @JvmStatic
    fun init(clazz: Class<*>) {
        TAG = clazz.simpleName
    }

    /**
    - 支持用户自己传tag，可扩展性更好
    - @param tag
     */
    @JvmStatic
    fun init(tag: String) {
        TAG = tag
    }

    @JvmStatic
    fun e(msg: String) {
        if (LogLevel.ERROR.value <= logLevel.value) {
            if (msg.isNotBlank()) {
                val s = getMethodNames()
                Log.e(TAG, String.format(s, msg))
            }
        }
    }

    @JvmStatic
    fun w(msg: String) {
        if (LogLevel.WARN.value <= logLevel.value) {
            if (msg.isNotBlank()) {
                val s = getMethodNames()
                Log.e(TAG, String.format(s, msg))
            }
        }
    }

    @JvmStatic
    fun i(msg: String) {
        if (LogLevel.INFO.value <= logLevel.value) {
            if (msg.isNotBlank()) {
                val s = getMethodNames()
                Log.i(TAG, String.format(s, msg))
            }
        }
    }

    @JvmStatic
    fun d(msg: String) {
        if (LogLevel.DEBUG.value <= logLevel.value) {
            if (msg.isNotBlank()) {
                val s = getMethodNames()
                Log.d(TAG, String.format(s, msg))
            }
        }
    }

    @JvmStatic
    fun json(json: String) {
        var json = json
        if (json.isBlank()) {
            d("Empty/Null json content")
            return
        }
        try {
            json = json.trim { it <= ' ' }
            if (json.startsWith("{")) {
                val jsonObject = JSONObject(json)
                var message = jsonObject.toString(LoggerPrinter.JSON_INDENT)
                message = message.replace("\n".toRegex(), "\n║ ")
                val s = getMethodNames()
                println(String.format(s, message))
                return
            }
            if (json.startsWith("[")) {
                val jsonArray = JSONArray(json)
                var message = jsonArray.toString(LoggerPrinter.JSON_INDENT)
                message = message.replace("\n".toRegex(), "\n║ ")
                val s = getMethodNames()
                println(String.format(s, message))
                return
            }
            e("Invalid Json")
        } catch (e: JSONException) {
            e("Invalid Json")
        }
    }

    private fun getMethodNames(): String {
        val sElements = Thread.currentThread().stackTrace
        var stackOffset = LoggerPrinter.getStackOffset(sElements)
        stackOffset++
        val builder = StringBuilder()
        builder.append(LoggerPrinter.TOP_BORDER).append("\r\n")
                // 添加当前线程名
                .append("║ " + "Thread: " + Thread.currentThread().name).append("\r\n")
                .append(LoggerPrinter.MIDDLE_BORDER).append("\r\n")
                // 添加类名、方法名、行数
                .append("║ ")
                .append(sElements[stackOffset].className)
                .append(".")
                .append(sElements[stackOffset].methodName)
                .append(" ")
                .append(" (")
                .append(sElements[stackOffset].fileName)
                .append(":")
                .append(sElements[stackOffset].lineNumber)
                .append(")")
                .append("\r\n")
                .append(LoggerPrinter.MIDDLE_BORDER).append("\r\n")
                // 添加打印的日志信息
                .append("║ ").append("%s").append("\r\n")
                .append(LoggerPrinter.BOTTOM_BORDER).append("\r\n")
        return builder.toString()
    }

    fun String.isBlank(msg: String): Boolean {
        return msg == null || msg.length == 0;
    }

    fun String.isNotBlank(msg: String): Boolean {
        return !msg.isBlank();
    }
}
```

