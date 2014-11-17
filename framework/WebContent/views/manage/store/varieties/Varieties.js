Ext.define('manage.store.varieties.Varieties', {
	extend : 'Ext.data.TreeStore',
	model : 'manage.model.varieties.Varieties',
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10040',
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});