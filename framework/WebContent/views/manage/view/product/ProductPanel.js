Ext.define('manage.view.product.ProductPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.productpanel',
	layout : 'border',
	title : '菜品管理',
	id : 'productPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'productqueryform'
	}, {
		xtype : 'productgrid'
	} ]
});