---

layout: post
title: swift代码段
description: swift代码段
keywords: swift
categories: swift ios

---

### Dictionary排序
```swift
let oldDic:[Int:String] = [
  0 : "张三",
  3 : "李四",
  1 : "王五",
  2 : "找六",
]
   
//根据key排序
let newArray = oldDic.sort({ $0.0 < $1.0 })

//放到新数组中   
var keyArray = Array<Int>();
var valueArray = Array<String>();
for var i = 0;i < newArray.count ; i++ {
  keyArray.append(newArray[i].0)
  valueArray.append(newArray[i].1)
}

```

### 数组
基本遍历

```swift
for element in list {
    print("Item \(element)")
}
```

获取index和对应的项

```swift
for (index, element) in list.enumerate() {
    print("Item \(index): \(element)")
}
```

### 二分法查找数字数组中某数字的下标
```swift
//二分查找方法
static func binarySearch(srcArray:Array<Int>, des:Int) -> Int{
   var low = 0;
   var high = srcArray.count - 1;
   while(low <= high){
       let middle = (low + high)/2;
       if(des == srcArray[middle]){
           return middle;
       }else if(des < srcArray[middle]){
           high = middle - 1;
       }else{
           low = middle + 1;
       }
   }
   return -1;
}
```

### String转CChar数组
```swift
let charArr = "goodday".cStringUsingEncoding(NSUTF8StringEncoding)!;
```

