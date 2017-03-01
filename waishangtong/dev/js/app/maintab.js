/*!
 * @description: 侧边弹窗方法
 * @author: lingweifeng
 * @date: 2015-11-09
 */
define( [ 'common', 'jquery' ], function(){
    var mainTab = function(){
        me = this;
        me.sPop = '';
        me.tab = '';
        me.toWidth = 910;
        me.html = '<div id="sPop" class="spop-wrap">'
                + '<div class="maintab-wrap">'
                + '<a class="spop-hide" data-maintab-hide href="javascript:;"><i class="s-spop-close"></i></a>'
                + '<a class="spop-show" data-maintab-show href="javascript:;"><i class="fa fa-chevron-left"></i></a>'
                + '<ul class="maintap" id="mainTab">'
                + '</ul>'
                + '</div>'
                + '<div id="iframeWrap" class="iframe-wrap">'
                + '</div>'
                + '</div>'
    };

    mainTab.prototype.init = function(){

        // 添加弹窗html结构
        if( $( '#sPop' ).length === 0 ) $( 'body' ).append( me.html );

        me.sPop = $( '#sPop' );
        //me.menuItem = $( "#sideMenu li a[target='iframepage']" );
        me.tab = $( "#mainTab" );
        me.frameWrap = $( "#iframeWrap" );
        if(parent.document.getElementById('iframeWrap')){
            me.sPop = $( '#sPop',parent.document );//.getElementById('sPop');
            me.tab = $( "#mainTab" ,parent.document);//.getElementById('mainTab');
            me.frameWrap = $( "#iframeWrap", parent.document);//.getElementById('iframeWrap');
        }

        var href, index, tit;
        //点击tab事件绑定
        this.tab.on( "click", "a.text", function(){
            if( $(this).hasClass("currentClass") ) return;
            me.showTab( $(this).attr("href"), $(this).text(), false );
            return false;
        });

        //关闭tab事件绑定
        this.tab.on( "click", "i.remove-icon", function(){
            var index = $(this).parent().index();
            if($(this).prev().attr('href').indexOf('pop-email-newOut.html')>=0){
                var content = '<div id="confirm_Modal" class="modal" aria-hidden="true" role="basic" tabindex="-1" style="z-index:100001!important;"><div class="modal-dialog" style="width: 300px;margin-top:140px;"><div class="modal-content"><div class="modal-header">  <h4 class="modal-title" style="text-align:left;">提示</h4></div><div class="modal-body">'
                    + '是否要将此邮件保存草稿？'
                    + '</div><div class="modal-footer">' +
                    '<button class="btn btn-primary" data-dismiss="modal" id="okDopConfirmButton1" type="button">是</button>' +
                    '<button class="btn btn-primary" data-dismiss="modal" id="destoryDopConfirmButton1" type="button">否</button>' +
                    '<button class="btn default" type="button" id="cotinueEdit">取消</button></div></div></div></div>';
                $('#confirm_Modal').remove();
                $('body').append(content);
                $('#confirm_Modal').modal('show');

                $('#okDopConfirmButton1').click(function(){
                    $('#iframeWrap').find('.iframe-page').eq(index)[0].contentWindow.window.saveDraft();
                });
                $('#cotinueEdit').click(function(){
                    $('#confirm_Modal').modal('hide');
                });
                $('#destoryDopConfirmButton1').click(function(){//否
                    $('#confirm_Modal').modal('hide');
                    me.closeOne(index);
                });
            }else{
                me.closeOne(index);
            }
        });

        // 通过data属性统一绑定显示弹窗和关闭弹窗事件
        $( 'body' ).on( 'click', 'a[data-maintab]', function(){
            var href = $(this).prop( 'href' ),
                tit = $(this).prop( 'title' ) || $(this).text();
            me.showTab( href, tit );
            parent.$.disNone();
            return false;
        });

        // 通过data属性统一绑定显示弹窗和关闭弹窗事件
        $( 'body' ).on( 'click', '[data-maintab-show]', function(){
            parent.$.disNone();
            me.showPop();
            return false;
        });

        // 通过data属性统一绑定显示弹窗和关闭弹窗事件
        $( 'body' ).on( 'click', '[data-maintab-hide]', function(){
            me.hidePop();
            return false;
        });
    };

    // 判断弹窗是否已经显示,true: 显示；false:隐藏
    mainTab.prototype.isShowing = function(){
        return ( me.sPop.width() > 50 );
    };

    // 展开弹窗
    mainTab.prototype.showPop = function(){
        // parent.$.disNone();
        me.sPop.addClass( 'active' ).find( '.spop-show' ).hide().siblings( '.spop-hide' ).show();
        me.sPop.animate({ width: me.toWidth,height: $('.i-content-wrapper').height() }, "1000" );
    };

    // 收起弹窗
    mainTab.prototype.hidePop = function(){
        me.sPop.animate({ width: 0 }, "500", function(){
            //me.sPop.removeClass( 'active' ).find( '.spop-hide' ).show().siblings( '.spop-show' ).show();
            me.tab.empty();
            me.frameWrap.empty();
            parent.$.disBlock();
        })
    };

    //添加新的tab
    mainTab.prototype.addTab = function( href, tit ){
        // 先显示弹窗
        if( !this.isShowing() ){
            this.showPop();
        };
        me.tab.find("li").removeClass( "currentClass" ).end().append("<li title='" + tit + "' class='currentClass'><a class='text' href='" + href + "'>" + tit + "</a><i class='remove-icon'></i>");
        me.frameWrap.find("iframe").hide().end().append("<iframe class='iframe-page' src='" + href + "' frameborder='0' width='100%'></iframe>");
    };
    //判断tab是否已经存在
    mainTab.prototype.isTabExit = function( href ){
        var i = false;
        me.tab.find("li").each( function( index, item ){
            var nHref = $(item).find("a").attr( "href" );
            if( nHref === href ){
               i = index;
            }
        });
        return i;
    };
    //判断相似URL(包含关系)的tab是否存在
    mainTab.prototype.isAlikeTabExit = function( href ){
        var i = false;
        me.tab.find("li").each( function( index, item ){
            var nHref = $(item).find("a").attr( "href" );
            if( nHref.indexOf( href ) >= 0 ){
                i = index;
            }
        });
        return i;
    };
    //如果tab已经存在，则显示；否则新增一个tab;
    mainTab.prototype.showTab = function( href, tit, reload ){
        if( href == undefined || tit == undefined ) return;
        // 先显示弹窗
        if( !this.isShowing() ){
            this.showPop();
        };
        var index = me.isTabExit( href );
        if( index !== false ){ //show tab
            var curFrame = me.frameWrap.find("iframe").eq( index );
            me.tab.find("li").eq( index ).addClass("currentClass").siblings().removeClass( "currentClass" );
            curFrame.show().siblings().hide();
            if( reload === true ) curFrame.attr( "src", curFrame.attr( 'src' ) );
            else if(reload === 'part'){
                $(curFrame[0].contentWindow.document).find('.box-customer-detail .tabs-menu>li.active').removeClass('active').trigger('click');
            }
        }else{  //add tab & show tab
            if( me.tab.find("li").size() == 8 ){
                $.Alert("最多只能显示8个选项卡");
                return;
            };
            me.tab.find("li").removeClass( "currentClass" ).end().append("<li title='" + tit + "' class='currentClass'><a class='text' href='" + href + "'>" + tit + "</a><i class='remove-icon'></i></li>");
            if(href.indexOf('?')>=0){
                if(href.indexOf('&v=')>=0){
                    me.frameWrap.find("iframe").hide().end().append("<iframe class='iframe-page' src='" + href + "' frameborder='0' width='100%'></iframe>");
                }else{
                    me.frameWrap.find("iframe").hide().end().append("<iframe class='iframe-page' src='" + href + "&v="+ window.ver +"' frameborder='0' width='100%'></iframe>");
                }
            }else {
                me.frameWrap.find("iframe").hide().end().append("<iframe class='iframe-page' src='" + href + "?v="+ window.ver +"' frameborder='0' width='100%'></iframe>");
            }
        }
        return false;
    };
    //在相似的url选项卡中打开新tab
    mainTab.prototype.showOnAlikeTab = function( str, href, tit ){
        var index = me.isAlikeTabExit( str );
        // 先显示弹窗
        if( !this.isShowing() ){
            this.showPop();
        };
        // if( index !== false && index != 0 ){
        if( index !== false ){
            var curFrame = me.frameWrap.find("iframe").eq( index );
            me.tab.find("li").eq( index ).addClass("currentClass").siblings().removeClass( "currentClass" );
            me.tab.find("li").eq( index ).find("a").text( tit ).attr({ "href":href, "title":tit });
            curFrame.attr( "src", href ).show().siblings().hide();
        }else{
            me.addTab( href, tit );
        }
    };
    //销毁当前tab
    mainTab.prototype.destroy = function(){
        me.tab.find( "li.currentClass > i.fa-times" ).trigger("click");
    };
    //刷新tab,url未传入或者不存在指定url的tab，则刷新当前tab
    mainTab.prototype.refresh = function( url ){
        var href = ( url == undefined ) ? window.location.href : url,
            index = me.isTabExit( href ),
            curFrame = ( index == false ) ?  me.frameWrap.find("iframe:visible") : me.frameWrap.find("iframe").eq( index );
        curFrame.attr( "src", curFrame.attr( 'src' ) );
    };
    //根据指定的index刷新tab
    mainTab.prototype.refresh2 = function( _index, _area){
        var $pTab = me.tab.find( "li" ).eq( _index).children('a.text');
        if(_area){
            me.showTab( $pTab.attr("href"), $pTab.text(), _area);
        }else{
            me.showTab( $pTab.attr("href"), $pTab.text(), true);
        }
    };

    //获取当前页面的index
    mainTab.prototype.tabIdx = function(){
        var idx = me.tab.find( "li.currentClass").index();
        return idx;
    };

    //关闭当前页面
    mainTab.prototype.closeOne = function(index, isSet){
        me.tab.find('li').eq(index).remove();
        //$(this).parent().remove();
        me.frameWrap.find("iframe").eq( index ).remove();
        // 如果是最后一个tab，则收起弹窗
        if( me.tab.find( "li" ).length == 0 ) me.hidePop();
        if(!isSet){
            var $lastTab = me.tab.find( "li:last" ).children( "a.text" );
            me.showTab( $lastTab.attr("href"), $lastTab.text(), false );
        }
    }

    return new mainTab;
});