Ext.define('manage.store.product.Product', {
	extend : 'Ext.data.Store',
	model : 'manage.model.product.Product',
	pageSize : 20,
	autoLoad : true,
	remoteSort : true,
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10050&t.s_id='+(session.role=='0'?'':session.sId),
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});