---

layout: post
title: Android 中RxJava的使用
description: Android原生的多线程和异步处理简直糟透了，反复的嵌套让代码看起来十分不明了，多线程上也没有iOS的dispatch好用，但是用了Rxjava后就会有所改善，虽然代码量看起来会多一点，但是逻辑就清晰多了
keywords: rxjava
category: android

---


## 前言

Android原生的`多线程和异步`处理简直糟透了，反复的嵌套让代码看起来十分不明了，多线程上也没有`iOS`的`dispatch`好用，但是用了`Rxjava`后就会有所改善，虽然代码量看起来会多一点，但是`逻辑`就`清晰`多了

## 真前言

总的来说`Rxjava`可以分为5块内容 分别为

+ 发布者（Observable）
+ 订阅者（Subscriber）
+ 中转站（Subject）
+ 线程（Scheduler）
+ 转换/过滤/运算

---

形象的来说  

+ `发布者` 就相当于 `报社`  
+ `订阅者` 就相当于 `用户`
+ `中转站` 就相当于 `报亭` 它既是`订阅者` 又是`发布者` 
+ `线程` 是指定在哪个线程上处理  
+ `转换/过滤/运算` 则是把发布者的数据进行处理，再给订阅者

---

在发布者和订阅者之间传递的事件总共有三种

+ `onNext()`: 发送事件的数据
+ `onCompleted()`: 事件队列完结。`RxJava` 不仅把每个事件单独处理，还会把它们看做一个队列。`RxJava` 规定，当不会再有新的 `onNext()` 发出时，需要触发 `onCompleted()` 方法作为标志。
+ `onError()`: 事件队列异常。在事件处理过程中出异常时，`onError()` 会被触发，同时队列自动终止，不允许再有事件发出。
+ 在一个正确运行的事件序列中, `onCompleted()` 和 `onError()` 有且只有一个，并且是事件序列中的最后一个。需要注意的是，`onCompleted()` 和 `onError()` 二者也是互斥的，即在队列中调用了其中一个，就不应该再调用另一个。

下面就说一下各块内容

## 发布者（Observable）

发布者发布事件 可以手动创建也可以调用内置方法  

假如我们要发布两句话: `好好学习` `天天向上`

### 方式1 手动创建

```java
Observable observable = Observable.create(new OnSubscribe<String>() {
    @Override
    public void call(Subscriber<? super String> subscriber) {
        subscriber.onNext("好好学习");
        subscriber.onNext("天天向上");
        subscriber.onCompleted();
    }
});
```

### 方式2 just()

```java
Observable observable = Observable.just("好好学习", "天天向上");
// 将会依次调用：
// onNext("好好学习");
// onNext("天天向上");
// onCompleted();
```

### 方式3 from()

```java
String[] quotations = {"好好学习", "天天向上"};
Observable observable = Observable.from(quotations);
```

## 订阅者（Subscriber）

```java
Observer<String> observer = new Observer<String>() {
    @Override
    public void onNext(String s) {
    
    }

    @Override
    public void onCompleted() {

    }

    @Override
    public void onError(Throwable e) {

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
.create(new Observable.OnSubscribe<List<ZJArticle>>() {
    @Override
    public void call(Subscriber<? super List<ZJArticle>> subscriber) {
        //从数据库中加载数据
        List<ZJArticle> articles = ZJArticleDb.getInstance().queryByPage(0);
        subscriber.onNext(articles);
        subscriber.onCompleted();
    }
})
.subscribeOn(Schedulers.io())
.observeOn(AndroidSchedulers.mainThread())
.subscribe(new Observer<List<ZJArticle>>() {
    @Override
    public void onCompleted() {
    }

    @Override
    public void onError(Throwable e) {
        Log.w(TAG, "onError: " + e.getLocalizedMessage());
    }

    @Override
    public void onNext(List<ZJArticle> articles) {
        //RecycleView中加载数据刷新
        mListData.removeAll(mListData);
        mListData.addAll(articles);
        mListAdapter.notifyDataSetChanged();
        mSwipeLayout.setRefreshing(false);

    }
});
```

## 转换/过滤/运算

### map 

事件对象的直接变换

```java
Student[] students = ...;
Subscriber<String> subscriber = new Subscriber<String>() {
    @Override
    public void onNext(String name) {
        Log.d(tag, name);
    }
    ...
};
Observable.from(students)
    .map(new Func1<Student, String>() {
        @Override
        public String call(Student student) {
            return student.getName();
        }
    })
    .subscribe(subscriber);
```

### flatMap

flatMap(): 这是一个很有用但非常难理解的变换。   

首先假设这么一种需求：假设有一个数据结构『学生』，现在需要打印出一组学生的名字。我们可以用上面的例子(map)来处理  

那么再假设：如果要打印出每个学生所需要修的所有课程的名称呢？（需求的区别在于，每个学生只有一个名字，但却有多个课程。）首先可以这样实现：

```java
Student[] students = ...;
Subscriber<Student> subscriber = new Subscriber<Student>() {
    @Override
    public void onNext(Student student) {
        List<Course> courses = student.getCourses();
        for (int i = 0; i < courses.size(); i++) {
            Course course = courses.get(i);
            Log.d(tag, course.getName());
        }
    }
    ...
};
Observable.from(students)
    .subscribe(subscriber);
```

依然很简单。那么如果我不想在 `Subscriber` 中使用 `for` 循环，而是希望 `Subscriber` 中直接传入单个的 `Course` 对象呢（这对于代码复用很重要）？用 `map()` 显然是不行的，因为 `map()` 是一对一的转化，而我现在的要求是一对多的转化。那怎么才能把一个 `Student` 转化成多个 `Course` 呢？

这个时候，就需要用 `flatMap()` 了：

```java
Student[] students = ...;
Subscriber<Course> subscriber = new Subscriber<Course>() {
    @Override
    public void onNext(Course course) {
        Log.d(tag, course.getName());
    }
    ...
};
Observable.from(students)
    .flatMap(new Func1<Student, Observable<Course>>() {
        @Override
        public Observable<Course> call(Student student) {
            return Observable.from(student.getCourses());
        }
    })
    .subscribe(subscriber);
```

从上面的代码可以看出  

`flatMap()` 和 `map()` 有一个相同点：它也是把传入的参数转化之后返回另一个对象。  

但需要注意，和 `map()` 不同的是，`flatMap()` 中返回的是个 `Observable` 对象，并且这个 `Observable` 对象并不是被直接发送到了 `Subscriber` 的回调方法中。 

`flatMap()` 的原理是这样的：

1. 使用传入的事件对象创建一个 `Observable` 对象；
2. 并不发送这个 `Observable`, 而是将它激活，于是它开始发送事件；
3. 每一个创建出来的 `Observable` 发送的事件，都被汇入同一个 `Observable` ，而这个 `Observable` 负责将这些事件统一交给 `Subscriber` 的回调方法。

这三个步骤，把事件拆成了两级，通过一组新创建的 `Observable` 将初始的对象『铺平』之后通过统一路径分发了下去。而这个『铺平』就是 `flatMap()` 所谓的 `flat`。

### filter 

`过滤`  

假如我们要把所有`png`加载到`imgeView`中 过滤掉非`png`图片

```java
Observable.from(files)
    .filter(new Func1<File, Boolean>() {
        @Override
        public Boolean call(File file) {
            return file.getName().endsWith(".png");
        }
    })
    .map(new Func1<File, Bitmap>() {
        @Override
        public Bitmap call(File file) {
            return getBitmapFromFile(file);
        }
    })
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(new Action1<Bitmap>() {
        @Override
        public void call(Bitmap bitmap) {
            imageCollectorView.addImage(bitmap);
        }
    });
```

## 中转站（Subject）

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


### 通过BehaviorSubject 来制作缓存

```java
BehaviorSubject<List<Item>> cache;
public Subscription subscribeData(@NonNull Observer<List<Item>> observer) {
     //判断内存缓存是否为空
    if (cache == null) {
        cache = BehaviorSubject.create();
        Observable.create(new Observable.OnSubscribe<List<Item>>() {
            @Override
            public void call(Subscriber< ? super List<Item>> subscriber) {
                List<Item> items = Database.getInstance().readItems();
                //判断硬盘缓存是否为空
                if (items == null) {
                    //从网络读取数据
                    loadFromNetwork();
                } else {
                    //发送硬盘数据
                    subscriber.onNext(items);
                }
            }
        }).subscribeOn(Schedulers.io())
          .subscribe(cache);
    } 
    return cache.observeOn(AndroidSchedulers.mainThread()).subscribe(observer);
}

subscription = subscribeData(new Observer<List<Item>>() {
    @Override
    public void onCompleted() {
    }

    @Override
    public void onError(Throwable e) {
        swipeRefreshLayout.setRefreshing(false);
        Toast.makeText(getActivity(), R.string.loading_failed, Toast.LENGTH_SHORT).show();
    }

    @Override
    public void onNext(List<Item> items) {
        swipeRefreshLayout.setRefreshing(false);
        adapter.setItems(items);
    }
});
```

## Android中应用

添加依赖

```gradle
compile 'com.squareup.retrofit2:retrofit:2.1.0'
compile 'com.squareup.retrofit2:converter-gson:2.1.0'
compile 'com.squareup.retrofit2:converter-scalars:2.1.0'
compile 'io.reactivex:rxandroid:1.0.0'
```

需要注意的是

+ `retrofit 1.x` 会返回`Observable`对象 方便与`Rxjava`结合使用  
+ `retrofit 2.x` 则需要自己创建

详细示例可参考 [github博客生成APP](https://github.com/psvmc/ZJBlog)

## 其他

参考

+ [给 Android 开发者的 RxJava 详解](http://gank.io/post/560e15be2dca930e00da1083)
+ [Rxjava Subject分析](http://blog.csdn.net/jdsjlzx/article/details/51502781)

我的

+ [本文网址](http://www.psvmc.cn/android-rxjava.html)
+ [RxSwift概念讲解](http://www.psvmc.cn/ios-rxswift-01.html)