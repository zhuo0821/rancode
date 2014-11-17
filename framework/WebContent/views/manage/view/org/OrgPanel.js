Ext.define('manage.view.org.OrgPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.orgpanel',
	layout : 'border',
	title : '分店管理',
	id : 'orgPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'orgqueryform'
	}, {
		xtype : 'orggrid'
	} ]
});