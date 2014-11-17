Ext.define('manage.view.org.OrgForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.orgform',
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
				fieldLabel : '分店名称',
				name : 'NAME',
				afterLabelTextTpl: required,
				emptyText : '必须填写名称',
				blankText : '此项为必填项',
				allowBlank : false
			},{
				xtype : 'textfield',
				fieldLabel : '分店电话',
				name : 'PHONE'
			},{
				xtype : 'textfield',
				fieldLabel : '分店地址',
				name : 'ADDRESS'
			}, {
				xtype : 'textfield',
				hidden : true,
				fieldLabel : 'id',
				name : 'ID'
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