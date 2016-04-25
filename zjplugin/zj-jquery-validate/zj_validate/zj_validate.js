/**
 * js form验证
 * 
 * 作者：张剑
 * 
 * 博客地址：www.psvmc.cn
 */
$.fn.zjvali = function(globalConfig) {
	var defaultConfig = {
		successTag : "",
		failTag : "",
		itemSuccessFun : "",
		itemFailFun : "",
		submitSuccessFun : "",
		submitFailFun : "",
	}
	defaultConfig = $.extend({}, defaultConfig, globalConfig);
	var resultArray = [];
	this.resultArray = resultArray;
	// form验证的结果
	var form_result = false;
	this.form_result = form_result;
	// 获取验证结果
	function getResult(resultArray) {
		for (var i = 0; i < resultArray.length; i++) {
			if (!resultArray[i]) {
				return false;
			}
		}
		return true;
	}
	function toJson(result) {
		if (typeof result == "string") {
			return eval("(" + result + ")");
		} else {
			return result;
		}
	}
	// 根据方法名执行方法
	function exeFunc(funcName) {
		var func = eval(funcName);
		return new func(arguments[1], arguments[2], arguments[3]);
	}
	function Item() {
		this.name = "";
		this.url = "";
		this.valitype = "";
		this.success = "验证成功";
		this.fail = "验证失败";
		this.required = "required";
		this.targetId = "";
		this.remote = "";
		this.pars = {};
		this.parKey = "";
		this.method = "post";
	}
	var valitype = {};
	// 判断输入内容是否为空
	valitype.required = function(str) {
		var result_ = {};
		if (!str || str.trim().length == 0) {
			result_.success = false;
			result_.msg = "不能为空";
		} else {
			result_.success = true;
			result_.msg = "验证通过";
		}
		return result_;
	}
	// 通用正则匹配方法
	valitype.valiStr = function(str, reg, successHtml, failHtml) {
		var result_ = {};
		// 如果为空就不进行验证
		if (!str || str.trim().length == 0) {
			result_.success = true;
			result_.msg = "";
		} else {
			var r = str.match(reg);
			if (r == null) {
				result_.success = false;
				result_.msg = failHtml;
			} else {
				result_.success = true;
				result_.msg = successHtml;
			}
		}
		return result_;
	}
	// 判断输入的EMAIL格式是否正确
	valitype.email = function(str) {
		reg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的邮箱格式不正确!");
		return result_;
	}
	// 判断输入的手机号格式是否正确
	valitype.mobile = function(str) {
		reg = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的电话有误!");
		return result_;
	}
	// 判断输入的网址格式是否正确
	valitype.url = function(str) {
		reg = /^http:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的网址有误!");
		return result_;
	}
	// 判断输入的固话格式是否正确
	valitype.phone = function(str) {
		reg = /^((\(\d{2,3}\))|(\d{3}\-))?(\(0\d{2,3}\)|0\d{2,3}-)?[1-9]\d{6,7}(\-\d{1,4})?$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的电话有误!");
		return result_;
	}
	// 判断输入的QQ格式是否正确
	valitype.qq = function(str) {
		reg = /^[1-9]\d{4,11}$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的QQ有误!");
		return result_;
	}
	// 判断日期类型是否为YYYY-MM-DD格式的类型
	valitype.date = function(str) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的日期格式不正确!");
		return result_;
	}

	// 判断日期类型是否为YYYY-MM-DD hh:mm:ss格式的类型
	valitype.datetime = function(str) {
		var reg = /^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2}) (\d{1,2}):(\d{1,2}):(\d{1,2})$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的日期格式不正确!");
		return result_;
	}

	// 判断日期类型是否为hh:mm:ss格式的类型
	valitype.time = function(str) {
		reg = /^((20|21|22|23|[0-1]\d)\:[0-5][0-9])(\:[0-5][0-9])?$/
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的时间格式不正确!");
		return result_;
	}

	// 判断输入的字符是否为英文字母
	valitype.litter = function(str) {
		reg = /^[a-zA-Z]+$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的英文字母类型格式不正确!");
		return result_;
	}

	// 判断输入的字符是否为整数
	valitype.num = function(str) {
		reg = /^[-+]?\d*$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的整数类型格式不正确!");
		return result_;
	}

	// 判断输入的字符是否为双精度
	valitype.double = function(str) {
		reg = /^[-\+]?\d+(\.\d+)?$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的双精度类型格式不正确!");
		return result_;
	}

	// 判断输入的字符是否为:a-z,A-Z,0-9
	valitype.string = function(str) {
		reg = /^[a-zA-Z0-9_]+$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入的字符串类型格式不正确!");
		return result_;
	}

	// 判断输入的字符是否为中文
	valitype.chinese = function(str) {
		reg = /^[\u0391-\uFFE5]+$/;
		result_ = valitype.valiStr(str, reg, "通过", "对不起，您输入不是中文!");
		return result_;
	}

	var objArray = [];
	var configArray = [];
	this.configArray = configArray;
	this.objArray = objArray;
	$(':input', this).each(function(num, obj) {
		if ($(obj).attr("vali-config") != undefined) {
			resultArray.push(true);
			var vali_config = $(obj).attr("vali-config");
			if (typeof vali_config == "string") {
				vali_config = eval("(" + vali_config + ")");
			}
			// 合并默认参数与自定义参数
			vali_config = $.extend({}, new Item(), vali_config);
			// 对象数组
			objArray.push(obj);
			// 配置数组
			configArray.push(vali_config);
		}
	});
	// 单项验证
	function itemVali(i, obj, vali_config) {
		var r = {
			success : true
		};
		// ajax验证
		function remoteVali() {
			if (vali_config.remote != "") {
				if (vali_config.parKey != "") {
					vali_config.pars = toJson("{'" + vali_config.parKey + "':'" + $(obj).val() + "'}");
				}
				$.ajax({
					async : false,
					cache : false,
					url : vali_config.remote,
					data : vali_config.pars,
					dataType : "json",
					success : function(data) {
						r.success = data;
						if (data) {
							r.msg = "可以注册"
						} else {
							r.msg = "已存在"
						}
					}
				});
			}
		}
		// 首先正则验证
		if (vali_config.valitype != "") {
			r = exeFunc("valitype." + vali_config.valitype, $(obj).val());
		}
		if (r.success) {
			// 进行必填验证
			if (vali_config.required == "required") {
				r = valitype.required($(obj).val());
				if (r.success) {
					remoteVali();
				}
			} else {
				remoteVali();
			}
		}
		resultArray[i] = r.success;
		if (r.success) {
			if (defaultConfig.successTag != "") {
				var tipTag = $(defaultConfig.successTag);
				tipTag.html(r.msg);
				$("#" + vali_config.targetId).html(tipTag);
			} else {
				$("#" + vali_config.targetId).html(r.msg);
			}
			if (defaultConfig.itemSuccessFun != null) {
				defaultConfig.itemSuccessFun.call(obj);
			}
		} else {
			if (defaultConfig.failTag != "") {
				var tipTag = $(defaultConfig.failTag);
				tipTag.html(r.msg);
				$("#" + vali_config.targetId).html(tipTag);
			} else {
				$("#" + vali_config.targetId).html(r.msg);
			}
			if (defaultConfig.itemFailFun != null) {
				defaultConfig.itemFailFun.call(obj);
			}
		}
		form_result = getResult(resultArray);
	}
	// 注册每个表单验证的方式
	function itemsVali() {
		for (var i = 0; i < objArray.length; i++) {
			$(objArray[i]).keyup(function() {
				var index = 0;
				for (var k = 0; k < objArray.length; k++) {
					if (objArray[k] == this) {
						index = k;
					}
				}
				itemVali(index, this, configArray[index]);
			})
		}
	}
	// 调用
	itemsVali();
	// js暂停
	function sleep(d) {
		for (var t = Date.now(); Date.now() - t <= d;) {
		}
	}
	// 验证全部
	function submitVali() {
		for (var i = 0; i < objArray.length; i++) {
			var obj = objArray[i];
			var vali_config = configArray[i];
			itemVali(i, obj, vali_config);
		}
		return true;
	}
	// 获取提交的返回值
	function submitReturn() {
		if (form_result && defaultConfig.submitSuccessFun != null) {
			defaultConfig.submitSuccessFun.call();
			return false;
		} else if ((!form_result) && defaultConfig.submitFailFun != null) {
			defaultConfig.submitFailFun.call();
			return false;
		} else {
			return form_result;
		}
	}
	$(this).submit(function() {
		submitVali();
		return submitReturn();
	})
	return this;
}
