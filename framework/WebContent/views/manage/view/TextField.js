Ext.define('manage.view.TextField', {
	extend : 'Ext.form.field.Text',
	alias : 'widget.mytextfield',
	fieldStyle : 'background:none; border-right: 0px solid;border-top: 0px solid;border-left: 0px solid;border-bottom: 0px solid;',
	readOnly : true,
	padding : '0 0 0 25',
	width : 35,
	height : 15,
	initComponent : function() {
		var me = this;
		me.callParent(arguments);
	}
});