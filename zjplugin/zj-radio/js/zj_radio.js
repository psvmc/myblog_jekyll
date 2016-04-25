(function($) {
	$.fn.zj_radio = function(options) {
		//配置参数
		var settings = $.extend({
			value : "",
			targetSelector : "",
			name : "",
			checkCls : "zj-radio-check",
			uncheckCls : "zj-radio-uncheck",
			data : [],
			url : "",
			pars : {},
			valueField : "value",
			textField : "text",
			headerData : [],
			footerData : []
		}, options);
		//用到的方法
		var methods = {
			getData : function(settings) {
				var data_ = [];
				if (settings.url != "") {
					$.ajax({
						async : false,
						cache : false,
						url : settings.url,
						data : settings.pars,
						dataType : "json",
						success : function(data) {
							data_ = data;
						}
					});
				} else if (settings.data != null) {
					data_ = settings.data;
				}
				var tempData = [];
				if (settings.headerData.length > 0) {
					for (var i = 0; i < settings.headerData.length; i++) {
						tempData.push(settings.headerData[i]);
					}
				}
				for (var i = 0; i < data_.length; i++) {
					tempData.push(data_[i]);
				}
				if (settings.footerData.length > 0) {
					for (var i = 0; i < settings.footerData.length; i++) {
						tempData.push(settings.footerData[i]);
					}
				}
				return tempData;
			}
		};
		this.each(function(index) {
			var $this = $(this);
			if (settings.name == "" && $this.attr("name")) {
				settings.name = $this.attr("name");
			}
			var data = methods.getData(settings);
			var valueField = settings.valueField || "value";
			var textField = settings.textField || "text";
			var div = $("<div>");
			div.css("display", "inline-block");
			if (data.length > 0 && settings.value == "") {
				settings.value = data[0][valueField];
			}
			var checkCls = settings.checkCls;
			var uncheckCls = settings.uncheckCls;
			for (var i = 0; i < data.length; i++) {
				var label = $("<label>");
				label.attr("class", "zj-radio");
				var radio = $('<input type="radio">');
				radio.attr("name", settings.name);
				radio.attr("value", data[i][valueField]);
				if (settings.value == data[i][valueField]) {
					radio.attr("checked", "checked");
					label.addClass(checkCls);
				} else {
					label.addClass(uncheckCls);
				}
				label.append(radio);
				label.append(data[i][textField]);
				label.click(function() {
					$(this).parent().find("label").attr("class", "zj-radio " + uncheckCls);
					$(this).removeClass(uncheckCls);
					$(this).addClass(checkCls);
				});
				div.append(label);
			}
			$this.replaceWith(div);
		});
	};
})(jQuery);