---
layout: post
title: Android 中 RxJava2 的实际使用
description: Android 中 RxJava2 的实际使用
keywords: rxjava
categories: 
        - android
        - rxjava

---

## 库

[`Android 中 RxJava 的使用`](http://www.psvmc.cn/article/android-rxjava.html)

Rx相关依赖

```bash
implementation 'io.reactivex.rxjava2:rxandroid:2.0.2'
implementation 'io.reactivex.rxjava2:rxjava:2.1.10'
implementation 'com.jakewharton.rxbinding2:rxbinding:2.1.1'
implementation 'com.trello.rxlifecycle2:rxlifecycle:2.2.1'
implementation 'com.trello.rxlifecycle2:rxlifecycle-components:2.2.1'
//事件总线
implementation 'com.hwangjr.rxbus:rxbus:2.0.0'
//网络请求库
implementation 'com.lzy.net:okgo:3.0.4'
implementation 'com.lzy.net:okrx2:2.0.2'
//JSON转换
implementation 'com.alibaba:fastjson:1.2.46'
```

Rx相关的库

+ [https://github.com/ReactiveX/RxJava](https://github.com/ReactiveX/RxJava) ——RxJava核心库
+ [https://github.com/ReactiveX/RxAndroid](https://github.com/ReactiveX/RxAndroid) ——RxJava在Android中使用的扩展库
+ [https://github.com/JakeWharton/RxBinding](https://github.com/JakeWharton/RxBinding) ——Android控件对RxJava的支持库
+ [https://github.com/trello/RxLifecycle](https://github.com/trello/RxLifecycle) ——帮助RxJava在Android中生命周期的控制，避免内存溢出等问题
+ [https://github.com/pushtorefresh/storio](https://github.com/pushtorefresh/storio) ——数据库对RxJava的支持
+ [https://github.com/f2prateek/rx-preferences](https://github.com/f2prateek/rx-preferences) ——使SharedPreferences支持 RxJava

## 防止View点击多次

`throttleFirst`操作符：仅发送指定时间段内的第一个信号

`throttleLast`操作符：仅发送指定时间段内的第一个信号

`Java`

```java
//1.对于button的防抖处理 2秒内只截取第一次的点击事件，还有一个截取最后一次的方法
//throttleFirst(2, TimeUnit.SECONDS) 截取第一个事件
//throttleWithTimeout(2,TimeUnit.SECONDS) 事件延迟两秒执行
RxView.clicks(register_button)
    .throttleLast(2, TimeUnit.SECONDS)
    .subscribeOn(AndroidSchedulers.mainThread())
    .subscribe(new Observer() {
        @Override
        public void onNext(@NonNull Object o) {
            Log.e("收到点击事件","==="+System.currentTimeMillis());
        }

        @Override
        public void onError(@NonNull Throwable e) {

        }

        @Override
        public void onComplete() {

        }

        @Override
        public void onSubscribe(@NonNull Disposable d) {

        }
    });
```



`Kotlin`(顺序和上面的Java一样)

```kotlin
RxView.clicks(register_button)
    .throttleLast(2, TimeUnit.SECONDS)
    .subscribeOn(AndroidSchedulers.mainThread())
    .subscribe({

    }, {

    }, {

    }, {

    })
```



## 倒计时(用RxBinding)

`Java`

```java
//按钮实现倒计时，屏蔽点击事件+定时
RxView.clicks(button)
    .subscribeOn(AndroidSchedulers.mainThread())
    .throttleFirst(60, TimeUnit.SECONDS)//60S后可以再次发送
    .subscribe(new Observer() {
        @Override
        public void onSubscribe(@NonNull Disposable d) {

        }

        @Override
        public void onNext(@NonNull Object o) {
            Observable.interval(1, TimeUnit.SECONDS, AndroidSchedulers.mainThread())
                    .take(60)
                    .subscribe(new Observer<Long>() {

                        @Override
                        public void onSubscribe(@NonNull Disposable d) {

                        }

                        @Override
                        public void onNext(@NonNull Long aLong) {
                            button.setText(60 - aLong + "S后可发送");
                        }

                        @Override
                        public void onError(@NonNull Throwable e) {

                        }

                        @Override
                        public void onComplete() {
                            button.setText("发送验证码");
                        }
                    });
        }

        @Override
        public void onError(@NonNull Throwable e) {

        }

        @Override
        public void onComplete() {

        }
    });
```

`Kotlin`

```java
RxView.clicks(register_button)
    .subscribeOn(AndroidSchedulers.mainThread())
    .throttleFirst(60, TimeUnit.SECONDS)//60S后可以再次发送
    .subscribe {
        Observable
            .interval(1,TimeUnit.SECONDS,AndroidSchedulers.mainThread())
            .take(60)
            .subscribe({
                register_button.text =  "${60 - it.toInt()}S后可发送"
            },{

            },{
                register_button.text = "发送验证码"
            })
    }
```

## 倒计时(未用RxBinding)

`Java`

```java
import java.util.concurrent.TimeUnit;

import io.reactivex.Observable;
import io.reactivex.android.schedulers.AndroidSchedulers;
import io.reactivex.functions.Function;

public class RxCountDown {
    public static Observable<Integer> countdown(int time) {
        if (time < 0) time = 0;
        final int countTime = time;
        return Observable.interval(0, 1, TimeUnit.SECONDS)
            .subscribeOn(AndroidSchedulers.mainThread())
            .observeOn(AndroidSchedulers.mainThread())
            .map(new Function<Long, Integer>() {
                @Override
                public Integer apply(Long aLong) throws Exception {
                    return countTime - aLong.intValue();
                }
            })
            .take(countTime + 1);
    }
}
```

调用方式(`Kotlin`)

```kotlin
//倒计时
RxCountDown.countdown(60)
    .doOnSubscribe {
        valicode_button.isEnabled = false
    }
    .subscribe({
        valicode_button.setText("(${it})秒后重发")
    }, {

    }, {
        valicode_button.isEnabled = true
        valicode_button.text = "获取"
    })
```



## 防止重复调用

`Java`

```java
RxTextView.textChanges(username_edittext)
    .debounce(400, TimeUnit.MILLISECONDS, AndroidSchedulers.mainThread())
    .filter(new Predicate<CharSequence>() {
        @Override
        public boolean test(CharSequence charSequence) throws Exception {
            return charSequence.toString().trim().length()>0;
        }
    })
    .flatMap(new Function<CharSequence, ObservableSource<char[]>>() {
        private Subject<char[]> s = PublishSubject.create();
        @Override
        public ObservableSource<char[]> apply(CharSequence charSequence) throws Exception {
            char[] cahrs= charSequence.toString().toLowerCase().toCharArray();
            s.onNext(cahrs);
            return s;
        }
    })
.subscribeOn(Schedulers.io())
.observeOn(AndroidSchedulers.mainThread())
.subscribe(new Observer<char[]>() {
    @Override
    public void onSubscribe(Disposable d) {

    }

    @Override
    public void onNext(char[] chars) {

    }

    @Override
    public void onError(Throwable e) {

    }

    @Override
    public void onComplete() {

    }
});
```



## 延迟执行

`Java`

```java
Observable.timer(3, TimeUnit.SECONDS)
    .compose(this.<Long>bindToLifecycle())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(new Observer<Long>() {
        @Override
        public void onSubscribe(Disposable d) {

        }

        @Override
        public void onNext(Long aLong) {

        }

        @Override
        public void onError(Throwable e) {

        }

        @Override
        public void onComplete() {

        }
    });
```

## 循环执行

`Java`

```java
//延时3s,每间隔3s,时间单位s
Observable.interval(3,3,TimeUnit.SECONDS)
    .compose(this.<Long>bindToLifecycle())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(new Consumer<Long>() {
        @Override
        public void accept(Long aLong) throws Exception {

        }
    });
```

## 分线程操作

`Java`

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
