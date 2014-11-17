Ext.define('manage.view.advertisement.AdvertisementGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.advertisementgrid',
	store : 'advertisement.Advertisement',
	initComponent : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly : true,
			listeners : {
				beforeselect : function( check, record, index, eOpts){
					if(record.data.location != '大图' )
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
				store : 'advertisement.Advertisement',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '广告位置',
				dataIndex : 'location',
				hideable : false,
				flex : 1
			},{
				text : '广告描述',
				dataIndex : 'description',
				hideable : false,
				flex : 2
			}, {
				text : '广告图片',
				dataIndex : 'pic',
				flex : 1
			}, {
				text : '广告链接',
				dataIndex : 'url',
				flex : 1
			}]
		});
		this.callParent(arguments);
	}
});