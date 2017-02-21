---

layout: post
title: Android Amr的录制与播放
description: Android Amr的录制与播放
keywords: android
categories: android

---

## Amr录制并获取声音大小

### 定义对象

```java
private MediaRecorder mMediaRecorder;
Handler handler = new Handler();
Runnable runnable = new Runnable() {
    @Override
    public void run() {
        //要做的事情
        if (mMediaRecorder == null) return;
        double ratio = (double) mMediaRecorder.getMaxAmplitude() / 100;
        double db = 0;// 分贝
        //默认的最大音量是100,可以修改，但其实默认的，在测试过程中就有不错的表现
        //你可以传自定义的数字进去，但需要在一定的范围内，比如0-200，就需要在xml文件中配置maxVolume
        //同时，也可以配置灵敏度sensibility
        if (ratio > 1)
            db = 30 * Math.log10(ratio);
        
        //获取音量大小
        
        //只要有一个线程，不断调用这个方法，就可以使波形变化
        //主要，这个方法必须在ui线程中调用
        handler.postDelayed(this, 200);
    }
};
```

### 开始录制

```java
private void startRecord() {
    if (mMediaRecorder == null) {
        mMediaRecorder = new MediaRecorder();
        mMediaRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
        mMediaRecorder.setOutputFormat(MediaRecorder.OutputFormat.AMR_NB);
        mMediaRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.DEFAULT);
        File file = new File(amrPath);
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

	//每200毫秒获取声音大小
    handler.postDelayed(runnable, 200);
}
```

### 停止录制

```java
private void stopRecord() {
    handler.removeCallbacks(runnable);
    mMediaRecorder.stop();
    mMediaRecorder.release();
    mMediaRecorder = null;
}
```


## Amr播放

### 定义对象

```java
private MediaPlayer mPlayer = null;
String basePath = Environment.getExternalStorageDirectory().getAbsolutePath()+ File.separator + "caiyun" + File.separator;
String amrPath = basePath+"temp.amr";
```

### 播放

```java
void playVoice(String amrPath) {
    mPlayer = new MediaPlayer();
    mPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
        @Override
        public void onCompletion(MediaPlayer mp) {
            //播放完毕
        }
    });
    try {
        mPlayer.setDataSource(amrPath);
        mPlayer.prepare();
        mPlayer.start();
    } catch (IOException e) {
        Log.i(TAG, "playVoice: ");
    }
}
```

## 获取Amr时长


```java
/**
 * 得到amr的时长
 * @param file
 * @return 毫秒
 * @throws IOException
 */
public static long getAmrDuration(File file) throws IOException {
    long duration = -1;
    int[] packedSize = {12, 13, 15, 17, 19, 20, 26, 31, 5, 0, 0, 0, 0, 0, 0, 0};
    RandomAccessFile randomAccessFile = null;
    try {
        randomAccessFile = new RandomAccessFile(file, "rw");
        long length = file.length();//文件的长度
        int pos = 6;//设置初始位置
        int frameCount = 0;//初始帧数
        int packedPos = -1;
        byte[] datas = new byte[1];//初始数据值
        while (pos <= length) {
            randomAccessFile.seek(pos);
            if (randomAccessFile.read(datas, 0, 1) != 1) {
                duration = length > 0 ? ((length - 6) / 650) : 0;
                break;
            }
            packedPos = (datas[0] >> 3) & 0x0F;
            pos += packedSize[packedPos] + 1;
            frameCount++;
        }
        duration += frameCount * 20;//帧数*20
    } finally {
        if (randomAccessFile != null) {
            randomAccessFile.close();
        }
    }
    return duration;
}
```
