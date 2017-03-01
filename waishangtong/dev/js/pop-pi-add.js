/* !
 *  添加PI
 */
require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform', 'datetimepickerCN'], function (maintab, ZeroClipboard) {
        window['ZeroClipboard'] = ZeroClipboard;

        var itemId = parseInt($.GetQueryString('id')),
            pId = parseInt($.GetQueryString('pId')),
            itemType = parseInt($.GetQueryString('type')),
            custId = parseInt($.GetQueryString('custId')),
            pIdx = Number($.GetQueryString('pIdx')),
            $addForm = $('#addPIForm');
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                language: 'zh-CN',
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                format: "yyyy-mm-dd",
                bootcssVer: 3//因为html里的写法不规范，所以必须要加上这个时间插件才能正常显示
            });
        }
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

        var getData = {
            piInfo: {},
            //  记录报价单头
            quoHead: [],
            //  记录报价单尾
            quoFoot: [],
            //  记录客户列表
            custList: [],
            getCustInfo: {},
            //  记录产品快照列表
            productList: [],
            //  记录商品快照集合
            data: {iSEnty: [], qSEnty: []},
            //  记录产品单位
            unit: {price: [], quantity: []}
        };

        $addForm.on('click', '.form-info .model-select', function (e) {
            $.EventFn(e);
            var $ul = $(this).children('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
                $ul.addClass('active');
            }
        });
        $addForm.on('click', '.form-info .model-select>ul>li', function (e) {
            $.EventFn(e);
            var $ul = $(this).parent(),
                $label = $ul.prev(),
                id = $(this).attr('data-id'),
                txt = $(this).text(),
                tmp = '',
                list = getData.quoHead;
            $ul.prev('label').text(txt);
            $ul.removeClass('active');
            if ($label.attr('id') == 'quoHead') {
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        tmp = list[i].content;
                        break;
                    }
                }
                tmp = tmp.replace(/&#39;/g, "\"")
                editors.head.setContent(tmp, false);
            } else if ($label.attr('id') == 'quoFoot') {
                list = getData.quoFoot;
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        tmp = list[i].content;
                        break;
                    }
                }
                tmp = tmp.replace(/&#39;/g, '\"')
                editors.foot.setContent(tmp, false);
            }
        });

        var userObj = {};
        var storage = localStorage.getItem('__userInfo');
        if (storage) {
            userObj.name = storage.substr(0, storage.indexOf(';'));
            userObj.id = parseInt(storage.substr(storage.indexOf(';') + 1).substr(0, storage.substr(storage.indexOf(';') + 1).indexOf(';')));
        }
        $('#pi-seller').val(userObj.name);

        $addForm.on('click', '.editors>i.s-img', function () {
            editors.type = $(this).attr('data-type');
            $('#upImgs').click();
        });
        $addForm.on('click', '#btn-seal', function (e) {
            $.EventFn(e);

            editors.type = 'seal';
            $('#upImgs').click();
        });
        $addForm.on('click', '.info-group>a', function (e) {
            $.EventFn(e);

            $addForm.find('.seal-img>img').remove();
            $(this).removeClass('active');
        });
        $addForm.on('change', '#upImgs', function () {
            editors.uploadImg();
        });
        //  删除产品快照
        $addForm.on('click', '.quo-box i.s-del2', function (e) {
            $.EventFn(e);

            $(this).closest('.quo-table-info').remove();
            var id = $(this).closest('ul').attr('data-id');
            var list = getData.data.qSEnty;
            for (var i = 0; i < list.length; i++) {
                if (id == list[i].productId) {
                    list.splice(i, 1);
                }
            }
            getData.data.qSEnty = list;
            addObj.amountPrice($(this).closest('.quo-table-info'));
            var sum = addObj.sumPrice();
            $('.pi-total').val('$ ' + sum + ' USD');
        });
        //  计算总价
        $addForm.on('blur', '.quo-box .pi-fobPrice,.quo-box .pi-quantity', function (e) {
            $.EventFn(e);

            addObj.amountPrice($(this).closest('.quo-table-info'));
            var sum = addObj.sumPrice();
            $('.pi-total').val('$ ' + sum + ' USD');
        });
        $addForm.on('blur', '.quo-box .pi-amount', function (e) {
            $.EventFn(e);

            var sum = addObj.sumPrice();
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
        $('.form-info').on('blur', '>input', function () {
            var id = $(this).attr('id');
            if (id == 'pi-name') {
                $.errorsFn($(this), '请输入PI单名称');
            } else if (id == 'custName') {
                //$.errorsFn($(this), '请选择客户');
            }
        });

        //  保存PI单
        $addForm.on('click', '#pi-save', function () {
            var data = {}, flag = true,
                $name = $addForm.find('#pi-name'),
                $custName = $addForm.find('#custName'),
                custId1 = $custName.attr('data-id'),
                list = getData.data.qSEnty;
            if (itemId) {
                data = getData.piInfo;
            }
            if (itemType == 0) {
                delete data.id;
            }
            if (custId1 == undefined) {
                $custName.val('');
            }
            flag = $.errorsFn($name, '请输入PI单名称');
            flag = $.errorsFn($custName, '请选择客户');
            if ($addForm.find('.quo-table-info').length == 0) {
                $.Alert('请添加产品');
                flag = false;
            }
            if ($('#the-seller').val() == '') {
                $.Alert('请输入PI卖家');
                return
            }
            if ($('#the-buyer').val() == '') {
                $.Alert('请输入PI买家');
                return
            }
            var getProInfo = $('.quo-table-info');
            for(var i =0;i<getProInfo.length;i++){
                var $info = getProInfo.eq(i);
                var list = getData.data.qSEnty;

                list[i].productName = $info.find('.pi-name').val();
                list[i].price = parseFloat($info.find('.pi-fobPrice').val());
                list[i].priceCurrency = parseInt($info.find('.fob-price-unit').prev().children('span').attr('data-id'));
                list[i].quantityUnit = parseInt($info.find('.moq-unit').prev().children('span').attr('data-id'));
                list[i].orderQuantity = parseInt($info.find('.pi-quantity').val());
                list[i].amount = parseFloat($info.find('.pi-amount').val().substr(1));
            }
            getData.data.qSEnty = list;
            data.name = $name.val();
            data.customerId = parseInt($custName.attr('data-id'));
            data.customerName = $custName.val();
            data.piNo = $addForm.find('.quotation-no').text();
            data.freight = $addForm.find('.pi-freight').val();
            data.termOfPayment = $addForm.find('.pi-payment').val();
            data.termOfDelivery = $addForm.find('.pi-delivery').val();
            data.dateOfDelivery = $addForm.find('.pi-dDate').val();
            data.total = addObj.sumPrice();
            data.toAddress = $addForm.find('#pi-addr').val();
            data.seller = $addForm.find('#pi-seller').val();
            data.piDate = $addForm.find('#pi-date').val();
            data.header = editors.head.getContent();
            data.tail = editors.foot.getContent();
            data.buyerSignature = $addForm.find('#the-buyer').val();
            data.sellerSignature = $addForm.find('#the-seller').val();
            data.productPiDetails = getData.data.qSEnty;

            if($('.seal-img').find('img').length>0){
                data.companyLogo = $('.seal-img img').attr('src');
            }
            if (flag) {
                addObj.savePI(data);
            }
        });

        //  展现客户面板
        $addForm.on('click', '#custName', function (e) {
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
                $('#custName').val(getChecked.next().text()).attr('data-id',getChecked.val());
                $('.custName').text(getChecked.next().text());
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
                val = 0
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
                    addObj.addProductItem(checkedId)
                }
                $('#products').modal('hide');
            }else{
                $.Alert('请至少选择一个产品！');
            }
        });
        var addObj = {
            count: 1,
            /*
             * @savePI 保存PI单
             * @piEntity 1(pi实体)
             */
            savePI: function (piEty) {
                var url = Base.sitUrl + '/api/pi/v1/pi/save';
                if (itemType == 1) {
                    url = Base.sitUrl + '/api/pi/v1/pi/edit';
                }
                $.ajax({
                    url: url,
                    data: {
                        data: JSON.stringify(piEty)
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('pi保存失败,' + res.message);
                            return;
                        }
                        if (custId) {
                            $.Alert('PI保存成功！', '', function () {
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
            /*
             * @getPIById 根据id获取报价单信息
             * @id 报价单id
             */
            getPIById: function () {
                if (itemId) {
                    $.ajax({
                        url: Base.sitUrl + '/api/pi/v1/pi/detail',
                        data: {
                            id: itemId
                        },
                        type: 'POST',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.unLogin(res);
                                return;
                            }
                            var obj = res.data,
                                list = obj.productPiDetails;
                            //后台返回，但是没用的东西
                            delete obj.createTime;
                            delete obj.updateTime;
                            getData.piInfo = obj;
                            $addForm.find('#pi-name').val(obj.name);
                            editors.head.setContent(obj.header, false);
                            editors.foot.setContent(obj.tail, false);
                            $addForm.find('#custName').attr('data-id', obj.customerId).val(obj.customerName || '');
                            $addForm.find('.custName').text(obj.customerName || '');
                            $addForm.find('#pi-seller').val(obj.seller);
                            $addForm.find('#pi-date').val(obj.piDate || '');
                            $addForm.find('#pi-addr').val(obj.toAddress);

                            $addForm.find('.pi-freight').val(obj.freight);
                            $addForm.find('.pi-payment').val(obj.termOfPayment);
                            $addForm.find('.pi-delivery').val(obj.termOfDelivery);
                            $addForm.find('.pi-dDate').val(obj.dateOfDelivery);
                            $addForm.find('.pi-total').val('$ ' + obj.total + ' USD');

                            $addForm.find('#the-seller').val(obj.sellerSignature);
                            $addForm.find('#the-buyer').val(obj.buyerSignature);

                            if (list.length > 0) {
                                for (var i = 0; i < list.length; i++) {
                                    addObj.addProductItem(list[i].id, list);
                                }
                                var $info = $addForm.find('.quo-table-info');
                                for (var j = 0; j < list.length; j++) {
                                    $info.eq(j).children('li').eq(1).find('.pi-name').val(list[j].productName);
                                    $info.eq(j).children('li').eq(3).find('.pi-fobPrice').val(list[j].price);
                                    $info.eq(j).children('li').eq(3).find('.moq-unit').prev().children('span').attr('data-id', list[j].quantityUnit);
                                    $info.eq(j).children('li').eq(4).find('.pi-quantity').val(list[j].orderQuantity);
                                    $info.eq(j).children('li').eq(3).find('.fob-price-unit').prev().children('span').attr('data-id', list[j].priceCurrency);
                                    $info.eq(j).children('li').eq(5).find('.pi-amount').val('$' + list[j].amount);
                                }
                            }
                        }
                    });
                }
            },
            /*
             * @getProductById 根据id获取产品信息
             * @pId 产品id
             */
            getProductById: function () {
                if (pId) {
                    $.ajax({
                        url: Base.sitUrl + '/api/product/v1/product/get',
                        data: {id: pId},
                        type: 'POST',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.Alert('获取产品信息失败,' + res.message);
                                return;
                            }
                            var obj = res.data;
                            getData.productList.push(obj);
                            addObj.addProductItem(pId);
                        }
                    });
                }
            },
            /*
             * @getCustomList 获取客户列表
             * @block -客户分组，-1=全部，0=无分组
             */
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
             * @getDicts 获取报价单列表
             * @dictDictType 1(单位)
             */
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
                        var list = res.data;
                        if (list.length > 0) {
                            if (type == 'currency') {
                                getData.unit.price = list;
                            } else if (type == 'unit') {
                                getData.unit.quantity = list;
                            }

                            addObj.showDicts(list, type, obj);
                        }
                    }
                });
            },
            showDicts: function (data, type, obj) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += '<li data-id="' + data[i].id + '">' + data[i].value + '</li>';
                }
                obj.empty();
                obj.append(html);
            },
            showDicts2: function (data, obj) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += '<li data-id="' + data[i].id + '">' + data[i].value + '</li>';
                }
                obj.empty().append(html);
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
                    beforeSend: function (XHR) {
                        $.BlockUI();
                    },
                    complete: function (XHR, TS) {
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
                            getData.productList = data;
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
            },
            getStyle: function (obj, type) {
                var url = Base.sitUrl + '/api/pi/v1/pi/head/list';
                if (type == 2) {
                    url = Base.sitUrl + '/api/pi/v1/pi/tail/list';
                }
                $.ajax({
                    url: url,
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data,
                            html = '';

                        if (list.length > 0) {
                            if (type == 1) {
                                getData.quoHead = list;
                            } else if (type == 2) {
                                getData.quoFoot = list;
                            }
                            for (var i = 0; i < list.length; i++) {
                                html += '<li data-id="' + list[i].id + '">' + list[i].name + '</li>';
                            }

                            obj.empty().append(html);
                        }
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
                var list = getData.productList;
                if (data) {
                    list = data;
                }
                var obj = {};
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        obj = list[i];
                        var tobj = obj.productTradeInfoEnter;
                        if (tobj && tobj.fomPriceMin) {
                            getData.data.qSEnty.push({productId: obj.id, productName: obj.name, price: tobj.fomPriceMin,
                                priceCurrency: tobj.fomPriceCurrency, quantityUnit: tobj.minOrderQuantityUnit, productPhoto: (obj.productPhoto || obj.imgs),
                                orderQuantity: tobj.minOrderQuantity, remark: obj.remark});
                        } else {
                            getData.data.qSEnty.push({productId: obj.id, productName: obj.productName, price: obj.price, productPhoto: (obj.productPhoto || obj.imgs),
                                priceCurrency: obj.priceCurrency, quantityUnit: obj.quantityUnit,
                                orderQuantity: obj.orderQuantity, remark: obj.remark});
                        }
                        break;
                    }
                }
                var html = '';
                if (obj && obj.id) {
                    var img = obj.productPhoto || obj.imgs,
                        _price = 0,
                        _qunit = -1,
                        _fcurrency = -1,
                        _quantity = 0;
                    if (tobj && tobj.fomPriceMin) {
                        _price = tobj.fomPriceMin || 0,
                            _qunit = tobj.minOrderQuantityUnit || -1,
                            _fcurrency = tobj.fomPriceCurrency || -1,
                            _quantity = tobj.minOrderQuantity || 0;
                    } else {
                        _price = obj.price || 0,
                            _fcurrency = obj.priceCurrency || -1,
                            _qunit = obj.quantityUnit || -1,
                            _quantity = obj.orderQuantity || 0;
                    }
                    html = '<ul class="quo-table-info" data-id="' + (obj.productId || id) + '">\
                                <li>' + addObj.count + '</li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="pi-name" value="' + obj.name + '" />\
                                    </div>\
                                </li>\
                                <li><img src="' + img + '" alt="图片"></li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="pi-fobPrice" value="' + _price + '" />\
                                        <div class="quo-select">\
                                            <label><span data-id="' + _qunit + '">请选择</span><i class="s-updownBg s-up3"></i></label>\
                                            <ul class="moq-unit"></ul>\
                                        </div>\
                                        <div class="quo-select">\
                                            <label><span data-id="' + _fcurrency + '">请选择</span><i class="s-updownBg s-up3"></i></label>\
                                            <ul class="fob-price-unit"></ul>\
                                        </div>\
                                    </div>\
                                </li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="pi-quantity" value="' + _quantity + '" />\
                                    </div>\
                                </li>\
                                <li>\
                                    <div><input type="text" class="pi-amount" data-val="0" value="$0" /></div>\
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

                    $('.quo-table-info img').load(function () {
                        $.cutImage(this, 100, 100);
                    });
                    if (getData.unit.price.length > 0) {
                        addObj.showDicts2(getData.unit.quantity, $('.moq-unit'));
                        addObj.showDicts2(getData.unit.quantity, $('.fob-quantity-unit'));
                        addObj.showDicts2(getData.unit.price, $('.fob-price-unit'));
                    } else {
                        addObj.getDicts('unit', $('.moq-unit,.fob-quantity-unit'));
                        addObj.getDicts('currency', $('.fob-price-unit'));
                    }
                    var $infos = $('.quo-table-info');
                    addObj.amountPrice($('.quo-box>.quo-table-info').eq($infos.length - 1));
                    var sum = addObj.sumPrice();
                    $('.pi-total').val('$ ' + sum + ' USD');
                    addObj.count++;
                }
            },
            getNo: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/odd/v1/get',
                    type: 'GET',
                    dataType: 'json',
                    data: {data: "{'type': 2}"},
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('生成PIID失败,' + res.message);
                            return;
                        }

                        $addForm.find('.quotation-no').text(res.data);
                    }
                });
            }
        };

        var editors = {
            head: null,
            foot: null,
            type: null,
            /*
             * @createEditor 初始化编辑器
             */
            createEditor: function () {
                var editorToolbar = [
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
                        'source', //源代码
                    ]
                ];
                editors.head = UE.getEditor('headEditor', {
                    'toolbars': editorToolbar,
                    'initialFrameWidth': "100%",
                    'elementPathEnabled': false,
                    'autoHeightEnabled': false,
                    'initialFrameHeight': 200
                });
                editors.foot = UE.getEditor('footEditor', {
                    'toolbars': editorToolbar,
                    'initialFrameWidth': "100%",
                    'elementPathEnabled': false,
                    'autoHeightEnabled': false,
                    'initialFrameHeight': 200
                });
            },
            //  上传图片
            uploadImg: function (obj, sign) {
                if (sign) {
                    editors.type == null;
                }

                $('#form_img').ajaxForm({
                    url: Base.sitUrl + '/api/file/upload',
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    complete: function () {
                        $.UnblockUI();
                        $addForm.find('#form_img').eq(0)[0].reset();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var url = 'http://' + res.data;
                        if (editors.type) {
                            var img = '<img src="' + url + '" alt="插入图片">';
                            if (editors.type == 'head') {
                                editors.head.setContent(img, true);
                            } else if (editors.type == 'foot') {
                                editors.foot.setContent(img, true);
                            } else {
                                $addForm.find('.seal-img').append(img);
                                $addForm.find('.info-group>a').addClass('active');
                                editors.initImg();
                            }
                        }
                    }
                }).submit();
            },
            //  重置图片
            initImg: function () {
                $addForm.find('.seal-img>img').load(function () {
                    $.cutImage(this, 130, 100);
                });
            }
        };
        $.when(editors.createEditor())
            .then(addObj.getNo())
            .then(addObj.getStyle($addForm.find('#quoHead').next(), 1))
            .then(addObj.getStyle($addForm.find('#quoFoot').next(), 2))
            .then(addObj.getResourceSettings())
            .then(addObj.getPIById())
            .then(addObj.getCustomList())
            .then(addObj.getCustomGroups())
            .then(addObj.getProductsType(0))
            .then(addObj.getProductsGroup());
        addObj.getProductById();
    });
});