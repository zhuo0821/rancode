Ext.define('manage.view.PicUploadForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.picuploadform',
	bodyPadding : 10,
	header : false,
	buttonAlign : 'center',
	border : false,
	initComponent : function() {
		var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
		var me = this;
		Ext.applyIf(me, {
					items : [{
								xtype : 'filefield',
								name : 'new_file',
								fieldLabel : '文件路径',
								labelWidth : 80,
								msgTarget : 'side',
								allowBlank : false,
								anchor : '100%',
								afterLabelTextTpl : required,
								emptyText : '请选择上传文件',
								blankText : '此项为必填项',
								allowBlank : false,
								buttonText : '浏览'
							}, {
								xtype : 'textfield',
								hidden : true,
								name : 'old_file'
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