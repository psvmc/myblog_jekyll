---

layout: post
title: iOS View添加点击事件
description: iOS View添加点击事件
keywords: ios
category: ios

---

## 单击

```swift
self.showImageView.isUserInteractionEnabled = true;
    
let tapImgOnce = UITapGestureRecognizer.init(target: self, action: #selector(tapImgViewHandle(image:)))
tapImgOnce.numberOfTapsRequired = 1;
tapImgOnce.numberOfTouchesRequired = 1;
self.showImageView.addGestureRecognizer(tapImgOnce)
```

调用的事件

```swift
@objc func tapImgViewHandle(image:UIImageView){

}
```

## 双击

```swift
let tapImgTwice = UITapGestureRecognizer.init(target: self, action: #selector(tapImgViewHandleTwice(image:)))
tapImgTwice.numberOfTapsRequired = 2;
tapImgTwice.numberOfTouchesRequired = 1;
self.showImageView.addGestureRecognizer(tapImgTwice)
```


双击时使单击事件失效

```swift
tapImgOnce.require(toFail: tapImgTwice);
```