Ext.define('manage.view.faq.FAQForm', {
	extend : 'Ext.form.Panel',
	requires : ['manage.store.faq.Faq_t'],
	alias : 'widget.faqform',
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
						xtype : 'mycombo',
						store : Ext.create('manage.store.faq.Faq_t'),
						queryMode : 'remote',
						name : 't_id',
						fieldLabel : '所属分类',
						afterLabelTextTpl : required,
						emptyText : '必须填写分类',
						blankText : '此项为必填项',
						allowBlank : false
					} ,{
						xtype : 'textfield',
						fieldLabel : '问题',
						name : 'question',
						emptyText : '必须填写问题',
						blankText : '此项为必填项',
						allowBlank : false,
						width : 800,
						maxLength : 250
					},{
						xtype : 'htmleditor',
						fieldLabel : '答案',
						name : 'answer',
						emptyText : '必须填写答案',
						blankText : '此项为必填项',
						allowBlank : false,
						maxLength : 2500
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