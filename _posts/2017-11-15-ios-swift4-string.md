---

layout: post
title: Swift4 String的用法
description: Swift4 String的用法
keywords: ios
category: ios

---

本文语法为`Swift4`

### 获取字符串的长度

```swift
let  str = "窗前明月光,疑是地上霜";
let length = str.endIndex.encodedOffset;
```

### 正则获取字符串

```swift
let str = "哈哈[呵呵]嘿嘿"
if let range = str.range(
    of: "\\[[^\\[^\\]]+\\]",
    options: NSString.CompareOptions.regularExpression,
    range: nil,
    locale: nil
    ){
    if(range.lowerBound != range.upperBound){
        let leftStr = String(str[str.startIndex..<range.lowerBound]);
        let midStr = String(str[range]);
        let rightStr = String(str[range.upperBound..<str.endIndex]);
        print("左字符串:\(leftStr)")
        print("中字符串:\(midStr)")
        print("右字符串:\(rightStr)")
    } 
}
```

打印的结果

```
左字符串:哈哈
中字符串:[呵呵]
右字符串:嘿嘿
```

### 截取字符串

```swift
let str = "哈哈[呵呵]嘿嘿"
let subStr = str[str.index(of: "[")!..<str.index(after: str.index(of: "]")!)]
print("截取的字符串为:\(subStr)")
```

打印的结果

```
截取的字符串为:[呵呵]
```

### 替换字符串

```swift
let str = "ABcdeAB"
let result = str.replacingOccurrences(of: "AB", with: "ab")
print("替换后:\(result)")
```

打印的结果

```
替换后:abcdeab
```

### 正则替换字符串

```swift
let str = "[哈哈]猪头[害羞]开心[哈哈]"
var tempStr = str;
var isContans = true
while isContans {
    if let range = tempStr.range(
        of: "\\[[^\\[^\\]]+\\]",
        options: NSString.CompareOptions.regularExpression,
        range: nil,
        locale: nil){
        tempStr = tempStr.replacingCharacters(in: range, with: "(表情)")
        print("替换中:\(tempStr)")
    }else{
        isContans = false;
    }
}
print("替换后:\(tempStr)")
```

打印的结果

```
替换中:(表情)猪头[害羞]开心[哈哈]
替换中:(表情)猪头(表情)开心[哈哈]
替换中:(表情)猪头(表情)开心(表情)
替换后:(表情)猪头(表情)开心(表情)
```

### 是否包含

```swift
let str = "哈哈[呵呵]嘿嘿"
let result1 = str.contains("呵呵")
let result2 = str.starts(with: "哈哈")
let result3 = str.hasPrefix("哈哈")
let result4 = str.hasSuffix("嘿嘿")
print("是否包含:\(result1)")
print("是否前缀为XX:\(result2)")
print("是否前缀为XX:\(result3)")
print("是否后缀为XX:\(result4)")
```

打印的结果

```
是否包含:true
是否前缀为XX:true
是否前缀为XX:true
是否后缀为XX:true
```

### 分割字符串

```swift
let str = "哈哈,呵呵,嘿嘿"
let result = str.split(separator: ",")
print("结果:\(result)")
```

打印的结果

```
结果:["哈哈", "呵呵", "嘿嘿"]
```

### 获取子字符串

```swift
let str = "哈哈,呵呵,嘿嘿"
let result1 = str[..<String.Index.init(encodedOffset: 2)]
let result2 = str[String.Index.init(encodedOffset: 6)..<str.endIndex]
print("结果1:\(result1)")
print("结果2:\(result2)")
```

打印的结果

```
结果1:哈哈
结果2:嘿嘿
```

### 字符串合并

```swift
let str = "哈哈,呵呵,嘿嘿"
let result = str.split(separator: ",").joined(separator: ";")
print("结果:\(result)")
```

打印的结果

```
结果:哈哈;呵呵;嘿嘿
```

### 字符串格式化

```swift
let duration = 80
let result = String.init(format: "%02d:%02d", duration / 60,duration % 60);
print("格式化后:\(result)")
```

打印的结果

```
格式化后:01:20
```

### 字符串大小写

```swift
let str = "ABcde"
let result1 = str.uppercased()
let result2 = str.lowercased()
print("大写:\(result1)")
print("小写:\(result2)")
```

打印的结果

```
大写:ABCDE
小写:abcde
```



