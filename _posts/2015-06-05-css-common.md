---

layout: post
title: 常用的css样式
description: 常用的css样式
keywords: css
category: css

---

## 圆角

	-moz-border-radius: 6px; /* Mozilla浏览器的私有属性 */
	-webkit-border-radius: 6px; /* Webkit浏览器的私有属性 */
	border-radius: 6px 6px 6px 6px; /* 四个半径值分别是左上角、右上角、右下角和左下角 */

## 阴影

	box-shadow: 1px 1px 3px 0px #DADADA;
	-webkit-box-shadow: 1px 1px 3px 0px #DADADA;
	-o-box-shadow: 1px 1px 3px 0px #DADADA;
	-moz-box-shadow: 1px 1px 3px 0px #DADADA;

## 边框

	border: 1px solid #ddd;

## 禁止选择

	moz-user-select: -moz-none;/*火狐浏览器*/
	-moz-user-select: none;/*火狐浏览器*/
	-o-user-select: none;/*opera浏览器*/
	-webkit-user-select: none; /*webkit浏览器*/
	-ms-user-select: none; /*IE10*/
	-khtml-user-select: none; /*早期浏览器*/
	user-select: none;

## 背景图

	background: url('../images/arrow_up.png') center center no-repeat;

## 禁用li样式

	list-style: none;

## 字体

	font-family: "Microsoft YaHei", "Arial", simsun, sans-serif;

