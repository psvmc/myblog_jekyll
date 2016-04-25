/**
 * 
 * @param $
 */
(function($) {

	$.fn.zj_select_multilevel = function(options) {
		var settings = {
			width : "100px",
			height : "200px",
			url : "",
			pars : {},
			data : null,
			value : "",
			when : "click",
			num : 3
		}

		// 定义常量
		settings = $.extend({}, settings, options);
		var idFiled = settings.idFiled || 'id';
		var textFiled = settings.textFiled || 'text';
		var parentField = settings.parentField || 'pid';
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

		}

		// 所有的选项
		var selectData = [];
		function pushChildren(tempData) {
			if (tempData.children) {
				var data = tempData.children;
				for (var i = 0; i < data.length; i++) {
					selectData.push(data[i]);
					pushChildren(data[i]);
				}
			}
		}
		if (settings.data) {
			var data = settings.data;
			// 父子元素添加到tempData
			var tempItem = {};
			for (var i = 0; i < data.length; i++) {
				selectData.push(data[i]);
				pushChildren(data[i]);
			}
		}
		// 生成隐藏的select
		var select = $("<select>");
		select.attr("id", this.attr("id"));
		select.attr("name", this.attr("name"));
		for (var i = 0; i < selectData.length; i++) {
			var option = $("<option>")
			option.attr("value", selectData[i][idFiled]);
			option.text(selectData[i][textFiled]);
			select.append(option);
		}
		select.css("display", "none");
		// 根据父子Id生成
		if (settings.data.length > 0 && settings.data[0].pid != undefined) {
			var treeData = [], tmpMap = [];
			var data = settings.data;
			for (var i = 0; i < data.length; i++) {
				tmpMap[data[i][idFiled]] = data[i];
			}
			for (var i = 0; i < data.length; i++) {
				if (tmpMap[data[i][parentField]] && data[i][idFiled] != data[i][parentField]) {
					if (!tmpMap[data[i][parentField]]['children'])
						tmpMap[data[i][parentField]]['children'] = [];
					data[i]['text'] = data[i][textFiled];
					tmpMap[data[i][parentField]]['children'].push(data[i]);
				} else {
					data[i]['text'] = data[i][textFiled];
					treeData.push(data[i]);
				}
			}
			settings.data = treeData;
		}
		// 遍历数据生成html
		var zj_select_multilevel = $('<div class="zj-select-multilevel">');
		var showDiv = $('<div class="showDiv">');
		var showDiv_span = $('<span>');
		showDiv_span.text("请选择");
		var showDiv_b = $('<b>');
		showDiv.append(showDiv_span);
		showDiv.append(showDiv_b);
		var popDiv = $('<div class="popDiv">');
		var table = $('<table>');
		var data = settings.data;
		for (var i = 0; i < data.length; i++) {
			var tr = $("<tr>");
			var th = $('<th>');
			th.text(data[i]['text']);
			var td = $('<td>');
			var ul = $('<ul>');
			var children = [];
			if (data[i].children) {
				children = data[i].children;
				//console.info(data[i].children);
			}
			for (var j = 0; j < children.length; j++) {
				var li = $('<li>');
				var p_level2 = $('<p>');
				var span_level2 = $('<span>');
				var a_level2 = $('<a>');
				a_level2.attr("value", children[j].id);
				a_level2.text(children[j].text);
				// 添加事件
				a_level2.click(function() {
					select.val($(this).attr("value"));
					showDiv_span.text($(this).text());
					popDiv.hide("fast", "linear");
				});
				span_level2.append(a_level2);
				var b_level2 = $('<b>');
				p_level2.append(span_level2);
				p_level2.append(b_level2);
				var div_level2 = $('<div>');
				var children_level2 = [];
				if (children[j].children) {
					children_level2 = children[j].children;
				}
				for (var k = 0; k < children_level2.length; k++) {
					var a_level3 = $('<a>');
					a_level3.attr("value", children_level2[k].id);
					a_level3.text(children_level2[k].text);
					// 添加事件
					a_level3.click(function() {
						select.val($(this).attr("value"));
						showDiv_span.text($(this).text());
						popDiv.hide("fast", "linear");
					});
					div_level2.append(a_level3);
				}
				li.append(p_level2);
				li.append(div_level2);
				// 添加事件
				p_level2.mouseover(function() {
					$(this).closest("table").find("li").each(function(num, item) {
						$(item).removeClass("selected");
					});
					$(this).parent().addClass("selected");
				});
				p_level2.mouseleave(function() {
					$(this).closest("table").find("li").each(function(num, item) {
						$(item).removeClass("selected");
					});
				});
				div_level2.mouseover(function() {

					$(this).parent().addClass("selected");
				});
				div_level2.mouseleave(function() {
					$(this).parent().removeClass("selected");
				});
				ul.append(li);
			}
			td.append(ul);
			tr.append(th);
			tr.append(td);
			table.append(tr);
		}
		popDiv.append(table);
		zj_select_multilevel.append(showDiv);
		zj_select_multilevel.append(popDiv);
		// 添加事件
		zj_select_multilevel.mouseover(function() {
			popDiv.show();
		});
		zj_select_multilevel.mouseleave(function() {
			popDiv.hide("fast", "linear");
		});
		this.replaceWith(zj_select_multilevel);
		zj_select_multilevel.after(select);

	}
})(jQuery);