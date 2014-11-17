Ext.define('manage.model.Menu', {
	extend : 'Ext.data.Model',
	fields : [ 'id', 'text', 'iconCls', 'leaf', 'controller','role','title','name','fields','columns'],
	root : {
		expanded : true
	},
	proxy : {
		type : 'ajax',
		url : 'system.do?action=getMenu'
	}
});
