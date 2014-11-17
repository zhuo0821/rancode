Ext.define('manage.view.product.ProductQueryForm', {
	extend : 'Ext.form.Panel',
	requires : [ 'manage.store.Org' ],
	alias : 'widget.productqueryform',
	layout : {
		columns : 4,
		type : 'table'
	},
	bodyPadding : 10,
	header : false,
	region : 'north',
	initComponent : function() {
		var me = this;

		Ext.applyIf(me, {
			items : [ {
				xtype : 'mycombo',
				store : Ext.create('manage.store.Org'),
				queryMode : 'local',
				name : 't.s_id',
				hidden : session.role=='0'?false:true,
				fieldLabel : '所属分店'
			},{
				xtype : 'mycombo',
				fieldLabel : '种类名称',
				store : Ext.create('manage.store.Varieties',{proxy : {
					type : 'ajax',
					url : 'system.do?action=query&funcId=10108&node=root',
					reader : {
						type : 'json',
						root : 'data',
						successProperty : 'success'
					}
				}}),
				queryMode : 'local',
				name : 't.p_id'
			}, {
				xtype : 'mycombo',
				store : Ext.create('manage.store.Varieties',{autoLoad : false}),
				queryMode : 'local',
				fieldLabel : '子类名称',
				objectName : 'c_id',
				name : 't.c_id'
			},{
				xtype : 'textfield',
				name : 't.name',
				fieldLabel : '菜品名称'
			} ]
		});

		me.callParent(arguments);
	}

});