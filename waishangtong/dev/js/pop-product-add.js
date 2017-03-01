require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'jqform', 'category', 'countries'], function () {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code]').each(function(){
            for(var i=0; i<funcList.length; i++){
                if(funcList[i].code == $(this).attr('data-code')){
                    $(this).removeClass('none');
                }
            };
        });

        var id = parseInt($.GetQueryString('id')),
            type = parseInt($.GetQueryString('type')),
            $addForm = $('#addProForm'),
            $outputForm = $('#outputForm');


        $('.pop-left').height($addForm.find('.box-form').eq(0).height());

        //  添加上传文件
        $addForm.on('change', 'input[name=upImg]', function () {
            var flag = proObj.fileLimit($(this));
            if (flag.flag) {
                proObj.uploadImg($('#form_img'));
            }
        });
        $addForm.on('change', 'input[name=upImgs]', function () {
            var flag = proObj.fileLimit($(this));
            if (flag.flag) {
                proObj.uploadImg($('#form_img2'));
            }
        });

        $addForm.on('click', '.model-select', function (e) {
            $.EventFn(e);
            var $ul = $(this).children('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
                $('.model-select>ul').removeClass('active');
                $ul.addClass('active');
            }
        });
        $('#p-group, #o-group, #fob-curr, #fob-unit, #sub-unit, #sub-time, #p-unit').next().on('click', 'li', function (e) {
            $.EventFn(e);

            var id = $(this).attr('data-id');
            $(this).parent().removeClass('active').prev().attr('data-id',id).text($(this).text());
        });

        $addForm.on('click', '.box-select .model-select>ul>li', function (e) {
            $.EventFn(e);

            var thisSelect = $(this).closest('.model-select'),
                id = $(this).attr('data-id'),
                idxSelect = thisSelect.index(),//选择的级数
                ids = proObj.subCategoryId;//选择过的id
            $(this).parent().removeClass('active').prev().attr('data-id',id).text($(this).text());

            ids.splice(idxSelect, ids.length-idxSelect, id);//获取选择的分类的id

            if(ids.length < 4){//选择4级之前的分类
                if(ids.length == 1){//选择了根目录
                    proObj.subCategory = category[ids[0]].sub;//二级子分类
                }else if(ids.length == 2){//选择了2级目录
                    proObj.subCategory = category[ids[0]].sub[ids[1]].sub;//三级子分类
                }else if(ids.length == 3){//选择了3级目录
                    proObj.subCategory = category[ids[0]].sub[ids[1]].sub[ids[2]].sub;//四级子分类
                }

                var list = proObj.subCategory,
                    html = '';

                var newSelect = $('<div class="model-select selects4 active"><i class="s-updownBg s-up3"></i><label data-id="-1">请选择产品类型</label><ul></ul></div>');
                if (typeof list === 'object') {//有下属分类
                    for(var item in list){
                        html += '<li data-id="' + item + '">' + list[item].cn_name + '</li>';
                    }
                    newSelect.children('ul').append(html);
                    thisSelect.addClass('active').nextAll().remove();
                    thisSelect.after(newSelect);
                }else {//无下属分类
                    $.ajax({
                        url: Base.sitUrl + '/api/ product/v1/product/type/param',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            data: JSON.stringify({id: id})
                        },
                        success: function (res) {
                            var parmLibray = (res.data).replace(/FALSE/g,false).replace(/'/g, '"');//单引号转成双引号，不然不能解析成object
                            var parmLibrayObj = JSON.parse(parmLibray);

                            var paramList = '';
                            for(var i=0;i<(parmLibrayObj.bindAttrjson).length;i++){
                                //固定值属性
                                paramList += '<div class="form-group pro-add-param">' +
                                    '<label for=""><span>'+ parmLibrayObj.bindAttrjson[i].data.value +'</span></label>' +
                                    '<div class="form-info"><span class="param-value">'+ parmLibrayObj.bindAttrjson[i].nodes[0].data.value +'</span></div></div>';
                            }
                            for(var j=0; j<(parmLibrayObj.sysAttrjson).length;j++){
                                var html = '';
                                var showType = parmLibrayObj.sysAttrjson[j].data.showType,
                                    showName = parmLibrayObj.sysAttrjson[j].data.value,
                                    convertShowName = showName.replace(/ /g,'-');
                                if(showType == 'input_string'){
                                    html = '<div class="form-group pro-add-param">' +
                                    '<label for="'+ convertShowName +'"><span>'+ showName +'</span></label>' +
                                    '<div class="form-info"><input id="'+ convertShowName +'" type="text" name="'+ convertShowName +'" class="inputs long-input param-value"></div></div>';
                                }else if(showType == 'input_int'){
                                    html = '<div class="form-group pro-add-param">' +
                                        '<label for="'+ convertShowName +'"><span>'+ showName +'</span></label>' +
                                        '<div class="form-info"><input id="'+ convertShowName +'" type="text" name="'+ convertShowName +'" class="inputs long-input param-value"></div></div>';
                                }else if(showType == 'list_box'){
                                    var nodesList = parmLibrayObj.sysAttrjson[j].nodes,
                                        nodesListHtml = '<option value="">请选择</option>';
                                    for(var i =0;i<nodesList.length;i++){
                                        nodesListHtml += '<option value="'+ nodesList[i].data.value +'">'+ nodesList[i].data.value +'</option>';
                                    }
                                    html = '<div class="form-group pro-add-param"><label for="'+ convertShowName +'"><span>'+ showName +'</span></label>' +
                                           '<div class="form-info"><div class="model-select long-input" style="border: none;">' +
                                        '<select class="form-control param-value" style="padding: 0;">'+ nodesListHtml +'</select></div></div></div>';
                                }else if(showType == 'check_box'){
                                    var nodesList = parmLibrayObj.sysAttrjson[j].nodes,
                                        nodesListHtml = '';
                                    for(var i =0;i<nodesList.length;i++){
                                        nodesListHtml += '<label><input type="checkbox" name="'+ nodesList[i].data.value +'" value="'+ nodesList[i].data.id +'"><span style="margin-right: 10px;">'+ nodesList[i].data.value +'</span></label>';
                                    }
                                    html = '<div class="form-group pro-add-param"><label for="'+ convertShowName +'"><span>'+ showName +'</span></label>' +
                                        '<div class="form-info param-value" style="max-width: 572px;">'+ nodesListHtml +'</div></div>';
                                }else if(showType == 'country'){//国家
                                    var countriesList = '<option data-id="-1">请选择</option>';
                                    for (var i = 0; i < countries.length; i++) {
                                        countriesList += '<option data-id="' + countries[i].id + '" value="' + $.countries[i].cn + '">' + $.countries[i].cn + '</option>';
                                    }

                                    html = '<div class="form-group pro-add-param">' +
                                        '<label for="'+ convertShowName +'"><span>'+ showName +'</span></label>' +
                                        '<div class="form-info"><div class="model-select long-input" style="border: none;"><select id="country" class="form-control param-value" style="padding: 0;">'+ countriesList +'</select></div></div></div>';
                                }
                                paramList += html;//需要选择或者输入值的属性
                            }
                            $('.pro-add-param').remove();
                            $('.pro-special-style').children('.form-title').after(paramList);
                        }
                    });
                }
            }
        });

        //  去除上传文件
        $addForm.on('click', '.form-info .up-shows>.up-btn>.s-dels', function () {
            $(this).closest('.up-shows').remove();
        });

        //  去除产品信息
        $addForm.on('click', '.fieldset .singles .form-info i.s-updownBg', function () {
            $(this).closest('.singles').remove();
        });

        //  去除添加参数
        $addForm.on('click', '.fieldset .form-group .s-del', function () {
            var id = $(this).attr('data-id');
            proObj.count = parseInt(id);
            $(this).closest('.form-group').remove();
        });

        //  添加参数
        $addForm.on('click', '#add-param', function (e) {
            $.EventFn(e);

            var html = '<div class="form-group singles">' +
                '<label><input type="text" class="inputs short-input" id="p_' + proObj.count + '" placeholder="参数名称"></label>' +
                '<div class="form-info">' +
                '<input type="text" id="input_' + proObj.count + '" class="inputs long-input2" placeholder="参数内容" />' +
                '<i class="s-updownBg s-del" data-id="' + proObj.count + '"></i>' +
                '</div>' +
                '</div>';

            $(this).closest('.form-group').before(html);
            proObj.count++;
        });

        $addForm.on('blur', '#p-name', function () {
            if ($(this).val() == null || $(this).val() == '') {
                $.errorsFn($(this), '请输入产品名称');
            } else {
                if ($(this).val().length > 512) {
                    $.Alert('字符数超出限制范围');
                }
                $(this).removeClass('error');
                $(this).next('.errors').removeClass('active');
            }
        });

        //  创建产品
        $addForm.on('click', '#pro-add', function () {
            var data = {}, data1 = {},
                $name = $addForm.find('[name="p-name"]');
            if (id) {
                data = proObj.data;
                if (!type) {
                    delete data.id;
                }
            }
            data.name = $name.val();
            var imgs = [];
            $addForm.find('.up-shows').each(function () {
                imgs.push({url: $(this).children('img').attr('src')});
            });
            if (imgs.length > 0) {
                data.imgs = imgs[0].url;
            } else {
                data.imgs = '';
            }
            data.pictures = imgs;
            var pgroup = parseInt($addForm.find('#p-group').attr('data-id'));
            if (pgroup != -1) {
                data.productCatelog = pgroup;
            } else {
                data.productCatelog = 1;
            }
            var flag = $.errorsFn($name, '请输入产品名称');
            if ($('.up-shows').length == 0) {
                flag = $.Alert('请上传至少一张图片');
            }

            //产品品类
            var getType = $('.box-select .model-select:last-child').find('label');
            data.productType = getType.attr('data-id');
            data.typeName = getType.text();

            //所有的参数
            var params = $('.pro-special-style').find('.pro-add-param');
            data.productInfo = {};
            params.each(function(){
                var typeName = $(this).find('label span').text(),
                    typeValueLabel = $(this).find('.param-value'),
                    typeValue;

                typeName = typeName.replace(/ /g, '-');
                if(typeValueLabel.length>0){
                    if(typeValueLabel[0].tagName=='SPAN'){//固定的值
                        typeValue = typeValueLabel.text();
                    }else if(typeValueLabel[0].tagName=='INPUT' && typeValueLabel.attr('type')=='text'){
                        typeValue = typeValueLabel.val();
                    }else if(typeValueLabel[0].tagName=='SELECT'){
                        typeValue = typeValueLabel.val();
                    }
                    data.productInfo[typeName] = typeValue;
                }
            });

            data.remark = $addForm.find('[name="p-remark"]').val();
            data.description = $addForm.find('[name="p-desc"]').val();
            var $singles = $addForm.find('.singles'),
                stmp = [];
            if ($singles.length > 0) {
                $singles.each(function () {
                    var lname = $(this).children('label').children('input').val();
                    var iname = $(this).children('div').children('input').val();
                    stmp.push({name: lname, value: iname});
                });
            }
            data.productParameters = stmp;

            data1.packagingDetails = $addForm.find('[name="p-details"]').val();
            data1.minOrderQuantity = $addForm.find('[name="p-min"]').val() || 0;
            data1.minOrderQuantityUnit = parseInt($addForm.find('#p-unit').attr('data-id'));
            data1.minOrderQuantityDesc = $addForm.find('.box-min input').val() || '';
            data1.port = $addForm.find('[name="p-Port"]').val();
            var payment = [];
            $addForm.find('.form-checkbox input[type=checkbox]:checked').each(function () {
                payment.push($(this).next().text());
            });
            data1.paymentTerm = payment.join(';');
            var fcurr = parseInt($addForm.find('#fob-curr').attr('data-id'));
            if (fcurr != -1) {
                data1.fomPriceCurrency = fcurr;
            } else {
                data1.fomPriceCurrency = 100020;
            }
            data1.fomPriceMin = !($addForm.find('[name="st-price"]').val()) ? 0 : parseFloat($addForm.find('[name="st-price"]').val()).toFixed(2);
            data1.fomPriceMax = !($addForm.find('[name="ed-price"]').val()) ? 0 : parseFloat($addForm.find('[name="ed-price"]').val()).toFixed(2);
            var funit = parseInt($addForm.find('#fob-unit').attr('data-id'));
            if (funit != -1) {
                data1.unit = funit;
            } else {
                data1.unit = 100200;
            }
            data1.supplyAblility = $addForm.find('[name="p-supply"]').val() || 0;
            var sunit = parseInt($addForm.find('#sub-unit').attr('data-id'));
            if (sunit != -1) {
                data1.supplyAblilityUnit = sunit;
            } else {
                data1.supplyAblilityUnit = 100200;
            }
            var stime = parseInt($addForm.find('#sub-time').attr('data-id'));
            if (stime != -1) {
                data1.supplyAblilityTime = stime;
            } else {
                data1.supplyAblilityTime = 100402;
            }
            data1.supplyAblilityDesc = $addForm.find('.box-ability input').val() || '';
            var delTime = $addForm.find('[name="p-deli-time"]').val();
            delTime = delTime.replace(/\D/g, '');
            data1.deliveryTime = delTime + '天';
            data.productTradeInfoEnter = data1;
            if (flag) {
                proObj.saveItem(data);
            }
        });

        //显示添加跟多说明输入框
        $('.min-info>a').on('click', function () {
            var html = '<div class="box-info">\
                            <input type="text" class="inputs long-input2" />\
                            <i class="s-updownBg s-del"></i>\
                        </div>';
            $(this).hide().after(html);
        });

        //隐藏添加更多说明按钮
        $('.min-info').on('click', 'i', function () {
            $(this).parent().prev().show();
            $(this).parent('.box-info').remove();
        });

        $outputForm.on('click', '.form-btn>button', function (e) {
            $.EventFn(e);

            var type = $(this).attr('data-type');
            if (type == 'download') {
                proObj.downloadOutputTemplate();
            } else if (type == 'upload') {

                $('#up-files').click();
            } else if (type == 'import') {
                proObj.importHistory();
            }
        });
        $outputForm.on('change', 'input[name=upFiles]', function () {
            var flag =  proObj.fileLimit($(this));
            if (flag.flag) {
                proObj.uploadImg($('#form_file'), 'upload', flag.name, flag.size);
                var type = $outputForm.find('.selects5.active');
                proObj.upObj.group = $outputForm.find('#o-group').attr('data-id');
                type.each(function () {
                    var _id = $(this).children('label').attr('data-id');
                    if (_id != -1) {
                        proObj.upObj.type = _id;
                    }
                });
            }
        });

        var proObj = {
            count: 0,
            data: {},
            typeList: {},
            upObj: {group: '', type: '', path: 'http://', taskName: '', fileName: '', fileSize: null},
            typeId: '',
            typeCount: 2,
            subCategoryId: [],
            subCategory: {},
            //  创建产品
            saveItem: function (itemEty) {
                var url = Base.sitUrl + '/api/product/v1/product/save';
                if (!!type) {
                    url = Base.sitUrl + '/api/product/v1/product/edit';
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        data: JSON.stringify(itemEty)
                    },
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
            //  获取某个产品详情
            getItemById: function () {
                if (id) {
                    $.ajax({
                        url: Base.sitUrl + '/api/product/v1/product/get',
                        data: {id: id},
                        type: 'POST',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.unLogin(res);
                                return;
                            }

                            var obj = res.data,
                                pics = obj.pictures,
                                enterObj = obj.productTradeInfoEnter;

                            //后台返回，但是没用的东西
                            delete obj.createTime;
                            delete obj.updateTime;

                            proObj.data = obj;
                            $addForm.find('#p-name').val(obj.name);
                            if (pics.length > 0) {
                                var imgHtml = '';
                                for (var i = 0; i < pics.length; i++) {
                                    imgHtml += '<div class="up-shows active">\
                                            <img src="' + pics[i].url + '" alt="图片" />\
                                            <div class="up-btn">\
                                                <i class="s-updownBg s-dels"></i>\
                                            </div>\
                                        </div>';
                                }
                                $addForm.find('.up-all').after(imgHtml);
                                $('.up-shows img').load(function () {
                                    $.cutImage(this, 100, 100);
                                });
                                $addForm.find('#p-bName').val(obj.brand);
                            }

                            $addForm.find('#p-min').val(enterObj.minOrderQuantity);
                            $addForm.find('[name="st-price"]').val(enterObj.fomPriceMin);
                            $addForm.find('[name="ed-price"]').val(enterObj.fomPriceMax);
                            $addForm.find('[name="p-Port"]').val(enterObj.port);
                            $addForm.find('[name="p-modelNum"]').val(obj.modelNumber || '');

                            $addForm.find('#p-group').attr('data-id', obj.productCatelog);
                            var groups = $addForm.find('#p-group').next('ul').children('li');
                            for (var g = 0; g < groups.length; g++) {//编辑定位到当前分组
                                var id = parseInt(groups.eq(g).attr('data-id'));
                                if (id == obj.productCatelog) {
                                    groups.eq(g).addClass('active');
                                    $addForm.find('#p-group').text(groups.eq(g).text());
                                    id = undefined;
                                    break;
                                }
                            }

                            $addForm.find('#fob-curr').attr('data-id', enterObj.fomPriceCurrency);
                            var fcurrs = $addForm.find('#fob-curr').next('ul').children('li');
                            for (var c = 0, flist = fcurrs.length; c < flist; c++) {
                                var id = parseInt(fcurrs.eq(c).attr('data-id'));
                                if (id == enterObj.fomPriceCurrency) {
                                    fcurrs.eq(c).addClass('active');
                                    $addForm.find('#fob-curr').text(fcurrs.eq(c).text());
                                    id = undefined;
                                    fcurrs = undefined;
                                    break;
                                }
                            }

                            $addForm.find('#fob-unit,#sub-unit,#p-unit').attr('data-id', enterObj.unit);
                            var funits = $addForm.find('#fob-unit,#sub-unit,#p-unit').next('ul').children('li');
                            for (var f = 0, flist = funits.length; f < flist; f++) {
                                var id = parseInt(funits.eq(f).attr('data-id'));
                                if (id == enterObj.unit) {
                                    funits.eq(f).addClass('active');
                                    $addForm.find('#fob-unit,#sub-unit,#p-unit').text(funits.eq(f).text());
                                    id = undefined;
                                    funits = undefined;
                                    break;
                                }
                            }

                            $addForm.find('#sub-time').attr('data-id', enterObj.supplyAblilityUnit);
                            var stimes = $addForm.find('#sub-time').next('ul').children('li');
                            for (var c = 0, slist = stimes.length; c < slist; c++) {
                                var id = parseInt(stimes.eq(c).attr('data-id'));
                                if (id == enterObj.supplyAblilityUnit) {
                                    stimes.eq(c).addClass('active');
                                    $addForm.find('#sub-time').text(stimes.eq(c).text());
                                    id = undefined;
                                    stimes = undefined;
                                    break;
                                }
                            }

                            if (enterObj.paymentTerm.length > 0) {
                                $addForm.find('.form-checkbox input').each(function () {
                                    if (enterObj.paymentTerm.indexOf($(this).attr('data-id')) != -1) {
                                        $(this).attr('checked', 'checked');
                                    }
                                });
                            }

                            $addForm.find('[name="p-supply"]').val(enterObj.supplyAblility || 0);
                            if (enterObj.minOrderQuantityDesc) {
                                var infoHtml = '<div class="box-info">\
                                            <input type="text" class="inputs long-input2" value="' + enterObj.minOrderQuantityDesc + '" />\
                                            <i class="s-updownBg s-del"></i>\
                                        </div>';
                                $addForm.find('.box-min>a').after(infoHtml);
                                $addForm.find('.box-min>a').hide();
                            }
                            if (enterObj.supplyAblilityDesc) {
                                var abilityHtml = '<div class="box-info">\
                                            <input type="text" class="inputs long-input2" value="' + enterObj.supplyAblilityDesc + '" />\
                                            <i class="s-updownBg s-del"></i>\
                                        </div>';
                                $('.box-ability>a').hide().after(abilityHtml);
                            }
                            $addForm.find('[name="p-deli-time"]').val(enterObj.deliveryTime);
                            $addForm.find('[name="p-details"]').val(enterObj.packagingDetails);
                            $addForm.find('[name="p-desc"]').val(obj.description);
                            $addForm.find('[name="p-remark"]').val(obj.remark);
                            $addForm.find('#sub-time').text(enterObj.supplyAblilityTimeValue);

                            var extra = obj.productParameters,
                                extrHtml = '';
                            if (extra && extra.length > 0) {
                                for (var i = 0; i < extra.length; i++) {
                                    extrHtml += '<div class="form-group singles">\
                                            <label><input type="text" class="inputs short-input" id="p_' + i + '" value="' + extra[i].name + '" /></label>\
                                            <div class="form-info">\
                                                <input type="text" id="input_' + i + '" class="inputs long-input2" value="' + extra[i].value + '" />\
                                                <i class="s-updownBg s-del" data-id="' + i + '"></i>\
                                            </div></div>';
                                }
                                $addForm.find('.pro-add-param').after(extrHtml);
                            }
                            //根据id获取上一级分类
                            proObj.getParentItem(obj.productType);
                        }
                    });
                }
            },
            //  上传图片
            uploadImg: function (obj, type, name, size) {
                obj.ajaxForm({
                    url: Base.sitUrl + '/api/file/upload',
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    complete: function () {
                        $.UnblockUI();
                        $addForm.find('#form_file').eq(0)[0].reset();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.Alert(res.message + ',网络超时！');
                            return;
                        }
                        if (type == undefined) {
                            var pic = res.data.split(','), html = '';
                            for (var i = 0; i < pic.length; i++) {
                                var url = 'http://' + pic[i];
                                html += '<div class="up-shows active">\
                                        <img src="' + url + '" alt="图片" />\
                                        <div class="up-btn">\
                                            <i class="s-updownBg s-dels"></i>\
                                        </div>\
                                    </div>';
                            }

                            var list = $('.form-info .up-shows');
                            if (list.length > 0) {
                                list.eq(list - 1).after(html);
                            } else {
                                $('.up-all').after(html);
                            }
                            $('.up-shows img').load(function () {
                                $.cutImage(this, 100, 100);
                            });
                        } else {
                            proObj.upObj.path += res.data;
                            proObj.upObj.taskName = name;
                            proObj.upObj.fileName = name;
                            proObj.upObj.fileSize = size;
                            var flag = true;
                            if (proObj.upObj.type == '') {
                                $.Alert('请选择导入产品类型');
                                flag = false;
                            }
                            if (proObj.upObj.group == '') {
                                $.Alert('请选择导入的产品分组');
                                flag = false;
                            }
                            if (flag) {
                                proObj.uploadProductTable(proObj.upObj);
                                proObj.upObj.path = 'http://';
                            }
                        }
                    }
                }).submit();
            },
            //  获取产品分组
            getProGroup: function (obj) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/catelog/list',
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }

                        var list = res.data,
                            html = '<li data-id="-1">请选择</li>';
                        for (var i = 0; i < list.length; i++) {
                            html += '<li data-id="' + list[i].id + '">' + list[i].name + '</li>';
                        }
                        obj.next('ul').empty().append(html);
                    }
                });
            },
            //  获取产品第一级类型
            getProType: function (obj) {
                var html = '',
                    $select = obj.parent('.model-select');

                for(var item in category){
                    html += '<li data-id="' + item + '">' + category[item].cn_name + '</li>';
                    obj.next('ul').empty().append(html);
                    $select.addClass('active');
                }
            },
            //  获取产品父类型
            getParentItem: function (id) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/type/parent/search',
                    data: {id: id},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var obj = res.data;
                        if (obj) {
                            proObj.getChildItem(null, obj.pid, {id: obj.id, name: obj.name});
                            proObj.getParentItem(obj.pid);
                        }
                    }
                });
            },
            //  获取产品子类型
            getChildItem: function (obj, id, parent) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/type/sublist',
                    data: {pid: id},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data,
                            html = '';

                        if (list.length > 0) {
                            if (proObj.typeList[id] == undefined){
                                parent.list = list;
                                proObj.typeList[id] = parent;
                            }
                            if (id == 0) {
                                proObj.getAllContactType();
                            }
                        }
                    }
                });
            },
            //  获取产品符号列表
            getDicts: function (type) {
                $.ajax({
                    url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                    data: {
                        group: type
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data,
                            html = '';
                        if (type == 'currency') {
                            for (var i = 0; i < list.length; i++) {
                                html += '<li data-id="' + list[i].id + '">' + list[i].value + '</li>';
                            }

                            $addForm.find('#fob-curr').next('ul').empty().append(html);
                        } else if (type == 'unit') {
                            for (var i = 0; i < list.length; i++) {
                                html += '<li data-id="' + list[i].id + '">' + list[i].value + '</li>';
                            }

                            $addForm.find('#p-unit,#fob-unit,#sub-unit').next('ul').empty().append(html);
                        } else if (type == 'supply.ability.time') {
                            for (var i = 0; i < list.length; i++) {
                                html += '<li data-id="' + list[i].id + '">' + list[i].value + '</li>';
                            }

                            $addForm.find('#sub-time').next('ul').empty().append(html);
                        } else if (type == 'payment.method') {
                            for (var i = 0; i < list.length; i++) {
                                html += '<label><input type="checkbox" name="payment" data-id="' + list[i].id + '"><span>' + list[i].value + '</span></label>';
                            }

                            $addForm.find('.form-checkbox').empty().append(html);
                        }
                    }
                });
            },
            //  获取产品类型
            getAllContactType: function () {
                var html = '', selector = '#p-type', _count = 1;
                var list = proObj.typeList;
                for (var i in list) {
                    var key = list[i].list;
                    for (var j = 0; j < key.length; j++) {
                        if (key[j].id == list[i].id) {
                            html += '<li data-id="' + key[j].id + '" class="active">' + key[j].name + '</li>';
                        } else {
                            html += '<li data-id="' + key[j].id + '">' + key[j].name + '</li>';
                        }
                        if (j == (key.length - 1)) {
                            if (i != 0) {
                                selector = '#p-type' + _count;
                            }
                            $(selector).attr('data-id', list[i].id).text(list[i].name);
                            $(selector).next('ul').empty().append(html);
                            $(selector).closest('.model-select').addClass('active');
                        }
                    }
                    html = '';
                    _count++;
                }
                proObj.typeList = {};
            },
            //  文件限制
            fileLimit: function (obj) {
                var flag = true;
                var fileObj = obj.prop('files');
                var leg = $('.up-shows').length;
                var sumLength = parseInt(leg) + parseInt(fileObj.length);
                if (leg >= 6) {
                    $.Alert('最多允许上传6张图片');
                    flag = false;
                }
                if (fileObj.length > 6) {
                    $.Alert('最多允许上传6张图片');
                    flag = false;
                }
                if (sumLength > 6) {
                    $.Alert('最多允许上传6张图片');
                    flag = false;
                }
                if (fileObj.length == 0) {
                    flag = false;
                }
                for (var i = 0; i < fileObj.length; i++) {
                    var size = Math.round(fileObj[i].size / 1024 * 100) / 100 / 1024;//MB
                    if (size > 1) {
                        $.Alert('上传图片需小于1MB');
                        flag = false;
                    }
                }
                return {flag: flag, name: fileObj[0].name, size: size};
            },
            //  下载导入模板
            downloadOutputTemplate: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/template/download',
                    type: 'GET',
                    dataType: 'json',
                    complete: function () {
                        window.location.href = Base.sitUrl + '/api/product/v1/product/template/download';
                    }
                });
            },
            //  上传产品表格
            uploadProductTable: function (obj) {
                var data = {
                    productCatelog: obj.group,
                    productType: obj.type,
                    path: obj.path,
                    taskName: obj.taskName,
                    fileName: obj.fileName,
                    fileSize: obj.fileSize
                };
                data = JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/import',
                    data: {
                        data: data
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                        }
                    }
                });
            },
            //  导入历史
            importHistory: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/import/history',
                    type: 'GET',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data, html = '',
                            $tbody = $('.table-import>tbody');
                        if (list.length != 0) {
                            for (var i = 0; i < list.length; i++) {
                                var date = $.dateObj(list[i].createTime)._getDatetime(),
                                    _group = '未分组',
                                    _status = '&nbsp;';
                                html += '<tr>\
                                            <td>' + list[i].fileName + '</td>\
                                            <td>' + date + '</td>\
                                            <td>' + _group + '</td>\
                                            <td>' + _status + '</td>\
                                            <td>' + list[i].productSum + '</td>\
                                            <td><a href="javascript:;" data-id="' + list[i].id + '">删除</a></td>\
                                        </tr>';
                            }
                        } else {
                            html += '<tr><td colspan="6">无导入历史</td></tr>';
                        }
                        $tbody.empty().append(html);
                    }
                });
            },
            //  删除导入产品
            delImportHistory: function (obj, id) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/import/delete',
                    type: 'POST',
                    data: {id: id},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                        }
                    }
                });
            }
        };
        $('.table-import').on('click', 'tbody tr td:last-child', function () {
            $.Confirm('确认删除？', '', function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/import/delete',
                    type: 'POST',
                    data: {id: $(this).find('a').attr('data-id')},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                        }
                    }
                });
            })
        });

        //  获取产品第一级类型列表
        proObj.getProType($addForm.find('#p-type,#o-type'));
        proObj.getProGroup($addForm.find('#p-group,#o-group'));
        proObj.getItemById();
        proObj.getDicts('currency');
        proObj.getDicts('unit');
        proObj.getDicts('supply.ability.time');
        proObj.getDicts('payment.method');
    });
});