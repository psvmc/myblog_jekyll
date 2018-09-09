---

layout: post
title: mac上开发常用的操作
description: mac上开发常用的操作
keywords: mac
category: mac

---



### 显示复制文件夹路径

显示路径在Finder：

> 设置后要重启Finder才能显示

```bash
defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES
```

复制当前文件夹路径的快捷键

```bash
Option+Command+C
```



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

### 命令行中用Sublime Text打开文件

```bash
alias subl="'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'"
```

这样就可以这样打开文件了

```bash
subl a.txt
```

但是这样系统重启后就失效了  
永久生效的方法是编辑`~/.bashrc`文件，每行加入一个`alias`命令

```bash
vim ~/.bashrc
```

或者刚配置的命令

```bash
subl ~/.bashrc
```

添加

```bash
alias subl="'/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl'"
```

同理我们也可以添加`alias ll="ls -l"`，就可以用`ll`来查看文件了

保存退出后运行

```bash
source ~/.bashrc
```

这样就永久生效了


## Mac10.12安装软件任何来源

Mac10.12`安全性与隐私`中安装软件中的`任何来源`被隐藏了。打开方法

```
sudo spctl --master-disable
```