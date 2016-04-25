---

layout: post
title: jquery常用方法
description: jquery常用方法
keywords: jquery
category: jquery

---


## key事件
	$("#isbn_search").keyup(function(event) {
			if (event.which == 13) {
							
			}
	});
## select操作
	比如<select class="selector"></select>

### 设置value为pxx的项选中

     $(".selector").val("pxx");

### 设置text为pxx的项选中

    $(".selector").find("option[text='pxx']").attr("selected",true);

    这里有一个中括号的用法，中括号里的等号的前面是属性名称，不用加引号。很多时候，中括号的运用可以使得逻辑变得很简单。

### 获取当前选中项的value

    $(".selector").val();

### 获取当前选中项的text

    $(".selector").find("option:selected").text();
### select的级联

	$(".selector1").change(function(){
	     // 先清空第二个
	      $(".selector2").empty();
	     // 实际的应用中，这里的option一般都是用循环生成多个了
	      var option = $("<option>").val(1).text("pxx");
	      $(".selector2").append(option);
	
	});