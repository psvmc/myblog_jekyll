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



