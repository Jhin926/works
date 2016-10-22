(function($){
    $.fn.fadeBanner = function(){
        var counter = 0,
            maxCount = 0,
            timer = null,
            liList = $(this).find("li"),
            getControl = $(this).attr("control-fade"),
            controlLiList,tabSet,
            tabControl = $(this).attr("control-tab");

        //ҳ�������ɣ���ʾ��һ��ͼƬ
        liList.css("display" , "none");
        liList.eq(0).css("display" , "");

        maxCount = liList.size();


        setTimer();

        if(getControl){
            controlFadePhoto(getControl);
        }

        if(tabControl){
            controlTabPhoto(tabControl);
        }

        function setTimer(){
            clearInterval(timer);
            timer = setInterval(slidePhoto, 3000);
        }

        function slidePhoto(reverse) {
            if(!liList.is(':animated')){

                if (reverse) {
                    counter = counter - 1;
                } else {
                    counter = counter + 1;
                }

                if(counter == maxCount){
                    counter = 0;
                }

                if(counter < 0){
                    counter = maxCount - 1;
                }

                liList.fadeOut(1000);
                liList.eq(counter).fadeIn(1000);

                if(controlLiList){
                    controlLiList.removeClass("active");
                    controlLiList.eq(counter).addClass("active");
                }
            }
        }

        function controlFadePhoto(_getControl){
            controlLiList = $("."+_getControl).find("li");
            controlLiList.click(function(){
                var getNum = $(this).index();
                counter = getNum - 1;
                setTimer();
                slidePhoto();
            })
        }

        function controlTabPhoto(_tabControl){
            tabSet = $("." + _tabControl).find("li,span");
            tabSet.click(function(){
                setTimer();
                if($(this).index() == 0){
                    slidePhoto(true);
                }else{
                    slidePhoto();
                }
            })
        }

    }//����ʽ�ֲ�ͼ��
})(jQuery);

