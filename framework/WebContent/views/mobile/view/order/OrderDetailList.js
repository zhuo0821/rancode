Ext.define('mobile.view.order.OrderDetailList', {
    extend: 'Ext.List',
    xtype: 'orderdetaillist',
    requires: ['Ext.plugin.ListPaging'],
    config: {
        title: '订单内容',
        plugins: [{
        	 xclass: 'Ext.plugin.ListPaging',
        	 autoPaging: true,
        	 loadMoreText : '加载更多',
        	 noMoreRecordsText : '没有更多'
        }],
        store: 'OrderDetails',
        itemTpl: [
                  '<div style="float:right; padding-top: 0; font-size: 22px; font-weight: bold">X{number}份<span style="display: block; font-size: 14px;font-weight: normal;color: #666">￥{amount}元</span></div>',
                  '<div style=" padding-top: 0; font-size: 22px; font-weight: bold">{name}<span style="display: block; font-size: 14px;font-weight: normal;color: #666">￥{price}元</span></div>',
        ].join('')
    }
});
