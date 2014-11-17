Ext.define('manage.view.person.PersonQueryForm', {
			extend : 'Ext.form.Panel',
			requires : ['manage.store.Org','manage.store.Role'],
			alias : 'widget.personqueryform',
			layout : {
				columns : 3,
				type : 'table'
			},
			bodyPadding : 10,
			header : false,
			region : 'north',
			initComponent : function() {
				var me = this;

				Ext.applyIf(me, {
							items : [{
										xtype : 'textfield',
										name : 'USER.NAME',
										fieldLabel : '帐号名称'
									}, {
										xtype : 'mycombo',
										store : Ext
												.create('manage.store.Org'),
										queryMode : 'local',
										name : 'USER.S_ID',
										fieldLabel : '所属分店'
									}, {
										xtype : 'mycombo',
										store : Ext
												.create('manage.store.Role'),
										queryMode : 'local',
										name : 'USER.ROLE_ID',
										fieldLabel : '帐号角色'
									}]
						});

				me.callParent(arguments);
			}

		});