---
layout: post
title: iOS Label加载HTML
description: iOS Label加载HTML
keywords: ios
categories: ios swift
---



## Label加载富文本

```swift
func getHtml(){
    guard let filePath = Bundle.main.path(forResource: "demo", ofType: "html") else{return}
    guard let data = NSData.init(contentsOfFile: filePath) as Data? else {return}
    guard let contentStr = String.init(data: data, encoding: String.Encoding.utf8) else{return}

    do{
        let attrStr = try NSAttributedString.init(data: contentStr.data(using: String.Encoding.unicode)!, options: [NSAttributedString.DocumentReadingOptionKey.documentType : NSAttributedString.DocumentType.html], documentAttributes: nil)
        self.htmlLabel.attributedText = attrStr
    }catch{
       print(error.localizedDescription)
    }
}
```

## 允许进行HTTP请求 加载网络图片

- 在`Info.plist`中添加`NSAppTransportSecurity`类型`Dictionary`。
- 在`NSAppTransportSecurity`下添加`NSAllowsArbitraryLoads`类型`Boolean`,值设为`YES`

或者直接添加一下配置

```xml
<key>NSAppTransportSecurity</key>
<dict>
	<key>NSAllowsArbitraryLoads</key>
	<true/>
</dict>
```

## 注意点

+ 加载图片的大小 不是按手机的像素尺寸  而是手机的尺寸(比如width:414px就是最大的宽度)
+ 图片无法添加点击操作 链接无法点击

## 猿题库作者的实现方式

[`iOS 开发进阶`](https://github.com/tangqiaoboy/iOS-Pro)