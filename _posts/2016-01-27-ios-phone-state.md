---

layout: post
title: iOS来电监控
description: iOS来电监控
keywords: ios
category: ios

---

## 实现方法

### 1) 添加框架和引用 

```swift
import CoreTelephony
```

### 2) 定义全局变量

```swift
var callCenter:CTCallCenter!;
``` 

### 3) 实例与监听

```swift
self.callCenter = CTCallCenter();
self.callCenter.callEventHandler = {
    (call:CTCall) in
    if(call.callState == CTCallStateDisconnected){
        print("断开通话")
    }else if(call.callState == CTCallStateConnected){
        print("正在通话")
    }else if(call.callState == CTCallStateIncoming){
        print("来电")
    }else if(call.callState == CTCallStateDialing){
        print("正在拨号")
    }
}
```
