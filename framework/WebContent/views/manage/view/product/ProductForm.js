Ext.define('manage.view.product.ProductForm',
{
	extend : 'Ext.form.Panel',
	requires : [ 'manage.store.Org', 'manage.store.Varieties' ],
	alias : 'widget.productform',
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
				xtype : 'mycombo',
				id : 's_id',
				store : Ext.create('manage.store.Org'),
				queryMode : 'local',
				colspan : 2,
				fieldLabel : '所属分店',
				name : 's_id',
				editable : false,
				disabled : session.role=='0'?false:true,
				value : session.role=='0'?'':session.sId,
				afterLabelTextTpl : required,
				emptyText : '必须填写分店',
				blankText : '此项为必填项',
				allowBlank : false
			},{
				xtype : 'hidden',
				name : 's_id',
				disabled : session.role=='0'?true:false,
				value : session.role=='0'?'':session.sId
			}, {
				xtype : 'fieldcontainer',
				rowspan : 5,
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
				name : 'p_id',
				editable : false,
				colspan : 2,
				afterLabelTextTpl : required,
				emptyText : '必须填写种类',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'mycombo',
				store : Ext.create('manage.store.Varieties',{autoLoad : false}),
				queryMode : 'local',
				editable : false,
				fieldLabel : '子类名称',
				objectName : 'c_id',
				colspan : 2,
				name : 'c_id',
				afterLabelTextTpl : required,
				emptyText : '必须填写子类',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'textfield',
				fieldLabel : '菜品名称',
				name : 'name',
				colspan : 2,
				afterLabelTextTpl : required,
				emptyText : '必须填写名称',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'textfield',
				fieldLabel : '菜品图片',
				name : 'pic',
				afterLabelTextTpl : required,
				emptyText : '必须填写图片',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'button',
				action : 'upload',
				text : '浏览'
			}, {
				xtype : 'numberfield',
				fieldLabel : '价格',
				colspan : 2,
				minValue: 0,
				value : 0,
				step : 0.01,
				allowDecimals: true, // 允许小数点
				allowNegative: false, // 允许负数
				name : 'price',
				afterLabelTextTpl : required,
				emptyText : '必须填写价格',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'numberfield',
				fieldLabel : '制作时间(分钟)',
				name : 'made_time',
				minValue: 0,
				value : 0,
				step : 1,
				allowDecimals: false, // 允许小数点
				allowNegative: false, // 允许负数
				afterLabelTextTpl : required,
				emptyText : '必须填写制作时间',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'textfield',
				hidden : true,
				fieldLabel : 'id',
				name : 'id'
			}, {
				xtype : 'numberfield',
				fieldLabel : '可做量',
				colspan : 2,
				name : 'amount',
				afterLabelTextTpl : required,
				emptyText : '必须填写可做量',
				blankText : '此项为必填项',
				minValue: 0,
				value : 0,
				allowDecimals: false, // 允许小数点
				allowNegative: false, // 允许负数
				allowBlank : false
			}, {
				xtype : 'numberfield',
				fieldLabel : '销售量',
				name : 'sales_volume',
				minValue: 0,
				value : 0,
				allowDecimals: false, // 允许小数点
				allowNegative: false, // 允许负数
			}, {
			    xtype: 'radiogroup',
		        fieldLabel: '是否折扣',
		        colspan : 2,
		        columns: 2,
		        vertical: true,
		        items: [
		            { boxLabel: '是', name: 'discount_flag', inputValue: 1},
		            { boxLabel: '否', name: 'discount_flag', inputValue: 0, checked: true }
		        ],
				afterLabelTextTpl : required,
				emptyText : '必须填写折扣标志',
				blankText : '此项为必填项',
				allowBlank : false
			}, {
				xtype : 'numberfield',
				fieldLabel : '折扣比例',
				name : 'discount',
				minValue: 0,
				maxValue : 1,
				value : 1,
				allowDecimals: true, // 允许小数点
				allowNegative: false, // 允许负数
				step : 0.05
			}],
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