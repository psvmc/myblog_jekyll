---

layout: post
title: iOS开发中 xib模块化设计
description: iOS开发中 xib模块化设计
keywords: ios
category: ios

---

## 前言

目标就是方便的将`xib`写的视图 方便的封装成一个组件来用

## 代码及使用方式

### OC代码

ZJXibView.h

```objc
#import <UIKit/UIKit.h>

@interface ZJXibView : UIView
@property(strong,nonatomic)UIView *contentView;
@end
```

ZJXibView.m

```objc
#import <Foundation/Foundation.h>
#import "ZJXibView.h"

@implementation ZJXibView

-(instancetype)initWithFrame:(CGRect)frame{
    self = [super initWithFrame:frame];
    [self loadView];
    return self;
}
-(void)awakeFromNib{
    [super awakeFromNib];
    [self loadView];
}

-(void)layoutSubviews{
    [super layoutSubviews];
    self.contentView.frame = self.bounds;
}

-(void)loadView{
    if(self.contentView){
        return;
    }
    
    NSString* clazzName = NSStringFromClass(self.classForCoder);
    NSArray* nameArray =[clazzName componentsSeparatedByString:@"."];
    NSString * xibName =nameArray[0];
    if(nameArray.count == 2){
        xibName = nameArray[1];
    }
    self.contentView = [[NSBundle mainBundle]loadNibNamed:xibName owner:self options:nil].firstObject;
    [self addSubview:self.contentView];
}

@end
```

### Swift3代码

```swift
import UIKit

@objc class ZJXibView: UIView {
    
    @IBOutlet var contentView: UIView!
    
    
    override init(frame: CGRect) {
        super.init(frame: frame)
        self.loadView()
    }
    
    required init?(coder aDecoder: NSCoder) {
        super.init(coder: aDecoder)
    }
    
    
    override func awakeFromNib() {
        super.awakeFromNib()
        self.loadView()
        
    }
    
    override func layoutSubviews() {
        super.layoutSubviews()
        self.contentView.frame = self.bounds
    }
    
    fileprivate func getXibName() -> String {
        let clzzName = NSStringFromClass(self.classForCoder)
        let nameArray = clzzName.components(separatedBy: ".")
        var xibName = nameArray[0]
        if nameArray.count == 2 {
            xibName = nameArray[1]
        }
        return xibName
    }
    
    
    func loadView() {
        if self.contentView != nil {
            return
        }
        let nibs = Bundle.main.loadNibNamed(getXibName(), owner: self, options: nil)
        self.contentView = nibs![0] as! UIView
        self.contentView.frame = self.bounds
        self.contentView.backgroundColor = UIColor.clear
        self.addSubview(self.contentView)
    }
}
```

### 使用方法

比如我们的`xib`名字为`ZJUserPicView.xib`  
就必须建一个相同名字的类`ZJUserPicView.swift`并继承`ZJXibView`

ZJUserPicView.swift

```swift
import UIKit

class ZJUserPicView: ZJXibView {
    
    @IBOutlet weak var picImageView: UIImageView!
    @IBOutlet weak var nameLabel: UILabel!
    
    override func awakeFromNib() {
        super.awakeFromNib()
    }
    
}
```

`ZJUserPicView.xib`的`File's Owner`的Class指定为`ZJUserPicView.swift`  
然后连接`picImageView`和`nameLabel`  

这样`ZJUserPicView`就可以整体做一个组件来用了

完整示例 

+ [Swift示例](https://github.com/psvmc/ZJXibViewDemo)
+ [ObjectC示例](https://github.com/psvmc/ZJChatOC)
