---

layout: post
title: 支付宝SDK swift
description: 支付宝SDK用swift的调用方法
keywords: swift
categories: swift ios

---

### AppDelegate.swift配置

```swift
func application(application: UIApplication, openURL url: NSURL, sourceApplication: String?, annotation: AnyObject) -> Bool {
   if(sourceApplication!.containsString("com.alipay.iphoneclient")){
       AlipaySDK.defaultService().processOrderWithPaymentResult(url, standbyCallback: nil)
       return true;
   }else{
       return true;
   }
}
```

### 调用方法

```swift
/*
*商户的唯一的parnter和seller。
*签约后，支付宝会为每个商户分配一个唯一的 parnter 和 seller。
*/
   
/*============================================================================*/
/*=======================需要填写商户app申请的===================================*/
/*============================================================================*/
let partner = "";
let seller = "";
let privateKey = "";
/*============================================================================*/
/*============================================================================*/
/*============================================================================*/
   
//partner和seller获取失败,提示
if((partner as NSString).length == 0){
  return;
}
   
if((seller as NSString).length == 0){
  return;
}
   
if((privateKey as NSString).length == 0){
  return;
}
   
   
/*
*生成订单信息及签名
*/
//将商品信息赋予AlixPayOrder的成员变量
let order = Order();
order.partner = partner;
order.seller = seller;
order.tradeNO = "order002"; //订单ID（由商家自行制定）
order.productName = "商品标题"; //商品标题
order.productDescription = "商品描述"; //商品描述
order.amount = "0.01"; //商品价格（元）
order.notifyURL =  "http://www.xxx.com"; //回调URL
   
order.service = "mobile.securitypay.pay";
order.paymentType = "1";
order.inputCharset = "utf-8";
order.itBPay = "30m";
order.showUrl = "m.alipay.com";
   
//应用注册scheme,在AlixPayDemo-Info.plist定义URL types
let appScheme = "alisdkyidaisong";
   
//将商品信息拼接成字符串
let orderSpec = order.description;
   
//获取私钥并将商户信息签名,外部商户可以根据情况存放私钥和签名,只需要遵循RSA签名规范,并将签名字符串base64编码和UrlEncode
let signer = CreateRSADataSigner(privateKey);
let signedString = signer.signString(orderSpec);
   
//将签名成功字符串格式化为订单字符串,请严格按照该格式
var orderString:String? = nil;
if (signedString != nil) {
  orderString = NSString(format: "%@&sign=\"%@\"&sign_type=\"%@\"", orderSpec, signedString, "RSA") as String;
  AlipaySDK.defaultService().payOrder(orderString, fromScheme: appScheme, callback: { (resultDic) -> Void in
      if let Alipayjson = resultDic{
          let resultStatus = Alipayjson["resultStatus"] as! String
          if resultStatus == "9000"{
              print("付款成功");
          }else if resultStatus == "8000" {
              print("正在处理中");
              self.navigationController?.popViewControllerAnimated(true)
          }else if resultStatus == "4000" {
              print("订单支付失败");
              self.navigationController?.popViewControllerAnimated(true)
          }else if resultStatus == "6001" {
              print("用户中途取消");
              self.navigationController?.popViewControllerAnimated(true)
          }else if resultStatus == "6002" {
              print("网络连接出错");
              self.navigationController?.popViewControllerAnimated(true)
          }
      }
  })
}
        
```


