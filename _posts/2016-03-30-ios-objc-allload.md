---

layout: post
title: 在iOS的XCode工程配置中为什么要用-all_load和-ObjC
description: 在iOS的XCode工程配置中为什么要用-all_load和-ObjC
keywords: ios
category: ios

---

### 添加位置

`Linking` --> `Other Linker Flags`

### -ObjC

这个flag告诉链接器把库中定义的Objective-C类和Category都加载进来。这样编译之后的app会变大（因为加载了其他的objc代码进来）。但是如果静态库中有类和category的话只有加入这个flag才行。

### -all_load

这个flag是专门处理**-ObjC**的一个bug的。  
用了**-ObjC**以后，如果类库中只有category没有类的时候这些category还是加载不进来。  
变通方法就是加入**-all_load**或者**-force-load**。  
**-all_load**会强制链接器把目标文件都加载进来，即使没有objc代码。  
**-force_load**在xcode3.2后可用。但是-force_load后面必须跟一个只想静态库的路径。