---

layout: post
title: iOS文件上传的几种形式
description: iOS文件上传的几种形式
keywords: ios
category: ios

---


## 前言

做文件上传功能 有两种方式  

一种是`HTTP`方式，另一种`Socket`方式  
但是HTTP方式不能上传大文件  

HTTP方式又有两种  

一种是`二进制流`上传 一种是`multipart/form-data`形式  


## HTTP方式

`二进制流`不能附加其他的参数  
`multipart/form-data`形式可以附加其他参数

平常我们提交表单时  `Request`的`Content-Type`为如下所示

```
Content-Type: application/x-www-form-urlencoded
```

如果我们上传的表单中有文件 我们会设置表单`enctype="multipart/form-data"`  
这时提交时`Request`的`Content-Type`为如下所示

```
Content-Type: multipart/form-data; boundary=alamofire.boundary.9b2bf38bcb25c57e
```

另一种文件上传`Request`的`Content-Type`为如下所示

```
Content-Type: application/octet-stream
```

### 用Alamofire进行HTTP上传

#### 方式一 (multipart/form-data)

上传可以附带其他参数 
但是这种方式没法得到上传进度

```swift
//上传文件
static func uploadImage(url:String,parameters:[String:AnyObject],imagePath:NSURL,fileParName:String){
Alamofire.upload(
    .POST,
    url,
    multipartFormData: { multipartFormData in
        multipartFormData.appendBodyPart(fileURL: imagePath, name: fileParName)
        // 这里就是绑定参数的地方
        for (key, value) in parameters {
            if(value.stringValue != nil){
                multipartFormData.appendBodyPart(data: value.stringValue.dataUsingEncoding(NSUTF8StringEncoding)!, name: key);
            }
        }
    },
    encodingCompletion: { encodingResult in
        switch encodingResult {
        case .Success(let upload, _, _):
            upload.responseJSON { response in
                debugPrint(response)
            }
        case .Failure(let encodingError):
            print(encodingError)
        }
    }
)
```

#### 方式二 (二进制流)

可以获取上传进度的方式 但是没法附带其他参数

```swift
Alamofire.upload(.POST, "https://httpbin.org/post", file: imagePath)
    .progress { bytesWritten, totalBytesWritten, totalBytesExpectedToWrite in
        dispatch_async(dispatch_get_main_queue()) {
            print("Total bytes written on main queue: \(totalBytesWritten)")
        }
    }
    .validate()
    .responseJSON { response in
        debugPrint(response)
}
```

所以例如设置用户头像等就用第一种方式  
要是做文件上传就必须用第二种方式 第二种方式也能控制暂停、继续、停止等操作

### 用AFNetworking进行HTTP上传

#### 方式一

```swift
static func uploadFile(url:String,parameters:[String:AnyObject]?,data:NSData,callBack:(success:Bool,operation:AFHTTPRequestOperation!,responseObject: AnyObject?,error:NSError?) -> Void ,progressBlock:(bytesWritten:UInt,totalBytesWritten:Int64,totalBytesExpectedToWrite:Int64) -> Void) -> AFHTTPRequestOperation {
    let manager = AFHTTPRequestOperationManager();
    let operation:AFHTTPRequestOperation? = manager.POST(url, parameters: parameters, constructingBodyWithBlock: {
        (formData:AFMultipartFormData!) -> Void in
            formData.appendPartWithFileData(data, name: "file", fileName: "shenfenzheng.jpg", mimeType: "image/jpeg");
        }, success: {
            (operation:AFHTTPRequestOperation!, responseObject: AnyObject!) -> Void in
            callBack(success: true, operation: operation, responseObject: responseObject, error: nil)
        }, failure: {
            (operation:AFHTTPRequestOperation?,error:NSError?) -> Void in
            callBack(success: false, operation: operation, responseObject: nil, error: error);
    })
    operation?.setUploadProgressBlock(progressBlock);
    return operation!;
}
```

调用方式

```swift
let operation = uploadFile("", parameters: nil, data: NSData(), callBack: { (success, operation, responseObject, error) in
    
}) { (bytesWritten, totalBytesWritten, totalBytesExpectedToWrite) in
    
}
operation.start();
```

#### 方式二

这种方式要使用`KVO`来获取进度，个人不推荐 
因为如果同时上传多个文件时进度处理起来会比较麻烦

Swift代码

```swift
func uploadFile2(data:NSData){
    let parameters:[String:AnyObject] = [
        "userId": "123"
    ];
    let request = AFHTTPRequestSerializer().multipartFormRequestWithMethod("POST", URLString: "http://example.com/upload", parameters: parameters, constructingBodyWithBlock: { (formData) in
        formData.appendPartWithFileData(data, name: "file", fileName: "shenfenzheng.jpg", mimeType: "image/jpeg");
        }, error: nil)
    let manager = AFURLSessionManager(sessionConfiguration: NSURLSessionConfiguration.defaultSessionConfiguration())
    var progress: NSProgress?;
    _ = manager.uploadTaskWithStreamedRequest(request, progress: &progress) { (response, responseObject, error) in
            progress?.removeObserver(self, forKeyPath: "fractionCompleted", context: nil) 
    }
    progress?.addObserver(self, forKeyPath: "fractionCompleted", options: NSKeyValueObservingOptions.Initial, context: nil)
}
    
override func observeValueForKeyPath(keyPath: String?, ofObject object: AnyObject?, change: [String : AnyObject]?, context: UnsafeMutablePointer<Void>) {
    if(keyPath == "fractionCompleted"){
        let progress: NSProgress = object as! NSProgress;
        print("progress: \(progress.fractionCompleted)")
    }
}
```

ObjC代码

```objc
NSMutableURLRequest *request = [[AFHTTPRequestSerializer serializer] multipartFormRequestWithMethod:@"POST" URLString:@"http://example.com/upload" parameters:nil constructingBodyWithBlock:^(id<AFMultipartFormData> formData) {
        [formData appendPartWithFileURL:[NSURL fileURLWithPath:@"file://path/to/image.jpg"] name:@"file" fileName:@"filename.jpg" mimeType:@"image/jpeg" error:nil];
    } error:nil];

AFURLSessionManager *manager = [[AFURLSessionManager alloc] initWithSessionConfiguration:[NSURLSessionConfiguration defaultSessionConfiguration]];
NSProgress *progress = nil;

NSURLSessionUploadTask *uploadTask = [manager uploadTaskWithStreamedRequest:request progress:&progress completionHandler:^(NSURLResponse *response, id responseObject, NSError *error) {
    if (error) {
        NSLog(@"Error: %@", error);
    } else {
        NSLog(@"%@ %@", response, responseObject);
    }
}];

[uploadTask resume];
```

## 大文件上传

目前考虑到`WEB端`只能用`HTTP方式`，所以我用的是`HTTP分片上传`

### 方式一 HTTP形式

上面说了  大文件上传需要用`Socket`  
其实用`HTTP`的`multipart/form-data`形式也可以  

原理就是  
上传时把文件进行切片   
提交时除了文件data 同时传入 总片数 当前是第几片  
服务端得到所有的数据片后合并数据

### 方式二 Socket形式

`Socket`上传时 如果是大文件也是要进行分片的

#### 上传下载客户端

上传

```objc
- (void)viewDidLoad

{
    [super viewDidLoad];
    self.socketClient = [[AsyncSocket alloc] initWithDelegate:self];
    [self.socketClient connectToHost:@"192.168.1.188" onPort:8000 withTimeout:-1 error:Nil];
    
    // 发送数据
    NSLog(@"发送数据");
    NSString *headerString = [NSString stringWithFormat:@"upload&&%@&&%d",self.file.fileName,self.file.fileLength];
    NSMutableData *allData = [MXUtils getAllDataByHeaderString:headerString];
    NSData *fileData = [NSData dataWithContentsOfFile:self.file.filePath];
    NSLog(@"%d",self.file.fileLength);
    [allData appendData:fileData];
    [self.socketClient writeData:allData withTimeout:-1 tag:0];
    self.labelUploadInfo.text = [NSString stringWithFormat:@"上传%@",self.file.fileName];
}

-(void)onSocket:(AsyncSocket *)sock didWriteDataWithTag:(long)tag{

    UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"上传成功" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:Nil, nil];
    [alert show];
}
```

获取下载列表是通过互相发送消息，从服务端把文件对象(也就是文件在服务端的绝对路径)归档发送到客户端，然后在客户端反归档获取文件列表

```objc
- (void)viewDidLoad

{

    [super viewDidLoad];
    self.socketClient = [[AsyncSocket alloc] initWithDelegate:self];
    [self.socketClient connectToHost:@"192.168.1.188" onPort:8000 withTimeout:-1 error:Nil];
    NSString *headerString = @"downList&& &&";
    NSMutableData *allData = [MXUtils getAllDataByHeaderString:headerString];
    [self.socketClient writeData:allData withTimeout:-1 tag:0];
    [self.socketClient readDataWithTimeout:-1 tag:0];
}

-(void)onSocket:(AsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag{
    // 反归档
    NSKeyedUnarchiver *unarchiver = [[NSKeyedUnarchiver alloc] initForReadingWithData:data];
    self.filePathArray = [unarchiver decodeObjectForKey:@"downlist"];
    NSLog(@"%@",self.filePathArray);
    [self.tableView reloadData];
}
```

下载是通过列表中的文件路径发送给服务端，然后服务端根据其路径找到文件返回去

```objc
- (void)viewDidLoad

{
    [super viewDidLoad];
    self.fileData = [NSMutableData data];
    self.socketClient = [[AsyncSocket alloc] initWithDelegate:self];
    [self.socketClient connectToHost:@"192.168.1.188" onPort:8000 withTimeout:-1 error:Nil];

    // 发送数据
    NSLog(@"发送数据");
    NSString *headerString = [NSString stringWithFormat:@"download&&%@&&",self.file.filePath];
    NSMutableData *allData = [MXUtils getAllDataByHeaderString:headerString];
    NSLog(@"%d",self.file.fileLength);
    [self.socketClient writeData:allData withTimeout:-1 tag:0];
    self.labelDownload.text = [NSString stringWithFormat:@"下载%@",self.file.fileName];
    [self.socketClient readDataWithTimeout:-1 tag:0];
}

-(void)onSocket:(AsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag{
    [self.fileData appendData:data];
    if (self.fileData.length == self.file.fileLength) {
        [self.fileData writeToFile:[@"/Users/tarena/yz/第三阶段(高级UI)/day11/download" stringByAppendingPathComponent:self.file.fileName] atomically:YES];
        UIAlertView *alert = [[UIAlertView alloc] initWithTitle:@"提示" message:@"下载成功" delegate:self cancelButtonTitle:@"确定" otherButtonTitles:Nil, nil];
        [alert show];
    }

    [self.socketClient readDataWithTimeout:-1 tag:0];
}
```

#### 上传下载服务端

```objc
- (void)viewDidLoad

{
    [super viewDidLoad];
    self.socketServer = [[AsyncSocket alloc] initWithDelegate:self];
    [self.socketServer acceptOnPort:8000 error:Nil];
}

-(void)onSocket:(AsyncSocket *)sock didAcceptNewSocket:(AsyncSocket *)newSocket{
    NSLog(@"通道");
    self.socketNew = newSocket;
}

-(void)onSocket:(AsyncSocket *)sock didConnectToHost:(NSString *)host port:(UInt16)port{
    NSLog(@"连接成功%@",host);
    self.host = host;
    [self.socketNew readDataWithTimeout:-1 tag:0];
}

-(void)onSocket:(AsyncSocket *)sock didReadData:(NSData *)data withTag:(long)tag{
    NSLog(@"读取数据成功");
    // 判断是否有消息头
    NSData *headerData = [data subdataWithRange:NSMakeRange(0, 100)];
    NSString *headerString = [[NSString alloc] initWithData:headerData encoding:NSUTF8StringEncoding]; // 消息头
    if (headerString && [headerString componentsSeparatedByString:@"&&"].count == 3) {
        NSLog(@"有消息头");
        NSArray *headerArray = [headerString componentsSeparatedByString:@"&&"];
        NSString *type = headerArray[0];
        if ([type isEqualToString:@"upload"]) {
            self.allData = [NSMutableData data];
            self.fileName = headerArray[1];
            self.fileLength = [headerArray[2] intValue];
            NSData *subData = [data subdataWithRange:NSMakeRange(100, data.length - 100)];
            [self.allData appendData:subData];
            self.labelUploadInfo.text = [NSString stringWithFormat:@"%@在上传%@文件",self.host,self.fileName];
            self.progressUpload.progress = self.allData.length * 1.0 / self.fileLength;
        }else if([type isEqualToString:@"downList"]){
            NSData *data = [MXUtils getFilePathArrayDataByDirectoryPath:@""];
            [self.socketNew writeData:data withTimeout:-1 tag:0];
        }else if([type isEqualToString:@"download"]){
            NSString *filePath = headerArray[1];
            NSData *data = [NSData dataWithContentsOfFile:filePath];
            [self.socketNew writeData:data withTimeout:-1 tag:0];
        }

    }else{

        [self.allData appendData:data];
        self.progressUpload.progress = self.allData.length * 1.0 / self.fileLength;

    }

    if (self.allData.length == self.fileLength) {
        NSString *path = [@"" stringByAppendingPathComponent:self.fileName];
        NSLog(@"写到%@",path);
        [self.allData writeToFile:path atomically:YES];
    }
    [self.socketNew readDataWithTimeout:-1 tag:0];

}
```

把消息头存进要发送的数据中 并且**固定占用多少字节**  

使用网络需要导入**CFNetwork.framework**框架




