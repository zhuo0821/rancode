Ext.define('manage.view.ComboBox', {
			extend : 'Ext.form.field.ComboBox',
			alias : 'widget.mycombo',
			queryMode : 'remote',
			displayField : 'NAME', 
			valueField : 'ID', 
			emptyText : '请选择', 
			initComponent : function() {
				var me = this;
				me.callParent(arguments);
			}

		});