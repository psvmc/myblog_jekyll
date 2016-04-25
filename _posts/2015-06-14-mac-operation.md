---

layout: post
title: mac上开发常用的操作
description: mac上开发常用的操作
keywords: mac
category: mac

---

### 显示隐藏文件
+ 显示：  
`defaults write com.apple.finder AppleShowAllFiles -bool true`
+ 隐藏  
`defaults write com.apple.finder AppleShowAllFiles -bool false`  

### 生成获取ssh-key
+ 获取  
`ssh-keygen -y`
+ 生成  
`ssh-keygen -t [rsa|dsa]`
