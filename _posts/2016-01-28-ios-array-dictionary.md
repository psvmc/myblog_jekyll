---

layout: post
title: iOS Array和Dictionary常用方法
description: iOS Array和Dictionary常用方法
keywords: ios
category: ios

---

## Dictionary的常用方法

代码

```swift
//创建
var dic:[String:String] = [:];

//赋值
dic["22"] = "222";
dic["bb"] = "bbb";
dic["33"] = "333";
dic["11"] = "111";
dic["aa"] = "aaa";
print("\n赋值dic:\n\(dic)");

print("\n遍历获取下标key:");
for (index, element) in dic.enumerate() {
    print("Item \(index): \(element)")
}

//key的数组
let keySet = Array(dic.keys);
print("\nkey的数组keySet:\n\(keySet)");

//key数组升序排列
let keyNew = keySet.sort { (a, b) -> Bool in
    return a < b;
}
print("\nkey数组升序排列keyNew:\n\(keyNew)");

//dic按key的升序排列
var dicNew = dic.sort { (a, b) -> Bool in
    return a.0 < b.0;
}
print("\ndic按key的升序排列dicNew:\n\(dicNew)");

//移除
dicNew.removeFirst()
print("\n移除dicNew:\n\(dicNew)");
```

控制台输出

```swift
赋值dic:
["22": "222", "11": "111", "aa": "aaa", "bb": "bbb", "33": "333"]

遍历获取下标key:
Item 0: ("22", "222")
Item 1: ("11", "111")
Item 2: ("aa", "aaa")
Item 3: ("bb", "bbb")
Item 4: ("33", "333")

key的数组keySet:
["22", "11", "aa", "bb", "33"]

key数组升序排列keyNew:
["11", "22", "33", "aa", "bb"]

dic按key的升序排列dicNew:
[("11", "111"), ("22", "222"), ("33", "333"), ("aa", "aaa"), ("bb", "bbb")]

移除dicNew:
[("22", "222"), ("33", "333"), ("aa", "aaa"), ("bb", "bbb")]
```

## Array的常用方法

代码

```swift
//创建
var arr:[String] = [];

//赋值
arr.append("111");
arr.append("bbb");
arr.append("aaa");
print("\n赋值arr:\n\(arr)");

//排序
let reverseArr = arr.reverse();
print("\n排序reverseArr:\n\(reverseArr)");

//逆向后遍历
print("\n逆向后遍历key:");
for key in reverseArr{
    print("\(key)");
}

print("\n逆向后遍历获取下标key:");
for (index, element) in reverseArr.enumerate() {
    print("Item \(index): \(element)")
}

//移除
arr.removeFirst()
print("\n移除arr:\n\(arr)");

//范围移除
arr.removeRange(Range(start:0,end:1))
print("\n范围移除arr:\n\(arr)");
```

控制台输出

```swift
赋值arr:
["111", "bbb", "aaa"]

排序reverseArr:
ReverseRandomAccessCollection<Array<String>>(_base: ["111", "bbb", "aaa"])

逆向后遍历key:
aaa
bbb
111

逆向后遍历获取下标key:
Item 0: aaa
Item 1: bbb
Item 2: 111

移除arr:
["bbb", "aaa"]

范围移除arr:
["aaa"]
```