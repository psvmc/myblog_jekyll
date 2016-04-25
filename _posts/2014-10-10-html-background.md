---

layout: post
title: html背景色渐变
description: html背景色渐变
keywords: background
category: css

---
## 一. Webkit浏览器

### (1) 第一种写法：

	background:-webkit-gradient(linear ,10% 10%，100% 100%，
								color-stop(0.14,rgb(255,0,0)),
								color-stop(0.5,rgb(255,255,0)),
								color-stop(1,rgb(0,0,255)) );

+ 第一个参数：表示的是渐变的类型 linear线性渐变
+ 第二个参数：分别对应x，y方向渐变的起始位置
+ 第三个参数：分别对应x，y方向渐变的终止位置
+ 第四/五/N个参数：设置渐变的位置及颜色

### (2)第二种写法：这种写法比较简单，而且效果比较自然

	background:-webkit-gradient(linear, 0 0, 0 100%, from(＃2074af), to(＃2c91d2));

+ 第一个参数：表示的是渐变的类型 linear线性渐变
+ 第二个参数：分别对应x，y方向渐变的起始位置
+ 第三个参数：分别对应x，y方向渐变的终止位置
+ 第四个参数：设置了起始位置的颜色
+ 第五个参数：设置了终止位置的颜色

## 二.Mozilla浏览器

### (1)第一种写法：

	background:-moz-linear-gradient(10 10 90deg,rgb(25,0,0) 14%,rgb(255,255,0) 50%,rgb(0,0,255) 100%);

+ 第一个参数：设置渐变起始位置及角度
+ 第二/三/四/N个参数：设置渐变的颜色和位置

### (2)第二种写法：这种写法比较简单，而且效果比较自然

	background:-moz-linear-gradient(top, ＃FFC3C8,＃FF9298);

+ 第一个参数：设置渐变的起始位置
+ 第二个参数：设置起始位置的颜色
+ 第三个参数：设置终止位置的颜色

## 三.Opera浏览器

	background: -o-linear-gradient(top, #878d94, #525352);

+ 第一个参数：设置渐变的起始位置
+ 第二个参数：设置起始位置的颜色
+ 第三个参数：设置终止位置的颜色

## 四.IE 浏览器（早期）

### IE浏览器实现渐变只能使用IE自己的滤镜去实现

	filter:progid:DXImageTransform.Microsoft.gradient(startColorstr=＃00ffff,endColorstr=＃9fffff,grandientType=1);

+ 第一个参数：渐变起始位置的颜色
+ 第二个参数：渐变终止位置的颜色
+ 第三个参数：渐变的类型 （0 代表竖向渐变  1  代表横向渐变）  
+ P.S.这里设置背景的时候不需要给background设置，直接用filter即可，不要和其他的浏览器混淆

## 五.IE 浏览器（10,11）

	background: -ms-linear-gradient(top, #878d94 0%, #525352 100%);
	background: linear-gradient(top, #878d94, #525352);

## 六.推荐写法

	_background: #878d94;
	background: -webkit-gradient(linear, 0 0, 0 100%, from(#878d94),to(#525352));
	background: -moz-linear-gradient(top, #878d94, #525352);
	background: -o-linear-gradient(top, #878d94, #525352);
	background: -ms-linear-gradient(top, #878d94 0%, #525352 100%);
	background: linear-gradient(top, #878d94, #525352);
	filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#878d94',endColorstr='#525352');