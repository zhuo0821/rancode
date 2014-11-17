
$(function() {
	var storeId = document.getCookie('storeId');
	if(storeId == null)
		pop();
	else {
		var storeName = "";
		for(var i=0;i<storeList.length;i++) {
			if(storeList[i].id == storeId) {
				storeName = storeList[i].name;
			}
		}
		if(storeName != "") 
		{
			$('#welcome').text('欢迎来到'+storeName+'!');
			$('#welcome').append('<a href="javascript:void(0);" onclick="pop()" style="color:red">[切换]</a>');
		}
		else 
		{
			pop();
		}
	}
	});
//弹出窗口
function pop(){
var bg_div = 'fade';
	document.getElementById('fade').style.display='block' ;
var bgdiv = document.getElementById(bg_div);
bgdiv.style.width = document.body.scrollWidth;
// bgdiv.style.height = $(document).height();
$("#"+bg_div).height($(document).height());

	//将窗口居中
	makeCenter();

	//初始化省份列表
	initStore();

	//设置选中值
	var storeId = getCookie('storeId')==null?1:getCookie('storeId');
	$('[store-id='+storeId+']').addClass('choosen');
	
}

//确定按钮
function enter(){
	var storeId = $('#choose-a-store').find('.choosen').attr('store-id');
	document.setCookie('storeId',storeId);
	parent.location.reload();
	$('#choose-box-wrapper').text("切换中，请稍后……");
}

function initStore(){
	
	//原先的省份列表清空
	$('#choose-a-store').html('');
	
	for(i=0;i<storeList.length;i++){
		$('#choose-a-store').append('<a href="javascript:void(0);" class="store-item" store-id="'+storeList[i].id+'">'+storeList[i].name+'</a>');
	}
	
	//添加省份列表项的click事件
	$('.store-item').bind('click',function(){
		var item=$(this);
		var store = item.attr('store-id');
		var choosenItem = item.parent().find('.choosen');
		if(choosenItem)
		$(choosenItem).removeClass('choosen');
		item.addClass('choosen');
	});
}


function makeCenter(){
	$('#choose-box-wrapper').css("display","block");
	$('#choose-box-wrapper').css("position","absolute");
	$('#choose-box-wrapper').css("top", Math.max(0, (($(window).height() - $('#choose-box-wrapper').outerHeight()) / 2) + $(window).scrollTop()) + "px");
	$('#choose-box-wrapper').css("left", Math.max(0, (($(window).width() - $('#choose-box-wrapper').outerWidth()) / 2) + $(window).scrollLeft()) + "px");
}