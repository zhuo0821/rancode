Ext.Loader.setConfig({
	enabled : true
});
var application = Ext.application({
	name : 'manage',
	appFolder : 'views/manage',
	autoCreateViewport : true,
	controllers : [ 'Menu' ]
});
