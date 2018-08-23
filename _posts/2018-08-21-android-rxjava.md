---
layout: post
title: Android 中 RxJava 的使用
description: Android原生的多线程和异步处理简直糟透了，反复的嵌套让代码看起来十分不明了，多线程上也没有iOS的dispatch好用，但是用了Rxjava后就会有所改善，虽然代码量看起来会多一点，但是逻辑就清晰多了
keywords: rxjava
categories: 
        - android
        - rxjava

---


## 前言

Android原生的`多线程和异步`处理简直糟透了，反复的嵌套让代码看起来十分不明了，多线程上也没有`iOS`的`dispatch`好用，但是用了`Rxjava`后就会有所改善，虽然代码量看起来会多一点，但是`逻辑`就`清晰`多了

本文代码对应的是Rxjava2

## 真前言

总的来说`Rxjava`可以分为5块内容 分别为

+ 发布者（Observable/Flowable/Single/Completable）
+ 订阅者（Subscriber）
+ 中转站（Subject）
+ 线程（Scheduler）
+ 操作符

---

形象的来说  

+ `发布者` 就相当于 `报社`  
+ `订阅者` 就相当于 `用户`
+ `中转站` 就相当于 `报亭` 它既是`订阅者` 又是`发布者` 
+ `线程` 是指定在哪个线程上处理  
+ `操作符` 则是把发布者的数据进行处理，再给订阅者

---

在发布者和订阅者之间传递的事件总共有三种

+ `onNext()`: 发送事件的数据
+ `onCompleted()`: 事件队列完结。`RxJava` 不仅把每个事件单独处理，还会把它们看做一个队列。`RxJava` 规定，当不会再有新的 `onNext()` 发出时，需要触发 `onCompleted()` 方法作为标志。
+ `onError()`: 事件队列异常。在事件处理过程中出异常时，`onError()` 会被触发，同时队列自动终止，不允许再有事件发出。
+ 在一个正确运行的事件序列中, `onCompleted()` 和 `onError()` 有且只有一个，并且是事件序列中的最后一个。需要注意的是，`onCompleted()` 和 `onError()` 二者也是互斥的，即在队列中调用了其中一个，就不应该再调用另一个。

下面就说一下各块内容

## 发布者

对比

+ Observable/Flowable：

  `Observable`不支持`背压(backpressure)` `Flowable`是Rxjava2新增加的支持`背压(backpressure)`

  `背压(backpressure)`:只有上下游运行在各自的线程中，且上游发射数据速度大于下游接收处理数据的速度时，才会产生背压问题。

  如果上游发送数据速度远大于下游接收数据的速度 

  用`Observable`就会内存溢出  

  `Flowable`则会抛弃掉处理不了的数据来防止溢出

  但是不能就都用`Flowable` 因为`Observable`的性能较高

+ Single：

  和Observable，Flowable一样会发送数据，不同的是订阅后只能接受到一次

  普通Observable可以使用toSingle转换:`Observable.just(1).toSingle()`

+ Completable

  与Single类似，只能接受到一次完成(onComplete)或错误(onError)

  同样也可以由普通的Observable转换而来:`Observable.just(1).toCompletable()`



发布者发布事件 可以手动创建也可以调用内置方法  



### Observable

```java
Observable
    .create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> emitter) throws Exception {

        }
    })
    .subscribe(new Observer<String>() {
        @Override
        public void onSubscribe(Disposable d) {

        }

        @Override
        public void onNext(String s) {

        }

        @Override
        public void onError(Throwable e) {

        }

        @Override
        public void onComplete() {

        }
    });
```

### Flowable

```java
Flowable
    .create(new FlowableOnSubscribe<String>() {
        @Override
        public void subscribe(FlowableEmitter<String> emitter) throws Exception {

        }
    }, BackpressureStrategy.DROP)
    .subscribe(new FlowableSubscriber<String>() {
        @Override
        public void onSubscribe(Subscription s) {

        }

        @Override
        public void onNext(String s) {

        }

        @Override
        public void onError(Throwable t) {

        }

        @Override
        public void onComplete() {

        }
    });
```



### Single

```java
Single
    .create(new SingleOnSubscribe<String>() {
        @Override
        public void subscribe(SingleEmitter<String> emitter) throws Exception {

        }
    })
    .subscribe(new SingleObserver<String>() {
        @Override
        public void onSubscribe(Disposable d) {

        }

        @Override
        public void onSuccess(String s) {

        }

        @Override
        public void onError(Throwable e) {

        }
    });
```

### Completable

```java
Completable
    .create(new CompletableOnSubscribe() {
        @Override
        public void subscribe(CompletableEmitter emitter) throws Exception {

        }
    })
    .subscribe(new CompletableObserver() {
        @Override
        public void onSubscribe(Disposable d) {

        }

        @Override
        public void onComplete() {

        }

        @Override
        public void onError(Throwable e) {

        }
    });
```



## 订阅者（Subscriber）

Observer/FlowableOnSubscribe/SingleOnSubscribe/CompletableOnSubscribe/Consumer/Subscriber

| 发布者      | 订阅者                                  |
| ----------- | --------------------------------------- |
| Observable  | Observer/Consumer                       |
| Flowable    | FlowableOnSubscribe/Subscriber/Consumer |
| Single      | SingleObserver/Consumer/BiConsumer      |
| Completable | CompletableObserver/Action              |

创建

```java
Observer<String> observer = new Observer<String>() {
    @Override
    public void onSubscribe(Disposable d) {

    }

    @Override
    public void onNext(String s) {

    }

    @Override
    public void onError(Throwable e) {

    }

    @Override
    public void onComplete() {

    }
};
```

订阅

```java
observable.subscribe(observer);
```

注意上面方法的顺序 看上去是`发布者`订阅了`订阅者`，之所以这样是因为链式代码的优雅

## 线程（Scheduler）

常用的方式是`分线程`中处理数据，`主线程`中使用数据生成页面

```java
Observable
    .create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> emitter) throws Exception {
            emitter.onNext("发送的数据");
            emitter.onComplete();
        }
    })
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(new Observer<String>() {
        @Override
        public void onSubscribe(Disposable d) {
        }

        @Override
        public void onNext(String s) {
        }

        @Override
        public void onError(Throwable e) {
        }

        @Override
        public void onComplete() {
        }
    });
```

## 操作符

| 名称                             | 解析                                                         |
| -------------------------------- | ------------------------------------------------------------ |
| amb()<br />ambArray<br />ambWith | 给定多个Observable，只让第一个发射数据的Observable发射全部数据 |
| defaultIfEmpty()                 | 发射来自原始Observable的数据，如果原始Observable没有发射数据，就发射一个默认数据 |
| switchIfEmpty()                  | 如果原始Observable没有发射数据，它发射一个备用Observable的发射物 |
| skipUntil()                      | 跳过原始Observable发射的数据，直到第二个Observable发射了一个数据，<br />然后发射原始Observable的剩余数据 |
| skipWhile()                      | 判断成功的都跳过 一旦为假  发送剩余的所有数据                |
| takeUntil()                      | 发送为真包括以前的数据 不再处理后续数据                      |
| takeWhile()                      | 发送为真的数据 一旦为假就不再处理后续数据                    |

### create

参见面发布者部分

### just/range/fromArray

+ just

```java
Observable observable = Observable.just("好好学习", "天天向上");
// 将会依次调用：
// onNext("好好学习");
// onNext("天天向上");
// onCompleted();
```

+ range

```java
Observable.range(1,10);
```

+ fromArray

```java
String[] quotations = {"好好学习", "天天向上"};
Observable observable = Observable.fromArray(quotations);
```

### interval/timer

```java
//延迟10s每10s发送一次
Observable.interval(10,10, TimeUnit.SECONDS);
//延迟10s发送一次
Observable.timer(10,TimeUnit.SECONDS);
```

### throttleFirst/throttleLast

`throttleFirst`操作符：仅发送指定时间段内的第一个信号

`throttleLast`操作符：仅发送指定时间段内的第一个信号

```java
RxView.clicks(mBtn)
      .throttleFirst(1, TimeUnit.SECONDS);
```

### debounce

指定时间段内没有新的信号时 则发出最后一个信号

比如监听文本变化进行搜索

```java
RxTextView.textChanges(etKey)
          .debounce(400, TimeUnit.MILLISECONDS, AndroidSchedulers.mainThread());
```



### map

类型变换

```java
String[] strs = {"11","22","33"};
Observable
    .fromArray(strs)
    .map(new Function<String, Integer>() {
        @Override
        public Integer apply(String s) throws Exception {
            return Integer.valueOf(s);
        }
    })
    .subscribe(observer);
```

### concatMap

concatMap(): 这是一个很有用但非常难理解的变换。   

首先假设这么一种需求：上面的`{"11","22","33"}`我们像最终获取到`1,1,2,2,3,3`

```java
String[] strs = {"11","22","33"};
Observable
    .fromArray(strs)
    .concatMap(new Function<String, ObservableSource<Integer>>() {
        private Subject<Integer> subject = PublishSubject.create();
        @Override
        public ObservableSource<Integer> apply(String s) throws Exception {
            for (char c:s.toCharArray()){
                subject.onNext(Integer.valueOf(""+c));
            }
            subject.onComplete();
            return subject;
        }
    }).subscribe(new Consumer<Integer>() {
    @Override
    public void accept(Integer integer) throws Exception {

    }
});
```

用 `map()` 显然是不行的，因为 `map()` 是一对一的转化，而我现在的要求是一对多的转化，就需要用 `flatMap()` 了

Kotlin

```kotlin
Observable
    .create<Int> {
        for (i in 0 until 4) {
            it.onNext(i)
        }
        it.onComplete()
    }
    .concatMap {
        L.i("concatMap:${it}")
        var value = it
        return@concatMap Observable.create<String> {
            Thread.sleep((Math.random() * 1000).toLong())
            it.onNext("${value + 100}")
            it.onComplete()
        }
    }.subscribe({
        L.i("最后：${it}")
    }, {

    }, {
        L.i("事件完成")
    })
```

> 注意`concatMap`中一定要发送`onComplete`事件

### flatMap

flatMap和concatMap最大的区别是concatMap发射的数据集是有序的，flatMap发射的数据集是无序的

### filter

`过滤`  

假如我们要大于5的数

```java
Integer[] nums = {3, 4, 5, 6, 7};
Observable
    .fromArray(nums)
    .filter(new Predicate<Integer>() {
        @Override
        public boolean test(Integer integer) throws Exception {
            if (integer < 5) {
                return false;
            } else {
                return true;
            }
        }
    })
    .subscribe(new Consumer<Integer>() {
        @Override
        public void accept(Integer integer) throws Exception {

        }
    });
```

### defaultIfEmpty

当未发送`onNext`直接发送`onComplete`时 `onNext`收到的默认值

```java
Observable
    .create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> e) throws Exception {
            e.onComplete();
        }
    })
    .defaultIfEmpty("默认数据")
    .subscribe(new Consumer<String>() {
        @Override
        public void accept(@NonNull String s) throws Exception {
            Log.e(TAG, "accept: " + s);
        }
    });
```

### switchEmpty

如果发射源没有发射数据就完成了，就发射switchIfEmpty里面新的Observable发射源

```java
Observable
    .create(new ObservableOnSubscribe<String>() {
        @Override
        public void subscribe(ObservableEmitter<String> e) throws Exception {
            e.onComplete();
        }
    })
    .switchIfEmpty(Observable.just("a", "b", "c"))
    .subscribe(new Consumer<String>() {
        @Override
        public void accept(@NonNull String s) throws Exception {
            Log.e(TAG, "accept: " + s);
        }
    });
```



### zip

```java
Observable
    .zip(
        Observable.just("100", "200"),
        Observable.just("1","2","3"),
        new BiFunction<String, String, Integer>() {
            @Override
            public Integer apply(String s, String s2) throws Exception {
                return Integer.valueOf(s) + Integer.valueOf(s2);
            }
        })
    .subscribe(new Consumer<Integer>() {
        @Override
        public void accept(Integer integer) throws Exception {
            L.i(""+integer);
        }
    });
```

上面的代码会收到 101、202

也就是说多个`Observable`都发送时 才处理数据

### amb/ambArray/ambWith

给定多个Observable，只让第一个发射数据的Observable发射全部数据。

### take/takeWhile/takeUntil

take

```java
//取前两个信号
.take(2);
//取后两个信号
.takeLast(2);
//取前1s的信号
.take(1,TimeUnit.SECONDS);
//取后1s的信号
.takeLast(1,TimeUnit.SECONDS);
```

------

takeWhile

```java
//发送为真的数据 一旦为假就不再处理后续数据
//会收到1、2
Observable
    .just(1, 2, 3,2)
    .takeWhile(new Predicate<Integer>() {
        @Override
        public boolean test(Integer integer) throws Exception {
            return integer<3;
        }
    });
```

------

takeUntil

```java
//发送为真包括以前的数据 不再处理后续数据
//会收到1、2
Observable
    .just(1, 2, 3,2)
    .takeUntil(new Predicate<Integer>() {
        @Override
        public boolean test(Integer integer) throws Exception {
            return integer >1;
        }
    })
  
//获取原始Observable发射的数据，直到第二个Observable发射了一个数据,不再发送原始Observable的剩余数据
//会收到1,2,3,2
Observable
    .just(1, 2, 3,2)
    .takeUntil(Observable.just("3").delay(1,TimeUnit.SECONDS))
    .subscribe(new Consumer<Integer>() {
        @Override
        public void accept(Integer integer) throws Exception {
            L.i("" + integer);
        }
    });
```



### skip/skipWhile/skipUntil

skip

```java
//取前两个信号
.skip(2);
//取后两个信号
.skipLast(2);
//取前1s的信号
.skip(1,TimeUnit.SECONDS);
//取后1s的信号
.skipLast(1,TimeUnit.SECONDS);
```

------

skipWhile:判断成功的都跳过 一旦为假  发送剩余的所有数据

```java
Observable
    .just(1, 2, 3,2)
    .skipWhile(new Predicate<Integer>() {
        @Override
        public boolean test(Integer integer) throws Exception {
            return integer<2;
        }
    })
```

会收到2、3、2  判断成功的都跳过 一旦为假  发送剩余的所有数据

------

skipUntil:跳过原始Observable发射的数据，直到第二个Observable发射了一个数据,然后发射原始Observable的剩余数据

```java
Observable
    .just(1, 2, 3,2)
    .skipUntil(Observable.just("3").delay(1,TimeUnit.SECONDS))
    .subscribe(new Consumer<Integer>() {
        @Override
        public void accept(Integer integer) throws Exception {
            L.i("" + integer);
        }
    });
```

 收不到数据 因为第二个Observable延迟1s结束后 原始Observable已经没有剩余数据了

## 中转站（Subject）

Rxjava和Rxjava2对比

`io.reactivex.subjects.AsyncSubject`,
`io.reactivex.subjects.BehaviorSubject`,
`io.reactivex.subjects.PublishSubject`,
`io.reactivex.subjects.ReplaySubject`,
`io.reactivex.subjects.UnicastSubject`

在RxJava2中依然存在，但现在他们不支持`backpressure`。

新出现的

`io.reactivex.processors.AsyncProcessor`,
`io.reactivex.processors.BehaviorProcessor`,
`io.reactivex.processors.PublishProcessor`,
`io.reactivex.processors.ReplayProcessor`
`io.reactivex.processors.UnicastProcessor`

支持`backpressure`



Subject 在平时开发时 用的不是很多  

它分为四种

+ PublishSubject（之后）
+ BehaviorSubject（前一个事件＋之后）
+ ReplaySubject（所有事件）
+ AsyncSubject（最后事件）

---

用法如下

```java
observable.subscribe(subject);
subject.subscribe(observer);
```

---

区别

假如`发布者`  也就是报社 只发布`周一到周五`的报纸 一天一份  
如果我们在`周三`早上来报厅订报  

+ 如果报厅是`PublishSubject` 我们可以收到 `周三 周四 周五`的报纸  

+ 如果报厅是`BehaviorSubject` 我们可以收到 `周二 至 周五`的报纸  

+ 如果报厅是`ReplaySubject` 我们可以收到 `周一 至 周五`的报纸  

+ 如果报厅是`AsyncSubject` 我们可以收到 `周五`的报纸 但是发布的事件中`如果有错误` 那我们只会`接受到错误` 而`不是错误的前一个事件`

  ​


## Android中应用

添加依赖

```json
implementation 'io.reactivex.rxjava2:rxandroid:2.0.2'
implementation 'io.reactivex.rxjava2:rxjava:2.1.10'

implementation 'com.jakewharton.rxbinding2:rxbinding:2.1.1'
implementation 'com.trello.rxlifecycle2:rxlifecycle:2.2.1'
implementation 'com.trello.rxlifecycle2:rxlifecycle-components:2.2.1'
//网络请求库
implementation 'com.lzy.net:okgo:3.0.4'
implementation 'com.lzy.net:okrx2:2.0.2'
//JSON转换
implementation 'com.alibaba:fastjson:1.2.46'
```



详细示例可参考 [github博客生成APP(Rxjava1)](https://github.com/psvmc/ZJBlog)

## 其他

+ [本文网址](http://www.psvmc.cn/article/android-rxjava.html)
+ [RxSwift概念讲解](http://www.psvmc.cn/article/ios-rxswift-01.html)