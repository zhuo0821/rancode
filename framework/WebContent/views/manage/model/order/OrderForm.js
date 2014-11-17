Ext.define('manage.model.order.OrderForm',{
	extend:'Ext.data.Model',
	fields:[{name:'id',type:'string'},{name:'number',type:'string'},'s_id','s_name',{name:'d_id',type:'string'},'d_name','a_id','address','phone','m_id','username',{name:'status',type:'string'},{name:'pay_status',type:'string'},'time',{name:'pay_type',type:'string'},'allcharge']
});