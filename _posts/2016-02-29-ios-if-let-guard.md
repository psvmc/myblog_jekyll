---

layout: post
title: Swift中的if let guard
description: Swift中的if let guard
keywords: ios
category: ios

---


## 问题描述
之前是搞java，平常判断都是用的`if和else`进行判断，这样稍微复杂的逻辑就要`嵌套好多层`  

`swift 1.x`版本可以用`if let`稍微解决这个问题，`swift2.x` 则有了更好的解决方法`(guard)`，下面就用例子分别说明

## 例子

假设我们要根据`本地推送通知`中的`type`属性进行不同的处理，

三种不同的实现方式

### 只用if-else

```swift
func application(application: UIApplication, didReceiveLocalNotification notification: UILocalNotification) {
    print("接受本地推送")
    if(notification.userInfo != nil){
        let userinfo = notification.userInfo!;
        if(userinfo["type"] != nil){
            let type = userinfo["type"] as! String;
            if(type == "考勤"){
                
            }else{
            
            }
        }
    }
}
```

### if-let组合

```swift
func application(application: UIApplication, didReceiveLocalNotification notification: UILocalNotification) {
    print("接受本地推送")
    if let userInfo = notification.userInfo{
        if let type = userInfo["type"]{
            if((type as! String) == "考勤"){
                
            }else{
                
            }
        }
    }
}
```

### guard-let-else

```swift
func application(application: UIApplication, didReceiveLocalNotification notification: UILocalNotification) {
    print("接受本地推送")
    guard let userInfo = notification.userInfo else{
        return;
    }
    
    guard let type = userInfo["type"] else{
        return;
    }
    
    if((type as! String) == "考勤"){
        
    }else{
    
    }
}
```

### 总结

综上  我们可以发现  
`第二种`方法相对于`第一种`方法`嵌套关系虽没有改变`，但是`精简了判断是否为空的过程`  

`第三种`方法相对于`第二种`方法就`没了复杂的嵌套关系`, `guard`可以理解为`if`的意思，但`if`中定义的变量只能在`{}`中使用，`guard`中定义的变量则可以在`同级`使用
