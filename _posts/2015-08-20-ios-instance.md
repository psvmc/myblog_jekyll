---

layout: post
title: iOS对象实例化
description: iOS对象实例化
keywords: ios,实例化
categories: ios swift

---

### 实例化TableCell
在设置delegate之前注册xib

```swift
self.tableView.registerNib(UINib.init(nibName: "ImageLabelTableViewCell", bundle: nil), forCellReuseIdentifier: "imageLabelCell");
```
实例化Cell

```swift
let  cell = tableView.dequeueReusableCellWithIdentifier("imageLabelCell", forIndexPath: indexPath) as! ImageLabelTableViewCell;
```
如果用的storybord中的tableview的cell直接用`dequeueReusableCellWithIdentifier`方法就行了  
注意`dequeueReusableCellWithIdentifier`方法是从已经实例化的cell中查找id为`textLeftCell`的对象并进行拷贝 


### 实例化视图控制器
从storyboard中

```swift
self.storyboard?.instantiateViewControllerWithIdentifier("renwuMy") as! RenwuMyViewController;
```

### 实例化UICollectionCell

在设置delegate之前注册xib

```swift
collectionView.registerNib(UINib.init(nibName: "MainBigCollectionViewCell", bundle: nil), forCellWithReuseIdentifier: "mainBigCollCell");
```
实例化Cell

```swift
let cell = collectionView.dequeueReusableCellWithReuseIdentifier("mainBigCollCell", forIndexPath: indexPath) as! MainBigCollectionViewCell;
```

### 从xib中实例化对象
```swift
let cell = NSBundle.mainBundle().loadNibNamed("FuImageLabelTableViewCell", owner: self, options: nil).first as! FuImageLabelTableViewCell;
```

