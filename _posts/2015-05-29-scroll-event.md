---

layout: post
title: js监听滚轮事件
description: js监听滚轮事件
keywords: js
category: js

---

## 验证扩展

chrome（ie）与firefox对滚轮事件的监听方式是不一样的,并且返回的数值正负也是正好相反的

### 代码

```html
/*********************** 
 * 函数：注册某元素的滚轮事件 
 * 作者：psvmc
 * 参数：事件源DOM Id ， 回调方法（data） 
 * data: 1：向下  -1：向上 
 *************************/
function scrollEvent(domId, callbackFunc) {
	var dom = document.getElementById(domId);
	var scrollFunc = function(e) {
		var direct = 0;
		e = e || window.event;

		if (e.wheelDelta) {//IE/Opera/Chrome 
			if (e.wheelDelta > 0) {
				direct = -1;
			} else {
				direct = 1;
			}
		} else if (e.detail) {//Firefox 
			if (e.detail > 0) {
				direct = 1;
			} else {
				direct = -1;
			}
		}
		if (callbackFunc) {
			callbackFunc(direct);
		}
	}
	/*注册事件*/
	if (dom.addEventListener) {
		dom.addEventListener('DOMMouseScroll', scrollFunc, false);
	}
	dom.onmousewheel = scrollFunc;//IE/Opera/Chrome
}
```
	

### 调用方式

例如页面上

```html
<div style="width:600px;height:300px" id="target">
	<label for="wheelDelta">滚动值:</label>
	<input type="text" id="wheelDelta" />
</div>
```

使用方式

```html
<script type="text/javascript">
	scrollEvent("target", function(data) {
		if (data == 1) {
			document.getElementById("wheelDelta").value = "向下";
		} else {
			document.getElementById("wheelDelta").value = "向上";
		}
	});
</script>
```
