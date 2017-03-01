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

        var itemId = parseInt($.GetQueryString('id')),
            $detail = $('#detailQuoForm');
        var $showbtn=$.GetQueryString('showbtn');
            if(!$showbtn){
                $(".quotation-btn-group").show();
            }
        $detail.on('click', '.form-group>button', function (e) {
            $.EventFn(e);

            var type = $(this).attr('data-type');

            if (type == 'edit') {
                maintab.showTab(Base.url + '/html/pop-quotation-add.html?type=1&id=' + itemId + "&v=" + window.ver, '编辑报价');
            } else if (type == 'copy') {
                maintab.showTab(Base.url + '/html/pop-quotation-add.html?type=0&id=' + itemId + "&v=" + window.ver, '新建报价');
            } else if (type == 'export') {
                detailObj.toExport();
            }
        });

        var detailObj = {
            unit: {price: [], quantity: []},
            getQuoInfoById: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/quotation/v1/quotation/get',
                    data: {id: itemId},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }

                        var obj = res.data,
                            list = obj.productQuotationProductEnters,
                            plist = detailObj.unit.price,
                            qlist = detailObj.unit.quantity,
                            html = '',
                            $infos = $detail.find('.items-infos');
                        $detail.find('.quo-title>span').text(obj.name);
                        $detail.find('.custInfo-name').text(obj.createUserName || '匿名');
                        $detail.find('.custInfo-addr').text(obj.toAddress);
                        $detail.find('.custInfo-no').text(obj.quotationNo);
                        $detail.find('.custInfo-seller').text(obj.seller);
                        $detail.find('.custInfo-date').text(obj.quotationDate || '');
                        $detail.find('.quo-title>label>span').text(obj.createTime);
                        $detail.find('.quo-total>span').text(obj.totalPrice);
                        $detail.find('.quo-head').html(obj.header);
                        $detail.find('.quo-foot').html(obj.tail);

                        if (list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                var _currency = '$', _qunantity = '', _img = list[i].productPhoto || '../images/user.jpg';
                                for (var c = 0; c < plist.length; c++) {
                                    if (plist[c].id == list[i].fobPriceCurrency) {
                                        _currency = plist[c].value;
                                        break;
                                    }
                                }
                                for (var q = 0; q < qlist.length; q++) {
                                    if (qlist[q].id == list[i].orderQuantityUnit) {
                                        _qunantity = qlist[q].value;
                                        break;
                                    }
                                }
                                html += '<ul class="items-infos">\
                                            <li>' + (i + 1) + '</li>\
                                            <li><img src="' + _img + '" alt="产品图片" />\
                                                <p><label>Product Name:</label><span>' + list[i].productName + '</span></p>\
                                            </li>\
                                            <li>' + list[i].orderQuantity + '' + _qunantity + '</li>\
                                            <li>' + _currency + ' ' + list[i].fobPrice + '</li>\
                                            <li>' + (list[i].remark) + '</li>\
                                            <div class="clear"></div>\
                                        </ul>';
                            }
                            $detail.find('.items-title').after(html);
                            $detail.find('.items-infos img').error(function () {
                                $(this).prop('src', '../images/user.jpg');
                            });
                            $detail.find('.items-infos img').load(function () {
                                var $info = $('.items-infos'), $li = $info.children('li'), heightArray = [];
                                for (var j = 0; j < $info.length; j++) {
                                    heightArray.push($info.eq(j).children('li').eq(1).height());
                                }
                                heightArray.sort(function (a, b) {
                                    return b - a;
                                });
                                for (var i = 0; i < $li.length; i++) {
                                    $li.eq(i).css('height', heightArray[0]);
                                }
                            });

                        }
                    }
                });
            },
            //  导出
            toExport: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/quotation',
                    type: 'POST',
                    data: {id: itemId},
                    dataType: 'json',
                    complete: function (res) {
                        parent.location.href = Base.sitUrl + '/api/export/v1/quotation?id=' + itemId;
                    }
                });
            },
            //  获取单位
            getUnitGroup: function (type) {
                $.ajax({
                    url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                    data: {group: type},
                    type: 'POST',
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
                            }
                        }
                    }
                });
            }
        };
        //发邮件
        $('#btn-email').on('click', function () {
            var Ids = itemId;
            maintab.showTab(Base.url + '/html/pop-email-new.html?showType=right&modelType=100&ids=' + Ids + "&v=" + window.ver, '新建邮件');
        })
        $.when(detailObj.getUnitGroup('currency'))
            .then(detailObj.getUnitGroup('unit'))
            .then(detailObj.getQuoInfoById(itemId));
    });
});