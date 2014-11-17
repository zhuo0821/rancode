Ext.define('manage.view.advertisement.AdvertisementPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.advertisementpanel',
	layout : 'border',
	title : '广告管理',
	id : 'advertisementPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'advertisementqueryform'
	}, {
		xtype : 'advertisementgrid'
	} ]
});