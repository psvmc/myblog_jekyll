---

layout: post
title: iOS开发 创建podspec文件，为自己的项目添加pod支持
description: Cocoapods作为iOS开发的包管理器，给我们的开发带来了极大的便利，而且越来越多的第三方类库支持Pod，可以通过Pod傻瓜式的集成到自己的工程中，那么问题来了，我自己也有一系列的小工具类，怎么让它也支持pod集成进而让其他朋友方便的使用呢。
keywords: ios
category: ios

---

## 1.上传项目源码

把项目源码上传到gitHub仓库再clone到本地(以[RxSwift-SwiftyJSON](https://github.com/psvmc/RxSwift-SwiftyJSON)为例)， 如果项目本来就在gitHub的仓库中， 直接clone到本地即可

## 2.创建项目的podspec文件

用终端命令cd到本地项目目录并执行如下命令:

```
pod spec create RxSwift-SwiftyJSON
```

这时候本地就生成一个`RxSwift-SwiftyJSON.podspec`文件

用编辑器打开`.podspec`文件 (我自己用Sublime Text)
删除不必要的注释  
这里只简单介绍基本用法，所以只用到一部分必须得字段 更多字段请移步[http://guides.cocoapods.org/syntax/podspec.html](http://guides.cocoapods.org/syntax/podspec.html)


```
Pod::Spec.new do |s|
  s.name         = "RxSwift-SwiftyJSON"
  s.version      = "1.0"
  s.summary      = "SwiftyJSON bindings for RxSwift"
  s.description  = <<-EOS
  Easy to use SwiftyJSON in RxSwift
  EOS
  s.homepage     = "https://github.com/psvmc/RxSwift-SwiftyJSON"
  s.license      = { :type => "MIT", :file => "License" }
  s.author             = { "psvmc" => "183518918@qq.com" }
  s.ios.deployment_target = '8.0'
  s.osx.deployment_target = '10.10'
  s.watchos.deployment_target = '2.0'
  s.tvos.deployment_target = '9.0'
  s.source       = { :git => "https://github.com/psvmc/RxSwift-SwiftyJSON.git", :tag => s.version }
  s.default_subspec = "Core"

  s.subspec "Core" do |ss|
    ss.source_files  = "Source/RxSwift-SwiftyJSON/*.swift"
    ss.dependency "RxSwift", "~> 2.4"
    ss.dependency "SwiftyJSON", "~> 2.3.2"
    ss.framework  = "Foundation"
  end
end
```


验证podspec文件  
编辑完podspec文件后需要验证一下这个文件是否可用  
podspec文件不允许有任何的警告或Error  
执行命令

```
pod lib lint --allow-warnings
```

如果出现

```
-> RxSwift-SwiftyJSON (1.0)

RxSwift-SwiftyJSON passed validation.
```

则说明验证通过， 否则， 根据提示修改`podspec`文件再次验证直到验证通过

如果出现Error但是提示信息不足，可以添加`--verbose` 以获取更多错误信息

```
pod lib lint --verbose
```

## 3.打tag 上传podspec

podspec文件中需要指定的tag， 完成上述操作后给项目打tag

```
git tag -m"first release RxSwift-SwiftyJSON" "1.0"
git push --tags
```

最后使用`pod trunk`命令，把`podspec`文件推送到CocoaPod官方库

`pod trunk` 需要注册

查看个人注册信息

```
pod trunk me
```

如果没有个人信息 就要注册

注册命令

```
pod trunk register 183518918@qq.com 'psvmc'
```

邮箱里验证邮件  点击验证连接后 就可以上传了

上传

```
pod trunk push *.podspec --allow-warnings
```

这个过程可能会比较耗时，原因你懂的

## 4.最后

如果一切顺利

```
pod search RxSwift-SwiftyJSON
```

就可以找到刚才的项目了    

并且还有安装命令

```
pod 'RxSwift-SwiftyJSON'，'~>1.0'
```

## 5.Xcode 8 and iOS 10

如果要提交的组件为`swift3.0`的 就必须满足以下条件

+ `CocoaPods` 升级为 `1.1.0` 及以上
+ 根目录添加`.swift-version`文件 内容写`3.0`

[详细介绍](http://blog.cocoapods.org/CocoaPods-1.1.0/)