(function($) {
	$.zj_loading = function(options, newData) {

		// 定义常用方法
		var methods = {
			resize : function() {
				var width = 0;
				var height = 0;
				var left = 0;
				var top = 0;
				width = $(window).width()
				height = $(window).height()
				left = (width - 100) / 2;
				top = (height - 100) / 2;
				var zj_loading_gif = $(".zj-loading-gif");
				if (zj_loading_gif) {
					zj_loading_gif.css("top", top + "px");
					zj_loading_gif.css("left", left + "px");
				}

			},
			show : function(options, newData) {

				if ($("body").find(".zj-loading-mask").length > 0) {
					$(".zj-loading-mask").fadeIn();
				} else {
					var zj_loading_mask = $('<div class="zj-loading-mask" />');
					var zj_loading_gif = $('<div class="zj-loading-gif" />');
					zj_loading_mask.append(zj_loading_gif);
					$("body").append(zj_loading_mask);
					methods.resize();
					$(window).resize(function() {
						methods.resize();
					})

				}

			},
			hidden : function(options, newData) {
				$(".zj-loading-mask").fadeOut();
			}
		}
		if (options && typeof (options) == "string") {
			switch (options) {
			case "show":
				return methods.show(options, newData);
				break;
			case "hidden":
				return methods.hidden(options, newData);
				break;
			default:
				alert("没有该方法");
			}
		}

	};

})(jQuery);