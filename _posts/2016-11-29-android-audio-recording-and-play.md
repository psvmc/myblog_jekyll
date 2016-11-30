---

layout: post
title: Android 音频录制与播放
description: Android 音频录制与播放
keywords: android
categories: android

---


## 音频录制

录制

```java
private MediaRecorder mMediaRecorder;
private void startRecord(){
   if (mMediaRecorder == null){
       mMediaRecorder = new MediaRecorder();
       mMediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
       mMediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_NB);
       mMediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.DEFAULT);
       File file = new File(Environment.getExternalStorageDirectory().getPath(), "hello.log");
       if (!file.exists()) {
           try {
               file.createNewFile();
           } catch (IOException e) {
               e.printStackTrace();
           }
       }
       mMediaRecorder.setOutputFile(file.getAbsolutePath());
       mMediaRecorder.setMaxDuration(1000 * 60 * 10);
       try {
           mMediaRecorder.prepare();
       } catch (IOException e) {
           e.printStackTrace();
       }
       mMediaRecorder.start();
   }
   
   handler.postDelayed(runnable, 200);
}
```

停止录制

```java
private void stopRecord(){
   handler.removeCallbacks(runnable);
   mMediaRecorder.stop();
   mMediaRecorder.release();
   mMediaRecorder = null;
}
```

每200毫秒反复调用 获取声音大小

```java
Handler handler=new Handler();
Runnable runnable=new Runnable() {
   @Override
   public void run() {
       //要做的事情
       if(mMediaRecorder==null) return;
       double ratio = (double) mMediaRecorder.getMaxAmplitude() / 100;
       double db = 0;// 分贝
       //默认的最大音量是100,可以修改，但其实默认的，在测试过程中就有不错的表现
       //你可以传自定义的数字进去，但需要在一定的范围内，比如0-200，就需要在xml文件中配置maxVolume
       //同时，也可以配置灵敏度sensibility
       if (ratio > 1)
           db = 30 * Math.log10(ratio);
        //设置声波大小
       soundWaveViewLeft.setVolume((float)db);
       soundWaveViewRight.setVolume((float)db);
       //只要有一个线程，不断调用这个方法，就可以使波形变化
       //主要，这个方法必须在ui线程中调用
       handler.postDelayed(this, 200);
   }
};
```

## 音频播放

### 1、从资源文件中播放

```java
MediaPlayer   player  =   new MediaPlayer.create(this,R.raw.test);
player.start();
```

### 2、从文件系统播放

```java
MediaPlayer player = new MediaPlayer();
String path = "/sdcard/test.mp3";
player.setDataSource(path);
player.prepare();
player.start();
```

### 3、从网络播放

(1)通过URI的方式:

```java
String path="http://**************.mp3";     //这里给一个歌曲的网络地址就行了
Uri  uri  =  Uri.parse(path);
MediaPlayer player = new MediaPlayer.create(this,uri);
player.start();
```

(2)通过设置数据源的方式：

```java
MediaPlayer player = new MediaPlayer.create();
String path="http://**************.mp3";          //这里给一个歌曲的网络地址就行了
player.setDataSource(path);
player.prepare();
player.start();
```

