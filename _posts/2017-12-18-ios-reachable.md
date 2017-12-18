---

layout: post
title: iOS 判断监听网络状态
description: iOS 判断监听网络状态
keywords: ios
category: ios

---

# 前言

iOS 常用的用于监听网络变化的有两个库[`Reachability`](https://github.com/tonymillion/Reachability)和[RealReachability](https://github.com/dustturtle/RealReachability)

## Reachability的用法

官方说的用原来的类名会导致应用上架不通过，解决方法是修改类名。
所以这里修改为`ZJReachability`

### 监听网络状态(Notification形式)

```swift
var reach:ZJReachability?;

func initReachable(){
    self.reach = ZJReachability.forInternetConnection()
    NotificationCenter.default.addObserver(
        self,
        selector: #selector(reachabilityChanged),
        name: NSNotification.Name.reachabilityChanged,
        object: nil
    )
    
    self.reach!.startNotifier()
}

@objc func reachabilityChanged(notification: NSNotification) {
    if self.reach!.isReachableViaWiFi() {
        print("-->Wifi网络可用<--")
    }else if(self.reach!.isReachableViaWWAN()){
        print("-->蜂窝网络可用<--")
    } else {
        print("-->网络不可用<--")
    }
}
```

### 监听网络状态(Block形式)

```swift
var reach:ZJReachability?;

func initReachable(){
    self.reach = ZJReachability.forInternetConnection()
    self.reach?.reachableBlock = {
        (reach: ZJReachability?) -> Void in
        DispatchQueue.main.async {
            if(reach!.isReachableViaWiFi()){
                print("Wifi可用!")
            }else if(reach!.isReachableViaWWAN()){
                print("WWAN可用!")
            }
            
        }
    }
    
    self.reach!.unreachableBlock = {
        (reach: ZJReachability?) -> Void in
        print("网络不可用!")
    }
    
    self.reach!.startNotifier()
}
```

### 判断网络状态

```swift
self.reach = ZJReachability.forInternetConnection()
if self.reach!.isReachableViaWiFi() {
    print("-->Wifi网络可用<--")
}else if(self.reach!.isReachableViaWWAN()){
    print("-->蜂窝网络可用<--")
} else {
    print("-->网络不可用<--")
}
```

### 注意点

生成对象实例的时候 可以按下面的方式写,但是这样会导致回调方法会执行两次 所以

+ 监听网络变化状态时不能自定义域名  
+ 判断网络状态的时候才自定义域名

```swift
self.reach = ZJReachability.init(hostName: "www.baidu.com")
```

另外上面监听变化的事件,在初始化后是不会自动调用,之后网络状态变化才会调用

## RealReachability的用法

### 监听网络状态(Notification形式)

```swift
var reach2:RealReachability?;

func initReachable2(){
    self.reach2 = RealReachability.sharedInstance();
    self.reach2?.hostForPing = "www.baidu.com"
    NotificationCenter.default.addObserver(
        self,
        selector: #selector(reachabilityChanged),
        name: NSNotification.Name.realReachabilityChanged,
        object: nil
    )
    self.reach2?.startNotifier();
}
    
@objc func reachabilityChanged(notification: NSNotification) {
    let status = self.reach2!.currentReachabilityStatus();
    if(status == .RealStatusViaWiFi){
        print("-->Wifi网络可用<--")
    }else if(status == .RealStatusViaWWAN){
        print("-->蜂窝网络可用<--")
    }else{
        print("-->网络不可用<--")
    }
}
```

### 监听网络状态(Block形式)

它的Block形式 我在测试时返回的状态不正确 老是显示`网络不可用` 就不推荐使用了


### 判断网络状态

因为这个组件的原理是`ping`服务器。所以当我们初始化对象后就直接获取状态的话，是无法获取的，得到的结果一定是`网络不可用`，因此我们必须延迟点时间再获取，下面的代码就是延迟了`2s`，正好在这`2s`内用来显示启动页

```swift
//初始化
self.initReachable2();
//延迟2s
Thread.sleep(forTimeInterval: 2.0)
//获取状态
let status = self.reach2!.currentReachabilityStatus();
if(status == .RealStatusViaWiFi){
    print("-->Wifi网络可用<--")
}else if(status == .RealStatusViaWWAN){
    print("-->蜂窝网络可用<--")
}else{
    print("-->网络不可用<--")
}
```

## 对比

两种方式各有利弊 

+ `Reachability`效率高 但是如果连着`Wifi`却没有网的状况无法判断
+ `RealReachability`效率低 能判断连着`Wifi`却没有网的状况

但是我还是选择`Reachability` 因为

+ 使用的人多
+ `RealReachability`在网络经常丢包的情况下经常判断有误
