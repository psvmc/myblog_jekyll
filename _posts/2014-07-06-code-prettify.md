---

layout: post
title: 代码高亮与随机色块
description: jekyll代码高亮与随机色块
keywords: 
    - jekyll
    - 代码高亮
    - 随机色块
category: jekyll

---
 
## 代码高亮

```html
<!-- 代码高亮 -->
<link href="{{ site.url }}{{ site.themes }}/google-code-prettify/css/mine.css" rel="stylesheet" type="text/css" media="all" />
<script src="http://apps.bdimg.com/libs/prettify/r298/prettify.js" type="text/javascript"></script>
<script type="text/javascript">
$(function() {
	$('pre').addClass('prettyprint').attr('style', 'overflow:auto');
	window.prettyPrint && prettyPrint();
});
</script>
```	

> 注意  
> --如果引用从google下载js一定不能修改目录结构把所有的js都引进来，而不是只引`prettify.js`  
> --比较好的方法是：`从百度的静态资源库中直接引用`
  
## 随机色块


```js
function randomColor() {
	var colorArray = [ "#99CCFF", "#FFCC00", "#FF9966", "#66CCCC", "#99CCCC", "#CCFF99", "#99CC66", "#FF9900", "#0099CC", "#FF9966" ];
	var tempColor = 0;
	var randomNum = 0;
	$(".main-article li").each(function(i, item) {
		randomNum = Math.floor(Math.random() * colorArray.length);
		while (tempColor == randomNum) {
			randomNum = Math.round(Math.random() * colorArray.length);
		}
		$(item).css("background", colorArray[randomNum]);
		tempColor = randomNum;
	});
};

```


> `.main-article li`改为进行随机的对应的id或class


