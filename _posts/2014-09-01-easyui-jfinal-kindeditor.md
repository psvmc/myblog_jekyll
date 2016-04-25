---

layout: post
title: easyui常用组件
description: easyui常用组件
keywords: easyui
category: easyui

---

## 表单

### 日期选择（html初始化）

	<input name="tadminModel.birthday" class="easyui-validatebox Wdate" style="width: 370px;" onclick="WdatePicker({dateFmt:'yyyy-MM-dd',position:{right:0,top:0}})"/>

### 按钮（html初始化）

	<a type="button" href="javascript:;" class="easyui-linkbutton" id="book_publish_edit_picselect">选择</a>

### textarea（html初始化）

	<textarea name="action.content" class="easyui-kindeditor" data-options="cssPath:'${basePath!}ht/lib/kindeditor-4.1.10/plugins/code/prettify.css',
				uploadJson:'${basePath!}kindeditor/upload',fileManagerJson:'${basePath!}kindeditor/manager',allowFileManager : true,
				allowImageUpload : true" style="width: 97%;"></textarea>

### 可加减输入

	<tr>
		<th>资源排序</th>
		<td>
			<input name="tresource.seq" style="width: 370px;" class="easyui-numberspinner" data-options="min:0,max:999,editable:false,required:true,missingMessage:'请选择菜单排序'" value="10" style="width: 155px;" />
		</td>
	</tr>

### 几折

	class="easyui-numberbox" data-options="min:0,precision:1,suffix:'折',required:true"

### 价格

	class="easyui-numberbox" data-options="min:0,precision:2,prefix:'￥',required:true"

### 验证

	<input  class="easyui-validatebox" data-options="required:true" /> 
	<input  class="easyui-validatebox" data-options="required:true,validType:'email'" /> 
	<input  class="easyui-validatebox" data-options="required:true,validType:'number'" /> 

### 提示

	$.messager.show({
		title : '提示',
		msg : r.msg
	});

### 时间

	<tr>
		<th>上架时间</th>
		<td>
			<input name="pbook.shelfTime" class="easyui-datetimebox" style="width: 370px;" data-options="editable:false,required:true" />
		</td>
	</tr>

### 数量

	<tr>
		<th>数量</th>
		<td>
			<input name="pbook.bookNum" class="easyui-numberbox" data-options="min:0,precision:0,required:true" style="width: 370px;" />
		</td>
	</tr>

### combobox

	<tr>
		<th>推荐图书</th>
		<td colspan="3">
			<input id="mingrentuijian_add_goodsId" name="mingrentuijian.goodsId" class="easyui-combobox" data-options="valueField:'id',textField:'text',url:'${basePath!}goods_/combobox',required:true" style="width: 370px;" />
			<span onclick="$('#mingrentuijian_add_goodsId').combobox('clear');" class="icon-block icon-cut"></span>
		</td>
	</tr>

---

	public List<EasyuiCombobox> combobox() {
		List<Record> l = Db.find("select * from dh_book_publish t");
		List<EasyuiCombobox> nl = new ArrayList<EasyuiCombobox>();
		if (l != null && l.size() > 0) {
			for (Record record : l) {
				EasyuiCombobox r = new EasyuiCombobox();
				ZJ_BeanUtils.copyProperties(record.getColumns(), r, true);
				r.setText(record.getStr("name"));
				nl.add(r);
			}
		}
		return nl;
	}


### combotree(单选)

	<input name="xzbModel.pid" id="xzb_edit_pid" value="${xzbModel.pid!}" class="easyui-combotree tableInput" data-options="valueField:'id',textField:'name',parentField:'pid',url:'${basePath!}tree/xzbTree' " style="width: 370px;" />
	<a href="javascript:;" class="easyui-linkbutton" data-options="iconCls:'icon-laji'" onclick="$('#xzb_edit_pid').combotree('clear');"></a>
	
### 图片上传

	<script>
		KindEditor.ready(function(K) {
			if ($('#book_publish_edit_picshow').attr('src') == "") {
				$('#book_publish_edit_picshow').css("display", "none")
			}
			var editor = K.editor({
				cssPath : '${basePath!}ht/lib/kindeditor-4.1.10/plugins/code/prettify.css',
				uploadJson : '${basePath!}kindeditor/upload',
				fileManagerJson : '${basePath!}kindeditor/manager',
				allowFileManager : true,
				allowImageUpload : true
			});
			$('#book_publish_edit_picselect').click(function() {
				editor.loadPlugin('image', function() {
					editor.plugin.imageDialog({
						showRemote : true,
						imageUrl : $('#book_publish_edit_pic').val(),
						clickFn : function(url, title, width, height, border, align) {
							$('#book_publish_edit_pic').val(url);
							$('#book_publish_edit_picshow').attr('src', url);
							editor.hideDialog();
							$('#book_publish_edit_picshow').css("display", "block")
						}
					});
				});
			});
		});
	</script>
---
	<tr>
		<th>logo</th>
		<td>
			<img src="${bookPublish.logoSrc!}" id="book_publish_edit_picshow" width="100px" />
			<input name="bookPublish.logoSrc" id="book_publish_edit_pic" style="display: none" value="${bookPublish.logoSrc!}" />
			<br />
			<a type="button" href="javascript:;" class="easyui-linkbutton" id="book_publish_edit_picselect">选择</a>
		</td>
	</tr>

### 图片上传(封装)

	/**
	 * 图片选择
	 * 
	 * @param K
	 * @param basePath
	 * @param funcId
	 * @param showId
	 * @param valueId
	 */
	eui.imgSelect=function(K,basePath,funcId,showId,valueId){
		if ($('#'+showId).attr('src') == "") {
			$('#'+showId).css("display", "none")
		}
		var editor = K.editor({
			cssPath : basePath+'ht/lib/kindeditor-4.1.10/plugins/code/prettify.css',
			uploadJson : basePath+'kindeditor/upload',
			fileManagerJson : basePath+'kindeditor/manager',
			allowFileManager : true,
			allowImageUpload : true
		});
		if($('#'+valueId).val()){
			var url=$('#'+valueId).val();
			$('#'+valueId).val(url);
			$('#'+showId).attr('src', url);
			$('#'+showId).css("display", "block")
		}
		$('#'+funcId).click(function() {
			editor.loadPlugin('image', function() {
				editor.plugin.imageDialog({
					showRemote : true,
					imageUrl : $('#'+valueId).val(),
					clickFn : function(url, title, width, height, border, align) {
						$('#'+valueId).val(url);
						$('#'+showId).attr('src', url);
						editor.hideDialog();
						$('#'+showId).css("display", "block")
					}
				});
			});
		});
	}

---
	<tr>
		<th>图标</th>
		<td>
			<img id="resource_add_picshow" width="100px" />
			<input name="tresourceModel.icon" id="resource_add_picvalue" style="display: none" />
			<br />
			<a type="button" href="javascript:;" class="easyui-linkbutton" id="resource_add_picfunc">选择</a>
		</td>
	</tr>

---
	<script>
		KindEditor.ready(function(K) {
			eui.imgSelect(K, "${basePath!}", "resource_add_picfunc", "resource_add_picshow", "resource_add_picvalue");
		});
	</script>

## 列表

### treegrid(js初始化)

	<script type="text/javascript">
		$(function() {
			$('#book_type_treegrid').treegrid({
				url : '${basePath!}book_type_/treegrid',
				idField : 'id',
				treeField : 'text',
				parentField : 'pid',
				fit : true,
				fitColumns : true,
				border : false,
				frozenColumns : [ [ {
					title : '编号',
					field : 'id',
					width : 150,
					sortable : true,
					checkbox : true,
					hidden : true
				}, {
					title : '名称',
					field : 'text',
					width : 250,
					sortable : true
				} ] ],
				columns : [ [ {
					field : 'action',
					title : '动作',
					width : 100,
					formatter : function(value, row, index) {
						var str = '<span onclick="book_type_edit_fun(\'{0}\');" class="icon-edit icon-block"></span>&nbsp;<span onclick="book_type_del_fun(\'{1}\');" class="icon-no icon-block"/>';
						return zj.formatString(str, row.id, row.id);
					}
				} ] ],
				toolbar : [ {
					text : '增加',
					iconCls : 'icon-add',
					handler : function() {
						book_type_add_fun();
					}
				}, '-', {
					text : '展开',
					iconCls : 'icon-redo',
					handler : function() {
						var node = $('#book_type_treegrid').treegrid('getSelected');
						if (node) {
							$('#book_type_treegrid').treegrid('expandAll', node.cid);
						} else {
							$('#book_type_treegrid').treegrid('expandAll');
						}
					}
				}, '-', {
					text : '折叠',
					iconCls : 'icon-undo',
					handler : function() {
						var node = $('#book_type_treegrid').treegrid('getSelected');
						if (node) {
							$('#book_type_treegrid').treegrid('collapseAll', node.cid);
						} else {
							$('#book_type_treegrid').treegrid('collapseAll');
						}
					}
				}, '-', {
					text : '刷新',
					iconCls : 'icon-reload',
					handler : function() {
						$('#book_type_treegrid').treegrid('reload');
					}
				} ],
				onContextMenu : function(e, row) {
					e.preventDefault();
					$(this).treegrid('unselectAll');
					$(this).treegrid('select', row.id);
					$('#book_type_menu').menu('show', {
						left : e.pageX,
						top : e.pageY
					});
				}
			});
		});
	
		function book_type_add_fun() {
			$('<div/>').dialog({
				href : '${basePath!}book_type_/add',
				width : 500,
				height : 250,
				modal : true,
				title : '类型添加',
				buttons : [ {
					text : '增加',
					iconCls : 'icon-add',
					handler : function() {
						var d = $(this).closest('.window-body');
						$('#book_type_add_form').form('submit', {
							url : '${basePath!}book_type_/save',
							success : function(result) {
								var r = zj.toJson(result);
								$.messager.show({
									title : '提示',
									msg : r.msg
								});
								if (r.success) {
									d.dialog('destroy');
									$('#book_type_treegrid').treegrid('reload');
								}
							}
						});
					}
				} ],
				onClose : function() {
					$(this).dialog('destroy');
				}
			});
		}
	
		function book_type_edit_fun(id) {
			$('<div/>').dialog({
				href : '${basePath!}book_type_/edit?id=' + id,
				width : 500,
				height : 350,
				modal : true,
				title : '类型编辑',
				buttons : [ {
					text : '编辑',
					iconCls : 'icon-edit',
					handler : function() {
						var d = $(this).closest('.window-body');
						$('#book_type_edit_form').form('submit', {
							url : '${basePath!}book_type_/update',
							success : function(result) {
								var r = zj.toJson(result);
								$.messager.show({
									title : '提示',
									msg : r.msg
								});
								if (r.success) {
									d.dialog('destroy');
									$('#book_type_treegrid').treegrid('reload');
								}
							}
						});
					}
				} ],
				onClose : function() {
					$(this).dialog('destroy');
				}
			});
		}
	
		function book_type_del_fun(id) {
			if (id != undefined) {
				$('#book_type_treegrid').treegrid('select', id);
			}
			var node = $('#book_type_treegrid').treegrid('getSelected');
			$.messager.confirm('询问', '您确定要删除【' + node.text + '】？', function(b) {
				if (b) {
					$.ajax({
						url : '${basePath!}book_type_/delete?ids=' + id,
						data : {
							id : node.id
						},
						dataType : 'json',
						success : function(r) {
							$.messager.show({
								title : '提示',
								msg : r.msg
							});
							if (r.success) {
								$('#book_type_treegrid').treegrid('reload');
							}
						}
					});
				}
	
			});
		}
	</script>
	<table id="book_type_treegrid"></table>
	<div id="book_type_menu" class="easyui-menu" style="width:120px;display: none;">
		<div onclick="book_type_add_fun();" data-options="iconCls:'icon-add'">增加</div>
		<div onclick="book_type_delete_fun();" data-options="iconCls:'icon-remove'">删除</div>
		<div onclick="book_type_edit_fun();" data-options="iconCls:'icon-edit'">编辑</div>
	</div>

### datagrid(js初始化)

	<script type="text/javascript">
		$(function() {
			$('#book_publish_datagrid').datagrid({
				url : '${basePath!}book_publish_/datagrid',
				fit : true,
				fitColumns : true,
				border : false,
				pagination : true,
				idField : 'id',
				pageSize : 50,
				pageList : [ 50, 100 ],
				sortName : 'id',
				sortOrder : 'desc',
				checkOnSelect : true,
				selectOnCheck : true,
				nowrap : false,
				frozenColumns : [ [ {
					title : '编号',
					field : 'id',
					width : 150,
					sortable : true,
					checkbox : true,
					hidden : false
				}, {
					title : '名称',
					field : 'name',
					width : 250,
					sortable : true
				} ] ],
				columns : [ [ {
					field : 'action',
					title : '动作',
					width : 100,
					formatter : function(value, row, index) {
						var str = '<span onclick="book_publish_edit_fun(\'{0}\');" class="icon-edit icon-block"></span>&nbsp;<span onclick="book_publish_del_fun(\'{1}\');" class="icon-no icon-block"/>';
						return zj.formatString(str, row.id, row.id);
					}
				} ] ],
				toolbar : '#book_publish_toolbar'
			});
		});
		//添加
		function book_publish_add_fun() {
			$('#book_publish_datagrid').datagrid('uncheckAll').datagrid('unselectAll').datagrid('clearSelections');
			$('<div/>').dialog({
				href : '${basePath!}book_publish_/add',
				width : 500,
				height : 450,
				modal : true,
				title : '添加图标',
				buttons : [ {
					text : '增加',
					iconCls : 'icon-add',
					handler : function() {
						var d = $(this).closest('.window-body');
						$('#book_publish_add_form').form({
							url : '${basePath!}book_publish_/save',
							success : function(result) {
								var r = zj.toJson(result);
								$.messager.show({
									title : '提示',
									msg : r.msg
								});
								if (r.success) {
									d.dialog('destroy');
									$('#book_publish_datagrid').datagrid('reload');
								}
							}
						});
						$('#book_publish_add_form').submit();
					}
				} ],
				onClose : function() {
					$(this).dialog('destroy');
				}
			});
		}
		//编辑
		function book_publish_edit_fun(id) {
			$('#book_publish_datagrid').datagrid('uncheckAll').datagrid('unselectAll').datagrid('clearSelections');
			$('<div/>').dialog({
				href : '${basePath!}book_publish_/edit?id=' + id,
				width : 500,
				height : 450,
				modal : true,
				title : '编辑出版社',
				buttons : [ {
					text : '编辑',
					iconCls : 'icon-edit',
					handler : function() {
						var d = $(this).closest('.window-body');
						$('#book_publish_edit_form').form('submit', {
							url : '${basePath!}book_publish_/update',
							success : function(result) {
								var r = zj.toJson(result);
								$.messager.show({
									title : '提示',
									msg : r.msg
								});
								if (r.success) {
									d.dialog('destroy');
									$('#book_publish_datagrid').datagrid('reload');
								}
							}
						});
					}
				} ],
				onClose : function() {
					$(this).dialog('destroy');
				}
			});
		}
	
		//删除
		function book_publish_dels_fun() {
			var rows = $('#book_publish_datagrid').datagrid('getChecked');
			var ids = [];
			if (rows.length > 0) {
				for (var i = 0; i < rows.length; i++) {
					ids.push(rows[i].id);
				}
				$.messager.confirm('确认', '您是否要删除当前选中的项目？', function(r) {
					if (r) {
						$.ajax({
							url : '${basePath!}book_publish_/delete',
							data : {
								ids : ids.join(',')
							},
							dataType : 'json',
							success : function(r) {
								$.messager.show({
									title : '提示',
									msg : r.msg
								});
								if (r.success) {
									$('#book_publish_datagrid').datagrid('reload');
									$('#book_publish_datagrid').datagrid('uncheckAll').datagrid('unselectAll').datagrid('clearSelections');
								}
							}
						});
					}
				});
			} else {
				$.messager.show({
					title : '提示',
					msg : '请勾选要删除的记录！'
				});
			}
		}
		function book_publish_del_fun(id) {
			$('#book_publish_datagrid').datagrid('uncheckAll').datagrid('unselectAll').datagrid('clearSelections');
			$('#book_publish_datagrid').datagrid('checkRow', $('#book_publish_datagrid').datagrid('getRowIndex', id));
			book_publish_dels_fun();
		}
	</script>
	<table id="book_publish_datagrid"></table>
	<div id="book_publish_toolbar" style="display: none;">
		<a href="javascript:void(0);" onclick="book_publish_add_fun();" class="easyui-linkbutton" data-options="iconCls:'icon-add',plain:true" style="float: left;">增加</a>
		<div class="datagrid-btn-separator"></div>
		<a href="javascript:void(0);" onclick="book_publish_dels_fun();" class="easyui-linkbutton" data-options="iconCls:'icon-remove',plain:true" style="float: left;">批量删除</a>
		<div class="datagrid-btn-separator"></div>
		<input id="searchbox" class="easyui-searchbox" style="width:150px;" data-options="searcher:function(value,name){$('#book_publish_datagrid').datagrid('load',{name:value});},prompt:'可模糊查询名称'"></input>
		<a href="javascript:void(0);" class="easyui-linkbutton" data-options="iconCls:'icon-cancel',plain:true" onclick="$('#book_publish_datagrid').datagrid('load',{});$('#searchbox').searchbox('setValue','');">清空条件</a>
	</div>


### treegrid(html初始化)

	<table id="resource_treegrid" class="easyui-treegrid" style="width:100%;height:100%"
		data-options="url:'${basePath!}resource/treegrid',
		border:true,
		fit:true,
		fitColumns:true, 
		idField:'id', 
		treeField:'text', 
		parentField:'pid', 
		pagination:false,
		onLoadSuccess:function(row, data) {
			//$('#resource_treegrid').treegrid('collapseAll');
		},
		toolbar:'#resource_toolbar' ">
		<thead>
			<tr>
				<th data-options="field:'ck',checkbox:true" width="80"></th>
				<th data-options="field:'text', title:'资源名称' " width="80"></th>
				<th data-options="field:'url', title:'资源路径' " width="80"></th>
				<th data-options="field:'icon', title:'图片', formatter:formatter " width="80"></th>
				<th data-options="field:'level', title:'层级'" width="80"></th>
				<th data-options="field:'seq', title:'顺序'" width="80"></th>
			</tr>
		</thead>
	</table>

### datagrid(html初始化)

	<table id="action_datagrid" class="easyui-datagrid" style="width:100%;height:100%"
		data-options="url:'${basePath!}action/datagrid',
		border:true,
		fit:true,
		fitColumns:true, 
		idField:'id', 
		pagination:true,
		toolbar:'#action_toolbar' ">
		<thead>
			<tr>
				<th data-options="field:'ck',checkbox:true" width="80"></th>
				<th data-options="field:'name', title:'动作名称' " width="80"></th>
				<th data-options="field:'code', title:'唯一码' " width="80"></th>
				<th data-options="field:'remarks', title:'注释'" width="80"></th>
			</tr>
		</thead>
	</table>


