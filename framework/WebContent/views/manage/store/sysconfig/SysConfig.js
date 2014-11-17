Ext.define('manage.store.sysconfig.SysConfig', {
	extend : 'Ext.data.Store',
	model : 'manage.model.sysconfig.SysConfig',
	proxy : {
		type : 'ajax',
		url : 'system.do?action=query&funcId=10060',
		reader : {
			type : 'json',
			root : 'data',
			totalProperty : 'totalCount',
			successProperty : 'success'
		}
	}
});