---

layout: post
title: 网站头配置
description: 网站头配置
keywords: 网站头配置
category: html

---
## 配置logo
	<link rel="icon" href="${basePath}favicon.png" type="image/x-icon" />
	<link rel="shortcut icon" href="${basePath}favicon.png" type="image/x-icon" />
> 网站图标最好放在根目录  
> 图表格式最好为ico

## 关键词
	<meta name="keywords " content="a,b"/>
	<meta name="description " content="aaa"/>

## 编码
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>

## 默认的浏览器引擎

若页面需默认用极速核，增加标签：

	<meta name="renderer" content="webkit">
若页面需默认用ie兼容内核，增加标签：

	<meta name="renderer" content="ie-comp">
若页面需默认用ie标准内核，增加标签：

	<meta name="renderer" content="ie-stand">
我们只需在网站的head标签中添加上面的代码，即可以相对应的模式来渲染网站。
同时我们也可以同时指定多个内核名称，之间以符号”|”进行分隔，如下代码：

	<meta name="renderer" content="webkit|ie-comp|ie-stand">
此时浏览器将会按照从左到右的先后顺序选择其具备的渲染内核来处理当前网页。
提示：目前只有360旗下全系列双核浏览器识别该meta标签。其他浏览器厂商可能会在以后版本的浏览器中添加对该meta标签的支持。






