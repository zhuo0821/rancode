Ext.define('manage.view.advertisement.AdvertisementForm',
{
	extend : 'Ext.form.Panel',
	alias : 'widget.advertisementform',
	layout : {
		columns : 3,
		type : 'table'
	},
	bodyPadding : 10,
	header : false,
	buttonAlign : 'center',
	border : false,
	initComponent : function() {
		var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
		var me = this;
		Ext.applyIf(me, {
			items : [ {
				xtype : 'textfield',
				colspan : 2,
				fieldLabel : '图片位置',
				name : 'location',
				readOnly : true,
				value : '大图'
			}, {
				xtype : 'fieldcontainer',
				rowspan : 4,
				fieldLabel : '图片预览',
				labelWidth : 60,
				items : [{
					xtype : 'box',
					id : 'browseImage',
					autoEl : {
						width : 100,
						height : 100,
						tag : 'img',
						// type : 'image',
						src : Ext.BLANK_IMAGE_URL,
						style : 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale);',
						complete : 'off',
						id : 'imageBrowse'
					}
				}]
			}, {
				xtype : 'textfield',
				fieldLabel : '广告图片',
				name : 'pic',
				afterLabelTextTpl : required,
				emptyText : '必须填写广告图片',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'button',
				action : 'upload',
				text : '浏览'
			}, {
				xtype : 'textfield',
				fieldLabel : '广告链接',
				colspan : 2,
				name : 'url',
				afterLabelTextTpl : required,
				emptyText : '必须填写广告链接',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'textfield',
				colspan : 2,
				fieldLabel : '广告说明',
				name : 'description'
			}, {
				xtype : 'textfield',
				hidden : true,
				fieldLabel : 'id',
				name : 'id'
			} ],
			buttons : [ {
				text : '确定',
				action : 'submit'
			}, {
				text : '重置',
				handler : function() {
					this.up('form').getForm().reset();
				}
			} ]
		});

		me.callParent(arguments);
	}

});