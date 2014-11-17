Ext.define('manage.view.order.CancelOrderForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.cancelorderform',
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
				width : 500,
				store : Ext.create('manage.store.ComboBox',{
					data : cancelReasonData
				}),
				queryMode : 'local',
				fieldLabel : '作废原因',
				emptyText : '请填写作废原因或选择常用原因',
				afterLabelTextTpl: required,
				allowBlank : false,
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