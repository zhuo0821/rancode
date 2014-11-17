Ext.define('mobile.store.OrderForms', {
	extend : 'Ext.data.Store',

	config : {
		model : 'mobile.model.OrderForm',
		autoLoad : true,
		proxy : {
			type : 'ajax',
			url : 'system.do?action=query&funcId=10095&o.d_id='+session.userId,
			reader : {
				type : 'json',
				totalProperty : 'totalCount',
				rootProperty : 'data'
			}
		}
	}
});
