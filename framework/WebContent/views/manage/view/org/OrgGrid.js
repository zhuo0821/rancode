Ext.define('manage.view.org.OrgGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.orggrid',
	store : 'org.Org',
	initComponent : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly : true
		});
		Ext.apply(this, {
			id : 'org-grid',
			selModel : selModel,
			header : false,
			region : 'center',
			autoScroll : true,
			tbar : [ {
				iconCls : 'query',
				xtype : 'button',
				action : 'query',
				text : '查询'
			}, '-', {
				iconCls : 'item-add',
				xtype : 'button',
				action : 'insert',
				text : '添加'
			}, '-', {
				iconCls : 'item-delete',
				xtype : 'button',
				action : 'delete',
				text : '删除'
			} ],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : 'org.Org',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '分店名称',
				dataIndex : 'NAME',
				flex : 1,
				hideable : false
			}, {
				text : '电话',
				dataIndex : 'PHONE',
				flex : 1,
				hideable : false
			}, {
				text : '地址',
				dataIndex : 'ADDRESS',
				flex :3,
				hideable : false
			}
			]
		});
		this.callParent(arguments);
	}
});