Ext.define('manage.view.varieties.VarietiesForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.varietiesform',
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
				xtype : 'textfield',
				fieldLabel : '种类名称',
				name : 'name',
				afterLabelTextTpl: required,
				emptyText : '必须填写种类名称',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'textfield',
				hidden : true,
				fieldLabel : 'id',
				name : 'id'
			}, {
				xtype : 'textfield',
				hidden : true,
				fieldLabel : 'node',
				name : 'node',
				value : 'root'
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