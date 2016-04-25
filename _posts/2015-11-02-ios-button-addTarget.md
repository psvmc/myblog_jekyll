---

layout: post
title: iOS按钮事件传參
description: iOS按钮事件传參的二种方式
keywords: swift
categories: swift ios

---

### 经典方式
最常用的方式是直接给button设置tag

```swift
cell.luxianButton.tag = 101;
cell.luxianButton.addTarget(self, action: "luxianClick:", forControlEvents: UIControlEvents.TouchUpInside);
```
点击事件

```swift
func luxianClick(button:UIButton){
   let tag = button.tag;
   if(tag == 101){
   }else{
   }
}
```
要想传参数就可以定义一个全局的变量

```swift
var buttonPars = Dictionary<String,Dictionary<String,Int>>();
buttonPars[101] = ["section":1,"row":1];
```
这样的话就可以随意传值了

### 牛掰方式
iOS牛掰在可以修改运行时 可以直接绑定两个对象  
具体代码如下

```swift
class SonghuoViewController: UIViewController{
	//定义静态变量
	static var luxian = "luxian";

	func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
	   let  cell = tableView.dequeueReusableCellWithIdentifier("songhuoCell", forIndexPath: indexPath) as! SonghuoTableViewCell;
	   //创建关联
	   objc_setAssociatedObject(cell.luxianButton, &SonghuoViewController.luxian, indexPath, objc_AssociationPolicy.OBJC_ASSOCIATION_ASSIGN);
	   cell.luxianButton.addTarget(self, action: "luxianClick:", forControlEvents: UIControlEvents.TouchUpInside);
	   return cell;
	}
	
	func luxianClick(button:UIButton){
		//获取关联的对象
	   let indexPath = (objc_getAssociatedObject(button, &SonghuoViewController.luxian) as! NSIndexPath);
	   print("section:\(indexPath.section)");
	   print("row:\(indexPath.row)");
	}
}
```

#### 创建关联
```swift
objc_setAssociatedObject(cell.luxianButton, &SonghuoViewController.luxian, indexPath, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC);
```

该函数需要四个参数：源对象，关键字，关联的对象和一个关联策略  
 
+ 关键字是一个void类型的指针。每一个关联的关键字必须是唯一的。通常都是会采用静态变量来作为关键字。
+ 关联策略表明了相关的对象是通过赋值，保留引用还是复制的方式进行关联的；还有这种关联是原子的还是非原子的。这里的关联策略和声明属性时的很类似。这种关联策略是通过使用预先定义好的常量来表示的。

#### 获取关联对象
```swift
objc_getAssociatedObject(button, &SonghuoViewController.luxian)
```
该函数需要两个参数：源对象，关键字

#### 删除关联
传入nil即可  
```swift
objc_setAssociatedObject(cell.luxianButton, &SonghuoViewController.luxian, nil, objc_AssociationPolicy.OBJC_ASSOCIATION_RETAIN_NONATOMIC);
```

