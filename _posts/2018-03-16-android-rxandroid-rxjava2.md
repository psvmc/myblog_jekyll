---
layout: post
title: Android RxAndroid和RxJava2在Kotlin中的使用
description: Android RxAndroid和RxJava2在Kotlin中的使用
keywords: android
categories: android rxjava
---



## 引用

```java
implementation 'io.reactivex.rxjava2:rxandroid:2.0.2'
implementation 'io.reactivex.rxjava2:rxjava:2.1.10'
```

[`Github地址`](https://github.com/ReactiveX/RxAndroid)

## 使用

### 延迟执行

Kotlin

```kotlin
Observable.timer(1000, TimeUnit.MILLISECONDS)
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe {  }
```

### 多线程

常用的方式是`分线程`中处理数据，`主线程`中使用数据生成页面

Kotlin

```kotlin
Observable
        .create<List<TreeItemModel>> { source ->
            var treeList = arrayListOf<TreeItemModel>()
            source.onNext(treeList)
            source.onComplete()
        }
        .subscribeOn(Schedulers.io())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe({ treeList ->
            print(treeList.size)
        }, { error ->
            print(error.localizedMessage)
        })
```

