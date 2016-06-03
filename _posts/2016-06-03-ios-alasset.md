---

layout: post
title: ALAsset和ALAssetRepresentation详解
description: ALAsset和ALAssetRepresentation详解
keywords: ios
category: ios

---


## 前言

ALAsset类代表相册中的每个资源文件，可以通过它获取资源文件的相关信息还能修改和新建资源文件，ALAssetRepresentation类代表相册中每个资源文件的详细信息，可以通过它获取资源的大小，名字，路径等详细信息。

## 根据URL获取ALAsset

怎样根据url获取ALAsset对象  
url类似于(`assets-library://asset/asset.PNG?id=2EAEEF99-2C75-4484-B922-9A2F34507537&ext=PNG`)

注意这里有个坑  在ios8.1上会出现  

解决方法如下

定义Block

```objc
typedef void(^ZJGetALAssetBlock)(ALAsset *);
```

获取方法

```objc
+ (void)getALAssetByNSURL:(NSURL *)url callback:(ZJGetALAssetBlock)block{
    ALAssetsLibrary *lib = [DNAsset defaultAssetsLibrary];
    [lib assetForURL:url resultBlock:^(ALAsset *asset){
        if (asset) {
            block(asset);
        } else {
            // On iOS 8.1 [library assetForUrl] Photo Streams always returns nil. Try to obtain it in an alternative way
            [lib enumerateGroupsWithTypes:ALAssetsGroupPhotoStream
                               usingBlock:^(ALAssetsGroup *group, BOOL *stop)
             {
                 [group enumerateAssetsWithOptions:NSEnumerationReverse
                                        usingBlock:^(ALAsset *result, NSUInteger index, BOOL *stop) {
                                            
                                            if([[result valueForProperty:ALAssetPropertyAssetURL] isEqual:url])
                                            {
                                                block(asset);
                                                *stop = YES;
                                            }
                                        }];
             }
                             failureBlock:^(NSError *error)
             {
                 block(nil);
             }];
        }
        
    } failureBlock:^(NSError *error){
        block(nil);
    }];
}
```

## 属性获取

```objc
//获取资源图片的详细资源信息
ALAssetRepresentation* representation = [asset defaultRepresentation];
//获取资源图片的长宽
CGSize dimension = [representation dimensions];
//获取资源图片的高清图
[representation fullResolutionImage];
//获取资源图片的全屏图
[representation fullScreenImage];
//获取资源图片的名字
NSString* filename = [representation filename];
NSLog(@"filename:%@",filename);
//缩放倍数
[representation scale];
//图片资源容量大小
[representation size];
//图片资源原数据
[representation metadata];
//旋转方向
[representation orientation];
//资源图片url地址，该地址和ALAsset通过ALAssetPropertyAssetURL获取的url地址是一样的
NSURL* url = [representation url];
NSLog(@"url:%@",url);
//资源图片uti，唯一标示符
NSLog(@"uti:%@",[representation UTI]);
```

判断选择的是图片还是视频

```swift
let representation =  alasset.defaultRepresentation()
//类型
let alassetType = alasset.valueForProperty(ALAssetPropertyType) as! String;
//文件名
let fileName = representation.filename();
//文件大小
let fileSize = representation.size();
//时间
let fileDate = alasset.valueForProperty(ALAssetPropertyDate) as! NSDate;
if(alassetType == ALAssetTypePhoto){
    
}else if(alassetType == ALAssetTypeVideo){
    
}
```

## 文件上传

ALAsset的url没法用于上传，虽然可以夺取NSData 但是这样就把数据都加载在内存中，如果是一个较大的视频文件 显然是不太合理的 所以我们可以把文件自己保存到临时的位置 进行上传

定义宏

```objc
// 照片原图路径
#define ZJImageCachesPath [[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:@"images"]

// 视频URL路径
#define ZJVideoCachesPath [[NSSearchPathForDirectoriesInDomains(NSCachesDirectory, NSUserDomainMask, YES) objectAtIndex:0] stringByAppendingPathComponent:@"video"]
```

定义Block

```objc
typedef void(^ALAssetToNSURLBlock)(NSURL *);
```

方法

```objc
// 将原始图片转化为NSData数据,写入沙盒
+ (void)getImageUrlWithALAsset:(ALAsset *)asset callback:(ALAssetToNSURLBlock) block
{
    // 创建存放原始图的文件夹--->OriginalPhotoImages
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSFileManager * fileManager = [NSFileManager defaultManager];
        if (![fileManager fileExistsAtPath:ZJImageCachesPath]) {
            [fileManager createDirectoryAtPath:ZJImageCachesPath withIntermediateDirectories:YES attributes:nil error:nil];
        }
        
        ALAssetRepresentation *rep = [asset defaultRepresentation];
        Byte *buffer = (Byte*)malloc((unsigned long)rep.size);
        NSUInteger buffered = [rep getBytes:buffer fromOffset:0.0 length:((unsigned long)rep.size) error:nil];
        NSData *data = [NSData dataWithBytesNoCopy:buffer length:buffered freeWhenDone:YES];
        NSString * imagePath = [ZJImageCachesPath stringByAppendingPathComponent:rep.filename];
        //删除原有的临时文件
        if ([fileManager fileExistsAtPath:imagePath]) {
            [fileManager removeItemAtPath:imagePath error:nil];
        }
        [data writeToFile:imagePath atomically:YES];
        block([NSURL fileURLWithPath:imagePath]);
    });
}

// 将原始视频转化为NSData数据,写入沙盒
+ (void)getVideoUrlWithALAsset:(ALAsset *)asset callback:(ALAssetToNSURLBlock) block
{
    // 解析一下,为什么视频不像图片一样一次性开辟本身大小的内存写入?
    // 想想,如果1个视频有1G多,难道直接开辟1G多的空间大小来写?
    dispatch_async(dispatch_get_global_queue(DISPATCH_QUEUE_PRIORITY_DEFAULT, 0), ^{
        NSFileManager * fileManager = [NSFileManager defaultManager];
        if (![fileManager fileExistsAtPath:ZJVideoCachesPath]) {
            [fileManager createDirectoryAtPath:ZJVideoCachesPath withIntermediateDirectories:YES attributes:nil error:nil];
        }
        
        ALAssetRepresentation *rep = [asset defaultRepresentation];
        NSString * videoPath = [ZJVideoCachesPath stringByAppendingPathComponent:rep.filename];
        
        //删除原有的临时文件
        if ([fileManager fileExistsAtPath:videoPath]) {
            [fileManager removeItemAtPath:videoPath error:nil];
        }
        char const *cvideoPath = [videoPath UTF8String];
        FILE *file = fopen(cvideoPath, "ab+");
        if (file) {
            const int bufferSize = 1024 * 1024;
            // 初始化一个1M的buffer
            Byte *buffer = (Byte*)malloc(bufferSize);
            NSUInteger read = 0, offset = 0, written = 0;
            NSError* err = nil;
            if (rep.size != 0)
            {
                do {
                    read = [rep getBytes:buffer fromOffset:offset length:bufferSize error:&err];
                    written = fwrite(buffer, sizeof(char), read, file);
                    offset += read;
                } while (read != 0 && !err);//没到结尾，没出错，ok继续
            }
            // 释放缓冲区，关闭文件
            free(buffer);
            buffer = NULL;
            fclose(file);
            file = NULL;
        }
        block([NSURL fileURLWithPath:videoPath]);
    });
}
```

## 用Alamofire上传

上传时附带其他参数(multipart)  
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

