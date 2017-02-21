---

layout: post
title: Android FTP上传文件
description: Android FTP上传文件
keywords: android
categories: android

---

## 前言

Android 上用 FTP上传文件 通常可以用以下的这两个Jar

+ commons-net
+ ftp4j

我这里就用第一种方式   
第二种请参考[`通过FTP4J 实现FTP各种操作`](http://cuisuqiang.iteye.com/blog/1774600)

## 使用方式

引用 

```
//FTP
compile group: 'commons-net', name: 'commons-net', version: '3.5'
```

### 代码

```java
class UploadTask extends AsyncTask<String, Object, Integer> {

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
    }

    @Override
    protected Integer doInBackground(String... params) {
        String ftp_url = "192.168.1.100";
        String ftp_name = "name";
        String ftp_pwd = "pwd";

        String fileName = params[0];

        String basePath = Environment.getExternalStorageDirectory().getAbsolutePath();
        String filePath = basePath + File.separator + "caiyun" + File.separator + fileName;
        String remotePath = File.separator + fileName.substring(0, 2);
        FTPClient ftpClient = new FTPClient();
        FileInputStream fis;
        int returnMessage = 0;
        try {
            ftpClient.connect(ftp_url, 21);
            boolean loginResult = ftpClient.login(ftp_name, ftp_pwd);
            int returnCode = ftpClient.getReplyCode();
            if (loginResult && FTPReply.isPositiveCompletion(returnCode)) {// 如果登录成功
                ftpClient.makeDirectory(remotePath);
                // 设置上传目录
                ftpClient.changeWorkingDirectory(remotePath);
                ftpClient.setBufferSize(1024);
                ftpClient.setControlEncoding("UTF-8");
                ftpClient.enterLocalPassiveMode();
                ftpClient.setFileType(FTPClient.BINARY_FILE_TYPE);
                fis = new FileInputStream(filePath);

                //不计算进度条
                //ftpClient.storeFile(fileName, fis);

                //计算进度条
                int n = -1;
                long pContentLength = fis.available();
                long trans = 0;
                int bufferSize = ftpClient.getBufferSize();
                byte[] buffer = new byte[bufferSize];
                OutputStream outputstream = ftpClient.storeFileStream(new String(fileName.getBytes("utf-8"), "iso-8859-1"));
                while ((n = fis.read(buffer)) != -1) {
                    outputstream.write(buffer, 0, n);
                    trans += n;
                    //trans已传输字节  pContentLength总字节
                    publishProgress(trans, pContentLength);
                }
                fis.close();
                outputstream.flush();
                outputstream.close();

                returnMessage = 1;   //上传成功
            } else {// 如果登录失败
                returnMessage = 0;
            }


        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("FTP客户端出错！", e);
        } finally {
            try {
                ftpClient.disconnect();
            } catch (IOException e) {
                e.printStackTrace();
                throw new RuntimeException("关闭FTP连接发生异常！", e);
            }
        }
        return returnMessage;
    }

    @Override
    protected void onPostExecute(Integer result) {
        if (result == 1) {
            //上传成功后调用
        }

    }

    @Override
    protected void onProgressUpdate(Object... values) {
        super.onProgressUpdate(values);
        //获取进度
        long trans = (long) values[0];
        long pContentLength = (long) values[1];
        int progress = (int) (trans * 100 / pContentLength);
        
    }
}
```

### 调用方式

```java
new UploadTask("123.jpg").execute();
```