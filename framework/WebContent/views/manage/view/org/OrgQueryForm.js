Ext.define('manage.view.org.OrgQueryForm', {
    extend: 'Ext.form.Panel',
    alias: 'widget.orgqueryform',
    layout: {
        columns: 1,
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
                    xtype: 'textfield',
                    name : 'NAME',
                    fieldLabel: '分店名称'
                }
            ]
        });

        me.callParent(arguments);
    }

});