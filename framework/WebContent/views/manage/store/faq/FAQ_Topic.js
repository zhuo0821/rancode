Ext.define('manage.store.faq.FAQ_Topic', {
	extend : 'Ext.data.Store',
	model : 'manage.model.faq.FAQ_Topic',
	pageSize : 20,
	autoLoad : true,
	remoteSort : true,
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10070',
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});