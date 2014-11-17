Ext.define('manage.view.order.OrderFormPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.orderformpanel',
	layout : 'border',
	title : '订单管理',
	id : 'orderformpanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'orderformqueryform'
	}, {
		xtype : 'orderformgrid'
	} ]
});