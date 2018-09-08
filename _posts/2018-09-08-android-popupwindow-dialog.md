---

layout: post
title: Dialog和PopupWindow的区别
description: Dialog和PopupWindow的区别
keywords: android
category: android

---



## 前言

 Android中的对话框有多种：

+ Toast
+ OptionsMenu
+ PopupWindow
+ Dialog

它们都可以实现弹窗功能，但是他们之间有一些差别，下面我们先对比`Dialog`和`PopuWindow`区别。



## 对比

- Popupwindow在显示之前一定要设置宽高，Dialog无此限制。

- Popupwindow默认不会响应物理键盘的back，除非显示设置了`popup.setFocusable(true);`

  而在点击back的时候，Dialog会消失。

- Popupwindow不会给页面其他的部分添加蒙层，而Dialog会。

- Popupwindow没有标题，Dialog默认有标题，可以通过`dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);`取消标题

- 二者显示的时候都要设置Gravity。如果不设置，Dialog默认是Gravity.CENTER。

- 二者都有默认的背景，都可以通过`setBackgroundDrawable(new ColorDrawable(android.R.color.transparent));`去掉。

其中最本质的差别就是：

+ AlertDialog是非阻塞式对话框：AlertDialog弹出时，后台还可以做事情；

+ PopupWindow是阻塞式对话框：PopupWindow弹出时，程序会等待，

  在PopupWindow退出前，程序一直等待，只有当我们调用了dismiss方法的后，PopupWindow退出，程序才会向下执行。

这两种区别的表现是：

+ AlertDialog弹出时，背景是黑色的，但是当我们点击背景，AlertDialog会消失，证明程序不仅响应AlertDialog的操作，还响应其他操作，其他程序没有被阻塞，这说明了AlertDialog是非阻塞式对话框；

+ PopupWindow弹出时，背景没有什么变化，但是当我们点击背景的时候，程序没有响应，只允许我们操作PopupWindow，其他操作被阻塞。