Ext.define('manage.store.order.OrderDetail', {
	extend : 'Ext.data.Store',
	model : 'manage.model.order.OrderDetail',
	pageSize : 20,
	remoteSort : true,
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10091',
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});