// JavaScript Document

$(document).ready(function(){
  $(".control-tab li").click(function(){
	$(this).siblings().removeClass("active");
	$(this).addClass("active");
	var getHref = $(this).attr("href");
	if(getHref){
	  $(".integral-exchange").css("display","block");
	  $(".integral-detail").css("display","none");
	}else {
	  $(".integral-exchange").css("display","none");
	  $(".integral-detail").css("display","block");
	}
  })
})