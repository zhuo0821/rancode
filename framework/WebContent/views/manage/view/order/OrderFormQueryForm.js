Ext.define('manage.view.order.OrderFormQueryForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.orderformqueryform',
    layout: {
        columns: 4,
        type: 'table'
    },
    bodyPadding: 10,
    header: false,
    region : 'north',
    initComponent: function() {
        var me = this;
        
        Ext.applyIf(me, {
            items: [
            	{
					xtype : 'mycombo',
					hidden : session.role=='0'?false:true,
					store : Ext
							.create('manage.store.Org'),
					queryMode : 'local',
					name : 's.id',
					editable : false,
					value : session.role=='0'?'':session.sId,
					fieldLabel : '所属分店'
				},
                {
					xtype : 'mycombo',
					store : Ext.create('manage.store.ComboBox',{
						data : orderStatusData
					}),
					queryMode : 'local',
					editable : false,
                    name : 'o.status',
                    fieldLabel: '订单状态'
                },
                {
                	xtype : 'mycombo',
					store : Ext.create('manage.store.ComboBox',{
						data : payTypeData
					}),
					queryMode : 'local',
					editable : false,
                    name : 'o.pay_type',
                    fieldLabel: '支付方式'
                },
                {
                	xtype : 'mycombo',
					store : Ext.create('manage.store.ComboBox',{
						data : payStatusData
					}),
					queryMode : 'local',
                    name : 'o.pay_statys',
					editable : false,
                    fieldLabel: '支付状态'
                }
            ]
        });

        me.callParent(arguments);
    }

});