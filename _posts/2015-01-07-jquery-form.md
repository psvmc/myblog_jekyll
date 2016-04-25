---

layout: post
title: jquery form
description: form异步提交
keywords: jquery-form
category: jquery

---

## 引用jquery.form

	<script type="text/javascript" src="http://libs.useso.com/js/jquery/1.8.3/jquery.min.js"></script>
	<script type="text/javascript" src="http://libs.useso.com/js/jquery.form/3.50/jquery.form.min.js"></script>

## ajaxSubmit与ajaxForm

### 提交配置参数

	var options = {
				url : url, // 覆盖form中action中的url
				type : "post", // 'get' or 'post'   
				dataType : "json", // 'xml', 'script', or 'json'   
				success : function(data){
				//提交成功调用
				//data为返回的数据
				},
				beforeSubmit : function(data){
				//提交之前调用
				//data为请求的数据
				//return false;可以阻止提交
				},
				target : '#output1', // 响应返回的信息给目标赋值 
				clearForm : true, // 提交成功后清空字段    
				resetForm : true, // 提交成功后重置form为最初状态    
				timeout : 3000 //超时时间
			}; 

 
### ajaxSubmit

	直接异步提交form
	$("#form").ajaxSubmit(options);
	

### ajaxForm

	把原form提交方式变为异步提交在form提交时触发
	$("#form").ajaxForm(options);

### 对比

	$("#form").ajaxSubmit(options);
	与
	$("#form").ajaxForm(options);
	$("#form").submit();
	效果是一样的

## 可调用方法

### formSerialize

	将表单序列化成查询串。这个方法将返回一个形如： name1=value1&name2=value2的字符串。
	如：
	var queryString = $('# myFormId).formSerialize();
	等效于var queryString = $.param(formData)方法
	这两个方法返回的值是相同的
	

### fieldSerialize

	将表单里的元素序列化成字符串。当你只需要将表单的部分元素序列化时可以用到这个方法。 这个方法将返回一个形如： name1=value1&name2=value2的字符串。
	var queryString = $('#myFormId .specialFields').fieldSerialize();
	specialFields是该元素的Class值

### fieldValue

	取出所有匹配要求的域的值，以数组形式返回。
	从 0.91 版本开始, 这个方法 始终 返回一个数组。
	如果没有符合条件的域，这个数组将会是个空数组，否则它将会包含至少一个值。
	var value = $('# myFormId':password').fieldValue();
	alert('The password is: ' + value[0]);

### resetForm

	通过调用表单元素的内在的DOM 上的方法把表单重置成最初的状态。
	$('#myFormId').resetForm();

### clearForm

	清空表单所有元素的值。
	这个方法将会清空所有的文本框，密码框，文本域里的值，去掉下拉列表所有被选中的项，让所有复选框和单选框里被选中的项不再选中。
	$('#myFormId').clearForm();

### clearFields

	清空某个表单域的值。
	这个可以用在只需要清空表单里部分元素的值的情况。
	$('#myFormId .specialFields').clearFields();
	specialFields是该元素的Class值
	









