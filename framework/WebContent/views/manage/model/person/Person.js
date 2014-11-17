Ext.define('manage.model.person.Person',{
	extend:'Ext.data.Model',
	fields:['ID','NAME',{name:'S_ID',type:'string'},{name:'E_ID',type:'string'},{name:'ROLE_ID',type:'string'},'ORG_NAME','ROLE_NAME','LOGINNAME','PASSWORD','CONPASSWORD']
});