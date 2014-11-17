Ext.define('manage.controller.Order', {
	extend : 'Ext.app.Controller',
	refs : [ {
		ref : 'orderFormGrid',
		selector : 'orderformgrid'
	}, {
		ref : 'orgderFormQueryForm',
		selector : 'orgderformqueryform'
	}, {
		ref : 'orderFormPanel',
		selector : 'orderformpanel'
	}],
	views : [ 'order.OrderFormGrid', 'order.OrderFormQueryForm','order.OrderDetailGrid',
			'order.OrderFormPanel', 'order.OrderDetailForm','order.CancelOrderForm', 'order.SendOrderForm', 'ComboBox'],
	stores : [ 'order.OrderForm', 'order.OrderDetail' ],
	models : [ 'order.OrderForm', 'order.OrderDetail' ],
	openTab : function(app) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var orderformPanel = tabPanel.child('orderformpanel');
		if (!orderformPanel) {
			orderformPanel = Ext.widget('orderformpanel');
			tabPanel.add(orderformPanel);
			tabPanel.setActiveTab(orderformPanel);
		} else {
			tabPanel.setActiveTab(orderformPanel);
		}
	},
	init : function(app) {
		this.control({
			'orderformgrid button[action=query]' : {
				click : this.queryOrg
			},
			'orderformgrid' : {
				itemdblclick : this.orderFormDetail
			},
			'orderdetailform button[action=submit]' : {
				click : this.submit
			},
			'orderformgrid actioncolumn' : {
				confirm : this.confirmOpe,
				send : this.confirmOpe,
				finish : this.confirmOpe,
				cancel : this.confirmOpe
			},
			'sendorderform button[action=submit]' : {
				click : this.sendOrder
			},
			'cancelorderform button[action=submit]' : {
				click : this.cancelOrder
			}
			
		});
	},
	queryOrg : function(button) {
		var grid = this.getOrderFormGrid();
		var form = grid.up('panel').down('form');
		var params = form.getValues();
		var store = grid.getStore();
		store.on("beforeload",function(){
	        store.proxy.extraParams=params;  
	    });  
		store.loadPage(1);
	},
	confirmOpe : function(grid,record,action,msg){
		var me = this;
		Ext.Msg.confirm('操作确认',msg,function(btnId, text, opt){
			if (btnId == "yes") {
				if(action=='confirmOrder')
					me.updateStatus(grid,record,action);
				else if(action=='sendOrder')
					me.sendOrderForm(grid,record,action);
				else if(action=='finishOrder')
					me.updateStatus(grid,record,action);
				else if(action=='cancelOrder') {
					me.cancelOrderForm(grid,record,action);
				}
			}
		});
	},
	orderFormDetail : function(grid, record) {
		if (!Ext.getCmp('orderFormDetail')) {
			Ext.create('Ext.window.Window', {
				title : '订单详情',
				id : 'orderFormDetail',
				modal : true,
				layout : 'anchor',
				items : [ {xtype : 'orderdetailform'} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('orderFormDetail').show();
		}
		var formWin = Ext.getCmp('orderFormDetail');
		formWin.down('form').loadRecord(record);
		var detailGrid = formWin.down('grid');
		var params = {'d.o_id' : record.data.id};
		var store = detailGrid.getStore();
		store.on("beforeload",function(){
	        store.proxy.extraParams=params;  
	    });  
		store.loadPage(1);
	},
	submit : function(button) {
		var form = button.up('form').getForm();
		var action = 'update';
		var funcId = '10092';
		var successMsg = '修改成功';
		var failedMsg = '修改失败';
		var win = button.up('window');
		var grid = this.getOrderFormGrid();
		form.submit({
			submitEmptyText : false,
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
	updateStatus : function(grid,record,action){
		Ext.Msg.wait('操作进行中，请稍后...', '提示');
		Ext.Ajax.request({
			url : 'manage.do', // 请求地址
			params : {
				action : action,
				id : record.data.id
			}, // 请求参数
			method : 'post', // 方法
			callback : function(options, success, response) {
				if (success) {
					Ext.Msg.hide();
					var res = Ext.decode(response.responseText);
					if(res.success) {
						top.Ext.MessageBox.show({
							title : '提示信息',
							msg : '操作成功!',
							icon : Ext.MessageBox.INFO,
							buttons : Ext.Msg.OK
						});
						grid.getStore().reload();
					}
					else
						top.Ext.MessageBox.show({
							title : '提示信息',
							msg : '操作失败!'+res.msg,
							icon : Ext.MessageBox.ERROR,
							buttons : Ext.Msg.OK
						});
				} else {
					Ext.Msg.hide();
					top.Ext.MessageBox.show({
								title : '提示信息',
								msg : '操作失败!系统异常!',
								icon : Ext.MessageBox.ERROR,
								buttons : Ext.Msg.OK
							});
				}
			}
		});
	},
	sendOrderForm : function(grid,record,action) {
	 var win = Ext.create('Ext.window.Window', {
			title : '请选择送餐人员',
			resizable : false,
			modal : true,
			layout : 'fit',
			items : [ {
				xtype : 'sendorderform'
			} ],
			autoShow : true
		});
	 win.down('form').form.findField('id').setValue(record.data.id);
	},
	sendOrder : function(button) {
		var form = button.up('form').getForm();
		var win = button.up('window');
		var grid = this.getOrderFormGrid();
		var successMsg = '操作成功';
		var failedMsg = '操作失败';
		form.submit({
			waitMsg:'操作进行中，请稍后...',
			clientValidation : true,
			url : 'system.do',
			params : {
				action : 'update',
				funcId : '10093',
				status : '3',
				time3 : (new Date()).Format("yyyy-MM-dd HH:mm:ss")
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
	cancelOrderForm : function(grid,record,action) {
		 var win = Ext.create('Ext.window.Window', {
				title : '请填写作废原因',
				resizable : false,
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'cancelorderform'
				} ],
				autoShow : true
			});
		 win.down('form').form.findField('id').setValue(record.data.id);
	},
	cancelOrder : function(button) {
		var form = button.up('form').getForm();
		var win = button.up('window');
		var grid = this.getOrderFormGrid();
		var successMsg = '操作成功';
		var failedMsg = '操作失败';
		form.submit({
			waitMsg:'操作进行中，请稍后...',
			clientValidation : true,
			url : 'system.do',
			params : {
				action : 'update',
				funcId : '10094',
				status : '0',
				time0 : (new Date()).Format("yyyy-MM-dd HH:mm:ss")
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
