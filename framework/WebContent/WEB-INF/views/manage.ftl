<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>后台管理</title>
<link rel="stylesheet" type="text/css"
	href="plugins/ext/resources/css/ext-all.css" />
<link rel="stylesheet" type="text/css" href="resources/css/icons.css" />
<script type="text/javascript" src="plugins/ext/ext-all-debug.js"></script>
<script type="text/javascript"
	src="plugins/ext/locale/ext-lang-zh_CN.js"></script>
<script type="text/javascript" src="views/manage/manage.js"></script>
<script language="javascript" src="resources/js/LodopFuncs.js"></script>
<script type="text/javascript" src="plugins/dwr/engine.js"></script>
<script type="text/javascript" src="plugins/dwr/util.js"></script>
<script type="text/javascript" src="plugins/dwr/interface/DwrBind.js"></script>
<script type="text/javascript" src="resources/js/renderer.js"></script>
<object id="LODOP_OB"
	classid="clsid:2105C259-1E0C-4534-8141-A753534CB4CA" width=0 height=0>
	<embed id="LODOP_EM" type="application/x-print-lodop" width=0 height=0></embed>
</object>
<script type="text/javascript">
Ext.Ajax.on('requestexception',function(conn,response,options) {  
    if(response.status == '999'){       
        Ext.Msg.alert('提示', '您长时间未使用系统，已经自动退出，请重新登录!', function(btn, text){     
            if (btn == 'ok'){     
                window.location = '${cache.webRoot}/admin.jspx';     
            }     
        });     
     }       
}); 
	//Ext.BLANK_IMAGE_URL = 'js/ext/resources/images/default/s.gif';
	Ext.QuickTips.init();
	var session = {
		userId : '${userInfo.userId}', 
		userName : '${userInfo.userName}',
		role : '${userInfo.roleId}',
		sId : '${userInfo.orgId}'
	};

	function dwrBind() {
		DwrBind.onPageLoad(session.userId);
	}
	function testDwr(message) {
		alert(message);
	}
	function play(){
	var notice = document.getElementById('notice');
	notice.play();
	};
	/* 
	function showMessage(autoMessage) {
		var res = Ext.decode(autoMessage);
		var data = res;
		var reader = new Ext.data.reader.Json({
			model : 'manage.model.game.Grade'
		});
		var records = reader.readRecords(data);
		var record = records.records[0];
		if (!Ext.getCmp('replaceGradeForm')) {
			Ext.create('Ext.window.Window', {
				title : '修改分数',
				resizable : false,
				id : 'replaceGradeForm',
				modal : true,
				layout : 'fit',
				items : [ {
					xtype : 'gradeform'
				} ],
				autoShow : true
			});
		} else {
			Ext.getCmp('replaceGradeForm').show();
		}
		var formWin = Ext.getCmp('replaceGradeForm');
		formWin.down('form').loadRecord(record);
	} */
	function reLogin() {
		Ext.Ajax.request({
			url : 'logout.do'
		});
		top.location.replace('${cache.webRoot}/admin.jspx');
	}
	//定时检查登录是否超时
	function loginTimeout() {
		loginTime = loginTime - 30;
		setTimeout("loginTimeout()", 1000 * 30);//每30秒检查一次
		if (loginTime == 0)
			reLogin();
	}
</script>

</head>
<body onload="dwr.engine.setActiveReverseAjax(true);dwr.engine.setNotifyServerOnPageUnload(true);dwrBind();">
<audio id="notice" hidden="true">
  <source src="resources/notice.ogg" type="audio/ogg">
  <source src="resources/notice.mp3" type="audio/mpeg">
Your browser does not support the audio tag.
</audio>
</body>
</html>