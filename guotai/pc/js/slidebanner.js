(function($){
    $.fn.slideBanner = function(options) {
        var opts = $.extend({}, $.fn.slideBanner.defaults, options);
        return this.each(function() {
			$this = $(this);
			var liList = $this.find(" > li");
			var liWidth = liList.eq(0).width();
			var	maxCount = liList.size();
			var count = 0;
			liList.each(function(e){
				$(this).css("left",e * liWidth);
			});
			
			var tabSlide = $(this).parent().next().find("span");
			tabSlide.click(function(){
				var m = $(this).parent().prev().find("ul");
				if(!m.is(':animated')){
                    var getTab = $(this).attr("class");
                    if(getTab.indexOf("prev") >= 0){
                        if(count > 0){
                            count--;
                            m.animate({left: -count * liWidth});
                        }
                    }else {
                        if(count < maxCount-3){
                            count++;
                            m.animate({left: -count * liWidth});
                        }
                    }
				}
				
			});

        });
    };
    $.fn.slideBanner.defaults = {
        /*background: '#000000',
        width: '600px',
        height: '500px',
        html: "",
        move: true,
        resizable: true,
		bgClose: false,
		addFunction: function(){},
        currentDo: false*/
    };
})(jQuery);
(function($){
  $.fn.marquee = function(){
	return this.each(function(){
							  console.log(this);
	  $this = $(this);
	  $this.after($this.html());
	  var imgHeight = $this.find("img").height();
	  var conHeight = $this.parent().height();
	  var valHeight = imgHeight - conHeight;
	  var moveImg = function(_this){
		_this.animate({marginTop: -imgHeight} , imgHeight*50 , "linear" , function(){
		  _this.css("marginTop", 0);
		  moveImg(_this);
	    });
	  }
	  moveImg($this);
	  $this.mouseenter(function(){
		$this.stop();
	  });
	  $this.mouseleave(function(){
		var currentVal = parseInt($this.css("marginTop"));
		var changeVal = imgHeight + currentVal;
		$this.stop().animate({marginTop: -imgHeight} , changeVal*50 , "linear" , function(){
		  $this.css("marginTop", 0);
		  moveImg($this);
	    });//每个像素的移动速度是0.05s
	  })
	  
	})
  };
})(jQuery);

