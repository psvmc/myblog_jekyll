---

layout: post
title: AFNetworking3的常用操作
description: AFNetworking3的常用操作
keywords: ios
categories: ios

---

## 前言

导入的最新版的`AFNetworking3.1.0`,突然发现找不到`AFHTTPRequestOperationManager`了。  
刚开始以为是cocoapods没有给我导进去，后来发现也没有这`NSURLConnection`了，被`弃用`了，突然意识到，这个就是`AFHTTPRequestOperationManager`找不到的原因了，它是基于`NSURLConnection`封装的！！  
于是找了一下，现在都用的是`NSURLSession`了，`AFNetworking`中用的是`AFHTTPSessionManager`了

测试版本`AFNetworking3.1.0`

[官方文档](https://github.com/AFNetworking/AFNetworking)

## GET/POST请求

```objc
AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
manager.responseSerializer = [AFHTTPResponseSerializer serializer];
NSMutableDictionary *parametersDic = [NSMutableDictionary dictionary];
//往字典里面添加需要提交的参数
[parametersDic setObject:@"psvmc" forKey:@"username"];
[parametersDic setObject:@"123456" forKey:@"password"];

//GET/POST
[manager GET:@"http://www.psvmc.cn/login.json"
   parameters:parametersDic
   progress:^(NSProgress * _Nonnull downloadProgress) {
    
   }
   success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
    NSDictionary *resultDic = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableLeaves error:nil];
    NSLog(@"---获取到的json格式的字典--%@",resultDic);
       
    NSString *resultStr = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];
    NSLog(@"---获取到的NSString格式的结果--%@",resultStr);
   }
   failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull   error) {
    NSLog(@"%@",error);  //这里打印错误信息
   }];
```

### 指定Request的序列化方式

```objc
NSMutableDictionary *parametersDic = [NSMutableDictionary dictionary];
//往字典里面添加需要提交的参数
[parametersDic setObject:@"psvmc" forKey:@"username"];
[parametersDic setObject:@"123456" forKey:@"password"];
NSURLRequest *request = [[AFHTTPRequestSerializer serializer] requestWithMethod:@"GET" URLString:@"http://www.psvmc.cn/login.json" parameters:parametersDic error:nil];
AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
manager.responseSerializer = [AFHTTPResponseSerializer serializer];
NSURLSessionDataTask *dataTask = [manager dataTaskWithRequest:request completionHandler:^(NSURLResponse * _Nonnull response, id  _Nullable responseObject, NSError * _Nullable error) {
   NSString *resultStr = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];
   NSLog(@"---获取到的NSString格式的结果--%@",resultStr);
}];
[dataTask resume];
```

Request序列化的方式有三种  (上面示例的就是方式1)

+ GET一种 也就是默认的方式  
+ POST两种 默认的方式 和JSON方式

假如要请求的URL 和参数如下

```objc
NSString *URLString = @"http://example.com";
NSDictionary *parameters = @{@"foo": @"bar", @"baz": @[@1, @2, @3]};
```

1) 方式1 GET请求默认的方式

```objc
HTTPRequestSerializer serializer] requestWithMethod:@"GET" URLString:URLString parameters:parameters error:nil];
```

实际请求的样子

```
GET http://example.com?foo=bar&baz[]=1&baz[]=2&baz[]=3
```

2) 方式2  POST请求默认的方式

```objc
[[AFHTTPRequestSerializer serializer] requestWithMethod:@"POST" URLString:URLString parameters:parameters error:nil];
```

实际请求的样子

```
POST http://example.com/
Content-Type: application/x-www-form-urlencoded

foo=bar&baz[]=1&baz[]=2&baz[]=3
```

3) 方式3 POST请求JSON形式的方式

```objc
[[AFJSONRequestSerializer serializer] requestWithMethod:@"POST" URLString:URLString parameters:parameters error:nil];
```

实际请求的样子

```
POST http://example.com/
Content-Type: application/json

{"foo": "bar", "baz": [1,2,3]}
```

### 指定Response的序列化方式

```objc
AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
manager.responseSerializer = [AFHTTPResponseSerializer serializer];
```

如果不指定   
默认如果返回的格式是`json`类型 返回的`responseObject`就是`NSDictionary`类型 可以类似这样取值`responseObject[@"msg"]`  
如果不是`json`格式 就为`nil`

如果返回格式不固定 或者自己处理  就添加上面的序列化方式

#### 自己序列化的代码

```objc
NSDictionary *resultDic = [NSJSONSerialization JSONObjectWithData:responseObject options:NSJSONReadingMutableLeaves error:nil];
NSLog(@"---获取到的json格式的字典--%@",resultDic);
  
NSString *resultStr = [[NSString alloc] initWithData:responseObject encoding:NSUTF8StringEncoding];
NSLog(@"---获取到的NSString格式的结果--%@",resultStr);
```

所以还是建议添加序列化方式 自己处理

##  文件下载

```objc
/**
 *  AFN3.0 下载
 */
- (void)downLoad{

    //1.创建管理者对象
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    //2.确定请求的URL地址
    NSURL *url = [NSURL URLWithString:@"http://www.psvmc.cn/favicon.ico"];
    
    //3.创建请求对象
    NSURLRequest *request = [NSURLRequest requestWithURL:url];
    
    //下载任务
    NSURLSessionDownloadTask *task = [manager downloadTaskWithRequest:request progress:^(NSProgress * _Nonnull downloadProgress) {
        //打印下下载进度
        NSLog(@"下载进度：%lf",1.0 * downloadProgress.completedUnitCount / downloadProgress.totalUnitCount);
    } destination:^NSURL * _Nonnull(NSURL * _Nonnull targetPath, NSURLResponse * _Nonnull response) {
        //下载地址
        NSLog(@"默认下载地址：%@",targetPath);
        //设置下载路径，通过沙盒获取缓存地址，最后返回NSURL对象
        NSString *filePath = [NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES)lastObject];
        return [NSURL URLWithString:filePath];
    } completionHandler:^(NSURLResponse * _Nonnull response, NSURL * _Nullable filePath, NSError * _Nullable error) {
        //下载完成调用的方法
        NSLog(@"下载完成：%@",filePath);
    }];
    
    //开始启动任务
    [task resume];

}
```

## 文件上传



```objc
//1.创建管理者对象
AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];

//2.上传文件
NSDictionary *dict = @{@"username":@"1234"};

NSString *urlString = @"http://www.psvmc.cn/upload";
[manager POST:urlString parameters:dict constructingBodyWithBlock:^(id<AFMultipartFormData>  _Nonnull formData) {
   //上传文件参数
   UIImage *iamge = [UIImage imageNamed:@"123.png"];
   NSData *data = UIImagePNGRepresentation(iamge);
   //这个就是参数
   [formData appendPartWithFileData:data name:@"file" fileName:@"123.png" mimeType:@"image/png"];
   //方式二
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

```

+ 获取Task 普通上传

```objc
NSURLSessionConfiguration *configuration = [NSURLSessionConfiguration defaultSessionConfiguration];
AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:configuration];

NSURL *URL = [NSURL URLWithString:@"http://www.psvmc.cn/upload"];
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

+ 获取Task `Multi-Part` Request

```objc
NSMutableURLRequest *request = [[AFHTTPRequestSerializer serializer] multipartFormRequestWithMethod:@"POST" URLString:@"http://www.psvmc.cn/upload" parameters:nil constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
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