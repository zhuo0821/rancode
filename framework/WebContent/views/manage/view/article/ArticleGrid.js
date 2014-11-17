Ext.define('manage.view.article.ArticleGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.articlegrid',
	store : 'article.Article',
	initComponent : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly : true,
			listeners : {
				beforeselect : function( check, record, index, eOpts){
					if(record.data.t_id !=5 )
					  return false;
				}
			}
		});
		Ext.apply(this, {
			id : 'article-grid',
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
				store : 'article.Article',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '文章分类',
				dataIndex : 't_name',
				hideable : false,
				flex : 1
			},{
				text : '文章标题',
				dataIndex : 'title',
				hideable : false,
				flex : 2
			}, {
				text : '文章描述',
				dataIndex : 'description',
				flex : 1
			}]
		});
		this.callParent(arguments);
	}
});