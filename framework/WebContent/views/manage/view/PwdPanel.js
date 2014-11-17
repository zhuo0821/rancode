Ext.define('manage.view.PwdPanel', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.pwdpanel',
	layout : 'border',
	title : '密码修改',
	id : 'pwdPanel',
	closable : true,
	initComponent : function() {
		this.callParent(arguments);
	},
	items : [ {
		xtype : 'changepwdform'
	}]
});