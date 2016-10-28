---

layout: post
title: iOS对象实例化
description: iOS对象实例化
keywords: ios,实例化
categories: ios swift

---

### 实例化TableCell
在设置delegate之前注册xib

Swift

```swift
self.tableView.registerNib(UINib.init(nibName: "ImageLabelTableViewCell", bundle: nil), forCellReuseIdentifier: "ImageLabelTableViewCell");
```

Swift3

```swift
self.tableView.register(UINib.init(nibName: "IndexTableViewCell", bundle: nil), forCellReuseIdentifier: "IndexTableViewCell");
```

OC

```objc
[self.tableView registerNib:[UINib nibWithNibName:@"ImageLabelTableViewCell" bundle:nil] forCellReuseIdentifier:@"ImageLabelTableViewCell"];
```

实例化Cell

Swift

```swift
let  cell = tableView.dequeueReusableCellWithIdentifier("ImageLabelTableViewCell", forIndexPath: indexPath) as! ImageLabelTableViewCell;
```

Swift3

```swift
let  cell = tableView.dequeueReusableCell(withIdentifier: "IndexTableViewCell", for: indexPath) as! IndexTableViewCell;
```

OC

```objc
ImageLabelTableViewCell *cell = [self.tableView dequeueReusableCellWithIdentifier:@"ImageLabelTableViewCell" forIndexPath:indexPath];
```

如果用的storybord中的tableview的cell直接用`dequeueReusableCellWithIdentifier`方法就行了  
注意`dequeueReusableCellWithIdentifier`方法是从已经实例化的cell中查找id为`textLeftCell`的对象并进行拷贝 


### 实例化视图控制器
从storyboard中

Swift

```swift
self.storyboard?.instantiateViewControllerWithIdentifier("renwuMy") as! RenwuMyViewController;
```

### 根据xib实例化控制器

```objc
RenwuMyViewController * renwuMy Controller = [[RenwuMyViewController alloc] initWithNibName:@"RenwuMyViewController" bundle:nil];
```

### 实例化UICollectionCell

在设置delegate之前注册xib

Swift

```swift
self.collectionView.registerNib(UINib.init(nibName: "MyCell", bundle: nil), forCellWithReuseIdentifier: "MyCell");
```

Objc

```objc
[self.collectionView registerNib:[UINib nibWithNibName:@"MyCell" bundle:nil] forCellWithReuseIdentifier:@"MyCell"];
```

实例化Cell

Swift

```swift
let cell = self.collectionView.dequeueReusableCellWithReuseIdentifier("MyCell", forIndexPath: indexPath) as! MyCell;
```

OC

```objc
MyCell *cell = [self.collectionView dequeueReusableCellWithReuseIdentifier:@"MyCell" forIndexPath:indexPath];
```

### 从xib中实例化对象
```swift
let cell = NSBundle.mainBundle().loadNibNamed("FuImageLabelTableViewCell", owner: self, options: nil).first as! FuImageLabelTableViewCell;
```

