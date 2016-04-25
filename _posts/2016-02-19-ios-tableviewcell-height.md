---

layout: post
title: iOS 设置tableViewCell的高度
description: iOS 设置tableViewCell的高度
keywords: ios
category: ios

---

## 前言

iOS tableView的cell在显示之前必须获取cell的高度，如果cell的高度都一样，统一设置就行了，但是cell的高度不统一的话就要一一设置了，在ios8之前，需要自己手动去计算，iOS之后就方便多了

### iOS8以下(不包含iOS8)
定义全局变量

```swift
//用于缓存计算高度的cell
var offscreenCells:[String:AnyObject] = [:];
```
保存计算高度的Cell实例  

```swift
let cell = NSBundle.mainBundle().loadNibNamed("PingjiaTableViewCell", owner: nil, options: nil)[0] as! PingjiaTableViewCell;
self.offscreenCells["PingjiaTableViewCell"] = cell;
```
计算高度

```swift
func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
   let item = tableItem[indexPath.section][indexPath.row];
   let cell = self.offscreenCells["PingjiaTableViewCell"] as! PingjiaTableViewCell;
   cell.pingjiaLabel.text = item["text"];
   //不定高度的label的高度
   let textHeight = cell.pingjiaLabel.sizeThatFits(CGSizeMake(cell.pingjiaLabel.frame.size.width, CGFloat(FLT_MAX))).height;
   //把label当成一行所得到的高度
   let minHeight = cell.contentView.systemLayoutSizeFittingSize(UILayoutFittingCompressedSize).height + 1;
   return textHeight + minHeight - 10;
}
```

### iOS8以上(包含iOS8)

添加一下两个属性就行了

```swift
self.tableView.estimatedRowHeight = 44.0;
self.tableView.rowHeight = UITableViewAutomaticDimension;
```
去掉下面的代理方法

```swift
func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
    return 50;
}
```

#### 坑

这样做有一个坑 在网上找了好久没找到解决方法，试了好久终于找到了解决方法   

假如`UITableViewCell`中就放一个`view` 设置该`view`以下约束

```swift
宽度和高度(假设为宽100 高100)
水平居中
距离顶部距离(=10)
距离底部距离(>=10)
```

这样设置之后`UITableViewAutomaticDimension`就可以算出该`cell`的高度并正确显示，但是控制台老是报错误  

```swift
Probably at least one of the constraints in the following list is one you don't want
```

就是说你约束多了，但是明明不多啊  
是不多 是系统给你加的  
`cell`的高度你是没加，系统估算高度为`120`，就自己加了该约束，这样约束就多了，所以就报错了，怎样解决呢，又不能删除原有约束  

这种情况`约束的优先级(Priority)`就起作用了，一般我们添加约束优先级默认都是1000，系统自己添加的这个约束也是`1000`，我们只要降低我们自己`view`高度约束的`优先级`就行了，设置高度的约束`优先级`为`750`，这样当系统估算后添加估算高度后，我们自己设置的高度就不起作用了。

