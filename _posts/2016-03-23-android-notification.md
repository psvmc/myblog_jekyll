---

layout: post
title: Android Notification的用法
description: Android Notification的用法
keywords: android
category: android

---

## 旧版本

api11中废弃(Android 3.0)

```java
String service = NOTIFICATION_SERVICE;
nManager = (NotificationManager) this.getSystemService(service);

notification = new Notification();
// 通知提示
String tickerText = "状态栏上显示的消息"; 
// 显示时间
long when = System.currentTimeMillis();
notification.icon = R.drawable.icon;// 设置通知的图标
notification.tickerText = tickerText; // 显示在状态栏中的文字
notification.when = when; // 设置来通知时的时间

notification.ledARGB = 0xff00ff00;
// 点击清除按钮或点击通知后会自动消失
notification.flags |= Notification.FLAG_AUTO_CANCEL;
// 设置默认铃声
notification.defaults = Notification.DEFAULT_SOUND;
// 设置铃声震动
notification.defaults = Notification.DEFAULT_ALL; 

// 单击通知后会跳转到NotificationResult类
Intent intent = new Intent(this,MainActivity.class);
// 获取PendingIntent,点击时发送该Intent
PendingIntent  pIntent = PendingIntent.getActivity(this, 0, intent, 0);
// 设置通知的标题和内容
notification.setLatestEventInfo(this, "消息的标题","消息的内容", pIntent);
// 发出通知
nManager.notify(1, notification);
```

## 新版本

api版本>=16(Android 4.1)

```java
String service = NOTIFICATION_SERVICE;
nManager = (NotificationManager) this.getSystemService(service);
Notification.Builder builder = new Notification.Builder(this);
builder.setTicker("状态栏上显示的消息");
builder.setContentTitle("消息的标题");
builder.setContentText("消息的内容");
builder.setSmallIcon(R.drawable.ic_launcher);
builder.setAutoCancel(true);
builder.setWhen(System.currentTimeMillis());

Intent intent = new Intent(this,MainActivity.class);
PendingIntent pendingIntent = PendingIntent.getActivity(this, 0, intent, PendingIntent.FLAG_CANCEL_CURRENT);
builder.setContentIntent(pendingIntent);

Notification notification = builder.build();
nManager.notify(1, notification);
```