/**
 * 块状样式的select组件
 * 
 * 作者：张剑
 * 
 * QQ：183518918
 * 
 * 博客：www.psvmc.cn
 * 
 * @param $
 */
(function($) {

	$.fn.zjselect_block = function(options) {
		var settings = {
			width : "100px",
			height : "200px",
			url : "",
			pars : {},
			value : "",//默认值
			data : null,
			value : "",
			when : "click",
			num : 1,
			valueField : "value",
			textField : "text",
			addDivStyle : "",//外层div样式
			addInputStyle : "",//输入框的样式
			addSelectStyle : "",//下拉菜单的样式
			yuanjiao : true,
			headerData : [],
			footerData : []
		}
		settings = $.extend({}, settings, options);

		// 定义常量
		var methods = {
			getData : function(settings, $item) {
				if ($item.val() && settings.value == "") {
					settings.value = $item.val();
				}
				if (settings.url != "") {
					$.ajax({
						async : false,
						cache : false,
						url : settings.url,
						data : settings.pars,
						dataType : "json",
						success : function(data) {
							settings.data = data;
						}
					});
				} else if (settings.data != null) {

				} else {
					settings.data = [];
					$item.find("option").each(function(num, item) {
						var itemObj = {};
						itemObj.value = $(item).val();
						itemObj.text = $(item).text();
						settings.data.push(itemObj);
					});
				}
				var tempData = [];
				if (settings.headerData.length > 0) {
					for (var i = 0; i < settings.headerData.length; i++) {
						tempData.push(settings.headerData[i]);
					}
				}
				for (var i = 0; i < settings.data.length; i++) {
					tempData.push(settings.data[i]);
				}
				if (settings.footerData.length > 0) {
					for (var i = 0; i < settings.footerData.length; i++) {
						tempData.push(settings.footerData[i]);
					}
				}
				settings.data = tempData;
				return settings;
			}
		}

		this.each(function(index, item) {
			var valueField = settings.valueField || "value";
			var textField = settings.textField || "text";
			var $this = $(item);
			settings = methods.getData(settings, $this);
			if (typeof options == 'string') {
				switch (options) {
				case 'valueChange':
					$this.next(".zjselect_div").find(".zjselect_show").find("span").html($this.find("option:selected").text());
					return;
				}
			}
			var select = $("<select>");
			select.attr("id", $this.attr("id"));
			select.attr("name", $this.attr("name"));
			for (var i = 0; i < settings.data.length; i++) {
				var option = $("<option>")
				option.attr("value", settings.data[i][valueField]);
				option.text(settings.data[i][textField]);
				select.append(option);
			}
			select.css("display", "none");
			var zjselect_div = $('<div class="zjselect_div">');
			if (settings.addDivStyle != "") {
				if (zjselect_div.attr("style")) {
					zjselect_div.attr("style", zjselect_div.attr("style") + ";" + settings.addDivStyle);
				} else {
					zjselect_div.attr("style", settings.addDivStyle);
				}
			}
			var zjselect_show = $('<div class="zjselect_show">');
			if (settings.yuanjiao) {
				zjselect_show.addClass("zjyuanjiao");
			}
			if (settings.addInputStyle != "") {
				if (zjselect_show.attr("style")) {
					zjselect_show.attr("style", zjselect_show.attr("style") + ";" + settings.addInputStyle);
				} else {
					zjselect_show.attr("style", settings.addInputStyle);
				}
			}
			var span = $('<span>');
			//设置默认值
			if (settings.data.length > 0) {
				if (settings.value != "") {
					select.val(settings.value);
					span.text(select.find("option:selected").text());
				} else {
					select.val(settings.data[0][valueField]);
					span.text(select.find("option:selected").text());
				}
			} else {
				span.text("");
			}

			var b = $('<b>');
			zjselect_show.append(span);
			zjselect_show.append(b);
			zjselect_div.append(zjselect_show);
			var zjselect_pop = $('<div class="zjselect_pop">');
			if (settings.yuanjiao) {
				zjselect_pop.addClass("zjyuanjiao");
			}
			if (settings.addSelectStyle != "") {
				if (zjselect_pop.attr("style")) {
					zjselect_pop.attr("style", zjselect_show.attr("style") + ";" + settings.addSelectStyle);
				} else {
					zjselect_pop.attr("style", settings.addSelectStyle);
				}
			}
			zjselect_pop.css("display", "none").css("width", 210 * settings.num + "px");
			var ul = $("<ul>");
			for (var i = 0; i < settings.data.length; i++) {
				var li = $('<li>');
				var a = $('<a>');
				a.attr("value", settings.data[i][valueField]);
				a.text(settings.data[i][textField]);
				a.click(function() {
					span.text($(this).text());
					select.val($(this).attr("value"));
					zjselect_pop.slideUp(200);
				})
				li.append(a);
				ul.append(li);
			}
			zjselect_pop.append(ul);
			zjselect_div.append(zjselect_pop);
			zjselect_show.click(function() {
				zjselect_pop.slideDown(200);
			});
			zjselect_div.mouseleave(function() {
				zjselect_pop.slideUp(200);
			});
			$(item).replaceWith(select);
			select.after(zjselect_div);
		});

	};
})(jQuery);