/*!
 * zj_image_upload
 * 用于上传单个文件，上传成功后,返回文件路径。
 * 本插件依赖jQuery，jquery.form 请在使用时引入依赖的文件
 *
 */

(function($) {
	$.extend($.fn, {
		zj_image_upload : function(settings) {
			// 配置
			var options = $.extend({
				targetSelector : "", // 图片选择器
				button : "", // 按钮
				uploadUrl : "response/result.json", // 上传URL地址
				nopicUrl : "images/nopic.jpg",
				loadingImgUrl : "images/loading.gif",
				fileType : "gif|jpg|jpeg|png|bmp", // 允许的文件格式
				width : "", // 图片显示的宽度
				height : 100, // 图片显示的高度
				uploadData : {}, // 上传时需要附加的参数
				beforeSubmitFn : "beforeUpload", // 上传前执行的方法 原型
													// beforeSubmit(arr,
													// $form,options);
				successFn : "successFn", // 上传成功后执行的方法uploadSuccess(response,statusText,
											// xhr, $this)
				errorFn : "errorFn" // 上传失败后执行的方法
			}, settings);

			// 上传准备函数
			var methods = {
				json2str : function(O) {
					var S = [];
					var J = "";
					if (Object.prototype.toString.apply(O) === '[object Array]') {
						for ( var i = 0; i < O.length; i++)
							S.push(methods.json2str(O[i]));
						J = '[' + S.join(',') + ']';
					} else if (Object.prototype.toString.apply(O) === '[object Date]') {
						J = "new Date(" + O.getTime() + ")";
					} else if (Object.prototype.toString.apply(O) === '[object RegExp]' || Object.prototype.toString.apply(O) === '[object Function]') {
						J = O.toString();
					} else if (Object.prototype.toString.apply(O) === '[object Object]') {
						for ( var i in O) {
							O[i] = typeof (O[i]) == 'string' ? '"' + O[i] + '"' : (typeof (O[i]) === 'object' ? methods.json2str(O[i]) : O[i]);
							S.push(i + ':' + O[i]);
						}
						J = '{' + S.join(',') + '}';
					}
					return J;
				},
				toJson : function(result) {
					if (typeof result == "string") {
						return eval("(" + result + ")");
					} else {
						return result;
					}
				},
				// 验证文件格式
				checkFile : function(filename) {
					var pos = filename.lastIndexOf(".");
					var str = filename.substring(pos, filename.length);
					var str1 = str.toLowerCase();
					if (typeof options.fileType !== 'string') {
						options.fileType = "gif|jpg|jpeg|png|bmp";
					}
					var re = new RegExp("\.(" + options.fileType + ")$");
					return re.test(str1);
				},
				// 创建表单
				createForm : function() {
					var form = document.createElement("form");
					form.action = options.uploadUrl;
					form.method = "post";
					form.enctype = "multipart/form-data";
					form.style.display = "none";
					// 将表单加当document上，
					document.body.appendChild(form); // 创建表单后一定要加上这句否则得到的form不能上传。document后要加上body,否则火狐下不行。
					return $(form);
				},
				onload : function($targetInput, $this) {
					if ($targetInput.val() != "") {
						$this.attr("src", $targetInput.val());
					} else {
						$this.attr("src", options.nopicUrl);
					}
				}
			};
			// 上传主函数
			this.each(function(index) {
				var $targetInput = $(options.targetSelector);

				var $this = $(this);

				// 初始化图片
				methods.onload($targetInput, $this);
				var id = "zj_image_upload_input_" + index;
				var formid = "zj_image_upload_form_" + index;
				var $fileInput = $("<input>");
				$this.css("float", "left")
				$fileInput.attr("id", id);
				$fileInput.attr("name", "file");
				$fileInput.attr("type", "file");
				var imageWidth = $this.css("width");
				var imageHeight = $this.css("height");
				if (imageWidth == "0px" && imageHeight == "0px") {
					imageWidth = "100px";
					imageHeight = "100px";
				} else if (imageWidth == "0px" && imageHeight != "0px") {
					imageWidth = imageHeight;
				} else if (imageWidth != "0px" && imageHeight == "0px") {
					imageHeight = imageWidth;
				}
				$fileInput.css("position", "relative").css("top", "0px").css("left", "-" + imageWidth).css("width", imageWidth).css("height", imageHeight);
				$fileInput.css("float", "left");
				$fileInput.css("cursor", "pointer");
				$fileInput.css("opacity", "0");
				$this.after($fileInput);
				var $br = $("<br />");
				$br.css("clear", "both");
				$fileInput.after($br);
				var $form = methods.createForm();
				$form.attr("id", formid);

				$fileInput.bind("change", function() {
					if ($fileInput.val() === "") {
						return false;
					}
					// 验证图片
					if (!methods.checkFile($fileInput.val())) {
						alert("文件格式不正确，只能上传格式为：" + options.fileType + "的文件。");
						return false;
					}
					if (options.loadingImgUrl) {
						$this.after("<div name='" + formid + "'><img style='height:16px;width:16px;' src=\"" + options.loadingImgUrl + "\" />正在上传...</div>");
					} else {
						$this.after("<div name='" + formid + "'>正在上传...</div>");
					}

					// 构建ajaxSubmit参数
					var data = {};
					data.url = options.uploadUrl;
					data.data = options.uploadData;
					data.type = "POST";
					data.dataType = "JSON";
					// 上传前
					data.beforeSubmit = function(arr, $form, options) {
						var beforeSubmitFn;
						try {
							beforeSubmitFn = eval(options.beforeSubmitFn)
						} catch (err) {
							alert(err);
						}
						if (beforeSubmitFn) {
							var $result = beforeSubmitFn(arr, $form, options);
							if (typeof ($result) == "boolean") {
								return $result;
							}
						}
					};
					// 上传失败
					data.error = function(response, statusText, xhr, $form) {
						var errorFn;
						try {
							errorFn = eval(options.errorFn);
						} catch (err) {
							alert(err);
						}
						if (errorFn) {
							errorFn(response.responseText, statusText, xhr, $this);
						}
						$("div[name=" + $form.attr("id") + "]").remove();

					};
					// 上传成功
					data.success = function(response, statusText, xhr, $form) {
						response = methods.toJson(response);
						if (response.error == 0) {
							$this.attr("src", response.url);
							$(options.targetSelector).val(response.url);
							var successFn;
							try {
								successFn = eval(options.successFn);
							} catch (err) {
								alert(err);
							}
							if (successFn) {
								$.ajaxSetup({
									cache : false
								});// 这个不能少，否则ie下会提示下载
								successFn(response, statusText, xhr, $this);
							}
							$this.after($fileInput);
							$("div[name=" + $form.attr("id") + "]").remove();
						} else {
							alert(response.msg);
						}

					};
					try {
						// 把上传控件附加到表单
						$form.append($fileInput);
						// 开始ajax提交表单
						$form.ajaxSubmit(data);

					} catch (e) {
						alert(e.message);
					}
				});

			});
		}
	});
})(jQuery)
