---

layout: post
title: AFNetworking简单封装（Block形式）
description: AFNetworking简单封装（Block形式）
keywords: ios
category: ios

---

## 前言

之前写了 `AFNetworking` 的[基本用法](http://www.psvmc.cn/ios-afnetworking.html) 这次就简单的封装一下

### 封装

ZJAFNetworkingKit.h

```objc
#import <Foundation/Foundation.h>
#import "AFNetworking/AFNetworking.h"

typedef void(^ZJAFNetworkingBlock)(bool success,id responseObject,NSError * error);
@interface ZJAFNetworkingKit : NSObject

+ (void)saveCookies;
+ (void)loadCookies;
+ (void)getWithUrl:(NSString *) url pars:(NSDictionary *) pars callback:(ZJAFNetworkingBlock) callback;
+ (void)getWithUrl:(NSString *) url pars:(NSDictionary *) pars auth:(NSString *) auth callback:(ZJAFNetworkingBlock) callback;
+ (void)postWithUrl:(NSString *) url pars:(NSDictionary *) pars callback:(ZJAFNetworkingBlock) callback;
+ (void)postWithUrl:(NSString *) url pars:(NSDictionary *) pars auth:(NSString *) auth callback:(ZJAFNetworkingBlock) callback;
@end
```

ZJAFNetworkingKit.m

```objc
#import <Foundation/Foundation.h>
#import "ZJAFNetworkingKit.h"

@implementation ZJAFNetworkingKit

+ (void)saveCookies{
    NSData *cookiesData = [NSKeyedArchiver archivedDataWithRootObject: [[NSHTTPCookieStorage sharedHTTPCookieStorage] cookies]];
    NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
    [defaults setObject: cookiesData forKey: @"sessionCookies"];
    [defaults synchronize];
    
}
+ (void)loadCookies{
    NSArray *cookies = [NSKeyedUnarchiver unarchiveObjectWithData: [[NSUserDefaults standardUserDefaults] objectForKey: @"sessionCookies"]];
    NSHTTPCookieStorage *cookieStorage = [NSHTTPCookieStorage sharedHTTPCookieStorage];
    
    for (NSHTTPCookie *cookie in cookies){
        [cookieStorage setCookie: cookie];
    }
}



+ (void)getWithUrl:(NSString *) url pars:(NSDictionary *) pars callback:(ZJAFNetworkingBlock) callback{
    [ZJAFNetworkingKit getWithUrl:url pars:pars auth:nil callback:callback];
}

+ (void)getWithUrl:(NSString *)url pars:(NSDictionary *)pars auth:(NSString *)auth callback:(ZJAFNetworkingBlock)callback{
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    //manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    if(auth){
        [manager.requestSerializer setValue:[NSString stringWithFormat:@"%@ %@", @"Bearer", auth] forHTTPHeaderField:@"Authorization"];
    }
    
    //GET/POST
    [manager GET:url
       parameters:pars
         progress:^(NSProgress * _Nonnull downloadProgress) {
             
         }
          success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
              callback(true,responseObject,nil);
          }
          failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull   error) {
              callback(false,nil,error);
          }];
}

+ (void)postWithUrl:(NSString *)url pars:(NSDictionary *)pars auth:(NSString *)auth callback:(ZJAFNetworkingBlock)callback{
    AFHTTPSessionManager *manager = [AFHTTPSessionManager manager];
    //manager.responseSerializer = [AFHTTPResponseSerializer serializer];
    if(auth){
        [manager.requestSerializer setValue:[NSString stringWithFormat:@"%@ %@", @"Bearer", auth] forHTTPHeaderField:@"Authorization"];
    }
    
    //GET/POST
    [manager POST:url
       parameters:pars
         progress:^(NSProgress * _Nonnull downloadProgress) {
             
         }
          success:^(NSURLSessionDataTask * _Nonnull task, id  _Nullable responseObject) {
              callback(true,responseObject,nil);
          }
          failure:^(NSURLSessionDataTask * _Nullable task, NSError * _Nonnull   error) {
              callback(false,nil,error);
          }];
}

+ (void)postWithUrl:(NSString *)url pars:(NSDictionary *)pars callback:(ZJAFNetworkingBlock)callback{
    [ZJAFNetworkingKit postWithUrl:url pars:pars auth:nil callback:callback];
}

@end
```

### 简单使用

实体类

ZJUser.h

```objc
#import <objc/NSObject.h>

@interface ZJUser : NSObject
@property(readwrite,nonatomic,assign) int userId;
@property(nonatomic,copy)NSString* name;
@end
```

ZJUser.m

```objc
#import <Foundation/Foundation.h>
#import "ZJUser.h"

@implementation ZJUser

@end
```

ZJResult.h

```objc
#import <objc/NSObject.h>

@interface ZJResult<objectType:NSObject *> : NSObject
@property(nonatomic,copy)NSString* state;
@property(nonatomic,copy)NSString* message;
@property(nonatomic,strong)objectType data;
@end
```

ZJResult.m

```objc
#import <Foundation/Foundation.h>
#import "ZJResult.h"

@implementation ZJResult

@end
```

配合YYModel的用法

```objc
NSMutableDictionary *parametersDic = [NSMutableDictionary dictionary];
//往字典里面添加需要提交的参数
[parametersDic setObject:userName forKey:@"userName"];
[parametersDic setObject:userPwd forKey:@"password"];
    
    
[ZJAFNetworkingKit postWithUrl:ZJAPI_USERLOGIN pars:parametersDic callback:^(bool success, id responseObject, NSError *error) {
    if(success){
        ZJResult<ZJUser *> *result = [ZJResult<ZJUser *> yy_modelWithJSON:responseObject];
        result.data = [ZJUser yy_modelWithJSON:responseObject[@"data"]];
        NSLog(@"%@",result.message);
        NSLog(@"%@",result.data.name);
    }else{
        NSLog(@"%@",error);  //这里打印错误信息
    }
}];
```