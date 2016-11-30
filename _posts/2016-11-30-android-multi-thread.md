---

layout: post
title: Android 多线程的几种方式
description: Android 多线程的几种方式
keywords: android
categories: android

---


## 传统方式 ★

```java
new Thread() {
  @Override
  public void run() {
      super.run();
      //分线程操作
      //...
      runOnUiThread(new Runnable() {
          @Override
          public void run() {
              //主线程操作
              //...
          }
      });
  }
}.start();
```

## AsnyncTask ★★

```java
new AsyncTask<String, String, String>() {

  //doInBackground之前掉用
  @Override
  protected void onPreExecute() {
      super.onPreExecute();
      
  }

  @Override
  protected String doInBackground(String... params) {
      return null;
  }

  //doInBackground之后掉用
  @Override
  protected void onPostExecute(String s) {
      super.onPostExecute(s);
  }
}.execute("传入的参数");
```

### 参数类型

`AsyncTask<>`的参数类型由用户设定，这里设为三个String

+ 第一个String代表输入到任务的参数类型，也即是`execute()`的`参数`类型 和 `doInBackground()`的`参数`类型
+ 第二个String代表处理过程中的参数类型，也就是`doInBackground()`执行过程中的产出参数类型，通过`publishProgress()`发消息
传递给`onProgressUpdate()`作为参数 一般用来更新进度条
+ 第三个String代表任务结束的产出类型，也就是`doInBackground()`的返回值类型，和`onPostExecute()`的参数类型

### 注意点

AsyncTask使用过程中需要注意的地方不少：

+ 1) 由于Handler需要和主线程交互，而Handler又是内置于AsnycTask中的，所以，`AsyncTask`的创建必须在`主线程`。

+ 2) AsyncTask的`doInBackground(mParams)`方法执行异步任务运行在子线程中，其他方法运行在主线程中，可以操作UI组件。

+ 3) 不要手动的去调用AsyncTask的`onPreExecute`, `doInBackground`,  `onProgressUpdate`, `onPostExecute`方法，这些都是由Android系统自动调用的一个任务AsyncTask任务只能被执行一次。

+ 4) 运行中可以随时调用`cancel(boolean)`方法取消任务，如果成功调用`isCancelled()`会返回`true`，并且不会执行`onPostExecute()` 方法了，取而代之的是调用 `onCancelled()` 方法。而且从源码看，如果这个任务已经执行了这个时候调用`cancel`是不会真正的把`task`结束，而是继续执行，只不过改变的是执行之后的回调方法是`onPostExecute`还是`onCancelled`。


如果您的App没有明确`指定屏幕方向`和`configChanges`时，当用户`旋转屏幕`的时候`Activity就会重新启动`，而这个时候您的异步加载数据的线程可能正在请求网络。当一个新的Activity被重新创建之后，就又重新启动了一个新的任务去请求网络，这样之前的一个异步任务不经意间就泄露了，假设你还在`onPostExecute`写了一些其他逻辑，这个时候就会发生意想不到异常。

一般简单的数据类型的，对付`configChanges`我们很好处理，我们直接可以通过`onSaveInstanceState()`和`onRestoreInstanceState()`进行保存与恢复。  
 Android会在销毁你的Activity之前调用`onSaveInstanceState()`方法，于是，你可以在此方法中存储关于应用状态的数据。  
然后你可以在`onCreate()`或`onRestoreInstanceState()`方法中恢复。

但是，对于AsyncTask怎么办？问题产生的根源在于Activity销毁重新创建的过程中`AsyncTask`和之前的`Activity`失联，最终导致一些问题。那么解决问题的思路也可以朝着这个方向发展   可以用下面的两种方式

## 事件总线(EventBus) ★★★

使用方法参考[`Android中RxBus的使用`](http://www.psvmc.cn/android-rxbus.html)

## RxJava&RxAndroid ★★★★

```java
// 使用IO线程处理, 主线程响应
Observable<String> observable = Observable.create(new Observable.OnSubscribe<String>() {
  @Override
  public void call(Subscriber<? super String> subscriber) {
      subscriber.onNext("分线程处理返回的数据");
      subscriber.onCompleted();
  }
}).subscribeOn(Schedulers.io()).observeOn(AndroidSchedulers.mainThread());
observable.subscribe(new Subscriber<String>() {
  @Override
  public void onCompleted() {
      
  }

  @Override
  public void onError(Throwable e) {

  }

  @Override
  public void onNext(String s) {
      
  }
});
```

Activity销毁时取消订阅

```java
@Override
protected void onDestroy() {
   super.onDestroy();
   //取消订阅
   if ( observable != null ){
       observable.unsubscribeOn(AndroidSchedulers.mainThread());
   }
}
```

总的来说现在`Rx`越来越流行了  推荐新项目都用上`Rx`