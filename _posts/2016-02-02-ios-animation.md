---

layout: post
title: iOS Core Animation的用法
description: iOS Core Animation的用法
keywords: ios
category: ios

---


## 简介
在iOS中，图形可分为以下几个层次：
![](https://raw.githubusercontent.com/psvmc/psvmc.github.io/master/images/ios/animation/Animation.png)

越上层，封装程度越高，动画实现越简洁越简单，但是自由度越低；反之亦然。本文着重介绍Core Animation层的基本动画实现方案。

在iOS中，展示动画可以类比于显示生活中的“拍电影”。拍电影有三大要素：演员+剧本+开拍，概念类比如下：

```swift
演员--->CALayer，规定电影的主角是谁
剧本--->CAAnimation，规定电影该怎么演，怎么走，怎么变换
开拍--->AddAnimation，开始执行
```
## 概念

### CALayer是什么呢？

`CALayer`是个与`UIView`很类似的概念，同样有`layer,sublayer...`，同样有`backgroundColor`、`frame`等相似的属性，我们可以将`UIView`看做一种特殊的`CALayer`，只不过`UIView`可以响应事件而已。一般来说，`layer`可以有两种用途，二者不互相冲突：一是对view相关属性的设置，包括圆角、阴影、边框等参数；二是实现对view的动画操控。因此对一个view进行`core animation动画`，本质上是对该`view`的`layer`进行动画操纵。


### CAAnimation是什么呢？

CAAnimation可分为以下四种：

1. CABasicAnimation  
通过设定起始点，终点，时间，动画会沿着你这设定点进行移动。可以看做特殊的CAKeyFrameAnimation

2. CAAnimationGroup  
Group也就是组合的意思，就是把对这个Layer的所有动画都组合起来。PS：一个layer设定了很多动画，他们都会同时执行，如何按顺序执行我到时候再讲。

3. CATransition  
这个就是苹果帮开发者封装好的一些动画

4. CAKeyframeAnimation  
Keyframe顾名思义就是关键点的frame，你可以通过设定CALayer的始点、中间关键点、终点的frame，时间，动画会沿你设定的轨迹进行移动

相关类

1. CATransaction   
  事务类,可以对多个layer的属性同时进行修改.它分隐式事务,和显式事务


## CABasicAnimation 单个动画


```swift
override func viewDidLoad() {
    super.viewDidLoad()
    self.initScaleLayer()
}

func initScaleLayer(){
    //演员
    let  scaleLayer = CALayer();
    scaleLayer.backgroundColor = UIColor.grayColor().CGColor;
    scaleLayer.frame = CGRectMake(60, 100, 50, 50);
    scaleLayer.cornerRadius = 25;
    self.view.layer.addSublayer(scaleLayer);
    
    //设定剧本
    let scaleAnimation = CABasicAnimation(keyPath: "transform.rotation.x");
    scaleAnimation.fromValue = NSNumber(float: 0)
    scaleAnimation.toValue = NSNumber(float: 6.0 * Float(M_1_PI))
    scaleAnimation.autoreverses = true;
    scaleAnimation.fillMode = kCAFillModeForwards;
    scaleAnimation.repeatCount = MAXFLOAT;
    scaleAnimation.duration = 2;
    
    //开演
    scaleLayer.addAnimation(scaleAnimation, forKey: "scaleAnimation")
}
```

想要实现不同的效果，最关键的地方在于`CABasicAnimation`对象的初始化方式中`keyPath`的设定。 

### keyPath 

在iOS中有以下几种不同的keyPath，代表着不同的效果：

```swift
transform.scale = 比例转换
transform.rotation = 旋转
opacity = 透明度
margin = 边距
zPosition
backgroundColor = 背景颜色
cornerRadius   = 圆角
borderWidth
bounds
contents
contentsRect
frame
hidden
mask
masksToBounds
position = 位置
shadowColor
shadowOffset
shadowOpacity
shadowRadius
```

### 有用的属性设置

+ Autoreverses  
当你设定这个属性为 `true` 时,在它到达目的地之后,动画的返回到开始的值,代替了直接跳转到 开始的值。

+ Duration  
`Duration` 这个参数你已经相当熟悉了。它设定开始值到结束值花费的时间。期间会被速度的属性所影响。 

+ RemovedOnCompletion  
这个属性默认为 `true`,那意味着,在指定的时间段完成后,动画就自动的从层上移除了。这个一般不用。假如你想要再次用这个动画时,你需要设定这个属性为 `false`。这样的话,下次你在通过-set 方法设定动画的属 性时,它将再次使用你的动画,而非默认的动画。

+ Speed  
默认的值为 1.0.这意味着动画播放按照默认的速度。如果你改变这个值为 2.0,动画会用 2 倍的速度播放。 这样的影响就是使持续时间减半。如果你指定的持续时间为 6 秒,速度为 2.0,动画就会播放 3 秒钟。

+ BeginTime  
这个属性在组动画中很有用。它根据父动画组的持续时间,指定了开始播放动画的时间。默认的是 0.0.组

+ TimeOffset  
如果一个时间偏移量是被设定,动画不会真正的可见,直到根据父动画组中的执行时间得到的时间都流逝了。

+ RepeatCount  
默认的是 0,意味着动画只会播放一次。如果指定一个无限大的重复次数,使用 `MAXFLOAT`。这个不应该和 `repeatDration` 属性一块使用。

+ RepeatDuration  
这个属性指定了动画应该被重复多久。动画会一直重复,直到设定的时间流逝完。它不应该和 `repeatCount` 一起使用。

## CAAnimationGroup 组合动画

```swift
func initGroupLayer()
{
    //演员初始化
    let groupLayer = CALayer();
    groupLayer.frame = CGRectMake(60, 340 + 100 + 64, 50, 50);
    groupLayer.cornerRadius = 20;
    groupLayer.backgroundColor = UIColor.purpleColor().CGColor;
    self.view.layer.addSublayer(groupLayer)

    //设定剧本
    //缩放
    let scaleAnimation = CABasicAnimation(keyPath: "transform.scale");
    scaleAnimation.fromValue = NSNumber(float:1.0);
    scaleAnimation.toValue = NSNumber(float:1.5);
    scaleAnimation.autoreverses = true;
    scaleAnimation.repeatCount = MAXFLOAT;
    scaleAnimation.duration = 2;
    
    //移动
    let moveAnimation = CABasicAnimation(keyPath: "position");
    moveAnimation.fromValue = NSValue(CGPoint: groupLayer.position);
    moveAnimation.toValue = NSValue(CGPoint: CGPointMake(320 - 80,groupLayer.position.y));
    moveAnimation.autoreverses = true;
    moveAnimation.repeatCount = MAXFLOAT;
    moveAnimation.duration = 2;
    
    //旋转
    let rotateAnimation = CABasicAnimation(keyPath: "transform.rotation.z");
    rotateAnimation.fromValue = NSNumber(float: 0)
    rotateAnimation.toValue = NSNumber(float: 6.0 * Float(M_1_PI))
    rotateAnimation.autoreverses = true;
    rotateAnimation.repeatCount = MAXFLOAT;
    rotateAnimation.duration = 2;
    
    let groupAnnimation = CAAnimationGroup();
    groupAnnimation.duration = 2;
    groupAnnimation.autoreverses = true;
    groupAnnimation.animations = [moveAnimation, scaleAnimation, rotateAnimation];
    groupAnnimation.repeatCount = MAXFLOAT;
    //开演
    groupLayer.addAnimation(groupAnnimation, forKey: "groupAnnimation");
}
```

## CATransition 苹果封装好的动画

先上代码

```swift
@IBOutlet weak var anImageView: UIImageView!
    
var animationType:String = "oglFlip";
    
func initTransition(){
    //演员初始化
    let transitionLayer = anImageView.layer;
    
    //设定剧本
    let transition = CATransition();
    //动画类型
    transition.type = animationType
    //c动画持续时间
    transition.duration = 1.2
    //动画过渡效果
    transition.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear);
    transition.fillMode = kCAFillModeBackwards;
    //动画方向
    transition.subtype = kCATransitionFromRight;
    //动画是否还原
    transition.autoreverses = false;
    //循环次数 HUGE可看做无穷大，起到循环动画的效果
    transition.repeatCount = 1;
    
    //开演
    transitionLayer.addAnimation(transition, forKey: "transition");
}
```

上面代码中`type`是动画效果，可选值如下：

```swift
1.#define定义的常量 
    kCATransitionFade   交叉淡化过渡 
    kCATransitionMoveIn 新视图移到旧视图上面 
    kCATransitionPush   新视图把旧视图推出去 
    kCATransitionReveal 将旧视图移开,显示下面的新视图 
  
2.用字符串表示 
    pageCurl            向上翻一页 
    pageUnCurl          向下翻一页 
    rippleEffect        滴水效果 
    suckEffect          收缩效果，如一块布被抽走 
    cube                立方体效果 
    oglFlip             上下翻转效果  
```

`subtype`:动画的方向，可选值如下：

```swift
kCATransitionFromTop        从顶部开始
kCATransitionFromBottom     从底部开始
kCATransitionFromLeft       从左开始
kCATransitionFromRight      从右开始
```

`timingFunction`：过渡效果，可选值如下：

```swift
kCAMediaTimingFunctionLinear//线性 
kCAMediaTimingFunctionEaseIn//淡入 
kCAMediaTimingFunctionEaseOut//淡出 
kCAMediaTimingFunctionEaseInEaseOut//淡入淡出 
kCAMediaTimingFunctionDefault//默认
```

## CAKeyframeAnimation 关键帧动画

现在要实现下图的效果

![](https://raw.githubusercontent.com/psvmc/psvmc.github.io/master/images/ios/animation/loading.gif)


具体代码如下  

```swift
func initKeyframeAnimation(){
    //首先创建一个组动画，也就是大小变化和透明度变化的动画。
    // 大小变化
    let scaleAnimation = CAKeyframeAnimation(keyPath: "transform.scale")
    
    scaleAnimation.keyTimes = [0, 0.5, 1]
    scaleAnimation.values = [1, 0.4, 1]
    scaleAnimation.duration = duration
    
    // 透明度变化
    let opacityAnimaton = CAKeyframeAnimation(keyPath: "opacity")
    //该属性是一个数组，用以指定每个子路径的时间。
    opacityAnimaton.keyTimes = [0, 0.5, 1]
    //values属性指明整个动画过程中的关键帧点，需要注意的是，起点必须作为values的第一个值。
    opacityAnimaton.values = [1, 0.3, 1]
    opacityAnimaton.duration = duration
    
    // 组动画
    let animation = CAAnimationGroup()
    //将大小变化和透明度变化的动画加入到组动画
    animation.animations = [scaleAnimation, opacityAnimaton]
    //动画的过渡效果
    animation.timingFunction = CAMediaTimingFunction(name: kCAMediaTimingFunctionLinear)
    //动画的持续时间
    animation.duration = duration
    //设置重复次数,HUGE可看做无穷大，起到循环动画的效果
    animation.repeatCount = HUGE
    //运行一次是否移除动画
    animation.removedOnCompletion = false
    
    // 画圆并添加动画
    for var i = 0; i < 8; i++ {
        let circle = creatCircle(
            angle: CGFloat(M_PI_4 * Double(i)),//角度度数
            size: 12,//点的大小
            origin: CGPoint(x: 10, y: 74),//左上角的位置
            containerSize: CGSize(width: 100, height: 100),//大小
            color: UIColor.redColor()//点的颜色
        );
        animation.beginTime = duration / 8.0 * Double(i);
        circle.addAnimation(animation, forKey: "animation")
        view.layer.addSublayer(circle)
    }
}
  
//创建圆    
func creatCircle(angle angle: CGFloat, size: CGFloat, origin: CGPoint, containerSize: CGSize, color: UIColor) -> CALayer {
    let radius = containerSize.width/2
    let circle = createLayerWith(CGSize(width: size, height: size), color: color)
    let frame = CGRect(
        x: origin.x + radius * (cos(angle) + 1) - size / 2,
        y: origin.y + radius * (sin(angle) + 1) - size / 2,
        width: size,
        height: size)
    circle.frame = frame
    return circle
}
 
//创建实心圆    
func createLayerWith(size: CGSize, color: UIColor) -> CALayer {
    //创建CAShapeLayer，如果对CAShapeLayer比较陌生，简单介绍下CAShapeLayer
    let layer: CAShapeLayer = CAShapeLayer()
    //创建贝塞尔曲线路径（CAShapeLayer就依靠这个路径渲染）
    let path: UIBezierPath = UIBezierPath()
    //addArcWithCenter,顾名思义就是根据中心点画圆(OC语法的命名优越感又体现出来了0.0),这几个参数
    /**
    center: CGPoint 中心点
    radius: CGFloat 半径
    startAngle: CGFloat 起始的弧度
    endAngle: CGFloat 结束的弧度
    clockwise: Bool 绘画方向 true：顺时针 false：逆时针
    */
    path.addArcWithCenter(CGPoint(x: size.width / 2, y: size.height / 2),
        radius: size.width / 2,
        startAngle: 0,
        endAngle: CGFloat(2 * M_PI),
        clockwise: false);
    //线宽，如果画圆填充的话也可以不设置
    layer.lineWidth = 2
    //填充颜色，这里也就是圆的颜色
    layer.fillColor = color.CGColor
    //图层背景色
    layer.backgroundColor = nil
    //把贝塞尔曲线路径设为layer的渲染路径
    layer.path = path.CGPath
    
    return layer;
}
```
关于图形的绘制  

`CAShapeLayer`是一个通过`矢量图形`而不是`bitmap`来绘制的图层子类。你指定诸如颜色和线宽等属性，用`CGPath`来定义想要绘制的图形，最后`CAShapeLayer`就自动渲染出来了。当然，你也可以用`Core Graphics`直接向原始的`CALyer`的内容中绘制一个路径，相比直下，使用`CAShapeLayer`有以下一些优点：  

+ 渲染快速。  
`CAShapeLayer`使用了硬件加速，绘制同一图形会比用`Core Graphics`快很多。  
+ 高效使用内存。  
一个`CAShapeLayer`不需要像普通CALayer一样创建一个寄宿图形(CALyer的contents属性，如果要给contents赋值就是layer.contents = (__bridge id)image.CGImage，所以占用内存大)，所以无论有多大，都不会占用太多的内存。   
+ 不会被图层边界剪裁掉。  
一个`CAShapeLayer`可以在边界之外绘制。  
你的图层路径不会像在使用Core Graphics的普通CALayer一样被剪裁掉。   
+ 不会出现像素化。  
当你给`CAShapeLayer`做3D变换时，它不像一个有寄宿图的普通图层一样变得像素化。  


## 源代码地址

上面说的所有动画[源代码地址](https://github.com/psvmc/ZJAnimation)