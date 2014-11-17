
    Ext.define('manage.view.Header', {
        extend: 'Ext.panel.Panel',
        initComponent: function() {
            Ext.apply(this, {  
                height : 80,  
                title : '后台管理',  
                region : 'north',  
                split : true,
                collapsed : true,
                collapsible : true
            });
            this.callParent(arguments);
        }
    });
