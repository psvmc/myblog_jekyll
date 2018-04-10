---
layout: post
title: Android Kotlin启程之Anko
description: Android Kotlin启程之Anko
keywords: android
categories: 
        - kotlin
        - android

---



## 前言

之前写了一写Kotlin的基本操作 是不是感觉太好用了

但是接下来介绍的这个库 让你会觉得太爽了 这个库就是[`超级好用的库anko`](https://github.com/Kotlin/anko)

它总共有四个部分

- `Anko Commons`: a lightweight library full of helpers for intents, dialogs, logging and so on;
- `Anko Layouts`: a fast and type-safe way to write dynamic Android layouts;
- `Anko SQLite`: a query DSL and parser collection for Android SQLite;
- `Anko Coroutines`: utilities based on the [kotlinx.coroutines](https://github.com/Kotlin/kotlinx.coroutines) library.

这里我们先说`Anko Commons` 它的作用

- Intents ([wiki](https://github.com/Kotlin/anko/wiki/Anko-Commons-%E2%80%93-Intents));
- Dialogs and toasts ([wiki](https://github.com/Kotlin/anko/wiki/Anko-Commons-%E2%80%93-Dialogs));
- Logging ([wiki](https://github.com/Kotlin/anko/wiki/Anko-Commons-%E2%80%93-Logging));
- Resources and dimensions ([wiki](https://github.com/Kotlin/anko/wiki/Anko-Commons-%E2%80%93-Misc)).



## 异步操作

```kotlin
doAsync {
    //异步分线程操作
    uiThread {
        //主线程操作
    }
}
```



## Intent

引用

```bash
dependencies {
    compile "org.jetbrains.anko:anko-commons:0.10.4"
}
```

原写法

```kotlin
var intent = Intent();
intent.putExtra("id",5)
intent.putExtra("name","zhangjian")
intent.flags = Intent.FLAG_ACTIVITY_CLEAR_TASK
intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
intent.setClass(this, SMainActivity::class.java)
startActivity(intent)
```

新写法

```kotlin
var intent = intentFor<SMainActivity>("id" to 5,"name" to "zhangjian").clearTask().newTask()
startActivity(intent)
```

**其他有用的Intent**

| 作用     | 写法                                       |
| -------- | ------------------------------------------ |
| 打电话   | `makeCall(number)` without **tel:**        |
| 发短信   | `sendSMS(number, [text])` without **sms:** |
| 打开网页 | `browse(url)`                              |
| 分享文字 | `share(text, [subject])`                   |
| 发邮件   | `email(email, [subject], [text])`          |

参数 (`[]`) 是可选的. 如果`intent`成功发送 方法返回`true`.

## Dialogs and toasts

引用

```bash
dependencies {
    compile "org.jetbrains.anko:anko-commons:0.10.4"
    compile "org.jetbrains.anko:anko-design:0.10.4" // For SnackBars
}
```

使用方式

### Toasts

Simply shows a [Toast](https://developer.android.com/guide/topics/ui/notifiers/toasts.html) message.

```
toast("Hi there!")
toast(R.string.message)
longToast("Wow, such duration")
```

### SnackBars

Simply shows a [SnackBar](https://developer.android.com/reference/android/support/design/widget/Snackbar.html) message.

```
snackbar(view, "Hi there!")
snackbar(view, R.string.message)
longSnackbar(view, "Wow, such duration")
snackbar(view, "Action, reaction", "Click me!") { doStuff() }
```

### Alerts

A small DSL for showing [alert dialogs](https://developer.android.com/guide/topics/ui/dialogs.html).

```
alert("Hi, I'm Roy", "Have you tried turning it off and on again?") {
    yesButton { toast("Oh…") }
    noButton {}
}.show()
```

The code above will show the default Android alert dialog. If you want to switch to the appcompat implementation, use the `Appcompat` dialog factory:

```
alert(Appcompat, "Some text message").show()
```

`Android` and `Appcompat` dialog factories are included by default, but you can create your custom factories by implementing the `AlertBuilderFactory` interface.

`alert()` functions seamlessly support Anko layouts as custom views:

```
alert {
    customView {
        editText()
    }
}.show()
```

### Selectors

`selector()` shows an alert dialog with a list of text items:

```
val countries = listOf("Russia", "USA", "Japan", "Australia")
selector("Where are you from?", countries, { dialogInterface, i ->
    toast("So you're living in ${countries[i]}, right?")
})
```

### Progress dialogs

`progressDialog()` creates and shows a [progress dialog](https://developer.android.com/reference/android/app/ProgressDialog.html).

```
val dialog = progressDialog(message = "Please wait a bit…", title = "Fetching data")
```

## Logging

引用

```json
dependencies {
    compile "org.jetbrains.anko:anko-commons:0.10.4"
}
```

使用方式

```kotlin
info("London is the capital of Great Britain")
debug(5) // .toString() method will be executed
warn(null) // "null" will be printed
```

对比

| android.util.Log | AnkoLogger  |
| ---------------- | ----------- |
| `v()`            | `verbose()` |
| `d()`            | `debug()`   |
| `i()`            | `info()`    |
| `w()`            | `warn()`    |
| `e()`            | `error()`   |
| `wtf()`          | `wtf()`     |

> 默认的`tag`是类名
>
> Lambda result will be calculated only if `Log.isLoggable(tag, Log.INFO)` is `true`.

自定义tag

```kotlin
class SomeActivity : Activity() {
    private val log = AnkoLogger<SomeActivity>(this)
    private val logWithASpecificTag = AnkoLogger("my_tag")

    private fun someMethod() {
        log.warning("Big brother is watching you!")
    }
}
```

## Resources and dimensions

这部分总体感觉没什么卵用

### Colors

Two simple extension functions to make the code more readable.

| Function           | Result                       |
| ------------------ | ---------------------------- |
| `0xff0000.opaque`  | non-transparent red          |
| `0x99.gray.opaque` | non-transparent #999999 gray |

### Dimensions

px转dp/sp

```kotlin
px2dip(10)
px2sp(10)
```

### applyRecursively()

`applyRecursively()` applies the lambda expression to the passed `View` itself, and then recursively to every child of a `View` if it is a `ViewGroup`:

```kotlin
verticalLayout {
    editText {
        hint = "Name"
    }
    editText {
        hint = "Password"
    }
}.applyRecursively { view -> when(view) {
    is EditText -> view.textSize = 20f
}}
```

