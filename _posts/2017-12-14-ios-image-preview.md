---

layout: post
title: iOS 图片预览 放大缩小的实现方式
description: iOS 图片预览 放大缩小的实现方式
keywords: ios
category: ios

---

## 原理

把`UIImageView`放到`UIScrollView`中 对`UIImageView`添加点击事件实现

## 具体代码

添加代理`UIScrollViewDelegate`

涉及的两个View

```swift
@IBOutlet weak var scrollView: UIScrollView!
@IBOutlet weak var showImageView: UIImageView!
```

添加事件

```swift
func addEvent(){
    self.scrollView.isMultipleTouchEnabled = true;
    self.scrollView.maximumZoomScale = 5.0;
    self.scrollView.minimumZoomScale = 1;
    self.scrollView.delegate = self;
    
    self.showImageView.isUserInteractionEnabled = true;
    
    let tapImgOnce = UITapGestureRecognizer.init(target: self, action: #selector(tapImgViewHandle(image:)))
    tapImgOnce.numberOfTapsRequired = 1;
    tapImgOnce.numberOfTouchesRequired = 1;
    self.showImageView.addGestureRecognizer(tapImgOnce)
    
    let tapImgTwice = UITapGestureRecognizer.init(target: self, action: #selector(tapImgViewHandleTwice(image:)))
    tapImgTwice.numberOfTapsRequired = 2;
    tapImgTwice.numberOfTouchesRequired = 1;
    self.showImageView.addGestureRecognizer(tapImgTwice)
    
    tapImgOnce.require(toFail: tapImgTwice);
}
@objc func tapImgViewHandle(image:UIImageView){
    self.dismiss(animated: false, completion: nil)
}
    
@objc func tapImgViewHandleTwice(image:UIImageView){
    if(self.scrollView.zoomScale > 1){
        self.scrollView.setZoomScale(1, animated: true)
    }else{
        self.scrollView.setZoomScale(3, animated: true)
    }
}
    
func viewForZooming(in scrollView: UIScrollView) -> UIView? {
    return self.showImageView;
}
```