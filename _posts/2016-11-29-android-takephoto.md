---

layout: post
title: Android 拍照 与 相册选择图片
description: Android 拍照 与 相册选择图片
keywords: android
categories: android

---


## 拍照

```java
private static final int TAKE_PICTURE = 0;

void takePhotoClick() {
   if (Build.VERSION.SDK_INT >= 23) {
       requestPermissions(new String[]{Manifest.permission.CAMERA}, REQUEST_CODE_ASK_PERMISSIONS);
   } else {
       startActivityForResult(new Intent("android.media.action.IMAGE_CAPTURE"), TAKE_PICTURE);
   }
}

@Override
public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
   switch (requestCode) {
       case REQUEST_CODE_ASK_PERMISSIONS:
           if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
               startActivityForResult(new Intent("android.media.action.IMAGE_CAPTURE"), TAKE_PICTURE);
           } else {
               // 没有打开相机的权限
               Toast.makeText(TakePhotoActivity.this, "没有打开照相机权限", Toast.LENGTH_SHORT).show();
           }
           break;
       default:
           super.onRequestPermissionsResult(requestCode, permissions, grantResults);
   }
}
```

回调

```java
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
   if (requestCode == TAKE_PICTURE && resultCode == RESULT_OK && null != data) {
       String sdState = Environment.getExternalStorageState();
       if (!sdState.equals(Environment.MEDIA_MOUNTED)) {
           return;
       }
       String name = DateFormat.format("yyyyMMdd_hhmmss", Calendar.getInstance(Locale.CHINA)) + ".jpg";
       Bundle bundle = data.getExtras();
       //获取相机返回的数据，并转换为图片格式
       Bitmap bitmap = (Bitmap) bundle.get("data");
       FileOutputStream fout = null;
       File file = new File("/sdcard/pics/");
       file.mkdirs();
       String filename = file.getPath() + name;
       try {
           fout = new FileOutputStream(filename);
           bitmap.compress(Bitmap.CompressFormat.JPEG, 80, fout);
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
       //显示图片
   }
}
```

## 选取相册图片

```java
private static final int IMAGE = 1;
void choose_photo_layout_click() {
   //调用相册
   Intent intent = new Intent(Intent.ACTION_PICK,
           android.provider.MediaStore.Images.Media.EXTERNAL_CONTENT_URI);
   startActivityForResult(intent, IMAGE);
}
```

回调

```java
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
   super.onActivityResult(requestCode, resultCode, data);
   //获取图片路径
   if (requestCode == IMAGE && resultCode == Activity.RESULT_OK && data != null) {
       Uri selectedImage = data.getData();
       String[] filePathColumns = {MediaStore.Images.Media.DATA};
       Cursor c = getContentResolver().query(selectedImage, filePathColumns, null, null, null);
       c.moveToFirst();
       int columnIndex = c.getColumnIndex(filePathColumns[0]);
       String imagePath = c.getString(columnIndex);
       showImage(imagePath);
       c.close();
   }
}

//加载图片
private void showImage(String imaePath){
   Bitmap bm = BitmapFactory.decodeFile(imaePath);

}
```

