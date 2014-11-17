Ext.define('manage.view.article.ArticleQueryForm', {
			extend : 'Ext.form.Panel',
			requires : ['manage.store.article.Topic'],
			alias : 'widget.articlequeryform',
			layout : {
				columns : 1,
				type : 'table'
			},
			bodyPadding : 10,
			header : false,
			region : 'north',
			initComponent : function() {
				var me = this;

				Ext.applyIf(me, {
							items : [{
										xtype : 'mycombo',
										store : Ext
												.create('manage.store.article.Topic'),
										queryMode : 'local',
										name : 'a.t_id',
										fieldLabel : '文章分类'
									}]
						});

				me.callParent(arguments);
			}

		});