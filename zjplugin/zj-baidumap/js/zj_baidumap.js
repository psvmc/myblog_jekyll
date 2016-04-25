(function($) {
	$.fn.zjbaidumap = function(options) {
		var settings = {
			mapId : "",
			initlng : "",
			initlat : "",
			width : "100px",
			height : "200px",
			lngId : "",
			latId : "",
			addressId : ""
		}
		settings = $.extend({}, settings, options);
		// 定义常量
		var methods = {

		}
		this.each(function(index, item) {
			var $this = $(item);
			var mapId = settings.mapId;
			var initlng = settings.initlng;
			var initlat = settings.initlat;
			var width = settings.width;
			var height = settings.height;
			var lngId = settings.lngId;
			var latId = settings.latId;
			var addressId = settings.addressId;
			// 百度地图API功能
			$("#" + mapId).css("width", width).css("height", height);
			var map = new BMap.Map(mapId);
			if (initlng && initlat) {
				var initpoint = new BMap.Point(initlng, initlat);
				map.centerAndZoom(initpoint, 12);
				map.clearOverlays();
				var initmarker = new BMap.Marker(initpoint); // 创建标注
				map.addOverlay(initmarker);
			} else {
				var initpoint = new BMap.Point(113.665102, 34.751616);
				map.centerAndZoom(initpoint, 12);
			}

			function showInfo(e) {
				// 将标注添加到地图中
				map.clearOverlays();
				var marker1 = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
				map.addOverlay(marker1);
				// 创建信息窗口
				var infoWindow1 = new BMap.InfoWindow("普通标注");
				marker1.addEventListener("click", function() {
					this.openInfoWindow(infoWindow1);
				});

				var geoc = new BMap.Geocoder();
				var pt = new BMap.Point(e.point.lng, e.point.lat);
				geoc.getLocation(pt, function(rs) {
					var addComp = rs.addressComponents;
					var addressStr = addComp.province + " " + addComp.city + " " + addComp.district + " " + addComp.street + " " + addComp.streetNumber;
					$("#" + lngId).val(e.point.lng);
					$("#" + latId).val(e.point.lat);
					$("#" + addressId).val(addressStr);
				});

			}
			map.addEventListener("click", showInfo);
			map.enableScrollWheelZoom();
		});
	};
})(jQuery);