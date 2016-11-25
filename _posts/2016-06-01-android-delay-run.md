---

layout: post
title: Android中延时任务与定时任务
description: Android中延时任务与定时任务
keywords: android
category: android

---

## 延时任务

### 新线程延迟通知主线程

```java
Handler myHandler = new Handler() {
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case 0:
                mSwipeLayout.autoRefresh();
                break;
        }
        super.handleMessage(msg);
    }
};
new Thread(new Runnable() {
    public void run() {
        try {
            Thread.sleep(300);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        Message message = new Message();
        message.what = 0;
        myHandler.sendMessage(message); //告诉主线程执行任务
    }
}).start();
```

### 利用定时器TimerTask

```java
TimerTask task = new TimerTask(){   
    public void run(){   
    //execute the task 
    }   
};
Timer timer = new Timer(); 
timer.schedule(task, delay); 
```

### Handler + postDelayed

```java
new Handler().postDelayed(new Runnable(){  
    public void run() {  
    //execute the task
    }  
}, delay); 
```

### Handler + Message + sendMessageAtTime

```java
Handler myHandler = new Handler() {
    public void handleMessage(Message msg) {
        switch (msg.what) {
            case 0:
                mSwipeLayout.autoRefresh();
                break;
        }
        super.handleMessage(msg);
    }
};

//发送消息
Message message = new Message();
message.what = 0;
myHandler.sendMessageAtTime(message, SystemClock.uptimeMillis() + 600);
```

### Rxjava实现方式

需要的库

```
compile 'io.reactivex:rxjava:1.2.0'
compile 'io.reactivex:rxandroid:1.2.1'
compile 'com.trello:rxlifecycle:0.4.0'
compile 'com.trello:rxlifecycle-components:0.4.0'
```

`Activity`要继承`RxAppCompatActivity`

调用方式

```java
Observable.timer(300 , TimeUnit.MILLISECONDS)
     .observeOn(AndroidSchedulers.mainThread())
     .compose(this.<Long>bindToLifecycle())
     .subscribe(new Action1<Long>() {
         @Override
         public void call(Long aLong) {

         }
     });
```

## 定时任务

定时任务的方式和上面的方式基本差不多

### 新线程延迟通知主线程

```java
Handler handler = new Handler() {
   public void handleMessage(Message msg) {
       // 要做的事情
       super.handleMessage(msg);
   }
};
```

```java
public class MyThread implements Runnable {
   @Override
   public void run() {
       while (true) {
           try {
               Thread.sleep(1000);// 线程暂停1秒，单位毫秒
               Message message = new Message();
               message.what = 1;
               handler.sendMessage(message);// 发送消息
           } catch (InterruptedException e) {

           }
       }
   }
}
```

开始定时任务

```java
Thread myThread = new Thread(new MyThread());
myThread.start();
```

取消定时任务

```java
myThread.interrupt();
try {
  myThread.join();
} catch (InterruptedException e) {
}
```

### 利用定时器TimerTask


```java
private final Timer timer = new Timer();  
private TimerTask task;  
Handler handler = new Handler() {  
    @Override  
    public void handleMessage(Message msg) {  
        // TODO Auto-generated method stub  
        // 要做的事情  
        super.handleMessage(msg);  
    }  
};  
```

初始化

```java
task = new TimerTask() {  
    @Override  
    public void run() {  
        // TODO Auto-generated method stub  
        Message message = new Message();  
        message.what = 1;  
        handler.sendMessage(message);  
    }  
}; 
```

开始定时任务

```java
timer.schedule(task, 2000, 2000);
```

取消定时任务

```java
timer.cancel(); 
```


### 采用Handler的postDelayed(Runnable,long)方法

```java
Handler handler=new Handler();  
Runnable runnable=new Runnable() {  
    @Override  
    public void run() {  
        //要做的事情  
        handler.postDelayed(this, 2000);  
    }  
}; 
```

开始定时任务

```java
handler.postDelayed(runnable, 2000);//每两秒执行一次runnable.
```

取消定时任务

```java
handler.removeCallbacks(runnable);
```


## AlarmManager

利用`AlarmManager`，特定时刻广播指定意图，一般的简单任务不这么做

 `AndroidL`开始`repeat`的周期必须`大于60秒` 所以`短周期循环`执行`不建议使用`