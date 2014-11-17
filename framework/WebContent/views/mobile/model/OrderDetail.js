Ext.define('mobile.model.OrderDetail', {
	extend : 'Ext.data.Model',
	config : {
		fields : [ {
			name : 'id',
			type : 'string'
		}, {
			name : 'p_id',
			type : 'string'
		}, 'name', 'price', 'number', 'amount', {
			name : 'o_id',
			type : 'string'
		} ]
	},
});