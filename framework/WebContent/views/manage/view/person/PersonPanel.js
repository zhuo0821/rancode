Ext.define('manage.view.person.PersonPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.personpanel',
	layout : 'border',
	title : '帐号管理',
	id : 'personPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'personqueryform'
	}, {
		xtype : 'persongrid'
	} ]
});