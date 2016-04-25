---

layout: post
title: iOS 点击通知打开对应页面
description: iOS 点击通知打开对应页面
keywords: ios
category: ios

---

## 通知被点击调用的方法
设备接到apns发来的通知，应用处理通知有以下几种情况：

1). 应用还没有加载

这时如果点击通知的显示按钮，会调用`didFinishLaunchingWithOptions`，不会调用`didReceiveRemoteNotification`方法。

如果关闭通知的，再点击应用，只会调用`didFinishLaunchingWithOptions`方法。

2). 应用在前台（foreground)

这时如果收到通知，会触发`didReceiveRemoteNotification`方法。

3).应用在后台

（1）此时如果收到通知，点击显示按钮，会调用`didReceiveRemoteNotification`方法。

（2）点击关闭再点击应用，则上面两个方法都不会被调用这时，会调用`applicationDidBecomeActive`

## 解决方法

根据上面的三种情况可以总结一下  
点击通知会根据app是否启动，未启用调用`didFinishLaunchingWithOptions`，启用调用`didReceiveRemoteNotification` 两种情况，针对这两种情况分别处理就行了

1) 应用未启动

```swift
//判断是否通过点击通知进入
if(launchOptions != nil){
    let remoteNotification = launchOptions![UIApplicationLaunchOptionsRemoteNotificationKey];
    if(remoteNotification != nil){
        let userInfo: [NSObject : AnyObject] = (remoteNotification as? [NSObject : AnyObject])!;
        let type = userInfo["type"] as? String
        if(type != nil && type! == "4"){
            LoadData.isLaunchedByNotification = true;
        }
    }
}
```

如上述代码所示在`didFinishLaunchingWithOptions`方法中进行判断是否通过点击通知进入app，设置全局变量，在需要跳转的页面根据全局变量进行跳转

2) 应用在前台或后台

在所有可跳转的页面添加消息的观察者

```swift
override func viewWillAppear(animated: Bool) {
    NSNotificationCenter.defaultCenter().addObserver(self, selector: "notificationPushView", name: "notificationPushView", object: nil);
}
    
override func viewWillDisappear(animated: Bool) {
    NSNotificationCenter.defaultCenter().removeObserver(self, name: "notificationPushView", object: nil);
}
```

以及对应的跳转方法

```swift
func notificationPushView(){
    //跳转页面
    self.performSegueWithIdentifier("songhuoSegue", sender: self);
}
```

在`didReceiveRemoteNotification`方法中，发送消息

```swift
NSNotificationCenter.defaultCenter().postNotificationName("notificationPushView", object: nil);
```

### 注意  
>添加观察者最好在`viewWillAppear`中添加 在`viewWillDisappear`中移除  否则每次接受到推送都会打开页面，当然也可以进行判断当前的页面已打开就不再打开  

>当然也可以不用通知去打开页面  像之前那种`定义全局变量进行判断`也是可以的

## App启动方法解析
```c
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions

```

说明：当应用程序启动时执行，应用程序启动入口。只在应用程序启动时执行一次。application参数用来获取应用程序的状态、变量等，值得注意的是字典参数：`(NSDictionary *)launchOptions`，该参数`存储程序启动的原因`。

1) 若用户直接启动，lauchOptions内无数据;

2) 若由其他应用程序通过openURL:启动，则`UIApplicationLaunchOptionsURLKey`对应的对象为启动URL（NSURL）,  
`UIApplicationLaunchOptionsSourceApplicationKey`对应启动的源应用程序的`bundle ID (NSString)`；

3) 若由本地通知启动，则`UIApplicationLaunchOptionsLocalNotificationKey`对应的是为启动应用程序的的本地通知对象`(UILocalNotification)`；

4) 若由远程通知启动，则`UIApplicationLaunchOptionsRemoteNotificationKey`对应的是启动应用程序的的远程通知信息`userInfo（NSDictionary）`；

5) 其他key还有`UIApplicationLaunchOptionsAnnotationKey`,`UIApplicationLaunchOptionsLocationKey`,
`UIApplicationLaunchOptionsNewsstandDownloadsKey`。  
如果要在启动时，做出一些区分，那就需要在下面的代码做处理。   
比如：应用可以被某个其它应用调起（作为该应用的子应用），要实现单点登录，那就需要在启动代码的地方做出合理的验证，并跳过登录。 

```c
- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{ 
    //由其他应用程序通过openURL:启动
    NSURL *url = [launchOptions objectForKey:UIApplicationLaunchOptionsURLKey]; 
    if(url){ 
    } 
    
    //由其他应用程序通过openURL:启动
    NSString *bundleId = [launchOptions objectForKey:UIApplicationLaunchOptionsSourceApplicationKey];
    if(bundleId){ 
    } 
    
    //由本地通知启动
    UILocalNotification * localNotify = [launchOptions objectForKey:UIApplicationLaunchOptionsLocalNotificationKey];
    if(localNotify){ 
    } 
    
    //由远程通知启动
    NSDictionary * userInfo = [launchOptions objectForKey:UIApplicationLaunchOptionsRemoteNotificationKey];
    if(userInfo){ 
    } 
}
```