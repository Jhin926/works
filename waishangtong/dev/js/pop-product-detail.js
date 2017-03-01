/* !
 *  用于CRM产品详情设置
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab) {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code]').each(function(){
            for(var i=0; i<funcList.length; i++){
                if(funcList[i].code == $(this).attr('data-code')){
                    $(this).removeClass('none');
                }
            };
        });

        maintab.init();
        var pId = parseInt($.GetQueryString('id')),
            $detail = $('.box-product-detail');

        var inxs = $detail.find('.pro-infos').length;
        $detail.find('.pro-infos').eq(inxs - 1).css('border-bottom', 'none');
        //  复制
        $detail.on('click', '#page-copy', function () {

            document.getElementById('copy-info').select();
            document.execCommand('Copy');
        });

        $detail.on('click', '#page-look', function () {
            window.open(detailObj.online);
        });

        //  打开分组面板
        $detail.on('click', '#pro-group', function () {
            $.modalsFn($('#groupsModal'), $(this));
            if ($('.u-group>ul>li').length > 0) {
                return;
            }
            detailObj.getGroups($('.u-group>ul'));
        });
        //  关闭面板
        $detail.on('click', '.mclose,#btn-del-no', function () {
            $('.modals').removeClass('active');
        });

        //  分组
        $detail.on('click', '.u-group>ul>li', function () {
            var targetId = $(this).attr('data-id');
            detailObj.changeGroup(pId, targetId);
            $('.modals').removeClass('active');
        });

        //  删除
        $detail.on('click', '#btn-del-ok', function () {
            detailObj.deletePro();
        });

        $detail.on('click', '.box-btn>button', function () {
            var type = $(this).attr('data-type');
            if (type == 'edit') {
                //  编辑产品
                maintab.showTab(Base.url + '/html/pop-product-add.html?type=1&id=' + pId + "&v=" + window.ver, '编辑产品');
            } else if (type == 'copy') {
                //  复制产品
                maintab.showTab(Base.url + '/html/pop-product-add.html?type=0&id=' + pId + "&v=" + window.ver, '新建产品');
            } else if (type == 'quotation') {
                //  新建报价
                maintab.showTab(Base.url + '/html/pop-quotation-add.html?pId=' + pId + "&v=" + window.ver, '新建报价');
            } else if (type == 'del') {
                //打开删除面板
                $.modalsFn($('#delsModal'), $(this));
            } else if (type == 'pi') {
                maintab.showTab(Base.url + '/html/pop-pi-add.html?pId=' + pId + "&v=" + window.ver, '新建pi');
            }
            else if (type == 'email') {
                maintab.showTab(Base.url + '/html/pop-email-new.html?showType=right&modelType=99&ids=' + pId + "&v=" + window.ver, '新建邮件');
            } else if (type == 'export') {
                detailObj.toExport();
            }
        });
        $detail.on('change', '#pro-date', function (e) {
            $.EventFn(e);

            var year = $(this).val();
            detailObj.statistics(year);
        });

        //  tab切换
        $('.tab-title>ul>li').on('click', function () {
            var inx = $(this).index();

            scrollObj.tabChange($(this));
        });
        $detail.find('.pro-box-info').scroll(function () {
            var a = {a1: $('#a_1>.pro-titles'), a2: $('#a_2>.pro-titles'), a3: $('#a_3>.pro-titles'), a4: $('#a_4>.pro-titles')};
            var scroTop = {
                a1: a.a1.offset().top - $(this).offset().top,
                a2: a.a2.offset().top - $(this).offset().top,
                a3: a.a3.offset().top - $(this).offset().top,
                a4: a.a4.offset().top - $(this).offset().top,
                a1H: $('#a_1').height(),
                a2H: $('#a_2').height(),
                a3H: $('#a_3').height(),
                a4H: $('#a_4').height()
            };
            if (scroTop.a4 && scroTop.a4 >= 0 && scroTop.a4 < 150) {
                scrollObj.tabChange($('.tab-title>ul>li').eq(3));
            } else if (scroTop.a3 >= 0 && scroTop.a3 <= 150) {
                scrollObj.tabChange($('.tab-title>ul>li').eq(2));
            } else if (scroTop.a2 >= 0 && scroTop.a2 <= 150) {
                scrollObj.tabChange($('.tab-title>ul>li').eq(1));
            } else if (scroTop.a1 >= 0 && scroTop.a1 <= 150) {
                scrollObj.tabChange($('.tab-title>ul>li').eq(0));
            }
        });
        $(window).resize(function (e) {
            $.EventFn(e);
            scrollObj.first = $('#a_1').offset().top;
        });
        var scrollObj = {
            first: $('#a_1').offset().top,
            tabChange: function (obj) {
                if (obj.hasClass('active')) {
                    return;
                }
                obj.addClass('active').siblings().removeClass('active');
                $('.tab-title>ul .on').css({'left': obj.position().left});
                if (obj.index() == 0) {
                    $('.tab-title>ul .on').css({'left': obj.position().left + 5});
                }
            }
        };
        //  图片切换
        var imgObj = {
            array: [],
            count: 0,
            leg: 0,
            timer: null,
            highlight: function (obj) {
                $('.show-img>#show_img').attr('src', imgObj.array[imgObj.count]);
                if (obj) {
                    obj.addClass('s-circle').removeClass('s-circle2').siblings('li').addClass('s-circle2').removeClass('s-circle');
                } else {
                    if(imgObj.count>=4){
                        $(".show-img li").eq(0).animate({marginLeft:-55*(imgObj.count-3)+"px"},0);
                    }else{
                        $(".show-img li").eq(0).animate({marginLeft:0},0);
                    }
                    $('.show-img>ul.img-link>li').eq(imgObj.count).addClass('s-circle').removeClass('s-circle2').siblings('li').addClass('s-circle2').removeClass('s-circle');
                    if (imgObj.leg == imgObj.count) {
                        imgObj.count = 0;
                    } else {
                        imgObj.count++;
                    }
                }
            },
            imgCenter: function () {
                var $img = $('.show-img>img');
                for (var i = 0; i < $img.length; i++) {
                    var _w = -(parseInt($img.eq(i).width()) / 2),
                        _h = -(parseInt($img.eq(i).height()) / 2);
                    $img.eq(i).css({'margin-left': _w, 'margin-top': _h});
                }
            }
        };
        //  图片切换
        $('.show-img').on('click', '>ul>li', function () {
            if ($(this).hasClass('s-circle')) {
                return;
            }
            imgObj.count = $(this).index();
            imgObj.highlight($(this));
        });
        $('.show-img').on('mouseover', '>ul>li', function () {
            clearInterval(imgObj.timer);
        });
        $('.show-img').on('mouseout', '>ul>li', function () {
            if (imgObj.count >= imgObj.leg) {
                imgObj.count = 0;
            }
            else if (imgObj.count == 0) {
                imgObj.count++;
            }
            imgObj.timer = setInterval(function () {
                imgObj.highlight();
            }, 3500);
        });
        var num1=0;
        $("#img_left").on("click",function(){
            clearInterval(imgObj.timer);
            if(num1<$(".show-img li").length-4&&num1>=0){
                num1++;
                $(".show-img li").eq(0).animate({marginLeft:-55*num1+"px"},300,function(){
                    imgObj.timer = setInterval(function () {
                        imgObj.highlight();
                    }, 3500);
                });
            }
        })
        $("#img_right").on("click",function(){
            clearInterval(imgObj.timer);
            if(num1<=$(".show-img li").length-4&&num1>0){
                num1--;
                $(".show-img li").eq(0).animate({marginLeft:-55*num1+"px"},300,function(){
                    imgObj.timer = setInterval(function () {
                        imgObj.highlight();
                    }, 3500);
                });
            }
        })
        var detailObj = {
            unit: {price: [], quantity: [], time: []},
            online: '',
            //  获取某个产品详情
            getItemById: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/get',
                    data: {id: pId},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var obj = res.data;
                        if (obj && obj.pictures && obj.pictures.length > 0) {
                            var html = '', imgList = [];
                            for (var m = 0, list = obj.pictures; m < list.length; m++) {
                                imgList.push(list[m].url);
                            }
                            if (imgList.length > 0) {
                                $('.show-img>img').attr('src', imgList[0]);
                            }
                            imgObj.array = imgList;
                            imgObj.leg = imgList.length - 1;
                            for (i = 0; i < imgList.length; i++) {
                                if (i == 0) {
                                    html += '<li class="s-circle" style="background-image: url('+ imgList[i] +')"></li>';
                                } else {
                                    html += '<li class="s-circle2" style="background-image: url('+ imgList[i] +')"></li>';
                                }
                            }
                            $('.show-img>ul.img-link').empty().append(html);
                            /*$('.show-img>#show_img').load(function () {
                                $.cutImage(this, 280, 280);
                            });*/
                            if (imgObj.leg == 0) {
                                clearInterval(imgObj.timer);
                            } else {
                                imgObj.timer = setInterval(function () {
                                    imgObj.highlight();
                                }, 3500);
                            }
                        }
                        var num=$(".show-img li").length;
                        if(num>4){
                            $(".switch_cn").show();
                        }else{
                            $(".switch_cn").hide();
                        }
                        var name = obj.name,
                            number = obj.id > 0 ? '【' + obj.productNo + '】' : '',
                            proObj = obj.productTradeInfoEnter,
                            pList = detailObj.unit.price,
                            qList = detailObj.unit.quantity,
                            tList = detailObj.unit.time;

                        var pUnit = '', qUnit = '', oUnit = '', sUnit = '', sat = '';
                        for (var p = 0; p < pList.length; p++) {
                            if (proObj.fomPriceCurrency == pList[p].id) {
                                pUnit = pList[p].value;
                                break;
                            }
                        }
                        for (var q = 0; q < qList.length; q++) {
                            if (proObj.supplyAblilityUnit == qList[q].id) {
                                qUnit = qList[q].value;
                            }
                            if (proObj.minOrderQuantityUnit == qList[q].id) {
                                oUnit = qList[q].value;
                            }
                            if (proObj.supplyAblilityUnit == qList[q].id) {
                                sUnit = qList[q].value;
                            }
                        }
                        for (var t = 0; t < tList.length; t++) {
                            if (proObj.supplyAblilityTime = tList[t].id) {
                                sat = tList[t].value;
                            }
                        }
                        var units = detailObj.unit.quantity;
                        for (var y = 0; y < units.length; y++) {
                            if (units[y].id == proObj.unit) {
                                proObj.unit_text = units[y].value;
                            }
                        }
                        $('.fobPrice').text('$ ' + proObj.fomPriceMin + ' - ' + proObj.fomPriceMax + '/' + proObj.unit_text);
                        $('.minOrder').text(proObj.minOrderQuantity + ' ' + oUnit);
                        $('.supplyAbility').text(proObj.supplyAblility + ' ' + proObj.supplyAblilityTimeValue);
                        $('.g-port').text(proObj.port || '');
                        $('.paymentTerms').text(proObj.paymentTerm);
                        if (proObj) {
                            if (proObj.minOrderQuantityDesc) {
                                var minDesc = '(' + proObj.minOrderQuantityDesc + ')'
                            } else {
                                var minDesc = ''
                            }
                            if (proObj.supplyAblilityDesc) {
                                var supplyDesc = '(' + proObj.supplyAblilityDesc + ')'
                            } else {
                                var supplyDesc = ''
                            }

                            detailObj.online = Base.sitUrl + '/api/product/preview/' + $.getUser().id + '/' + pId;
                            $detail.find('#copy-info').val(detailObj.online);
                            $detail.find('.form-title>label').text(number + name);
                            $detail.find('.brandName').text(obj.brand || '');
                            $detail.find('.deliveryTime').text(proObj.deliveryTime || '');
                            $detail.find('.p-remark').text(obj.remark || '');

                            $detail.find('.info-no').text(obj.productNo || '');
                            //不同的品类的字段
                            var categoryAttr = JSON.parse(obj.productInfo),
                                categoryHtml = '';
                            for(var item in categoryAttr){
                                if(categoryAttr[item]!='' && categoryAttr[item]!='请选择'){
                                    categoryHtml += '<tr><td>'+ item +'</td><td>'+categoryAttr[item]+'</td></tr>';
                                }
                            }
                            $('#pro-information tbody').append(categoryHtml);
                            $detail.find('.info-pd').text(proObj.packagingDetails || '');
                            $detail.find('.info-dt').text(proObj.deliveryTime || '');
                            $detail.find('.info-moq').text(proObj.minOrderQuantity + ' ' + oUnit + ' ' + minDesc);
                            $detail.find('.info-fp').text(proObj.fomPriceMin + '-' + proObj.fomPriceMax + pUnit);
                            $detail.find('.info-port').text(proObj.port || '');
                            $detail.find('.p-descs').text(obj.description || '');
                            $detail.find('.p-remark').text(obj.remark || '');
                            $detail.find('.info-description').text(obj.description || '');
                            $detail.find('.info-ability').text(proObj.supplyAblility + ' ' + proObj.supplyAblilityTimeValue + ' ' + supplyDesc);
                        }
                        var yearList = [
                                {id: 0, val: '全部'}
                            ], now = new Date().getFullYear(),
                            yearHTML = '';
                        yearList.push({id: now, val: '今年'});
                        for (var y = 1; y < 3; y++) {
                            yearList.push({id: now - y, val: (now - y) + '年'});
                        }
                        for (var d = 0; d < yearList.length; d++) {
                            yearHTML += '<option value="' + yearList[d].id + '">' + yearList[d].val + '</option>';
                        }
                        $detail.find('#pro-date').empty();
                        $detail.find('#pro-date').append(yearHTML);
                        detailObj.statistics(0);
                    }
                });
            },
            //  获取单位
            getDicts: function (type) {
                $.ajax({
                    url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                    type: 'POST',
                    data: {group: type},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data;
                        if (list.length > 0) {
                            if (type == 'currency') {
                                detailObj.unit.price = list;
                            } else if (type == 'unit') {
                                detailObj.unit.quantity = list;
                            } else if (type == 'supply.ability.time') {
                                detailObj.unit.time = list;
                            }
                        }
                    }
                });
            },
            //  导出
            toExport: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/product',
                    type: 'POST',
                    data: {id: pId, year: 0},
                    dataType: 'json',
                    complete: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        parent.location.href = Base.sitUrl + '/api/export/v1/product?id=' + pId + '&year=' + 0;
                    }
                });
            },
            //  获取分组列表
            getGroups: function (obj) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/catelog/list',
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var html = '', list = res.data;
                        for (var i = 0; i < list.length; i++) {
                            html += '<li data-id="' + list[i].id + '">' + list[i].name + '</li>';
                        }
                        obj.empty();
                        obj.append(html);
                    }
                });
            },
            //  产品统计
            statistics: function (year) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/statistics/get',
                    type: 'POST',
                    data: {year: year, productId: pId},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var obj = res.data;
                        $detail.find('.quotationCount').text(obj.quotationStatistics);
                        $detail.find('.piCount').text(obj.piStatistics);
                    }
                });
            },
            //  分组到
            changeGroup: function (ids, id) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/catelog/edit',
                    data: {
                        id: ids,
                        productCatelog: id
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '分组失败,');
                            return;
                        }
                        location.reload();
                    }
                });
            },
            //  删除产品状态
            deletePro: function () {

                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/delete',
                    data: {
                        id: pId
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        $.DestroyPopInPop();
                        parent.location.reload();
                    }
                });
            },
            //  页面图片化
            print: function (obj) {
                var len = $('#copy-info').val()
                $('#copy-info').attr('maxlength', len.length);
                html2canvas($('html'), {
                    onrendered: function (canvas) {
                        obj.attr('href', canvas.toDataURL());
                    }
                });
            }
        };

        $.when(detailObj.getDicts('unit'))
            .then(detailObj.getDicts('currency'))
            .then(detailObj.getDicts('supply.ability.time'))
            .done(detailObj.getItemById());
    });
});