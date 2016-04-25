---

layout: post
title: css3按钮
description: css3按钮
keywords: button
categories: css

---
### 步骤
	一、做出圆角图形
	二、在圆角图像实现渐变
	三、给图形加阴影
	四、给文字加阴影
### css
	.button {
		display: inline-block;
		outline: none;
		text-align: center;
		text-decoration: none;
		text-shadow: 0 1px 1px rgba(0, 0, 0, .3); /*文字阴影*/
		-webkit-border-radius: .5em; /*圆角*/
		-moz-border-radius: .5em;
		border-radius: .5em;
		-webkit-box-shadow: 0 1px 2px rgba(0, 0, 0, .2); /*阴影*/
		-moz-box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
		box-shadow: 0 1px 2px rgba(0, 0, 0, .2);
	}
	
	.button:hover {
		text-decoration: none;
	}
	
	.button:active {
		position: relative;
		top: 0px;
	}
	
	.orange {
		color: #fef4e9;
		border: solid 1px #da7c0c;
		background: #f78d1d;
		background: -webkit-gradient(linear, left top, left bottom, from(#faa51a), to(#f47a20)); /*渐变*/
		background: -webkit-linear-gradient(top, #faa51a, #f47a20);
		background: -moz-linear-gradient(top, #faa51a, #f47a20);
		background: -o-linear-gradient(top, #faa51a, #f47a20);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#faa51a', endColorstr='#f47a20'); /*IE不支持渐变，可以借助滤镜，但是滤镜无法实现圆角渐变，如果按钮要圆角可以把IE这两句去掉，即IE无渐变*/
		-ms-filter: "progid:DXImageTransform.Microsoft.gradient (GradientType=0, startColorstr=#faa51a, endColorstr=#f47a20)";
	}
	
	.orange:hover {
		background: #f47c20;
		background: -webkit-gradient(linear, left top, left bottom, from(#f88e11), to(#f06015));
		background: -moz-linear-gradient(top, #f88e11, #f06015);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f88e11', endColorstr='#f06015');
	}
	
	.orange:active {
		color: #fcd3a5;
		background: -webkit-gradient(linear, left top, left bottom, from(#f47a20), to(#faa51a));
		background: -moz-linear-gradient(top, #f47a20, #faa51a);
		filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#f47a20', endColorstr='#faa51a');
	}
### 调用方式
	<a href="#" class="button orange">Orange</a>