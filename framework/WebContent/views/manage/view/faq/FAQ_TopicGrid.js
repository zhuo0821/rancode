Ext.define('manage.view.faq.FAQ_TopicGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.faq_topicgrid',
	store : 'faq.FAQ_Topic',
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
				store : 'faq.FAQ_Topic',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '分类名称',
				dataIndex : 'name',
				hideable : false,
				flex : 1
			}]
		});
		this.callParent(arguments);
	}
});