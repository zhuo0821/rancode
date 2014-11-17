Ext.define('manage.view.South', {
			extend : 'Ext.Toolbar',
			alias : 'widget.bottombar',
			initComponent : function() {
				Ext.apply(this, {
							id : "bottom",
							// frame:true,
							border : false,
							region : "south",
							height : 35,
							items : [{
										xtype : 'button',
										text : '注销',
										action : 'logout',
										iconCls : 'close'
									},'-', "当前用户：" + session.userName, '-',
									Ext.Date.format(new Date(), 'Y年m月d日'),
									'->', "技术支持:&nbsp;&nbsp;"]
						});
				this.callParent(arguments);
			}
		});
