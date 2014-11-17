Ext.define('manage.controller.FAQ', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'faqGrid',
		selector : 'faqgrid'
	}, {
		ref : 'faqPanel',
		selector : 'faqpanel'
	}, {
		ref : 'faqForm',
		selector : 'faqform'
	} ],
	views : [ 'faq.FAQGrid','ComboBox',
			'faq.FAQPanel', 'faq.FAQForm' ],
	stores : [ 'faq.FAQ' ],
	models : [ 'faq.FAQ' ],
	openTab : function(app) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var faqPanel = tabPanel.child('faqpanel');
		if (!faqPanel) {
			var faqPanel = Ext.widget('faqpanel');
			tabPanel.add(faqPanel);
			tabPanel.setActiveTab(faqPanel);
		} else {
			tabPanel.setActiveTab(faqPanel);
		}
	},
	init : function(app) {
		this.control({
			'faqgrid button[action=insert]' : {
				click : this.addFAQ
			},
			'faqgrid button[action=delete]' : {
				click : this.deleteFAQ
			},
			'faqform button[action=submit]' : {
				click : this.submit
			},
			'faqgrid' : {
				itemdblclick : this.editFAQ
			}
		});
	},
	addFAQ : function(button) {
		if (!Ext.getCmp('addFAQForm')) {
			Ext.create('Ext.window.Window', {
				title : '添加FAQ',
				resizable : false,
				id : 'addFAQForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'faqform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('addFAQForm').show();
		}
	},
	editFAQ : function(grid, record) {
		if (!Ext.getCmp('editFAQForm')) {
			Ext.create('Ext.window.Window', {
				title : '修改FAQ',
				resizable : false,
				id : 'editFAQForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'faqform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('editFAQForm').show();
		}
		var formWin = Ext.getCmp('editFAQForm');
		formWin.down('form').loadRecord(record);
	},
	deleteFAQ : function(button) {
		var grid = this.getFAQGrid();
		var store = grid.getStore();
		var refresh = store.reload;
		var records = grid.getSelectionModel().getSelection();
		if (records.length == 0) {
			Ext.MessageBox.show({
				title : '提示信息',
				msg : '请先选择要删除的FAQ!',
				icon : Ext.MessageBox.WARNING,
				buttons : Ext.Msg.OK
			});
			return;
		} else {
			var ids = "";
			for ( var i = 0; i < records.length; i++) {
				ids += records[i].get("id");
				if (i < records.length - 1)
					ids += ',';
			}
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
								ids : ids,
								funcId : '10083'
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
										fn : refresh,
										scope : store 
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
		}
	},
	submit : function(button) {
		var form = button.up('form').getForm();
		var action;
		var funcId;
		var successMsg;
		var failedMsg;
		if (form.findField('id').getValue() == "") {
			action = 'insert';
			funcId = '10081';
			successMsg = '添加成功';
			failedMsg = '添加失败';
		} else {
			action = 'update';
			funcId = '10082';
			successMsg = '修改成功';
			failedMsg = '修改失败';
		}
		var win = button.up('window');
		var grid = this.getFaqGrid();
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
									grid.getStore().reload();
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
