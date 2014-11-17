Ext.define('manage.view.order.OrderDetailForm', {
	extend : 'Ext.form.Panel',
	requires : ['manage.store.ComboBox'],
	alias : 'widget.orderdetailform',
	bodyPadding : 10,
	header : false,
	buttonAlign : 'center',
	border:false,
	initComponent : function() {
		var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
		var me = this;
		Ext.applyIf(me, {
			items : [ {xytpe : 'fieldset',
				title : '订单信息',
				layout : {
					columns : 3,
					type : 'table'
				},
				items : [{
					xtype : 'textfield',
					fieldLabel : '流水号',
					name : 'number',
					disabled : true
				},{
					xtype : 'textfield',
					fieldLabel : '订餐人账号',
					name : 'username',
					disabled : true
				}, {
					xtype : 'textfield',
					hidden : true,
					fieldLabel : 'id',
					name : 'id'
				},{
					xtype : 'textfield',
					fieldLabel : '下单时间',
					name : 'time',
					disabled : true
				},{
					xtype : 'textfield',
					fieldLabel : '送餐地址',
					colspan : 2,
					width : 560,
					name : 'address',
					disabled : true
				},{
					xtype : 'textfield',
					fieldLabel : '联系电话',
					name : 'phone',
					disabled : true
				},{
					xtype : 'numberfield',
					fieldLabel : '订单总价',
					minValue: 0,
					step : 0.01,
					name : 'allcharge'
				},{
					xtype : 'mycombo',
					store : Ext.create('manage.store.ComboBox',{
						data : payTypeData
					}),
					queryMode : 'local',
					fieldLabel : '支付方式',
					name : 'pay_type',
					editable : false,
					allowBlank : false
				},{
					xtype : 'mycombo',
					store : Ext.create('manage.store.ComboBox',{
						data : payStatusData
					}),
					queryMode : 'local',
					fieldLabel : '支付状态',
					name : 'pay_status',
					editable : false,
					allowBlank : false
				},{
					xtype : 'mycombo',
					store : Ext.create(
							'manage.store.ComboBox', {
								proxy : {
									type : 'ajax',
									url : 'system.do?action=query&funcId=10111&s_id='+(session.role=='0'?'':session.sId),
									reader : {
										type : 'json',
										root : 'data',
										totalProperty : 'totalCount',
										successProperty : 'success'
									}
								},
								autoLoad : {
									start : 0,
									limit : -1
								}
							}),
					queryMode : 'local',
					fieldLabel : '送餐人',
					editable : false,
					name : 'd_id'
				},{
					xtype : 'mycombo',
					store : Ext.create('manage.store.ComboBox',{
						data : orderStatusData
					}),
					queryMode : 'local',
					fieldLabel : '订单状态',
					editable : false,
					name : 'status',
					allowBlank : false
				}]
			},{xtype : 'orderdetailgrid'}],
			buttons : [ {
				text : '修改',
				action : 'submit',
			}, {
				text : '关闭',
				handler : function() {
					this.up('window').close();
				}
			} ]
		});

		me.callParent(arguments);
	}

});