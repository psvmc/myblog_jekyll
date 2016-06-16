---

layout: post
title: iOS 打印视图结构
description: iOS 打印视图结构
keywords: ios
category: ios

---


## 前言

iOS的组件都是封装好的，又没法看源代码，所以我们不容易知道组件的结构，所以我们可以遍历所有的视图，打印出来，来查看结构

```swift
/**
 打印层级结构
 - parameter superView: view
 - parameter level:     0
 */
static func printViewHierarchy(superView:UIView,level:Int? = 0) -> Void {
    let className = "\(superView.dynamicType)";
    let frame = "\(superView.frame)";
    for _ in 0 ..< level!{
        print("\t", terminator:"")
    }
    
    if let backgroundColor = superView.backgroundColor{
        print("\(className) \(frame) [背景色:\(backgroundColor)]")
    }else{
        print("\(className) \(frame) [背景色:透明]")
    }
    
    for sonView in superView.subviews{
        printViewHierarchy(sonView,level: level! + 1);
    }
}
```

