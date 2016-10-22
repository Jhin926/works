// JavaScript Document


(function($) {
  var Slider = $.slider = (function() {
    var counter = 0;
    var maxCount = 0;
    var singleWidth = 0;
    var timer = null;
    
    function init() {
	  maxCount = $(".rec-slider li").size();
      singleWidth = $(".rec-slider li").innerWidth();
	  $(".rec-slider li").each(function(i) {
        $(this).css({left: i * singleWidth});
      });
      setTimer();
	  $(".recommend-tab span").click(function(){
		setTimer();
		var getPN = $(this).attr("class");
		if(getPN == "recommend-prev"){
		  slidePhoto(true);
		}else {
		  slidePhoto();
		}
	  })
    }
    
    function setTimer() {
      clearInterval(timer);
      timer = setInterval(slidePhoto, 3000);
    }
    
    function slidePhoto(reverse) {
	  if(!$(".rec-slider ul").is(':animated')){
		if (reverse) {
          counter = counter - 1;
        } else {
          counter = counter + 1;
        }
		
  	    if(counter >= maxCount - 4){
		  counter=0;
	    }else if(counter <= -1){
		  counter = 0;
	    }
        $(".rec-slider ul").animate({"left": -counter * singleWidth}, 1000);
	  }
    }    
    
    return {
      init: init
    }
  })();
  /* document.ready
  ----------------------------------------*/
  $(Slider.init);
})(jQuery);

