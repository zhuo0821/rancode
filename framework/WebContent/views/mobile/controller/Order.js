Ext.define('mobile.controller.Order', {
	extend : 'Ext.app.Controller',

	config : {
		models : [ 'OrderDetail' ],
		stores : [ 'OrderDetails' ],
		views : [ 'order.OrderDetailList', 'order.OrderDetail' ],
		refs : {
			main : 'mainview',
			submitButton : '#submitButton',
			orderFormList : 'orderformlist',
			orderDetailList : 'orderdetaillist',
			orderDetail : 'orderdetail'
		},

		control : {
			main : {
				push : 'onMainPush',
				pop : 'onMainPop'
			},
			submitButton : {
				tap : 'onOrderSubmit'
			},
			orderFormList : {
				itemtap : 'onOrderSelect'
			}
		}
	},

	onMainPush : function(view, item) {
		var submitButton = this.getSubmitButton();

		if (item.xtype == "orderdetail") {
			this.getOrderFormList().deselectAll();

			this.showSubmitButton();
		} else {
			this.hideSubmitButton();
		}
	},

	onMainPop : function(view, item) {
		if (item.xtype == "orderdetail") {
			this.showSubmitButton();
		} else {
			this.hideSubmitButton();
			this.getOrderFormList().getStore().loadPage(1);
		}
	},

	onOrderSelect : function(list, index, node, record) {

		if (!this.showOrderDetail) {
			this.showOrderDetail = Ext.create('mobile.view.order.OrderDetail');
		}

		this.showOrderDetail.setRecord(record);
		var orderDetailList = this.getOrderDetailList();
		orderDetailList.getStore().getProxy().setExtraParam('d.o_id',
				record.data.id);
		orderDetailList.getStore().loadPage(1);

		this.getMain().push(this.showOrderDetail);
	},

	onOrderSubmit : function() {
		var me = this;
		var record = this.getOrderDetail().getRecord();
		var action = 'finishOrder';
		var orderDetail = this.getOrderDetail();
		var orderFormList = this.getOrderFormList();
		var main = this.getMain();
		Ext.Msg.confirm('操作确认', '您确认该订单已经送达吗？', function(btnId, text, opt) {
			if (btnId == "yes") {
				me.updateStatus(orderDetail,main,orderFormList,record,action);
			}
		});
	},
	updateStatus : function(grid,main,list, record, action) {
		var myMask;
		myMask = new Ext.LoadMask({
			message : "操作中，请稍后..."
		});
		grid.setMasked(myMask);
		Ext.Ajax.request({
			url : 'manage.do', // 请求地址
			params : {
				action : action,
				id : record.data.id
			}, // 请求参数
			method : 'post', // 方法
			callback : function(options, success, response) {
				if (success) {
					myMask.hide();
					var res = Ext.decode(response.responseText);
					if (res.success) {
						Ext.Msg.show({
							title : '提示信息',
							message : '操作成功!',
							buttons : Ext.Msg.OK
						});
						main.pop();
						list.getStore().loadPage(1);
					} else
						Ext.Msg.show({
							title : '提示信息',
							message : '操作失败!' + res.msg,
							buttons : Ext.Msg.OK
						});
				} else {
					myMask.hide();
					Ext.Msg.show({
						title : '提示信息',
						message : '操作失败!系统异常!',
						buttons : Ext.Msg.OK
					});
				}
			}
		});
	},

	onContactChange : function() {
		this.showSaveButton();
	},

	onContactSave : function() {
		var record = this.getSubmitContact().saveRecord();

		this.getShowContact().updateRecord(record);

		this.getMain().pop();
	},

	showSubmitButton : function() {
		var submitButton = this.getSubmitButton();

		if (!submitButton.isHidden()) {
			return;
		}

		submitButton.show();
	},

	hideSubmitButton : function() {
		var submitButton = this.getSubmitButton();

		if (submitButton.isHidden()) {
			return;
		}

		submitButton.hide();
	},

	showSaveButton : function() {
		var saveButton = this.getSaveButton();

		if (!saveButton.isHidden()) {
			return;
		}

		saveButton.show();
	},

	hideSaveButton : function() {
		var saveButton = this.getSaveButton();

		if (saveButton.isHidden()) {
			return;
		}

		saveButton.hide();
	}
});
