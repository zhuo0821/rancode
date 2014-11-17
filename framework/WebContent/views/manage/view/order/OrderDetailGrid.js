Ext.define('manage.view.order.OrderDetailGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.orderdetailgrid',
	initComponent : function() {
		Ext.apply(this, {
			height : 350,
			width : 845,
			store : 'order.OrderDetail',
			id : 'orderdetail-grid',
			title : '订单明细',
			autoScroll : true,
			bbar : Ext.create('Ext.PagingToolbar', {
				store : 'order.OrderDetail',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [ {
				text : '菜品名称',
				dataIndex : 'name',
				flex : 1,
				hideable : false
			}, {
				text : '数量',
				dataIndex : 'number',
				flex : 1,
				hideable : false
			}, {
				text : '原单价',
				dataIndex : 'price',
				flex :1
			}, {
				text : '实收总价',
				dataIndex : 'amount',
				flex :1,
				hideable : false
			}
			]
		});
		this.callParent(arguments);
	}
});
