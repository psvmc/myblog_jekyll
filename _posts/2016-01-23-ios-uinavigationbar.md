---

layout: post
title: iOS组件系列之UINavigationBar与UISearchBar
description: iOS组件系列之UINavigationBar与UISearchBar
keywords: ios
category: ios

---
### 设置UINavigationBar的titleView和UISearchBar背景透明
```swift
self.titleSearchBar = UISearchBar(frame: CGRectMake(0,0,200,44));
self.titleSearchBar.backgroundColor = UIColor.clearColor();
self.titleSearchBar.barStyle = UIBarStyle.BlackTranslucent;
self.titleSearchBar.placeholder = "搜索你感兴趣的主题和回复";
for sView in self.titleSearchBar.subviews[0].subviews{
    if(sView.isKindOfClass(NSClassFromString("UISearchBarBackground")!)){
        sView.removeFromSuperview();
    }
}
self.titleSearchBar.delegate = self;
    
self.navigationItem.titleView = self.titleSearchBar;
```