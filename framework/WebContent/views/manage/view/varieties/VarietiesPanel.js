Ext.define('manage.view.varieties.VarietiesPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.varietiespanel',
	layout : 'border',
	title : '菜品分类管理',
	id : 'varietiesPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'varietiesgrid'
	} ]
});