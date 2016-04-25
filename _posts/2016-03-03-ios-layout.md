---

layout: post
title: iOS layout相关方法
description: iOS layout相关方法
keywords: ios
category: ios

---


## 相关方法

+ layoutSubviews
+ layoutIfNeeded
+ setNeedsLayout
+ setNeedsDisplay
+ drawRect
+ sizeThatFits
+ sizeToFit

大概常用的上面几个，具体的应该还有别的。

### layoutSubviews

这个方法，默认没有做任何事情，需要子类进行重写 。 系统在很多时候会去调用这个方法：

+ 1.初始化不会触发`layoutSubviews`，但是如果设置了`不为CGRectZero的frame`的时候就会触发。
+ 2.`addSubview`会触发`layoutSubviews`
+ 3.`设置view的Frame`会触发`layoutSubviews`，当然前提是frame的值设置前后发生了变化
+ 4.`滚动UIScrollView`会触发layoutSubviews
+ 5.`旋转Screen`会触发父UIView上的layoutSubviews事件
+ 6.`改变UIView大小`的时候也会触发父UIView上的layoutSubviews事件


> 在苹果的官方文档中强调:   
> You should override this method only if the autoresizing behaviors of the subviews do not offer the behavior you want.layoutSubviews  
> 当我们在某个类的内部调整子视图位置时，需要调用。反过来的意思就是说：如果你想要在外部设置subviews的位置，就不要重写。



### setNeedsLayout

标记为需要重新布局，不立即刷新，但**layoutSubviews**一定会被调用配合**layoutIfNeeded**立即更新

### layoutIfNeeded

如果有需要刷新的标记，立即调用**layoutSubviews**进行布局。

假设有个UILabel  
添加它距离左边的距离约束为`left的constraint` 值为 `10`

现在我们想让它距左边的距离以动画形式改变为100

如果这么做

```swift
UIView.animateWithDuration(0.8, 
delay: 0, 
usingSpringWithDamping: 0.5, 
initialSpringVelocity: 0.5, 
options: UIViewAnimationOptions.AllowAnimatedContent, 
animations: {
            self.leftContrain.constant = 100
        }, completion: nil)
            
```

你会发现然并卵 。  
 
其实这句话`self.leftContrain.constant = 100`只是执行了`setNeedsLayout` 标记了需要重新布局，但是没有立即执行。所以我们需要在动画中调用这个方法`layoutIfNeeded`所以代码应该这么写

```swift
leftContrain.constant = 100
UIView.animateWithDuration(0.8, 
delay: 0, 
usingSpringWithDamping: 0.5, 
initialSpringVelocity: 0.5, 
options: UIViewAnimationOptions.AllowAnimatedContent, 
animations: {
    self.view.layoutIfNeeded() //立即实现布局
}, completion: nil)
```


所以上面不管写多少约束的改变，只需要在动画里调用一次`self.view.layoutIfNeeded()`,所有的都会已动画的方式 。  
如果一些变化不想动画 。在动画前执行`self.view.layoutIfNeeded()` 


### drawRect

这个方法是用来重绘的。

drawRect在以下情况下会被调用： 

+ 1、如果在**UIView**初始化时没有设置rect大小，将直接导致**drawRect**不被自动调用。drawRect调用是在`Controller->loadView`, `Controller->viewDidLoad` 两方法之后掉用的.所以不用担心在控制器中,这些View的**drawRect**就开始画了.这样可以在控制器中设置一些值给View(如果这些View draw的时候需要用到某些变量值).
+ 2、该方法在调用**sizeToFit**后被调用，所以可以先调用**sizeToFit**计算出size。然后系统自动调用**drawRect:**方法。
+ 3、通过设置**contentMode**属性值为**UIViewContentModeRedraw**。那么将在每次设置或更改**frame**的时候自动调用**drawRect:**。
+ 4、直接调用**setNeedsDisplay**，或者**setNeedsDisplayInRect:**触发**drawRect:**，但是有个前提条件是rect不能为0。
+ 以上1,2推荐；而3,4不提倡


drawRect方法使用注意点：

+ 1、若使用UIView绘图，只能在**drawRect:**方法中获取相应的contextRef并绘图。如果在其他方法中获取将获取到一个invalidate的ref并且不能用于画图。**drawRect:**方法不能手动显示调用，必须通过调用**setNeedsDisplay** 或者 **setNeedsDisplayInRect**，让系统自动调该方法。
+ 2、若使用**calayer**绘图，只能在**drawInContext:** 中（类似于drawRect）绘制，或者在delegate中的相应方法绘制。同样也是调用**setNeedDisplay**等间接调用以上方法
+ 3、若要实时画图，不能使用**gestureRecognizer**，只能使用**touchbegan**等方法来掉用**setNeedsDisplay**实时刷新屏幕 


### sizeToFit & sizeThatFits

+ **sizeToFit**会自动调用**sizeThatFits**方法；
+ **sizeToFit**不应该在子类中被重写，应该重写**sizeThatFits**
+ **sizeThatFits**传入的参数是receiver当前的size，返回一个适合的size
+ **sizeToFit**可以被手动直接调用
+ **sizeToFit**和**sizeThatFits**方法都没有递归，对subviews也不负责，只负责自己


假设

```swift
let label = UILabel(frame: CGRectMake(0,0,50,50));
label.font = UIFont.systemFontOfSize(20);
label.text = "好人一生平安";
let sizeThatFits = label.sizeThatFits(CGSizeZero);
print("宽度：\(sizeThatFits.width)  高度：\(sizeThatFits.height)");
print("实际宽度：\(label.frame.size.width)  实际高度：\(label.frame.size.height)");
label.sizeToFit();
print("实际宽度：\(label.frame.size.width)  实际高度：\(label.frame.size.height)");
```

打印的结果为

```swift
宽度：120.0     高度：24.0
实际宽度：50.0   实际高度：50.0
实际宽度：120.0  实际高度：24.0
```
有上面的例子可以看出

+ `sizeThatFits`  返回“最佳”大小以适应给定大小。不实际调整视图。
+ `sizeToFit` 会根据sizeThatFits返回的最佳大小进行调整视图。
