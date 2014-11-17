Ext.define('manage.controller.Article', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'articleGrid',
		selector : 'articlegrid'
	}, {
		ref : 'articleQueryForm',
		selector : 'articlequeryForm'
	}, {
		ref : 'articlePanel',
		selector : 'articlepanel'
	}, {
		ref : 'articleForm',
		selector : 'articleform'
	} ],
	views : [ 'article.ArticleGrid', 'article.ArticleQueryForm',
			'article.ArticlePanel', 'article.ArticleForm','ComboBox' ],
	stores : [ 'article.Article' ],
	models : [ 'article.Article' ],
	openTab : function(app) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var articlePanel = tabPanel.child('articlepanel');
		if (!articlePanel) {
			var articlePanel = Ext.widget('articlepanel');
			tabPanel.add(articlePanel);
			tabPanel.setActiveTab(articlePanel);
		} else {
			tabPanel.setActiveTab(articlePanel);
		}
	},
	init : function(app) {
		this.control({
			'articlegrid button[action=insert]' : {
				click : this.addArticle
			},
			'articlegrid button[action=query]' : {
				click : this.queryArticle
			},
			'articlegrid button[action=delete]' : {
				click : this.deleteArticle
			},
			'articleform button[action=submit]' : {
				click : this.submit
			},
			'articlegrid' : {
				itemdblclick : this.editArticle
			}
		});
	},
	addArticle : function(button) {
		if (!Ext.getCmp('addArticleForm')) {
			Ext.create('Ext.window.Window', {
				title : '添加文章',
				resizable : false,
				id : 'addArticleForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'articleform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('addArticleForm').show();
		}
	},
	editArticle : function(grid, record) {
		if (!Ext.getCmp('editArticleForm')) {
			Ext.create('Ext.window.Window', {
				title : '修改文章',
				resizable : false,
				id : 'editArticleForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'articleform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('editArticleForm').show();
		}
		var formWin = Ext.getCmp('editArticleForm');
		formWin.down('form').loadRecord(record);
	},
	queryArticle : function(button) {
		var grid = this.getArticleGrid();
		var form = grid.up('panel').down('form');
		var params = form.getValues();
		var store = grid.getStore();
		store.on("beforeload",function(){
	        store.proxy.extraParams=params;  
	    });  
		store.loadPage(1);
	},
	deleteArticle : function(button) {
		var grid = this.getArticleGrid();
		var store = grid.getStore();
		var refresh = store.reload;
		var records = grid.getSelectionModel().getSelection();
		if (records.length == 0) {
			Ext.MessageBox.show({
				title : '提示信息',
				msg : '请先选择要删除的文章!',
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
								funcId : '10003'
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
			funcId = '10001';
			successMsg = '添加成功';
			failedMsg = '添加失败';
		} else {
			action = 'update';
			funcId = '10002';
			successMsg = '修改成功';
			failedMsg = '修改失败';
		}
		var win = button.up('window');
		var grid = this.getArticleGrid();
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
