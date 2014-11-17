Ext.define('manage.controller.FAQ_Topic', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'faq_topicGrid',
		selector : 'faq_topicgrid'
	}, {
		ref : 'faq_topicPanel',
		selector : 'faq_topicpanel'
	}, {
		ref : 'faq_topicForm',
		selector : 'faq_topicform'
	} ],
	views : [ 'faq.FAQ_TopicGrid',
			'faq.FAQ_TopicPanel', 'faq.FAQ_TopicForm' ],
	stores : [ 'faq.FAQ_Topic' ],
	models : [ 'faq.FAQ_Topic' ],
	openTab : function(app) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var faq_topicPanel = tabPanel.child('faq_topicpanel');
		if (!faq_topicPanel) {
			var faq_topicPanel = Ext.widget('faq_topicpanel');
			tabPanel.add(faq_topicPanel);
			tabPanel.setActiveTab(faq_topicPanel);
		} else {
			tabPanel.setActiveTab(faq_topicPanel);
		}
	},
	init : function(app) {
		this.control({
			'faq_topicgrid button[action=insert]' : {
				click : this.addFAQ_Topic
			},
			'faq_topicgrid button[action=delete]' : {
				click : this.deleteFAQ_Topic
			},
			'faq_topicform button[action=submit]' : {
				click : this.submit
			},
			'faq_topicgrid' : {
				itemdblclick : this.editFAQ_Topic
			}
		});
	},
	addFAQ_Topic : function(button) {
		if (!Ext.getCmp('addFAQ_TopicForm')) {
			Ext.create('Ext.window.Window', {
				title : '添加FAQ分类',
				resizable : false,
				id : 'addFAQ_TopicForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'faq_topicform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('addFAQ_TopicForm').show();
		}
	},
	editFAQ_Topic : function(grid, record) {
		if (!Ext.getCmp('editFAQ_TopicForm')) {
			Ext.create('Ext.window.Window', {
				title : '修改FAQ分类',
				resizable : false,
				id : 'editFAQ_TopicForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'faq_topicform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('editFAQ_TopicForm').show();
		}
		var formWin = Ext.getCmp('editFAQ_TopicForm');
		formWin.down('form').loadRecord(record);
	},
	deleteFAQ_Topic : function(button) {
		var grid = this.getFAQ_TopicGrid();
		var store = grid.getStore();
		var refresh = store.reload;
		var records = grid.getSelectionModel().getSelection();
		if (records.length == 0) {
			Ext.MessageBox.show({
				title : '提示信息',
				msg : '请先选择要删除的FAQ分类!',
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
								funcId : '10073'
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
			funcId = '10071';
			successMsg = '添加成功';
			failedMsg = '添加失败';
		} else {
			action = 'update';
			funcId = '10072';
			successMsg = '修改成功';
			failedMsg = '修改失败';
		}
		var win = button.up('window');
		var grid = this.getFaq_topicGrid();
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
