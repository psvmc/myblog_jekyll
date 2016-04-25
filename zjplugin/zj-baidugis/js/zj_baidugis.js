var baidugis = baidugis || {};

// 最底图层
baidugis.getRangeArr = function() {
	var areas = [];
	var gc = {};
	gc.name = "管城回族区";
	gc.code = "gc";
	gc.pointArr = [ [ 113.711054, 34.744638 ], [ 113.716228, 34.752468 ], [ 113.710479, 34.753892 ], [ 113.709042, 34.760772 ], [ 113.70588, 34.762433 ], [ 113.695819, 34.760298 ], [ 113.673972, 34.76267 ], [ 113.674259, 34.754841 ], [ 113.670522, 34.750333 ], [ 113.673397, 34.747011 ], [ 113.67081, 34.744163 ], [ 113.677421, 34.726364 ], [ 113.682596, 34.72233 ], [ 113.681733, 34.693367 ], [ 113.678859, 34.684819 ], [ 113.665923, 34.674132 ], [ 113.668223, 34.664157 ],
			[ 113.673684, 34.658456 ], [ 113.670522, 34.649904 ], [ 113.673109, 34.649429 ], [ 113.686907, 34.639451 ], [ 113.692369, 34.642064 ], [ 113.697543, 34.640163 ], [ 113.697256, 34.650617 ], [ 113.704442, 34.657031 ], [ 113.72054, 34.650854 ], [ 113.726289, 34.647528 ], [ 113.732613, 34.630897 ], [ 113.748998, 34.629471 ], [ 113.763946, 34.61949 ], [ 113.771133, 34.627332 ], [ 113.788667, 34.624481 ], [ 113.797291, 34.625906 ], [ 113.797004, 34.64444 ], [ 113.80304, 34.658694 ],
			[ 113.78723, 34.676507 ], [ 113.766821, 34.691705 ], [ 113.746411, 34.705238 ], [ 113.736063, 34.718532 ], [ 113.732613, 34.736807 ], [ 113.732326, 34.743926 ] ];
	gc.strokeStyle = "solid";
	gc.strokeColor = "#ff11ff";
	gc.isViewport = true;
	gc.textPosition = [];
	areas.push(gc);
	return areas;
}
baidugis.getAreasArr = function() {
	var areas = [];

	var sdwh = {};
	sdwh.name = "商都文化特色商业区";
	sdwh.code = "sdwh";
	sdwh.pointArr = [ [ 113.676128, 34.760772 ], [ 113.680583, 34.760298 ], [ 113.685901, 34.759586 ], [ 113.689495, 34.758993 ], [ 113.694525, 34.759111 ], [ 113.699699, 34.759467 ], [ 113.704299, 34.759823 ], [ 113.70588, 34.759823 ], [ 113.707892, 34.757332 ], [ 113.708323, 34.754841 ], [ 113.708754, 34.752705 ], [ 113.711198, 34.750926 ], [ 113.710766, 34.748197 ], [ 113.705592, 34.746299 ], [ 113.698981, 34.74618 ], [ 113.694381, 34.746062 ], [ 113.68777, 34.746418 ],
			[ 113.68317, 34.746892 ], [ 113.677996, 34.747723 ], [ 113.674834, 34.748434 ], [ 113.676272, 34.753654 ], [ 113.676415, 34.756739 ], [ 113.676703, 34.758518 ], [ 113.676128, 34.760772 ] ];
	sdwh.strokeStyle = "dashed";
	sdwh.strokeColor = "#ff11ff";
	sdwh.isViewport = false;
	sdwh.textPosition = [ 113.680871, 34.755671 ];
	areas.push(sdwh);

	var zh = {};
	zh.name = "紫航服务业园区";
	zh.code = "zh";
	zh.pointArr = [ [ 113.677781, 34.74268 ], [ 113.682667, 34.74268 ], [ 113.689854, 34.743155 ], [ 113.696753, 34.742443 ], [ 113.703077, 34.741968 ], [ 113.711988, 34.741968 ], [ 113.720612, 34.741731 ], [ 113.725499, 34.741256 ], [ 113.727798, 34.740782 ], [ 113.729523, 34.74007 ], [ 113.729236, 34.735324 ], [ 113.729236, 34.725593 ], [ 113.730673, 34.721321 ], [ 113.732685, 34.715861 ], [ 113.734985, 34.711351 ], [ 113.732398, 34.709215 ], [ 113.723486, 34.709927 ],
			[ 113.71515, 34.709215 ], [ 113.708539, 34.709689 ], [ 113.686692, 34.710164 ], [ 113.68468, 34.719897 ], [ 113.680943, 34.729153 ], [ 113.676056, 34.737934 ] ];
	zh.strokeStyle = "dashed";
	zh.strokeColor = "#ff11ff";
	zh.isViewport = false;
	zh.textPosition = [ 113.686045, 34.733128 ];
	areas.push(zh);

	var sbl = {};
	sbl.name = "十八里河综合服务区";
	sbl.code = "sbl";
	sbl.pointArr = [ [ 113.688345, 34.705713 ], [ 113.686045, 34.702627 ], [ 113.68432, 34.697641 ], [ 113.682308, 34.686006 ], [ 113.682021, 34.680069 ], [ 113.690069, 34.678169 ], [ 113.70128, 34.678644 ], [ 113.715366, 34.681257 ], [ 113.72054, 34.691705 ], [ 113.718815, 34.702627 ], [ 113.711341, 34.705713 ], [ 113.702718, 34.7069 ], [ 113.694094, 34.707375 ] ];
	sbl.strokeStyle = "dashed";
	sbl.strokeColor = "#ff11ff";
	sbl.isViewport = false;
	sbl.textPosition = [ 113.684608, 34.698709 ];
	areas.push(sbl);

	var jd = {};
	jd.name = "金岱产业集聚区";
	jd.code = "jd";
	jd.pointArr = [ [ 113.72399, 34.702864 ], [ 113.729451, 34.703101 ], [ 113.734913, 34.703814 ], [ 113.74095, 34.703339 ], [ 113.743824, 34.703101 ], [ 113.746986, 34.700727 ], [ 113.751873, 34.697166 ], [ 113.755322, 34.695029 ], [ 113.757622, 34.693367 ], [ 113.756185, 34.691705 ], [ 113.749573, 34.690755 ], [ 113.744974, 34.689568 ], [ 113.735775, 34.68933 ], [ 113.729164, 34.688856 ], [ 113.722552, 34.693842 ], [ 113.722265, 34.701202 ] ];
	jd.strokeStyle = "dashed";
	jd.strokeColor = "#ff11ff";
	jd.isViewport = false;
	jd.textPosition = [ 113.723127, 34.698471 ];
	areas.push(jd);

	var qn = {};
	qn.name = "渠南商业集聚区";
	qn.code = "qn";
	qn.pointArr = [ [ 113.676272, 34.677932 ], [ 113.672535, 34.674607 ], [ 113.672822, 34.669145 ], [ 113.674834, 34.663919 ], [ 113.677134, 34.657981 ], [ 113.675697, 34.653943 ], [ 113.678859, 34.650379 ], [ 113.682308, 34.648004 ], [ 113.686907, 34.64444 ], [ 113.692944, 34.644915 ], [ 113.696106, 34.655843 ], [ 113.700131, 34.665819 ], [ 113.694094, 34.67437 ], [ 113.68777, 34.676745 ], [ 113.682021, 34.677932 ] ];
	qn.strokeStyle = "dashed";
	qn.strokeColor = "#ff11ff";
	qn.isViewport = false;
	qn.textPosition = [ 113.677134, 34.661662 ];
	areas.push(qn);

	var sdxq = {};
	sdxq.name = "商都新区起步区";
	sdxq.code = "sdxq";
	sdxq.pointArr = [ [ 113.709904, 34.673657 ], [ 113.715078, 34.675082 ], [ 113.72284, 34.675557 ], [ 113.728876, 34.675082 ], [ 113.734625, 34.67342 ], [ 113.738075, 34.670807 ], [ 113.742674, 34.66772 ], [ 113.745549, 34.663207 ], [ 113.751298, 34.657743 ], [ 113.753885, 34.652755 ], [ 113.750148, 34.649191 ], [ 113.743537, 34.648716 ], [ 113.73635, 34.649191 ], [ 113.729739, 34.649904 ], [ 113.722552, 34.655843 ], [ 113.716516, 34.662494 ], [ 113.711054, 34.67152 ] ];
	sdxq.strokeStyle = "dashed";
	sdxq.strokeColor = "#ff11ff";
	sdxq.isViewport = false;
	sdxq.textPosition = [ 113.716228, 34.659762 ];
	areas.push(sdxq);

	var sdsm = {};
	sdsm.name = "商都商贸物流园区";
	sdsm.code = "sdsm";
	sdsm.pointArr = [ [ 113.746699, 34.680069 ], [ 113.753598, 34.682682 ], [ 113.760784, 34.684581 ], [ 113.767396, 34.684581 ], [ 113.772857, 34.681969 ], [ 113.777457, 34.678644 ], [ 113.779181, 34.67342 ], [ 113.779181, 34.66867 ], [ 113.77372, 34.668195 ], [ 113.768258, 34.664869 ], [ 113.759634, 34.662494 ], [ 113.752735, 34.666294 ], [ 113.747848, 34.67437 ] ];
	sdsm.strokeStyle = "dashed";
	sdsm.strokeColor = "#ff11ff";
	sdsm.isViewport = false;
	sdsm.textPosition = [ 113.748423, 34.676388 ];
	areas.push(sdsm);

	var ch = {};
	ch.name = "潮湖片区";
	ch.code = "ch";
	ch.pointArr = [ [ 113.78105, 34.667363 ], [ 113.786799, 34.669026 ], [ 113.791686, 34.667126 ], [ 113.79456, 34.66285 ], [ 113.794273, 34.656437 ], [ 113.792261, 34.651211 ], [ 113.791111, 34.645509 ], [ 113.791686, 34.640282 ], [ 113.793123, 34.633392 ], [ 113.789674, 34.629114 ], [ 113.775876, 34.631728 ], [ 113.76294, 34.63553 ], [ 113.76179, 34.648597 ], [ 113.768689, 34.658337 ], [ 113.776738, 34.664276 ] ];
	ch.strokeStyle = "dashed";
	ch.strokeColor = "#ff11ff";
	ch.isViewport = false;
	ch.textPosition = [ 113.764521, 34.648359 ];
	areas.push(ch);
	return areas;
}

baidugis.getCenterArr = function() {
	var centerArr = [ {
		name : "临火车站商业中心",
		code : "hczzx",
		center : [ 113.680871, 34.755671 ],
		radius : 300
	}, {
		name : "商都文化中心",
		code : "sdzx",
		center : [ 113.691938, 34.754603 ],
		radius : 300
	}, {
		name : "未来-郑汴商业中心",
		code : "wlzx",
		center : [ 113.70588, 34.752942 ],
		radius : 300
	}, {
		name : "紫航商业中心",
		code : "zhzx",
		center : [ 113.697112, 34.729687 ],
		radius : 300
	}, {
		name : "航东商业中心",
		code : "hdzx",
		center : [ 113.719822, 34.729568 ],
		radius : 300
	}, {
		name : "十八里河商业中心",
		code : "xblzx",
		center : [ 113.694669, 34.689449 ],
		radius : 300
	}, {
		name : "金岱产业配套服务中心",
		code : "jdzx",
		center : [ 113.734913, 34.693011 ],
		radius : 300
	}, {
		name : "百荣商业中心",
		code : "brzx",
		center : [ 113.673397, 34.673301 ],
		radius : 300
	}, {
		name : "市民文化服务中心",
		code : "smwhzx",
		center : [ 113.724565, 34.666888 ],
		radius : 300
	}, {
		name : "潮湖生态休闲中心",
		code : "chzx",
		center : [ 113.770845, 34.638856 ],
		radius : 300
	} ];
	return centerArr;
}

baidugis.getPointsByArr = function(pointsArr) {
	var points = [];
	for ( var j = 0; j < pointsArr.length; j++) {
		points.push(new BMap.Point(pointsArr[j][0], pointsArr[j][1]));
	}
	return points;
}

// 添加区域
baidugis.addArea = function(map, areas, clickFunc) {

	for ( var i = 0; i < areas.length; i++) {
		var area = areas[i];
		var points = baidugis.getPointsByArr(area.pointArr);
		var ply2 = new BMap.Polygon(points, {
			strokeWeight : 2,
			strokeColor : area.strokeColor
		}); // 建立多边形覆盖物
		ply2.setStrokeStyle(area.strokeStyle);
		ply2.code = area.code;
		ply2.setFillOpacity(0.2);
		ply2.addEventListener("click", function() {
			if (clickFunc) {
				clickFunc(this.code);
			}
		})
		map.addOverlay(ply2); // 添加覆盖物

		var textPosition = area.textPosition;
		if (textPosition && textPosition.length == 2) {
			var label = new BMap.Label(area.name);
			label.setPosition(new BMap.Point(textPosition[0], textPosition[1]));
			label.setStyle({
				fontFamily : "微软雅黑",
				color : "#000",
				fontSize : "14px",
				border : "none",
				background : "none",
				fontWeight : "bold"
			})
			map.addOverlay(label);
		}

		if (area.isViewport) {
			map.setViewport(ply2.getPath(), {
				zoomFactor : 0
			}); // 调整视野
		}
	}
}
// 添加圈
baidugis.addCenter = function(map, centerArr, clickFunc) {
	for ( var i = 0; i < centerArr.length; i++) {
		var center = centerArr[i];
		var point = center.center;
		var radius = center.radius;
		var bcenter = new BMap.Circle(new BMap.Point(point[0], point[1]), radius, {
			strokeWeight : 2,
			strokeColor : "#000",
			strokeStyle : "dashed"
		});
		bcenter.code = center.code;
		bcenter.addEventListener("click", function() {
			if (clickFunc) {
				clickFunc(this.code);
			}
		});
		map.addOverlay(bcenter);

	}
}
baidugis.addMarker = function(map, data, clickFunc, iconUrl) {
	if (data && data.rows) {
		var rows = data.rows;
		for ( var i = 0; i < rows.length; i++) {
			var row = rows[i];
			if (row.lat && row.lng) {
				var initmarker = new BMap.Marker(new BMap.Point(row.lng, row.lat)); // 创建标注
				if (iconUrl) {
					var myIcon = new BMap.Icon(iconUrl, new BMap.Size(24, 24));
					initmarker.setIcon(myIcon);
				}
				initmarker.id = row.id;
				initmarker.addEventListener("click", function() {
					var id = $(this)[0].id;
					if (clickFunc) {
						clickFunc(id);
					}
				});
				map.addOverlay(initmarker);
			}

		}
	}
}

baidugis.showInfo = function(e, pointArr) {
	pointArr.push([ e.point.lng, e.point.lat ]);
	var initmarker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat)); // 创建标注
	map.addOverlay(initmarker);
	console.info(JSON.stringify(pointArr));
}