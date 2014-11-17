Ext.define('manage.view.order.SendOrderForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.sendorderform',
	layout : {
		columns : 1,
		type : 'table'
	},
	bodyPadding : 10,
	header : false,
	buttonAlign : 'center',
	border:false,
	initComponent : function() {
		var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
		var me = this;
		Ext.applyIf(me, {
			items : [ {
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
				afterLabelTextTpl: required,
				allowBlank : false,
				editable : false,
				name : 'd_id'
			}, {
				xtype : 'textfield',
				hidden : true,
				fieldLabel : 'id',
				name : 'id'
			} ],
			buttons : [ {
				text : '确定',
				action : 'submit',
			}, {
				text : '重置',
				handler : function() {
					this.up('form').getForm().reset();
				}
			} ]
		});

		me.callParent(arguments);
	}

});