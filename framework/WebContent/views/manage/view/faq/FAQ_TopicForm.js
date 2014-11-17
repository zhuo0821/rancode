Ext.define('manage.view.faq.FAQ_TopicForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.faq_topicform',
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
						fieldLabel : '分类名称',
						name : 'name',
						emptyText : '必须填写分类名称',
						blankText : '此项为必填项',
						allowBlank : false,
						maxLength : 250
					},
					{
						xtype : 'hidden',
						name : 'id'
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