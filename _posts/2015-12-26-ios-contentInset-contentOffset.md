---

layout: post
title: contentInset,contentOffset等概念的理解
description: contentInset,contentOffset等概念的理解
keywords: ios
category: ios

---
### frame, bounds, center

看一下源码就知道frame和bounds的区别了

```c
-(CGRect)frame{
    return CGRectMake(self.frame.origin.x,self.frame.origin.y,self.frame.size.width,self.frame.size.height);
}
-(CGRect)bounds{
    return CGRectMake(0,0,self.frame.size.width,self.frame.size.height);
}
```

`frame`: 该view在父view坐标系统中的位置和大小。（参照点是：`父亲的坐标系统`）  
`bounds`：该view在本地坐标系统中的位置和大小。（参照点是：本地坐标系统，就相当于`View自己的坐标系统`，以0,0点为起点）  
`center`：该view的中心点在父view坐标系统中的位置和大小。（参照点是：`父亲的坐标系统`）

`origin`是`frame`或`bounds`的左上角坐标

### contentInset和contentOffset
`contentSize`是contentView的大小  

`contentInset`就相当于html中的padding，是view相对于子view的距离有四个属性  
例如UIEdgeInsets(top: 10.0, left: 20.0, bottom: 30.0, right: 40.0)   

`contentOffset`是scrollview当前显示区域顶点相对于frame顶点的偏移量


假如有一个ScrollView（`scrollViewA`），设置scrollViewA的`contentInset`为`UIEdgeInsets(top: 10.0, left: 20.0, bottom: 30.0, right: 40.0)`，  
那么  
`scrollViewA`的`bounds`为`(-20,-10)`  
`scrollViewA`的`contentOffset`为`(-20,-10)`  
在`scrollViewA`的内容滚动时`contentSize`是不变的  
`contentInset`也是不变的  
变得只是`contentOffset`和`bounds`  
并且`contentOffset`和`bounds`的值是一样的  
上拉`y`变大，下拉`y`变小  
左拉`x`变大，右拉`x`变小

可以这样想以`scrollViewA`的`左上角`为坐标系原点`y轴向上为正`，`x轴向左为正`，那么`contentOffset`和`bounds`就是`contentView`的`左上角`在该坐标系的坐标



