Ext.define('manage.view.faq.FAQ_TopicPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.faq_topicpanel',
	layout : 'border',
	title : 'FAQ分类管理',
	id : 'faq_topicPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'faq_topicgrid'
	} ]
});