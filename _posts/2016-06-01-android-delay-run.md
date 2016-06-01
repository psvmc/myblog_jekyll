---

layout: post
title: Android中延迟执行某个任务
description: Android中延迟执行某个任务
keywords: android
category: android

---

## 新线程延迟通知主线程

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

## 利用定时器

```java
TimerTask task = new TimerTask(){   
    public void run(){   
    //execute the task 
    }   
};
Timer timer = new Timer(); 
timer.schedule(task, delay); 
```

## handler + postDelayed

```java
new Handler().postDelayed(new Runnable(){  
    public void run() {  
    //execute the task
    }  
}, delay); 
```

## 其它

利用`AlarmManager`，特定时刻广播指定意图，一般的简单任务不这么做

