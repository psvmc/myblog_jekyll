---

layout: post
title: iOS自动布局
description: iOS自动布局
keywords: iOS
categories: swift ios

---

### 简单示例

```swift
override func viewDidLoad() {
   super.viewDidLoad()
   baiduMap =  BMKMapView(forAutoLayout: {}())
   self.mapView.addSubview(baiduMap);
   self.mapView.addConstraints(self.layoutConstraints())
  
}
    
func layoutConstraints() -> [NSLayoutConstraint]{
   let views = ["map": self.baiduMap ]
   let metrics = ["margin": 0]
   var result = NSLayoutConstraint.constraintsWithVisualFormat("H:|-(margin)-[map]-(margin)-|", options:NSLayoutFormatOptions.AlignAllTop, metrics: metrics, views: views)
   result += NSLayoutConstraint.constraintsWithVisualFormat("V:|-(margin)-[map]-(margin)-|", options:NSLayoutFormatOptions.AlignAllLeft , metrics:metrics, views: views);
   return result
}
```

