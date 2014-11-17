Ext.define('manage.controller.Advertisement', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'advertisementGrid',
		selector : 'advertisementgrid'
	}, {
		ref : 'advertisementQueryForm',
		selector : 'advertisementqueryForm'
	}, {
		ref : 'advertisementPanel',
		selector : 'advertisementpanel'
	}, {
		ref : 'advertisementForm',
		selector : 'advertisementform'
	}, {
		ref : 'picUploadForm',
		selector : 'picuploadform'
	} ],
	views : [ 'advertisement.AdvertisementGrid','PicUploadForm','advertisement.AdvertisementQueryForm',
			'advertisement.AdvertisementPanel', 'advertisement.AdvertisementForm' ],
	stores : [ 'advertisement.Advertisement' ],
	models : [ 'advertisement.Advertisement' ],
	openTab : function(app) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var advertisementPanel = tabPanel.child('advertisementpanel');
		if (!advertisementPanel) {
			var advertisementPanel = Ext.widget('advertisementpanel');
			tabPanel.add(advertisementPanel);
			tabPanel.setActiveTab(advertisementPanel);
		} else {
			tabPanel.setActiveTab(advertisementPanel);
		}
	},
	init : function(app) {
		this.control({
			'advertisementgrid button[action=insert]' : {
				click : this.addAdvertisement
			},
			'advertisementgrid button[action=query]' : {
				click : this.queryAdvertisement
			},
			'advertisementgrid button[action=delete]' : {
				click : this.deleteAdvertisement
			},
			'advertisementform button[action=submit]' : {
				click : this.submit
			},
			'advertisementgrid' : {
				itemdblclick : this.editAdvertisement
			},
			'advertisementform button[action=upload]' : {
				click : this.uploadPic
			},
			'picuploadform button[action=submit]' : {
				click : this.upload
			}
		});
	},
	addAdvertisement : function(button) {
		if (!Ext.getCmp('addAdvertisementForm')) {
			Ext.create('Ext.window.Window', {
				title : '添加广告',
				resizable : false,
				id : 'addAdvertisementForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'advertisementform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('addAdvertisementForm').show();
		}
	},
	editAdvertisement : function(grid, record) {
		if (!Ext.getCmp('editAdvertisementForm')) {
			Ext.create('Ext.window.Window', {
				title : '修改广告',
				resizable : false,
				id : 'editAdvertisementForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'advertisementform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('editAdvertisementForm').show();
		}
		var formWin = Ext.getCmp('editAdvertisementForm');
		formWin.down('form').loadRecord(record);
		url = formWin.down('form').getForm().findField('pic').getValue();
		if(url=='')
			url = Ext.BLANK_IMAGE_URL;
		Ext.getCmp('browseImage').getEl().dom.src = url;
	},
	queryAdvertisement : function(button) {
		var grid = this.getAdvertisementGrid();
		var form = grid.up('panel').down('form');
		var params = form.getValues();
		var store = grid.getStore();
		store.on("beforeload",function(){
	        store.proxy.extraParams=params;  
	    });  
		store.loadPage(1);
	},
	deleteAdvertisement : function(button) {
		var grid = this.getAdvertisementGrid();
		var store = grid.getStore();
		var refresh = store.reload;
		var records = grid.getSelectionModel().getSelection();
		if (records.length == 0) {
			Ext.MessageBox.show({
				title : '提示信息',
				msg : '请先选择要删除的广告!',
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
								funcId : '10033'
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
			funcId = '10031';
			successMsg = '添加成功';
			failedMsg = '添加失败';
		} else {
			action = 'update';
			funcId = '10032';
			successMsg = '修改成功';
			failedMsg = '修改失败';
		}
		var win = button.up('window');
		var grid = this.getAdvertisementGrid();
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
	},
	uploadPic : function(button) {
		var form = button.up('form');
		var url = form.getForm().findField('pic').getValue();
		Ext.create('Ext.window.Window', {
			title : '选择图片',
			resizable : true,
			id : 'uploadImg',
			modal : true,
			layout : 'fit',
			items : [ {
				xtype : 'picuploadform'
			} ],
			autoShow : true
		});
		this.getPicUploadForm().getForm().findField('old_file').setValue(
				url);
	},
	upload : function(button) {
		var me = this;
		var form = button.up('form').getForm();
		var win = button.up('window');
		form.submit({
			waitMsg : '正在上传数据,请等待...',
			clientValidation : true,
			url : 'system.do',
			params : {
				action : 'uploadLogo'
			},
			success : function(form, action) {
				top.Ext.Msg.alert('上传成功', action.result.msg == null ? '上传成功'
						: action.result.msg, function() {
					var url = action.result.url;
					var form = me.getAdvertisementForm();
					Ext.getCmp('browseImage').getEl().dom.src = url;
					form.getForm().findField('pic').setValue(url);
					win.close();
				});
			},
			failure : function(form, action) {
				switch (action.failureType) {
				case Ext.form.action.Action.CLIENT_INVALID:
					top.Ext.Msg.alert('上传失败', '所填数据不符合要求，请检查后提交');
					break;
				case Ext.form.action.Action.CONNECT_FAILURE:
					top.Ext.Msg.alert('上传失败', '上传失败，请检查网络');
					break;
				case Ext.form.action.Action.SERVER_INVALID:
					top.Ext.Msg.alert('上传失败',
							action.result.msg == null ? '上传失败'
									: action.result.msg);
				}
			}
		});
	}
});
