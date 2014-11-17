
    Ext.define('manage.view.TabPanel',{
        extend: 'Ext.tab.Panel',
        initComponent : function(){
            Ext.apply(this,{
                id: 'content-panel',
                region: 'center', 
                defaults: {
                   autoScroll:true,
                   bodyPadding: 10
                },
                activeTab: 0,
                border: false,
               //plain: true,
                items: [{
                  id: 'HomePage',
                  title: '首页',
                  iconCls:'home',
                  layout: 'fit',
                  //bodyStyle:'background-image:url(../grade/resources/images/index.jpg);background-repeat:no-repeat;'
                }]
            });
            this.callParent(arguments);
        }
    });
