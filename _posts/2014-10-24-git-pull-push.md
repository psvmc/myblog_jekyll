---

layout: post
title: git常用操作
description: git常用操作
keywords: git
category: git

---

## clone项目

+ 克隆   
`git clone https://github.com/psvmc/RESideMenu_Swift.git ../RESideMenu_Swift`

+ 克隆分支   
`git clone -b 分支名 https://github.com/psvmc/RESideMenu_Swift.git ../RESideMenu_Swift`


> 克隆下来的项目git的配置信息也下载下来了，所以不用`git init`



## 第一次提交  

+ 进入项目的根目录  
`cd  ／xx／xx`
+ git初始化  
`git init`
+ 添加远程库  
`git remote add origin https://github.com/psvmc/RESideMenu_Swift.git`
+ 输入账号密码
+ 添加修改的文件   
`git add .`
+ 提交已添加的文件   
`git commit -m "注释信息"`
+ 修改push到远程   
`git push origin master`

## git提交方式

+ 进入项目的根目录   
  `cd  ／xx／xx`
+ 把远程的pull过来  
  `git pull origin master`
+ 修改文件  
+ 添加修改的文件  
  `git add .`
+ 提交已添加的文件  
  `git commit -m "注释信息"`
+ 修改push到远程  
  `git push origin master`

## 修改提交的备注

```bash
git commit --amend
```



## git分支

+ 添加本地分支  
`git branch <新分支名字>`
+ 切换本地分支  
`git checkout <分支名>`     
该语句和上一个语句可以和起来用一个语句表示：`git checkout -b <分支名>`
+ 添加/推送远程分支  
`git push origin <本地分支>:<远程分支>`
+ 查看本地分支  
`git branch`
+ 查看远程分支  
`git branch -a`
+ 删除本地分支  
`git branch -d <本地分支>`
+ 删除远程分支  
`git push origin :<远程端分支>`
+ 分支合并  
     比如，如果要将开发中的分支（`develop`），合并到稳定分支（`master`），  
     首先切换的`master`分支：`git checkout master`。  
     然后执行合并操作：`git merge develop`。  
     如果有冲突，会提示你，调用`git status`查看冲突文件。  
     解决冲突，然后调用`git add`或`git rm`将解决后的文件暂存。  
     所有冲突解决后，`git commit` 提交更改。  
+ 分支衍合  
     分支衍合和分支合并的差别在于，分支衍合不会保留合并的日志，不留痕迹，而 分支合并则会保留合并的日志。  
     要将开发中的分支（`develop`），衍合到稳定分支（`master`）。  
     首先切换的`master`分支：`git checkout master`。  
     然后执行衍和操作：`git rebase develop`。  
     如果有冲突，会提示你，调用`git status`查看冲突文件。  
     解决冲突，然后调用`git add`或`git rm`将解决后的文件暂存。  
     所有冲突解决后，`git rebase --continue` 提交更改。  


## egit冲突解决方法

+ 提交至本地库  `commit`
+ 进行同步  `Synchronize Workspace`
+ 从远程pull下来`pull`
+ 利用  `Merge Tool` 
+ 选择第二项  `Use HEAD(the last local version) of conflicting files`
+ 手动解决冲突
+ 添加到git index中 `Add to Git index`
+ commit并push `commit and push`

## 本地覆盖远程

```
git push origin master:master --force
```

## git 放弃本地修改 强制更新

```
git fetch --all
git reset --hard origin/master
```

## 冲突

+ 新建分支 `git branch master_backup`
+ 还原 `git reset --hard dca9073`


## 设置用户名与邮箱

### 设置

	git config --global user.name "psvmc"
	git config --global user.email "183518918@qq.com"

### 查看

	git config --get user.name
	git config --get user.email


## 禁止提交文件

加入我们在配置`.gitignore`文件之前就提交了`123.txt`  
那么即使我们以后`.gitignore`中添加上`123.txt`  
该文件依旧会被提交，该怎样解决呢   

### 正确的做法

先移除追踪  

```
git rm --cached 123.txt
```

在提交

```
git commit -m "移除追踪"
```

### 错误的做法

```
git update-index --assume-unchanged <PATH>
```

这样做虽然能达到（暂时的）目的，但并非最正确的做法，这样做是误解了 `git update-index` 的含义，而且这样做带来的最直接（不良）后果是这样的：

+ 所有的团队成员都必须对目标文件执行：`git update-index --assume-unchanged <PATH>`。这是因为即使你让 `Git` 假装看不见目标文件的改变，但文件本身还是在 `Git` 的历史记录里的，所以团队的每个人在 `fetch` 的时候都会拉到目标文件的变更。（但实际上目标文件是根本不想被 `Git` 记录的，而不是假装看不见它发生了改变）  

+ 一旦有人改变目标文件之后没有 `git update-index --assume-unchanged <PATH>` 就直接 `push` 了，那么接下来所有拉取了最新代码的成员必须重新执行 `update-index`，否则 `Git` 又会开始记录目标文件的变化。这一点实际上很常见的，比如说某成员换了机器或者硬盘，重新 `clone` 了一份代码库，由于目标文件还在 `Git` 的历史记录里，所以他／她很可能会忘记 `update-index`。

---

如果你修改的一个文件很大，那么你的每一次修改git都保存历史的话，是很慢的所以  
`git update-index --assume-unchanged` 的真正用法是这样的：


+ 你正在修改一个巨大的文件，你先对其 `git update-index --assume-unchanged`，这样 `Git` 暂时不会理睬你对文件做的修改；
+ 当你的工作告一段落决定可以提交的时候，重置改标识：`git update-index --no-assume-unchanged`，于是 `Git` 只需要做一次更新，这是完全可以接受的了；
+ 提交＋推送。

## Tag操作

 git跟其它版本控制系统一样，可以打标签(tag), 作用是标记一个点为一个版本号，打标签的操作发生在我们`commit修改到本地仓库之后`

### 添加标签

```
git add .
git commit -m "fixed some bugs"
git tag -a 1.0 -m "Release version 1.0"
```

### 上传标签

```
git push origin master
git push origin --tags
```

`--tags`参数表示提交所有tag至服务器 
普通的`git push origin master`操作`不会推送标签到服务器端`

### 删除本地标签

```
git tag -d 1.0
```

### 删除远程标签

```
git push origin :refs/tags/1.0
```

### 改写历史

```
git clone https://github.com/psvmc/psvmc.github.io.git
git filter-branch --tree-filter 'rm -f jekyll-themes/ztheme/images/*.jpg' --tag-name-filter cat -- --all
git push origin --tags --force
git push origin --all --force
```

注意 这也会对`当前的分支进行操作`  
也就是说  上述的例子也会删除当前分支的图片  
如果只想删除历史文件 就要当前的文件先备份一下



## 取消跟踪已版本控制的文件

不再追踪文件改动 

```bash
git update-index --assume-unchanged filePath
```

恢复追踪文件改动 

```bash
git update-index —no-assume-unchanged filePath
```

删除被管理的文件 

```bash
git rm —cached filePath
```

删除被管理的文件夹 

```bash
git rm -r -f —cached filePath
```



