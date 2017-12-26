---

layout: post
title: Android 中 RxJava 的实际使用
description: Android 中 RxJava 的实际使用
keywords: rxjava
categories: 
        - android
        - rxjava

---

## 库

[`Android 中 RxJava 的使用`](http://www.psvmc.cn/android-rxjava.html)

Rx相关依赖

```
//网络请求与Rx
compile 'io.reactivex:rxjava:1.2.0'
compile 'io.reactivex:rxandroid:1.2.1'
compile 'com.trello:rxlifecycle:0.4.0'
compile ('com.trello:rxlifecycle-components:0.4.0'){
    exclude group: 'com.android.support', module: 'appcompat-v7'
}
//事件总线
compile 'com.hwangjr.rxbus:rxbus:1.0.5'
//http请求
compile 'com.lzy.net:okrx:0.1.0'
```

涉及的库

+ [https://github.com/ReactiveX/RxJava](https://github.com/ReactiveX/RxJava) ——RxJava核心库
+ [https://github.com/ReactiveX/RxAndroid](https://github.com/ReactiveX/RxAndroid) ——RxJava在Android中使用的扩展库
+ [https://github.com/JakeWharton/RxBinding](https://github.com/JakeWharton/RxBinding) ——Android控件对RxJava的支持库
+ [https://github.com/f2prateek/rx-preferences](https://github.com/f2prateek/rx-preferences) ——使SharedPreferences支持 RxJava
+ [https://github.com/trello/RxLifecycle](https://github.com/trello/RxLifecycle) ——帮助RxJava在Android中生命周期的控制，避免内存溢出等问题
+ [https://github.com/square/retrofit](https://github.com/square/retrofit) ——Retrofit Http请求
+ [https://github.com/pushtorefresh/storio](https://github.com/pushtorefresh/storio) ——数据库对RxJava的支持

## 防止View点击多次

`throttleFirst`操作符：仅发送指定时间段内的第一个信号

```java
RxView.clicks(btn_click)
        .throttleFirst(3, TimeUnit.SECONDS)
        .subscribe(new Action1<Void>() {
            @Override
            public void call(Void aVoid) {
                Toast.makeText(getActivity(), "我被点击了", Toast.LENGTH_SHORT).show();
            }
        });
```

## 搜索时防止短时内调用多次

```java
RxTextView.textChanges(etKey)
    .debounce(400, TimeUnit.MILLISECONDS, AndroidSchedulers.mainThread())
    .subscribeOn(AndroidSchedulers.mainThread())// 对etKey[EditText]的监听操作 需要在主线程操作
    //对用户输入的关键字进行过滤
    .filter(new Func1<CharSequence, Boolean>() {
        @Override
        public Boolean call(CharSequence charSequence) {
            Log.d("RxJava", "filter is main thread : " + (Looper.getMainLooper() == Looper.myLooper()));
            return charSequence.toString().trim().length() > 0;
        }
    })
    .flatMap(new Func1<CharSequence, Observable<List<String>>>() {
        @Override
        public Observable<List<String>> call(CharSequence charSequence) {
            return searchApi.search(charSequence.toString());
        }
    })
    .subscribeOn(Schedulers.io())
    .observeOn(AndroidSchedulers.mainThread())
    .subscribe(new Action1<List<String>>() {
        @Override
        public void call(List<String> strings) {
            tvContent.setText("search result:\n\n");
            tvContent.append(strings.toString());
        }
    }, new Action1<Throwable>() {
        @Override
        public void call(Throwable throwable) {
            throwable.printStackTrace();
            tvContent.append("Error:" + throwable.getMessage());
        }
    });
```

## 监听CheckBox状态变化

在用户登录界面时，如果用户未勾选同意用户协议，不允许登录

```java
RxCompoundButton.checkedChanges(checkBox2)
        .subscribe(new Action1<Boolean>() {
            @Override
            public void call(Boolean aBoolean) {
                btn_login.setClickable(aBoolean);
                
            }
        });
```

## 延迟执行

```java
Observable.timer(3000 , TimeUnit.MILLISECONDS)
        .observeOn(AndroidSchedulers.mainThread())
        .compose(this.<Long>bindToLifecycle())
        .subscribe(new Action1<Long>() {
			@Override
				public void call(Long aLong) {
				}
        });
```


## 循环执行

```java
//延时3000,每间隔3000,时间单位
Observable.interval(3000, 3000, TimeUnit.MILLISECONDS)
.compose(this.<Long>bindToLifecycle())
        .observeOn(AndroidSchedulers.mainThread())
        .subscribe(new Action1<Long>() {
            @Override
            public void call(Long aLong) {

            }
        });
```

## 分线程操作

```java
Observable
.create(new Observable.OnSubscribe<List<ZJArticle>>() {
    @Override
    public void call(Subscriber<? super List<ZJArticle>> subscriber) {
    	//耗时的操作 如查询数据库 访问接口数据 压缩图片等
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
