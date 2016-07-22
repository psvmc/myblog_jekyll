---

layout: post
title: Android 中 RxBus 的使用
description: 经常我们会有这样的需求，B页面操作后，要求A页面处理相关数据，像这样一般我们都是，要么B页面保留A页面的引用，要么使用广播，但是写起来还是想对麻烦的，用Rxbus就可以很容易和优雅的解决
keywords: rxbus
category: android

---


## 前言

经常我们会有这样的需求，B页面操作后，要求A页面处理相关数据，像这样一般我们都是，要么B页面保留A页面的引用，要么使用广播，但是写起来还是想对麻烦的，用`Rxbus`就可以很容易和优雅的解决  

相同功能的组件用的比较多的有[`Otto`](https://github.com/square/otto)和[`EventBus`](https://github.com/greenrobot/EventBus)  
但是如果我们的项目使用[`Rxjava`](https://github.com/ReactiveX/RxJava)的话 我就比较推荐用[`Rxbus`](https://github.com/AndroidKnife/RxBus)了

## 使用

总的来说 我们要做的无外乎两件事：`发送事件` 和 `接受事件`

但是接受事件的对象一定要先注册到`Rxbus`中

添加引用

```gradle
compile 'com.hwangjr.rxbus:rxbus:1.0.4'
```

### 注册与取消注册

```java
@Override
protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    RxBus.get().register(this);
}

@Override
protected void onDestroy() {
    RxBus.get().unregister(this);
    super.onDestroy();
}
```

### 发送事件

发送事件有两种方式一种为

#### 方式1 自动发送事件

```java
@Produce(
        thread = EventThread.IO,
        tags = {
                @Tag("007")
        }
)
public ArrayList<String> produce02() {
    ArrayList<String> words = new ArrayList<>();
    words.add("好好学习");
    words.add("天天向上");
    return words;
}
```

可以看出我们加了`Produce`注解  
加了这个注解就会在`注册`的时候`发送事件`  
接收方 会根据 设置的`Tag`和返回的`数据类型`来调用相应的方法，于方法名无关  

当然也可以不写`tags`和`thread` 
 
+ 默认`tags`为`rxbus_default_tag`
+ 默认`thread `为`EventThread.MAIN_THREAD`

例如

```java
@Produce
public String produce01() {
    return "页面初始化加载!";
}
```

#### 方式2 手动发送事件

```java
RxBus.get().post("我是新数据");
RxBus.get().post("007","我是新数据(自定义Tag)");
```

### 接受事件

+ 加了`Subscribe `注解  

+ 接受事件的方法也和`方法名无关` 只和`tags`和`传入的参数类型`有关  

+ 需要注意的是数据类型不能为`interface`类型  也就是说数据类型不能像`List<String>`这样，必须为`ArrayList<String>`这样的

+ 如果`tags一样``类型也一样`的多个方法，都会接受到相应的事件

---

默认`tags`和`thread`

```java
@Subscribe
public void subscribe02(String word) {
    Snackbar.make(getWindow().getDecorView(), word, Snackbar.LENGTH_SHORT)
            .setAction("Action", null).show();
}

```

---

自定义`tags`和`thread`

```java
@Subscribe(
        thread = EventThread.MAIN_THREAD,
        tags = {
                @Tag("007")
        }
)
public void subscribe03(ArrayList<String> words) {
    Snackbar.make(getWindow().getDecorView(), words.toString(), Snackbar.LENGTH_SHORT)
            .setAction("Action", null).show();
}
```
