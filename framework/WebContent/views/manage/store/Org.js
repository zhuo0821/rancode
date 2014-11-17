Ext.define('manage.store.Org', {
	extend : 'Ext.data.Store',
	requires: 'manage.model.ComboBox', 
	model : 'manage.model.ComboBox',
	autoLoad : {start: 0, limit: -1},
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10103',
		reader : {
			type : 'json',
			root : 'data',
			successProperty : 'success'
		}
	}
});