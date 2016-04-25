/**
 * 三级树状菜单
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
	$.zj_tree = function(options) {
		var settings = {
			"data" : null,
			"url" : null,
			"idField" : "id",
			"textField" : "text",
			"onClick" : null,
			"width" : 200,
			"height" : 555,
			"fit" : false
		}
		settings = $.extend({}, settings, options);
		// 解决IE8下没有indexOf方法
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function(elt) {
				var len = this.length >>> 0;
				var from = Number(arguments[1]) || 0;
				from = (from < 0) ? Math.ceil(from) : Math.floor(from);
				if (from < 0)
					from += len;
				for (; from < len; from++) {
					if (from in this && this[from] === elt)
						return from;
				}
				return -1;
			}
		}
		// 定义常用方法
		var methods = {
			getOptions : function(inputObj) {
				var t = $(inputObj);
				var itemConfig = {};
				var s = $.trim(t.attr("data-options"));
				if (s) {
					var s_pre = s.substring(0, 1);
					var s_suf = s.substring(s.length - 1, 1);
					if (s_pre != "{") {
						s = "{" + s;
					}
					if (s_suf != "}") {
						s = s + "}";
					}
					itemConfig = (new Function("return " + s))();
				}
				if (t.attr("value") && "" != t.attr("value")) {
					itemConfig.value = t.attr("value");
				}
				return itemConfig;
			},
			getTreeData : function(data, opt) {
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
					return data;
				}

			},
			getData : function(opt) {
				if (opt.data) {
					return opt.data;
				} else if (opt.url) {
					var ajaxData = [];
					$.ajax({
						url : opt.url,
						success : function(data) {
							ajaxData = data;
						},
						dataType : "json",
						async : false
					});
					return ajaxData;
				} else {
					return [];
				}
			},
			isContains : function(name, str) {
				var index = name.indexOf(str);
				if (index == -1) {
					return false;
				} else {
					return true;
				}
			},
			scrollEvent : function(dom, callbackFunc) {
				var scrollFunc = function(e) {
					var direct = 0;
					e = e || window.event;

					if (e.wheelDelta) {// IE/Opera/Chrome
						if (e.wheelDelta > 0) {
							direct = -1;
						} else {
							direct = 1;
						}
					} else if (e.detail) {// Firefox
						if (e.detail > 0) {
							direct = 1;
						} else {
							direct = -1;
						}
					}
					if (callbackFunc) {
						callbackFunc(direct);
					}
				}
				/* 注册事件 */
				if (dom.addEventListener) {
					dom.addEventListener('DOMMouseScroll', scrollFunc, false);
				}
				dom.onmousewheel = scrollFunc;// IE/Opera/Chrome
			}
		}
		// 点击事件
		var itemClick = function() {
			var $this = $(this);
			var zjtree = $this.closest(".zj-tree");
			var itemOptions = methods.getOptions(zjtree[0]);
			var itemDataStr = $this.attr("itemData");
			var itemData = JSON.parse(itemDataStr);
			if (itemOptions.onClick) {
				itemOptions.onClick(itemData);
			}
		}
		var zjtree = $(".zj-tree");
		for ( var i = 0; i < zjtree.length; i++) {
			var itemOptions = methods.getOptions(zjtree[i]);
			var data = methods.getData(itemOptions);
			var treeData = methods.getTreeData(data, itemOptions);

			var zj_tree = $('<div style="width: 200px;height:100%" class="zj-tree" />');
			if (itemOptions.width) {
				zj_tree.css("width", itemOptions.width + "px");
			}
			var data_options = $.trim($(zjtree[i]).attr("data-options"));
			zj_tree.attr("data-options", data_options);
			var scroll_up = $('<div style="display: block;" class="menu-scroll scroll-up" />');
			var first_menu = $('<ul class="first-menu" />');
			var scroll_down = $('<div style="display: block;" class="menu-scroll scroll-down" />');
			zj_tree.append(scroll_up);
			zj_tree.append(first_menu);
			zj_tree.append(scroll_down);
			$(zjtree).replaceWith(zj_tree);
			if (itemOptions.fit) {
				var parentHeight = zj_tree.parent().height();
				if (parentHeight >= 100) {
					first_menu.css("height", (parentHeight - 45) + "px");
				} else {
					first_menu.css("height", "455px");
				}
			} else {
				first_menu.css("height", (itemOptions.height - 40) + "px");
			}
			if (itemOptions.fit) {
				$("body").mousemove(function() {
					var parentHeight = zj_tree.parent().height();
					zj_tree.find(".first-menu").css("height", (parentHeight - 45) + "px");
				});
			}
			// 放数据
			if (treeData && treeData.length > 0) {
				for ( var i = 0; i < treeData.length; i++) {
					var first_item = treeData[i];
					var second_items = first_item.children;

					var first_menu_li = $('<li>');
					var first_panel = $('<div class="first-panel first-menu-item" />');
					first_panel.attr("itemData", JSON.stringify(first_item));
					if (itemOptions.onClick) {
						first_panel.click(itemClick);
					}
					var iconfont = $('<i class="iconfont" />');
					if (first_item.iconCls) {
						iconfont.addClass(first_item.iconCls);
					} else {
						iconfont.addClass("zj-icon-lianjie");
					}
					var first_panel_span = $('<span class="first-menu-title" />');
					var second_panel = $('<div class="second-panel" style="display:none" />');
					if (itemOptions.width) {
						second_panel.css("left", itemOptions.width + "px");
					}
					var second_menu = $('<ul class="second-menu clearfix" />');
					first_panel_span.text(first_item["text"]);
					first_panel.append(iconfont);
					first_panel.append(first_panel_span);
					second_panel.append(second_menu);
					first_menu_li.append(first_panel);
					first_menu_li.append(second_panel);
					first_menu.append(first_menu_li);

					if (second_items && second_items.length > 0) {
						for ( var j = 0; j < second_items.length; j++) {
							var second_item = second_items[j];
							var third_items = second_item.children;
							var second_menu_li = $('<li class="expand" />');
							// 二级链接
							var second_menu_item = $('<a class="second-menu-item" href="javascript:;" />');
							second_menu_item.attr("itemData", JSON.stringify(second_item));
							if (itemOptions.onClick) {
								second_menu_item.click(itemClick);
							}
							var third_menu = $('<ul class="third-menu" />');
							second_menu_item.text(second_item["text"]);
							second_menu_li.append(second_menu_item);
							second_menu_li.append(third_menu);
							second_menu.append(second_menu_li);
							if (third_items && third_items.length > 0) {
								for ( var k = 0; k < third_items.length; k++) {
									var third_item = third_items[k];
									var third_menu_li = $('<li>');
									var third_menu_item = $('<a class="third-menu-item" href="javascript:;" />');
									third_menu_item.attr("itemData", JSON.stringify(third_item));
									if (itemOptions.onClick) {
										third_menu_item.click(itemClick);
									}
									third_menu_item.text(third_item["text"]);
									third_menu_li.append(third_menu_item);
									third_menu.append(third_menu_li);
								}
							}
						}
					}
				}
			}
			// 设置效果
			zj_tree.find(".first-menu li").hover(function() {
				$(this).find(".first-panel").addClass("first-menu-item-hover").removeClass("first-menu-item");
				$(this).find(".second-panel").css("display", "block");
			});
			zj_tree.find(".first-menu li").mouseleave(function() {
				$(this).find(".first-panel").removeClass("first-menu-item-hover").addClass("first-menu-item");
				$(this).find(".second-panel").css("display", "none");
			});
			zj_tree.find(".scroll-down").click(function() {
				var menu = $(this).parent().find(".first-menu");
				menu.animate({
					scrollTop : '+=220px'
				}, "slow");
			});

			zj_tree.find(".scroll-up").click(function() {
				var menu = $(this).parent().find(".first-menu");
				menu.animate({
					scrollTop : '-=220px'
				}, "slow");
			});
			methods.scrollEvent(zj_tree.find(".first-menu")[0], function(data) {
				var menu = zj_tree.find(".first-menu");
				if (menu.attr("scrol") == "false") {
				}
				if (data == 1) {
					menu.stop();
					menu.animate({
						scrollTop : '+=150px'
					}, "normal", function() {
					});
				} else {
					menu.stop();
					menu.animate({
						scrollTop : '-=150px'
					}, "normal", function() {
					});
				}
			})

			function randomColor() {
				var colorArray = [ "#99CCFF", "#FFCC00", "#FF9966", "#66CCCC", "#99CCCC", "#CCFF99", "#99CC66", "#FF9900", "#0099CC", "#FF9966" ];
				var tempColor = 0;
				var randomNum = 0;
				$(".first-menu-item .iconfont").each(function(i, item) {
					randomNum = Math.floor(Math.random() * colorArray.length);
					while (tempColor == randomNum) {
						randomNum = Math.round(Math.random() * colorArray.length);
					}
					$(item).css("color", colorArray[randomNum]);
					tempColor = randomNum;
				});
			}
			randomColor();

		}
	};

})(jQuery);