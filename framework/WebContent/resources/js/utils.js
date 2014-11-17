var Browser = new Object();
Browser.isMozilla = (typeof document.implementation != 'undefined')
		&& (typeof document.implementation.createDocument != 'undefined')
		&& (typeof HTMLDocument != 'undefined');
Browser.isIE = window.ActiveXObject ? true : false;
Browser.isFirefox = (navigator.userAgent.toLowerCase().indexOf("firefox") != -1);
Browser.isSafari = (navigator.userAgent.toLowerCase().indexOf("safari") != -1);
Browser.isOpera = (navigator.userAgent.toLowerCase().indexOf("opera") != -1);
var Utils = new Object();
Utils.htmlEncode = function(text) {
	return text.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g,
			'&lt;').replace(/>/g, '&gt;');
};
Utils.trim = function(text) {
	if (typeof (text) == "string") {
		return text.replace(/^\s*|\s*$/g, "");
	} else {
		return text;
	}
};
Utils.isEmpty = function(val) {
	switch (typeof (val)) {
	case 'string':
		return Utils.trim(val).length == 0 ? true : false;
		break;
	case 'number':
		return val == 0;
		break;
	case 'object':
		return val == null;
		break;
	case 'array':
		return val.length == 0;
		break;
	default:
		return true;
	}
};
Utils.isNumber = function(val) {
	var reg = /^[\d|\.|,]+$/;
	return reg.test(val);
};
Utils.isInt = function(val) {
	if (val == "") {
		return false;
	}
	var reg = /\D+/;
	return !reg.test(val);
};
Utils.isEmail = function(email) {
	var reg1 = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/;
	return reg1.test(email);
};
Utils.isTel = function(tel) {
	var reg = /^[\d|\-|\s|\_]+$/; // 只允许使用数字-空格等
	return reg.test(tel);
};
Utils.fixEvent = function(e) {
	var evt = (typeof e == "undefined") ? window.event : e;
	return evt;
};
Utils.srcElement = function(e) {
	if (typeof e == "undefined")
		e = window.event;
	var src = document.all ? e.srcElement : e.target;
	return src;
};
Utils.isTime = function(val) {
	var reg = /^\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}$/;
	return reg.test(val);
};
Utils.x = function(e) { // 当前鼠标X坐标
	return Browser.isIE ? event.x + document.documentElement.scrollLeft - 2
			: e.pageX;
};
Utils.y = function(e) { // 当前鼠标Y坐标
	return Browser.isIE ? event.y + document.documentElement.scrollTop - 2
			: e.pageY;
};
Utils.request = function(url, item) {
	var sValue = url.match(new RegExp("[\?\&]" + item + "=([^\&]*)(\&?)", "i"));
	return sValue ? sValue[1] : sValue;
};
Utils.$ = function(name) {
	return document.getElementById(name);
};
function rowindex(tr) {
	if (Browser.isIE) {
		return tr.rowIndex;
	} else {
		table = tr.parentNode.parentNode;
		for (i = 0; i < table.rows.length; i++) {
			if (table.rows[i] == tr) {
				return i;
			}
		}
	}
};
document.getCookie = function(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

	if (arr = document.cookie.match(reg))

		return unescape(arr[2]);
	else
		return null;
};
document.setCookie = function(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires="
			+ exp.toGMTString();
}
document.removeCookie = function(sName, sValue) {
	document.cookie = sName + "=; expires=Fri, 31 Dec 1999 23:59:59 GMT;";
};
function getPosition(o) {
	var t = o.offsetTop;
	var l = o.offsetLeft;
	while (o = o.offsetParent) {
		t += o.offsetTop;
		l += o.offsetLeft;
	}
	var pos = {
		top : t,
		left : l
	};
	return pos;
};
function cleanWhitespace(element) {
	var element = element;
	for ( var i = 0; i < element.childNodes.length; i++) {
		var node = element.childNodes[i];
		if (node.nodeType == 3 && !/\S/.test(node.nodeValue))
			element.removeChild(node);
	}
}
Date.prototype.Format = function(fmt) { // author: meizz
	var o = {
		"M+" : this.getMonth() + 1, // 月份
		"d+" : this.getDate(), // 日
		"h+" : this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, // 小时
		"H+" : this.getHours(), // 小时
		"m+" : this.getMinutes(), // 分
		"s+" : this.getSeconds(), // 秒
		"q+" : Math.floor((this.getMonth() + 3) / 3), // 季度
		"S" : this.getMilliseconds()
	// 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "")
				.substr(4 - RegExp.$1.length));
	for ( var k in o)
		if (new RegExp("(" + k + ")").test(fmt))
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k])
					: (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
};
/*******************************************************************************
 * 取得格式化后的价格
 * 
 * @param :
 *            float price
 */
function getFormatedPrice(price) {
	if (currencyFormat.indexOf("%s") > -1) {
		return currencyFormat.replace('%s', advFormatNumber(price, 2));
	} else if (currencyFormat.indexOf("%d") > -1) {
		return currencyFormat.replace('%d', advFormatNumber(price, 0));
	} else {
		return price;
	}
}