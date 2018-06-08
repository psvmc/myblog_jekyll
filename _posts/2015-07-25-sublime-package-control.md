---
layout: post
title: Sublime text 安装插件管理器 及 常用插件
description: Sublime text 安装package control 及 常用插件
keywords: sublime,插件
categories: sublime

---



## 安装Sublime text 3

### 下载

#### Sublime Text 3 3176 下载

[`百度云下载地址`](https://pan.baidu.com/s/1ME81rFTlDHoeX3wG0y2vPQ)  密码:`rzm7`

#### Sublime Text 3 3143 下载

+ [Mac 版](https://download.sublimetext.com/Sublime%20Text%20Build%203143.dmg) 或 [`百度云下载地址`](https://pan.baidu.com/s/1x0xo8rVN5bJklVNISVmqmg)  密码:`7nc9`
+ [Windows 版](https://download.sublimetext.com/Sublime%20Text%20Build%203143%20Setup.exe)
+ [Windows 版 64位](https://download.sublimetext.com/Sublime%20Text%20Build%203143%20x64%20Setup.exe)
+ [Linux 版 64位](https://download.sublimetext.com/sublime_text_3_build_3170_x64.tar.bz2)
+ [Linux 版 32位](https://download.sublimetext.com/sublime_text_3_build_3170_x32.tar.bz2)

### 禁止更新 验证

#### 修改Host

+ Windows : `c:/windows/system32/drivers/etc/hosts`
+ Linux : `/etc/hosts`
+ Mac : `/Private/etc/hosts`

添加

```
127.0.0.1       www.sublimetext.com
127.0.0.1       license.sublimehq.com
```

#### 修改配置

设置 `Preferences` -> `Settings-User`

添加 `"update_check": false`

### 注册码

Sublime text 3 `3176` 可用注册码

```bash
----- BEGIN LICENSE -----
sgbteam
Single User License
EA7E-1153259
8891CBB9 F1513E4F 1A3405C1 A865D53F
115F202E 7B91AB2D 0D2A40ED 352B269B
76E84F0B CD69BFC7 59F2DFEF E267328F
215652A3 E88F9D8F 4C38E3BA 5B2DAAE4
969624E7 DC9CD4D5 717FB40C 1B9738CF
20B3C4F1 E917B5B3 87C38D9C ACCE7DD8
5F7EF854 86B9743C FADC04AA FB0DA5C0
F913BE58 42FEA319 F954EFDD AE881E0B
------ END LICENSE ------
```

Sublime text 3 `3143`版本 可用注册码

注册码1

```bash
—– BEGIN LICENSE —–
TwitterInc
200 User License
EA7E-890007
1D77F72E 390CDD93 4DCBA022 FAF60790
61AA12C0 A37081C5 D0316412 4584D136
94D7F7D4 95BC8C1C 527DA828 560BB037
D1EDDD8C AE7B379F 50C9D69D B35179EF
2FE898C4 8E4277A8 555CE714 E1FB0E43
D5D52613 C3D12E98 BC49967F 7652EED2
9D2D2E61 67610860 6D338B72 5CF95C69
E36B85CC 84991F19 7575D828 470A92AB
—— END LICENSE ——
```

注册码2

```
----- BEGIN LICENSE -----
eldon
Single User License
EA7E-1122628
C0360740 20724B8A 30420C09 6D7E046F
3F5D5FBB 17EF95DA 2BA7BB27 CCB14947
27A316BE 8BCF4BC0 252FB8FF FD97DF71
B11A1DA9 F7119CA0 31984BB9 7D71700C
2C728BF8 B952E5F5 B941FF64 6D7979DA
B8EB32F8 8D415F8E F16FE657 A35381CC
290E2905 96E81236 63D2B06D E5F01A69
84174B79 7C467714 641A9013 94CA7162
------ END LICENSE ------
```



## 安装插件管理器

从菜单 `View` - `Show Console` 或者` ctrl + ~` 快捷键，调出 `console`。将以下 Python 代码粘贴进去并 enter 执行，不出意外即完成安装。以下提供 ST3 和 ST2 的安装代码

### Sublime Text 3

```py
import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
```

### Sublime Text 2

```py
import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')
```

### 手动安装

可能由于各种原因，无法使用代码安装，那可以通过以下步骤手动安装Package Control：

1. 点击Preferences > Browse Packages菜单
2. 进入打开的目录的上层目录，然后再进入Installed Packages/目录
3. 下载 Package Control.sublime-package 并复制到Installed Packages/目录
4. 重启Sublime Text。

Package Control 主文件下载地址：[https://github.com/wbond/sublime_package_control](https://github.com/wbond/sublime_package_control)

## 使用方法

快捷键 `Ctrl+Shift+P`（`菜单` – `Tools` – `Command Paletter`），输入 `install` 选中`Install Package`并回车，输入或选择你需要的插件回车就安装了（注意左下角的小文字变化，会提示安装成功）

## 常用插件

+ `SublimeCodeIntel`  代码自动提示
+ `Bracket Highlighter`  
   类似于代码匹配，可以匹配括号，引号等符号内的范围。
+ `ConvertToUTF8` 转换文件编码
+ `GBK Support` 支持GBK编码的文件
+ `Git` 基本上实现了git的所有功能
+ `GitGutter` 这是一个小巧有用的插件，它会告诉你自上次`git commit`以来已经改变的行。一个指示器显示在行号的旁边。
+ `HTML-CSS-JS Prettify`  
    格式化html  需要`nodejs`支持  安装方式 `brew install node`
+ `CssComb` CSS属性进行排序和格式化插件 需要`nodejs`支持
+ `Autoprefixer`  CSS3前缀补充插件  需要`nodejs`支持   
   在输入`CSS3`属性后（冒号前）按`Tab`键
+ `Colorpicker` 颜色选择器  
+ `Alignment` （代码对齐）   
    一个非常简单和易于使用的插件,使你的代码组织和美观。当您重温代码时候非常有用。
使用方法：选中要调整的行，然后按 `Ctrl`+ `Alt` + `A`
+ `Emmet`  
   `Emmet`绝对的节省时间。您可以轻松快速地编写HTML。  
    使用方法: `ctrl` + `alt` + `enter` ,并且开始输入`Emmet`风格的HTML  
+ `DocBlockr`  
   一个真正简单的方式来轻松地创建许多语言包括`JavaScript`，`PHP`和`CoffeeScript`的文档块。只要在函数的上面输入`/**`，按`Tab`就可以了。  
   `DocBlockr`会观察函数需要的变量名和类型，并创建文档块。
+ `SidebarEnhancements`  
   在侧边栏的文件上右击时，这个插件提供了大量更多的选择。`打开` `查找` `复制`和`粘贴`，等等。  
+ `jQuery` jQ函数提示
+ `Autoprefixer` CSS自动添加兼容前缀插件 需要`nodejs`支持  

```json
{
    "browsers": ["last 2 version", "> 1%","ie 6-11"]
}
```

比如上面的配置就是`所有浏览器最新的两个版本` 或者 `全球范围市场占有1%以上的` 或者 `IE6-11`的所有浏览器的适配

### 推荐几个主题

+ `Theme - Afterglow`

```json
"theme": "Afterglow.sublime-theme",
"color_scheme": "Packages/Theme - Afterglow/Afterglow-monokai.tmTheme",
```

+ `Theme - itg.flat`

```json
"theme": "itg.flat.dark.sublime-theme",
"color_scheme": "Packages/Theme - itg.flat/itg.dark.tmTheme",
```

+ `Theme - Spacegray`

```json
"theme": "Spacegray.sublime-theme",
"color_scheme": "Packages/Theme - Spacegray/base16-ocean.dark.tmTheme",
```

+ `Theme - Piatto`

```json
"theme": "Piatto Dark.sublime-theme",
"color_scheme": "Packages/Theme - Piatto/Piatto Dark.tmTheme",
```

+ `Theme - Asphalt`

```json
"theme": "Asphalt.sublime-theme",
"color_scheme": "Packages/Theme - Asphalt/Asphalt.tmTheme",
```

```json
"theme": "Asphalt-orange.sublime-theme",
"color_scheme": "Packages/Theme - Asphalt/Asphalt.tmTheme",
```

+ `Theme - Brogrammer`

```json
"theme": "Brogrammer.sublime-theme",
"color_scheme": "Packages/Theme - Brogrammer/brogrammer.tmTheme",
```



## 我的配置

```
{
	"color_scheme": "Packages/Color Scheme - Default/Monokai Bright.tmTheme",
	"font_size": 14,
	"highlight_line": true,
	"hot_exit": false,
	"remember_open_files": false,
	"save_on_focus_lost": true,
	"update_check": false,
	"word_wrap": "false"
}
```

