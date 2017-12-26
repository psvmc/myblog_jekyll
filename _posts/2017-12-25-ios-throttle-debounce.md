---

layout: post
title: 开发中使用throttle和debounce
description: 开发中使用throttle和debounce
keywords: ios android js web
categories: 
        - ios
        - android
        - js

---


## 前言

  不管是`WEB`还是`Android`或者是`iOS`开发中 我们都会有这样的问题 

+ 按钮点击时 连续点击只让第一次生效
+ 搜索时文本不断变化导致调用多次接口

上面的两个问题解决后能大大提升用户体验  解决它们就用到了`throttle`和`debounce`

## WEB(JS)

+ [`lodash`](https://lodash.com)[`lodash中文文档`](http://lodashjs.com/docs/)
+ [`Underscore.js`](http://www.css88.com/doc/underscore1.4.2/)
+ [`jQuery throttle/debounce`](http://benalman.com/projects/jquery-throttle-debounce-plugin/)
+ [`RxJS`](https://github.com/Reactive-Extensions/RxJS)


## Android(Java)

主要用到`RxJava`和`RxAndroid`

参见文章:[`Android 中 RxJava 的实际使用`](http://www.psvmc.cn/android-rxjava-2.html)

## iOS(OC/Swift)

+ OC中可以用(Swift不能用)[`MessageThrottle`](https://github.com/yulingtianxia/MessageThrottle)
+ Swift可以用[`RxSwift`](https://github.com/ReactiveX/RxSwift)


根据用户输入的名字变化 更新头像

```swift
_ = self.usernameTextField.rx.text.orEmpty
    .debounce(1.2, scheduler: MainScheduler.instance)
    .distinctUntilChanged()
    .observeOn(MainScheduler.instance)
    .subscribe(onNext: { (query) in
        self.updatePicImageView();
    })
```

  
