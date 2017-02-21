---

layout: post
title: Android Base64编码字符串与文件之间的转化
description: Android Base64编码字符串与文件之间的转化
keywords: android
categories: android

---

## 前言

开发中有时传输图片或音频等文件。我们会采用Base64编码成字符串传输 
那么获取后 就要重新生成文件。

这里我会用到两个工具类 

+ `Base64Utils` 将文件编码为字符串 或 字符串生成文件
+ `MD5Utils` 获取文件的MD5 用于生成文件的名字

## 工具类

### Base64Utils

```java
public class Base64Utils {
    /**
     * encodeBase64File:(将文件转成base64 字符串). <br/>
     *
     * @param path 文件路径
     * @return
     * @throws Exception
     * @since JDK 1.6
     */
    public static String encodeBase64File(String path) throws Exception {
        File file = new File(path);
        FileInputStream inputFile = new FileInputStream(file);
        byte[] buffer = new byte[(int) file.length()];
        inputFile.read(buffer);
        inputFile.close();
        return Base64.encodeToString(buffer, Base64.DEFAULT);
    }

    /**
     * decoderBase64File:(将base64字符解码保存文件). <br/>
     *
     * @param base64Code 编码后的字串
     * @param savePath   文件保存路径
     * @throws Exception
     * @since JDK 1.6
     */
    public static void decoderBase64File(String base64Code, String savePath) throws Exception {
        File file = new File(savePath);
        if (file.isFile() && file.exists()) {
            file.delete();
        }
        byte[] buffer = Base64.decode(base64Code, Base64.DEFAULT);
        FileOutputStream out = new FileOutputStream(savePath);
        out.write(buffer);
        out.close();
    }
}
```

### MD5Utils

```java
public class MD5Utils {

    protected static char hexDigits[] = { '0', '1', '2', '3', '4', '5', '6',  '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };
    protected static MessageDigest messagedigest = null;

    static {
        try {
            messagedigest = MessageDigest.getInstance("MD5");
        } catch (NoSuchAlgorithmException e) {
            System.err.println("MD5FileUtil messagedigest初始化失败");
            e.printStackTrace();
        }
    }

    /**
     * 对文件进行MD5加密
     */
    public static String getFileMD5String(File file) throws IOException {
        FileInputStream in = new FileInputStream(file);
        FileChannel ch = in.getChannel();
        MappedByteBuffer byteBuffer = ch.map(FileChannel.MapMode.READ_ONLY, 0, file.length());
        messagedigest.update(byteBuffer);
        return bufferToHex(messagedigest.digest());
    }

    /**
     * 对字符串进行MD5加密
     */
    public static String getMD5String(String s) {
        return getMD5String(s.getBytes());
    }

    /**
     * 对byte类型的数组进行MD5加密
     */
    public static String getMD5String(byte[] bytes) {
        messagedigest.update(bytes);
        return bufferToHex(messagedigest.digest());
    }

    private static String bufferToHex(byte bytes[]) {
        return bufferToHex(bytes, 0, bytes.length);
    }

    private static String bufferToHex(byte bytes[], int m, int n) {
        StringBuffer stringbuffer = new StringBuffer(2 * n);
        int k = m + n;
        for (int l = m; l < k; l++) {
            char c0 = hexDigits[(bytes[l] & 0xf0) >> 4];
            char c1 = hexDigits[bytes[l] & 0xf];
            stringbuffer.append(c0);
            stringbuffer.append(c1);
        }
        return stringbuffer.toString();
    }

}
```

## 常用操作

### 加载Base64字符串图片

```java
String imageBase64Str = "xxxxxxxxxxxx";
byte[] decodedImageInBytes = Base64.decode(imageBase64Str, Base64.DEFAULT);
Bitmap myImage = BitmapFactory.decodeByteArray(decodedImageInBytes, 0, decodedImageInBytes.length);
userPic.setImageBitmap(myImage);
```