/* !
 *  添加订单
 */
require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform', 'datetimepickerCN'], function (maintab, ZeroClipboard) {
        window['ZeroClipboard'] = ZeroClipboard;
        var orderId = parseInt($.GetQueryString('id')),
            piId = parseInt($.GetQueryString('piId')),
            orderType = $.GetQueryString('type'),
            custId = parseInt($.GetQueryString('custId')),
            pIdx = Number($.GetQueryString('pIdx')),
            $addForm = $('#addOrderForm');
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                language:  'zh-CN',
                todayBtn:  1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                format: "yyyy-mm-dd",
                bootcssVer: 3//因为html里的写法不规范，所以必须要加上这个时间插件才能正常显示
            });
        }
        var getData = {
            //  记录客户列表
            custList: []
        };
        var proPageObj = {//产品列表
            type: 1,
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
        };
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10,
            conditions: []
        };
        //  删除业务员
        $addForm.on('click', '.form-info .info-belong>span>i.s-dels3', function () {
            var $parent = $(this).closest('.info-belong'),
                list = $('.downs>.dropdowns>ul>li');
            $parent.remove();
            for (var i = 0; i < list.length; i++) {
                var id = list.eq(i).attr('data-id');
                if ($parent.attr('data-id') == id) {
                    list.eq(i).removeClass('active');
                    break;
                }
            }
            var sum = addObj.sumPrice();
            $addForm.find('#order-price').val(sum);
        });

        $('.downs').on('click', function (e) {
            $.EventFn(e);
        });
        $addForm.on('click', '.fieldset .file-list>li>i.s-dels2', function () {
            $(this).parent().remove();
        });
        //  删除产品快照
        $addForm.on('click', '.quo-box i.s-del2', function (e) {
            $.EventFn(e);

            $(this).closest('.quo-table-info').remove();
            var id = $(this).closest('ul').attr('data-id');
            var list = addObj.data.qSEnty;
            for (var i = 0; i < list.length; i++) {
                if (id == list[i].itemId) {
                    list.splice(i, 1);
                }
            }
            addObj.data.qSEnty = list;
            addObj.amountPrice($(this).closest('.quo-table-info'));
            var sum = addObj.sumPrice();
            $('.pi-total').val('$ ' + sum + ' USD');
        });
        //  计算总价
        $addForm.on('blur', '.quo-box .pi-fobPrice,.quo-box .pi-quantity', function (e) {
            $.EventFn(e);

            addObj.amountPrice($(this).closest('.quo-table-info'));
            var sum = addObj.sumPrice();
            $addForm.find('#order-price').val(sum);
            $('.pi-total').val('$ ' + sum + ' USD');
        });
        $addForm.on('blur', '.quo-box .pi-amount', function (e) {
            $.EventFn(e);

            var sum = addObj.sumPrice();
            $addForm.find('#order-price').val(sum);
            $('.pi-total').val('$ ' + sum + ' USD');
        });
        $addForm.on('click', '.quo-box .quo-select', function (e) {
            $.EventFn(e);
            var $ul = $(this).children('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
                $('.quo-select>ul').removeClass('active');
                $ul.addClass('active');
            }
        });
        $addForm.on('click', '.quo-box .quo-select>ul>li', function (e) {
            $.EventFn(e);

            if ($(this).hasClass('active')) {
                return;
            }
            $(this).addClass('active').siblings().removeClass('active');
            var id = parseInt($(this).attr('data-id'));
            $(this).closest('.quo-select').find('span').attr('data-id', id);
            $(this).closest('.quo-select').find('span').text($(this).text());
            $(this).closest('ul').removeClass('active');

            if ($(this).parent().hasClass('fob-price-unit')) {
                addObj.amountPrice($(this).closest('.quo-table-info'));
                var sum = addObj.sumPrice();
                $('.pi-total').val('$ ' + sum + ' USD');
            }
        });
        //  显隐业务员面板
        $addForm.on('click', '.add-info', function (e) {
            $.EventFn(e);

            var $drop = $('.countermans .dropdowns');
            if ($drop.hasClass('active')) {
                $drop.removeClass('active');
            } else {
                $drop.addClass('active');
            }
        });
        //  过滤
        $addForm.on('input', '.form-info input', function (e) {
            $.EventFn(e);

            var val = $(this).val(), list = addObj.getCounter, tmp = [];
            //  业务员
            if ($(this).hasClass('drop-filter')) {
                for (var i = 0; i < list.length; i++) {
                    if (list[i].name.indexOf(val) != -1) {
                        tmp.push(list[i]);
                    }
                }
                addObj.showCounter(tmp);
            }
        });
        $addForm.on('blur', '.form-info input', function (e) {
            $.EventFn(e);
            var $id = $(this).prop('id');
            if ($id == 'order-name') {
                $.errorsFn($(this), '请输入订单名称');
            } else if ($id == 'order-customer') {
                //$.errorsFn($(this), '请选择客户');
            } else if ($id == 'order-payment') {
                $.errorsFn($(this), '请输入付款方式');
            } else if ($id == 'order-delivery') {
                //$.errorsFn($(this), '请输入交货日期');
            } else if ($id == 'order-buy') {
                $.errorsFn($(this), '请输入交付期限');
            } else if ($id == 'order-price' || $id == 'order-payfor') {
                var _price = $(this).val(),
                    _msg = '',
                    reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                if (!_price) {
                    $(this).addClass('error');
                    $(this).nextAll('.errors').addClass('active');
                    _msg = '请输入运费';
                    $(this).nextAll('.errors').children().text(_msg);
                } else if (!reg.test(_price)) {
                    $(this).addClass('error');
                    $(this).nextAll('.errors').addClass('active');
                    _msg = '请输入数值';
                    $(this).nextAll('.errors').children().text(_msg);
                } else {
                    $(this).removeClass('error');
                    $(this).nextAll('.errors').removeClass('active');
                }
            } else if ($id.indexOf('order-add') >= 0) {//新加字段的情况
                if ($(this).attr('data-isRequired') == 'yes') {
                    $.errorsFn($(this), '请输入' + $(this).parent().prev().find('span').text());
                }
            }
        });
        //  添加业务员
        $('.downs').on('click', '.dropdowns ul>li', function (e) {
            $.EventFn(e);

            if ($(this).hasClass('active')) {
                return;
            }
            $(this).addClass('active');
            var id = $(this).attr('data-id'),
                $info = $('.info-belong'),
                html = '', list = addObj.getCounter,
                value = addObj.getPercent();
            for (var i = 0; i < list.length; i++) {
                if (list[i].id == id) {
                    html = '<div class="info-belong" data-id="' + list[i].id + '">\
                                <!--<img src="' + list[i].headImgUrl + '" alt="头像" />-->\
                                <span>' + list[i].name + '<i class="s-updownBg s-dels3"></i></span>\
                                <input type="text" name="percent" data-val="' + value + '" value="' + value + '%" />\
                            </div>';
                    $('.countermans .form-info').prepend(html);
                    $(this).parents('.dropdowns').removeClass('active');
                    return false;
                }
            }
        });
        //  显隐客户列表
        $addForm.on('click', '#order-customer', function (e) {
            $.EventFn(e);
            $('#customer').modal('show');
        });
        $('.screen-choiced').click(function(){
            $('.screen-list').toggle();
        });
        //客户分组过滤
        $('.screen-list').on('click','li',function(){
            $(this).parent().hide().prev().text($(this).text());
            pageObj.currentPage = 1;

            var getGroupId = $(this).attr('data-id');
            if(getGroupId!='0'){
                pageObj.conditions = [{"filedName":"customerGroupId","operateType":"=","filedValue":getGroupId}];
            }else {
                pageObj.conditions = [];
            }
            addObj.getCustomList();
        });
        //客户筛选
        $('.screen-input-name').change(function(){
            if($(this).val() == ''){
                delete pageObj.keyword;
            }else{
                pageObj.keyword= $(this).val();
            }
        });
        $('.screen-input-btn').click(function(){
            addObj.getCustomList();
        });

        $('#btn-sure').click(function(){
            var getChecked = $('.customer-list').find('input[type=radio]:checked');
            if(getChecked.length<=0){
                $.Alert('请先选择客户！')
            }else{
                $('#order-customer').val(getChecked.next().text());
                addObj.getCustInfo.id = getChecked.val();
                addObj.getCustInfo.name = getChecked.next().text();
                $('#customer').modal('hide');
            }
        });

        //改变产品名称，筛选
        $('#product-input').change(function(){
            proPageObj.name = $.trim($(this).val());
        });
        //产品名称，筛选产品
        $('.product-screen').click(function(){
            addObj.getResourceSettings();
        });

        //产品分组，筛选产品
        $('.product-group-check select').change(function(){
            var groupId = $(this).val();
            if(groupId == ''){
                groupId = 0;
            }
            proPageObj.productCatelog = groupId;
            addObj.getResourceSettings();
        });

        //产品类型，筛选产品
        $('#product-type0,#product-type1,#product-type2,#product-type3').change(function () {
            var val = $(this).find('option:selected').val();
            if (val == '') {
                val = 0;
            }
            proPageObj.productType = val;
            addObj.getResourceSettings();
            addObj.getProductsType(val,$(this));
        });
        $('#product-sure').click(function(){
            var getCheckedPro = $('.product-list li input[type=checkbox]:checked');
            if(getCheckedPro.length>0){
                for(var i =0;i<getCheckedPro.length;i++){
                    var checkedId = getCheckedPro.eq(i).parent().attr('data-id');
                    addObj.addProductItem(checkedId);
                }
                $('#products').modal('hide');
            }else{
                $.Alert('请至少选择一个产品！');
            }
        });
        $addForm.on('click', '.model-select', function (e) {
            $.EventFn(e);
            var $ul = $(this).children('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
                $('.model-select').children().removeClass('active');
                $ul.addClass('active');
            }
        });
        $addForm.on('click', '.model-select>ul>li', function (e) {
            $.EventFn(e);
            var $ul = $(this).parent();
            var $label = $ul.prev('label');
            var txt = $(this).text();
            var id = $(this).attr('data-id');
            $label.attr('data-id', id);
            $(this).addClass('active').siblings().removeClass('active');
            $label.text(txt);
            $ul.removeClass('active');
        });
        //  添加附件
        $addForm.on('click', '.order-files', function () {
            $('#up-files').click();
        });
        $addForm.on('change', '.fieldset #up-files,#upImgs', function () {
            var sign = editors.fileLimit($(this)),
                obj = $('#form_file'),
                type = $(this).attr('data-type');
            if (sign.flag) {
                if (type == 'img') {
                    obj = $('#form_img');
                }
                editors.uploadImg(sign.name, obj, type);
            }
        });
        //  插入图片
        $addForm.on('click', 'i.s-img', function () {
            $('#upImgs').click();
        });

        $(document.body).on('click', function () {
            if ($(this).closest('.quo-select').length == 0) {
                $('.quo-select>ul').removeClass('active');
            }
            if ($(this).closest('.downs').length == 0) {
                $('.countermans .dropdowns').removeClass('active');
            }
            if ($(this).closest('.cust-group').length == 0) {
                $('.cust-group>ul').removeClass('active');
            }
        });
        //  调整百分比
        $addForm.on('blur', '.info-belong>input', function (e) {
            $.EventFn(e);
            addObj.getPercent();
            var _val = $(this).val();
            $(this).attr('value', $(this).val());
            _val = _val.substr(0, _val.indexOf('%'));
            $(this).attr('data-val', _val);
        });

        $addForm.on('click', '#order-save', function (e) {
            $.EventFn(e);

            var flag = true,
                $save = $('.fieldset'),
                data = {},
                $name = $save.find('[name="order-name"]'),
                $price = $save.find('[name="order-price"]'),
                $payment = $save.find('[name="order-payment"]'),
                $delivery = $save.find('[name="order-delivery"]'),
                $balance = $save.find('[name="order-balance"]'),
                $payfor = $save.find('[name="order-payfor"]'),
                $buy = $save.find('[name="order-buy"]'),
                $customer = $save.find('[name="order-customer"]'),
                $unitPrice = $save.find('#o-price'),
                $unitPayfor = $save.find('#o-payfor'),
                $belong = $save.find('.info-belong'),
                $info = $save.find('.quo-table-info'),
                $files = $save.find('.file-list>li'),
                tmp = [];
            flag = $.errorsFn($name, '请输入订单名称');
            flag = $.errorsFn($payment, '请输入付款方式');
            flag = $.errorsFn($payfor, '请输入运费');
            flag = $.errorsFn($delivery, '请输入交付日期');
            flag = $.errorsFn($balance, '请输入结算日期');
            flag = $.errorsFn($customer, '请输入购买方式');
            flag = $.errorsFn($customer, '请选择客户');
            if ($payfor) {
                var _price = $payfor.val(),
                    _msg = '',
                    reg = /^[0-9]+([.]{1}[0-9]+){0,1}$/;
                if (!reg.test(_price)) {
                    $(this).addClass('error');
                    $(this).nextAll('.errors').addClass('active');
                    _msg = '请输入数值';
                    $(this).nextAll('.errors').children().text(_msg);
                } else {
                    $(this).removeClass('error');
                    $(this).nextAll('.errors').removeClass('active');
                }
            }
            if ($unitPrice.attr('data-id') == -1 || $unitPayfor.attr('data-id') == -1) {
                $.Alert('请选择单位');
                flag = false;
            }
            data.name = $name.val();
            data.orderNo = $save.find('[name="order-no"]').val();
            data.orderAmount = $save.find('[name="order-price"]').val();
            data.orderAmountUnit = parseInt($save.find('#o-price').attr('data-id'));
            data.freight = $save.find('[name="order-payfor"]').val();
            data.freightUnit = parseInt($save.find('#o-payfor').attr('data-id'));
            data.paymentMethod = $save.find('[name="order-payment"]').val();
            data.termOfDelivery = $save.find('[name="order-buy"]').val();
            data.dateOfDelivery = $save.find('[name="order-delivery"]').val();
            data.balanceDate = $save.find('[name="order-balance"]').val();
            data.customerId = addObj.getCustInfo.id;
            data.customerName = addObj.getCustInfo.name;
            data.remark = editors.order.getContent();
            data.productOrderDetails = [];
            data.productOrderSalesmans = [];
            data.productOrderAnnexs = [];
            data.sysDefinedValueEnters = [];

            //新添加的字段的值
            $save.find('[name^=order-add]').each(function () {
                if ($(this).val() != '') {
                    var eDetail = {};
                    eDetail.attributeId = $(this).attr('data-id');
                    eDetail.code = $(this).attr('data-code');
                    eDetail.value = $(this).val();

                    data.sysDefinedValueEnters.push(eDetail);
                }
            });
            var percent = 0;
            $('.info-belong').each(function () {
                var vals = $(this).children('input').val();
                if (vals.lastIndexOf('%') != -1) {
                    percent += parseInt(vals.substr(0, vals.lastIndexOf('%')));
                } else {
                    percent += parseInt(vals);
                }
            });
            if (percent > 100) {
                $.Alert('分配份额不能超过100%');
                flag = false;
            }
            if ($info.length > 0) {
                var list = addObj.data.qSEnty;
                for (var j = 0; j < list.length; j++) {
                    var key = $info.eq(j);
                    var amount = parseFloat(key.find('[name="pi-amount"]').val().substr(1));
                    list[j].productName = key.find('[name="pi-name"]').val();
                    list[j].price = parseFloat(key.find('[name="pi-fobPrice"]').val()).toFixed(2);
                    list[j].priceCurrency = parseInt(key.find('.punit').attr('data-id'));
                    list[j].quantityUnit = parseInt(key.find('.qunit').attr('data-id'));
                    list[j].orderQuantity = parseInt(key.find('[name="pi-quantity"]').val());
                    list[j].amount = amount;
                }
                data.productOrderDetails = list;
            } else {
                $.Alert('请添加至少一个产品');
                flag = false;
            }

            if ($belong.length > 0) {
                var percentSum = 0;
                for (var i = 0; i < $belong.length; i++) {
                    var key = $belong.eq(i),
                        percent = parseFloat((parseFloat(key.find('[name="percent"]').attr('data-val')).toFixed(2) / 100).toFixed(2));
                    percentSum += percent;
                    tmp.push({salesmanId: parseInt(key.attr('data-id')), salesmanName: key.children('span').text(),
                        avatar: key.children('img').prop('src'), proportion: percent});
                }
                if (percentSum < 1) {
                    $.Alert('业务员归属比例总和需达到100%！');
                    flag = false;
                }
                data.productOrderSalesmans = tmp;
                tmp = [];
            } else {
                $.Alert('业务员归属比例总和需达到100%！');
                flag = false;
            }

            if ($files.length > 0) {
                for (var k = 0; k < $files.length; k++) {
                    var t = $files.eq(k);
                    tmp.push({name: t.children('span').text(), path: t.attr('data-url')});
                }
                data.productOrderAnnexs = tmp;
                tmp = [];
            }
            if (flag) {
                addObj.saveOrder(data);
            }
        });
        var addObj = {
            getCounter: [],
            custList: [],
            productList: [],
            getCustInfo: {},
            unit: {price: [], quantity: []},
            data: {iSEnty: [], qSEnty: []},
            count: 1,
            //  获取订单号
            getNo: function () {
                if (orderType != 1) {
                    $.ajax({
                        url: Base.sitUrl + '/api/odd/v1/order/number',
                        type: 'GET',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.Alert('生成订单号失败,' + res.message);
                                return;
                            }
                            $addForm.find('#order-no').val(res.data);
                        }
                    });
                }
            },
            //添加自定义属性
            getOrderDefined: function () {
                $.ajax({
                    url: Base.sitUrl + "/api/org/v1/org/staff/defined/attribute/list",
                    data: {data: JSON.stringify({'bizType': 3})},
                    dataType: "json",
                    type: "GET",
                    success: function (result) {
                        if (!result.success) {
                            alert(result.message);
                            return;
                        }
                        var data = result.data;
                        var addIndex = 1;
                        for (var i = 0; i < data.length; i++) {
                            var dataDet = data[i];
                            var addList = '';

                            if (dataDet.removable == 1) {//新增字段(根据是否可以删除)
                                if (dataDet.required == 1) {//必填项
                                    addList = '<div class="box-title"><label for="order-add' + addIndex + '"><i>*</i><span>' + dataDet.name + '</span></label>\
                                <div class="form-info"><input data-code="' + dataDet.code + '" data-id="' + dataDet.id + '" data-isRequired="yes" type="text" id="order-add' + addIndex + '" name="order-add' + addIndex + '" class="inputs" /><div class="errors"><span>请输入数值</span></div></div><div class="clear"></div></div>';
                                } else {
                                    addList = '<div class="box-title"><label for="order-add' + addIndex + '"><span>' + dataDet.name + '</span></label>\
                                <div class="form-info"><input data-code="' + dataDet.code + '" data-id="' + dataDet.id + '" data-isRequired="no" type="text" id="order-add' + addIndex + '" name="order-add' + addIndex + '" class="inputs" /></div><div class="clear"></div></div>';
                                }
                                addIndex++;
                                $('#order-add').prepend(addList);
                            }
                        }
                    }
                });
            },
            //  获取订单详情
            getOrderById: function () {
                if (orderId) {
                    $.ajax({
                        url: Base.sitUrl + '/api/order/v1/order/detail',
                        type: 'POST',
                        data: {id: orderId},
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.Alert('获取订单详情失败,' + res.message);
                                return;
                            }
                            var obj = res.data,
                                $cust = $addForm.find('.cust-group>ul>li'),
                                clist = $cust.length,
                                $allPrice = $addForm.find('#o-price').next('ul').children('li'),
                                $freightPrice = $addForm.find('#o-payfor').next('ul').children('li'),
                                productList = obj.productOrderDetails,
                                fileHTML = '', salesHTML = '';
                            $addForm.find('#order-name').val(obj.name);
                            $addForm.find('#order-price').val(obj.orderAmount);
                            if (orderType == 1) {
                                $addForm.find('#order-no').val(obj.orderNo);
                            }
                            $addForm.find('#order-payfor').val(obj.freight);
                            $addForm.find('#order-payment').val(obj.paymentMethod);
                            $addForm.find('#order-buy').val(obj.termOfDelivery);
                            $addForm.find('#order-delivery').val(obj.dateOfDelivery);
                            $addForm.find('#order-balance').val(obj.balanceDate);
                            $addForm.find('#order-customer').val(obj.customerName);

                            addObj.getCustInfo.id = obj.customerId;
                            addObj.getCustInfo.name = obj.customerName;
                            editors.order.setContent(obj.remark, false);

                            for (var a = 0; a < $allPrice.length; a++) {
                                if (obj.orderAmountUnit == $allPrice.eq(a).attr('data-id')) {
                                    $allPrice.eq(a).addClass('active');
                                    $addForm.find('#o-price').attr('data-id', obj.orderAmountUnit);
                                    $addForm.find('#o-price').text($allPrice.eq(a).text());
                                    break;
                                }
                            }
                            for (var a = 0; a < $freightPrice.length; a++) {
                                if (obj.freightUnit == $freightPrice.eq(a).attr('data-id')) {
                                    $freightPrice.eq(a).addClass('active');
                                    $addForm.find('#o-payfor').attr('data-id', obj.freightUnit);
                                    $addForm.find('#o-payfor').text($allPrice.eq(a).text());
                                    break;
                                }
                            }
                            if (obj.productOrderAnnexs.length > 0) {
                                for (var f = 0; f < obj.productOrderAnnexs.length; f++) {
                                    var file = obj.productOrderAnnexs[f];
                                    fileHTML += '<li data-url="' + file.path + '"><span>' + file.name + '</span><i class="s-updownBg s-dels2 pull-right"></i></li>';
                                }
                            }

                            //给自定义属性部分加上值
                            var getDefined = obj.sysDefinedValueEnters;
                            if (getDefined.length > 0) {
                                var addIndex = 1;
                                for (var i = 0; i < getDefined.length; i++) {
                                    var getAttrId = getDefined[i].attributeId;
                                    $('input[data-id=' + getAttrId + ']').val(getDefined[i].value);
                                }
                            }

                            if (obj.productOrderSalesmans.length > 0) {
                                for (var s = 0; s < obj.productOrderSalesmans.length; s++) {
                                    var _sale = obj.productOrderSalesmans[s],
                                        _percent = parseFloat(_sale.proportion) * 100;
                                    salesHTML += '<div class="info-belong" data-id="' + _sale.id + '">\
                                                    <span>' + _sale.salesmanName + '<i class="s-updownBg s-dels3"></i></span>\
                                                    <input type="text" name="percent" data-val="' + _percent + '" value="' + _percent + '%"></div>';
                                }
                            }
                            $addForm.find('.countermans .form-info').prepend(salesHTML);
                            for (var d = 0; d < productList.length; d++) {
                                addObj.addProductItem(productList[d].id, productList);
                            }
                            $addForm.find('.file-list').empty();
                            $addForm.find('.file-list').append(fileHTML);
                        }
                    });
                }
            },
            //  获取pi详情
            getPIByid: function () {
                if (piId) {
                    $.ajax({
                        url: Base.sitUrl + '/api/pi/v1/pi/detail',
                        data: { id: piId},
                        type: 'POST',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.Alert('获取失败,' + res.message);
                                return;
                            }
                            var obj = res.data;
                            var list = obj.productPiDetails;
                            addObj.productList = list;
                            $('#order-name').val(obj.name);
                            $('#order-payfor').val(obj.freight);
                            $('#order-payment').val(obj.termOfPayment);
                            $('#order-buy').val(obj.termOfDelivery);
                            $('#order-delivery').val(obj.dateOfDelivery);
                            $('#order-balance').val(obj.balanceDate);
                            $('#order-customer').val(obj.customerName);
                            $('#order-customer').attr('data-id', obj.customerId);

                            for (var i = 0; i < list.length; i++) {
                                addObj.addProductItem(list[i].id);
                            }
                        }
                    });
                }
            },
            //  保存订单
            saveOrder: function (oEty) {
                $.ajax({
                    url: Base.sitUrl + '/api/order/v1/order/save',
                    data: {
                        data: JSON.stringify(oEty)
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('订单保存失败,' + res.message);
                            return;
                        }
                        if (custId) {
                            $.Alert('订单保存成功！', '', function () {
                                var index = parent.me.tabIdx();
                                parent.me.refresh2(pIdx, 'part');
                                parent.me.closeOne(index, true);
                            });
                        } else {
                            $.DestroyPopInPop();
                            parent.location.reload();
                        }
                    }
                });
            },
            //  获取百分比
            getPercent: function () {
                var surplus = 100, val = 0;
                $('.info-belong').each(function () {
                    var vals = $(this).children('input').val();
                    if (vals.lastIndexOf('%') != -1) {
                        val += parseInt(vals.substr(0, vals.lastIndexOf('%')));
                    } else {
                        val += parseInt(vals);
                    }
                });
                if (val > 100) {
                    $.Alert('分配份额不能超过100%');
                    return 0;
                }
                surplus = Math.abs(surplus - val);
                return surplus;
            },
            //  单位
            getDicts: function (type, obj) {
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
                        var list = res.data,
                            sign = obj.attr('id');
                        if (list.length > 0) {
                            if (type == 'currency') {
                                addObj.unit.price = list;
                            } else if (type == 'unit') {
                                addObj.unit.quantity = list;
                            }
                            if ((sign == 'o-price') || (sign == 'o-payfor')) {
                                addObj.unit.price = list;
                                addObj.showDicts2(list, obj.next('ul'));
                            } else {
                                addObj.showDicts(list, obj);
                            }
                        }
                    }
                });
            },
            showDicts: function (data, obj) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += '<li data-id="' + data[i].id + '">' + data[i].value + '</li>';
                }
                obj.empty().append(html);
            },
            showDicts2: function (data, obj, id) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += '<li data-id="' + data[i].id + '">' + data[i].value + '</li>';
                    if (data[i].id == id) {
                        obj.prev('label').children('span').attr('data-id', data[i].id).text(data[i].value);
                    }
                }
                obj.empty().append(html);
            },
            //  获取业务员
            getCounterman: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/principal/list',
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data;
                        addObj.getCounter = list;
                        addObj.showCounter(list);
                    }
                });
            },
            //  展示业务员
            showCounter: function (data) {
                var html = '', info = [],useName=[],Name;
                $('.info-belong').each(function () {
                    info.push(parseInt($(this).attr('data-id')));
                });
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        useName=data[i].name;
                        if (escape(data[i].name).indexOf( "%u" )<0){
                            Name=(useName.substring(0,2)).toUpperCase();
                        } else {
                            Name=(useName.substring(0,1));
                        }
                        var img = data[i].avatar || '../images/user.jpg';
                        if (info.indexOf(data[i].id) != -1) {
                            html += '<li class="active" data-id="' + data[i].id + '"><span class="useName use_name">'+Name +'</span><span>' + data[i].name + '</span></li>';
                        } else {
                            html += '<li data-id="' + data[i].id + '"><span class="useName">'+Name +'</span><span>' + data[i].name + '</span></li>';
                        }
                    }
                } else {
                    html = '无过滤信息';
                }
                $('.dropdowns>ul').empty();
                $('.dropdowns>ul').append(html);
            },
            //  获取客户列表
            getCustomList: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/list/query',
                    type: 'POST',
                    data: {data: JSON.stringify(pageObj)},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var page = res.data.totalItem;
                        getData.custList = data.results;//联系人列表
                        addObj.showCustomItem(data);
                    }
                });
            },
            //客户分组列表
            getCustomGroups: function (type) {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/group/list',
                    type: 'GET',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data;
                        if (list.length > 0) {
                            var groups = '<li data-id="0">全部分组</li>';
                            for(var i =0;i<list.length;i++){
                                groups += '<li data-id="'+ list[i].id +'">'+ list[i].name +'</li>';
                            }
                            $('.screen-list').empty().append(groups);
                        }
                    }
                });
            },
            //展现客户列表
            showCustomItem: function (_data) {
                if(getData.custList.length==0){
                    $('.customer-list').empty().html('<p class="customer-none">没有匹配客户！</p>');
                }else {
                    var itemList = '<ul>';
                    for(var i=0;i<getData.custList.length;i++){
                        itemList += '<li>\
                            <input type="radio" name="customer" value="'+ getData.custList[i].id +'" />\
                            <span>'+ getData.custList[i].name +'</span>\
                            </li>';
                    }
                    $('.customer-list').empty().append(itemList);
                }
                var total = _data.totalItem,
                    all = Math.ceil(_data.totalItem/_data.pageSize);
                $.Page({
                    total: total,
                    _class: '.customer-page',
                    nowNum: pageObj.currentPage,
                    allNum: all,
                    callback: function (now, all) {
                        pageObj.currentPage = now;
                        addObj.getCustomList();
                    }
                });
            },
            /*
             * @sumPrice 获取总价
             */
            sumPrice: function () {
                var sum = 0;
                $('.quo-table-info').each(function () {
                    var amount = parseFloat($(this).children('li').eq(5).find('.pi-amount').val().substr(1));
                    sum += parseFloat(amount);
                });
                return parseFloat(sum).toFixed(2);
            },
            /*
             * @amountPrice 获取单价
             */
            amountPrice: function (obj) {
                var $info = $('.quo-table-info');
                for (var i = 0; i < $info.length; i++) {
                    var amount = 0,
                        $li = $info.eq(i).children('li'),
                        _li = obj.children('li');
                    if (($info.eq(i).attr('data-id') == obj.attr('data-id')) && ($li.eq(0).text() == _li.eq(0).text())) {
                        var price = parseFloat($li.eq(3).find('.pi-fobPrice').val()),
                            unit = $li.eq(3).find('.fob-price-unit').prev().children('span').text(),
                            quantity = parseInt($li.eq(4).find('.pi-quantity').val()),
                            $qspan = $li.eq(3).find('.fob-price-unit').prev().children('span');
                        if (unit == 'CNY') {
                            price = price / 6.49;
                        }
                        if ($qspan.attr('data-id') == -1) {
                            $.Alert('请选择货币单位');
                        }

                        amount += parseFloat(price * quantity);
                        $li.eq(5).find('.pi-amount').attr('data-val', amount.toFixed(2));
                        $li.eq(5).find('.pi-amount').val('$' + amount.toFixed(2));
                        return;
                    }
                }
            },
            /*
             * @addProductItem 添加产品选项
             */
            addProductItem: function (id, data) {
                var list = addObj.productList;
                if (data) {
                    list = data;
                }
                var obj = {};
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        obj = list[i];
                        var tobj = obj.productTradeInfoEnter;
                        if (tobj && tobj.hasOwnProperty('fomPriceMin')) {
                            addObj.data.qSEnty.push({productId: obj.id, productName: obj.name, price: tobj.fobPriceStart,
                                priceCurrency: obj.fobPriceCurrency, orderQuantity: obj.minOrderQuantity, amount: 0,
                                quantityUnit: obj.minOrderQuantityUnit, productPhoto: (obj.productPhoto || obj.imgs)});
                        } else {
                            addObj.data.qSEnty.push({productId: obj.id, productName: obj.productName, price: obj.price,
                                priceCurrency: obj.priceCurrency, orderQuantity: obj.orderQuantity, amount: obj.amount,
                                quantityUnit: obj.quantityUnit, productPhoto: (obj.productPhoto || obj.imgs)});
                        }
                        break;
                    }
                }
                var html = '';
                if (obj && obj.id) {
                    var _remark = obj.remark, _quantity = {}, _price = {}, _name = '', _imgs = obj.productPhoto || obj.imgs;
                    if (tobj && tobj.hasOwnProperty('fomPriceMin')) {
                        _name = obj.name;

                        _quantity.quantity = (tobj.minOrderQuantity || 0);
                        _quantity.qunit = (tobj.minOrderQuantityUnit || -1);

                        _price.price = (tobj.fomPriceMin || 0);
                        _price.punit = (tobj.fomPriceCurrency || -1);
                    } else {
                        _name = obj.productName;

                        _quantity.quantity = (obj.orderQuantity || 0);
                        _quantity.qunit = (obj.quantityUnit || -1);

                        _price.price = (obj.price || 0);
                        _price.punit = (obj.priceCurrency || -1);
                    }
                    html = '<ul class="quo-table-info" data-id="' + obj.id + '">\
                                <li>' + addObj.count + '</li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="pi-name" name="pi-name" value="' + _name + '" />\
                                    </div>\
                                </li>\
                                <li><img src="' + _imgs + '" alt="图片"></li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="pi-fobPrice" name="pi-fobPrice" value="' + _price.price + '" />\
                                        <div class="quo-select">\
                                            <label><span data-id="' + _quantity.qunit + '" class="qunit">请选择</span><i class="s-updownBg s-up3"></i></label>\
                                            <ul class="moq-unit"></ul>\
                                        </div>\
                                        <div class="quo-select">\
                                            <label><span data-id="' + _price.punit + '" class="punit">请选择</span><i class="s-updownBg s-up3"></i></label>\
                                            <ul class="fob-price-unit"></ul>\
                                        </div>\
                                    </div>\
                                </li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="pi-quantity" name="pi-quantity" value="' + _quantity.quantity + '" />\
                                    </div>\
                                </li>\
                                <li>\
                                    <div><input type="text" class="pi-amount" name="pi-amount" data-val="0" value="$0" /></div>\
                                </li>\
                                <div class="clear"></div><i class="s-updownBg s-del2"></i>\
                            </ul>';
                    var $tt = $('.quo-table-title');
                    var $info = $tt.nextAll('.quo-table-info');
                    if ($info.length > 0) {
                        $info.eq($info.length - 1).after(html);
                    } else {
                        $tt.after(html);
                    }
                    $('.quo-table-info img').error(function () {
                        $(this).attr('src', '../images/user.jpg');
                    });
                    $('.quo-table-info img').load(function () {
                        $.cutImage(this, 100, 100);
                    });


                    var $infos = $('.quo-table-info'), _self;
                    $infos.each(function () {
                        if (obj.id == $(this).attr('data-id')) {
                            _self = $(this);
                            return false;
                        }
                    });
                    if (addObj.unit.quantity.length > 0) {
                        addObj.showDicts2(addObj.unit.quantity, _self.find('.moq-unit'), _quantity.qunit);
                    } else {
                        addObj.getDicts('unit', _self.find('.moq-unit'), _quantity.qunit);
                    }
                    if (addObj.unit.price.length > 0) {
                        addObj.showDicts2(addObj.unit.price, _self.find('.fob-price-unit'), _price.punit);
                    } else {
                        addObj.getDicts('currency', _self.find('.fob-price-unit'), _price.punit);
                    }
                    addObj.amountPrice($('.quo-box>.quo-table-info').eq($infos.length - 1));
                    var sum = addObj.sumPrice();
                    $('.pi-total').val('$ ' + sum + ' USD');
                    $addForm.find('#order-price').val(sum);
                    addObj.count++;
                }
            },
            /*
             * @getResourceSettings 获取报价单列表
             * @dictResourceSettingType 400(产品分组设置) 500(报价单头模板设置) 501(报价单尾模板设置)
             */
            getResourceSettings: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/info/list',
                    type: 'GET',
                    data: proPageObj,
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    complete: function () {
                        $.UnblockUI();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data.results;
                        var html = '';
                        if (data != null && data != '') {
                            addObj.productList = data;
                            for (var i = 0; i < data.length; i++) {
                                html += '<li data-id="' + data[i].id + '"><input type="checkbox" id="checkbox' + i + '" name="model-checkbox">&nbsp;<label for="checkbox' + i + '" style="display: inline-block;margin-left: 5px;margin-top: 5px;width: 500px;text-overflow: ellipsis;overflow: hidden;white-space: nowrap;">' + data[i].name + '</label></li>';
                            }
                        } else {
                            html += '<div class="text-center">暂无产品</div>';
                        }
                        $('#products .product-list').empty().append(html);
                        var total = res.data.totalItem;
                        var all = Math.ceil(total / proPageObj.pageSize);
                        $.Page({
                            total: total,
                            _class: '.product-page',
                            nowNum: proPageObj.currentPage,
                            allNum: all,
                            callback: function (now, all) {
                                proPageObj.currentPage = now;
                                addObj.getResourceSettings();
                            }
                        })
                    }
                });
            },
            //获取产品分组
            getProductsGroup: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/catelog/list',
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var list = '<option value="">全部</option>';
                        for (var i = 0; i < data.length; i++) {
                            list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                        }
                        $(".product-group-check select").empty().append(list);
                    }
                })
            },
            //获取产品类型
            getProductsType: function(_type, _doc){
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid='+_type,
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data,
                            list = '<option value="">全部</option>';
                        for (var i = 0; i < data.length; i++) {
                            list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                        }
                        if(_doc){//写入下一级品类
                            _doc.parent().next().find('select').empty().append(list);
                        }else{
                            $("#product-type0").empty().append(list);
                        }
                    }
                })
            }
        };

        var editors = {
            order: null,
            /*
             * @createEditor 初始化编辑器
             */
            createEditor: function () {
                var toolbar = [
                    [
                        'emotion', //表情
                        'fontfamily', //字体
                        'fontsize', //字号
                        'forecolor', //字体颜色
                        'backcolor', //背景色
                        '|',
                        'bold', //加粗
                        'italic', //斜体
                        '|',
                        'underline', //下划线
                        'strikethrough', //删除线
                        '|',
                        'fontborder', //字符边框
                        '|',
                        'subscript', //下标
                        'superscript', //上标
                        '|',
                        'formatmatch', //格式刷
                        '|',
                        'insertorderedlist', //有序列表
                        'insertunorderedlist', //无序列表
                        'justifyleft', //居左对齐
                        'justifyright', //居右对齐
                        'justifycenter', //居中对齐
                        'justifyjustify', //两端对齐
                        '|',
                        'source' //源代码
                    ]
                ];
                editors.order = UE.getEditor('orderEditor', {
                    'toolbars': toolbar,
                    'initialFrameWidth': "100%",
                    'elementPathEnabled': false,
                    'autoHeightEnabled': false,
                    'initialFrameHeight': 200
                });
            },
            //  上传附件
            uploadImg: function (name, obj, type) {
                obj.ajaxForm({
                    url: Base.sitUrl + '/api/file/upload',
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    complete: function () {
                        $.UnblockUI();
                        $addForm.find('#form_img').eq(0)[0].reset();
                        $addForm.find('#form_file').eq(0)[0].reset();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var url = res.data;
                        if (type == 'file') {
                            if (url.length > 0) {
                                url = url.substr(url.indexOf('meorient/') + 9);
                            }
                            var html = '<li data-url="' + url + '"><span>' + name + '</span><i class="s-updownBg s-dels2 pull-right"></i></li>';
                            $('.file-list').append(html);
                        } else {
                            var img = '<img src="http://' + url + '" alt="插入图片">';
                            editors.order.setContent(img, true);
                        }
                    }
                }).submit();
            },
            fileLimit: function (obj) {
                var flag = true;
                var fileObj = obj.prop('files');
                var size = Math.round(fileObj[0].size / 1024 * 100) / 100 / 1024;//MB
                if (size > 1) {
                    $.Alert('上传附件需小于1MB');
                    flag = false;
                }
                return {flag: flag, name: fileObj[0].name};
            }
        };
        $.when(editors.createEditor(), addObj.getOrderDefined())
            .then(addObj.getNo())
            .then(addObj.getDicts('currency', $('#o-price,#o-payfor')))
            .then(addObj.getCounterman())
            .then(addObj.getResourceSettings())
            .then(addObj.getOrderById())
            .then(addObj.getCustomList())
            .then(addObj.getCustomGroups())
            .then(addObj.getProductsType(0))
            .then(addObj.getProductsGroup());
        addObj.getPIByid();
    });
});