/* *
 * 全局空间 ZJ
 * */
var ZJ = {};
/* 正则表达式 筛选中文城市名、拼音、首字母 */
ZJ.regEx = /^([\u4E00-\u9FA5\uf900-\ufa2d]+)\|(\w+)\|(\w)\w*$/i;
ZJ.regExChiese = /([\u4E00-\u9FA5\uf900-\ufa2d]+)/;
ZJ.allCity = [];
ZJ.hotCitys = [ '北京|beijing|bj', '上海|shanghai|sh', '重庆|chongqing|cq', '深圳|shenzhen|sz', '广州|guangzhou|gz', '杭州|hangzhou|hz', '南京|nanjing|nj', '苏州|suzhou|sz', '天津|tianjin|tj', '成都|chengdu|cd', '南昌|nanchang|nc', '三亚|sanya|sy', '青岛|qingdao|qd', '厦门|xiamen|xm', '西安|xian|xa', '长沙|changsha|cs', '合肥|hefei|hf', '西藏|xizang|xz', '内蒙古|neimenggu|nmg' ];
ZJ.allCitys = {
	"A" : [ '安庆|anqing|aq', '阿泰勒|ataile|atl', '安康|ankang|ak', '阿克苏|akesu|aks' ],
	"B" : [ '北京|beijing|bj', '包头|baotou|bt', '北海|beihai|bh', '百色|baise|bs', '保山|baoshan|bs' ],
	"C" : [ '成都|chengdu|cd', '长沙|changsha|cs', '重庆|chongqing|cq', '长治|changzhi|cz', '长春|changchun|cc', '常州|changzhou|cz', '昌都|changdu|cd', '朝阳|chaoyang|cy', '常德|changde|cd', '长白山|changbaishan|cbs', '赤峰|chifeng|cf' ],
	"D" : [ '大同|datong|dt', '大连|dalian|dl', '达县|daxian|dx', '东营|dongying|dy', '大庆|daqing|dq', '丹东|dandong|dd', '大理|dali|dl', '敦煌|dunhuang|dh' ],
	"E" : [ '鄂尔多斯|eerduosi|eeds', '恩施|enshi|es' ],
	"F" : [ '福州|fuzhou|fz', '阜阳|fuyang|fy' ],
	"G" : [ '广州|guangzhou|gz', '贵阳|guiyang|gy', '桂林|guilin|gl', '广元|guangyuan|gy', '格尔木|geermu|gem' ],
	"H" : [ '杭州|hangzhou|hz', '合肥|hefei|hf', '呼和浩特|huhehaote|hhht', '哈密|hami|hm', '黑河|heihe|hh', '海拉尔|hailaer|hle', '哈尔滨|haerbin|heb', '海口|haikou|hk', '黄山|huangshan|hs', '邯郸|handan|hd', '汉中|hanzhong|hz', '和田|hetian|ht' ],
	"I" : [],
	"J" : [ '晋江|jinjiang|jj', '锦州|jinzhou|jz', '景德镇|jingdezhen|jdz', '嘉峪关|jiayuguan|jyg', '井冈山|jinggangshan|jgs', '济宁|jining|jn', '九江|jiujiang|jj', '佳木斯|jiamusi|jms', '济南|jinan|jn' ],
	"K" : [ '喀什|kashi|ks', '昆明|kunming|km', '康定|kangding|kd', '克拉玛依|kelamayi|klmy', '库尔勒|kuerle|kel', '库车|kuche|kc' ],
	"L" : [ '兰州|lanzhou|lz', '洛阳|luoyang|ly', '丽江|lijiang|lj', '林芝|linzhi|lz', '柳州|liuzhou|lz', '泸州|luzhou|lz', '连云港|lianyungang|lyg', '黎平|liping|lp', '连成|liancheng|lc', '拉萨|lasa|ls', '临沧|lincang|lc', '临沂|linyi|ly' ],
	"M" : [ '芒市|mangshi|ms', '牡丹江|mudanjiang|mdj', '满洲里|manzhouli|mzl', '绵阳|mianyang|my', '梅县|meixian|mx', '漠河|mohe|mh' ],
	"N" : [ '南昌|nanchang|nc', '南京|nanjing|nj', '内蒙古|neimenggu|nmg', '南充|nanchong|nc', '南宁|nanning|nn', '南阳|nanyang|ny', '南通|nantong|nt', '那拉提|nalati|nlt', '宁波|ningbo|nb' ],
	"O" : [],
	"P" : [ '攀枝花|panzhihua|pzh' ],
	"Q" : [ '青岛|qingdao|qd', '衢州|quzhou|qz', '秦皇岛|qinhuangdao|qhd', '庆阳|qingyang|qy', '齐齐哈尔|qiqihaer|qqhe' ],
	"R" : [],
	"S" : [ '苏州|suzhou|sz', '上海|shanghai|sh', '深圳|shenzhen|sz', '三亚|sanya|sy', '三门峡|sanmenxia|smx', '石家庄|shijiazhuang|sjz', '沈阳|shenyang|sy', '思茅|simao|sm' ],
	"T" : [ '天津|tianjin|tj', '铜仁|tongren|tr', '塔城|tacheng|tc', '腾冲|tengchong|tc', '台州|taizhou|tz', '通辽|tongliao|tl', '太原|taiyuan|ty' ],
	"U" : [],
	"V" : [],
	"W" : [ '威海|weihai|wh', '梧州|wuzhou|wz', '文山|wenshan|ws', '无锡|wuxi|wx', '潍坊|weifang|wf', '武夷山|wuyishan|wys', '乌兰浩特|wulanhaote|wlht', '温州|wenzhou|wz', '乌鲁木齐|wulumuqi|wlmq', '万州|wanzhou|wz', '乌海|wuhai|wh' ],
	"X" : [ '厦门|xiamen|xm', '西藏|xizang|xz', '西安|xian|xa', '兴义|xingyi|xy', '西昌|xichang|xc', '襄樊|xiangfan|xf', '西宁|xining|xn', '锡林浩特|xilinhaote|xlht', '西双版纳|xishuangbanna|xsbn', '徐州|xuzhou|xz' ],
	"Y" : [ '义乌|yiwu|yw', '永州|yongzhou|yz', '榆林|yulin|yl', '延安|yanan|ya', '运城|yuncheng|yc', '烟台|yantai|yt', '银川|yinchuan|yc', '宜昌|yichang|yc', '宜宾|yibin|yb', '盐城|yancheng|yc', '延吉|yanji|yj', '玉树|yushu|ys', '伊宁|yining|yn' ],
	"Z" : [ '珠海|zhuhai|zh', '昭通|zhaotong|zt', '张家界|zhangjiajie|zjj', '舟山|zhoushan|zs', '郑州|zhengzhou|zz', '中卫|zhongwei|zw', '芷江|zhijiang|zj', '湛江|zhanjiang|zj' ]
};
/*******************************************************************************
 * 静态方法集
 * 
 * @name _m
 */
ZJ._m = {
	/* 选择元素 */
	$ : function(arg, context) {
		var tagAll, n, eles = [], i, sub = arg.substring(1);
		context = context || document;
		if (typeof arg == 'string') {
			switch (arg.charAt(0)) {
			case '#':
				return document.getElementById(sub);
				break;
			case '.':
				if (context.getElementsByClassName)
					return context.getElementsByClassName(sub);
				tagAll = ZJ._m.$('*', context);
				n = tagAll.length;
				for (i = 0; i < n; i++) {
					if (tagAll[i].className.indexOf(sub) > -1)
						eles.push(tagAll[i]);
				}
				return eles;
				break;
			default:
				return context.getElementsByTagName(arg);
				break;
			}
		}
	},

	/* 绑定事件 */
	on : function(node, type, handler) {
		node.addEventListener ? node.addEventListener(type, handler, false) : node.attachEvent('on' + type, handler);
	},

	/* 获取事件 */
	getEvent : function(event) {
		return event || window.event;
	},

	/* 获取事件目标 */
	getTarget : function(event) {
		return event.target || event.srcElement;
	},

	/* 获取元素位置 */
	getPos : function(node) {
		var scrollx = document.documentElement.scrollLeft || document.body.scrollLeft, scrollt = document.documentElement.scrollTop || document.body.scrollTop;
		var pos = node.getBoundingClientRect();
		return {
			top : pos.top + scrollt,
			right : pos.right + scrollx,
			bottom : pos.bottom + scrollt,
			left : pos.left + scrollx
		}
	},

	/* 添加样式名 */
	addClass : function(c, node) {
		if (!node)
			return;
		node.className = ZJ._m.hasClass(c, node) ? node.className : node.className + ' ' + c;
	},

	/* 移除样式名 */
	removeClass : function(c, node) {
		var reg = new RegExp("(^|\\s+)" + c + "(\\s+|$)", "g");
		if (!ZJ._m.hasClass(c, node))
			return;
		node.className = reg.test(node.className) ? node.className.replace(reg, '') : node.className;
	},

	/* 是否含有CLASS */
	hasClass : function(c, node) {
		if (!node || !node.className)
			return false;
		return node.className.indexOf(c) > -1;
	},

	/* 阻止冒泡 */
	stopPropagation : function(event) {
		event = event || window.event;
		event.stopPropagation ? event.stopPropagation() : event.cancelBubble = true;
	},
	/* 去除两端空格 */
	trim : function(str) {
		return str.replace(/^\s+|\s+$/g, '');
	}
};
// 入口
(function() {
	var citys = ZJ.allCity, match, letter, regEx = ZJ.regEx, reg2 = /^[a-h]$/i, reg3 = /^[i-p]$/i, reg4 = /^[q-z]$/i;
	if (!ZJ.oCity) {
		ZJ.oCity = {
			hot : {},
			ABCD : {},
			EFGH : {},
			IJKL : {},
			MNOPQ : {},
			RSTUVW : {},
			XYZ : {}
		};

		for (key in ZJ.oCity) {

			if (key == "hot") {
				for (j in ZJ.hotCitys) {
					var city = ZJ.hotCitys[j];
					match = regEx.exec(city);
					if (!ZJ.oCity.hot['hot']) {
						ZJ.oCity.hot['hot'] = [];
					} else {
						ZJ.oCity.hot['hot'].push(match[1]);
					}
				}
			} else {
				for ( var i = 0; i < key.length; i++) {
					var letter = "" + key.charAt(i);
					var itemCitys = ZJ.allCitys[letter];
					for (j in itemCitys) {
						var city = itemCitys[j];
						ZJ.allCity.push(city);
						match = regEx.exec(city);
						if (!ZJ.oCity[key][letter]) {
							ZJ.oCity[key][letter] = [];
							ZJ.oCity[key][letter].push(match[1]);
						} else {
							ZJ.oCity[key][letter].push(match[1]);
						}
					}
				}
			}
		}
	}
})();

/*******************************************************************************
 * 城市控件构造函数
 * 
 * @CitySelector
 */

ZJ.CitySelector = function() {
	this.initialize.apply(this, arguments);
};

ZJ.CitySelector.prototype = {

	constructor : ZJ.CitySelector,

	/* 初始化 */

	initialize : function(options) {
		var input = options.input;
		this.input = ZJ._m.$('#' + input);
		this.inputEvent();
	},
	// 生成html
	createWarp : function() {
		var inputPos = ZJ._m.getPos(this.input);
		var div = this.rootDiv = document.createElement('div');
		var that = this;

		// 设置DIV阻止冒泡
		ZJ._m.on(this.rootDiv, 'click', function(event) {
			ZJ._m.stopPropagation(event);
		});

		// 设置点击文档隐藏弹出的城市选择框
		ZJ._m.on(document, 'click', function(event) {
			event = ZJ._m.getEvent(event);
			var target = ZJ._m.getTarget(event);
			if (target == that.input)
				return false;
			if (that.cityBox)
				ZJ._m.addClass('hide', that.cityBox);
			if (that.ul)
				ZJ._m.addClass('hide', that.ul);
			if (that.myIframe)
				ZJ._m.addClass('hide', that.myIframe);
		});
		div.className = 'citySelector';
		div.style.position = 'absolute';
		div.style.left = inputPos.left + 'px';
		div.style.top = inputPos.bottom + 'px';
		div.style.zIndex = 999999;

		// 判断是否IE6，如果是IE6需要添加iframe才能遮住SELECT框
		var isIe = (document.all) ? true : false;
		var isIE6 = this.isIE6 = isIe && !window.XMLHttpRequest;
		if (isIE6) {
			var myIframe = this.myIframe = document.createElement('iframe');
			myIframe.frameborder = '0';
			myIframe.src = 'about:blank';
			myIframe.style.position = 'absolute';
			myIframe.style.zIndex = '-1';
			this.rootDiv.appendChild(this.myIframe);
		}

		var childdiv = this.cityBox = document.createElement('div');
		childdiv.className = 'cityBox';
		childdiv.id = 'cityBox';
		var _template = [ '<p class="tip">热门城市(支持汉字/拼音)</p>', '<ul>', '<li class="on">热门城市</li>' ];
		for (key in ZJ.oCity) {
			if (key != "hot") {
				_template.push("<li>" + key + "</li>");
			}
		}
		_template.push('</ul>');
		childdiv.innerHTML = _template.join('');
		var hotCity = this.hotCity = document.createElement('div');
		hotCity.className = 'hotCity';
		childdiv.appendChild(hotCity);
		div.appendChild(childdiv);
		this.createHotCity();
	},

	/***************************************************************************
	 * @createHotCity TAB下面DIV：hot,a-h,i-p,q-z 分类HTML生成，DOM操作
	 *                {HOT:{hot:[]},ABCDEFGH:{a:[1,2,3],b:[1,2,3]},IJKLMNOP:{},QRSTUVWXYZ:{}}
	 */

	createHotCity : function() {
		var odiv, odl, odt, odd, odda = [], str, key, ckey, sortKey, regEx = ZJ.regEx, oCity = ZJ.oCity;
		for (key in oCity) {
			odiv = this[key] = document.createElement('div');
			// 先设置全部隐藏hide
			odiv.className = key + ' ' + 'cityTab hide';
			sortKey = [];
			for (ckey in oCity[key]) {
				sortKey.push(ckey);
				// ckey按照ABCDEDG顺序排序
				sortKey.sort();
			}
			for ( var j = 0, k = sortKey.length; j < k; j++) {
				odl = document.createElement('dl');
				odt = document.createElement('dt');
				odd = document.createElement('dd');
				odt.innerHTML = sortKey[j] == 'hot' ? '&nbsp;' : sortKey[j];
				odda = [];
				for ( var i = 0, n = oCity[key][sortKey[j]].length; i < n; i++) {
					str = '<a href="javascript:;">' + oCity[key][sortKey[j]][i] + '</a>';
					odda.push(str);
				}
				odd.innerHTML = odda.join('');
				odl.appendChild(odt);
				odl.appendChild(odd);
				odiv.appendChild(odl);
			}

			// 移除热门城市的隐藏CSS
			ZJ._m.removeClass('hide', this.hot);
			this.hotCity.appendChild(odiv);
		}
		document.body.appendChild(this.rootDiv);
		/* IE6 */
		this.changeIframe();

		this.tabChange();
		this.linkEvent();
	},

	/***************************************************************************
	 * tab按字母顺序切换 @ tabChange
	 */

	tabChange : function() {
		var lis = ZJ._m.$('li', this.cityBox);
		var divs = ZJ._m.$('div', this.hotCity);
		var that = this;
		for ( var i = 0, n = lis.length; i < n; i++) {
			lis[i].index = i;
			lis[i].onclick = function() {
				for ( var j = 0; j < n; j++) {
					ZJ._m.removeClass('on', lis[j]);
					ZJ._m.addClass('hide', divs[j]);
				}
				ZJ._m.addClass('on', this);
				ZJ._m.removeClass('hide', divs[this.index]);
				/* IE6 改变TAB的时候 改变Iframe 大小 */
				that.changeIframe();
			};
		}
	},

	/***************************************************************************
	 * 城市LINK事件
	 * 
	 * @linkEvent
	 */

	linkEvent : function() {
		var links = ZJ._m.$('a', this.hotCity);
		var that = this;
		for ( var i = 0, n = links.length; i < n; i++) {
			links[i].onclick = function() {
				that.input.value = this.innerHTML;
				ZJ._m.addClass('hide', that.cityBox);
				/* 点击城市名的时候隐藏myIframe */
				ZJ._m.addClass('hide', that.myIframe);
			}
		}
	},

	/***************************************************************************
	 * INPUT城市输入框事件
	 * 
	 * @inputEvent
	 */

	inputEvent : function() {
		var that = this;
		ZJ._m.on(this.input, 'click', function(event) {
			event = event || window.event;
			if (!that.cityBox) {
				that.createWarp();
			} else if (!!that.cityBox && ZJ._m.hasClass('hide', that.cityBox)) {
				// slideul 不存在或者 slideul存在但是是隐藏的时候 两者不能共存
				if (!that.ul || (that.ul && ZJ._m.hasClass('hide', that.ul))) {
					ZJ._m.removeClass('hide', that.cityBox);

					/* IE6 移除iframe 的hide 样式 */
					// alert('click');
					ZJ._m.removeClass('hide', that.myIframe);
					that.changeIframe();
				}
			}
		});
		ZJ._m.on(this.input, 'focus', function() {
			that.input.select();
			if (that.input.value == '出发地')
				that.input.value = '';
		});
		ZJ._m.on(this.input, 'blur', function() {
			if (that.input.value == '')
				that.input.value = '';
		});
		ZJ._m.on(this.input, 'keyup', function(event) {
			event = event || window.event;
			var keycode = event.keyCode;
			ZJ._m.addClass('hide', that.cityBox);
			that.createUl();

			/* 移除iframe 的hide 样式 */
			ZJ._m.removeClass('hide', that.myIframe);

			// 下拉菜单显示的时候捕捉按键事件
			if (that.ul && !ZJ._m.hasClass('hide', that.ul) && !that.isEmpty) {
				that.KeyboardEvent(event, keycode);
			}
		});
	},

	/***************************************************************************
	 * 生成下拉选择列表 @ createUl
	 */

	createUl : function() {
		var str;
		var value = ZJ._m.trim(this.input.value);
		// 当value不等于空的时候执行
		if (value !== '') {
			var reg = new RegExp("^" + value + "|\\|" + value, 'gi');
			// 此处需设置中文输入法也可用onpropertychange
			var searchResult = [];
			for ( var i = 0, n = ZJ.allCity.length; i < n; i++) {
				if (reg.test(ZJ.allCity[i])) {
					var match = ZJ.regEx.exec(ZJ.allCity[i]);
					if (searchResult.length !== 0) {
						str = '<li><b class="cityname">' + match[1] + '</b></li>';
					} else {
						str = '<li class="on"><b class="cityname">' + match[1] + '</b></li>';
					}
					searchResult.push(str);
				}
			}
			this.isEmpty = false;
			// 如果搜索数据为空
			if (searchResult.length == 0) {
				this.isEmpty = true;
				str = '<li class="empty">对不起，没有找到数据 "<em>' + value + '</em>"</li>';
				searchResult.push(str);
			}
			// 如果slideul不存在则添加ul
			if (!this.ul) {
				var ul = this.ul = document.createElement('ul');
				ul.className = 'cityslide';
				this.rootDiv && this.rootDiv.appendChild(ul);
				// 记录按键次数，方向键
				this.count = 0;
			} else if (this.ul && ZJ._m.hasClass('hide', this.ul)) {
				this.count = 0;
				ZJ._m.removeClass('hide', this.ul);
			}
			this.ul.innerHTML = searchResult.join('');

			/* IE6 */
			this.changeIframe();

			// 绑定Li事件
			this.liEvent();
		} else {
			ZJ._m.addClass('hide', this.ul);
			ZJ._m.removeClass('hide', this.cityBox);

			ZJ._m.removeClass('hide', this.myIframe);

			this.changeIframe();
		}
	},

	/* IE6的改变遮罩SELECT 的 IFRAME尺寸大小 */
	changeIframe : function() {
		if (!this.isIE6)
			return;
		this.myIframe.style.width = this.rootDiv.offsetWidth + 'px';
		this.myIframe.style.height = this.rootDiv.offsetHeight + 'px';
	},

	/***************************************************************************
	 * 特定键盘事件，上、下、Enter键 @ KeyboardEvent
	 */

	KeyboardEvent : function(event, keycode) {
		var lis = ZJ._m.$('li', this.ul);
		var len = lis.length;
		switch (keycode) {
		case 40: // 向下箭头↓
			this.count++;
			if (this.count > len - 1)
				this.count = 0;
			for ( var i = 0; i < len; i++) {
				ZJ._m.removeClass('on', lis[i]);
			}
			ZJ._m.addClass('on', lis[this.count]);
			break;
		case 38: // 向上箭头↑
			this.count--;
			if (this.count < 0)
				this.count = len - 1;
			for (i = 0; i < len; i++) {
				ZJ._m.removeClass('on', lis[i]);
			}
			ZJ._m.addClass('on', lis[this.count]);
			break;
		case 13: // enter键
			this.input.value = ZJ.regExChiese.exec(lis[this.count].innerHTML)[0];
			ZJ._m.addClass('hide', this.ul);
			ZJ._m.addClass('hide', this.ul);
			/* IE6 */
			ZJ._m.addClass('hide', this.myIframe);
			break;
		default:
			break;
		}
	},

	/***************************************************************************
	 * 下拉列表的li事件 @ liEvent
	 */

	liEvent : function() {
		var that = this;
		var lis = ZJ._m.$('li', this.ul);
		for ( var i = 0, n = lis.length; i < n; i++) {
			ZJ._m.on(lis[i], 'click', function(event) {
				event = ZJ._m.getEvent(event);
				var target = ZJ._m.getTarget(event);
				var liStr = ZJ.regExChiese.exec(target.innerHTML)[0];
				if (liStr.indexOf("对不起") > -1) {
					that.input.value = "";
				} else {
					that.input.value = liStr;
				}
				ZJ._m.addClass('hide', that.ul);
				/* IE6 下拉菜单点击事件 */
				ZJ._m.addClass('hide', that.myIframe);
			});
			ZJ._m.on(lis[i], 'mouseover', function(event) {
				event = ZJ._m.getEvent(event);
				var target = ZJ._m.getTarget(event);
				ZJ._m.addClass('on', target);
			});
			ZJ._m.on(lis[i], 'mouseout', function(event) {
				event = ZJ._m.getEvent(event);
				var target = ZJ._m.getTarget(event);
				ZJ._m.removeClass('on', target);
			})
		}
	}
};
