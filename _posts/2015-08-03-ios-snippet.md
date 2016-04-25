---

layout: post
title: iOS常用代码段
description: iOS常用代码段
keywords: ios,代码段
categories: ios swift

---

### ImageView圆角

```swift
var layer = cell.leftImageView.layer;
layer.masksToBounds=true;
layer.cornerRadius = cell.leftImageView.bounds.size.width/2;

```

### 我常用的全局设置

```swift
let appear = UINavigationBar.appearance();
appear.translucent = false;
//设置Item的样式
appear.tintColor = UIColor.whiteColor();
//设置bar的颜色
appear.barTintColor = UIColor(red: 52/255, green: 146/255, blue: 233/255, alpha: 1.0);
//设置背景色（不透明时没用,因为barTintColor在backgroundColor的上一层）
appear.backgroundColor = UIColor(red: 253/255, green: 150/255, blue: 13/255, alpha: 1.0);
//去掉navigationBar下的黑线
appear.setBackgroundImage(UIImage(), forBarMetrics: UIBarMetrics.Default)
appear.shadowImage = UIImage();
//设置标题样式
appear.titleTextAttributes = [NSForegroundColorAttributeName: UIColor.whiteColor(),NSFontAttributeName: UIFont(name: "Heiti SC", size: 18.0)!];
        
let tabbarAppear = UITabBar.appearance();
tabbarAppear.tintColor = UIColor(red: 56/255, green: 173/255, blue: 255/255, alpha: 1.0);
        
let searchBarAppear = UISearchBar.appearance();
searchBarAppear.translucent = false;
searchBarAppear.backgroundColor = UIColor(red: 240/255, green: 240/255, blue: 240/255, alpha: 1.0);
searchBarAppear.barTintColor = UIColor(red: 240/255, green: 240/255, blue: 240/255, alpha: 1.0);
searchBarAppear.layer.borderColor = UIColor(hexString: "#ffffff")!.CGColor;
searchBarAppear.layer.borderWidth = 0;
searchBarAppear.backgroundImage = UIImage();
```

#### 注意优先级顺序

`控制器中代码设置` > `storybord设置` > `全局设置`   
优先级高的会覆盖优先级低的配置，比如storybord中的设置了navigationbar的样式 那么全局设置就不生效

### 设置状态栏

#### iOS9以下

`Info.plist`添加两个配置项  
`View controller-based status bar appearance` 设置为 `NO`  
`Status bar style` 设置为 `UIStatusBarStyleLightContent`   

```swift
//文字白色
UIApplication.sharedApplication().setStatusBarStyle(UIStatusBarStyle.LightContent, animated: true)

```

```swift
//文字黑色
UIApplication.sharedApplication().setStatusBarStyle(UIStatusBarStyle.Default, animated: true)
```

#### iOS7-9

ios升到9以后上面的设置会报一下错误  
`CGContextRestoreGState: invalid context 0x0. If you want to see the backtrace`  

`Info.plist`添加两个配置项  
`View controller-based status bar appearance` 设置为 `YES` 

```swift
//navigationController管理的页面
//这样是设置是为了让状态栏文字变成白色   
self.navigationController?.navigationBar.barStyle = UIBarStyle.Black;
```

```swift
//无navigationController的页面
override func preferredStatusBarStyle() -> UIStatusBarStyle {
   return UIStatusBarStyle.LightContent;
}
```

### NavigationController

属性设置

```swift
//设置是否透明
self.navigationController?.navigationBar.translucent = false;
//是否隐藏
self.navigationController?.navigationBarHidden = true;
//设置标题
self.navigationItem.title = "我是标题";

```
全局设置

```swift
var appear = UINavigationBar.appearance();
appear.tintColor = UIColor.orangeColor();
appear.translucent = true;
appear.titleTextAttributes = [NSForegroundColorAttributeName: UIColor.orangeColor(),NSFontAttributeName: UIFont(name: "Heiti SC", size: 18.0)!];
```

### TabBarController

属性设置

```swift
//是否隐藏
self.tabBarController?.tabBar.hidden = true;

```

### TableView

```swift
//设置偏移
self.userbookTableView.contentInset=UIEdgeInsetsMake(-64, 0, 0, 0);

```

### TableViewCell

```swift
//设置cell右面的图标
cell.accessoryType = UITableViewCellAccessoryType.DisclosureIndicator;
```

### Segue传值

```swift
override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    var dv = segue.destinationViewController as! UIViewController;
    var isExist = dv.respondsToSelector(Selector("naviTitle"));
    if(isExist){
        dv.setValue(selectCellName, forKey: "naviTitle")
    }
}
```

### 边缘手势

```swift
//禁止边缘手势
self.navigationController?.interactivePopGestureRecognizer!.enabled = false;
```

### 关闭页面

```swift
//关闭push的页面
self.navigationController?.popViewControllerAnimated(true);

```

```swift
//关闭model的页面
self.dismissViewControllerAnimated(true, completion: {
     ()->Void in
})
```

### 计算tableCell的高度

定义全局变量

```swift
//用于缓存计算高度的cell
var offscreenCells:[String:AnyObject] = [:];
```
保存计算高度的Cell实例  

```swift
let cell = NSBundle.mainBundle().loadNibNamed("PingjiaTableViewCell", owner: nil, options: nil)[0] as! PingjiaTableViewCell;
self.offscreenCells["PingjiaTableViewCell"] = cell;
```
计算高度

```swift
func tableView(tableView: UITableView, heightForRowAtIndexPath indexPath: NSIndexPath) -> CGFloat {
   let item = tableItem[indexPath.section][indexPath.row];
   let cell = self.offscreenCells["PingjiaTableViewCell"] as! PingjiaTableViewCell;
   cell.pingjiaLabel.text = item["text"];
   //不定高度的label的高度
   let textHeight = cell.pingjiaLabel.sizeThatFits(CGSizeMake(cell.pingjiaLabel.frame.size.width, CGFloat(FLT_MAX))).height;
   //把label当成一行所得到的高度
   let minHeight = cell.contentView.systemLayoutSizeFittingSize(UILayoutFittingCompressedSize).height + 1;
   return textHeight + minHeight - 10;
}
```

### TTS

```swift
let player = AVSpeechSynthesizer();
let u = AVSpeechUtterance(string: "今天天气不错挺风和日丽的!");
u.voice = AVSpeechSynthesisVoice(language: "zh-CN");
u.volume = 1.0;//音量 [0-1] Default = 1
u.rate = 0.48;//播放速度
u.pitchMultiplier = 1.0;//播放基准音调 [0.5 - 2] Default = 1
player.speakUtterance(u);
```

### 获取AppDelegate实例

```swift
let appDelegate=UIApplication.sharedApplication().delegate as! AppDelegate;
```

### NSUserDefaults读写

#### 写

```swift
let defaults = NSUserDefaults.standardUserDefaults();
defaults.setObject("zhangjian", forKey: "imUserName");
defaults.synchronize();
```

#### 读

```swift
let defaults = NSUserDefaults.standardUserDefaults();
let userName = defaults.stringForKey("imUserName");
```

#### 清空

```swift
let defaults = NSUserDefaults.standardUserDefaults();
let domainName = NSBundle.mainBundle().bundleIdentifier!;
defaults.removePersistentDomainForName(domainName);
```

### 点击空白隐藏输入法

```swift
override func touchesBegan(touches: Set<UITouch>, withEvent event: UIEvent?) {
   self.view.endEditing(true);
}
```

### View添加点击事件

```swift
var tapRecognizer1:UITapGestureRecognizer!;
var tapRecognizer2:UITapGestureRecognizer!;
var tapRecognizer3:UITapGestureRecognizer!;

//初始化    
tapRecognizer1 = UITapGestureRecognizer(target: self, action: "presentImagePicker:");
tapRecognizer2 = UITapGestureRecognizer(target: self, action: "presentImagePicker:");
tapRecognizer3 = UITapGestureRecognizer(target: self, action: "presentImagePicker:");
   
//添加事件
card1Image.addGestureRecognizer(tapRecognizer1);
//别忘了加这句
card1Image.userInteractionEnabled = true;
card2Image.addGestureRecognizer(tapRecognizer2);
card2Image.userInteractionEnabled = true;
card3Image.addGestureRecognizer(tapRecognizer3);
card3Image.userInteractionEnabled = true;
        
func presentImagePicker(gestureRecognizer: UITapGestureRecognizer) {
   //触发事件的View
   //gestureRecognizer.view
   if(gestureRecognizer == tapRecognizer1){

   }else if(gestureRecognizer == tapRecognizer2){

   }else if(gestureRecognizer == tapRecognizer3){

   }

}
```

### 保留两位小数

```swift
String(format: "%.2f", 3.1415926);
```

### 搜索背景黑块

搜索的时候`navigationController`会逐渐缩小背景的黑色就会显示出来，解决方法就是修改`navigationController`的`view`的背景色

```swift
self.navigationController?.navigationBar.translucent = false;
self.navigationController?.view.backgroundColor = UIColor(red: 250/255, green: 250/255, blue: 250/255, alpha: 1);
```

