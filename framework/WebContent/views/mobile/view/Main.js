Ext.define('mobile.view.Main', {
    extend: 'Ext.navigation.View',
    xtype: 'mainview',

    requires: [
        'mobile.view.order.OrderFormList',
        'mobile.view.order.OrderDetail',
        'mobile.view.order.OrderDetailList'
    ],

    config: {
        autoDestroy: false,
        defaultBackButtonText : '返回',
        navigationBar: {
            ui: 'light',
            items: [
                {
                    xtype: 'button',
                    id: 'submitButton',
                    text: '送达',
                    align: 'right',
                    hidden: true,
                    hideAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeOut',
                        duration: 200
                    },
                    showAnimation: Ext.os.is.Android ? false : {
                        type: 'fadeIn',
                        duration: 200
                    }
                }
            ]
        },

        items: [
                { xtype: 'orderformlist' }
        ]
    }
});
