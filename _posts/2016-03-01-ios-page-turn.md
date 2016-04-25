---

layout: post
title: iOS 页面跳转的方式
description: iOS 页面跳转的方式
keywords: ios
category: ios

---


## 概述
iOS页面跳转有人说是五种，其实上本质上可以分三种   

+ 一种是置换（常见的是app自动登录，根据用户是否退出，显示不同的第一个页面）  
+ 一种`UINavigationController` 进行`push` 或 `pop`
+ 还有就是`modal`形式（`presentViewController`）


## 例子

### 置换

```swift
if(autoLogin){
    let mainController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("mainScene") as! MainTabBarViewController;
    self.window?.rootViewController = mainController;
}else{
    let loginViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewControllerWithIdentifier("loginScene") as! LoginViewController;
    let navi = UINavigationController(rootViewController: loginViewController);
    self.window?.rootViewController = navi;
}
```


### UINavigationController控制

```swift
//push新页面
self.navigationController?.pushViewController(myViewController, animated: true)
//关闭最上层页面
self.navigationController?.popViewControllerAnimated(true)
```

这种方式和用**storyboard**中的拖线选**push**是一样的原理

```swift
//先定义segue的ID
self.performSegueWithIdentifier("xiangmuSegue", sender: self);
```

### modal形式

```swift
//打开新页面
self.presentViewController(myViewController, animated: true, completion: nil);
//关闭置顶model页面  
self.dismissViewControllerAnimated(true, completion: nil)
```

**storyboard**形式同上

### push和modal的区别

modal方式 就相当于一个一个桌子  
push方式 就相当于摞盘子  
所以push方式 打开的页面在原页面的上面，关闭的时候也只能从上往下关，不能关闭中间的一个  
而modal方式  如果一个桌子上放了一碟盘子 ，那么关闭这个桌子的话，上面的所有盘子也会关闭

