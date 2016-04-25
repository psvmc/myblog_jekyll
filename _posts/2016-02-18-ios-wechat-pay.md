---

layout: post
title: iOS微信支付(Swift)
description: iOS微信支付
keywords: ios
category: ios

---

## 前言

微信支付的iOS的Demo真是烂,所有的参数都是后台生成传过来的，完全没参考价值,并且有的注意点文档上也没说，现在我就说一下微信支付开发中需要注意的地方

### 项目配置
把实例项目中的一下文件拖到项目中

```swift
Control文件夹下的WXApiManager.h和WXApiManager.m
libWeChatSDK.a
WXApi.h
WXApiObject.h
```
桥接文件中添加引用

```swift
//微信支付
#import "WXApi.h"
#import "WXApiObject.h"
#import "WXApiManager.h"
```
项目配置选项卡`Info`中`URL Types`中的添加一项  

```swift
identifier 设置为 weixin
URL Schemes 设置为你app微信开放平台上的appid  
```

在AppDelegate中注册  

```swift
func application(application: UIApplication, didFinishLaunchingWithOptions launchOptions: [NSObject: AnyObject]?) -> Bool {
    //微信支付
    WXApi.registerApp("你的APPID ");
}

func application(application: UIApplication, handleOpenURL url: NSURL) -> Bool {
    return WXApi.handleOpenURL(url, delegate: WXApiManager.sharedManager());
    //return UMSocialSnsService.handleOpenURL(url);
}

//这里演示多个共存的处理方法，其中中间是和微信有关的
func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject) -> Bool {
    //支付宝支付
    if(sourceApplication!.containsString("com.alipay.iphoneclient")){
        AlipaySDK.defaultService().processOrderWithPaymentResult(url, standbyCallback: nil)
        return true;
    }
    //微信支付
    else if(sourceApplication!.containsString("com.tencent.xin")){
        return WXApi.handleOpenURL(url, delegate: WXApiManager.sharedManager());
    }
    //友盟分享
    else{
        return UMSocialSnsService.handleOpenURL(url);
    }
}
```

### 需要的三个参数
```swift
appid (微信开放平台中获取)
partnerId (商户ID，在商户平台获取)
API_KEY (API密钥，在商户平台设置)
```

### 支付步骤
支付总体上分为两步  

1. 获取prepayid(预付款ID)
2. 根据prepayid发起支付

第一步获取`prepayid`  
这一步比较变态，它不像平常我们请求接口那样传參，而是把参数和值又拼成XML,再写入request中，实现起来较麻烦，官方也是在后台去实现的，所以建议第一步在后台实现，app端直接掉后台提供的接口  

第二步发起请求  
这一步除下签名相对麻烦点其他都很简单

代码

```swift
let req = PayReq();
req.partnerId = LoadData.WX_PARTNERID;//商户ID
req.prepayId = prepayId;//预支付ID
req.nonceStr = nonceStr;//和第一步一样的随机数
req.timeStamp = UInt32(NSDate(timeIntervalSinceNow: 0).timeIntervalSince1970);//时间戳
req.package = "Sign=WXPay";//固定值
    
var dic:[String:String] = [:];
dic["appid"] = LoadData.WX_APPID;//APPID
dic["partnerid"] = LoadData.WX_PARTNERID;//商户ID
dic["prepayid"] = prepayId;
dic["package"] = "Sign=WXPay";
dic["noncestr"] = req.nonceStr;
dic["timestamp"] = "\(req.timeStamp)";
    
//下面参数中的key是 API密钥
let sign = ZJ_WXPayUtils.getSign(dic, key: LoadData.WX_APIKEY);//获取签名
req.sign = sign;
WXApi.sendReq(req);
```

下面提供一下我用的工具类

```swift
import Foundation
import CryptoSwift

class ZJ_WXPayUtils{
    static var xiadanUrl = "https://api.mch.weixin.qq.com/pay/unifiedorder";
    static var appid = "";//公众账号ID
    static var mch_id = "";//商户号
    static var nonce_str = "";//随机字符串
    static var sign = "";//签名
    static var body = "";//商品描述
    static var out_trade_no = "";//商户订单号
    static var total_fee:Int = 0;//总金额 单位为分
    static var spbill_create_ip = "";//终端IP
    static var notify_url = "";//通知地址
    static var trade_type = "JSAPI";//交易类型
    
    ///获取随机数 包括from  包括to
    static func getRandomNum(from:Int,to:Int) -> Int{
        let result = Int(from + (Int(arc4random()) % (to - from + 1)));
        return result;
    }
    
    static func getSign(dic:Dictionary<String,String>,key:String) -> String{
        var sign = "";
        let dicNew = dic.sort { (a, b) -> Bool in
            return a.0 < b.0;
        }
        
        sign = getQueryStrByDic(dicNew);
        sign += "&key=\(key)";
        sign = sign.md5().uppercaseString;
        return sign;
    }
    
    static func getQueryStrByDic(dic:[(String,String)])->String{
        var pars = "";
        for (index, element) in dic.enumerate() {
            if(index == 0){
                pars += "\(element.0)=\(element.1)";
            }else{
                pars += "&\(element.0)=\(element.1)";
            }
        }
        return pars;
    }

}
```

工具类中用到的第三方库

```swift
pod 'CryptoSwift'
```

