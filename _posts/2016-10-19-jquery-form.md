---

layout: post
title: JqueryForm的使用方式
description: JqueryForm的使用方式
keywords: js
category: js

---

## 前言

什么时候要用jqueryform呢？

+ 想把现有的表单的提交方式变成异步提交的方式
+ 异步上传文件

上面的第一种情况也可以用`jquery` `ajax`来实现 但是一旦表单中有文件上传就必须用`jqueryform`了

+ [下载地址](http://malsup.github.com/jquery.form.js)
+ [官方文档](https://github.com/malsup/form)

## 使用说明

### 常用方法

基本方法

+ ajaxForm(options)
+ ajaxSubmit(options)

辅助方法

+ formToArray()
+ formSerialize() 
+ fieldSerialize()
+ fieldValue()
+ clearForm()
+ clearFields() 
+ resetForm()


ajaxForm 和 ajaxSubmit只能取其中一种

`ajaxForm`时把原form直接变成ajax形式 即点击点击提交按钮时就会异步提交

比如一下的两种形式就是相同的效果

ajaxForm

```js
$('#usergroup_add_form').ajaxForm({
	"url": "${basePath!}userbook_group/add",
	"type": "POST",
	"dataType": "json",
	"data": {},
	"beforeSubmit": function(arr, $form, options) {
		console.info(arr);
		return true;
	},
	"success": function(data) {
		if (data["success"]) {
			
		} else {
			
		}
	}
});
```

ajaxSubmit

```js
$('#myFormId').submit(function() {  
    // 提交表单  
    $(this).ajaxSubmit({
    	"url": "${basePath!}userbook_group/add",
    	"type": "POST",
    	"dataType": "json",
    	"data": {},
    	"beforeSubmit": function(arr, $form, options) {
    		console.info(arr);
    		return true;
    	},
    	"success": function(data) {
    		if (data["success"]) {
    			
    		} else {
    			
    		}
    	}
    });  
    // 阻止默认的表单提交 
    return false;  
});
```

#### Options对象 

`ajaxForm`和`ajaxSubmit`都支持众多的选项参数，这些选项参数可以使用一个Options对象来提供。  
Options只是一个JavaScript对象，它包含了如下一些属性与值的集合： 

+ target 

指明页面中由服务器响应进行更新的元素。元素的值可能被指定为一个jQuery选择器字符串，一个jQuery对象，或者一个DOM元素。 
默认值：null。 

+ url 

指定提交表单数据的URL。 覆盖表单默认值。
默认值：表单的action属性值 

+ type 

指定提交表单数据的方法（method）：`GET`或`POST`。 
默认值：表单的method属性值（如果没有找到默认为`GET`）。 

+ dataType 

>期望返回的数据类型。null、"xml"、"script"或者"json"其中之一。dataType提供一种方法，它规定了怎样处理服务器的响应。这个被直接地反映到jQuery.httpData方法中去。下面的值被支持： 

> + 'xml'：如果dataType == 'xml'，将把服务器响应作为XML来对待。同时，如果"success"回调方法被指定， 将传回responseXML值。 
+ 'json'：如果dataType == 'json'， 服务器响应将被求值，并传递到"success"回调方法，如果它被指定的话。 
+ 'script'：如果dataType == 'script'， 服务器响应将求值成纯文本。 
+ 默认值：null（服务器返回responseText值）

+ beforeSubmit 

表单提交前被调用的回调函数。"beforeSubmit"回调函数作为一个钩子（hook），被提供来运行预提交逻辑或者校验表单数据。如果 "beforeSubmit"回调函数返回false，那么表单将不被提交。"beforeSubmit"回调函数带三个调用参数：数组形式的表单数据，jQuery表单对象，以及传入ajaxForm/ajaxSubmit中的Options对象。 

表单数组接受以下方式的数据： 

```json
[ { name: 'username', value: 'jresig' }, { name: 'password', value: 'secret' } ] 
```

默认值：null 

+ success 

表单成功提交后调用的回调函数。如果提供"success"回调函数，当从服务器返回响应后它被调用。然后由`dataType`选项值决定传回responseText还是responseXML的值。  
默认值：null 



#### 辅助方法

+ formSerialize() 

> 将表单串行化（或序列化）成一个查询字符串。这个方法将返回以下格式的字符串：name1=value1&name2=value2

实例： 

```js
var queryString = $('#myFormId').formSerialize(); 
// 现在可以使用$.get、$.post、$.ajax等来提交数据 
$.post('myscript.php', queryString);
```

+ fieldSerialize() 

> 将表单的字段元素串行化（或序列化）成一个查询字符串。当只有部分表单字段需要进行串行化（或序列化）时，这个就方便了。这个方法将返回以下格式的字符串：name1=value1&name2=value2。   
可链接（Chainable）：不能，这个方法返回一个字符串。 

实例： 

```js
var queryString = $('#myFormId .specialFields').fieldSerialize(); 
```

+ fieldValue() 

>返回匹配插入数组中的表单元素值。从0.91版起，该方法将总是以数组的形式返回数据。如果元素值被判定可能无效，则数组为空，否则它将包含一个或多于一个的元素值。   
可链接（Chainable）：不能，该方法返回数组。 

实例： 

```js
// 取得密码输入值 
var value = $('#myFormId :password').fieldValue(); 
alert('The password is: ' + value[0]); 
```

+ resetForm() 

> 通过调用表单元素原有的DOM方法，将表单恢复到初始状态。   
可链接（Chainable）：可以。 

实例： 

```js
$('#myFormId').resetForm(); 
```

+ clearForm() 

> 清除表单元素。该方法将所有的文本（text）输入字段、密码（password）输入字段和文本区域（textarea）字段置空，清除任何select元素中的选定，以及将所有的单选（radio）按钮和多选（checkbox）按钮重置为非选定状态。  
可链接（Chainable）：可以。 

```js
$('#myFormId').clearForm(); 
```

+ clearFields() 

> 清除字段元素。只有部分表单元素需要清除时才方便使用。   
可链接（Chainable）：可以。 

```js
$('#myFormId .specialFields').clearFields(); 
```