var qaList = (function() {
	var array = {};
	$('.qatitle').each(
			function() {
				var qa = $(this).attr('qa');
				if (array.hasOwnProperty(qa)) {
					array[qa].push($(this));
				} else {
					array[qa] = new Array($(this));
				}

				$(this).click(
						function() {
							var img = $(this).find('img').attr('src');
							img = img == 'images/arr1.gif' ? 'images/arr2.gif'
									: 'images/arr1.gif';
							$(this).find('img').attr('src', img);
							$(this).next().is(':visible') ? $(this).next()
									.hide() : $(this).next().show();
						});
			});
	return array;
})();

var tabSH = function(e) {
	for ( var i in e) {
		e[i].show().next().show();
	}
};

var isShow = null;
$('.helpqalink>ul>li').each(function() {
	$(this).click(function() {
		$('.helpqalink>ul>li>a').removeClass('cur');
		var la = $(this).find('a').addClass('cur').attr('la');

		if (isShow) {
			for ( var i in isShow) {
				isShow[i].hide().next().hide();
				isShow[i].find('img').attr('src', 'images/arr2.gif');
			}
		}
		isShow = qaList[la];
		tabSH(isShow);
	});
});

var tip = /#(\d+)/.exec(location.href);
if (tip) {
	tip = tip[1];
	isShow = qaList[tip];
	tabSH(isShow);
	$('.ha' + tip).find('a').addClass('cur');

} else {
	$('.helpqalink>ul>li')[0].click();
}