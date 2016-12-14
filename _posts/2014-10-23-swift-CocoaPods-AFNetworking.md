---

layout: post
title: Swift引用AFNetworking
description: Swift利用CocoaPods引用AFNetworking
keywords: swift,ios
category: ios

---

## 什么是 CocoaPods


从介绍看，它是主要给 Objective-C 项目用的，但是我们可以很容易地混合 Objective-C 和 **Swift** 到同个项目，从而利用大量的 CocoaPods 库和 **Swift** 漂亮舒服的语法。

作为 iOS 开发新手，一定是要紧跟前人脚步，学习使用 CocoaPods 。

## 基础用法


### 安装

在命令行下执行。  

+ 移除默认镜像  
`gem sources --remove https://rubygems.org/`   
+ 添加 taobao Mirror 不然被墙掉没办法下载  
`gem sources -a https://gems.ruby-china.org/`
+ 查看用到的镜像  
`gem sources -l`   
+ 安装  
`sudo gem install cocoapods`  
备注：苹果系统升级 `OS X EL Capitan` 后改为   
`sudo gem install -n /usr/local/bin cocoapods`
  
### 使用

假设我们已经有个项目，叫 **ProjName** ，需要使用一些注明的 **CocoaPods** 库，比如 **AFNetworking**.


首先，命令行 `cd 到我们的项目目录`，一般 `ls` 命令会看到如下几个文件夹：

	ProjName
	ProjName.xcodeproj
	ProjNameTests
赞，就是这里，创建一个 Podfile 文本文件

	vim Podfile
写入如下内容

	platform :ios, "8.0"
	pod "AFNetworking", "~> 2.0"
注意，这段文字不是小编凭空生成的，可以在AFNetworking的github页面找到。  
这两句文字的意思是，当前AFNetworking支持的iOS最高版本是iOS 8.0, 要下载的AFNetworking版本大于2.0。
退出编辑命令

```swift
:wq
```
	
这时候，你会发现你的项目目录中，出现一个名字为Podfile的文件，而且文件内容就是你刚刚输入的内容。注意，Podfile文件应该和你的工程文件.xcodeproj在同一个目录下。

这时候，你就可以利用CocoPods下载AFNetworking类库了。  
还是在终端中的当前项目目录下，运行以下命令：

```swift
pod install
```

不更新升级CocoaPods的spec仓库 来缩短`pod install`的时间

```swift
pod install --verbose --no-repo-update
```


误区`install` or `update`

当我们添加新的库的时候，我们要下载库，用的命令是`pod install`,而不是`pod update`,因为在第一次`pod install`后，我们的项目中会生成一个`Podfile.lock`的文件，他的作用是记录我们新添加库的版本信息，这样的话，如果用`pod update`，就会下载新版本的库，导致所有代码都要进行更改，这时`Podfile.lock`也会重新生成   
总之 添加库时一定要用`pod install`命令

因为是在你的项目中导入AFNetworking，这就是为什么这个命令需要你进入你的项目所在目录中运行。
CocoaPods 会创建一个项目同名的 WorkSpace ，然后添加一个叫 Pods 的项目，这个项目编译结果是一个叫 libPods.a的链接库， 它会添加到我们之前的 **ProjName** 项目中作为编译依赖。

当然，通过命令行执行 `pod init` 也可以自动创建 Podfile，而且可以自动分析当前项目的 target ，相对来说更好，也更优雅。具体请参考官方手册。这样的好处是更细致，还可以区分多个子项目子 target 。原理大同小异。

然后接下来，命令行执行 `open ProjName.xcworkspace`，注意这个可不是 **.xcodeproj**，这个是 CocoaPods 为我们创建的一个 WorkSpace ，包含我们之前的项目，和 Pods 依赖。

开始编码过程。直接在代码里调用，比如写在某个按钮的 @IBAction 里：

    let manager = AFHTTPRequestOperationManager()
    let url = "http://api.openweathermap.org/data/2.5/weather"
    println(url)
	//获取原来支持的类型
    var typeSet:NSSet=manager.responseSerializer.acceptableContentTypes;
    //添加新类型
    var newSet=typeSet.setByAddingObject("text/html")
    //设置为新的类型集合
    manager.responseSerializer.acceptableContentTypes = newSet;
    let params = ["lat": 39.26, "lon": 41.03, "cnt":0]
    println(params)

    manager.GET(url,
        parameters: params,
        success: { (operation: AFHTTPRequestOperation!,
                    responseObject: AnyObject!) in
            println("JSON: " + responseObject.description!)
        },
        failure: { (operation: AFHTTPRequestOperation!,
                    error: NSError!) in
            println("Error: " + error.localizedDescription)
        })


看起来貌似我们已经可以在 **Swift** 中使用 **AFNetworking** 了。结果刚写几句代码一堆类和变量找不到定义，而且坑爹的是很多时候我们只能靠猜测，判断这些 Objective-C 的定义转换成 **Swift** 定义是什么样子，用起来就是完全靠蒙！

### Swift引用OC

那就是按照和 Objective-C 代码混编的例子，添加 **Bridging Header** ！

继续

一般说来，你在 **Swift** 项目新建 **Objective-C** 类的时候，直接弹出是否创建 **Bridge Header** 的窗口，点 **YES** 就是了，这时候一般多出来个 **ProjectName-Bridging-Header.h** 。然后删掉这个类， **Bridging Header** 头文件还在。

在这个 **Bridging Header** 文件里写入要导入的 CocoaPods 库，就可以在 **Swift** 中使用了。

	#import <AFNetworking/AFNetworking.h>
如果没有自动创建头文件的话，这个配置在项目的 **Build Settings** 中的 **Swift Compiler – Code Generation** 子项里。

创建一个头文件，指定为 **Bridging Header** 也可以。

然后编译，成功执行！
******

#### 手动添加Bridge Header
在项目的根目录添加一个头文件 假如就叫做 `Bridge-Header.h`  
打开`项目配置` -> `Build Settings`  
搜索 `swift`  
找到`Objective-C Bridging Header`  
设置值为`$(SWIFT_MODULE_NAME)/Bridge-Header.h`


### OC引用Swift

上面说了新建的`Swift`项目中怎样调用`OC`,那么如果本来就是OC项目，怎样调用`Swift`的类呢

首先 

添加 **Bridging Header** 和上面的一样，并不是**OC**引用**Swift**就要再建一个,也就是说**OC**和**Swift**混编时 只需一个 **Bridging Header** 

然后 

**Swift**文件压根没有 **头文件** ，**OC**中咋调用  
这个不用担心，其实系统会**自动**对所有的**Swift**类建立一个**头文件**名字为`项目名-Swift.h`  
假如你的项目名为 **Demo01**  
需要引用**Swift类**的**OC文件(xxxx.m)**只需添加以下引用  
不是**Bridging Header** 文件

```objc  
＃import "Demo01-Swift.h"
```
就行了



> 本文转载至：[参考1](http://andelf.github.io/blog/2014/06/23/use-cocoapods-with-swift/)
> [参考2](http://code4app.com/article/cocoapods-install-usage)