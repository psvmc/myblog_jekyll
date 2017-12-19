---

layout: post
title: iOS从Xib中设置样式
description: iOS从Xib中设置样式
keywords: ios
category: ios

---


## 简介
iOS在写视图的有的人喜欢纯代码去写，从之前的绝对定位方式(Frame)，到现在的自动布局(Autolayout),但这种方式的好处是便于复制修改和装X，但是缺点是代码不容易看，不便于修改  

也有人喜欢所见即所得 用`storyboard`和`xib`进行view的生成，这种方式运行效率是会降低，但现在的手机配置基本可以忽略这点弊端,官方也推荐这种方式

## 常用技巧

### 选中View

当你想直接在view中选择自己想要的元素时，但是又碍于一个view上叠加的元素太多很难直接选中，那么在这时，你同时按住键盘上的shift和 control键，然后在你想选择的元素上点击鼠标，会弹出一个窗口，上面罗列了鼠标点击的位置下所有存在的元素，然后你再去进行选择会变的异常的简单。

### 添加AutoLayout边距约束时如何不使用margin约束

通常我习惯于在xib或者StoryBoard中用右键drag拖线的方式设置autolayout约束，但是默认的autolayout边距约束可能是带margin的，也就是默认”Constrain to margin“是勾选的，这会导致约束值出现类似于Superview.Leading Margin这种的约束。而经过我的测试发现在Xcode6.1和Xcode6.4下这个margin可能表现行为还不一样。

为了避免麻烦，还是不用`margin约束`比较好，如何在添加约束时不使用margin约束呢？当然你可以去掉`Constrain to margin`的勾选，不过这要是一个一个去掉勾选也是挺烦的事情，而且对旧项目来说这可能又会导致原来布局好的视图产生变动。

简单的办法还是用快捷键，就是在drag后按`option`，显示的约束就没有margin了。注意次序，一定要先drag后按option，如果是先按option再drag，或者drag与按住option同时开始是无效的。

### 快速在文件树中切换到当前文件

在Xcode中经常会遇到跳转比较多的情形，有时候若跳转到某个m文件，然后又想在左边的文件目录中切换选中文件为当前打开的文件，可以用`Cmd + Shift + J`来操作


###  显示或隐藏Debug和Console

`ctrl+shift+q` 隐藏和显示Debug区

`cmd+shift+c` 显示Console

### 复制View

想要在xib或者storyboard里面复制一个控件?选中控件直接`command + d`吧,至少比`command+c`与`command+v`节省一半时间吧?

### 连线

想拖线还得手动点双环按钮分屏?
凹凸啦!没错就是`command + option + enter`让你一秒分屏!  
`command  + enter`取消分屏

### 属性查看器

想在IB里面瞧瞧属性查看器,`command + option + 0`就够啦.

### 项目中找类

下面这个是节约时间的大功臣:`command + shift + o(字母O)`,在文件数目庞大的工程里效果尤为显著,可以让你在茫茫"类"海中找到你的那个它.

### 项目中找文件

有时候想搜索一个文件，常规的做法是鼠标点击左下角的搜索框，再输入文字，这太慢了，快捷键是：`Cmd + Option + J`

### .h和.m切换

我在.h和.m直接切换从来不用触摸板和鼠标,因为`command + control + ⬆` 或`command + control + ⬇`会帮我搞定一切.

### view位置

添加约束的时候,谁说控件A要放在控件B的下侧才能设置到A到B在y轴方向上的距离? 试试看选中A控件, 按住control键同时把A往B的身上拖,直到B发亮再松手. 如果没用过这招, 肯定惊喜.

### 快速敲block

每次敲block是不是很头疼括号，尖括号什么的，试着敲个inline看Xcode的提示再回车，还头疼吗？

### 添加第三方字体

把字体ttf文件像普通文件加入到项目中，在xib或storyboard中就可以直接使用新字体了


## 属性设置

但是很多属性的设置 在xib中是不能完全自定义的，作为一个喜欢用xib这种方式的码客来说，当然能最大限度的使用`xib`可自定义的属性当然是极好的，下面就说一下一些不常用的从xib中可设置的属性

这些属性的设置在右面设置菜单的`第三个选项卡`的`User Defined Runtime Attributes`中设置

添加一项后 一定要`先设置Type`，因为设置Type后其它会重置

### 设置圆角
<table>
    <tr><th>Key Path</th><th>Type</th><th>Value</th></tr>
    <tr>
        <td>layer.cornerRadius</td>
        <td>Number</td>
        <td>2</td>
    </tr>
    <tr>
        <td>layer.masksToBounds</td>
        <td>Boolean</td>
        <td>true</td>
    </tr>
</table>

### 设置Border宽度和颜色

宽度好设置

<table>
    <tr><th>Key Path</th><th>Type</th><th>Value</th></tr>
    <tr>
        <td>layer.borderWidth</td>
        <td>Number</td>
        <td>1</td>
    </tr>
    <tr>
        <td>layer.borderUIColor</td>
        <td>Color</td>
        <td>选择对应的色值</td>
    </tr>
</table>

添加如下类

CALayer+XibConfiguration.h:

```objc
#import <QuartzCore/QuartzCore.h>
#import <UIKit/UIKit.h>
@interface CALayer(XibConfiguration)
// This assigns a CGColor to borderColor.
@property(nonatomic, assign) UIColor* borderUIColor;
@end
```

CALayer+XibConfiguration.m:

```objc
#import "CALayer+XibConfiguration.h"
@implementation CALayer(XibConfiguration)
-(void)setBorderUIColor:(UIColor*)color
{
    self.borderColor = color.CGColor;
}
-(UIColor*)borderUIColor
{
    return [UIColor colorWithCGColor:self.borderColor];
}
@end
```

## 设置属性更好的方法

Xcode 6以上支持一种新的方法，特好用

其实就是为UIView添加扩展 或 继承 添加IBInspectable的属性 既可以图形化设置某些属性

这样在右侧的第四个选项卡中神奇的出现了自定义的设置项

### OC下的实现方式(扩展)

`UIView+Border&CornerRadius.h`

```objc
#import <UIKit/UIKit.h>

IB_DESIGNABLE  // 动态刷新

@interface UIView(border_cornerRadius)

// 注意: 加上IBInspectable就可以可视化显示相关的属性哦
/** 可视化设置边框宽度 */
@property (nonatomic, assign)IBInspectable CGFloat borderWidth;
/** 可视化设置边框颜色 */
@property (nonatomic, strong)IBInspectable UIColor *borderColor;

/** 可视化设置圆角 */
@property (nonatomic, assign)IBInspectable CGFloat cornerRadius;

@end
```

`UIView+Border&CornerRadius.m`


```objc
#import "UIView+Border&CornerRadius.h"

@implementation UIView(border_cornerRadius)

/**
 *  设置边框宽度
 *
 *  @param borderWidth 可视化视图传入的值
 */
@dynamic borderWidth;
- (void)setBorderWidth:(CGFloat)borderWidth {
    
    if (borderWidth < 0) return;
    
    self.layer.borderWidth = borderWidth;
}

/**
 *  设置边框颜色
 *
 *  @param borderColor 可视化视图传入的值
 */
@dynamic borderColor;
- (void)setBorderColor:(UIColor *)borderColor {
    
    self.layer.borderColor = borderColor.CGColor;
}

/**
 *  设置圆角
 *
 *  @param cornerRadius 可视化视图传入的值
 */
@dynamic cornerRadius;
- (void)setCornerRadius:(CGFloat)cornerRadius {
    
    self.layer.cornerRadius = cornerRadius;
    self.layer.masksToBounds = cornerRadius > 0;
}

@end
```

### Swift下的实现方式(扩展)

`UIView+Border&CornerRadius.swift`

```swift
import Foundation
import UIKit
extension UIView {
    
    @IBInspectable var cornerRadius: CGFloat {
        get{
            return layer.cornerRadius;
        }
        
        set(newValue) {
            layer.cornerRadius = newValue;
        }
    }
    
    @IBInspectable var masksToBounds: Bool {
        get{
            return layer.masksToBounds;
        }
        
        set(newValue) {
            layer.masksToBounds = newValue
        }
    }
    
    @IBInspectable var borderColor: UIColor? {
        get {
            if let color = layer.borderColor {
                return UIColor(cgColor: color)
            }
            return nil
        }
        set(newValue) {
            layer.borderColor = newValue?.cgColor
        }
    }
    
    @IBInspectable var borderWidth: CGFloat {
        get {
            return layer.borderWidth
        }
        set(newValue) {
            if(newValue != 0){
                layer.borderWidth = newValue
            }   
        }
    }
    
    @IBInspectable var borderPX: CGFloat {
        get {
            return layer.borderWidth
        }
        set(newValue) {
            if(newValue != 0){
                layer.borderWidth = newValue / UIScreen.main.scale
            }
        }
    }
}
```

这样你所有的View都可以设置Border和圆角了

----

如果你不想让每个View都这样，你可以使用继承的形式，不过像圆角这类的属性 还是以扩展的方式比较好

下面说一下 继承的方式

### OC下的实现方式(继承)

`UIView+Border&CornerRadius.h`

```objc
#import <UIKit/UIKit.h>

IB_DESIGNABLE  // 动态刷新

@interface UIViewBorderCornerRadius : UIView

// 注意: 加上IBInspectable就可以可视化显示相关的属性哦
/** 可视化设置边框宽度 */
@property (nonatomic, assign)IBInspectable CGFloat borderWidth;
/** 可视化设置边框颜色 */
@property (nonatomic, strong)IBInspectable UIColor *borderColor;

/** 可视化设置圆角 */
@property (nonatomic, assign)IBInspectable CGFloat cornerRadius;

@end
```

`UIView+Border&CornerRadius.m`


```objc
#import "UIView+Border&CornerRadius.h"

@implementation UIViewBorderCornerRadius

/**
 *  设置边框宽度
 *
 *  @param borderWidth 可视化视图传入的值
 */
- (void)setBorderWidth:(CGFloat)borderWidth {
    
    if (borderWidth < 0) return;
    
    self.layer.borderWidth = borderWidth;
}

/**
 *  设置边框颜色
 *
 *  @param borderColor 可视化视图传入的值
 */
- (void)setBorderColor:(UIColor *)borderColor {
    
    self.layer.borderColor = borderColor.CGColor;
}

/**
 *  设置圆角
 *
 *  @param cornerRadius 可视化视图传入的值
 */
- (void)setCornerRadius:(CGFloat)cornerRadius {
    
    self.layer.cornerRadius = cornerRadius;
    self.layer.masksToBounds = cornerRadius > 0;
}

@end
```

### Swift下的实现方式(继承)

`UIViewBorderCornerRadius.swift`

```swift
import Foundation
import UIKit

@IBDesignable
class UIViewBorderCornerRadius : UIView{
    @IBInspectable var cornerRadius: CGFloat {
        get{
            return layer.cornerRadius;
        }
        
        set(newValue) {
            layer.cornerRadius = newValue;
        }
    }
    
    @IBInspectable var masksToBounds: Bool {
        get{
            return layer.masksToBounds;
        }
        
        set(newValue) {
            layer.masksToBounds = newValue
        }
    }
    
    @IBInspectable var borderColor: UIColor? {
        get {
            if let color = layer.borderColor {
                return UIColor(CGColor: color)
            }
            return nil
        }
        set(newValue) {
            layer.borderColor = newValue?.CGColor
        }
    }
    
    @IBInspectable var borderWidth: CGFloat {
        get {
            return layer.borderWidth
        }
        set(newValue) {
            layer.borderWidth = newValue
        }
    }
}
```



