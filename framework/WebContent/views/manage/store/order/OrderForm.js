Ext.define('manage.store.order.OrderForm', {
	extend : 'Ext.data.Store',
	model : 'manage.model.order.OrderForm',
	pageSize : 20,
	autoLoad : true,
	remoteSort : true,
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10090&o.s_id='+(session.role=='0'?'':session.sId),
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});