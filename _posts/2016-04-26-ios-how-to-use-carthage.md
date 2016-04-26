---

layout: post
title: 怎样使用Carthage
description: CocoaPods发展到现在基本上已经是ios开发的标准依赖工具，我们只需要安装好pod后在项目中新建一个Podfile文件并且写入你需要的三方框架，就能很方便得使用第三方框架，搞技术的都喜欢造轮子，这不又一个轮子Carthage，那它到底有什么优点，是否值得我们换掉CocoaPods呢？
keywords: ios
category: ios

---

## 正文

`CocoaPods`发展到现在基本上已经是ios开发的标准依赖工具，我们只需要安装好`pod`后在项目中新建一个`Podfile`文件并且写入你需要的三方框架，就能很方便得使用第三方框架，搞技术的都喜欢造轮子，这不又一个轮子`Carthage`，那它到底有什么优点，是否值得我们换掉`CocoaPods`呢？

`Carthage`的`优点`有两点：

+ 去中心化
+ 不修改项目配置

对于第一点  也就是不再像`CocoaPods`那样统一管理所有的项目，一旦`CocoaPods`停了 就没法使用了  

它的机制是把项目下载下来（现在一般都在github上，当然也可以在其它git仓库上）  
把需要的组件编译成`Dynamic framework(动态库)` 所以不需要修改项目配置，只要把生成的库引用到项目中即可

但是他也有相应的`缺点`

+ 下载编译慢(因为要把项目下载下来 再编译)
+ 生成的动态库文件较大(比如`Alamofire`用pod只会引入200多k的代码，但生成的库(iOS)就有9M多，并且生成的是多个平台的(`iOS`,`Mac`,`tvOS`,`watchOS`))一共37M，我的天

所以对我来说  我是拒绝用`Carthage`的 

但是既然学了  就记录一下该怎么用它

### 使用方法

下载安装[Homebrew](http://brew.sh/index_zh-cn.html)

打开终端窗口, 粘贴以下脚本

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

接下来就能安装`Carthage`了

```bash
brew update
brew install carthage
```

在你的工程里创建一个`Cartfile`文件 ,并在里面写上类似下面的内容

```
github "Alamofire/Alamofire" ~> 3.3
```

然后执行

```bash
carthage update
```

它会在你的工程目录里生成一个`Carthage`的文件夹,里面有帮你自动生成的`framework`  
一个`Cartfile.resolved`文件 来记录正在使用的`第三方库的版本`  
直接把`framework`拖到工程里就可以使用或者添加`framework`的`search path`

### 让你的项目支持Carthage

具体的方法可以参考这篇文章  
[Carthage使用心得-让自己的项目支持Carthage](http://www.jianshu.com/p/bf263c596538)
