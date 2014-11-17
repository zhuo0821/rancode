Ext.define('manage.store.faq.FAQ', {
	extend : 'Ext.data.Store',
	model : 'manage.model.faq.FAQ',
	pageSize : 20,
	autoLoad : true,
	remoteSort : true,
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10080',
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});