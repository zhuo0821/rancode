Ext.define('manage.view.varieties.VarietiesGrid', {
	extend : 'Ext.tree.Panel',
	alias : 'widget.varietiesgrid',
	useArrows : true,
	rootVisible : false,
	layout : 'border',
	store : 'varieties.Varieties',
	multiSelect : false,
	singleExpand : false,
	region : 'center',
	// the 'columns' property is now 'headers'
	columns : [ {
		xtype : 'treecolumn', // this is so we
		// know which column
		// will show the
		// tree
		text : '分类名称',
		flex : 2,
		menuDisabled : true,
		dataIndex : 'name'
	}, {

		text : '编辑',
		menuDisabled : true,
		xtype : 'actioncolumn',
		tooltip : '编辑',
		action : 'edit',
		align : 'center',
		icon : 'resources/images/edit.png'
	}, {

		text : '增加下级',
		menuDisabled : true,
		xtype : 'actioncolumn',
		tooltip : '增加下级',
		action : 'insert',
		align : 'center',
		icon : 'resources/images/add.png',
		isDisabled : function(view, rowIdx, colIdx, item, record) {
			if(record.data.parentId == 'root')
				return false;
			else 
				return true;
		}
	}, {
		text : '删除',
		menuDisabled : true,
		xtype : 'actioncolumn',
		tooltip : '删除',
		action : 'delete',
		align : 'center',
		icon : 'resources/images/remove.png'
	} ],
	tbar : [ {
		text : '新增一级分类',
		action : 'addFirstLevel',
		icon : 'resources/images/add.png'
	}, {
		text : '刷新',
		icon : 'resources/images/refresh.png',
		listeners : {
			'click' : function() {
				this.up('panel').getStore().load();
			}
		}
	}, {
		icon : 'resources/images/expand-all.gif',
		tooltip : '全部展开',
		listeners : {
			click : function() {
				this.up('panel').expandAll();
			}
		}
	}, {
		icon : 'resources/images/collapse-all.gif',
		tooltip : '全部收起',
		listeners : {
			click : function() {
				this.up('panel').collapseAll();
			}
		}
	}]
});