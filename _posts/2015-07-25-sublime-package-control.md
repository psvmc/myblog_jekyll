---

layout: post
title: Sublime text 安装插件管理器 及 常用插件
description: Sublime text 安装package control 及 常用插件
keywords: sublime,插件
categories: sublime

---

## 安装方法

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


