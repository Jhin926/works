/* !
 *  添加报价单1050761476
 */
require([ 'common' ], function () {
    require(['maintab', 'ZeroClipboard', 'ueditorLang', 'blockUI', 'jqform', 'datetimepickerCN'], function (maintab, ZeroClipboard) {
        window['ZeroClipboard'] = ZeroClipboard;

        var itemId = parseInt($.GetQueryString('id')),
            pId = parseInt($.GetQueryString('pId')),
            itemType = parseInt($.GetQueryString('type')),
            custId = parseInt($.GetQueryString('custId')),
            //contId = parseInt($.GetQueryString('contId')),
            pIdx = Number($.GetQueryString('pIdx')),
            $addForm = $('#addQuoForm');
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
        var storage = localStorage.getItem('__userInfo'),
            userObj = {};
        if (storage) {
            userObj.id = parseInt(storage.substr(storage.indexOf(';') + 1));
            userObj.name = storage.substr(0, storage.indexOf(';'));
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
            //  记录报价单详情
            quoInfo: {},
            //  记录报价单头
            quoHead: [],
            //  记录报价单尾
            quoFoot: [],
            //  记录客户列表
            custList: [],
            //客户信息
            getCustInfo: {},
            //  记录产品快照列表
            productList: [],
            //  记录商品快照集合
            data: {iSEnty: [], qSEnty: []},
            //  记录产品单位
            unit: {price: [], quantity: []}
        };
        $addForm.on('blur', '.form-info #q-name,.form-info #custName', function (e) {
            $.EventFn(e);
            if ($(this).attr('id') == 'q-name') {
                $.errorsFn($(this), '报价单名称不能为空');
            } else if ($(this).attr('id') == 'custName') {
                //$.errorsFn($(this), '客户名称不能为空');
            }
        });


        $addForm.on('click', '.model-select', function (e) {
            $.EventFn(e);
            var $ul = $(this).children('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
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
            if ($label.attr('id') == 'quoHead') {
                var list = getData.quoHead;
                var html = '';
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        html = list[i].content;
                        break;
                    }
                }
                html = html.replace(/&#39;/g, '\"')
                editors.head.setContent(html, false);
            } else if ($label.attr('id') == 'quoFoot') {
                var list = getData.quoFoot;
                var html = '';
                for (var i = 0; i < list.length; i++) {
                    if (id == list[i].id) {
                        html = list[i].content;
                        break;
                    }
                }
                html = html.replace(/&#39;/g, '\"')
                editors.foot.setContent(html, false);
            }
        });
        $('#quo-seller').val(userObj.name);

        $('.quo-add-price').append('<input type="checkbox" id="quo-add-sumPrice" /><span>不生成总价</span>');
        //  不生成总价
        $('.quo-add-price').on('click', '>input', function () {
            if ($(this).attr('checked')) {
                $(this).attr('checked', false);
                $('.quo-add-price').prevAll().removeAttr('style');
            } else {
                $(this).attr('checked', true);
                $('.quo-add-price').prevAll().hide();
            }
        });
        $addForm.on('dblclick', '.quo-sum-price', function (e) {
            $.EventFn(e);

            if (!$(this).hasClass('active')) {
                $('.edit-quoSumPrice').val($(this).text());
                $('.edit-quoSumPrice').addClass('active');
                $(this).addClass('active');
            }
        });
        $addForm.on('keydown', '.edit-quoSumPrice', function (e) {
            var _ev = e || window.event;
            _ev.stopPropagation();

            this.size = this.value.length + 2;
        });
        $addForm.on('keypress', '.edit-quoSumPrice', function (e) {
            var _ev = e || window.event;
            _ev.stopPropagation();

            if (_ev.keyCode == 13 || _ev.charCode == 13) {
                $('.quo-sum-price').text($(this).val());
                $(this).removeClass('active');
                $('.quo-sum-price').removeClass('active');
            }
        });

        $addForm.on('click', '#headEditor>i.s-img,#footEditor>.s-img', function (e) {
            $.EventFn(e);
            editors.type = $(this).attr('data-type');
            $('#upImgs').click();
        });
        $addForm.on('change', '#upImgs', function (e) {
            $.EventFn(e);
            editors.uploadImg();
        });
        //  删除产品快照
        $addForm.on('click', '.quo-box i.s-del2', function (e) {
            $.EventFn(e);

            $(this).closest('.quo-table-info').remove();
            var id = $(this).closest('ul').attr('data-id'),
                list = $('.quo-table-info').length;

            var list = getData.data.qSEnty;
            for (var i = 0; i < list.length; i++) {
                if (id == list[i].productId) {
                    list.splice(i, 1);
                }
            }
            getData.data.qSEnty = list;
            var sum = addObj.sumPrice();
            $('.quo-sum-price').text(sum);
        });
        $addForm.on('change', '.quo-box .quo-table-info>li>div>select', function (e) {
            $.EventFn(e);
            var idName = $(this).attr('id'),
                id = $(this).val(),
                name = $(this).find('option:selected').text();
        });
        //  计算总价
        $addForm.on('blur', '.quo-box .quo-moq,.quo-box .quo-fobPrice', function (e) {
            $.EventFn(e);
            var sum = addObj.sumPrice();
            $('.quo-sum-price').text(sum);
        });
        $addForm.on('click', '.quo-box .quo-select', function (e) {
            $.EventFn(e);
            var $ul = $(this).children('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
                $ul.addClass('active');
                if ($ul.children('li').length == 0) {
                    if ($ul.hasClass('moq-unit')) {
                        addObj.showDicts2(getData.unit.quantity, $('.moq-unit'));
                    } else if ($ul.hasClass('fob-price-unit')) {
                        addObj.showDicts2(getData.unit.price, $('.fob-price-unit'));
                    } else if ($ul.hasClass('fob-quantity-unit')) {
                        addObj.showDicts2(getData.unit.quantity, $('.fob-quantity-unit'));
                    }
                }
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
                var sum = addObj.sumPrice();
                $('.quo-sum-price').text(sum);
            }
        });

        //  保存报价单
        $addForm.on('click', '#quo-save', function (e) {
            $.EventFn(e);

            var data = {}, flag = true,
                $name = $addForm.find('#q-name'),
                $custName = $addForm.find('#custName'),
                $price = $addForm.find('.quo-sum-price'),
                lens = $addForm.find('.quo-table-info').length,
                list = getData.data.qSEnty, tmp = [];

            flag = $.errorsFn($name, '客户名称不能为空');
            flag = $.errorsFn($custName, '请选择客户');
            if (!lens) {
                $.Alert('请添加产品');
                flag = false;
            }
            if (itemId) {
                data = getData.quoInfo;
            }
            data.name = $name.val();
            data.customerId = $custName.attr('data-id');
            data.customerName = $custName.val();
            data.quotationNo = $addForm.find('.quotation-no').text();
            data.quotationDate = $addForm.find('#quo-date').val();
            if (!$price.attr('style')) {
                data.totalPrice = parseInt($price.text());
                data.generateTotalPrice = parseInt($price.text());
            } else {
                data.totalPrice = 0;
                data.generateTotalPrice = 0;
            }
            data.totalPriceUnit = 1;
            data.toAddress = $addForm.find('#quo-addr').val();
            data.seller = $addForm.find('#quo-seller').val();
            data.header = editors.head.getContent();
            data.tail = editors.foot.getContent();

            $addForm.find('.quo-table-info').each(function (j) {
                var $info = $(this);
                list[j].productName = $info.find('.quo-name').val();
                list[j].fobPrice = !($info.find('.quo-fobPrice').val()) ? 0 : parseFloat($info.find('.quo-fobPrice').val());
                list[j].fobPriceCurrency = parseInt($info.find('.fob-price-unit').prev().children('span').attr('data-id'));
                list[j].orderQuantity = !($info.find('.quo-moq').val()) ? 0 : parseInt($info.find('.quo-moq').val());
                list[j].remark = $info.find('.quo-remark').val();
            });
            /*for (var j = 0; j < list.length; j++) {
                if (tmp.indexOf(list[j].productId) == -1) {
                    list.splice(j, 1);
                } else {
                    var $info = $addForm.find('.quo-table-info').eq(j);
                    list[j].productName = $info.find('.quo-name').val();
                    list[j].fobPrice = !($info.find('.quo-fobPrice').val()) ? 0 : parseFloat($info.find('.quo-fobPrice').val());
                    list[j].fobPriceCurrency = parseInt($info.find('.fob-price-unit').prev().children('span').attr('data-id'));
                    list[j].orderQuantity = !($info.find('.quo-moq').val()) ? 0 : parseInt($info.find('.quo-moq').val());
                    list[j].remark = $info.find('.quo-remark').val();
                }
            }*/
            getData.data.qSEnty = list;
            data.productQuotationProductEnters = list;
            if (flag) {
                addObj.saveQuotation(data);
            }
        });
        //  展现客户面板
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
                $('#custName').val(getChecked.next().text());
                $('#custName').attr('data-id', getChecked.val());
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
            detailData: null,
            getNo: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/odd/v1/get',
                    type: 'GET',
                    data: {data: "{'type': 3}"},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('生成报价ID失败,' + res.message);
                            return;
                        }
                        $addForm.find('.quotation-no').text(res.data);
                    }
                });
            },
            /*
             * @saveQuotation 保存报价单
             * @quotationEntity 1(报价单实体)
             */
            saveQuotation: function (qEty) {
                var url = Base.sitUrl + '/api/quotation/v1/quotation/save';
                if (itemType == 1) {
                    url = Base.sitUrl + '/api/quotation/v1/quotation/edit';
                }
                $.ajax({
                    url: url,
                    data: {
                        data: JSON.stringify(qEty)
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('报价单保存失败,' + res.message);
                            return;
                        }
                        if (custId) {
                            $.Alert('报价单保存成功！', '', function () {
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
             * @getQuoInfoById 根据id获取报价单信息
             * @id 报价单id
             */
            getQuoInfoById: function () {
                if (itemId) {
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
                                qDate = '';
                            if (obj && obj.quotationDate) {
                                qDate = $.dateObj(obj.quotationDate)._getDatetime3();
                            }
                            //后台返回，但是没用的东西
                            delete obj.createTime;
                            delete obj.updateTime;

                            getData.quoInfo = obj;
                            $addForm.find('#q-name').val(obj.name);
                            $addForm.find('.quotation-no').val(obj.quotationNo);
                            $addForm.find('#custName').val(obj.customerName);
                            $addForm.find('#custName').attr('data-id', obj.customerId)
                            $addForm.find('.custName').text(obj.customerName);
                            $addForm.find('#quo-date').val(qDate);
                            $addForm.find('#quo-addr').val(obj.toAddress);
                            $addForm.find('.quo-sum-price').text(obj.totalPrice);
                            var p = '<p></p>' +
                                '<p></p>'
                            editors.head.setContent(p, false);
                            editors.foot.setContent(p, false);
                            editors.head.setContent(obj.header, true);
                            editors.foot.setContent(obj.tail, true);

                            var list = obj.productQuotationProductEnters,
                                $info;
                            if (list.length != 0) {
                                for (var i = 0; i < list.length; i++) {
                                    addObj.addProductItem(list[i].id, list);
                                    $info = $('.quo-table-info')
                                    $info.eq(i).children('li').eq(1).find('.quo-name').val(list[i].productName);

                                    $info.eq(i).children('li').eq(3).find('.quo-moq').val(list[i].orderQuantity);
                                    $info.eq(i).children('li').eq(3).find('.moq-unit').prev().children('span').text(list[i].minQuantityUnitName);
                                    $info.eq(i).children('li').eq(3).find('.moq-unit').prev().children('span').attr('data-id', list[i].orderQuantityUnit);

                                    $info.eq(i).children('li').eq(4).find('.quo-fobPrice').val(list[i].fobPrice);
                                    $info.eq(i).children('li').eq(4).find('.fob-price-unit').prev().children('span').attr('data-id', list[i].fobPriceCurrency);
                                    $info.eq(i).children('li').eq(4).find('.fob-quantity-unit').prev().children('span').attr('data-id', list[i].orderQuantityUnit);

                                    $info.eq(i).children('li').eq(5).find('.quo-remark').val(list[i].remark);
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
            //报价单列表
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
                var $unit = $('.quo-table-info:last .moq-unit'),
                    $punit = $('.quo-table-info:last .fob-quantity-unit'),
                    $price = $('.quo-table-info:last .fob-price-unit'),
                    tmp = {unit: ($unit.selector).split(' ')[1], price: ($price.selector).split(' ')[1], punit: ($punit.selector).split(' ')[1]};
                if (obj.selector.indexOf(',') != -1 && type == 1) {

                    if (obj.selector.indexOf(tmp.unit) != -1 && type == 1) {
                        $unit.prev('label').children('span').attr('data-id', data[0].id);
                        $unit.prev('label').children('span').text(data[0].name);
                        $unit.empty();
                        $unit.append(html);
                    }
                    if (obj.selector.indexOf(tmp.punit) != -1 && type == 1) {
                        $punit.prev('label').children('span').attr('data-id', data[0].id);
                        $punit.prev('label').children('span').text(data[0].name);
                        $punit.empty();
                        $punit.append(html);
                    }
                } else {
                    if (obj.selector.indexOf(tmp.price) != -1 && type == 0) {
                        $price.prev('label').children('span').attr('data-id', data[0].id);
                        $price.prev('label').children('span').text(data[0].name);
                        $price.empty();
                        $price.append(html);
                    }
                }
            },
            showDicts2: function (data, obj) {
                var html = '';
                for (var i = 0; i < data.length; i++) {
                    html += '<li data-id="' + data[i].id + '">' + data[i].value + '</li>';
                }
                obj.empty();
                obj.append(html);
                if (itemId && data.length > 0) {
                    obj.prev('label').children('span').attr('data-id', data[0].id);
                    obj.prev('label').children('span').text(data[0].value);
                }
            },
            /*
             * @getResourceSettings 获取报价单列表
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
                var url = Base.sitUrl + '/api/quotation/v1/quotation/head/list';
                if (type == 2) {
                    url = Base.sitUrl + '/api/quotation/v1/quotation/tail/list';
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
                    if (isNaN($(this).find('.quo-fobPrice').val()) || isNaN($(this).find('.quo-moq').val())) {
                        $.Alert('请输入正数');
                        return;
                    }
                    var fobPrice = parseFloat($(this).find('.quo-fobPrice').val()),
                        moqSum = parseInt($(this).find('.quo-moq').val()),
                        unit = $(this).find('.fob-price-unit').prev('label').children('span').text();

                    if (unit == 'CNY') {
                        fobPrice = fobPrice / 6.49;
                    }
                    sum += parseFloat(fobPrice * moqSum);
                });
                return parseFloat(sum).toFixed(2);
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
                            getData.data.qSEnty.push({productId: obj.id, productName: obj.name, productPhoto: (obj.productPhoto || obj.imgs), fobPrice: tobj.fomPriceMin, fobPriceCurrency: tobj.fomPriceCurrency, orderQuantity: tobj.minOrderQuantity, orderQuantityUnit: tobj.minOrderQuantityUnit, remark: obj.remark});
                        } else {
                            getData.data.qSEnty.push({productId: obj.id, productName: obj.name, productPhoto: (obj.productPhoto || obj.imgs), fobPrice: obj.fobPrice, fobPriceCurrency: obj.fobPriceCurrency, orderQuantity: obj.orderQuantity, orderQuantityUnit: obj.orderQuantityUnit, remark: obj.remark});
                        }
                        break;
                    }
                }
                var html = '';
                if (obj && obj.id) {
                    var _remark = obj.remark, _quantity = {}, _price = {}, _name = '', _imgs = (obj.productPhoto || obj.imgs);
                    if (tobj && tobj.fomPriceMin) {
                        _name = obj.name;

                        _quantity.quantity = (tobj.minOrderQuantity || 0);
                        _quantity.qunit = (tobj.minOrderQuantityUnit || -1);

                        _price.price = (tobj.fomPriceMin || 0);
                        _price.punit = (tobj.fomPriceCurrency || -1);
                    } else {
                        _name = obj.productName || '';

                        _quantity.quantity = (obj.orderQuantity || 0);
                        _quantity.qunit = (obj.orderQuantityUnit || -1);

                        _price.price = (obj.fobPrice || 0);
                        _price.punit = (obj.fobPriceCurrency || -1);
                    }
                    html = '<ul class="quo-table-info" data-id="' + obj.id + '">\
                                <li>' + addObj.count + '</li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="quo-name" value="' + _name + '"/>\
                                    </div>\
                                </li>\
                                <li><img src="' + _imgs + '" alt="图片"></li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="quo-moq" value="' + _quantity.quantity + '" data-unit="' + _quantity.qunit + '" />\
                                    </div>\
                                </li>\
                                <li>\
                                    <div>\
                                        <input type="text" class="quo-fobPrice" value="' + _price.price + '" data-type="' + _price.punit + '" />\
                                        <div class="quo-select">\
                                            <label><span data-id="-1">请选择</span><i class="s-updownBg s-up3"></i></label>\
                                            <ul class="fob-price-unit"></ul>\
                                        </div>\
                                        <div class="quo-select">\
                                            <label><span data-id="-1">请选择</span><i class="s-updownBg s-up3"></i></label>\
                                            <ul class="fob-quantity-unit"></ul>\
                                        </div>\
                                    </div>\
                                </li>\
                                <li>\
                                    <div><input type="text" class="quo-remark" value="' + _remark + '" /></div>\
                                </li>\
                                <div class="clear"></div><i class="s-updownBg s-del2"></i>\
                            </ul>';
                    var $tt = $('.quo-table-title');
                    var $info = $('.quo-table-title').nextAll('.quo-table-info');
                    if ($info.length > 0) {
                        $info.eq($info.length - 1).after(html);
                    } else {
                        $tt.after(html);
                    }
                    addObj.count++;

                    $('.quo-table-info img').error(function () {
                        $(this).attr('src', '../images/user.jpg');
                    });
                    $('.quo-table-info img').load(function () {
                        $.cutImage(this, 100, 100);
                    });
                    if (getData.unit.quantity.length == 0 || getData.unit.price.length == 0) {
                        addObj.getDicts('unit', $('.moq-unit,.fob-quantity-unit'));
                        addObj.getDicts('currency', $('.fob-price-unit'));
                    }
                    if (itemId) {
                        addObj.showDicts2(getData.unit.quantity, $('.moq-unit'));
                        addObj.showDicts2(getData.unit.quantity, $('.fob-quantity-unit'));
                        addObj.showDicts2(getData.unit.price, $('.fob-price-unit'));
                    }
                    var sum = addObj.sumPrice();
                    $('.quo-sum-price').text(sum);
                }
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
                        'source' //源代码
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
            uploadImg: function () {
                if (editors.type) {
                    $('#form_img').ajaxForm({
                        url: Base.sitUrl + '/api/file/upload',
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
                            var url = 'http://' + res.data;
                            var img = '<img src="' + url + '" alt="插入图片">';
                            if (editors.type == 'head') {
                                editors.head.setContent(img, true);
                            } else {
                                editors.foot.setContent(img, true);
                            }
                        }
                    }).submit();
                }
            }
        };
        $.when(editors.createEditor())
            .then(addObj.getNo())
            .then(addObj.getStyle($addForm.find('#quoHead').next(), 1))
            .then(addObj.getStyle($addForm.find('#quoFoot').next(), 2))
            .then(addObj.getResourceSettings())
            .then(addObj.getQuoInfoById())
            .then(addObj.getCustomList())
            .then(addObj.getCustomGroups())
            .then(addObj.getProductsType(0))
            .then(addObj.getProductsGroup());
        addObj.getProductById();
    });
}); 