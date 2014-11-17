Ext.define('manage.model.product.Product',{
	extend:'Ext.data.Model',
	fields:['id','name',{name:'p_id',type:'string'},'p_name',{name:'c_id',type:'string'},'c_name',{name:'s_id',type:'string'},'s_name','price','amount','sales_volume','made_time',
	        {name:'discount_flag',type:'int'},'discount','add_time','pic']
});