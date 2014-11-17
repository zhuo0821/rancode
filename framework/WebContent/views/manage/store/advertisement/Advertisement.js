Ext.define('manage.store.advertisement.Advertisement', {
	extend : 'Ext.data.Store',
	model : 'manage.model.advertisement.Advertisement',
	pageSize : 20,
	autoLoad : true,
	remoteSort : true,
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10030',
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});