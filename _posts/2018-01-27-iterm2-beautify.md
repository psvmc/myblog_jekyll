---
layout: post
title: iTerm2/终端 美化设置
description: iTerm2/终端 美化设置
keywords: mac iterm
categories: centos iterm mac

---

## 前言

一直自己调个`iTerm2`的配色 感觉还挺好看的  但是看网上别人的简直美到无法直视   

就自己也弄了个 中间也遇到了一些问题 就在此记录一下

先看效果

![20180127151701695132778.jpg](http://image.psvmc.cn/20180127151701695132778.jpg)

## iTerm2美化

### 安装

安装[`iTerm2`](http://www.iterm2.com/)

安装[`Oh My ZSH!`](http://ohmyz.sh/)

```bash
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

安装所需字体`Powerline fonts`

```bash
# clone
git clone https://github.com/powerline/fonts.git --depth=1
# install
cd fonts
./install.sh
# clean-up a bit
cd ..
rm -rf fonts
```

### 配置

+ 配置ZSH

  打开配置文件`~/.zshrc` 修改主题配置

  默认

  ```bash
  ZSH_THEME="robbyrussell"
  ```

  修改为

  ```bash
  ZSH_THEME="agnoster"
  ```

+ 配置`iTerm2`

  ![2018012715170166582377.jpg](http://image.psvmc.cn/2018012715170166582377.jpg)

  这里的配色选择`Solarized Dark`

  ![20180127151701674890404.jpg](http://image.psvmc.cn/20180127151701674890404.jpg)

  注意：

  + 这里一定要把半透明取消  否则很难看

  + 配置`iTerm2字体` 任何以`Powerline`结束的字体均可   

    推荐使用`Droid Sans Mono Dotted for Powerline`显示效果较好  

    当然系统`终端`的字体也要修改 否则`终端`里的显示效果就很丑

  + 注意上图中的`Style`配置 要配置为`Full-Width Bottom of Screen`

    否则在窗口拖动大小后文字会错乱

### Powerline 主题

要使用`Powerline 主题` 也要先进行上面的操作 

安装

```bash
git clone git://github.com/jeremyFreeAgent/oh-my-zsh-powerline-theme ~/.ohmyzsh-powerline
cd ~/.ohmyzsh-powerline
./install_in_omz.sh
```

配置ZSH

打开配置文件`~/.zshrc` 修改主题配置

```bash
ZSH_THEME="powerline"
```
## 终端美化

如果你压根就不想用 `iTerm2` 那么你也可以配置`终端`

当然还是要下载`Oh My ZSH!` 方法同上

自体配置

![20180127151702016477420.jpg](http://image.psvmc.cn/20180127151702016477420.jpg)

颜色配置 请自行用吸管取色

![2018012715170201817999.jpg](http://image.psvmc.cn/2018012715170201817999.jpg)

最终效果

![20180127151702029123241.jpg](http://image.psvmc.cn/20180127151702029123241.jpg)