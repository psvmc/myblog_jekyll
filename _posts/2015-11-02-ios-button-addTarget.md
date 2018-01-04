---

layout: post
title: iOS按钮事件传參的二种方式
description: iOS按钮事件传參的二种方式
keywords: swift ios event
categories: 
        - ios
        - event

---

## 经典方式

添加变量

```
var buttonPars:[Int:IndexPath] = [:];
```

最常用的方式是直接给button设置tag

```swift
cell.actionButton.addTarget(self, action: #selector(actionButtonClick(button:)), for: UIControlEvents.touchUpInside)
let tagNum = indexPath.section*1000000 + indexPath.row;
cell.actionButton.tag = tagNum;
self.buttonPars[tagNum] = indexPath;
```
点击事件

```swift
@objc func actionButtonClick(button:UIButton){
    print("button.tag:\(button.tag)");
    if let indexPath = self.buttonPars[button.tag]{
        print("section:\(indexPath.section)");
        print("row:\(indexPath.row)");
    }
}
```

## 牛掰方式

iOS牛掰在可以修改运行时 可以直接绑定两个对象  
具体代码如下

```swift
class SonghuoViewController: UIViewController{
	//定义静态变量
	static var action = "action";

	func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
	   let  cell = tableView.dequeueReusableCellWithIdentifier("songhuoCell", forIndexPath: indexPath) as! SonghuoTableViewCell;
	   cell.actionButton.addTarget(self, action: #selector(actionButtonClick(button:)), forControlEvents: UIControlEvents.TouchUpInside);
	   
	   //创建关联
	   objc_setAssociatedObject(cell.actionButton, &SonghuoViewController.action, indexPath, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC);
	   return cell;
	}
	
	@objc func actionButtonClick(button:UIButton){
		//获取关联的对象
	   if let indexPath = objc_getAssociatedObject(button, &SonghuoViewController.action) as? NSIndexPath{
	   	  print("section:\(indexPath.section)");
	   	  print("row:\(indexPath.row)");
	   }	   
	}
}
```

### 创建关联

```swift
objc_setAssociatedObject(cell.actionButton, &SonghuoViewController.action, indexPath, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC);
```

该函数需要四个参数：源对象，关键字，关联的对象和一个关联策略  
 
+ 关键字是一个void类型的指针。每一个关联的关键字必须是唯一的。通常都是会采用静态变量来作为关键字。
+ 关联策略表明了相关的对象是通过赋值，保留引用还是复制的方式进行关联的；还有这种关联是原子的还是非原子的。  
  这里的关联策略和声明属性时的很类似。这种关联策略是通过使用预先定义好的常量来表示的。

### 获取关联对象

```swift
objc_getAssociatedObject(button, &SonghuoViewController.action)
```

该函数需要两个参数：源对象，关键字

### 删除关联

传入nil即可  

```swift
objc_setAssociatedObject(cell.actionButton, &SonghuoViewController.action, nil, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC);
```

