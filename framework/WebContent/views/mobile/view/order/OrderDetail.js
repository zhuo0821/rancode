Ext.define('mobile.view.order.OrderDetail', {
    extend: 'Ext.Container',
    xtype: 'orderdetail',

    config: {
        title: '订单详情',
        layout: 'vbox',

        items: [
            {
               xtype:'orderdetaillist',
               flex : 1
            }
        ],

        record: null
    }
});
