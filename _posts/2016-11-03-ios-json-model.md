---

layout: post
title: iOS开发中 JSON 和 Model 转换 以及泛形的写法
description: iOS开发中 JSON 和 Model 转换 以及泛形的写法
keywords: ios
category: ios

---

## 前言

现在iOS的开发语言 有 `OC` 和 `Swift`  
`Swift` 本来就支持`泛形`  
`OC` 从 `XCode7` 后也支持`泛形`了 

### OC库

现在支持 `JSON` 和 `Model` 转换的`OC库`有很多 例如： 

+ [`MJExtension`](https://github.com/CoderMJLee/MJExtension)
+ [`YYModel`](https://github.com/ibireme/YYModel)
+ [`Mantle`](https://github.com/Mantle/Mantle)
+ [`FastEasyMapping`](https://github.com/Yalantis/FastEasyMapping)
+ [`JSONModel`](https://github.com/jsonmodel/jsonmodel)

前三种无侵入  后两种则需要修改`Model`  
推荐使用`MJExtension`和`YYModel`

但是它们都`不支持`带`泛形的Model`转换

### Swift库

现在支持 `JSON` 和 `Model` 转换的`Swift库` 常用的如下

+ [`ObjectMapper`](https://github.com/Hearst-DD/ObjectMapper)
+ [`SwiftyJSON`](https://github.com/SwiftyJSON/SwiftyJSON)

它们都`支持`带`泛形的Model`转换

## 泛形

### OC泛形

ZJUser.h

```objc
#import <objc/NSObject.h>

@interface ZJUser : NSObject
@property(readwrite,nonatomic,assign) int userId;
@property(nonatomic,copy)NSString* name;
@end
```

ZJUser.m

```objc
#import <Foundation/Foundation.h>
#import "ZJUser.h"

@implementation ZJUser

@end
```

ZJResult.h

```objc
#import <objc/NSObject.h>

@interface ZJResult<objectType:NSObject *> : NSObject
@property(nonatomic,copy)NSString* state;
@property(nonatomic,copy)NSString* message;
@property(nonatomic,strong)objectType data;
@end
```

ZJResult.m

```objc
#import <Foundation/Foundation.h>
#import "ZJResult.h"

@implementation ZJResult

@end
```

使用方式

```objc
ZJResult<ZJUser *> *result = [[ZJResult<ZJUser *> alloc]init];
```

### Swift泛形

#### 配合SwiftyJSON

```swift
import Foundation
import SwiftyJSON

public protocol ZJSwiftyJSONAble {
    init?(jsonData:JSON)
}
```

```swift
import Foundation
import SwiftyJSON

class ZJResult_S<T: ZJSwiftyJSONAble>: ZJSwiftyJSONAble {
    var success: String!
    var msg: String!
    var obj: [T]?


    required init?(jsonData:JSON){
        self.success = jsonData["success"].stringValue
        self.msg = jsonData["msg"].stringValue
        self.obj = jsonData["obj"].arrayValue.flatMap { T(jsonData: $0) }
    }
}
```

```swift
import Foundation
import SwiftyJSON

class ZJArticle_S: ZJSwiftyJSONAble {
    var title: String!
    var keywords: String!
    var description: String!
    var date: String!
    var path: String!
    var url: String!


    required init?(jsonData:JSON){
        self.title = jsonData["title"].stringValue
        self.keywords = jsonData["keywords"].stringValue
        self.description = jsonData["description"].stringValue
        self.date = jsonData["date"].stringValue
        self.path = jsonData["path"].stringValue
        self.url = jsonData["url"].stringValue
    }
}
```

使用方式

```swift
// String --> JSON
let result = ZJResult_S<ZJArticle_S>(jsonData:JSON(jsonObject));
// JSON --> String
if let string = result.rawString() {
    
}
```

#### 配合ObjectMapper

```swift
import Foundation
import ObjectMapper
struct ZJResult<T: Mappable>: Mappable {
    var success: Bool!
    var msg: String!
    var obj: [T]?

    init?(map: Map) {

    }

    // Mappable
    mutating func mapping(map: Map) {
        success     <- map["success"]
        msg         <- map["msg"]
        obj         <- map["obj"]
    }
}
```

```swift
import Foundation
import ObjectMapper
struct ZJArticle: Mappable {
    var title: String!
    var keywords: String!
    var description: String!
    var date: String!
    var path: String!
    var url: String!

    init?(map: Map) {

    }

    // Mappable
    mutating func mapping(map: Map) {
        title    <- map["title"]
        keywords   <- map["keywords"]
        description   <- map["description"]
        date   <- map["date"]
        path   <- map["path"]
        url   <- map["url"]
    }
}
```

使用方式

```swift
// JSON --> Model
let result = Mapper<ZJResult<ZJArticle>>().map(JSONString: JSONString)
// Model --> JSON String
let JSONString = Mapper().toJSONString(result, prettyPrint: true)
```