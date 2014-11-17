Ext.define('manage.view.ChangePwdForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.changepwdform',
	bodyPadding : 10,
	title : '密码修改',
	buttonAlign : 'center',
	layout : {
		type : 'vbox',
		align : 'center',
		pack : 'center'
	},
	closable : true,
	initComponent : function() {
		var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
		var me = this;
		Ext.applyIf(me, {
					items : [{
								xtype : 'textfield',
								fieldLabel : '原始密码',
								inputType : 'password',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false,
								name : 'OLDPWD'
							}, {
								xtype : 'textfield',
								fieldLabel : '新密码',
								id : 'PASSWORD',
								name : 'PASSWORD',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false,
								inputType : 'password'
							}, {
								xtype : 'textfield',
								fieldLabel : 'ID',
								name : 'LOGINNAME',
								hidden : true,
								value : session.userId
							}, {
								xtype : 'textfield',
								fieldLabel : '确认密码',
								name : 'CONPASSWORD',
								inputType : 'password',
								vtype : 'password',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false,
								vtypeText : "两次密码不一致！",
								confirmTo : 'PASSWORD'
							}],
					buttons : [{
								text : '修改',
								action : 'submit'
							}, {
								text : '重置',
								handler : function() {
									this.up('form').getForm().reset();
								}
							}]
				});

		me.callParent(arguments);
	}

});