---

layout: post
title: Win10 卸载默认应用
description: Win10 卸载默认应用
keywords: windows
category: windows

---



## 卸载默认应用

`PowerShell`可以完全删除一些预装应用，注意是完全的删除，而不是仅仅屏蔽掉。

首先在开始菜单中找到它(搜索`PowerShell`)，右键点击，选择“以管理员身份运行”，然后想要卸载什么，就输入相应的命令。

+ 应用商店：  
`Get-AppxPackage *Microsoft.WindowsStore* | Remove-AppxPackage`
+ 纸牌游戏：   
`Get-AppxPackage *solit* | Remove-AppxPackage`
+ Xbox：   
`Get-AppxPackage *xbox* | Remove-AppxPackage`
+ 新闻订阅：   
`Get-AppxPackage *bing* | Remove-AppxPackage`
+ Groove音乐、电影与电视：  
`Get-AppxPackage *zune* | Remove-AppxPackage`
+ OneNote：  
`Get-AppxPackage *OneNote* | Remove-AppxPackage`
+ 3D打印：   
`Get-AppxPackage *3d* | Remove-AppxPackage`
+ Camera相机：  
`Get-AppxPackage *camera* | Remove-AppxPackage`
+ 邮件和日历：  
`Get-AppxPackage *communi* | Remove-AppxPackage`
+ 人脉：  
`Get-AppxPackage *people* | Remove-AppxPackage`
+ 手机伴侣(Phone Companion)：  
`Get-AppxPackage *phone* | Remove-AppxPackage`
+ 照片：  
`Get-AppxPackage *photo* | Remove-AppxPackage`
+ 录音机：  
`Get-AppxPackage *soundrec* | Remove-AppxPackage`

---

+ 一次性把它们全都删掉，请输入（尽量不要用）：   
`Get-AppxPackage -AllUsers | Remove-AppxPackage`


## 禁用U盘 而不禁用鼠标

+ 1、单击`开始`，然后单击`运行`。   
+ 2、在“打开”框中，键入`regedit`，然后单击“确定”。  
+ 3、找到并单击下面的注册表项：`HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\UsbStor`   
+ 4、在右边窗格中，双击`Start`。     
+ 5、在“数值数据”框中，将原始数值`3`改成`4`。（如果想恢复对USB设备的支持，只需将该值改回`3`即可。）  
+ 6、退出注册表编辑器。

---

或者 保存一下内容为 `禁用USB.reg` 运行即可

```
Windows Registry Editor Version 5.00

[HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Services\USBSTOR]
"Start"=dword:00000004
```

## 禁用IE和常用软件

保存为`禁用IE和常用软件.reg` 运行即可

```
Windows Registry Editor Version 5.00

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\EXPLORER]
"DisallowRun"=dword:00000001

[HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\Explorer\DisallowRun]
"01"="WeChat.exe"
"02"="QQScLauncher.exe"
"03"="QQ.exe"
"04"="iexplore.exe"
"05"="QQBrowser.exe"
"06"="firefox.exe"
"07"="BaiduNetdisk.exe"
"08"="QQMusic.exe"
"09"="360se.exe"
"10"="chrome.exe"
```

## 禁用Edge

链接: [https://pan.baidu.com/s/1i4Lm4wl](https://pan.baidu.com/s/1i4Lm4wl) 密码: qcup

## 禁用蓝牙

+ 开始→运行→输入：`devmgmt.msc` 点击确定（或者按回车键）执行命令，打开设备管理器程序。
+ 删除蓝牙驱动

