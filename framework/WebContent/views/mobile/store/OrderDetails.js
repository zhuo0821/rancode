Ext.define('mobile.store.OrderDetails', {
	extend : 'Ext.data.Store',
	config : {
		model : 'mobile.model.OrderDetail',
		proxy : {
			type : 'ajax',
			url : 'system.do?action=query&funcId=10091',
			reader : {
				type : 'json',
				rootProperty : 'data',
				totalProperty : 'totalCount',
				successProperty : 'success'
			}
		}
	}
});