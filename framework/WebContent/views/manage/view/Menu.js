
    Ext.define('manage.view.Menu',{
        extend: 'Ext.panel.Panel',
        alias: 'widget.managemenu',
        initComponent : function(){
            Ext.apply(this,{
                id: 'menu-panel',
                title: '导航栏',
                region : 'west',
                width : 250,  
                iconCls : 'icon00',  
                autoScroll : false,  
                layout : 'accordion',  
                collapsible : true,  
                layoutConfig : {  
                    animate : true  
                },  
                split : true
            });
            this.callParent(arguments);
        }
    });
