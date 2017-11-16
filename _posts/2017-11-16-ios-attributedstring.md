---

layout: post
title: 富文本AttributedString的总结
description: 富文本AttributedString的总结
keywords: ios
category: ios

---

本文语法为`Swift4`

## 前言

`AttributedString`可以分为`NSAttributedString`和`NSMutableAttributedString`两种。  
在使用中通过将`AttributedString`赋值给控件的 `attributedText` 属性来添加文字样式。  
可设置的控件有`UILabel`、`UITextField`和`UITextView`。



## Swift使用

简单示例

```swift
let mutableAttributedString = NSMutableAttributedString();

//设置样式
let strAttr = [
            NSAttributedStringKey.font : UIFont.systemFont(ofSize: 16),
            NSAttributedStringKey.foregroundColor:UIColor.darkGray,
            NSAttributedStringKey.baselineOffset:0
    ] as [NSAttributedStringKey : Any];

//插入
let attributedString =  NSAttributedString(string: leftStr, attributes: strAttr);
mutableAttributedString.insert(
      attributedString,
      at: mutableAttributedString.string.endIndex.encodedOffset
 );
```

也可以在定义后再添加样式

```swift
mutableAttributedString.addAttributes(strAttr, range: NSRange(location: 0, length: mutableAttributedString.length));
```

### 所有可设置样式


简单样式

```swift
//设置字体
NSAttributedStringKey.font : UIFont.systemFont(ofSize: 16)
//设置字体的颜色
NSAttributedStringKey.foregroundColor:UIColor.darkGray
//设置背景色
NSAttributedStringKey.backgroundColor:UIColor.clear
//设置基准位置 (正值上偏，负值下偏)
NSAttributedStringKey.baselineOffset:0
//字符间距
NSAttributedStringKey.kern:2
//设置字体倾斜度，取值为float，正值右倾，负值左倾
NSAttributedStringKey.obliqueness:0
//设置字体的横向拉伸，取值为float，正值拉伸 ，负值压缩
NSAttributedStringKey.expansion:0
```

段落样式

```swift
let paragraphStyle = NSMutableParagraphStyle();
//行间距
paragraphStyle.lineSpacing = 5;
//段落间距
paragraphStyle.paragraphSpacing = 10;
//对齐方式
paragraphStyle.alignment = NSTextAlignment.left;
//段落开始的缩进像素
paragraphStyle.firstLineHeadIndent = 4;
//全部文字的缩进像素(不包含首行)
paragraphStyle.headIndent = 4;


//设置
NSAttributedStringKey.paragraphStyle:paragraphStyle
```

## OC使用

### 初始化

```c
NSMutableAttributedString *attributedString = [[NSMutableAttributedString alloc]init];
```

### 设置字体格式和大小

```c
NSString *str0 = @"设置字体格式和大小";
NSDictionary *dictAttr0 = @{NSFontAttributeName:[UIFont systemFontOfSize:14]};
NSAttributedString *attr0 = [[NSAttributedString alloc]initWithString:str0 attributes:dictAttr0];
[attributedString appendAttributedString:attr0];
```

### 设置字体颜色

```c
NSString *str1 = @"\n设置字体颜色\n";
NSDictionary *dictAttr1 = @{NSForegroundColorAttributeName:[UIColor purpleColor]};
NSAttributedString *attr1 = [[NSAttributedString alloc]initWithString:str1 attributes:dictAttr1];
[attributedString appendAttributedString:attr1];
```

### 设置字体背景颜色

```c
NSString *str2 = @"设置字体背景颜色\n";
NSDictionary *dictAttr2 = @{NSBackgroundColorAttributeName:[UIColor cyanColor]};
NSAttributedString *attr2 = [[NSAttributedString alloc]initWithString:str2 attributes:dictAttr2];
[attributedString appendAttributedString:attr2];
```

### 设置连体属性

```c
/*
 注：NSLigatureAttributeName设置连体属性，取值为NSNumber对象（整数），1表示使用默认的连体字符，0表示不使用，2表示使用所有连体符号（iOS不支持2）。而且并非所有的字符之间都有组合符合。如 fly ，f和l会连起来。
 */   

NSString *str3 = @"fly";
NSDictionary *dictAttr3 = @{NSFontAttributeName:[UIFont fontWithName:@"futura" size:14],NSLigatureAttributeName:[NSNumber numberWithInteger:1]};
NSAttributedString *attr3 = [[NSAttributedString alloc]initWithString:str3 attributes:dictAttr3];
[attributedString appendAttributedString:attr3];
```

### 设置字符之间的间距

```c
/*!
 注：NSKernAttributeName用来设置字符之间的间距，取值为NSNumber对象（整数），负值间距变窄，正值间距变宽
 */   
 
NSString *str4 = @"\n设置字符间距";   
NSDictionary *dictAttr4 = @{NSKernAttributeName:@(4)};
NSAttributedString *attr4 = [[NSAttributedString alloc]initWithString:str4 attributes:dictAttr4];
[attributedString appendAttributedString:attr4];
```

### 设置删除线

```c
/*!
 注：NSStrikethroughStyleAttributeName设置删除线 
 取值为NSNumber对象，枚举NSUnderlineStyle中的值。  
 NSStrikethroughColorAttributeName设置删除线的颜色。
 并可以将Style和Pattern相互 取与 获取不同的效果
 */   
 
NSString *str51 = @"\n设置删除线为细单实线,颜色为红色";
NSDictionary *dictAttr51 = @{NSStrikethroughStyleAttributeName:@(NSUnderlineStyleSingle),NSStrikethroughColorAttributeName:[UIColor redColor]};
NSAttributedString *attr51 = [[NSAttributedString alloc]initWithString:str51 attributes:dictAttr51];
[attributedString appendAttributedString:attr51];
```

```c
NSString *str52 = @"\n设置删除线为粗单实线,颜色为红色";
NSDictionary *dictAttr52 = @{NSStrikethroughStyleAttributeName:@(NSUnderlineStyleThick),NSStrikethroughColorAttributeName:[UIColor redColor]};
NSAttributedString *attr52 = [[NSAttributedString alloc]initWithString:str52 attributes:dictAttr52];
[attributedString appendAttributedString:attr52];
```


```c
NSString *str53 = @"\n设置删除线为细单实线,颜色为红色";
NSDictionary *dictAttr53 = @{NSStrikethroughStyleAttributeName:@(NSUnderlineStyleDouble),NSStrikethroughColorAttributeName:[UIColor redColor]};
NSAttributedString *attr53 = [[NSAttributedString alloc]initWithString:str53 attributes:dictAttr53];
[attributedString appendAttributedString:attr53];
```

```c
NSString *str54 = @"\n设置删除线为细单虚线,颜色为红色";
NSDictionary *dictAttr54 = @{NSStrikethroughStyleAttributeName:@(NSUnderlineStyleSingle|NSUnderlinePatternDot),NSStrikethroughColorAttributeName:[UIColor redColor]};
NSAttributedString *attr54 = [[NSAttributedString alloc]initWithString:str54 attributes:dictAttr54];
[attributedString appendAttributedString:attr54];
```

### 设置笔画宽度和填充颜色

```c
/*!
 NSStrokeWidthAttributeName 设置笔画的宽度，取值为NSNumber对象（整数），负值填充效果，正值是中空效果。NSStrokeColorAttributeName  设置填充部分颜色，取值为UIColor对象。
 设置中间部分颜色可以使用 NSForegroundColorAttributeName 属性来进行
 */   
  
NSString *str6 = @"设置笔画宽度和填充颜色\n";
NSDictionary *dictAttr6 = @{NSStrokeWidthAttributeName:@(2),NSStrokeColorAttributeName:[UIColor blueColor]};
NSAttributedString *attr6 = [[NSAttributedString alloc]initWithString:str6 attributes:dictAttr6];
[attributedString appendAttributedString:attr6];
```

### 设置阴影属性

```c
NSString *str7 = @"设置阴影属性\n";
NSShadow *shadow = [[NSShadow alloc]init];
shadow.shadowColor = [UIColor redColor];
shadow.shadowBlurRadius = 1.0f;
shadow.shadowOffset = CGSizeMake(1, 1);
NSDictionary *dictAttr7 = @{NSShadowAttributeName:shadow};
NSAttributedString *attr7 = [[NSAttributedString alloc]initWithString:str7 attributes:dictAttr7];
[attributedString appendAttributedString:attr7];
```

### 设置文本特殊效果

```c
//设置文本特殊效果，取值为NSString类型，目前只有一个可用效果    
 
//NSTextEffectLetterpressStyle（凸版印刷效果）   

NSString *str8 = @"设置特殊效果\n";
NSDictionary *dictAttr8 = @{NSTextEffectAttributeName:NSTextEffectLetterpressStyle};
NSAttributedString *attr8 = [[NSAttributedString alloc]initWithString:str8 attributes:dictAttr8];
[attributedString appendAttributedString:attr8];
```

### 图文混排

```c
//聊天的表情文字混排

//设置文本附件，取值为NSTextAttachment对象，常用于文字的图文混排

NSString *str9 = @"文字的图文混排\n";
NSTextAttachment *textAttachment = [[NSTextAttachment alloc]init];
textAttachment.image = [UIImage imageNamed:@"logo.png"];
textAttachment.bounds = CGRectMake(0, 0, 30, 30);
NSDictionary *dictAttr9 = @{NSAttachmentAttributeName:textAttachment};
NSAttributedString *attr9 = [[NSAttributedString alloc]initWithString:str9 attributes:dictAttr9];
[attributedString appendAttributedString:attr9];
```

### 添加下划线

```c
/*!
 添加下划线 NSUnderlineStyleAttributeName。设置下划线的颜色 NSUnderlineColorAttributeName，对象为 UIColor。使用方式同删除线一样。
 */  

NSString *str10 = @"添加下划线\n";
NSDictionary *dictAttr10 = @{NSUnderlineStyleAttributeName:@(NSUnderlineStyleSingle),NSUnderlineColorAttributeName:[UIColor redColor]};
NSAttributedString *attr10 = [[NSAttributedString alloc]initWithString:str10 attributes:dictAttr10];
[attributedString appendAttributedString:attr10];
```

### 设置基线偏移值

```c
/*!
 NSBaselineOffsetAttributeName 设置基线偏移值
取值为NSNumber （float），正值上偏，负值下偏
 */     

NSString *str11 = @"添加基线偏移值\n";
NSDictionary *dictAttr11 = @{NSBaselineOffsetAttributeName:@(-10)};
NSAttributedString *attr11 = [[NSAttributedString alloc]initWithString:str11 attributes:dictAttr11];
[attributedString appendAttributedString:attr11];
```

### 设置字体倾斜度

```c
/*!
NSObliquenessAttributeName 设置字体倾斜度
取值为 NSNumber（float），正值右倾，负值左倾
*/   

NSString *str12 = @"设置字体倾斜度\n";
NSDictionary *dictAttr12 = @{NSObliquenessAttributeName:@(0.5)};
NSAttributedString *attr12 = [[NSAttributedString alloc]initWithString:str12 attributes:dictAttr12];
[attributedString appendAttributedString:attr12];
```

### 设置字体的横向拉伸

```c
/*!
NSExpansionAttributeName 设置字体的横向拉伸，取值为NSNumber （float），正值拉伸 ，负值压缩
*/   
   
NSString *str13 = @"设置字体横向拉伸\n";
NSDictionary *dictAttr13 = @{NSExpansionAttributeName:@(0.5)};
NSAttributedString *attr13 = [[NSAttributedString alloc]initWithString:str13 attributes:dictAttr13];
[attributedString appendAttributedString:attr13];
```

### 设置文字的书写方向

```c
/*!
 NSWritingDirectionAttributeName 设置文字的书写方向，取值为以下组合
 @[@(NSWritingDirectionLeftToRight | NSWritingDirectionEmbedding)]
 @[@(NSWritingDirectionLeftToRight | NSWritingDirectionOverride)]
 @[@(NSWritingDirectionRightToLeft | NSWritingDirectionEmbedding)]
 @[@(NSWritingDirectionRightToLeft | NSWritingDirectionOverride)]
*/     
  
NSString *str14 = @"设置文字书写方向\n";
NSDictionary *dictAttr14 = @{NSWritingDirectionAttributeName:@[@(NSWritingDirectionRightToLeft | NSWritingDirectionEmbedding)]};
NSAttributedString *attr14 = [[NSAttributedString alloc]initWithString:str14 attributes:dictAttr14];
[attributedString appendAttributedString:attr14];
```

### 设置文字排版方向

```c
/*!
 NSVerticalGlyphFormAttributeName 设置文字排版方向
 取值为NSNumber对象（整数），0表示横排文本，1表示竖排文本  在iOS中只支持0
 */     
  
NSString *str15 = @"设置文字排版方向\n";
NSDictionary *dictAttr15 = @{NSVerticalGlyphFormAttributeName:@(0)};
NSAttributedString *attr15 = [[NSAttributedString alloc]initWithString:str15 attributes:dictAttr15];
[attributedString appendAttributedString:attr15];
```

### 设置段落样式

```c
NSMutableParagraphStyle *paragraph = [[NSMutableParagraphStyle alloc]init];//段落样式   
paragraph.lineSpacing = 10;//行间距 
paragraph.paragraphSpacing = 20;//段落间距 
paragraph.alignment = NSTextAlignmentLeft;//对齐方式   
paragraph.firstLineHeadIndent = 30;//指定段落开始的缩进像素 
paragraph.headIndent = 10;//调整全部文字的缩进像素

//添加段落设置    

[attributedString addAttribute:NSParagraphStyleAttributeName value:paragraph range:NSMakeRange(0, attributedString.length)];
```

### 应用

```c
UILabel *label = [[UILabel alloc]initWithFrame:CGRectMake(60, 100, 300, 0)];
label.backgroundColor = [UIColor lightGrayColor];
label.numberOfLines = 0;//自动换行  
label.attributedText = attributedString;//设置label的富文本  
[label sizeToFit];//label高度自适应  
[self.view addSubview:label];
```

## OC使用之超链接

之所以把 `NSLinkAttributeName` 属性单独列出来，是因为在 `UILabel` 和 `UITextField` 中是无法使用该属性的。  
更准确点说是在`UILabel` 和 `UITextField` 中无法实现点击链接启动浏览器打开一个URL地址，因为在此过程中用到了一个代理函数。只能用在 `UITextView` 中。

`NSLinkAttributeName` 的对象是 `NSURL` 类型 或 `NSString`，但是优先使用 `NSURL`。

需要实现`UITextView`的代理方法
` - (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange`，  
 在该方法中，返回 `YES`，则会打开URL地址，返回 `NO`则不会。

### 设置方式一

将全部文字设置为链接（可点击）

```c
NSDictionary *dictAttr = @{NSLinkAttributeName:[NSURL URLWithString:@"http://www.jianshu.com"]};
NSAttributedString *attrStr = [[NSAttributedString alloc]initWithString:@"简书" attributes:dictAttr];
textView.attributedText = attrStr;
```

### 设置方式二

将部分文字设置为链接


```c
NSString *str = @"跳转到简书";
NSMutableAttributedString *attrStr = [[NSMutableAttributedString alloc]initWithString:str];
[attrStr addAttribute:NSLinkAttributeName value:[NSURL URLWithString:@"http://www.jianshu.com"] range:[str rangeOfString:@"简书"]];
textView.attributedText = attrStr;
```

代理回调方法

```c
- (BOOL)textView:(UITextView *)textView shouldInteractWithURL:(NSURL *)URL inRange:(NSRange)characterRange
{
    //在这里是可以做一些判定什么的，用来确定对应的操作。
return YES;
}
```

> 注意：

+ 实现`textView`的代理，否则调不到回调方法。
+ 设置`textView`的 `editable` 属性为 `NO`，在可编辑的状态下是不可点击的。
+ 在模拟器环境下一直无法点击，在真机上是正常的，不知道是不是模拟器不支持。


> [OC代码 原文地址](http://www.jianshu.com/p/bbfe7bd282f1)
