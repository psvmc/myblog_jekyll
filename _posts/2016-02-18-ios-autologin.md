---

layout: post
title: iOS自动登录
description: iOS自动登录
keywords: ios
category: ios

---

## 概要

很多APP为了用户使用方便都加入了自动登录  

假设APP的第一个页面是登陆页面，登录后进入主页、

### 第一种自动登录方法

只在登录页面进行判断，如果用户是自动登录，那么再跳转到主页面，这种方法实现起来相对简单，但是每次登录都要显示登录页面，不人性化

### 另一种方法
根据保存的值判断是否自动登录，直接设置软件的第一个页面

代码如下

```swift
func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    autoLoagin();
    return true
}
    
func autoLoagin(){
    let defaults = NSUserDefaults.standardUserDefaults();
    let userName = defaults.valueForKey("userName");
    let userPwd = defaults.valueForKey("userPwd");
    let userId = defaults.valueForKey("userId");
    if(userName != nil && userPwd != nil && userId != nil){
        let mainViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier(ProjectId.MainScene) as! MainViewController;
        let navi = UINavigationController(rootViewController: mainViewController);
        self.window?.rootViewController = navi;
    }else{
        let loginViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier(ProjectId.loginScene) as! LoginViewController;
        self.window?.rootViewController = loginViewController;
    }
}
```

如上述例子所示  
登陆页面是不受`UINavigationController`管理，而主页面是受`UINavigationController`管理的，只需要在`didFinishLaunchingWithOptions`方法中设置`rootViewController`对应的`Controller`就行了