/// <reference path="jquery-1.7.2-vsdoc.js" />
var the = {
	beautify_in_progress : false,
	editor : null
// codemirror editor
};

function run_tests() {
	var st = new SanityTest();
	run_beautifier_tests(st);
	JavascriptObfuscator.run_tests(st);
	P_A_C_K_E_R.run_tests(st);
	Urlencoded.run_tests(st);
	MyObfuscate.run_tests(st);
	var results = st.results_raw().replace(/ /g, '&nbsp;').replace(/\r/g, '·')
			.replace(/\n/g, '<br>');
	$('#testresults').html(results).show();
}

function any(a, b) {
	return a || b;
}

function read_settings_from_cookie() {
	$('#tabsize').val(any($.cookies.set('tabsize'), '4'));
	$('#brace-style').val(any($.cookies.set('brace-style'), 'collapse'));
	$('#detect-packers').attr('checked',
			$.cookies.set('detect-packers') !== 'off');
	$('#preserve-newlines').attr('checked',
			$.cookies.set('preserve-newlines') !== 'off');
	$('#keep-array-indentation').attr('checked',
			$.cookies.set('keep-array-indentation') === 'on');
	$('#indent-scripts').val(any($.cookies.set('indent-scripts'), 'normal'));
	$('#space-before-conditional').attr('checked',
			$.cookies.set('space-before-conditional') !== 'off');
	$('#unescape-strings').attr('checked',
			$.cookies.set('unescape-strings') === 'on');
}

function store_settings_to_cookie() {
	var opts = {
		expires : 360
	};
	$.cookies.get('tabsize', $('#tabsize').val(), opts);
	$.cookies.get('brace-style', $('#brace-style').val(), opts);
	$.cookies.get('detect-packers', $('#detect-packers').attr('checked') ? 'on'
			: 'off', opts);
	$.cookies.get('preserve-newlines',
			$('#preserve-newlines').attr('checked') ? 'on' : 'off', opts);
	$.cookies.get('keep-array-indentation', $('#keep-array-indentation').attr(
			'checked') ? 'on' : 'off', opts);
	$.cookies.get('space-before-conditional', $('#space-before-conditional')
			.attr('checked') ? 'on' : 'off', opts);
	$.cookies.get('unescape-strings',
			$('#unescape-strings').attr('checked') ? 'on' : 'off', opts);
	$.cookies.get('indent-scripts', $('#indent-scripts').val(), opts);
}

function unpacker_filter(source) {
	var trailing_comments = '';
	var comment = '';
	var found = false;

	do {
		found = false;
		if (/^\s*\/\*/.test(source)) {
			found = true;
			comment = source.substr(0, source.indexOf('*/') + 2);
			source = source.substr(comment.length).replace(/^\s+/, '');
			trailing_comments += comment + "\n";
		} else if (/^\s*\/\//.test(source)) {
			found = true;
			comment = source.match(/^\s*\/\/.*/)[0];
			source = source.substr(comment.length).replace(/^\s+/, '');
			trailing_comments += comment + "\n";
		}
	} while (found);

	if (P_A_C_K_E_R.detect(source)) {
		// P.A.C.K.E.R unpacking may fail, even though it is detected
		var unpacked = P_A_C_K_E_R.unpack(source);
		if (unpacked != source) {
			source = unpacker_filter(unpacked);
		}
	}
	if (Urlencoded.detect(source)) {
		source = unpacker_filter(Urlencoded.unpack(source))
	}
	if (JavascriptObfuscator.detect(source)) {
		source = unpacker_filter(JavascriptObfuscator.unpack(source))
	}
	if (MyObfuscate.detect(source)) {
		source = unpacker_filter(MyObfuscate.unpack(source))
	}

	return trailing_comments + source;
}

function beautify() {
	if (the.beautify_in_progress)
		return;

	store_settings_to_cookie();

	the.beautify_in_progress = true;

	var source;
	if (the.editor) {
		source = the.editor.getValue();
	} else {
		source = $('#source').val();
	}
	var indent_size = $('#tabsize').val();
	var indent_char = indent_size == 1 ? '\t' : ' ';
	var preserve_newlines = $('#preserve-newlines').attr('checked');
	var keep_array_indentation = $('#keep-array-indentation').attr('checked');
	var indent_scripts = $('#indent-scripts').val();
	var brace_style = $('#brace-style').val();
	var space_before_conditional = $('#space-before-conditional').attr(
			'checked');
	var unescape_strings = $('#unescape-strings').attr('checked');

	var opts = {
		indent_size : indent_size,
		indent_char : indent_char,
		preserve_newlines : preserve_newlines,
		brace_style : brace_style,
		keep_array_indentation : keep_array_indentation,
		space_after_anon_function : true,
		space_before_conditional : space_before_conditional,
		unescape_strings : unescape_strings,
		indent_scripts : indent_scripts
	};

	var output;
	if (looks_like_html(source)) {
		output = style_html(source, opts);
	} else {
		if ($('#detect-packers').attr('checked')) {
			source = unpacker_filter(source);
		}
		output = js_beautify(source, opts);
	}
	if (the.editor) {
		the.editor.setValue(output);
	} else {
		$('#source').val(output);
	}

	the.beautify_in_progress = false;
}

function looks_like_html(source) {
	// <foo> - looks like html
	// <!--\nalert('foo!');\n--> - doesn't look like html

	var trimmed = source.replace(/^[ \t\n\r]+/, '');
	var comment_mark = '<' + '!-' + '-';
	return (trimmed && (trimmed.substring(0, 1) === '<' && trimmed.substring(0,
			4) !== comment_mark));
}

$(function() {

	read_settings_from_cookie();

	var default_text = "/*   美化：格式化代码，使之容易阅读*/	\nif ('this_is'==/an_example/){of_beautifer();}else{var a=b?(c%d):e[f];}";

	if (the.use_codemirror) {
		the.editor = CodeMirror.fromTextArea($('#source').get(0))
		the.editor.setValue(default_text);
		$('.CodeMirror').click(function() {
			if (the.editor.getValue() == default_text) {
				the.editor.setValue('');
			}
		});
	} else {
		$('#source').val(default_text).bind('click focus', function() {
			if ($(this).val() == default_text) {
				$(this).val('');
			}
		}).bind('blur', function() {
			if (!$(this).val()) {
				$(this).val(default_text);
			}
		});
	}

	$(window).bind('keydown', function(e) {
		if (e.ctrlKey && e.keyCode == 13) {
			beautify();
		}
	})

	function copyToClipBoard(s) {
		if (window.clipboardData) {
			window.clipboardData.clearData();
			window.clipboardData.setData("Text", s);
		} else if (navigator.userAgent.indexOf("Opera") != -1) {
			window.location = clipBoardContent;
		} else if (window.netscape) {
			try {
				netscape.security.PrivilegeManager
						.enablePrivilege("UniversalXPConnect");
			} catch (e) {
				alert("您的当前浏览器设置已关闭此功能！请按以下步骤开启此功能！\n新开一个浏览器，在浏览器地址栏输入'about:config'并回车。\n然后找到'signed.applets.codebase_principal_support'项，双击后设置为'true'。\n声明：本功能不会危极您计算机或数据的安全！");
			}
			var clip = Components.classes['@mozilla.org/widget/clipboard;1']
					.createInstance(Components.interfaces.nsIClipboard);
			if (!clip) {
				return;
			}
			var trans = Components.classes['@mozilla.org/widget/transferable;1']
					.createInstance(Components.interfaces.nsITransferable);
			if (!trans) {
				return;
			}
			trans.addDataFlavor('text/unicode');
			var str = new Object();
			var len = new Object();
			var str = Components.classes["@mozilla.org/supports-string;1"]
					.createInstance(Components.interfaces.nsISupportsString);
			var copytext = clipBoardContent;
			str.data = copytext;
			trans.setTransferData("text/unicode", str, copytext.length * 2);
			var clipid = Components.interfaces.nsIClipboard;
			if (!clip) {
				return false;
			}
			clip.setData(trans, null, clipid.kGlobalClipboard);
		}
		alert("已复制！");
		return true;
	}
	function setTxt() {
		var t = $('#source');
		if (window.clipboardData)
			t.val(window.clipboardData.getData("text"));
		else
			alert('浏览器不支持,请使用快捷键Ctrl+V');
	}

	$('#beautify').click(beautify);
	$('#copy').click(function() {
		copyToClipBoard($('#source').val());
	});
	$('#paste').click(function() {
		setTxt();
	});
	$('#clear').click(function() {
		$('#source').val('');
	});
	$('select').change(beautify);
	$('#test').click(run_tests);
	$('#show-option').click(function() {
		if ($(this).attr("checked"))
			$('#options').show();
		else
			$('#options').hide();
	});

});