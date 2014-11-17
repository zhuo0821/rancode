Ext.define('manage.view.person.PersonGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.persongrid',
	store : 'person.Person',
	initComponent : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly : true
		});
		Ext.apply(this, {
			id : 'person-grid',
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
				store : 'person.Person',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '帐号名称',
				dataIndex : 'NAME',
				hideable : false,
				flex : 1
			},{
				text : '所属分店',
				dataIndex : 'ORG_NAME',
				hideable : false,
				flex : 2
			}, {
				text : '登录名',
				dataIndex : 'LOGINNAME',
				flex : 1
			}, {
				text : '密码',
				dataIndex : 'PASSWORD',
				flex : 1 
			}, {
				text : 'ID',
				dataIndex : 'ID',
				hidden : true
			}, {
				text : '帐号角色',
				dataIndex : 'ROLE_NAME',
				flex : 1
			}

			]
		});
		this.callParent(arguments);
	}
});