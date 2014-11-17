Ext.define('manage.view.faq.FAQPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.faqpanel',
	layout : 'border',
	title : 'FAQ管理',
	id : 'faqPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'faqgrid'
	} ]
});