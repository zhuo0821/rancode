Ext.define('manage.store.article.Article', {
	extend : 'Ext.data.Store',
	model : 'manage.model.article.Article',
	pageSize : 20,
	autoLoad : true,
	remoteSort : true,
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10000',
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});