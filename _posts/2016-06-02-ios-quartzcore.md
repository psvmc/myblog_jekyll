---

layout: post
title: iOS Quartz2D相关方法
description: iOS Quartz2D相关方法
keywords: ios
category: ios

---


## 什么是Quartz2D?

Quartz 2D是一个二维绘图引擎，同时支持iOS和Mac系统

Quartz 2D能完成的工作

+ 绘制图形 : 线条\三角形\矩形\圆\弧等
+ 绘制文字
+ 绘制\生成图片(图像)
+ 读取\生成PDF
+ 截图\裁剪图片
+ 自定义UI控件

## Quartz2D在iOS开发中的价值

iOS中，大部分控件都是Quartz2D绘制出来的

+ 绘制一些系统UIKit框架中不好展示的内容，例如饼图
+ 自定义一些控件
+ 不添加UI控件的情况下，使UI内容更丰富
+ .....

View内部有个`layer`（图层）属性，`drawRect:`方法中取得的是一个`Layer Graphics Context`，因此，绘制的东西其实是绘制到`view`的`layer`上去了

## 常用方法

### CGPathAddLineToPoint

这个方法主要是画一条线  但是必须指定起点

```swift
//移动画笔位置
CGPathMoveToPoint(path, &transform, 100, 50);
CGPathAddLineToPoint(path, &transform, 100, 100);
```

上面`&transform`其实就是指定参照点坐标，为空时相当于(0,0)  
第一行是指定线的起点 为(100,50) 
第二行就是向(100,100)画线


### CGPathAddArc

这个方法是画一条弧线

```swift
CGPathAddArc(path, &transform, x1, y1, r, CGFloat(M_PI), 2*CGFloat(M_PI), false);
```

就是以`&transform`为参照点 以`(x1,y1)`为中心点 `r`为半径 从`PI`到`2PI` 顺时针(`false`) 画半圆

### CGPathAddArcToPoint

这个是画一条线附带弧线  
这个方法相比前两个理解起来稍难  

可以看这个[解释](http://stackoverflow.com/questions/78127/cgpathaddarc-vs-cgpathaddarctopoint)

```swift
CGPathMoveToPoint(path, &transform, x1, y1);
CGPathAddArcToPoint(path, &transform, x2, y2, x3, y3, r);
```

这样理解 起始点为`(x1,y1)` 终点为`(x3,y3)`交叉点为`(x2,y2)` 画一个半径为`r`的半圆

注意声称的线只有起始点到交叉处形成的弧线 `不包含弧线到终点`的部分

## 示例

### 吃豆人形状

```swift
func test01(){
    UIGraphicsBeginImageContext(self.view.bounds.size);
    let gc = UIGraphicsGetCurrentContext();
    
    //参照点坐标
    var transform = CGAffineTransformMakeTranslation(0,0);
    
    let path = CGPathCreateMutable();
    
    //圆中心点为(100,100) 半径50  起始角度为0 旋转1.5PI 顺时针
    //这时候画笔的起始点为(150,100) 画完之后停留在(100,50)
    CGPathAddArc(path, &transform, 100, 100, 50, 0, 1.5*CGFloat(M_PI), false);
    
    //从当前点到(100,100)画线
    CGPathAddLineToPoint(path, &transform, 100, 100);
    
    //从当前点到(150，100)画线
    CGPathAddLineToPoint(path, &transform, 150, 100);
    
    //移动画笔位置
    CGPathMoveToPoint(path, &transform, 100, 50);
    
    CGContextAddPath(gc, path);
    UIColor.grayColor().setFill();
    UIColor.orangeColor().setStroke();
    
    CGContextSetLineWidth(gc, 1);
    CGContextDrawPath(gc, CGPathDrawingMode.FillStroke);
    
    let image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    let imageView = UIImageView(image: image);
    self.view.addSubview(imageView);
}
```

### 漏斗状

```swift
func test02(){
    UIGraphicsBeginImageContext(self.view.bounds.size);
    let gc = UIGraphicsGetCurrentContext();
    
    //参照点坐标
    var transform = CGAffineTransformMakeTranslation(50,100);
    
    let path = CGPathCreateMutable();
    //初始点为(0, 0)
    CGPathMoveToPoint(path, &transform, 0, 0);
    
    //这样理解 起始点为(0,0) 终点为（100，0）交叉点为(50,200) 画一个半径为10的半圆
    CGPathAddArcToPoint(path, &transform, 50, 200, 100, 0, 10);
    
    
    //CGPathAddArcToPoint会在交点中停止，所以需要再次调用CGPathAddLineToPoint画出下面的线
    CGPathAddLineToPoint(path, &transform, 100, 0);
    
    CGContextAddPath(gc, path);
    UIColor.grayColor().setFill();
    UIColor.orangeColor().setStroke();
    
    CGContextSetLineWidth(gc, 1);
    CGContextDrawPath(gc, CGPathDrawingMode.FillStroke);
    
    let image = UIGraphicsGetImageFromCurrentImageContext();
    UIGraphicsEndImageContext();
    
    let imageView = UIImageView(image: image);
    self.view.addSubview(imageView);
}
```