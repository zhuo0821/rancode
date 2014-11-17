Ext.define('manage.view.faq.FAQGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.faqgrid',
	store : 'faq.FAQ',
	initComponent : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly : true
		});
		Ext.apply(this, {
			id : 'article-grid',
			selModel : selModel,
			header : false,
			region : 'center',
			autoScroll : true,
			tbar : [ {
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
				store : 'faq.FAQ',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '分类名称',
				dataIndex : 't_name',
				hideable : false,
				flex : 1
			},{
				text : '问题',
				dataIndex : 'question',
				hideable : false,
				flex : 1
			}]
		});
		this.callParent(arguments);
	}
});