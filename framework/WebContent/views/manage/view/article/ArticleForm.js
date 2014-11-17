Ext.define('manage.view.article.ArticleForm', {
	extend : 'Ext.form.Panel',
	alias : 'widget.articleform',
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
						fieldLabel : '文章分类',
						name : 't_name',
						disabled : true,
						value : '广告文章'
					},
					{
						xtype : 'hidden',
						name : 't_id',
						value : 5
					},{
								xtype : 'textfield',
								fieldLabel : '文章标题',
								name : 'title',
								afterLabelTextTpl : required,
								emptyText : '必须填写文章标题',
								blankText : '此项为必填项',
								allowBlank : false
							}, {
								xtype : 'textfield',
								fieldLabel : '文章说明',
								name : 'description'
							}, {
								xtype : 'textfield',
								hidden : true,
								fieldLabel : 'id',
								name : 'id'
							}, {
								xtype : 'htmleditor',
								fieldLabel : '文章内容',
								name : 'content'
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