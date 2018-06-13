---
layout: post
title: Android声音和亮度设置
description: Android声音和亮度设置
keywords: android
categories: android

---



## 声音设置

调整手机的各种音量可以通过**AudioManager**这个类来操作

注：安卓手机各种音量的最大数值不一样，请通过下面具体的方法获取最大音量值。

涉及的参数说明： 
 **streamType**类型：（音量类型） 

+ `STREAM_ALARM` 提示音 
+ `STREAM_MUSIC` 音乐音量即多媒体音量 
+ `STREAM_NOTIFICATION` 窗口顶部状态栏Notification, 
+ `STREAM_RING` 铃声 
+ `STREAM_SYSTEM` 系统 
+ `STREAM_VOICE_CALL` 通话 
+ `STREAM_DTMF` 双音多频

不过三方的Rom中 这些类型可能是多对一的 也就是 多种类型调节的是同一种

**flags**参数：（下面是常用的几个） 

+ FLAG_PLAY_SOUND 调整音量时播放声音 
+ FLAG_SHOW_UI 调整时显示系统的音量进度条 
+ 0 表示什么都不做

### 工具类

```java
import android.content.Context;
import android.media.AudioManager;

public class ZJAudioUtil {

    private AudioManager mAudioManager;
    private static ZJAudioUtil mInstance;

    private ZJAudioUtil(Context context) {
        mAudioManager = (AudioManager) context.getSystemService(Context.AUDIO_SERVICE);
    }

    public synchronized static ZJAudioUtil getInstance(Context context) {
        if (mInstance == null) {
            mInstance = new ZJAudioUtil(context);
        }
        return mInstance;
    }

    //获取多媒体最大音量
    public int getMediaMaxVolume() {
        return mAudioManager.getStreamMaxVolume(AudioManager.STREAM_MUSIC);
    }

    //获取多媒体音量
    public int getMediaVolume() {
        return mAudioManager.getStreamVolume(AudioManager.STREAM_MUSIC);
    }

    //获取通话最大音量
    public int getCallMaxVolume() {
        return mAudioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL);
    }

    //获取系统音量最大值
    public int getSystemMaxVolume() {
        return mAudioManager.getStreamMaxVolume(AudioManager.STREAM_SYSTEM);
    }

    //获取系统音量
    public int getSystemVolume() {
        return mAudioManager.getStreamVolume(AudioManager.STREAM_SYSTEM);
    }

    //获取提示音量最大值
    public int getAlermMaxVolume() {
        return mAudioManager.getStreamMaxVolume(AudioManager.STREAM_ALARM);
    }

    /**
     * 设置闹钟音量
     */
    public void setAlermVolume(int volume) {
        mAudioManager.setStreamVolume(
            AudioManager.STREAM_ALARM, //音量类型
            volume,
            AudioManager.FLAG_PLAY_SOUND | AudioManager.FLAG_SHOW_UI
        );
    }


    public void setNoticeVolume(int volume) {
        mAudioManager.setStreamVolume(
            AudioManager.STREAM_RING, //音量类型
            volume,
            AudioManager.FLAG_PLAY_SOUND | AudioManager.FLAG_SHOW_UI
        );
    }


    /**
     * 设置系统音量 铃声
     */
    public void setSystemVolume(int volume) {
        mAudioManager.setStreamVolume(
            AudioManager.STREAM_SYSTEM, //音量类型
            volume,
            AudioManager.FLAG_PLAY_SOUND | AudioManager.FLAG_SHOW_UI
        );
    }

    /**
     * 设置多媒体音量
     */
    public void setMediaVolume(int volume) {
        mAudioManager.setStreamVolume(
            AudioManager.STREAM_MUSIC, //音量类型
            volume,
            AudioManager.FLAG_PLAY_SOUND | AudioManager.FLAG_SHOW_UI
        );
    }

    //设置通话音量
    public void setCallVolume(int volume) {
        mAudioManager.setStreamVolume(
            AudioManager.STREAM_VOICE_CALL,
            volume,
            AudioManager.STREAM_VOICE_CALL);
    }

    // 关闭/打开扬声器播放
    public void setSpeakerStatus(boolean on) {
        if (on) { //扬声器
            mAudioManager.setSpeakerphoneOn(true);
            mAudioManager.setMode(AudioManager.MODE_NORMAL);
        } else {
            // 设置最大音量
            int max = mAudioManager.getStreamMaxVolume(AudioManager.STREAM_VOICE_CALL);
            mAudioManager.setStreamVolume(
                AudioManager.STREAM_VOICE_CALL,
                max,
                AudioManager.STREAM_VOICE_CALL
            );
            // 设置成听筒模式
            mAudioManager.setMode(AudioManager.MODE_IN_COMMUNICATION);
            mAudioManager.setSpeakerphoneOn(false);// 关闭扬声器
            mAudioManager.setRouting(
                AudioManager.MODE_NORMAL,
                AudioManager.ROUTE_EARPIECE,
                AudioManager.ROUTE_ALL
            );
        }
    }
}

```

另外，还有个`public void adjustStreamVolume(int streamType, int direction,  int  flags)`方法也可用来调整音量，

只不过不能设置具体数值，根据系统的阀值来自动调整，其中第1和第3个参数上面有说明，

下面是第2个参数的介绍：

**direction**是调整的方向,增加或减少： 

+ ADJUST_LOWER 降低音量 
+ ADJUST_RAISE 增加音量 
+ ADJUST_SAME 保持不变,这个主要用于向用户展示当前的音量



## 亮度设置

从Android6.0后 应用是不能修改系统屏幕亮度的 所以下面的工具类 一般也用不上 

我们只能修改应用的亮度 方法如下

```kotlin
private fun setWindowBrightness(brightness: Int) {
    val window = window
    val lp = window.attributes
    lp.screenBrightness = brightness / 255.0f
    window.attributes = lp
}
```

但是我们并不能获取应用的亮度 因为 如果系统的亮度设置的是自动 

那么`lp.screenBrightness`或取的值就会是-1  

所以我们要判断系统是否为自动调节亮度 如果是的话  就要获取系统亮度

```java
public int getScreenBrightness() {
    int defVal = 125;
    return Settings.System.getInt(
        contentResolver,
        Settings.System.SCREEN_BRIGHTNESS,
        defVal
    );
}
```



### 工具类

屏幕亮度有两种调节模式：

- Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC：值为1，自动调节亮度。

- Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL：值为0，手动模式。

  

```java
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.media.AudioManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.view.Window;
import android.view.WindowManager;

public class ZJBrightnessUtil {

    private ContentResolver contentResolver;
    private static ZJBrightnessUtil mInstance;
    private Context mContext;

    private ZJBrightnessUtil(Context context) {
        mContext = context;
        contentResolver = context.getContentResolver();
    }

    public synchronized static ZJBrightnessUtil getInstance(Context context) {
        if (mInstance == null) {
            mInstance = new ZJBrightnessUtil(context);
        }
        return mInstance;
    }

    public void setScrennManualMode() {
        try {
            if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (!Settings.System.canWrite(mContext)) {
                    Intent intent = new Intent(
                        android.provider.Settings.ACTION_MANAGE_WRITE_SETTINGS
                    );
                    intent.setData(Uri.parse("package:" + mContext.getPackageName()));
                    intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    mContext.startActivity(intent);
                } else {
                    //有了权限，具体的动作
                    int mode = Settings.System.getInt(
                        contentResolver,
                        Settings.System.SCREEN_BRIGHTNESS_MODE
                    );
                    if (mode == Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC) {
                        Settings.System.putInt(
                            contentResolver,
                            Settings.System.SCREEN_BRIGHTNESS_MODE,
                            Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL
                        );
                    }
                }
            }

        } catch (Settings.SettingNotFoundException e) {
            e.printStackTrace();
        }
    }


    public void setScrennAutoMode() {
        try {
            int mode = Settings.System.getInt(
                contentResolver,
                Settings.System.SCREEN_BRIGHTNESS_MODE
            );
            if (mode == Settings.System.SCREEN_BRIGHTNESS_MODE_MANUAL) {
                Settings.System.putInt(
                    contentResolver,
                    Settings.System.SCREEN_BRIGHTNESS_MODE,
                    Settings.System.SCREEN_BRIGHTNESS_MODE_AUTOMATIC
                );
            }
        } catch (Settings.SettingNotFoundException e) {
            e.printStackTrace();
        }
    }

    public int getScrennMode() {
        try {
            int mode = Settings.System.getInt(
                contentResolver,
                Settings.System.SCREEN_BRIGHTNESS_MODE
            );
            return mode;
        } catch (Settings.SettingNotFoundException e) {
            e.printStackTrace();
        }
        return 0;
    }


    public int getScreenBrightness() {
        int defVal = 125;
        return Settings.System.getInt(
            contentResolver,
            Settings.System.SCREEN_BRIGHTNESS,
            defVal
        );
    }

    public void saveScreenBrightness(int value) {
        setScrennManualMode();
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (!Settings.System.canWrite(mContext)) {
                Intent intent = new Intent(
                    android.provider.Settings.ACTION_MANAGE_WRITE_SETTINGS
                );
                intent.setData(Uri.parse("package:" + mContext.getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                mContext.startActivity(intent);
            } else {
                //有了权限，具体的动作
                Settings.System.putInt(
                    contentResolver,
                    Settings.System.SCREEN_BRIGHTNESS,
                    value
                );
            }
        }else{
            Settings.System.putInt(
                contentResolver,
                Settings.System.SCREEN_BRIGHTNESS,
                value
            );
        }
    }
}
```

