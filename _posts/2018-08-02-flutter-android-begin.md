---
layout: post
title: Mac上用Flutter来开发--Android
description: Mac上用Flutter来开发--Android
keywords: flutter
category: flutter

---



## 安装

[`Flutter中文网`](https://flutterchina.club/)

### 下载Flutter

```bash
cd ~
git clone -b beta https://github.com/flutter/flutter.git
```

> 克隆的地址也可以从[`码云`](https://gitee.com/search?utf8=%E2%9C%93&q=flutter&type=)上找

查看PATH

```bash
echo $PATH
```



临时设置

```bash
cd ~
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export PATH=`pwd`/flutter/bin:$PATH
```

永久设置

```
cd ~
pwd
```

比如我的是`/Users/psvmc`

打开配置文件 

如果用的是`bash shell`

```bash
vi .bash_profile
```

如果用的是`zsh`

```bash
open ~/.zshrc
```

添加以下配置

```bash
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export PATH="/Users/psvmc/flutter/bin:$PATH"
```

让配置立即生效

```bash
source .bash_profile
```



Windows执行如下操作

添加环境变量

| 属性                     | 值                            |
| ------------------------ | ----------------------------- |
| PUB_HOSTED_URL           | https://pub.flutter-io.cn     |
| FLUTTER_STORAGE_BASE_URL | https://storage.flutter-io.cn |



删除之前的临时文件

```bash
rm -rf ~/flutter/bin/cache/lockfile
```



接下来运行

```bash
cd ./flutter
flutter doctor
```

这个命令会告诉你你的flutter还缺少什么依赖

接着运行

```bash
flutter
```

第一次运行`flutter`它会自动下载一些依赖，并且进行自动编译。

随后再次运行`flutter`就会跳过这些步骤。



安装完flutter以后`google analytics`默认是自动打开的，国内建议选择关闭：

```bash
flutter config --no-analytics
```

## 终端创建项目

```bash
cd ~
cd Downloads
flutter create my_flutter_app
```

连接上手机 运行项目

```bash
cd my_flutter_app
flutter run
```

在项目目录中，您应用程序的代码位于 `lib/main.dart`

添加新包后

```bash
flutter packages get
```



### 安装插件

`Android Studio`中`Plugins` 查找`dart`和`flutter`并安装。

## 问题

### 运行卡住

Waiting for another flutter command to release the startup lock

+ 1、打开`flutter`的安装目录`/bin/cache/`  
+ 2、删除`lockfile`文件   
+ 3、重启`AndroidStudio`

```bash
rm -rf ~/flutter/bin/cache/lockfile
```



### 插件安装不生效

Android studio安装插件后没有`New Flutter Project`选项的

+ Android Studio更新到`3.0.0`以上的版本
+ 并去`File`-`>Setting`-`>Plugins`更新`Flutter`和`Drat`插件即可



### 环境变量不生效

解决 Mac 下配置环境变量在 ZSH 中无效的问题

在配置 gradle 的时候, 发现在 `/etc/profiles` 中设置了环境变量后, 还是不能在 `zsh` 中使用. 

但在 Terminal 中可以正常使用. 后来发现是因为没有在 `.zshrc` 中配置.

在终端中输入: 

```bash
open ~/.zshrc
```

以此来查看 `.zshrc` 文件, 找到里面的 `# User configuration` 部分. 可以看到当前 zsh 支持的所有本地已配置环境变量.

```bash
export PUB_HOSTED_URL=https://pub.flutter-io.cn
export FLUTTER_STORAGE_BASE_URL=https://storage.flutter-io.cn
export PATH="/Users/zhangjian/flutter/bin:$PATH"
```

里面追加一条想要配置的环境变量路径.

重启 item2 即可。