Ext.define('mobile.view.order.OrderFormList', {
    extend: 'Ext.List',
    xtype: 'orderformlist',
    requires: ['Ext.plugin.ListPaging'],
    config: {
        title: '未送订单',
        plugins: [{
        	xclass: 'Ext.plugin.PullRefresh',
        	pullRefreshText: '下拉可以更新',
        	releaseRefreshText: '松开开始更新',
        	loadingText: '正在刷新……',
        	pullTpl: [
        	            '<div class="x-list-pullrefresh">',
        	                '<div class="x-list-pullrefresh-arrow"></div>',
        	                '<div class="x-loading-spinner">',
        	                    '<span class="x-loading-top"></span>',
        	                    '<span class="x-loading-right"></span>',
        	                    '<span class="x-loading-bottom"></span>',
        	                    '<span class="x-loading-left"></span>',
        	                '</div>',
        	                '<div class="x-list-pullrefresh-wrap">',
        	                    '<h3 class="x-list-pullrefresh-message">{message}</h3>',
        	                    '<div class="x-list-pullrefresh-updated">最后更新: <span>{lastUpdated:date("Y-m-d H:i:s")}</span></div>',
        	                '</div>',
        	            '</div>'
        	        ].join(''),
        	refreshFn: function (loaded, arguments) {
        		loaded.getList().getStore().loadPage(1, {
        			callback: function (record, operation, success) { Ext.Viewport.unmask(); }, scope: this });
        		}
        	},{
        	 xclass: 'Ext.plugin.ListPaging',
        	 autoPaging: true,
        	 loadMoreText : '加载更多',
        	 noMoreRecordsText : '没有更多'
        }],
        store: 'OrderForms',
        itemTpl: [
                  '<div style=" padding-top: 0; font-size: 22px; font-weight: bold">{number}(￥{allcharge}元)<span style="display: block; font-size: 14px;font-weight: normal;color: #666">{address}({phone})</span></div>',
        ].join('')
    }
});
