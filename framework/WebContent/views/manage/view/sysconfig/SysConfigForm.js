Ext.define('manage.view.sysconfig.SysConfigForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'manage.model.sysconfig.SysConfig'],
	alias : 'widget.sysconfigform',
	bodyPadding : 10,
	title : '网站信息',
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
								fieldLabel : '网站名称',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false,
								name : 'siteName'
							}, {
								xtype : 'textfield',
								fieldLabel : '网站根目录',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false,
								name : 'webRoot'
							}, {
								xtype : 'textfield',
								fieldLabel : '联系电话',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false,
								name : 'phone'
							}, {
								xtype : 'textfield',
								fieldLabel : 'qq',
								name : 'qq',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false
							}, {
								xtype : 'hidden',
								name : 'id'
							}, {
								xtype : 'textfield',
								fieldLabel : '联系地址',
								name : 'address',
								afterLabelTextTpl : required,
								blankText : '此项为必填项',
								allowBlank : false
							}],
					buttons : [{
								text : '修改',
								action : 'submit'
							}, {
								text : '重置',
								action : 'refresh'
							}]
				});

		me.callParent(arguments);
	}

});