---

layout: post
title: AFNetworking3的常用操作
description: AFNetworking3的常用操作
keywords: swift
categories: ios

---

## 前言

导入的最新版的`AFNetworking3.1.0`,突然发现找不到`AFHTTPRequestOperationManager`了。  
刚开始以为是cocoapods没有给我导进去，后来发现也没有这`NSURLConnection`了，被`弃用`了，突然意识到，这个就是`AFHTTPRequestOperationManager`找不到的原因了，它是基于`NSURLConnection`封装的！！  
于是找了一下，现在都用的是`NSURLSession`了，`AFNetworking`中用的是`AFHTTPSessionManager`了

测试版本`AFNetworking3.1.0`

[官方文档](https://github.com/AFNetworking/AFNetworking)

## GET请求

```objc
AFHTTPSessionManager *manager = [AFHTTPSessionManager manager]; 

[manager GET:URL parameters:nil progress:^(NSProgress * _Nonnull downloadProgress) {  

}     
 success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {  

 NSLog(@"这里打印请求成功要做的事");  

}

failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull   error) {  

NSLog(@"%@",error);  //这里打印错误信息

}];
```

## POST请求

```objc
AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];

NSMutableDictionary *parameters = @{@"":@"",@"":@""};

[manager POST:URL parameters:parameters progress:^(NSProgress * _Nonnull uploadProgress) {

} success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {

} failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {

}];
```

##  文件下载

```objc
/**
 *  AFN3.0 下载
 */
- (void)downLoad{

    //1.创建管理者对象
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    //2.确定请求的URL地址
    NSURL *url = [NSURL URLWithString:@""];

    //3.创建请求对象
    NSURLRequest *request = [NSURLRequest requestWithURL:url];

    //下载任务
    NSURLSessionDownloadTask *task = [manager downloadTaskWithRequest:request progress:^(NSProgress * _Nonnull downloadProgress) {
        //打印下下载进度
        NSLog(@"%lf",1.0 * downloadProgress.completedUnitCount / downloadProgress.totalUnitCount);

    } destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
        //下载地址
        NSLog(@"默认下载地址:%@",targetPath);

        //设置下载路径，通过沙盒获取缓存地址，最后返回NSURL对象
        NSString *filePath = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)lastObject];
        return [NSURL URLWithString:filePath];


    } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {

        //下载完成调用的方法
        NSLog(@"下载完成：");
        NSLog(@"%@--%@",response,filePath);

    }];

    //开始启动任务
    [task resume];

}
```

## 文件上传

```objc
NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];

NSURL *URL = [NSURL URLWithString:@"http://example.com/upload"];
NSURLRequest *request = [NSURLRequest requestWithURL:URL];

NSURL *filePath = [NSURL fileURLWithPath:@"file://path/to/image.png"];
NSURLSessionUploadTask *uploadTask = [manager uploadTaskWithRequest:request fromFile:filePath progress:nil completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
    if (error) {
        NSLog(@"Error: %@", error);
    } else {
        NSLog(@"Success: %@ %@", response, responseObject);
    }
}];
[uploadTask resume];
```

```objc
/**
 *  AFN 3.0 上传
 */

//第一种方法是通过工程中的文件进行上传
- (void)upLoad1{

    //1。创建管理者对象
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];

    //2.上传文件
    NSDictionary *dict = @{@"username":@"1234"};

    NSString *urlString = @"22222";
    [manager POST:urlString parameters:dict constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
        //上传文件参数
        UIImage *iamge = [UIImage imageNamed:@"123.png"];
        NSData *data = UIImagePNGRepresentation(iamge);
        //这个就是参数
        [formData appendPartWithFileData:data name:@"file" fileName:@"123.png" mimeType:@"image/png"];

    } progress:^(NSProgress * _Nonnull uploadProgress) {

        //打印下上传进度
        NSLog(@"%lf",1.0 *uploadProgress.completedUnitCount / uploadProgress.totalUnitCount);
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {

        //请求成功
        NSLog(@"请求成功：%@",responseObject);

    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {

        //请求失败
        NSLog(@"请求失败：%@",error);
    }];

}

```


```objc
//第二种是通过URL来获取路径，进入沙盒或者系统相册等等
- (void)upLoda2{
    //1.创建管理者对象
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    //2.上传文件
    NSDictionary *dict = @{@"username":@"1234"};

    NSString *urlString = @"22222";
    [manager POST:urlString parameters:dict constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {

        [formData appendPartWithFileURL:[NSURL fileURLWithPath:@"文件地址"] name:@"file" fileName:@"1234.png" mimeType:@"application/octet-stream" error:nil];
    } progress:^(NSProgress * _Nonnull uploadProgress) {

        //打印下上传进度
        NSLog(@"%lf",1.0 *uploadProgress.completedUnitCount / uploadProgress.totalUnitCount);
    } success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {

        //请求成功
        NSLog(@"请求成功：%@",responseObject);

    } failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull error) {

        //请求失败
        NSLog(@"请求失败：%@",error);
    }];
}
```

+ Multi-Part Request

```objc
NSMutableURLRequest *request = [[AFHTTPRequestSerializer serializer] multipartFormRequestWithMethod:@"POST" URLString:@"http://example.com/upload" parameters:nil constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
        [formData appendPartWithFileURL:[NSURL fileURLWithPath:@"file://path/to/image.jpg"] name:@"file" fileName:@"filename.jpg" mimeType:@"image/jpeg" error:nil];
    } error:nil];

AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];

NSURLSessionUploadTask *uploadTask;
uploadTask = [manager
              uploadTaskWithStreamedRequest:request
              progress:^(NSProgress * _Nonnull uploadProgress) {
                  // This is not called back on the main queue.
                  // You are responsible for dispatching to the main queue for UI updates
                  dispatch_async(dispatch_get_main_queue(), ^{
                      //Update the progress view
                      [progressView setProgress:uploadProgress.fractionCompleted];
                  });
              }
              completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
                  if (error) {
                      NSLog(@"Error: %@", error);
                  } else {
                      NSLog(@"%@ %@", response, responseObject);
                  }
              }];

[uploadTask resume];
```

## 监测当前网络状态（网络监听）

```objc
- (void)AFNetworkStatus{

    //1.创建网络监测者
    AFNetworkReachabilityManager *manager = [AFNetworkReachabilityManager sharedManager];

    /*枚举里面四个状态  分别对应 未知 无网络 数据 WiFi
     typedef NS_ENUM(NSInteger, AFNetworkReachabilityStatus) {
         AFNetworkReachabilityStatusUnknown          = -1,      未知
         AFNetworkReachabilityStatusNotReachable     = 0,       无网络
         AFNetworkReachabilityStatusReachableViaWWAN = 1,       蜂窝数据网络
         AFNetworkReachabilityStatusReachableViaWiFi = 2,       WiFi
     };
     */

    [manager setReachabilityStatusChangeBlock:^(AFNetworkReachabilityStatus status) {
        //这里是监测到网络改变的block  可以写成switch方便
        //在里面可以随便写事件
        switch (status) {
            case AFNetworkReachabilityStatusUnknown:
                NSLog(@"未知网络状态");
                break;
            case AFNetworkReachabilityStatusNotReachable:
                NSLog(@"无网络");
                break;

            case AFNetworkReachabilityStatusReachableViaWWAN:
                NSLog(@"蜂窝数据网");
                break;

            case AFNetworkReachabilityStatusReachableViaWiFi:
                NSLog(@"WiFi网络");

                break;

            default:
                break;
        }

    }] ;
}
```