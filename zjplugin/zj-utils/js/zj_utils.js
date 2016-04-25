var zjutil = zjutil || {};
String.prototype.trim = function() {
	return this.replace(/(^\s*)|(\s*$)/g, "");
}
String.prototype.ltrim = function() {
	return this.replace(/(^\s*)/g, "");
}
String.prototype.rtrim = function() {
	return this.replace(/(\s*$)/g, "");
}
/**
 * 转json
 */
zjutil.toJson = function(result) {
	if (typeof result == "string") {
		return eval("(" + result + ")");
	} else {
		return result;
	}
}

/**
 * 格式化浮点数
 */
zjutil.formatFloat = function(num, pos) {
	return Math.round(num * Math.pow(10, pos)) / Math.pow(10, pos);
}
/**
 * @author 张剑
 * 
 * 增加zj.formatString功能
 * 
 * 使用方法：zjutil.formatString('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
 * 
 * @returns 格式化后的字符串
 */
zjutil.formatString = function(str) {
	for (var i = 0; i < arguments.length - 1; i++) {
		str = str.replace("{" + i + "}", arguments[i + 1]);
	}
	return str;
};

/**
 * @author 张剑
 * 
 * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
 * 
 * @returns list
 */
zjutil.stringToList = function(value) {
	if (typeof value == "object") {
		return value;
	} else if (value != undefined && value != '') {
		var values = [];
		var t = value.split(',');
		for (var i = 0; i < t.length; i++) {
			values.push('' + t[i]);
		}
		//console.info(values);
		return values;
	} else {
		return [];
	}
};

// 清空form表单
zjutil.clearForm = function(form) {
	$(':input', form).each(function() {
		var type = this.type;
		var tag = this.tagName.toLowerCase();
		if (type == 'text' || type == 'password' || tag == 'textarea') {
			this.value = "";
		} else if (type == 'checkbox' || type == 'radio') {
			this.checked = false;
		} else if (tag == 'select') {
			this.selectedIndex = -1;
		}
	});
};
/**
 * @author 张剑
 * 
 * @requires jQuery
 * 
 * 将form表单元素的值序列化成对象
 * 
 * @returns object
 */
zjutil.serializeObject = function($form) {
	var o = {};
	$.each($form.serializeArray(), function(index) {
		if (o[this['name']]) {
			o[this['name']] = o[this['name']] + "," + this['value'];
		} else {
			o[this['name']] = this['value'];
		}
	});
	return o;
};
//初始化form表单
zjutil.initForm = function(target, data, prefix) {
	$(target).each(function(index, item) {
		var $form = $(item);
		$.each($form.serializeArray(), function() {
			for ( var key in data) {
				if (this["name"] == prefix + key) {
					$form.find("*[name='" + this["name"] + "']").each(function() {
						$(this).val(data[key]);
					})
				}
			}
		});
	});
};
// 日期的格式化
Date.prototype.format = function(format) {
	var o = {
		"M+" : this.getMonth() + 1, // month
		"d+" : this.getDate(), // day
		"h+" : this.getHours(), // hour
		"m+" : this.getMinutes(), // minute
		"s+" : this.getSeconds(), // second
		"q+" : Math.floor((this.getMonth() + 3) / 3), // quarter
		"S" : this.getMilliseconds()
	}

	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}

	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
}
/**
 * 在当前页面创建隐藏iframe并提交
 */
zjutil.iframeGet = function(url) {
	var nowDate = new Date().getSeconds() + '';
	var iframe;
	try {
		iframe = document.createElement('<iframe name="' + nowDate + '">');
	} catch (ex) {
		iframe = document.createElement('iframe');
	}
	iframe.name = nowDate;
	iframe.width = 0;
	iframe.height = 0;
	iframe.marginHeight = 0;
	iframe.marginWidth = 0;
	document.body.appendChild(iframe);
	window.open(url, nowDate);
}
zjutil.post = function(URL, PARAMS) {
	var temp = document.createElement("form");
	temp.action = URL;
	temp.method = "post";
	temp.style.display = "none";
	for ( var x in PARAMS) {
		var opt = document.createElement("input");
		opt.name = x;
		opt.value = PARAMS[x];
		temp.appendChild(opt);
	}
	document.body.appendChild(temp);
	temp.submit();
}
/**
 * 获取字符串的分隔符之前部分
 */
zjutil.getLeftStr = function(str, delimiter) {
	return str.substring(0, str.indexOf(delimiter));
}
/**
 * 获取浏览器信息
 */
zjutil.getBoswerMsg = function() {
	var Sys = {};
	var ua = navigator.userAgent.toLowerCase();
	var s;
	var scan;
	(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

	// 以下进行测试

	if (Sys.ie) {
		scan = {
			"bowser" : "ie",
			"version" : zjutil.getLeftStr(Sys.ie, ".")
		};
	}
	if (Sys.firefox) {
		scan = {
			"bowser" : "firefox",
			"version" : zjutil.getLeftStr(Sys.firefox, ".")
		};
	}
	if (Sys.chrome) {
		scan = {
			"bowser" : "chrome",
			"version" : zjutil.getLeftStr(Sys.chrome, ".")
		};
	}
	if (Sys.opera) {
		scan = {
			"bowser" : "opera",
			"version" : zjutil.getLeftStr(Sys.opera, ".")
		};
	}
	if (Sys.safari) {
		scan = {
			"bowser" : "safari",
			"version" : zjutil.getLeftStr(Sys.safari, ".")
		};
	}
	//console.info(scan);
	return scan;
}
/**
 * 获取iframe中的form对象
 */
zjutil.getIframeForm = function(iframeId, formId) {
	var form = window.frames[iframeId].document.getElementById(formId);
	return form;
}

/**
 * 引用动态页面
 * 
 * 使用实例：
 * 
 * <div name="zj-htmlholder" data-option="{url:'${basePath}index/header'}"></div>
 */
$(function() {
	$("[name=zj-htmlholder]").each(function(i, obj) {
		var option = $(obj).attr("data-option");
		option = zjutil.toJson(option);
		var url = option.url;
		$.ajax({
			async : false,
			cache : false,
			url : url,
			success : function(data) {
				$(obj).replaceWith(data);
			}
		});
	});
})

/**
 * 把一维数组分割为二维数组
 */
zjutil.to2Array = function(data, num) {
	if (data && data.length > 0) {
		var darray = [];
		while (data.length > 0) {
			var temparray = data.splice(0, num);
			darray.push(temparray);
		}
		//console.info(darray);
		return darray;
	} else {
		return data;
	}
}
/**
 * 根据生日算年龄
 */
zjutil.ages = function(str) {
	var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})/);
	if (r == null)
		return false;
	var d = new Date(r[1], r[3] - 1, r[4]);
	if (d.getFullYear() == r[1] && (d.getMonth() + 1) == r[3] && d.getDate() == r[4]) {
		var Y = new Date().getFullYear();
		return ((Y - r[1]));
	}
	return ("保密");
}
/**
 * 数组中查找元素
 */
zjutil.findFirst = function(arr, name, value) {
	for (var i = 0; i < arr.length; i++) {
		if (arr[i][name] == value) {
			return arr[i];
		}
	}
	return null;
};