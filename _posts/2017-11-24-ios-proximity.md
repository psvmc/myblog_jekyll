---

layout: post
title: iOS听筒和外放切换
description: iOS听筒和外放切换
keywords: ios
category: ios

---

本文语法为`Swift4`

## 代码

主要涉及到距离传感器的调用

```swift
func addProximityMonitoring(){
    UIDevice.current.isProximityMonitoringEnabled = true;
    if(UIDevice.current.isProximityMonitoringEnabled){
        NotificationCenter.default.addObserver(self, selector: #selector(ChatViewController.sensorStateChange(_:)), name: NSNotification.Name.UIDeviceProximityStateDidChange, object: nil);
    }
}
    
func removeProximityMonitoring(){
    UIDevice.current.isProximityMonitoringEnabled = true;
    if(UIDevice.current.isProximityMonitoringEnabled){
        UIDevice.current.isProximityMonitoringEnabled = false;
        NotificationCenter.default.removeObserver(self, name: NSNotification.Name.UIDeviceProximityStateDidChange, object: nil);
    }
}
    
@objc func sensorStateChange(_ notification:NotificationCenter){
    do{
        if(UIDevice.current.proximityState){
            try AVAudioSession.sharedInstance().setCategory(AVAudioSessionCategoryPlayAndRecord);
        }else{
            try AVAudioSession.sharedInstance().setCategory(AVAudioSessionCategoryPlayback);
        }
    }catch{
        
    }
}
```