$(document).ready(function(){
	$.cookie.json = true;
	getCartNumber();
	
	$('.carNumber').change(function(){
		var count = parseInt($(this).val());
		var id = $(this).attr('data');
		$.get("./checkNumber.jspx",{"id":id},function(data){
			data=$.parseJSON(data);
			var lastCount = data.count;
			if(lastCount >= count ){
				var selectPriceId = '#'+id+'price';
				var amountId = '#'+id+'amount';
				
				var amount = parseFloat($(amountId).html());
				var allcharge =  $('#allcharge').html();
				allcharge = parseFloat(allcharge);
				var price = parseFloat($(selectPriceId).html());
				allcharge = allcharge - amount + price*count;
				amount = price*count;
				$(amountId).html(amount);
				$('#allcharge').html(allcharge);
				//$('#cartNumber').html();
				updateProductToCart(id, count);
				getCartNumber();
			}else {
				alert("菜品不够所填数量");
				var selectPriceId = '#'+id+'price';
				var amountId = '#'+id+'amount';
				var selectId = '#'+'carNumber'+id;
				var amount = parseFloat($(amountId).html());
				var allcharge =  $('#allcharge').html();
				allcharge = parseFloat(allcharge);
				var price = parseFloat($(selectPriceId).html());
				allcharge = allcharge - amount + price*lastCount;
				amount = price*lastCount;
				$(amountId).html(amount);
				$('#allcharge').html(allcharge);
				//$('#cartNumber').html();
				updateProductToCart(id, lastCount);
				getCartNumber();
				$(selectId).val(lastCount);
			}
		});
		
	});
	
	$('.deleteCar').click(function(){
		var id = $(this).attr('data');
		var amountId = '#'+id+'amount';
		
		var amount = parseFloat($(amountId).html());
		var allcharge =  $('#allcharge').html();
		allcharge = parseFloat(allcharge);
		allcharge = allcharge - amount;
		$('#allcharge').html(allcharge);
		deleteProductToCart(id);
		getCartNumber();
		var trId = '#'+id+'tr';
		$(trId).hide();
	});
});


function getCartNumber(){
	var products = $.cookie("products")==undefined?[]:$.cookie("products");
	if(products){
		var number = 0;
		for(var i = 0 ; i < products.length ; i++){
			number += products[i].number;
		}
		$('#cartNumber').html(number);
	}
}

function addToCart(id){
	$.get("./addChart.do",{"id":id},function(data){
		data=$.parseJSON(data);
		if(data.status == "0"){
			alert(data.message);
		}else {
			addProductToCart(id);
			alert("成功加入购物车:"+data.message);
			window.location.href = "./cart.jspx";
		}
	});
}

function addProductToCart(id){
	$.cookie.json = true;
	var products = $.cookie("products");
	if(products == null){
		products = [
		            	{"id":id,"number":1}
				   ];
	}else {
		var flag = 0;
		for(var i = 0 ; i < products.length; i++){
			if(products[i].id == id){
				products[i].number++;
				flag = 1;
			}
		}
		if(flag == 0){
			products.push({"id":id,"number":1});
		}
	}
	$.cookie("products",products,{ expires: 1 });
	return products;
}

function updateProductToCart(id,number){
	$.cookie.json = true;
	var products = $.cookie("products");
	if(products == null){
		products = [
		            	{"id":id,"number":number}
				   ];
	}else {
		var flag = 0;
		for(var i = 0 ; i < products.length; i++){
			if(products[i].id == id){
				products[i].number = number;
				flag = 1;
			}
		}
		if(flag == 0){
			products.push({"id":id,"number":number});
		}
	}
	$.cookie("products",products,{ expires: 1 });
	return products;
}

function deleteProductToCart(id){
	$.cookie.json = true;
	var products = $.cookie("products");
	if(products != null){
		for(var i = 0 ; i < products.length; i++){
			if(products[i].id == id){
				products.splice(i,1);
			}
		}
	}
	$.cookie("products",products,{ expires: 1 });
	return products;
}
