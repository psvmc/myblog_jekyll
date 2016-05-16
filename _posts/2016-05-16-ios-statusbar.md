---

layout: post
title: iOS状态栏设置
description: iOS的状态栏设置
keywords: ios
category: ios

---

## 状态栏配置

iOS状态栏的设置有两种方式  

这两种方式是根据`UIViewControllerBasedStatusBarAppearance`也就是`View controller-based status bar appearance`的值的不同有相应的设置

如果不添加`UIViewControllerBasedStatusBarAppearance`配置，那么默认值为`YES`

`UIViewControllerBasedStatusBarAppearance`设置为`YES`时   
`ViewController`的配置优先级高于`Application`的配置  

`UIViewControllerBasedStatusBarAppearance`设置为`NO`时   
那么只取`Application`的配置，`ViewController`的配置不生效

也可以在`Info.plist`添加默认的状态栏样式  

`Status bar style`设置为`UIStatusBarStyleLightContent`或`UIStatusBarStyleDefault`

### Application形式(推荐)

项目的`Info.plist`添加配置`View controller-based status bar appearance`设置为`NO`  

设置前景色为白色

```swift
UIApplication.sharedApplication().setStatusBarStyle(UIStatusBarStyle.LightContent, animated: false);
```

设置前景色为黑色

```swift
UIApplication.sharedApplication().setStatusBarStyle(UIStatusBarStyle.Default, animated: false);
```

设置隐藏

动画有三种方式(`Slide(滑动)`/`Fade(淡入淡出)`/`None(无动画)`)

```swift
UIApplication.sharedApplication().setStatusBarHidden(true, withAnimation: UIStatusBarAnimation.Slide)
```

### ViewController形式

项目的`Info.plist`添加配置`View controller-based status bar appearance`设置为`YES` 

重写以下方法

```swift
override func didReceiveMemoryWarning() {
    super.didReceiveMemoryWarning()
}
    
override func preferredStatusBarStyle() -> UIStatusBarStyle {
    return UIStatusBarStyle.LightContent;
}
    
override func prefersStatusBarHidden() -> Bool {
    return false;
}
    
override func preferredStatusBarUpdateAnimation() -> UIStatusBarAnimation {
    return UIStatusBarAnimation.Slide
}
```

ViewController加载时会自动调用`preferredStatusBarStyle`方法和`prefersStatusBarHidden`方法  

如果要想之后事件里设置前景色或隐藏的话，可以把`样式`和`是否隐藏`设置为`全局变量`，修改变量后直接调用

```swift
self.setNeedsStatusBarAppearanceUpdate()
```

但是发现上面的动画配置不生效,按下面的方式调用就可以了

```swift
UIView.animateWithDuration(0.3) {
    self.setNeedsStatusBarAppearanceUpdate()
}
```


#### 弊端  

但这种配置有个弊端 就是  
如果你的`ViewController`在`NavigationController`中,那么直接在`ViewController`设置是不生效的，只能在`NavigationController`中设置

所以如果你用的`Storyboard`中配置的`NavigationController`话，就必须为`NavigationController`添加一个`自定义的类`，就稍显麻烦了，所以并**不推荐**用这种方式设置


### 设置背景色

改变方法有两种

#### 系统提供的方法

`navigationBar`的`setBarTintColor`接口，用此接口也会改变`statusBar`的背景色

注意：一旦你设置了`navigationBar`的`- (void)setBackgroundImage:(UIImage *)backgroundImage forBarMetrics:(UIBarMetrics)barMetrics`接口  
那么上面的`setBarTintColor`接口就不能改变`statusBar`的背景色，`statusBar`的背景色就会变成`纯黑色`。

#### 另辟蹊径

+ 创建一个`UIView`
+ 设置该`UIView`的`frame.size` 和`statusBar`大小一样
+ 设置该`UIView`的`frame.origin` 为`{0,-20}`
+ 设置该`UIView`的背景色为你希望的`statusBar`的颜色
+ 在`navigationBar`上`addSubView`该`UIView`即可

## UINavigationBar设置

上面说了状态栏 这里顺便把UINavigationBar也说了

我的配置

```swift
let appear = UINavigationBar.appearance();

//在早期版本上设置 不能全局的方式设置 会导致app崩溃
//appear.translucent = false;

//设置bar的颜色
appear.barTintColor = UIColor(red: 52/255, green: 146/255, blue: 233/255, alpha: 1.0);
//设置背景色（不透明时没用,因为barTintColor在backgroundColor的上一层）
appear.backgroundColor = UIColor(red: 52/255, green: 146/255, blue: 233/255, alpha: 1.0);
//去掉navigationBar下的黑线
appear.setBackgroundImage(UIImage(), forBarMetrics: UIBarMetrics.Default)
appear.shadowImage = UIImage();

//设置左右两侧的颜色
appear.tintColor = UIColor.whiteColor();

//设置标题样式
appear.titleTextAttributes = [NSForegroundColorAttributeName: UIColor.whiteColor(),NSFontAttributeName: UIFont(name: "Heiti SC", size: 18.0)!];
```

### 注意

1) `appear.translucent`配置在早期系统会崩溃，不建议配置，建议在`ViewController`中配置

2) 在`translucent=true`也就是透明时，`barTintColor`不起作用，`backgroundColor`起作用

3) 在`translucent=false`也就是不透明时，`barTintColor`起作用，`backgroundColor`不起作用

4) 在`translucent=false`也就是不透明时，可以去掉`navigationBar`下的黑线，代码如下

```swift
//去掉navigationBar下的黑线
appear.setBackgroundImage(UIImage(), forBarMetrics: UIBarMetrics.Default)
appear.shadowImage = UIImage();
```

5) 在`translucent=true`也就是透明时，如果用扇面的方式去掉`navigationBar`下的黑线，会导致状态栏颜色与`navigationBar`的背景色不同，暂没找到好的解决方法

6) 设置`navigationBar`背景透明的方式 跟去黑线的方式相同