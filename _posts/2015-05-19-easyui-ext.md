---

layout: post
title: easyui扩展
description: easyui扩展
keywords: easyui
category: easyui

---

## 验证扩展

### 代码
	/**
	 * @author
	 * 
	 * @requires jQuery,EasyUI
	 * 
	 * 扩展validatebox
	 */
	$.extend($.fn.validatebox.defaults.rules, {
		idcard : {// 验证身份证
			validator : function(value) {
				return /^\d{15}(\d{2}[A-Za-z0-9])?$/i.test(value);
			},
			message : '身份证号码格式不正确'
		},
		minLength : {
			validator : function(value, param) {
				return value.length >= param[0];
			},
			message : '请输入至少（2）个字符.'
		},
		length : {
			validator : function(value, param) {
				var len = $.trim(value).length;
				return len >= param[0] && len <= param[1];
			},
			message : "输入内容长度必须介于{0}和{1}之间."
		},
		phone : {// 验证电话号码
			validator : function(value) {
				return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
			},
			message : '格式不正确,请使用下面格式:020-88888888'
		},
		mobile : {// 验证手机号码
			validator : function(value) {
				return /^(13|15|18)\d{9}$/i.test(value);
			},
			message : '手机号码格式不正确'
		},
		intOrFloat : {// 验证整数或小数
			validator : function(value) {
				return /^\d+(\.\d+)?$/i.test(value);
			},
			message : '请输入数字，并确保格式正确'
		},
		currency : {// 验证货币
			validator : function(value) {
				return /^\d+(\.\d+)?$/i.test(value);
			},
			message : '货币格式不正确'
		},
		qq : {// 验证QQ,从10000开始
			validator : function(value) {
				return /^[1-9]\d{4,9}$/i.test(value);
			},
			message : 'QQ号码格式不正确'
		},
		integer : {// 验证整数
			validator : function(value) {
				return /^[+]?[1-9]+\d*$/i.test(value);
			},
			message : '请输入整数'
		},
		age : {// 验证年龄
			validator : function(value) {
				return /^(?:[1-9][0-9]?|1[01][0-9]|120)$/i.test(value);
			},
			message : '年龄必须是0到120之间的整数'
		},
	
		chinese : {// 验证中文
			validator : function(value) {
				return /^[\Α-\￥]+$/i.test(value);
			},
			message : '请输入中文'
		},
		english : {// 验证英语
			validator : function(value) {
				return /^[A-Za-z]+$/i.test(value);
			},
			message : '请输入英文'
		},
		approveNum:{
			validator : function(value) {
				return /^[\u4e00-\u9fa50-9a-zA-Z 〔〕（）()]+$/i.test(value);
			},
			message : '请输入正确的审批号（允许中文、数字、字母括号）'
		},
		unnormal : {// 验证是否包含空格和非法字符
			validator : function(value) {
				var valid1 = /\s/;
				var valid2 = /[\'\"\,\<\>\+\-\*\/\%\^\=\\\!\&\|\(\)\[\]\{\}\:\;\~\`\#\$]+/;
				if (valid1.test(value) || valid2.test(value)) {
					return false
				} else {
					return true;
				}
			},
			message : '输入值不能为空和包含其他非法字符'
		},
		letter_num : {// 验证字母和数字下划线
			validator : function(value) {
				return /^[a-zA-Z0-9_]+$/i.test(value);
			},
			message : '输入不合法（允许字母数字下划线）'
		},
		username : {// 验证用户名
			validator : function(value) {
				return /^[a-zA-Z][a-zA-Z0-9_]{5,15}$/i.test(value);
			},
			message : '用户名不合法（字母开头，允许6-16字节，允许字母数字下划线）'
		},
		userpwd : {// 验证密码
			validator : function(value) {
				return /^[a-zA-Z0-9_]{6,16}$/i.test(value);
			},
			message : '密码不合法（允许6-16字节，允许字母数字下划线）'
		},
		faxno : {// 验证传真
			validator : function(value) {
				return /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/i.test(value);
			},
			message : '传真号码不正确'
		},
		zip : {// 验证邮政编码
			validator : function(value) {
				return /^[1-9]\d{5}$/i.test(value);
			},
			message : '邮政编码格式不正确'
		},
		ip : {// 验证IP地址
			validator : function(value) {
				return /d+.d+.d+.d+/i.test(value);
			},
			message : 'IP地址格式不正确'
		},
		name : {// 验证姓名，可以是中文或英文
			validator : function(value) {
				return /^[\Α-\￥]+$/i.test(value) | /^\w+[\w\s]+\w+$/i.test(value);
			},
			message : '请输入姓名'
		},
		date : {// 验证日期，可以是中文或英文
			validator : function(value) {
				// 格式yyyy-MM-dd或yyyy-M-d
				return /^(?:(?!0000)[0-9]{4}([-]?)(?:(?:0?[1-9]|1[0-2])\1(?:0?[1-9]|1[0-9]|2[0-8])|(?:0?[13-9]|1[0-2])\1(?:29|30)|(?:0?[13578]|1[02])\1(?:31))|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)([-]?)0?2\2(?:29))$/i.test(value);
			},
			message : '清输入合适的日期格式'
		},
		msn : {
			validator : function(value) {
				return /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(value);
			},
			message : '请输入有效的msn账号(例：abc@hotnail(msn/live).com)'
		},
		same : {
			validator : function(value, param) {
				if ($("#" + param[0]).val() != "" && value != "") {
					return $("#" + param[0]).val() == value;
				} else {
					return true;
				}
			},
			message : '两次输入的密码不一致！'
		}
	});
### 调用方式
无参数

	<input class="easyui-validatebox" data-options="validType:'mobile' " />

有参数

	<input class="easyui-validatebox" data-options="required:true,validType:'length[1,100]' " />
	
多重验证

	<input class="easyui-validatebox" data-options="required:true,validType:['unnormal','length[5,20]']" />

## tree相关组件支持id pid形式
	/**
	 * @author 夏悸
	 * 
	 * @更新 psvmc 添加默认值选中
	 * @requires jQuery,EasyUI
	 * 
	 * 扩展tree，使其支持平滑数据格式
	 */
	$.fn.tree.defaults.loadFilter = function(data, parent) {
		var opt = $(this).data().tree.options;
		var idField, textField, parentField;
	
		idField = opt.idField || 'id';
		textField = opt.textField || 'text';
		parentField = opt.parentField;
		if (opt.parentField) {
			// 根据value选中项
			var value = opt.value;
			if (value) {
				for (i = 0, l = data.length; i < l; i++) {
					if (value.indexOf(data[i][idField]) > -1) {
						data[i]["checked"] = "checked";
					}
				}
			}
			var i, l, treeData = [], tmpMap = [];
			for (i = 0, l = data.length; i < l; i++) {
				tmpMap[data[i][idField]] = data[i];
			}
			for (i = 0, l = data.length; i < l; i++) {
				if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
					if (!tmpMap[data[i][parentField]]['children'])
						tmpMap[data[i][parentField]]['children'] = [];
					data[i]["text"] = data[i][textField];
					tmpMap[data[i][parentField]]['children'].push(data[i]);
				} else {
					data[i]["text"] = data[i][textField];
					treeData.push(data[i]);
				}
			}
			return treeData;
		} else {
			for ( var i = 0; i < data.length; i++) {
				data[i]["text"] = data[i][textField];
			}
		}
	
		return data;
	};
	
	/**
	 * @author
	 * 
	 * @requires jQuery,EasyUI
	 * 
	 * 扩展treegrid，使其支持平滑数据格式
	 */
	$.fn.treegrid.defaults.loadFilter = function(data, parentId) {
		var opt = $(this).data().treegrid.options;
		var idField, textField, parentField;
		if (opt.parentField) {
			idField = opt.idField || 'id';
			textField = opt.textField || 'text';
			parentField = opt.parentField;
			var i, l, treeData = [], tmpMap = [];
			for (i = 0, l = data.length; i < l; i++) {
				tmpMap[data[i][idField]] = data[i];
			}
			for (i = 0, l = data.length; i < l; i++) {
				if (tmpMap[data[i][parentField]] && data[i][idField] != data[i][parentField]) {
					if (!tmpMap[data[i][parentField]]['children'])
						tmpMap[data[i][parentField]]['children'] = [];
					data[i]['text'] = data[i][textField];
					tmpMap[data[i][parentField]]['children'].push(data[i]);
				} else {
					data[i]['text'] = data[i][textField];
					treeData.push(data[i]);
				}
			}
			return treeData;
		}
		return data;
	};
	
	/**
	 * @author
	 * 
	 * @requires jQuery,EasyUI
	 * 
	 * 扩展combotree，使其支持平滑数据格式
	 */
	$.fn.combotree.defaults.loadFilter = $.fn.tree.defaults.loadFilter;