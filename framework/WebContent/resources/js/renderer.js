function sexRender(v){
		if(v==0 || v== '0')
			return '男';
		else if(v==1 || v=='1')
			return '女';
		else
			return v;
};
function orderStatusRender(v){
	if(v==0 || v== '0')
		return '<span style="color:black;">作废</span>';
	else if(v==1 || v=='1')
		return '<span style="color:red;">下单</span>';
	else if(v==2 || v=='2')
		return '<span style="color:green;">确认</span>';
	else if(v==3 || v=='3')
		return '<span style="color:green;">出单</span>';
	else if(v==4 || v=='4')
		return '<span style="color:blue;">完成</span>';
	else
		return v;
};
function orderPayStatusRender(v){
	if(v==2 || v== '2')
		return '<span style="color:green;">已支付</span>';
	else if(v==1 || v=='1')
		return '<span style="color:red;">未支付</span>';
	else
		return v;
};
function orderPayTypeRender(v){
	if(v==0 || v== '0')
		return '<span style="color:green;">货到付款</span>';
	else if(v==1 || v=='1')
		return '<span style="color:red;">在线支付</span>';
	else
		return v;
};
function RMBMoney(v){  
    v = (Math.round((v-0)*100))/100;  
    v = (v == Math.floor(v)) ? v + ".00" : ((v*10 == Math.floor(v*10)) ? v + "0" : v);  
    v = String(v);  
    var ps = v.split('.');  
    var whole = ps[0];  
    var sub = ps[1] ? '.'+ ps[1] : '.00';  
    var r = /(\d+)(\d{3})/;  
    while (r.test(whole)) {  
        whole = whole.replace(r, '$1' + ',' + '$2');  
    }  
    v = whole + sub;  
    if(v.charAt(0) == '-'){  
        return '-￥' + v.substr(1);  
    }  
    return "￥" +  v;  
};
function YesOrNoRender(v){
	if(v==0 || v== '0')
		return '<span style="color:green;">否</span>';
	else if(v==1 || v=='1')
		return '<span style="color:red;">是</span>';
	else
		return v;
}
Date.prototype.Format = function(fmt) 
{ //author: meizz 
  var o = { 
    "M+" : this.getMonth()+1,                 //月份 
    "d+" : this.getDate(),                    //日 
    "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时  
    "H+" : this.getHours(),                   //小时 
    "m+" : this.getMinutes(),                 //分 
    "s+" : this.getSeconds(),                 //秒 
    "q+" : Math.floor((this.getMonth()+3)/3), //季度 
    "S"  : this.getMilliseconds()             //毫秒 
  }; 
  if(/(y+)/.test(fmt)) 
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length)); 
  for(var k in o) 
    if(new RegExp("("+ k +")").test(fmt)) 
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length))); 
  return fmt; 
};
var payTypeData = [
 			        {'NAME':'货到付款','ID':'0'},
 			        {'NAME':'在线支付','ID':'1'}
 			        ];
var payStatusData = [
			        {'NAME':'未支付','ID':'1'},
			        {'NAME':'已支付','ID':'2'}
			        ];
var orderStatusData = [
 			        {'NAME':'作废','ID':'0'},
 			        {'NAME':'下单','ID':'1'},
 			        {'NAME':'确认','ID':'2'},
			        {'NAME':'出单','ID':'3'},
			        {'NAME':'完成','ID':'4'}
 			        ];
var cancelReasonData = [
    			        {'NAME':'太忙','ID':'太忙'},
    			        {'NAME':'距离太远，超出送餐范围','ID':'距离太远，超出送餐范围'},
    			        {'NAME':'所定菜品不能制作','ID':'所定菜品不能制作'},
    			        {'NAME':'超出送餐时间','ID':'超出送餐时间'}
    			        ];

