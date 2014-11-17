Ext.define('manage.controller.Varieties', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'varietiesGrid',
		selector : 'varietiesgrid'
	},
	{
		ref : 'varietiesPanel',
		selector : 'varietiespanel'
	},
	{
		ref : 'varietiesForm',
		selector : 'varietiesform'
	}],
	views : [ 'varieties.VarietiesGrid','varieties.VarietiesPanel','varieties.VarietiesForm'],
	stores : [ 'varieties.Varieties' ],
	models : [ 'varieties.Varieties' ],
	openTab : function(app) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var varietiesPanel = tabPanel.child('varietiespanel');
		if (!varietiesPanel) {
			var varietiesPanel = Ext.widget('varietiespanel');
			tabPanel.add(varietiesPanel);
			tabPanel.setActiveTab(varietiesPanel);
		} else {
			tabPanel.setActiveTab(varietiesPanel);
		}
	},
	init : function(app) {
		this.control({
			'varietiesgrid button[action=addFirstLevel]' : {
				click : this.addFirstLevel
			},
			'varietiesgrid actioncolumn[action=insert]' : {
				click : this.addNextLevel
			},
			'varietiesgrid actioncolumn[action=edit]' : {
				click : this.editVarieties
			},
			'varietiesgrid actioncolumn[action=delete]' : {
				click : this.deleteVarieties
			},
			'varietiesform button[action=submit]' : {
				click : this.submit
			}
		});
	},
	addFirstLevel : function(button){
		if (!Ext.getCmp('addFirstForm')) {
			Ext.create('Ext.window.Window', {
				title : '添加一级分类',
				resizable : false,
				id : 'addFirstForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'varietiesform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('addFirstForm').show();
		}
		var formWin = Ext.getCmp('addFirstForm');
		var pid = 'root';
		formWin.down('form').getForm().findField('node').setValue(pid);
	},
	addNextLevel : function(grid, rowIndex,colIndex, actionItem, event,record, row){
		if(record.data.node != 'root')
			return;
		if (!Ext.getCmp('addNextForm')) {
			Ext.create('Ext.window.Window', {
				title : '添加分类',
				resizable : false,
				id : 'addNextForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'varietiesform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('addNextForm').show();
		}
		var formWin = Ext.getCmp('addNextForm');
		var pid = record.data.id;
		formWin.down('form').getForm().findField('node').setValue(pid);
	},
	editVarieties : function(grid, rowIndex,colIndex, actionItem, event,record, row){
		if (!Ext.getCmp('editVarietiesForm')) {
			Ext.create('Ext.window.Window', {
				title : '修改类别',
				resizable : false,
				id : 'editVarietiesForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'varietiesform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('editVarietiesForm').show();
		}
		var formWin = Ext.getCmp('editVarietiesForm');
		formWin.down('form').loadRecord(record);
	},
	deleteVarieties : function(grid, rowIndex,colIndex, actionItem, event,record, row){
		var varieteisGrid = this.getVarietiesGrid();
		Ext.MessageBox.show({
			title : '提示信息',
			msg : '确定删除吗？',
			icon : Ext.MessageBox.QUESTION,
			buttons : Ext.Msg.YESNO,
			fn : function(btnId, text, opt) {
				if (btnId == "yes") {
					Ext.Msg.wait('处理中，请稍后...', '提示');
					Ext.Ajax.request({
						url : 'system.do', // 请求地址
						params : {
							action : 'delete',
							ids : record.data.id,
							funcId : '10043'
						}, // 请求参数
						method : 'post', // 方法
						callback : function(options, success, response) {
							if (success) {
								Ext.Msg.hide();
								Ext.MessageBox.show({
									title : '提示信息',
									msg : '删除成功!',
									icon : Ext.MessageBox.INFO,
									buttons : Ext.Msg.OK,
									fn : function(){
										var node = varieteisGrid.getStore().getNodeById(record.data.node);
										varieteisGrid.getStore().load({
											node : node
										});
									}
								});
							} else {
								 Ext.Msg.hide();
								Ext.MessageBox.show({
									title : '提示信息',
									msg : '删除失败!',
									icon : Ext.MessageBox.ERROR,
									buttons : Ext.Msg.OK
								});
							}
						}
					});
				}
			}
		});
	},
	submit : function(button) {
		var form = button.up('form').getForm();
		var action;
		var funcId;
		var successMsg;
		var failedMsg;
		if (form.findField('id').getValue() == "") {
			action = 'insert';
			funcId = '10041';
			successMsg = '添加成功';
			failedMsg = '添加失败';
		} else {
			action = 'update';
			funcId = '10042';
			successMsg = '修改成功';
			failedMsg = '修改失败';
		}
		var win = button.up('window');
		var grid = this.getVarietiesGrid();
		var node = form.findField('node').getValue();
		form.submit({
			waitMsg:'正在保存数据,请等待...',
			clientValidation : true,
			url : 'system.do',
			params : {
				action : action,
				funcId : funcId
			},
			success : function(form, action) {
				top.Ext.Msg.alert('操作成功',
						action.result.msg == null ? successMsg
								: action.result.msg,function(){
									win.close();
									var record = grid.getStore().getNodeById(node);
									grid.getStore().load({
										node : record
									});
								});
			},
			failure : function(form, action) {
				switch (action.failureType) {
				case Ext.form.action.Action.CLIENT_INVALID:
					Ext.Msg.alert('操作失败', '所填数据不符合要求，请检查后提交');
					break;
				case Ext.form.action.Action.CONNECT_FAILURE:
					Ext.Msg.alert('操作失败', '提交失败，请检查网络');
					break;
				case Ext.form.action.Action.SERVER_INVALID:
					Ext.Msg.alert('操作失败', action.result.msg == null ? failedMsg
							: action.result.msg);
				}
			}
		});
	}
});
