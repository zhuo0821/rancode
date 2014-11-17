Ext.define('manage.view.person.PersonForm', {
	extend : 'Ext.form.Panel',
	requires : ['manage.store.Org', 'manage.store.Role'],
	alias : 'widget.personform',
	layout : {
		columns : 1,
		type : 'table'
	},
	bodyPadding : 10,
	header : false,
	buttonAlign : 'center',
	border : false,
	initComponent : function() {
		var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
		var me = this;
		Ext.applyIf(me, {
					items : [{
								xtype : 'textfield',
								fieldLabel : '帐号名称',
								name : 'NAME',
								afterLabelTextTpl : required,
								emptyText : '必须填写名称',
								blankText : '此项为必填项',
								allowBlank : false
							}, {
								xtype : 'mycombo',
								id : 'ORG_ID',
								store : Ext.create('manage.store.Org'),
								queryMode : 'local',
								fieldLabel : '所属分店',
								name : 'S_ID',
								editable : false,
								afterLabelTextTpl : required,
								emptyText : '必须填写分店',
								blankText : '此项为必填项',
								allowBlank : false
							}, {
								xtype : 'mycombo',
								store : Ext.create('manage.store.Role'),
								queryMode : 'local',
								fieldLabel : '帐号角色',
								name : 'ROLE_ID',
								editable : false,
								afterLabelTextTpl : required,
								emptyText : '必须填写角色',
								blankText : '此项为必填项',
								allowBlank : false
							}, {
								xtype : 'textfield',
								hidden : true,
								fieldLabel : 'id',
								name : 'ID'
							}, {
								xtype : 'textfield',
								fieldLabel : '登录名',
								name : 'LOGINNAME',
								afterLabelTextTpl : required,
								emptyText : '必须填写登录名',
								blankText : '此项为必填项',
								allowBlank : false
							}, {
								xtype : 'textfield',
								fieldLabel : '密码',
								id : 'PASSWORD',
								name : 'PASSWORD',
								afterLabelTextTpl : required,
								emptyText : '必须填写密码',
								blankText : '此项为必填项',
								inputType : 'password',
								allowBlank : false
							}, {
								xtype : 'textfield',
								fieldLabel : '确认密码',
								name : 'CONPASSWORD',
								inputType : 'password',
								vtype : 'password',
								afterLabelTextTpl : required,
								emptyText : '必须填写密码',
								blankText : '此项为必填项',
								vtypeText : "两次密码不一致！",
								confirmTo : 'PASSWORD',
								allowBlank : false
							}],
					buttons : [{
								text : '确定',
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