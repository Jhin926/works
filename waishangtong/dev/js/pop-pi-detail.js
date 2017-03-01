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

        var piID = parseInt($.GetQueryString('id')),
            type = $.GetQueryString('type'),
            $detail = $('#detailPIForm');
            $showbtn=$.GetQueryString('showbtn');
            if(!$showbtn){
                $(".pi-btn-group").show();
            }

        $detail.on('click', '.form-group>button', function () {
            var type = $(this).attr('data-type');

            if (type == 'edit') {
                maintab.showTab(Base.url + '/html/pop-pi-add.html?type=1&id=' + piID + "&v=" + window.ver, '编辑PI');
            } else if (type == 'copy') {
                maintab.showTab(Base.url + '/html/pop-pi-add.html?type=0&id=' + piID + "&v=" + window.ver, '新建PI');
            } else if (type == 'order') {
                maintab.showTab(Base.url + '/html/pop-order-add.html?piId=' + piID + "&v=" + window.ver, '新建订单');
            } else if (type == 'export') {
                detailObj.toExport();
            }
        });


        var detailObj = {
            getPIById: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/pi/v1/pi/detail',
                    data: {
                        id: piID
                    },
                    type: 'post',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var obj = res.data,
                            list = obj.productPiDetails,
                            html = '';
                        $detail.find('.pi-create').text(obj.piDate || '');
                        $detail.find('.quo-title>span').text(obj.name);
                        $detail.find('.custInfo-name').text(obj.customerName || '匿名');
                        $detail.find('.custInfo-addr').text(obj.toAddress);
                        $detail.find('.custInfo-no').text(obj.piNo);
                        $detail.find('.custInfo-seller').text(obj.seller);
                        $detail.find('.custInfo-date').text(obj.piDate || '');

                        $detail.find('.p-freight').text(obj.freight);
                        $detail.find('.p-payment').text(obj.termOfPayment);
                        $detail.find('.p-td').text(obj.termOfDelivery);
                        $detail.find('.p-dd').text(obj.dateOfDelivery);
                        $detail.find('.p-total').text('$' + (obj.total || 0) + ' USD');
                        $detail.find('.the-seller').text(obj.sellerSignature);
                        $detail.find('.the-buyer').text(obj.buyerSignature);
                        if(obj.companyLogo != '' && obj.companyLogo != null && obj.companyLogo != undefined){
                            $detail.find('.box-pi-logo:first li:last-child').html('<img src="'+ obj.companyLogo +'" alt="" />');
                        }

                        if (list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                html += '<ul class="items-infos">\
                                            <li>' + (i + 1) + '</li>\
                                            <li>' + list[i].productName + '</li>\
                                            <li><img src="' + list[i].productPhoto + '" alt="产品图片" /></li>\
                                            <li><span class="p-unit">USD</span>&nbsp;<span class="p-cunit">$</span>\
                                                <span class="p-price">' + list[i].price + '</span>/<span class="p-munit">piece</span>\
                                            </li>\
                                            <li>' + list[i].orderQuantity + '</li>\
                                            <li>USD $' + (list[i].orderQuantity * list[i].price) + '</li>\
                                            <div class="clear"></div>\
                                        </ul>';
                            }
                        } else {
                            html = '<ul>无产品列表</ul>';
                        }
                        $detail.find('.items-title').after(html);
                        $detail.find('.items-infos img').load(function () {
                            $.cutImage(this, 162, 136);
                        })
                    }
                });
            },
            toExport: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/export/v1/pi',
                    type: 'POST',
                    data: {id: piID},
                    dataType: 'json',
                    complete: function (res) {
                        window.location.href = Base.sitUrl + '/api/export/v1/pi?id=' + piID;
                    }
                });
            }
        };
        //发邮件
        $('#pi-email').on('click', function () {
            maintab.showTab(Base.url + '/html/pop-email-new.html?showType=right&modelType=101&ids=' + piID + "&v=" + window.ver, '发邮件');
        });
        detailObj.getPIById(piID);
    });
});