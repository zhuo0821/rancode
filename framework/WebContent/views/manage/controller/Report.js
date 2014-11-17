Ext.define('manage.controller.Report', {
	extend : 'Ext.app.Controller',
	refs : [],
	views : [ 'report.ReportGrid', 'report.ReportQueryForm' ],
	stores : [ 'report.Report' ],
	models : [],
	openTab : function(app, title, name, fields, columns) {
		var tabPanel = app.getController('Menu').getTabPanel();
		var childPanel = tabPanel.child('panel[id=' + name + ']');
		if (!childPanel) {
			var childPanel = this
					.createChildPanel(title, name, fields, columns);
			tabPanel.add(childPanel);
			tabPanel.setActiveTab(childPanel);
		} else {
			tabPanel.setActiveTab(childPanel);
		}
	},
	init : function(app) {
		this.control({
			'reportgrid button[action=query]' : {
				click : this.query
			}
		});
	},
	createChildPanel : function(title, name, fields, columns) {
		var store = this.createStore(fields);
		return Ext.create('Ext.panel.Panel', {
			layout : 'border',
			title : title,
			id : name,
			closable : true,
			items : [ {
				xtype : 'reportqueryform'
			}, {
				xtype : 'reportgrid',
				store : store,
				columns : columns
			} ]
		});
	},
	createStore : function(fields) {
		return Ext.create('Ext.data.Store', {
			proxy : {
				type : 'ajax',
				url : 'system.do?action=getReportList',
				reader : {
					type : 'json',
					root : 'data',
					totalProperty : 'totalCount',
					successProperty : 'success'
				},
			},
			fields : fields
		});
	},
	query : function(button) {
		var grid = button.up('grid');
		var id = grid.up('panel').id;
		var form = grid.up('panel').down('form');
		form.form.findField('type').setValue(id);
		var params = form.getValues();
		var store = grid.getStore();
		store.on("beforeload",function(){
	        store.proxy.extraParams=params;  
	    });  
		store.loadPage(1);
	}
});
