(function($) {
    var Banner = $.banner = (function() {
        var counter = 0;
        var maxCount = 0;
        var contentWidth = 0;
        var timer = null;

        function init() {
		
			$("ul.banner-top").css("position","relative");
			$("ul.banner-top li").css("position","absolute");
			
            maxCount = $(".banner-top li").size();
            contentWidth = $("ul.banner-top").parent().width();
            $("ul.banner-top").parent().css({"overflow": "hidden", "position": "relative"})
            $("ul.banner-top li").css("width", contentWidth);
            $("ul.banner-top").parent().css("height", contentWidth * 0.465);

            var $imgFirst = $("ul.banner-top li:first-child");
            var $imgLast = $("ul.banner-top li:last-child");

            $imgFirst.clone().appendTo("ul.banner-top");
            $imgLast.clone().prependTo("ul.banner-top");

            $("ul.banner-top li").each(function(i) {
                $(this).css({left: (i - 1) * contentWidth});
            });

            $(window).on("orientationchange reseize",function(){
                contentWidth = $("ul.banner-top").parent().width();
                $("ul.banner-top li").css("width", contentWidth);
                $("ul.banner-top").parent().css("height", contentWidth * 0.465);
                $("ul.banner-top li").each(function(i) {
                    $(this).css({left: (i - 1) * contentWidth});
                });
            });

            setTimer();

            $("ul.banner-top li").on("swipeleft",function(e){
				e.preventDefault();
                setTimer();
                slidePhoto();
            });
            $("ul.banner-top li").on("swiperight",function(e){
				e.preventDefault();
                setTimer();
                slidePhoto(true);
            });
			
			//点击下方小按钮切换轮播图
			$("ul.banner-tab li").on("click",function(){
				counter = $(this).index() - 1;
				setTimer();
				slidePhoto();
			})
        }

        function setTimer() {
            clearInterval(timer);
            timer = setInterval(slidePhoto, 3000);
        }

        function slidePhoto(reverse) {
            if(!$("ul.banner-top").is(':animated')){
                if (reverse) {
                    counter = counter - 1;
                } else {
                    counter = counter + 1;
                }
				
				$("ul.banner-tab li").removeClass("active");
				$("ul.banner-tab li").eq(counter).addClass("active");
				
				if(counter == maxCount){
					$("ul.banner-tab li:first-child").addClass("active");
				}

                $("ul.banner-top").animate({left: -(contentWidth * counter)}, 1000, "easeInOutExpo", function() {
                    if (counter == maxCount) {
                        counter = 0;
                        $(this).css({left: 0});
                    } else if (counter == -1) {
                        counter = maxCount - 1;
                        $(this).css({left: -(contentWidth * (maxCount - 1))});
                    }
                });
            }
        }

        return {
            init: init
        }
    })();
    /* document.ready
     ----------------------------------------*/
    $(Banner.init);
})(jQuery);//以上是轮播图的方法

(function($){
	var Tab = $.tab = (function() {
		function init() {
			var number = 1;
			$("embed[id^='tab_']").css("display","none");
			$("embed#tab_1").css("display","");
			
			var sLength = $(".tab-container li").length-1;
			
			$(".tab-container li").click(function(){
				$(this).siblings().removeClass("selected");
				$(this).addClass("selected");
				var number1 = $(this).index() + 1;
				$("embed[id^='tab_']").css("display","none");
			    $("embed[id = 'tab_" + number1 +"']").css("display","");
					
				
			})
		}
		
		return {
            init: init
        }
	})();
	$(Tab.init);
})(jQuery);//以上是tab切换的方法,没有幻灯片效果


//以下是tab切换，有滑动效果
(function($){
	var SlideTab = $.slideTab = (function() {
		function init() {
			var number = 0,
			contentWidth = $("ul#tab-slide_1").width();
			
			$("ul[id^='tab-slide_']").each(function(i) {
                $(this).css({left: i * contentWidth});
            });
			 
			
			var sLength = $(".tab-slide-container li").length-1;
			
			$(".tab-slide-container li").click(function(){
				number = $(this).index();
				$(this).siblings().removeClass("active");
				$(this).addClass("active");
				$(".container-tab-slide").animate({left: -contentWidth * number},1000);
				
			})
			$(".tab_fild span").click(function(){
				if($(this).attr("class") == "next"){
					if(number == sLength){
						return;
					}else{
						number++;
					}
					$(".tab-slide-container li").removeClass("active");
					$(".tab-slide-container li").eq(number).addClass("active");
					$(".container-tab-slide").animate({left: -contentWidth * number},1000);
				}else {
					if(number == 0){
						return;
					}else{
						number--;
					}
					$(".tab-slide-container li").removeClass("active");
					$(".tab-slide-container li").eq(number).addClass("active");
					$(".container-tab-slide").animate({left: -contentWidth * number},1000);
				}
				
			})
		}
		
		return {
            init: init
        }
	})();
	$(SlideTab.init);
})(jQuery);


//以上是下拉菜单的方法
function dropdownMenu(_this){
	var target = $(_this).attr("href");
	$("#" + target).toggle(500);
	return false;//阻止页面跳转
}

$(document).ready(function(){
	var contentWidth = $("ul.single_img-slide").parent().width();
	var maxCount = $("ul.single_img-slide li").size(),
	count = 0;
	
	$(".single_img-slide li").each(function(i) {
        $(this).css({left: i * contentWidth});
    });
	$("ul.single_img-slide").parent().css({"overflow": "hidden", "position": "relative"})
    $("ul.single_img-slide li").css("width", contentWidth);
    var pHeight = $("ul.single_img-slide").parent().css("height", contentWidth * 0.9).attr("height");
	
	$(".slide_tab").css({
		"width": "100%",
		"top": "30%"
	})
	$(".slide_tab span").click(function(){
		if($(this).attr("class") == "prev"){
			if(count > 0){
				count--;
				$("ul.single_img-slide").animate({"left": -count * contentWidth}, 1000);
			}
			console.log(count);
		}else{
			if(count < maxCount-1){
				count++;
				$("ul.single_img-slide").animate({"left": -count * contentWidth}, 1000);
			}
			console.log(count);
		}
	})
})


