Ext.define('manage.controller.Menu', {
			extend : 'Ext.app.Controller',
			// requires : 'manage.store.Menu',
			refs : [{
						ref : 'manageMenu',
						selector : 'managemenu'
					}, {
						ref : 'tabPanel',
						selector : 'tabpanel'
					}, {
						ref : 'bottombar',
						selector : 'bottomBar'
					}],
			init : function() {
				this.control({
							'managemenu' : {
								beforerender : this.loadList,
								itemmousedown : this.loadTab
							},
							'bottombar button[action=logout]' : {
								click : this.logout
							}
						});
			},
			openTab : function(panel, id) {
				var o = (typeof panel == "string" ? panel : id || panel.id);
				var main = Ext.getCmp("content-panel");
				var tab = main.getComponent(o);
				if (tab) {
					main.setActiveTab(tab);
				} else if (typeof panel != "string") {
					panel.id = o;
					var p = main.add(panel);
					main.setActiveTab(p);
				}
			},
			loadTab : function(selModel, record) {
				var me = this;
				if (record.get('leaf')) {
					Ext.require(
							'manage.controller.' + record.get('controller'),
							function() {
								var controller = this.application
										.getController(record.get('controller'));
								controller.openTab(me,record.get('title'),record.get('name'),Ext.JSON.decode(record.get('fields')),Ext.JSON.decode(record.get('columns')));
							}, me);
				}
			},
			loadList : function() {
				Ext.getBody().mask('正在加载系统菜单....');
				Ext.Ajax.request({
					url : 'system.do', // 请求地址
					params : {
						action : 'getMenu',
						id : 'root',
						role : session.role
					}, // 请求参数
					method : 'post', // 方法
					callback : this.addTree,
					scope : this
						// 调用回调函数
					});

			},
			addTree : function(options, success, response) {
				data = Ext.JSON.decode(response.responseText);
				var createStore = function(id) { // 创建树面板数据源

					return Ext.create("manage.store.Menu", {
								defaultRootId : id, // 默认的根节点id
								clearOnLoad : true,
								nodeParam : "id",
								filters: [
								          {property:"role",value:session.role}
								      ]
							});
				};
				var menu = this.getManageMenu();
				for (var i = 0; i < data.length; i++) {
					var treePanel = Ext.create("Ext.tree.Panel", {
								title : data[i].text,
								iconCls : data[i].iconCls,
								// useArrows: true,
								autoScroll : true,
								rootVisible : false,
								viewConfig : {
									loadingText : "正在加载..."
								},
								store : createStore(data[i].id),
								listeners : {
									itemclick : this.loadTab,
									scope : this
								}
							});
					menu.add(treePanel);
					menu.doLayout();

				}
				Ext.getBody().unmask();
			},
			logout : function(button) {
				Ext.MessageBox.confirm('提示', '您是否确定要退出后台管理系统？', function(btn) {
							if (btn == 'yes') {
								var me = self;
								Ext.Ajax.request({
											url : 'logout.do',
											success : function() {
												top.location
														.replace('admin.jspx');
												me.opener = null;
												me.close();
											}
										});

							}
						});
			}
		});
