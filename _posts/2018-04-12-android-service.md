---
layout: post
title: Android Service的使用
description: Android Service的使用
keywords: android
categories: 
        - android
	- service

---



## 定义Service



```java
import android.app.Service;
import android.content.Intent;
import android.os.Binder;
import android.os.IBinder;
import android.widget.Toast;

public class PenService extends Service {
    private PenBinder mBinder = new PenBinder();

    public PenService() {
    }

    @Override
    public IBinder onBind(Intent intent) {
        return mBinder;
    }

    public class PenBinder extends Binder {
        /**
         * 虚拟方法，播放音乐
         */
        public void playMusic() {
            Toast.makeText(
                PenService.this,
                "音乐在后台播放",
                Toast.LENGTH_SHORT
            ).show();
        }

    }
}
```

定义的`PenBinder`就是能让Activity和Service交互

## Activity绑定



```java
public class MyApplication extends Application {
    public static Context mContext;

    private PenService.PenBinder penBind;
    private PenConn penConn;

    @Override
    public void onCreate() {
        super.onCreate();
        mContext = getApplicationContext();

        startPenService();
    }

    private void startPenService(){
        if(null == penConn){
            penConn = new PenConn();
        }
        Intent intent = new Intent(this,PenService.class);
        bindService(intent,penConn,BIND_AUTO_CREATE);
    }
    
    private class PenConn implements ServiceConnection {

        @Override
        public void onServiceConnected(ComponentName name, IBinder service) {
            Log.d("bindLog","bind");
            penBind= (PenService.PenBinder) service;
            //调用service的方法
            penBind.playMusic();
        }

        @Override
        public void onServiceDisconnected(ComponentName name) {
            Log.d("bindLog","unbind");
        }
    }
}
```

绑定成功后就会调用`onServiceConnected`