(function($){
	$.fn.onmousewheel = function(callback){
		var element = $(this);
		if($.browser.mozilla){
			element.on("DOMMouseScroll",function(e){
				var num = getWheelValue(e);
				callback(num);
			});
		}
		else{
			element.on("mousewheel",function(e){
				var num = getWheelValue(e);
				callback(num);
			});
		}
		function getWheelValue(e){
			e.preventDefault();
			var event = e.originalEvent;
			if($.browser.mozilla){
				return -event.detail / 3;
			}
			else{
				return event.wheelDelta / 120;
			}
		}
	}
})(jQuery);
