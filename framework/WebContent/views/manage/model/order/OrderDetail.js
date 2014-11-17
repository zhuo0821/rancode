Ext.define('manage.model.order.OrderDetail',{
	extend:'Ext.data.Model',
	fields:[{name:'id',type:'string'},{name:'p_id',type:'string'},'name','price','number','amount',{name:'o_id',type:'string'}]
});