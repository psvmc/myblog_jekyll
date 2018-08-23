---
layout: post
title: RxJava2 多线程
description: RxJava2 多线程
keywords: rxjava
categories: 
        - rx
        - rxjava

---



## 前言

+ `subscribeOn`

  > 指定Observable自身在哪个调度器上执行

+ `observeOn`

  > 指定一个观察者在哪个调度器上观察这个Observable



`subscribeOn`这个操作符指定的是Observable自身在哪个调度器上执行，而且跟调用的位置没有关系。

而`observableOn`则是指定一个观察者在哪个调度器上观察这个`Observable`



## 多次调用

+ 如果多次调用`subscribeOn` 只有第一次调用`subscribeOn`时选择的调度器`.subscribeOn(Schedulers.newThread())`有作用，而后来选择的都没有作用。
+ 当每次调用了`observableOn`这个操作符时，之后都会在选择的调度器上进行观察，直到再次调用`observableOn`切换了调度器。

这说明了`subscribeOn`这个操作符，与调用的位置无关，而且只有第一次调用时会指定`Observable`自己在哪个调度器执行。

其实有一种情况特殊，就是在`doOnSubscribe`操作符之后调用，可以使`doOnSubscribe`在指定的调度器中执行。



比如如下代码

```java
Observable<String> obs = Observable.create(new ObservableOnSubscribe<String>() {
    @Override
    public void subscribe(ObservableEmitter<String> emitter) throws Exception {
        System.out.println("Observable:" + Thread.currentThread().getId());
        emitter.onNext("数据");
        emitter.onComplete();
    }
});

obs
    .subscribeOn(Schedulers.io())
    .map(new Function<String, String>() {
        @Override
        public String apply(String o) throws Exception {
            System.out.println("map01:" + Thread.currentThread().getId());
            return o;
        }
    })
    .observeOn(Schedulers.io())
    .map(new Function<String, String>() {
        @Override
        public String apply(String o) throws Exception {
            System.out.println("map02:" + Thread.currentThread().getId());
            return o;
        }
    })
    .observeOn(Schedulers.newThread())
    .map(new Function<String, String>() {
        @Override
        public String apply(String o) throws Exception {
            System.out.println("map03:" + Thread.currentThread().getId());
            return o;
        }
    })
    .observeOn(Schedulers.newThread())
    .subscribe(new Consumer<String>() {
        @Override
        public void accept(String o) throws Exception {
            System.out.println("subscribe:" + Thread.currentThread().getId());
        }
    });
```

会打印

```
Observable:12
map01:12
map02:13
map03:14
subscribe:15
```

+ 如果不指定`subscribeOn` 那么会在当前所在线程中操作

+ 只要不调用`observeOn` 那么后续的操作一直会在之前的线程中操作
+ 多次调用`subscribeOn(Schedulers.io())`会在不同的线程中操作