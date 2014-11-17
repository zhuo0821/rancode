Ext.define('manage.view.product.ProductGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.productgrid',
	store : 'product.Product',
	initComponent : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly : true
		});
		Ext.apply(this, {
			id : 'product-grid',
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
				store : 'product.Product',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '菜品名称',
				dataIndex : 'name',
				hideable : false,
				flex : 1
			},{
				text : '所属分店',
				dataIndex : 's_name',
				hideable : false,
				flex : 1
			}, {
				text : '种类名称',
				dataIndex : 'p_name',
				flex : 1
			}, {
				text : '子类名称',
				dataIndex : 'c_name',
				flex : 1
			}, {
				text : '价格',
				dataIndex : 'price',
				renderer : RMBMoney,
				flex : 1
			}, {
				text : '可做量',
				dataIndex : 'amount',
				flex : 1
			}, {
				text : '销售量',
				dataIndex : 'sales_volume',
				flex : 1
			}, {
				text : '制作时间',
				dataIndex : 'made_time',
				flex : 1
			}, {
				text : '是否打折',
				dataIndex : 'discount_flag',
				flex : 1,
				renderer : YesOrNoRender
			}, {
				text : '打折比例',
				dataIndex : 'discount',
				flex : 1 
			}, {
				text : 'ID',
				dataIndex : 'ID',
				hidden : true
			}, {
				text : '添加时间',
				dataIndex : 'add_time',
				flex : 2
			}
			]
		});
		this.callParent(arguments);
	}
});