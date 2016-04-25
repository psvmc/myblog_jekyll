var map = null;
var drivingService = null;
var isFirst = 0;
//开始结束图标
var startMarker;
var endMarker;
var mystartPosition = new qq.maps.LatLng(34.8068225119258, 113.693930500652);
var myendPosition;

//跳动动画
var hasInit = false;
var yuanTop = 0;
var newTop = 0;
function jumpTwo() {
	var $iMarker = $("#iMarker");
	if(!hasInit){
		yuanTop = $iMarker.position().top;
		newTop = parseInt(yuanTop) - 15;
		hasInit = true;
	}
	$iMarker.animate({
		top: newTop,
	}, 300, "linear", function() {
		$iMarker.animate({
			top: yuanTop,
		}, 300, "linear", function() {
			$iMarker.animate({
				top: newTop,
			}, 300, "linear", function() {
				$iMarker.animate({
					top: yuanTop,
				}, 300, "linear");
			});
		});
	});
}

//移除腾讯logo
function removeLogo() {
	var logo = $(".csssprite").closest("a").closest("div");
	logo.css("display", "none");
	logo.next("div").css("display", "none");

}

//初始化入口
function init() {
	var center = new qq.maps.LatLng(34.8068225119258, 113.693930500652);
	map = new qq.maps.Map(document.getElementById('container'), {
		center: center,
		zoom: 12,
		mapTypeControl: false
	});
	var controlStyle = "widht:52px;height:52px";
	var centerControl = document.createElement("div");
	centerControl.id = "iMarker"
	centerControl.style.cssText = controlStyle;
	centerControl.innerHTML = "<image src='marker.png' height='100%' width='100%' />";
	centerControl.index = 1; //设置在当前布局中的顺序
	map.controls[qq.maps.ControlPosition.CENTER].push(centerControl);

	//定义定位对象
	var geocoder = new qq.maps.Geocoder({
		complete: function(result) {
			var nearPois = result.detail.nearPois;

			var $dizhiList = $("#dizhiList");
			$dizhiList.html("");


			for (var i = 0; i < nearPois.length; i++) {
				var itemlatLng = nearPois[i].latLng;
				var $li = $("<li />")
				var $divTitle = $("<div />");
				$divTitle.attr("class", "dizhiTitle");
				$divTitle.html(nearPois[i]["name"]);
				var $divDetail = $("<div />");
				$divDetail.attr("class", "dizhiDetail");
				$divDetail.html(nearPois[i]["name"]);

				var $dizhiLeft1 = $("<div />");
				$dizhiLeft1.attr("class", "dizhiLeft");
				$dizhiLeft1.append($divTitle);
				$dizhiLeft1.append($divDetail);

				var $dizhiRight1 = $("<div />");
				$dizhiRight1.attr("class", "dizhiRight");

				$li.append($dizhiLeft1);
				$li.append($dizhiRight1);

				var $itemlat = $("<input type='hidden' class='itemlat' />")
				$itemlat.val(itemlatLng.getLat());

				var $itemlng = $("<input type='hidden' class='itemlng' />")
				$itemlng.val(itemlatLng.getLng());

				$li.append($itemlat);
				$li.append($itemlng);
				$dizhiList.append($li);
			}

			$dizhiList.find("li").click(function() {
				$(this).closest("ul").find(".dizhiRight").each(function(item, obj) {
					$(obj).removeClass("checkedImage");
				});
				$(this).find(".dizhiRight").addClass("checkedImage");
				myendPosition = new qq.maps.LatLng($(this).find(".itemlat").val(), $(this).find(".itemlng").val());
				getResult();
			})

			document.getElementById('end').value = result.detail.address;
		}
	});

	//地图层片加载完成事件
	qq.maps.event.addListener(map, "tilesloaded", function() {
		removeLogo();
		var centerPoint = map.getCenter();
		geocoder.getAddress(centerPoint)
	});

	//地图鼠标移动事件
	qq.maps.event.addListener(map, "mouseover", function() {
		removeLogo();
	});

	//地图点击事件
	qq.maps.event.addListener(map, 'click', function(event) {
		if (endMarker) {
			endMarker.setPosition(event.latLng)
		} else {
			endMarker = new qq.maps.Marker({
				position: event.latLng,
				map: map
			});
		}
		geocoder.getAddress(event.latLng)
	});

	//地图拖动事件
	qq.maps.event.addListener(map, "dragend", function() {
		yuanlaiTop = document.getElementById("iMarker").offsetTop;
		var centerPoint = map.getCenter();

		jumpTwo();
		geocoder.getAddress(centerPoint);
	});

	//自动补全地址
	var ap = new qq.maps.place.Autocomplete(document.getElementById('start'));
	var aq = new qq.maps.place.Autocomplete(document.getElementById('end'));

	//设置路线规划
	drivingService = new qq.maps.DrivingService({
		location: "郑州",
		map: map
	});

}

//获取导航
function getResult() {
	//设置searchRequest
	var jvli = document.getElementById("jvli")
	drivingService.search(mystartPosition, myendPosition);
	//设置回调函数
	drivingService.setComplete(function(result) {
		if (result.type == qq.maps.ServiceResultType.MULTI_DESTINATION) {
			alert("起终点不唯一");
		}
	});
	//获取距离
	drivingService.setComplete(function(result) {
		jvli.innerHTML = result.detail.distance;
	});
}