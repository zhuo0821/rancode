Ext.define('manage.controller.SysConfig', {
			extend : 'Ext.app.Controller',
			refs : [{
						ref : 'sysConfigForm',
						selector : 'sysconfigform'
					}],
			views : ['sysconfig.SysConfigForm'],
			model : ['sysconfig.SysConfig'],
			openTab : function(app) {
				var tabPanel = app.getController('Menu').getTabPanel();
				var sysConfigPanel = tabPanel.child('sysconfigform');
				if (!sysConfigPanel) {
					var sysConfigPanel = Ext.widget('sysconfigform');
					tabPanel.add(sysConfigPanel);
					tabPanel.setActiveTab(sysConfigPanel);
				} else {
					tabPanel.setActiveTab(sysConfigPanel);
				}
			},
			init : function(app) {
				this.control({
							'sysconfigform button[action=submit]' : {
								click : this.updateSysConfig
							},
							'sysconfigform button[action=refresh]' : {
								click : this.loadData
							},
							'sysconfigform' : {
								beforerender : this.loadData
							}
						});
			},
			updateSysConfig : function(button) {
				var form = button.up('form').getForm();
				form.submit({
							waitMsg : '正在保存数据,请等待...',
							clientValidation : true,
							url : 'system.do',
							params : {
								action : 'update',
								funcId : '10061',
							},
							success : function(form, action) {
								top.Ext.Msg.alert('操作成功',
										action.result.msg == null
												? '修改成功'
												: action.result.msg);
							},
							failure : function(form, action) {
								switch (action.failureType) {
									case Ext.form.action.Action.CLIENT_INVALID :
										Ext.Msg.alert('操作失败',
												'所填数据不符合要求，请检查后提交');
										break;
									case Ext.form.action.Action.CONNECT_FAILURE :
										Ext.Msg.alert('操作失败', '提交失败，请检查网络');
										break;
									case Ext.form.action.Action.SERVER_INVALID :
										Ext.Msg.alert('操作失败',
												action.result.msg == null
														? '修改失败'
														: action.result.msg);
								}
							}
						});
			},
			loadData : function(cmp){
				var form = cmp;
				if(cmp.xtype == 'button')
					form = cmp.up('form');
				Ext.Ajax.request({
					url : 'system.do',
					params : {
						action : 'query',
						funcId : '10060'
					},
					success : function(res, opts) {
						var resp = Ext.decode(res.responseText);
						if (resp.totalCount > 0) {
							var data = resp.data;
							var reader = new Ext.data.reader.Json({
								model : 'manage.model.sysconfig.SysConfig'
							});
							var records = reader.readRecords(data);
							var record = records.records[0];
							form.getForm().loadRecord(record);
							form.down('button[action=submit]').setDisabled(false);
						} else {
							Ext.Msg.show({
								title : '错误提示',
								msg : resp.msg != null ? resp.msg : '网站信息读取失败,请点击重置按钮重新获取数据!',
								buttons : Ext.Msg.OK,
								icon : Ext.Msg.ERROR
							});
							form.down('button[action=submit]').setDisabled(true);
						}
					},
					failure : function(resp, opts) {
						Ext.Msg.show({
							title : '错误提示',
							msg : '网站信息读取失败,请点击重置按钮重新获取数据!',
							buttons : Ext.Msg.OK,
							icon : Ext.Msg.ERROR
						});
						form.down('button[action=submit]').setDisabled(true);
					}
				});
			}
		});
