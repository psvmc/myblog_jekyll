---

layout: post
title: iOS SwiftyJSON 对应的JSON 转化为 对象
description: SwiftyJSON确实很好用 不会因为取了某个空对象的值而导致程序的崩溃，但是 一直这样data["a"]["b"]["c"].stringValue的形式也不太好,那怎样把JSON转换成对象呢
keywords: ios
category: ios

---

## 正文

`SwiftyJSON`确实很好用 不会因为取了某个空对象的值而导致程序的崩溃    
但是 一直这样`data["a"]["b"]["c"].stringValue`的形式也不太好 
那怎样把JSON转换成对象呢

假如`JSON`的数据是这样子的 怎样转成对象呢

```json
{
    "success":"true",
    "msg":"获取用户信息成功",
    "obj":{
        "userName":"张剑",
        "userAlias":"剑行者",
        "invitationCode":100
    }
}
```

### 协议

我们可以定义一个协议 让对象实现它

```swift
import Foundation
import SwiftyJSON

public protocol ZJSwiftyJSONAble {
    init?(jsonData:JSON)
}
```

### 对象转换

然后在定义两个对象

> Result对象

```swift
import Foundation
import SwiftyJSON

class ZJResult_S<T: ZJSwiftyJSONAble>: ZJSwiftyJSONAble {
    var success: String!
    var msg: String!
    var obj: T?
    
    
    required init?(jsonData:JSON){
        self.success = jsonData["success"].stringValue
        self.msg = jsonData["msg"].stringValue
        self.obj = T(jsonData: jsonData["obj"])
    }
}
```

> User对象

```swift
import Foundation
import SwiftyJSON

class ZJUser_S: ZJSwiftyJSONAble {
    var userName: String!
    var userAlias: String!
    var invitationCode: Int!
      
    required init?(jsonData:JSON){
        self.userName = jsonData["userName"].stringValue
        self.userAlias = jsonData["userAlias"].stringValue
        self.invitationCode = jsonData["userAlias"].intValue
    }
}
```

这样假如我们得到的`SwiftyJSON`的`JSON`为`swiftyJSON`

我们就可以这样转

```swift
let result = ZJResult_S<ZJUser_S>(jsonData: swiftyJSON);
```

### 对象数组转换

那如果我们得到的数据是数组呢 该怎样设置对象呢

如`JSON`的数据是这样子的

```json
{
    "success":"true",
    "msg":"获取用户信息成功",
    "obj":[{
        "userName":"张剑",
        "userAlias":"剑行者",
        "invitationCode":100
    },{
        "userName":"李四",
        "userAlias":"尼古拉斯赵四",
        "invitationCode":101
    }]
}
```

这样的话 我们只需把`Result`对象改成这样就行了


> Result对象

```swift
import Foundation
import SwiftyJSON

class ZJResult_S<T: ZJSwiftyJSONAble>: ZJSwiftyJSONAble {
    var success: String!
    var msg: String!
    var obj: [T]!
    
    required init?(jsonData:JSON){
        self.success = jsonData["success"].stringValue
        self.msg = jsonData["msg"].stringValue
        self.obj = jsonData["obj"].arrayValue.flatMap { T(jsonData: $0) }
    }
}
```

是不是很简单 

也就是 假如`swiftyJSON`是`User`的数组

```swift
let users = swiftyJSON.arrayValue.flatMap { ZJUser_S(jsonData: $0) }
```
