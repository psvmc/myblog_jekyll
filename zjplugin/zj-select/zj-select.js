/**
 * 使用说明： 需要引人 zj-select.css 使用方法一： html： <select name="sex" > <option
 * value="1">man</option> <option value="2">woman</option> </select> js：
 * $('select').select();
 * 
 * 使用方法二：从网络中加载数据 返回的json格式[{'value':'01','text':'男'},{'value':'02','text':'女'}]
 * $('select').select({url:'1.jsp'});
 * 
 */
(function($) {

	$.fn.select = function(options) {
		// 定义常量
		var settings = $.extend({}, options);

		this.each(function() {
			// html template
			var $html = $('<span class="zj-ui-select"><span class="default"><label>▼</label><span></span></span><ul></ul></span>');
			// 将下拉框隐藏，把模版插入其后
			var $this = $(this).hide().after($html);
			// 声明全局变量
			var $list = $html.find('ul'), $default = $html.find('.default'), $span = $default.find('span'), $label = $default.find('label');
			if (settings.data) {
				// 得到已经存在的option个数
				var size = $this.find('option').size();
				$.each(settings.data, function(i, option) {
					// 由于ie6 的bug ，不得不采用原生的方式对DOM进行操作
					$this[0].options[i + size] = new Option(option.text, option.value);
				})
			}
			// 从网络加载数据
			else if (settings.url) {
				$.ajax({
					url : settings.url,
					dataType : 'json',
					async : false,
					success : function(data) {
						// 得到已经存在的option个数
						var size = $this.find('option').size();
						$.each(data, function(i, option) {
							// 由于ie6 的bug ，不得不采用原生的方式对DOM进行操作
							$this[0].options[i + size] = new Option(option.text, option.value);
						});
					}
				});
			}

			// 将option遍历到li中
			$this.find('option').each(function() {
				var $option = $(this);
				$('<li val="' + $option.val() + '">' + $option.text() + '</li>').appendTo($list);

				if ($option.prop('selected') === true) {
					$this.val($option.val());
					$span.text($option.text());

				}
			});
			// 计算下拉框宽度
			if ($span.text() === '') {
				var $li = $list.find('li').first();
				$this.val($li.attr('val'));
				$span.text($li.text());
			}
			$span.width($list.width());
			// click 事件
			$default.width($span.outerWidth() + $label.outerWidth(true)).click(function(event) {
				// 阻止事件冒泡
				event.stopPropagation();
				if (!$list.find('li').size())
					return;
				$list.slideToggle(200);
			});
			$html.width($default.outerWidth());
			$list.width($default.outerWidth());

			$list.find('li').click(function() {
				var $li = $(this);
				$span.text($li.text());
				if ($this.val() != $li.attr('val')) {
					$this.val($li.attr('val')).change();
				}

			}).hover(function() {
				$(this).toggleClass('active');
			});

			$this.change(function() {
				var index = $this[0].selectedIndex, $li = $list.find('li:eq(' + index + ')');
				$span.text($li.text());
			});

			$(document).click(function() {
				$list.slideUp(200);
			});
		});
		return this;
	};
})(jQuery);