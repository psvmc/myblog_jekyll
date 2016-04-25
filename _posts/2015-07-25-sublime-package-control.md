---

layout: post
title: sublime text 安装插件管理器
description: sublime text 安装package control
keywords: sublime,插件
categories: sublime

---

### 安装方法

从菜单 `View` - `Show Console` 或者` ctrl + ~` 快捷键，调出 `console`。将以下 Python 代码粘贴进去并 enter 执行，不出意外即完成安装。以下提供 ST3 和 ST2 的安装代码

#### Sublime Text 3

    import urllib.request,os; pf = 'Package Control.sublime-package'; ipp = sublime.installed_packages_path(); urllib.request.install_opener( urllib.request.build_opener( urllib.request.ProxyHandler()) ); open(os.path.join(ipp, pf), 'wb').write(urllib.request.urlopen( 'http://sublime.wbond.net/' + pf.replace(' ','%20')).read())
    
#### Sublime Text 2

    import urllib2,os; pf='Package Control.sublime-package'; ipp = sublime.installed_packages_path(); os.makedirs( ipp ) if not os.path.exists(ipp) else None; urllib2.install_opener( urllib2.build_opener( urllib2.ProxyHandler( ))); open( os.path.join( ipp, pf), 'wb' ).write( urllib2.urlopen( 'http://sublime.wbond.net/' +pf.replace( ' ','%20' )).read()); print( 'Please restart Sublime Text to finish installation')

#### 手动安装

可能由于各种原因，无法使用代码安装，那可以通过以下步骤手动安装Package Control：

1. 点击Preferences > Browse Packages菜单
2. 进入打开的目录的上层目录，然后再进入Installed Packages/目录
3. 下载 Package Control.sublime-package 并复制到Installed Packages/目录
4. 重启Sublime Text。

Package Control 主文件下载地址：[https://github.com/wbond/sublime_package_control](https://github.com/wbond/sublime_package_control)

### 使用方法

快捷键 `Ctrl+Shift+P`（`菜单` – `Tools` – `Command Paletter`），输入 `install` 选中`Install Package`并回车，输入或选择你需要的插件回车就安装了（注意左下角的小文字变化，会提示安装成功）