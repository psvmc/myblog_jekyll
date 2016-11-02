---

layout: post
title: Cocoapods 使用中遇到的问题及解决方法
description: Cocoapods 使用中遇到的问题及解决方法
keywords: ios
category: ios

---

## framework not found Pods

运行 `pod deintegrate` 从你的项目删除CocoaPods的任何痕迹
运行 `pod install --no-repo-update` 重新下载所需的组件

## 组件新版本无法下载

原因是 `pod update --no-repo-update` 中`--no-repo-update`没有更新仓库 去掉就好了

## 项目中找不到引用的组件

`pod install`后项目中`import`不了添加的组件

解决方法  

按着`Option/Alt`键  
`menu` -> `Product` -> `Clean` 就会变成 `Clean Build Folder...`

## 淘宝镜像无法下载

淘宝镜像地址变成`https`了

解决方法

```bash
gem sources -l
gem sources --remove http://ruby.taobao.org/
gem sources -a https://gems.ruby-china.org/
gem sources -l
```

建议使用镜像地址  
`gem sources -a https://gems.ruby-china.org/`

`https://ruby.taobao.org/`不再继续维护 不建议使用

## 更新报错

更新之前要更新`gem`

```bash
gem update --system
```

更新`gem`报错

```
Operation not permitted - /usr/bin/update_rubygems
```

解决方法

+ 安装 [`Homebrew`](http://brew.sh/)
+ 安装gem `brew install ruby`
+ 查看gem版本 `gem -v`


再更新`Cocoapods`

报下述错误

```
Operation not permitted - /usr/bin/xcodeproj
```

 解决方法
 
```bash
sudo gem install -n /usr/local/bin cocoapods --pre
```

查看版本

```bash
pod --version
```

安装

```bash
pod setup
```
 

