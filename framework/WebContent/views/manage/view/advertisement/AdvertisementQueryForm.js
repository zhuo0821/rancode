Ext.define('manage.view.advertisement.AdvertisementQueryForm', {
			extend : 'Ext.form.Panel',
			alias : 'widget.advertisementqueryform',
			layout : {
				columns : 1,
				type : 'table'
			},
			bodyPadding : 10,
			header : false,
			region : 'north',
			initComponent : function() {
				var me = this;
				var location = Ext.create('Ext.data.Store', {
				    fields: ['value'],
				    data : [
				        {"value":"长图"},
				        {"value":"小图"},
				        {"value":"大图"}
				    ]
				});

				Ext.applyIf(me, {
							items : [{
										xtype : 'combo',
										store: location,
									    queryMode: 'local',
									    displayField: 'value',
									    valueField: 'value',
									    name : 'location',
										fieldLabel : '广告位置'
									}]
						});

				me.callParent(arguments);
			}

		});