Ext.define('manage.store.Varieties', {
	extend : 'Ext.data.Store',
	requires: 'manage.model.ComboBox', 
	model : 'manage.model.ComboBox',
	autoLoad : {start: 0, limit: -1},
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10108',
		reader : {
			type : 'json',
			root : 'data',
			successProperty : 'success'
		}
	}
});