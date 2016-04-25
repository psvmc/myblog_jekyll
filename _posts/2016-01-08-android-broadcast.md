---

layout: post
title: android广播
description: android广播
keywords: android
category: android

---

### 简介

android广播其实上是`发布－订阅模型`，发布有两种方式，订阅也有两种方式  
发布的两种方式是`无序方式(普通广播)`和`有序方式(有序广播)`  
订阅的两种方式是`静态订阅`和`动态订阅`

### 发布的两种方式

#### 无序方式(普通广播)

```java
Intent intent = new Intent("cn.psvmc.broadcast");  
sendBroadcast(intent,null); 
```

#### 有序方式(有序广播)

```java
Intent intent = new Intent("cn.psvmc.broadcast");  
sendOrderedBroadcast(intent, null); 
```

### 订阅的两种方式

#### 静态订阅

`静态订阅广播`又叫：`常驻型广播`，当你的`应用程序关闭`了，如果有广播信息来，你写的`广播接收器同样的能接收到`，他的注册方式就是在你的应用程序中的`AndroidManifast.xml`进行订阅的。

定义广播的接受者

```java
import android.content.BroadcastReceiver;  
import android.content.Context;  
import android.content.Intent;  
import android.util.Log;  
  
/** 
 * 广播接收者 
 * 
 */  
public class MyBroadcastReceiver extends BroadcastReceiver {  
  
    @Override  
    public void onReceive(Context context, Intent intent) {  
        Log.e("Intent_Action:",intent.getAction()+"");  
    }  
  
}  
```

`AndroidManifast.xml`中注册广播

`无序`的这样写

```
<receiver android:name=".MyBroadcastReceiver">  
    <intent-filter >  
        <action android:name="cn.psvmc.broadcast"/>  
    </intent-filter>  
</receiver> 
```

`有序`的这样写

```
<receiver android:name=".MyBroadcastReceiver">  
    <intent-filter android:priority="999">  
        <action android:name="cn.psvmc.broadcast"/>  
    </intent-filter>  
</receiver> 
```

其中`android:priority="999"`越大  就越早收到广播   
有序广播可以终止，无序广播不能终止，终止方法如下

```
abortBroadcast();
```

文中`cn.psvmc.broadcast`可以随便写，只要不重复就行了

#### 动态订阅

`动态订阅广播`又叫：`非常驻型广播`，当应用程序结束了，广播自然就没有了，比如你在activity中的`onCreate`或者`onResume`中`订阅广播`，同时你必须在`onDestory`或者`onPause`中`取消广播订阅`。不然会报异常，这样你的广播接收器就一个非常驻型的了。

> 这里面还有一个细节那就是这两种订阅方式，在发送广播的时候需要注意的是：`动态注册`的时候使用的是`隐式intent`方式的，所以在发送广播的时候需要使用`隐式Intent`去发送，不然是广播接收者是接收不到广播的，这一点要注意。但是`静态订阅`的时候，因为在AndroidMainfest.xml中订阅的，所以在发送广播的时候使用`显式Intent`和`隐式Intent`都可以(当然这个只针对于我们自己定义的广播接收者)，所以以防万一，我们一般都采用`隐式Intent`去发送广播。

上面提到了`显式Intent`和`隐式Intent`，他们的区别一会在说

```java
public class MainActivity extends Activity {
    private BroadcastReceiver receiver;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
    }

    @Override
    protected void onResume() {
        super.onResume();
        //创建动态订阅
        IntentFilter filter = new IntentFilter("cn.psvmc.broadcast");
        receiver = new BroadcastReceiver() {
            @Override
            public void onReceive(Context context, Intent intent) {
                //刷新UI操作
            }
        };
        //注册动态订阅
        registerReceiver(receiver, filter);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        //取消动态订阅
        if(receiver!=null){
            unregisterReceiver(receiver);
        }
    }
}
```

##### 相关介绍

`A页面`跳到`B页面` `B页面`关闭后`刷新``A页面`的两种方式

```
1) 重写 onResume()方法。
2) 在B页面发送一个广播,在A页面注册一个接收器,接受你发送的广播,进行处理。
```

##### 显式Intent & 隐式Intent

显式Intent

```java
Intent it = new Intent(MainActivity.this,SecondActivity.class);
startActivity(it);
```

隐式Intent

```java
// 隐式Intent
Intent it = new Intent();  
//设置Intent的Action属性  
it.setAction("cn.psvmc.broadcast");  
// 启动Activity  
startActivity(it);
```

这样由于没有指定`目标Avtivity`，所以`AndroidManifast.xml`要这样配置

```
<activity android:name=".SecondActivity" >                 
    <intent-filter>   
        <action  android:name = "cn.psvmc.broadcast"  />   
        <category android:name = "android.intent.category.DEFAULT"  />   
     </intent-filter>       
</activity> 
```

### 广播的常用方式

一个比较常见的例子就是自动读取短信验证码／短信拦截

系统在收到短信的时候，会发送一个：`android.provider.Telephony.SMS_RECEIVED`这样的广播，而且这是一个`有序的广播`，所以我们就可以拦截了这条短信，因为系统中的短信接收者的订阅优先级不是1000最高的，所以我们可以自己定义一个短信接收者，将`订阅优先级设置成1000`，这样我们就可以最先获取到短信内容，然后终止广播。让系统接收不到这条短信。

示例代码

```java
public class SortBroadcastReceiverA extends BroadcastReceiver{  
    @Override  
    public void onReceive(Context context, Intent intent) {  
        //获取短信的相关信息,使用字段pdus  
        Object[] pdus = (Object[]) intent.getExtras().get("pdus");  
        StringBuilder content = new StringBuilder();  
        String receiveTime = "";  
        String senderNumber = "";  
        for(Object p : pdus){  
            byte[] pdu = (byte[]) p;  
            SmsMessage message = SmsMessage.createFromPdu(pdu);  
            content.append(message.getMessageBody());  
            Date date = new Date(message.getTimestampMillis());  
            SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");  
            receiveTime = format.format(date);  
            senderNumber = message.getOriginatingAddress();  
        }  
          
        Log.e("Demo:","上传短信内容是:"+content.toString());  
        Log.e("Demo:","接收短信的时间是"+receiveTime);  
        Log.e("Demo:","发送短信的号码是:"+senderNumber);    
    }
}  
```

所需权限

```
<uses-permission android:name="android.permission.RECEIVE_SMS"/>  
<uses-permission android:name="android.permission.INTERNET"/> 
```
