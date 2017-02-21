---

layout: post
title: Android 调用系统相机 返回图片模糊的解决办法
description: Android 调用系统相机 返回图片模糊的解决办法
keywords: android
categories: android

---

## 默认方式(缩略图 图片模糊)

定义全局变量

```java
private static final int CAMERA = 0;
```

调用

```java
//调用相机
Intent camera = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
startActivityForResult(camera, CAMERA);
```

回调

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == CAMERA && resultCode == Activity.RESULT_OK && data != null) {
        String sdState = Environment.getExternalStorageState();
        if (!sdState.equals(Environment.MEDIA_MOUNTED)) {
            return;
        }
        String name = DateFormat.format("yyyyMMdd_hhmmss", Calendar.getInstance(Locale.CHINA)) + ".jpg";
        Bundle bundle = data.getExtras();
        //获取相机返回的数据，并转换为图片格式
        Bitmap bitmap = (Bitmap) bundle.get("data");
        FileOutputStream fout = null;
        String file_path = ApiModel.ZJ_FILE_BASE_PATH + name;
        File file = new File(file_path);
        file.getParentFile().mkdirs();

        try {
            fout = new FileOutputStream(file_path);
            bitmap.compress(Bitmap.CompressFormat.JPEG, 100, fout);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } finally {
            try {
                fout.flush();
                fout.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }
}
```


## 返回原图(解决图片模糊)


定义全局变量

```java
private static final int CAMERA = 0;
String tempImagePath="";
```

调用

```java
//原图
Intent intent2 = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
tempImagePath = ApiModel.ZJ_FILE_BASE_PATH + "tempImage.jpg"; //拍照文件保存路径
intent2.putExtra(MediaStore.EXTRA_OUTPUT, Uri.fromFile(new File(tempImagePath)));
startActivityForResult(intent2, CAMERA);
```

回调

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    if (requestCode == CAMERA && resultCode == Activity.RESULT_OK) {
    String sdState = Environment.getExternalStorageState();
    if (!sdState.equals(Environment.MEDIA_MOUNTED)) {
        return;
    }
    
    //下面是用的Rx在io线程中压缩图片
    Observable
            .create(new Observable.OnSubscribe<String>() {
                @Override
                public void call(Subscriber<? super String> subscriber) {
                    try {
                        String outImagePath = ApiModel.ZJ_FILE_BASE_PATH + "outImage.jpg";
                        ImageUtils.compressAndGenImage(tempImagePath, outImagePath, 100, true);
                        subscriber.onNext(outImagePath);
                        subscriber.onCompleted();
                    } catch (IOException e) {

                    }

                }
            })
            .subscribeOn(Schedulers.io())
            .observeOn(AndroidSchedulers.mainThread())
            .subscribe(new Observer<String>() {
                @Override
                public void onCompleted() {
                }

                @Override
                public void onError(Throwable e) {
                    Log.w(TAG, "onError: " + e.getLocalizedMessage());
                }

                @Override
                public void onNext(String imagePath) {
                    didSendImage(imagePath);

                }
            });
    }

}
```

