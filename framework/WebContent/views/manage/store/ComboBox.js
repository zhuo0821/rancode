Ext.define('manage.store.ComboBox', {
	extend : 'Ext.data.Store',
	requires: 'manage.model.ComboBox', 
	model : 'manage.model.ComboBox',
	autoDestroy: true
});