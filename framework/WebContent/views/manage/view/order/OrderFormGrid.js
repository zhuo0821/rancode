Ext.define('manage.view.order.OrderFormGrid', {
	extend : 'Ext.grid.Panel',
	alias : 'widget.orderformgrid',
	store : 'order.OrderForm',
	initComponent : function() {
		var selModel = Ext.create('Ext.selection.CheckboxModel', {
			checkOnly : true
		});
		Ext.apply(this, {
			id : 'orderform-grid',
			selModel : selModel,
			header : false,
			region : 'center',
			autoScroll : true,
			tbar : [ {
				iconCls : 'query',
				xtype : 'button',
				action : 'query',
				text : '查询'
			}],
			bbar : Ext.create('Ext.PagingToolbar', {
				store : 'order.OrderForm',
				displayInfo : true
			}),
			buttonAlign : 'center',
			columns : [
					{
						text : '分店名称',
						dataIndex : 's_name',
						flex : 1
					},
					{
						text : '订单号',
						dataIndex : 'number',
						flex : 1,
						hideable : false
					},
					{
						text : '订餐人',
						dataIndex : 'username',
						flex : 1
					},
					{
						text : '下单时间',
						dataIndex : 'time',
						flex : 2,
						hideable : false
					},
					{
						text : '订单状态',
						dataIndex : 'status',
						flex : 1,
						renderer : orderStatusRender,
						hideable : false
					},
					{
						text : '支付方式',
						dataIndex : 'pay_type',
						flex : 1,
						renderer : orderPayTypeRender,
						hideable : false
					},
					{
						text : '支付状态',
						dataIndex : 'pay_status',
						flex : 1,
						renderer : orderPayStatusRender,
						hideable : false
					},
					{
						text : '总额',
						dataIndex : 'allcharge',
						renderer : RMBMoney,
						flex : 1,
						hideable : false
					},
					{
						xtype : 'actioncolumn',
						text : '操作',
						items : [
								{
									action : 'confirm',
									iconCls : 'accept1',
									tooltip : '确认订单',
									isDisabled : function(view, rowIdx, colIdx,
											item, record) {
										if (record.data.status == '1')
											return false;
										else
											return true;
									},
									handler : function(grid, rowIndex,
											colIndex, actionItem, event,
											record, row) {
										this.fireEvent('confirm', grid, record, 'confirmOrder','您确定将该订单改为确认状态吗？');
									}
								},
								{
									action : 'send',
									iconCls : 'forwardmail',
									tooltip : '出单',
									isDisabled : function(view, rowIdx, colIdx,
											item, record) {
										if (record.data.status == '2')
											return false;
										else
											return true;
									},
									handler : function(grid, rowIndex,
											colIndex, actionItem, event,
											record, row) {
										this.fireEvent('send', grid, record, 'sendOrder','您确定将该订单改为出单状态吗？');
									}
								},
								{
									action : 'finish',
									iconCls : 'yen_coin',
									tooltip : '完成',
									isDisabled : function(view, rowIdx, colIdx,
											item, record) {
										if (record.data.status == '3')
											return false;
										else
											return true;
									},
									handler : function(grid, rowIndex,
											colIndex, actionItem, event,
											record, row) {
										this.fireEvent('finish', grid, record, 'finishOrder','您确定将该订单改为完成状态吗？');
									}
								},
								{
									action : 'cancel',
									iconCls : 'cancel',
									tooltip : '作废',
									isDisabled : function(view, rowIdx, colIdx,
											item, record) {
										if (record.data.status != '0' && record.data.status != '4')
											return false;
										else
											return true;
									},
									handler : function(grid, rowIndex,
											colIndex, actionItem, event,
											record, row) {
										this.fireEvent('cancel', grid, record, 'cancelOrder','您确定将该订单改为作废状态吗？');
									}
								} ]
					}

			]
		});
		this.callParent(arguments);
	}
});