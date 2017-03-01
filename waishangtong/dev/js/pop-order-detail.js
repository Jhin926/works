/* !
 *  订单详情
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

        var orderId = parseInt($.GetQueryString('id')),
            $detail = $('#detailOrderForm');
        var $showbtn=$.GetQueryString('showbtn');
        if(!$showbtn){
            $(".order-btn-group").show();
        }
        $('.fieldset').on('click', '.form-group>button', function () {

            var type = $(this).attr('data-type');
            if (type == 'copy') {
                maintab.showTab(Base.url + '/html/pop-order-add.html?type=0&id=' + orderId + "&v=" + window.ver, '新建订单');
            } else if (type == 'export') {
                orderObj.toExport();
            } else if (type == 'del') {
                //打开删除面板
                $.modalsFn($('#delsModal'), $(this));
            }
        });
        //  关闭面板
        $detail.on('click', '.mclose,#btn-del-no', function () {
            $('.modals').removeClass('active');
        });
        $detail.on('click', '#btn-del-ok', function () {
            orderObj.delOrder();
        });
        var orderObj = {
            unit: {price: [], quantity: []},
            //	得到订单详情
            getOrdersById: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/order/v1/order/detail',
                    data: {id: orderId},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }

                        var obj = res.data,
                            detail = obj.productOrderDetails,
                            manlist = obj.productOrderSalesmans,
                            html = '', fileHTML = '',
                            plist = orderObj.unit.price,
                            qlist = orderObj.unit.quantity;
                        $detail.find('.order-name').text(obj.name);

                        //$detail.find('.order-price').text('$'+obj.orderAmount+' USD');

                        var priceVals = orderObj.unit.price;
                        for (var i = 0; i < priceVals.length; i++) {
                            if (obj.orderAmountUnit == priceVals[i].id) {
                                obj.orderAmountUnit_text = priceVals[i].value;
                            }
                        }
                        $detail.find('.order-price').text(obj.orderAmount + ' ' + obj.orderAmountUnit_text);

                        $detail.find('.order-payfor').text(obj.paymentMethod);
                        $detail.find('.order-Deadline').text(obj.termOfDelivery);
                        $detail.find('.order-no').text(obj.orderNo);
                        $detail.find('.order-date').text(obj.dateOfDelivery);
                        $detail.find('.order-freight').text(obj.freight);
                        $detail.find('.order-customer').text(obj.customerName || '匿名');
                        $detail.find('.order-payment').text(obj.balanceDate || '');
                        if (manlist.length > 0) {
                            for (var i = 0; i < manlist.length; i++) {
                                var img = manlist[i].avatar || '../images/user.jpg';
                                html += '<div class="info-belong">\
                                                <!--<img src="' + img + '" alt="头像" />-->\
                                                <span>' + manlist[i].salesmanName + '</span>\
                                                <span class="belong-percent">' + (manlist[i].proportion) * 100 + '%</span>\
                                            </div>';
                            }
                            $detail.find('.box-belong').empty();
                            $detail.find('.box-belong').append(html);
                        }

                        if (detail.length > 0) {
                            html = '';
                            for (var j = 0; j < detail.length; j++) {
                                var pName = '', qName = '';
                                for (var p = 0; p < plist.length; p++) {
                                    if (detail[j].priceCurrency == plist[p].id) {
                                        pName = plist[p].value;
                                    }
                                }
                                for (var q = 0; q < qlist.length; q++) {
                                    if (detail[j].quantityUnit == qlist[q].id) {
                                        qName = qlist[q].value;
                                    }
                                }
                                ;
                                html += '<ul class="items-infos">\
                                                <li>' + (j + 1) + '</li>\
                                                <li>' + detail[j].productName + '</li>\
                                                <li style="padding:0"><img src="' + detail[j].productPhoto + '" alt="产品图片" style="padding:0"></li>\
                                                <li>' + pName + ' ' + detail[j].price + '/' + qName + '</li>\
                                                <li>' + detail[j].orderQuantity + '</li>\
                                                <li>$' + detail[j].amount + '</li>\
                                                <div class="clear"></div>\
                                            </ul>';
                            }
                            $detail.find('.items-title').after(html);
                            $detail.find('.items-infos img').load(function () {
                                $.cutImage(this, 100, 150);
                            });
                        }
                        $detail.find('.box-desc').html(obj.remark);
                        if (obj.productOrderAnnexs.length > 0) {
                            for (var f = 0; f < obj.productOrderAnnexs.length; f++) {
                                var file = obj.productOrderAnnexs[f];
                                fileHTML += '<li data-url="' + file.path + '"><span>' + file.name + '</span><!--<i class="s-updownBg s-dels2 pull-right"></i>--></li>';
                            }
                            $detail.find('.file-list').append(fileHTML);
                        }

                        //订单详情里的自定义属性
                        var getDefined = obj.sysDefinedValueEnters;
                        for (var i = 0; i < getDefined.length; i++) {
                            var html = '<li><label>' + getDefined[i].code + '</label><span class="order-freight">' + getDefined[i].value + '</span></li>';
                            $detail.find('.order-detail ul').append(html);
                        }
                    }
                });
            },
            toExport: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/order',
                    type: 'POST',
                    data: {id: orderId},
                    dataType: 'json',
                    complete: function (res) {
                        parent.location.href = Base.sitUrl + '/api/export/v1/order?id=' + orderId;
                    }
                });
            },
            //  删除订单
            delOrder: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/order/v1/order/batch/delete',
                    type: 'POST',
                    data: {ids: orderId},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('删除失败，', +res.message);
                            return;
                        }
                        $.DestroyPopInPop();
                        parent.location.reload();
                    }
                });
            },
            //  单位
            getDicts: function (type) {
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
                                orderObj.unit.price = list;
                            } else if (type == 'unit') {
                                orderObj.unit.quantity = list;
                            }
                        }
                    }
                });
            }
        };
        $.when(orderObj.getDicts('currency'), orderObj.getDicts('unit')).done(function () {
            orderObj.getOrdersById()
        });
    });
});