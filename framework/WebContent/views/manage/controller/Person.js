Ext.define('manage.controller.Person', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'personGrid',
		selector : 'persongrid'
	}, {
		ref : 'personQueryForm',
		selector : 'personqueryForm'
	}, {
		ref : 'personPanel',
		selector : 'personpanel'
	}, {
		ref : 'personForm',
		selector : 'personform'
	} ],
	views : [ 'person.PersonGrid', 'person.PersonQueryForm',
			'person.PersonPanel', 'person.PersonForm' ,'ComboBox'],
	stores : [ 'person.Person' ,'Org','Role'],
	models : [ 'person.Person','ComboBox' ],
	openTab : function(app) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var personPanel = tabPanel.child('personpanel');
		if (!personPanel) {
			var personPanel = Ext.widget('personpanel');
			tabPanel.add(personPanel);
			tabPanel.setActiveTab(personPanel);
		} else {
			tabPanel.setActiveTab(personPanel);
		}
	},
	init : function(app) {
		this.control({
			'persongrid button[action=insert]' : {
				click : this.addPerson
			},
			'persongrid button[action=query]' : {
				click : this.queryPerson
			},
			'persongrid button[action=delete]' : {
				click : this.deletePerson
			},
			'personform button[action=submit]' : {
				click : this.submit
			},
			'personform mycombo[name=S_ID]' : {
				select : this.loadEmployee
			},
			'persongrid' : {
				itemdblclick : this.editPerson
			}
		});
	},
	addPerson : function(button) {
		if (!Ext.getCmp('addPersonForm')) {
			Ext.create('Ext.window.Window', {
				title : '添加人员',
				resizable : false,
				id : 'addPersonForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'personform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('addPersonForm').show();
		}
	},
	loadEmployee : function(combo, records, eOpts) {
		var s_id = combo.getValue();
		var employee = Ext.ComponentQuery.query('personform mycombo[name=E_ID]')[0];
		var store = employee.getStore();
		employee.clearValue();
		store.removeAll();
		store.load({
					params : {
						'EMPLOYEE.S_ID' : s_id
					}
				});
	},
	editPerson : function(grid, record) {
		if (!Ext.getCmp('editPersonForm')) {
			Ext.create('Ext.window.Window', {
				title : '修改人员',
				resizable : false,
				id : 'editPersonForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'personform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('editPersonForm').show();
		}
		var formWin = Ext.getCmp('editPersonForm');
		var s_id = record.data.S_ID;
		var employee = formWin.down('form').form.findField('E_ID');
		var store = employee.getStore();
		store.load({
			params : {
				'EMPLOYEE.S_ID' : s_id
			}
		});
		formWin.down('form').loadRecord(record);
	},
	queryPerson : function(button) {
		var grid = this.getPersonGrid();
		var form = grid.up('panel').down('form');
		var params = form.getValues();
		var store = grid.getStore();
		store.on("beforeload",function(){
	        store.proxy.extraParams=params;  
	    });  
		store.loadPage(1);
	},
	deletePerson : function(button) {
		var grid = this.getPersonGrid();
		var store = grid.getStore();
		var refresh = store.reload;
		var records = grid.getSelectionModel().getSelection();
		if (records.length == 0) {
			Ext.MessageBox.show({
				title : '提示信息',
				msg : '请先选择要删除的人员!',
				icon : Ext.MessageBox.WARNING,
				buttons : Ext.Msg.OK
			});
			return;
		} else {
			var ids = "";
			for ( var i = 0; i < records.length; i++) {
				ids += records[i].get("ID");
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
								funcId : '10023'
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
		if (form.findField('ID').getValue() == "") {
			action = 'insert';
			funcId = '10021';
			successMsg = '添加成功';
			failedMsg = '添加失败';
		} else {
			action = 'update';
			funcId = '10022';
			successMsg = '修改成功';
			failedMsg = '修改失败';
		}
		var win = button.up('window');
		var grid = this.getPersonGrid();
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
