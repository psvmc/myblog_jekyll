---

layout: post
title: afnetworking上传文件-swift
description: afnetworking上传文件-swift
keywords: swift
categories: ios

---


### 具体代码
```swift
func uploadImage(data:NSData,callBack:(result:Bool)->Void){
   let apiBaseUrl = LoadData.apiBaseUrl;
   let url = apiBaseUrl + "user!uploadImg.do";
   let parameters:[String:AnyObject] = [
       "userId": LoadData.userId
   ];
   
   let manager = AFHTTPRequestOperationManager();
   manager.POST(url, parameters: parameters, constructingBodyWithBlock: {
       (formData:AFMultipartFormData!) -> Void in
       formData.appendPartWithFileData(data, name: "upload1", fileName: "shenfenzheng.jpg", mimeType: "image/jpeg");
       }, success: {
           (operation:AFHTTPRequestOperation!, responseObject: AnyObject!) -> Void in
           callBack(result: true);
       }, failure: {
           (operation:AFHTTPRequestOperation?,error:NSError?) -> Void in
           print(error)
           self.clearAllNotice();
           callBack(result: false);
   })
}
```
