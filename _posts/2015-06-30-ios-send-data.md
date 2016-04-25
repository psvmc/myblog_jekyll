---

layout: post
title: iOS 页面传值
description: iOS 页面传值
keywords: ios swift
category: ios

---

本文的所有代码均为swift1.2版本

### 通过通知传值

#### 添加通知的观察者

        NSNotificationCenter.defaultCenter().addObserverForName("userbookListNotification",
            object: nil, queue: nil,
            usingBlock: {
                userbookListNotification ->Void in
                println("通知传过来的数据为：\(userbookListNotification.object?.description)");
        });
  
      
#### 发送通知

	NSNotificationCenter.defaultCenter().postNotificationName("userbookListNotification", object: "我是发送的信息");  
	
> 注意:  
> 必须先添加观察者才能接受发送的通知  
> 所以只适合从子页面传值到父页面


---

### 通过segue传值

新的方式，在`storybord`的`A`和`B`两个ViewController拖出一条`segue`，假如从`A`跳到`B`  

#### A传值到B  

在`A`中添加以下代码  

    //通过segue传值
    override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
        println("segue传值");
        var dv = segue.destinationViewController as! UIViewController;
        var result = dv.respondsToSelector(Selector("setUserBookListData"));
        println("存在:\(result)");
        if(result){
            dv.setValue("123", forKey: "naviTitle");
            
        }
    }

 > 注意:   
 > `setUserBookListData`是`B`中必须有的方法  
 > `naviTitle`是`B`的属性，跳转后会被赋值为`123`
 

#### 从B返回到A传值

 在`A`中添加方法
 
    @IBAction func returnToA(segue: UIStoryboardSegue){
       var b = segue.sourceViewController as! BController;
        println(b.ss);
    }
    
B中的按钮拖一条线到`BController`的`Exit`上，选择`returnToA`
 
 ---
 
### 通过文件传值NSUserDefaults和Sqllite等  

 以下说一下NSUserDefaults的赋值与取值
 
#### 赋值

	var defaults = NSUserDefaults.standardUserDefaults();
	defaults.setObject("psvmc", forKey: "userID");
	defaults.setObject("123456", forKey: "userPassword");
	defaults.synchronize();


#### 取值

	var userId: String? = NSUserDefaults.standardUserDefaults().stringForKey("userID")

---

### 通过AppDelegate传值

	var appDelegate = UIApplication.sharedApplication().delegate as! AppDelegate

---


### 通过协议

假设A传值到B 
 
#### A类

    //定义协议
    protocol AProtocol{
        //协议中得方法不能有结构体
        func sendData(tmpStr: String);
    }

    class AViewController: UIViewController {
        var paramsProtocolDelegate: AProtocol?
        func sendToB(){
            self.paramsProtocolDelegate?.sendData("我是要传的数据");
        }
    }

#### B类

    class BViewController: UIViewController,AProtocol {
        //该类需要遵守协议
        var aViewController = AViewController();
        
        override func viewDidLoad() {
            super.viewDidLoad();
            aViewController.paramsProtocolDelegate = self;
            aViewController.sendToB();
        }
        
        //遵守协议必须重新实现一下协议中得方法
        func sendData(tmpStr: String) {
            println("传过来的值是：\(tmpStr)");
        }
        
    }

> 其实本质就是B把指针给了A，或者说是A保存了B的指针，A能调用B中实现的方法，从而把数据从A传给B



 
 

     
