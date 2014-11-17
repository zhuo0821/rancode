<html>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>${cache.siteName}-后台管理</title>
<script type="text/javascript" src="${cache.webRoot}/plugins/ext/ext-all-debug.js"></script>
<script type="text/javascript" src="${cache.webRoot}/plugins/jquery/jquery-1.9.1.min.js"></script>
<script type="text/javascript">
$(function(){         
    $('#kaptchaImage').click(function () {//生成验证码  
     $(this).hide().attr('src', './kaptcha/getKaptchaImage.do?' + Math.floor(Math.random()*100) ).fadeIn();  
    });  
});   
function changeCode() {  
    $('#kaptchaImage').hide().attr('src', './kaptcha/getKaptchaImage.do?' + Math.floor(Math.random()*100) ).fadeIn();  
}  
	function keyPress(evt) {
		evt = (evt) ? evt : ((window.event) ? window.event : "");
		if (evt.keyCode == '13') {
			doLogin();
			return false;
		}
		return true;
	}
	Ext.Ajax.timeout = 1800000;
	Ext.data.proxy.Ajax.timeout = 1800000;
	function doLogin() {
	 
		var msg = Ext.getDom('showmsg');
		var username = Ext.getDom('username').value;
		var password = Ext.getDom('password').value;
		var ckCookie = Ext.getDom('ckCookie').checked;
		var kaptcha  =  Ext.getDom('kaptcha').value;
		msg.innerHTML = '';
		if (username == "") {
			msg.innerHTML = '用户名不能为空！';
			Ext.getDom('username').focus();
		} else if (password == "") {
			msg.innerHTML = '密码不能为空！';
			Ext.getDom('password').focus();
		} else if (kaptcha == "") {
			msg.innerHTML = '验证码不能为空！';
			Ext.getDom('kaptcha').focus();
		} else {
			msg.innerHTML = '登陆中，请稍候……';
			Ext.Ajax.request({
				url : 'login.do',
				params : {
					loginName : username,
					password : password,
					ckCookie : ckCookie,
					kaptcha : kaptcha
				},
				success : function(result, request) {
					var obj = Ext.decode(result.responseText);
					if (obj.success == true) {
						msg.color = 'blue';
						msg.innerHTML = '登录成功！';
						if(obj.roleId == '2')
							window.location.href = '${cache.webRoot}/mobile.jspx';
						else
							window.location.href = '${cache.webRoot}/manage.jspx';
					} else {
						msg.innerHTML = obj.errors.errorString;
						Ext.getDom('password').focus();
					}
				},
				failed : function(request) {
					msg.innerHTML = '访问服务器失败！';
				}
			});
		}
	}

	function reset() {
		Ext.getDom('username').value = null;
		Ext.getDom('password').value = null;
		Ext.getDom('username').focus();
	}
	/*
	 * 是否有cookies信息
	 */
	function loadCookies() {
		Ext.getDom('username').focus();
		var acookie = document.cookie.split(";");
		var defaultCookie = false;
		for ( var i = 0; i < acookie.length; i++) {
			var arr = acookie[i].split("=");
			if (arr[0].trim() == 'username' && arr[1].trim() != 'noBoss') {
				Ext.getDom('username').value = unescape(arr[1]);
				defaultCookie = true;
			}
			if (arr[0].trim() == 'password' && arr[1].trim() != 'noBoss') {
				Ext.getDom('password').value = unescape(arr[1]);
				defaultCookie = true;
			}
		}
		if (defaultCookie)
			Ext.getDom('ckCookie').checked = true;
	}
</script>

<style type="text/css">
.form-west-east {
	background-image: url('resources/images/login/bg_side.jpg');
}

.form-center {
	width: 800px;
	height: 435px;
	border-collapse: collapse;
	font-size: 11pt;
	font-family: 宋体;
	background-image: url('resources/images/login/bg_center.jpg');
}

.form-north {
	background-color: #D3D5E4;
}

.form-south {
	background-color: #edeffe;
}

.pt9 {
	font-size: 6pt;
	color:
	text-decoration: none;
}
.pt9 a:link {
	font-size: 6pt;
	color: #000000;
	text-decoration: none;
}
.pt9 a:visited {
	font-size: 6pt;
	color: #000000;
	text-decoration: none;
}
.pt9 a:hover {
	font-size: 6pt;
	color: #ff0000;
	text-decoration: underline;
}
.pt9 a:active {
	font-size: 6pt;
	color: #000000;
	text-decoration: none;
}
</style>
<body style="overflow-x: hidden; overflow-y: hidden; margin: 0px"
	onmouseover="self.status='登录';return true" onload='loadCookies()'>
	<center>

		<table style="width: 100%; height: 100%; border-collapse: collapse"
			cellpadding="0">
			<tr>
				<td colspan="3" class="form-north"></td>
			</tr>
			<tr>
				<td class="form-west-east"></td>
				<td style="width: 800px; height: 435px">
					<table class="form-center" cellpadding="0" cellspacing="0">
						<tr>
							<td colspan="3" style="height: 220px"></td>
						</tr>
						<tr valign="top">
							<td style="width: 220px; height: 30px"></td>
							<td style="width: 212px;"></td>
							<td><span>用户名：</span> <input
								style="border: 1px solid #3e73b7; width: 150px;" type="text"
								id="username" name="username" value="" maxlength="20"
								onKeyPress="keyPress(event);"></td>
						</tr>
						<tr valign="top">
							<td style="height: 30px"></td>
							<td></td>
							<td><span>密&nbsp;&nbsp;码：</span> <input
								style="border: 1px solid #3e73b7; width: 150px;" type="password"
								id="password" name="password" value="" maxlength="20"
								onKeyPress="keyPress(event);"></td>
						</tr>
						<tr valign="top">
							<td style="height: 30px"></td>
							<td></td>
							<td><span>验证码：</span> <input
								style="border: 1px solid #3e73b7; width: 60px;" type="text"
								id="kaptcha" name="kaptcha" value="" maxlength="4"
								onKeyPress="keyPress(event);">
								<img src="${cache.webRoot}/kaptcha/getKaptchaImage.do" id="kaptchaImage" style=" position: relative; top: 5px;"/>  
								<a href="javascript:void(0)" onclick="changeCode()"  class="pt9">看不清?换一张</a>
								</td>
								
						</tr>
						<tr valign="top">
							<td colspan="2">&nbsp;</td>
							<td style="height: 20px;padding-left: 35px;"><img border="0"
								src="resources/images/login/button1.jpg"
								onMouseOut="src='resources/images/login/button1.jpg'"
								onMouseOver="src='resources/images/login/button1b.jpg'"
								onClick="doLogin();return false;" width="52" height="22">&nbsp;&nbsp;&nbsp;
								<img border="0" src="resources/images/login/button2.jpg"
								onMouseOut="src='resources/images/login/button2.jpg'"
								onMouseOver="src='resources/images/login/button2b.jpg'"
								onClick="reset()" width="52" height="22" />
						</tr>
						<tr>
							<td colspan="2"></td>
							<td style="height: 20px;"><input type="checkbox" name="ckCookie" id='ckCookie'><font
								color="#f50424">是否保存登录信息&nbsp;&nbsp;&nbsp;&nbsp;</font></td>
						</tr>
						<tr valign="top">
							<td colspan="2"></td>
							<td><font id="showmsg" color="red"></font></td>
						</tr>
						<tr>
							<td colspan="3"></td>
						</tr>
					</table>
				</td>
				<td class="form-west-east"></td>
			</tr>
			<tr>
				<td colspan="3" class="form-south"></td>
			</tr>
		</table>
	</center>
</body>
</html>