
    Ext.define('manage.view.Viewport',{
        extend: 'Ext.Viewport',
        layout: 'fit',
        hideBorders: true,
        requires : [
            'manage.view.Header',
            'manage.view.Menu',
            'manage.view.TabPanel',
            'manage.view.South'
        ],
        initComponent : function(){
        	Ext.Ajax.timeout = 1800000; 
        	Ext.data.proxy.Ajax.timeout = 1800000;
        	Ext.QuickTips.init();
			Ext.form.Field.prototype.msgTarget='side';
			Ext.apply(Ext.form.VTypes, {
					password : function(val, field) {
						if (field.confirmTo) {
							var pwd = Ext.getCmp(field.confirmTo);
							if (val.trim() == pwd.getValue().trim()) {
								return true;
							} else {
								return false;
							}
							return false;
						}
					}
				});
            var me = this;
            Ext.apply(me, {
                items: [{
                    id:'desk',
                    layout: 'border',
                    items: [
                        Ext.create('manage.view.Header'),
                        Ext.create('manage.view.Menu'),
                        Ext.create('manage.view.TabPanel'),
                        Ext.create('manage.view.South')
                    ]
                }]
            });
            me.callParent(arguments);
        }
    });
