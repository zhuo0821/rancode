Ext.define('manage.controller.PWD', {
			extend : 'Ext.app.Controller',
			refs : [{
						ref : 'changePwdForm',
						selector : 'changepwdform'
					}],
			views : ['ChangePwdForm'],
			openTab : function(app) {
				var tabPanel = app.getController('Menu').getTabPanel();
				var pwdPanel = tabPanel.child('changepwdform');
				if (!pwdPanel) {
					var pwdPanel = Ext.widget('changepwdform');
					tabPanel.add(pwdPanel);
					tabPanel.setActiveTab(pwdPanel);
				} else {
					tabPanel.setActiveTab(pwdPanel);
				}
			},
			init : function(app) {
				this.control({
							'changepwdform button[action=submit]' : {
								click : this.changePassWord
							}
						});
			},
			changePassWord : function(button) {
				var form = button.up('form').getForm();
				form.submit({
							waitMsg : '正在保存数据,请等待...',
							clientValidation : true,
							url : 'system.do',
							params : {
								action : 'changePwd'
							},
							success : function(form, action) {
								top.Ext.Msg.alert('操作成功',
										action.result.msg == null
												? '修改成功'
												: action.result.msg,
										function() {
											form.reset();
										});
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
														? '修改失败，原始密码错误'
														: action.result.msg);
								}
							}
						});
			}
		});
