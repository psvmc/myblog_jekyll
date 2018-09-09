---

layout: post
title: Mac上ADB的使用
description: Mac上ADB的使用
keywords: mac android
categories: mac android

---



## 设置环境变量

显示路径在Finder：

> 设置后要重启Finder才能显示

```bash
defaults write com.apple.finder _FXShowPosixPathInTitle -bool YES
```

复制当前文件夹路径的快捷键

```bash
Option+Command+C
```

打开android sdk的所在目录 复制文件夹路径

比如 我的是

```bash
/Users/psvmc/Library/Android/sdk
```

我用的**ZSH** 所以配置环境变量是在`~/.zshrc`中

```bash
open ~/.zshrc
```

添加以下配置

```bash
export ANDROID_HOME=/Users/psvmc/Library/Android/sdk
export PATH=${PATH}:${ANDROID_HOME}/tools
export PATH=${PATH}:${ANDROID_HOME}/platform-tools
```

重启ZSH



如果用的系统的终端 配置的路径为

```bash
open ~/.bash_profile
```

修改后运行以下命令使之生效

```bash
source ~/.bash_profile
```



## ADB命令

### 结束/启动 adb 服务

```bash
adb kill-server
adb start-server 
```

###  查看设备列表及状态

```bash
adb devices
```

设备的状态有 3 种

+ device：设备正常连接 
+ offline：连接出现异常，设备无响应
+ unknown：没有连接设备

### 打印 Android 的系统日志

```bash
adb logcat
```

adb bugreport : 打印dumpsys、dumpstate、logcat的输出，也是用于分析错误

输出比较多，建议重定向到一个文件中

```bash
adb bugreport > ~/Downloads/bugreport.log
```

或

```bash
adb logcat > ~/Downloads/mylog.log
```

### 重启手机

```bash
adb reboot
```
> 只有在运行上一条命令并成功连接手机，此命令起作用。 


### 卸载已安装应用 
```bash
adb uninstall com.example.myapp
```

> `com.example.myapp`所在位置为APP包名


### 安装应用
```bash
adb install -r taobao.apk
```

### 手机文件传送到电脑

```bash
adb pull /sdcard/gen.apk ~/Downloads/
```

> `/sdcard/gen.apk`待传输文件路径



### 电脑文件发送到手机

```bash
adb push gen.apk /sdcard/
```

> `gen.apk`为待发送文件的文件名



### 查看当前adb工具版本号

```bash
adb version
```

### 获取手机序列号

```bash
adb get-serialno
```

> 这个命令获取到的序列号就是利用`adb devices`命令获取的设备列表的序列号

### 远程连接 Android 设备

```bash
adb connect 192.168.1.102
```



## ADB Shell命令

### 查看手机目录及文件

```bash
adb shell
ls
cd /sdcard/
```

退出

```bash
exit
```

### 点亮/熄灭手机屏幕

```bash
adb shell input keyevent 26
```

> keyevent 后面数字是键值，26代表手机电源键


### 获取CPU型号等信息

```bash
adb shell cat /proc/cpuinfo
```

> HardWare后面的就是我们CPU的型号

### 屏幕截图

屏幕截图，并将截图存放在sdcard下，命名为screen.png

```bash
adb shell screencap /sdcard/screen.png
```

> 可搭配指令`adb pull /sdcard/screen.png`将文件复制到电脑

### 录制屏幕

录制屏幕（Android4.4以上可用）

```bash
adb shell screenrecord /sdcard/demo.mp4
```

> 按下ctrl+c，停止录制，搭配指令`adb pull /sdcard/demo.mp4`可将录制文件复制到电脑



### 安装应用

```bash
adb shell pm install taobao.apk
```

> 目标 apk 存放于 PC 端，请用 `adb install` 安装 
>
> 目标 apk 存放于 Android 设备上，请用 `pm install` 安装



### 卸载应用

```bash
adb shell pm uninstall com.example.myapp
```



### 列出手机上的应用

列出所有应用

```bash
adb shell pm list package
```

列出系统应用

```bash
adb shell pm list package -s 
```

列出第三方应用

```bash
adb shell pm list package -3
```

列出应用包名及对应的apk名及存放位置

```bash
adb shell pm list package -f
```

列出第三方应用及存放位置

```bash
adb shell pm list package -f -3
```

列出应用包名及其安装来源

```bash
adb shell pm list package -i
```

过滤关键字，可以很方便地查找自己想要的应用

```bash
adb shell pm list package -f -3 -i taobao
```

列出对应包名的 .apk 位置

```bash
adb shell pm path com.taobao.taobao
```

列出指定应用的 dump 信息

```bash
adb shell pm dump com.taobao.taobao
```

清除应用数据

```bash
adb shell pm clear com.taobao.taobao
```

获取应用安装位置

```bash
adb shell pm get-install-location
```

设置应用安装位置

```bash
adb shell pm set-install-location 2
```

+ [0/auto]：默认为自动
+ [1/internal]：默认为安装在手机内部 
+ [2/external]：默认安装在外部存储  



### 查看手机的信息

```bash
adb shell wm size
```

其它命令

> wm size: return or override display size.
>          width and height in pixels unless suffixed with 'dp'.
>
> wm density: override display density.
>
> wm overscan: set overscan area for display.
>
> wm scaling: set display scaling mode.
>
> wm screen-capture: enable/disable screen capture.
>
> wm dismiss-keyguard: dismiss the keyguard, prompting the user for auth if necessary.
>
> wm surface-trace: log surface commands to stdout in a binary format.



### 查看手机输入法

```bash
adb shell ime list -s 
```



### 浏览器打开网址

```bash
adb shell am start -a android.intent.action.VIEW -d http://www.psvmc.cn
```



### 启动拨号器拨打 10086

```bash
adb shell am start -a android.intent.action.CALL -d tel:10086
```



### 查看正在运行的Activity

```bash
adb shell dumpsys activity | grep -i run
```



### 启动Activivy

```bash
adb shell am start -n com.huawei.camera/com.huawei.camera
```

先停止再启动

```bash
adb shell am start -S com.huawei.camera/com.huawei.camera
```



### 启动相机

```bash
adb shell am start -a android.media.action.STILL_IMAGE_CAMERA
```



### 监控 crash 与 ANR

```bash
adb shell am monitor
```

