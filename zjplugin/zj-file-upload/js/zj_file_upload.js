/**
 * 上传文件
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
	$.zj_file_upload = function(options) {
		var settings = {
			imageBase : "./images/",
			fileIcon : {
				"avi" : "avi.png",
				"cab" : "cab.png",
				"html" : "dw.png",
				"jpg" : "jpg.png",
				"jpeg" : "jpg.png",
				"mp3" : "mp3.png",
				"mpeg" : "mpeg.png",
				"mpg" : "mpg.png",
				"png" : "png.png",
				"ppt" : "ppt.png",
				"psd" : "ps.png",
				"rar" : "rar.png",
				"tif" : "tif.png",
				"txt" : "txt.png",
				"wav" : "wav.png",
				"wma" : "wma.png",
				"doc" : "word.png",
				"docx" : "word.png",
				"xls" : "xls.png",
				"xlsx" : "xls.png",
				"zip" : "zip.png"
			},
			fileInputName : "file",
			urlInputName : "url",
			// 已上传文件的url
			uploadedUrl : []
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
			getFileExt : function(fileName) {
				var result = fileName.substring(fileName.lastIndexOf('.') + 1);
				if (result) {
					result = result.toLowerCase();
				}
				return result;
			},
			getFileIconUrl : function(imageBase, fileName) {
				var fileIcon = settings.fileIcon;
				var suffix = methods.getFileExt(fileName);
				var icon = fileIcon[suffix] || "other.png";
				var url = imageBase + "fileIcon/" + icon;
				return url;
			},
			isContains : function(fileName, name) {
				var index = fileName.indexOf(name);
				if (index == -1) {
					return false;
				} else {
					return true;
				}
			},
			arrayRemveItem : function(fileName, name) {
				var index = fileName.indexOf(name);
				if (isNaN(index) || index > fileName.length) {
					return false;
				}
				fileName.splice(index, 1);
			},
			getInputFileName : function(filePath) {
				if (filePath) {
					var result = filePath.substring(filePath.lastIndexOf('\\') + 1);
					return result;
				} else {
					return filePath;
				}

			},
			getUrlFileName : function(fileUrl) {
				if (fileUrl) {
					var result = fileUrl.substring(fileUrl.lastIndexOf('/') + 1);
					return result;
				} else {
					return fileUrl;
				}

			},
			getBoswerMsg : function() {
				var Sys = {};
				var ua = navigator.userAgent.toLowerCase();
				var s;
				var scan;
				(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] : (s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] : (s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] : (s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] : (s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;

				// 以下进行测试

				if (Sys.ie) {
					scan = {
						"bowser" : "ie",
						"version" : Sys.ie.substring(0, Sys.ie.indexOf("."))
					};
				}
				if (Sys.firefox) {
					scan = {
						"bowser" : "firefox",
						"version" : Sys.firefox.substring(0, Sys.firefox.indexOf("."))
					};
				}
				if (Sys.chrome) {
					scan = {
						"bowser" : "chrome",
						"version" : Sys.chrome.substring(0, Sys.chrome.indexOf("."))
					};
				}
				if (Sys.opera) {
					scan = {
						"bowser" : "opera",
						"version" : Sys.opera.substring(0, Sys.opera.indexOf("."))
					};
				}
				if (Sys.safari) {
					scan = {
						"bowser" : "safari",
						"version" : Sys.safari.substring(0, Sys.safari.indexOf("."))
					};
				}
				return scan;
			},
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
			}
		}

		// 初始化
		function init(imageBase, uploadedUrl, fileName, table, isdel) {
			var temp = [];
			for ( var i = 0; i < uploadedUrl.length; i++) {
				if (uploadedUrl[i] != "") {
					temp.push(uploadedUrl[i]);
				}
			}
			uploadedUrl = temp;
			for ( var i = 0; i < uploadedUrl.length; i++) {
				fileName.push(methods.getUrlFileName(uploadedUrl[i]));
				addUploaded(imageBase, uploadedUrl[i], table, isdel);
			}
			if (uploadedUrl.length == 0) {
				addNoUrlDiv(table);
			}
		}
		// 已上传的文件显示出来
		function addUploaded(imageBase, fileUrl, table, isdel) {
			var name = methods.getUrlFileName(fileUrl);
			var tr = $("<tr>")
			var td = $("<td>")
			var attach_frame = $("<div class='attach_frame'>");

			var attach_left = $("<div class='attach_left'>");
			var attach_img = $("<div class='attach_img'>");

			var img = $("<img>")
			img.attr("src", methods.getFileIconUrl(imageBase, name));
			attach_img.append(img);

			var attach_text = $("<div class='attach_text'>");
			var a = $("<a  />");
			var boswer = methods.getBoswerMsg();
			if (boswer.bowser == "chrome") {
				a.attr("target", "hiddenUploadIframe");
				a.attr("download", methods.getInputFileName(fileUrl));

			} else {
				a.attr("target", "_blank");
			}
			a.attr("href", fileUrl);
			a.text(name);
			a.css("text-decoration", "none");

			attach_text.append(a);

			var attach_right = $("<div class='attach_right'>");
			var right_img = $("<img>")
			right_img.attr("src", delIconUrl);
			right_img.css("cursor", "pointer");

			right_img.click(delFun);
			if (isdel) {
				attach_right.append(right_img);
			}

			attach_frame.append(attach_left);
			attach_frame.append(attach_img);
			attach_frame.append(attach_text);
			attach_frame.append(attach_right);

			var urlInput = $("<input type='hidden' />");
			urlInput.attr("name", urlInputName);
			urlInput.val(fileUrl);

			td.append(attach_frame);
			td.append(urlInput);

			tr.append(td);

			table.append(tr);
		}

		// 删除按钮对应的方法
		var delFun = function() {
			var itemOptions = getHiddenValue($(this));
			var name = $(this).closest(".attach_frame").find(".attach_text").text();
			var fileName = itemOptions.fileName;
			methods.arrayRemveItem(fileName, name);
			setHiddenValue($(this), itemOptions);
			var tr = $(this).closest("tr");
			var table = $(this).closest("table");
			tr.remove();
			var length = table.find("tr").length;
			if (length == 0) {
				addNoUrlDiv(table);
			}

		}
		// 设置隐藏域的值
		function setHiddenValue($obj, value) {
			var hiddenInput = $obj.closest(".zj-upload-div").find(".zj-upload-hidden");
			hiddenInput.val(JSON.stringify(value));
		}
		// 获取隐藏域的值
		function getHiddenValue($obj) {
			var hiddenInput = $obj.closest(".zj-upload-div").find(".zj-upload-hidden");
			var itemOptionsStr = hiddenInput.val();
			return JSON.parse(itemOptionsStr);
		}
		// 添加无附件的div
		function addNoUrlDiv(table) {
			var noUrldiv = $("<div>");
			noUrldiv.html("<span>暂无附件</span>");
			var tr = $("<tr>");
			tr.addClass("zj-upload-nourl");
			var td = $("<td>");
			tr.append(td);
			td.append(noUrldiv);
			table.append(tr);
		}
		// button事件
		var fileChangeFun = function() {
			var $this = $(this);
			var hiddenInput = $this.closest(".zj-upload-div").find(".zj-upload-hidden");
			var itemOptionsStr = hiddenInput.val();
			var itemOptions = JSON.parse(itemOptionsStr);
			var fileName = itemOptions.fileName;
			var fileInputName = itemOptions.fileInputName;
			var name = $this.val();
			// 获取选择文件的名称
			name = methods.getInputFileName(name);
			if (name == "") {

			} else if (methods.isContains(fileName, name)) {
				alert("文件已选择");
			} else {
				fileName.push(name);
				var tr = $("<tr>")
				var td = $("<td>")
				var attach_frame = $("<div class='attach_frame'>");

				var attach_left = $("<div class='attach_left'>");
				var attach_img = $("<div class='attach_img'>");

				var img = $("<img>")
				img.attr("src", methods.getFileIconUrl(imageBase, name));
				attach_img.append(img);

				var attach_text = $("<div class='attach_text'>");
				var span = $("<span>");
				span.html(name);
				attach_text.append(span);

				var attach_right = $("<div class='attach_right'>");
				var right_img = $("<img>")
				right_img.attr("src", delIconUrl);
				right_img.css("cursor", "pointer");
				right_img.click(delFun);
				attach_right.append(right_img);
				attach_frame.append(attach_left);
				attach_frame.append(attach_img);
				attach_frame.append(attach_text);
				attach_frame.append(attach_right);

				var fileInput = $this;
				fileInput.unbind("change");

				fileInput.attr("name", fileInputName);
				fileInput.css("display", "none");

				var newFileInput = $("<input type='file' />");
				hiddenInput.val(JSON.stringify(itemOptions));
				newFileInput.change(fileChangeFun);
				$this.parent().append(newFileInput);
				var table = $this.parent().prev().find("table");
				td.append(attach_frame);
				td.append(fileInput);

				tr.append(td);

				table.append(tr);
				table.find(".zj-upload-nourl").remove();
			}
		};
		// 添加隐藏域并赋值
		function addHiddenInput(uploadDiv, itemOptions) {
			var input = $("<input type='hidden' />");
			input.addClass("zj-upload-hidden");
			input.val(JSON.stringify(itemOptions));
			uploadDiv.append(input);
		}

		// 代码的入口
		// 可编辑初始化
		var zjupload = $(".zj-fileupload");
		for ( var i = 0; i < zjupload.length; i++) {
			var itemOptions = methods.getOptions(zjupload[i]);
			itemOptions = $.extend({}, settings, itemOptions);
			var imageBase = itemOptions.imageBase;
			var delIconUrl = imageBase + "delpng.png";

			var zjuploadItem = $(zjupload[i]);
			var fileInputName = itemOptions.fileInputName;
			var urlInputName = itemOptions.urlInputName;
			// 已上传的url数组
			var uploadedUrl = [];
			if (itemOptions.value) {
				uploadedUrl = itemOptions.value.split(",");
			}
			var fileName = [];
			itemOptions.fileName = fileName;
			var target = $("<div>");
			target.addClass("zj-upload-target-div");
			var actionDiv = $("<div style='margin-top: 10px;'>");
			actionDiv.addClass("zj-upload-action-div");
			var fileButton = $('<input type="file"/>');
			actionDiv.append(fileButton);
			var table = $("<table border='0' cellspacing='0' cellpadding='0'>");
			var iframe = $("<iframe name='hiddenUploadIframe'>");
			iframe.css("display", "none");
			target.append(table);
			target.append(iframe);
			init(imageBase, uploadedUrl, fileName, table, true);
			fileButton.unbind("change");

			fileButton.change(fileChangeFun);
			var uploadDiv = $("<div />");
			addHiddenInput(uploadDiv, itemOptions);
			uploadDiv.addClass("zj-upload-div");
			uploadDiv.append(target);
			uploadDiv.append(actionDiv);
			zjuploadItem.replaceWith(uploadDiv);
		}
		// 只做显示的初始化
		var zjuploadshow = $(".zj-fileupload-show");
		for ( var i = 0; i < zjuploadshow.length; i++) {
			var fileName = [];
			var itemOptions = methods.getOptions(zjuploadshow[i]);
			itemOptions = $.extend({}, settings, itemOptions);
			itemOptions.fileName = [];
			var imageBase = itemOptions.imageBase;
			var delIconUrl = imageBase + "delpng.png";
			var zjuploadshowItem = $(zjuploadshow[i]);
			var uploadedUrl = [];
			if (itemOptions.value) {
				uploadedUrl = itemOptions.value.split(",");
			}
			var table = $("<table border='0' cellspacing='0' cellpadding='0'>");
			var iframe = $("<iframe name='hiddenUploadIframe'>");
			iframe.css("display", "none");
			var target = $("<div />");
			target.append(table);
			target.append(iframe);
			init(imageBase, uploadedUrl, fileName, table, false);

			var uploadDiv = $("<div />");
			addHiddenInput(uploadDiv, itemOptions);
			uploadDiv.addClass("zj-upload-div");
			uploadDiv.append(target);
			zjuploadshowItem.replaceWith(uploadDiv);
		}
	};

})(jQuery);