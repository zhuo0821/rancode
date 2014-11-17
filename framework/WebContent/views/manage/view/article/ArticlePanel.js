Ext.define('manage.view.article.ArticlePanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.articlepanel',
	layout : 'border',
	title : '文章管理',
	id : 'articlePanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'articlequeryform'
	}, {
		xtype : 'articlegrid'
	} ]
});