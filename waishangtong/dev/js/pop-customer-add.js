/* !
 *  用于新建客户
 */
require([ 'common' ], function () {
    require([ 'blockUI', 'jqform', 'datetimepickerCN'], function () {

        (function () {
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/defined/attribute/list",
                data: {data: JSON.stringify({'bizType': 1})},
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

                        if (dataDet.removable == 1) {//新增字段
                            if (dataDet.required == 1) {//必填项
                                addList = '<div class="form-groups c-add-list"><label for="c-add' + addIndex + '"><i>*</i>' + dataDet.name + '</label><div class="form-input">\
                                    <input data-code="' + dataDet.code + '" data-id="' + dataDet.id + '" data-isRequired="yes" type="text" name="c-add' + addIndex + '" id="c-add' + addIndex + '" class="input-style" /></div><div class="clear"></div></div>';
                            } else {
                                addList = '<div class="form-groups c-add-list"><label for="c-add' + addIndex + '">' + dataDet.name + '</label><div class="form-input">\
                                    <input data-code="' + dataDet.code + '" data-id="' + dataDet.id + '" data-isRequired="no" type="text" name="c-add' + addIndex + '" id="c-add' + addIndex + '" class="input-style" /></div><div class="clear"></div></div>';
                            }
                            addIndex++;
                            $('#c-add').prepend(addList);
                        }
                    }
                }
            });

        })();

        $("body").on("focusin", ".datetime-picker", function () {
            if (jQuery().datetimepicker) {
                $(this).datetimepicker({
                    format: "yyyy-mm-dd",
                    todayBtn: true,
                    language: "zh-CN",
                    // startDate: new Date(),
                    pickerPosition: "bottom-right",
                    autoclose: true,
                    minView: "month"
                });
            }
        })

        var custId = $.GetQueryString('id'),
            company = $.GetQueryString('company'),
            $addForm = $('#addCustForm'),
            contTags;
        //  星级效果
        $addForm.on('click', '.form-input>i', function (e) {
            var obj = $(this).parent().children('i');
            if ($(this).hasClass('s-unstar2')) {
                other.goodFn(obj, $(this).index());
            } else {
                other.nagativeFn(obj, $(this).index());
            }
        });

        //  打开状态列表
        $addForm.on('click', '.status-list>.status-current>span', function (e) {
            $.EventFn(e);

            var $list = $(this).closest('.status-list'),
                $items = $list.children('.status-items');
            if ($items.hasClass('active')) {
                $items.removeClass('active');
            } else {
                $items.addClass('active');
            }
        });
        //  选择状态
        $(document).on('click', '.status-list>.status-items>li', function (e) {
            $.EventFn(e);
            var html = $(this).children().prop('outerHTML'),
                id = parseInt($(this).attr('data-id')),
                $current = $('.status-current');
            if (html == $current.children('label').prop('outerHTML')) {
                return;
            }
            html += '<span><i class="s-updownBg s-up"></i></span>';
            $current.empty();
            $current.append(html);
            $current.find('label').attr("data-id", id);
            $("#statusList").removeClass("active");
        });

        $('#addCustForm').on('click','.checked-tags',function(){
            $(this).next().toggle();
        });
        $('#addCustForm').on('click','.tag-list li',function(){
            var $this = $(this);
            $this.parent().hide();
            var checkedTags = $this.parent().prev('.checked-tags').find('.tag-cont');

            for(var i =0;i<checkedTags.length;i++){
                if($this.attr('data-id') == checkedTags.eq(i).attr('data-id')){
                    return;
                }
            }

            var tag = '<span class="tag-cont" data-id="'+ $(this).attr('data-id') +'"><span class="mark ellipsis">'+ $(this).text() +'</span><i class="close-icon"></i></span>';
            $this.parent().prev('.checked-tags').append(tag);
        });
        $('#addCustForm').on('click','.checked-tags .mark',function(e) {
            $.EventFn(e);
        });
        $('#addCustForm').on('click','.checked-tags .close-icon',function(e){
            $.EventFn(e);
            $(this).parent().remove();
        });

        //  查询客户详情
        function getCustomerById() {
            if (custId) {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/detail',
                    type: 'POST',
                    data: {data: JSON.stringify({id: custId})},
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var obj = res.data,
                            list = "", star = '<i class="s-updownBg s-star2"></i>';
                        list = obj.contacts;

                        var $current = $('.status-current');
                        var staHtml = '<label data-id="' + obj.status + '" style="background-color: ' + (obj.statusColour || '#bbb') + ';">' + ((obj.statusName || '无状态').substring(0, 1)) + '</label><span><i class="s-updownBg s-up"></i></span>';

                        $current.empty();
                        $current.append(staHtml);

                        $('#f-name').val(obj.name || '');
                        $('#f-email').val(obj.defaultEmail || '');
                        $('#f-phone').val(obj.phone || '');
                        $('#f-facebook').val(obj.facebook || '');
                        $('#f-linkedIn').val(obj.linkedin || '');
                        $('#f-address').val(obj.address || '');
                        $('#f-remark').val(obj.remark || '');
                        $('#f-fax').val(obj.faxes || '');
                        $('#f-twitter').val(obj.twitter || '');
                        $('#f-page').val(obj.homepage || '');
                        $('#f-kinds').get(0).value = obj.customerType;
                        $('#f-group').get(0).value = obj.customerGroupId;
                        $('#f-country').get(0).value = obj.countries;
                        $('#f-main').val(obj.mainProducts || '');
                        $('#f-size').val(obj.scale || 0);

                        var tags = '';
                        for(var i =0;i<obj.customerTags.length;i++){
                            tags += '<span class="tag-cont" data-id="'+ obj.customerTags[i].tagId +'"><span class="mark ellipsis">'+ obj.customerTags[i].tagName +'</span><i class="close-icon"></i></span>';
                        }

                        $('#f-tag .checked-tags').html(tags);

                        for (var s = 1; s < obj.starLevel; s++) {
                            star += '<i class="s-updownBg s-star2"></i>';
                        }
                        for (s = 0; s < (5 - obj.starLevel); s++) {
                            star += '<i class="s-updownBg s-unstar2"></i>';
                        }
                        $('.f-stars').empty().append(star);
                        for (var i = 0; i < list.length; i++) {
                            addContacts(list[i]);
                        }

                        //获取用户自定义属性数据
                        var getDefineds = obj.customerDefinedValues;
                        if (getDefineds.length > 0) {
                            var getDefCont = $('#c-add');
                            for (var i = 0; i < getDefineds.length; i++) {
                                var getAttrId = getDefineds[i].attributeId;
                                getDefCont.find('input[data-id=' + getAttrId + ']').val(getDefineds[i].value);
                            }
                        }

                        other.data = obj;
                    }
                });
            }
        }

        //获取状态列表
        function statusList() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/customer/status/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = res.data,
                        list = "";
                    $('#statuLabel').attr('data-id', data[0].id).css('backgroundColor', data[0].colour).text(data[0].name.substring(0, 1));
                    for (var i = 0; i < data.length; i++) {
                        var name = data[i].name;
                        var name = name.substring(0, 1)
                        list += '<li data-id="' + data[i].id + '"><label style="background-color: ' + data[i].colour + ';" data-id="1">' + name + '</label></li>'
                    }
                    $("#statusList").empty().append(list);
                }
            });
        }

        //获取客户类型
        function clientKinds() {
            $.ajax({
                url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                type: 'POST',
                dataType: 'json',
                data: {
                    group: 'customer.type'
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].value + '</option>'
                    }
                    $("#f-kinds").empty().append(list);
                }
            })
        }

        //获取客户来源
        function clientSource() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/customer/source/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#f-source").empty().append(list);
                }
            })
        }

        //获取客户标签列表
        function clientTag(_type) {
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/list',
                type: 'POST',
                dataType: 'json',
                data: {"tagType":_type},
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    if(_type == 1){//客户标签
                        var data = res.data,
                            list = "";
                        for (var i = 0; i < data.length; i++) {
                            list += '<li data-id="' + data[i].id + '">' + data[i].name + '</li>';
                        }
                        $(".tag-list").empty().append(list);
                    }else{//联系人标签
                        contTags = res.data;
                    }
                }
            })
        }

        //获取分组列表
        function clientGroup() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/group/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#f-group").empty().append(list);
                }
            })
        }

        //获取国家地区列表
        function clientCountry() {
            $.ajax({
                url: Base.sitUrl + '/api/sys/v1/sys/countries/get',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].cn + ' - ' + data[i].en + '</option>'
                    }
                    var none = '<option value="">请选择国家</option>'
                    $("#f-country").empty().append(none).append(list);
                    getCustomerById();//查询客户详情
                }
            })
        }

        //  添加联系人
        function addContacts(obj) {
            var definedAttr = '';
            var html = '',list = "";
            for (var i = 0; i < contTags.length; i++) {
                list += '<li data-id="' + contTags[i].id + '">' + contTags[i].name + '</li>';
            }

            $.ajax({//请求得到联系人新增自定义字段
                url: Base.sitUrl + "/api/org/v1/org/staff/defined/attribute/list",
                data: {data: JSON.stringify({'bizType': 2})},
                dataType: "json",
                type: "GET"
            }).done(function (result) {
                if (!result.success) {
                    alert(result.message);
                    return;
                }
                var data = result.data;
                var addIndex = 1;
                for (var i = 0; i < data.length; i++) {
                    var dataDet = data[i];
                    var addList = '';

                    if (dataDet.removable == 1) {//新增字段
                        if (dataDet.required == 1) {//必填项
                            addList = '<div class="form-groups c-add-list"><label for="c-add' + addIndex + '"><i>*</i>' + dataDet.name + '</label>\
                                <div class="form-input"><input type="text" data-isRequired="yes" name="c-add' + addIndex + '" data-id="' + dataDet.id + '" data-code="' + dataDet.code + '" id="c-add' + addIndex + '" class="input-style"></div><div class="clear"></div></div>';
                        } else {
                            addList = '<div class="form-groups c-add-list"><label for="c-add' + addIndex + '">' + dataDet.name + '</label>\
                                <div class="form-input"><input type="text" data-isRequired="no" name="c-add' + addIndex + '" data-id="' + dataDet.id + '" data-code="' + dataDet.code + '" id="c-add' + addIndex + '" class="input-style"></div><div class="clear"></div></div>';
                        }
                        addIndex++;
                        definedAttr += addList;
                    }
                }
                if (obj) {
                    var star = '<i class="s-updownBg s-star3"></i>';
                    for (var i = 1; i < obj.starLevel; i++) {
                        star += '<i class="s-updownBg s-star3"></i>';
                    }
                    if (5 - obj.starLevel > 0) {
                        for (var j = 0; j < 5 - obj.starLevel; j++) {
                            star += '<i class="s-updownBg s-unstar2"></i>';
                        }
                    }
                    var hadTags = obj.customerContactTags;
                    var tagHtml = '';
                    for(var i =0;i<hadTags.length;i++){
                        tagHtml += '<span class="tag-cont" data-id="'+ hadTags[i].id +'"><span class="mark ellipsis">'+ hadTags[i].tagName +'</span><i class="close-icon"></i></span>';
                    }

                    var sexHtml = '';
                    if(obj.sex == 0){
                        sexHtml = '<option value="0" selected>女</option><option value="1">男</option>';
                    }else {
                        sexHtml = '<option value="0">女</option><option value="1" selected>男</option>';
                    }

                    var h = $('.add-contact').length + 1;
                    html = '<div class="add-contact" data-id="' + obj.id + '">\
                    <div class="contact-title">\
                        <h4>联系人' + h + '</h4>\
                        <a href="javascript:;"><i class="s-updownBg s-dels5"></i><span>删除联系人</span></a>\
                        <div class="clear"></div>\
                    </div>\
                    <fieldset>\
                        <div class="form-groups">\
                            <label for="c-name' + other.index + '"><i>*</i>姓名</label>\
                            <div class="form-input">\
                                <input type="text" name="c-name' + other.index + '" class="c-name input-style" value="' + (obj.name || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-position' + other.index + '">职位</label>\
                            <div class="form-input">\
                                <input type="text" name="c-position' + other.index + '" class="c-position input-style" value="' + (obj.position || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-phone' + other.index + '">联系电话</label>\
                            <div class="form-input">\
                                <input type="text" name="c-phone' + other.index + '" class="c-phone input-style" value="' + (obj.phone || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-facebook' + other.index + '">Facebook</label>\
                            <div class="form-input">\
                                <input type="text" name="c-facebook' + other.index + '" class="c-facebook input-style" value="' + (obj.facebook || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-twitter' + other.index + '">Twitter</label>\
                            <div class="form-input">\
                                <input type="text" name="c-twitter' + other.index + '" class="c-twitter input-style" value="' + (obj.twitter || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-sex' + other.index + '">性别</label>\
                            <div class="form-input">\
                                <select type="text" name="c-sex" class="form-control">'+ sexHtml +'\
            </select>\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                    </fieldset>\
                    <fieldset style="margin-right: 0px;">\
                        <div class="form-groups">\
                            <label for="c-email' + other.index + '"><i>*</i>邮箱</label>\
                            <div class="form-input">\
                                <input type="text" name="c-email' + other.index + '" class="c-email input-style" value="' + (obj.email || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label>星级</label>\
                            <div class="form-input">' + star + '</div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-birthday' + other.index + '">生日</label>\
                            <div class="form-input">\
                                <input type="text" name="c-birthday' + other.index + '" class="c-birthday input-style datetime-picker" value="' + (obj.birthday || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-linkin' + other.index + '">LinkedIn</label>\
                            <div class="form-input">\
                                <input type="text" name="c-linkin' + other.index + '" class="c-linkin input-style" value="' + (obj.linkedin || '') + '">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-tag' + other.index + '">联系人标签</label>\
                            <div class="form-input">\
                                <div style="position: relative;">\
                                    <div class="checked-tags">'+ tagHtml +'\
                                    </div>\
                                    <ul class="tag-list">'+list+'\
                                    </ul>\
                                </div>\
                            <div class="clear"></div>\
                        </div>\
                    </fieldset>\
                    <div class="clear"></div>\
                    <div class="form-other">\
                        <label for="f-remark">备注</label>\
                        <div class="form-input">\
                            <textarea name="f-remark" class="c-remark input-style">' + (obj.remark || '') + '</textarea>\
                        </div>\
                        <div class="clear"></div>\
                    </div><div class="c-add">' + definedAttr + '</div></div>';

                    other.index++;
                    $('.box-add').append(html);
                    $('.add-contact:last').find('input:first').focus();
                    //获取用户自定义属性数据
                    var getDefineds = obj.contactDefinedValues;
                    if (getDefineds.length > 0) {
                        var getDefCont = $('.add-contact .c-add');
                        for (var i = 0; i < getDefineds.length; i++) {
                            var getAttrId = getDefineds[i].attributeId;
                            var getInput = getDefCont.find('input[data-id=' + getAttrId + ']');
                            if (getInput.length > 0) {
                                getInput.val(getDefineds[i].value);
                            }
                        }
                    }
                }
                else {//新建客户  的新建联系人
                    var h = $('.add-contact').length + 1;
                    html = '<div class="add-contact" data-id="0">\
                    <div class="contact-title">\
                        <h4>联系人' + h + '</h4>\
                        <a href="javascript:;"><i class="s-updownBg s-dels5"></i><span>删除联系人</span></a>\
                        <div class="clear"></div>\
                    </div>\
                    <fieldset>\
                        <div class="form-groups">\
                            <label for="c-name' + other.index + '"><i>*</i>姓名</label>\
                            <div class="form-input">\
                                <input type="text" name="c-name' + other.index + '" class="c-name input-style">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-position' + other.index + '">职位</label>\
                            <div class="form-input">\
                                <input type="text" name="c-position' + other.index + '" class="c-position input-style">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-phone' + other.index + '">联系电话</label>\
                            <div class="form-input">\
                                <input type="text" name="c-phone' + other.index + '" class="c-phone input-style">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-facebook' + other.index + '">Facebook</label>\
                            <div class="form-input">\
                                <input type="text" name="c-facebook' + other.index + '" class="c-facebook input-style">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-twitter' + other.index + '">Twitter</label>\
                            <div class="form-input">\
                                <input type="text" name="c-twitter' + other.index + '" class="c-twitter input-style">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-sex' + other.index + '">性别</label>\
                            <div class="form-input">\
                                <select type="text" name="c-sex" class="form-control">\
                <option value="0">女</option>\
                <option value="1">男</option>\
            </select></div>\
                            <div class="clear"></div>\
                        </div>\
                    </fieldset>\
                    <fieldset style="margin-right: 0px;">\
                        <div class="form-groups">\
                            <label for="c-email' + other.index + '"><i>*</i>邮箱</label>\
                            <div class="form-input">\
                                <input type="text" name="c-email' + other.index + '" class="c-email input-style">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label>星级</label>\
                            <div class="form-input">\
                                <i class="s-updownBg s-star3"></i><i class="s-updownBg s-unstar2"></i><i class="s-updownBg s-unstar2"></i><i class="s-updownBg s-unstar2"></i><i class="s-updownBg s-unstar2"></i>\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-birthday' + other.index + '">生日</label>\
                            <div class="form-input">\
                                <input type="text" name="c-birthday' + other.index + '" class="c-birthday input-style datetime-picker">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-linkin' + other.index + '">LinkedIn</label>\
                            <div class="form-input">\
                                <input type="text" name="c-linkin' + other.index + '" class="c-linkin input-style">\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                        <div class="form-groups">\
                            <label for="c-tag' + other.index + '">联系人标签</label>\
                            <div class="form-input">\
                                <div style="position: relative;">\
                                    <div class="checked-tags">\
                                    </div>\
                                    <ul class="tag-list">'+list+'\
                                    </ul>\
                                </div>\
                            </div>\
                            <div class="clear"></div>\
                        </div>\
                    </fieldset>\
                    <div class="clear"></div>\
                    <div class="form-other">\
                        <label for="f-remark">备注</label>\
                        <div class="form-input">\
                            <textarea name="f-remark" class="c-remark input-style"></textarea>\
                        </div>\
                        <div class="clear"></div>\
                    </div><div class="c-add">' + definedAttr + '</div></div>';
                    other.index++;
                    $('.box-add').append(html);
                    $('.add-contact:last').find('input:first').focus();
                }
            })
        }

        //  删除联系人
        $addForm.on('click', '.contact-title>a', function (e) {
            $.EventFn(e);

            $(this).closest('.add-contact').remove();
            for (var i = 0; i < $('.add-contact').length; i++) {
                var j = i + 1;
                $('.add-contact').eq(i).find('h4').text('联系人' + j)
            }
            if (custId) {
                other.delIds.push($(this).closest('.add-contact').attr('data-id'));
            }
        });

        //  添加联系人
        $addForm.on('click', '.btn-contacts', function (e) {
            $.EventFn(e);

            addContacts(null);
        });
        var other = {
            data: null,
            delIds: [],
            index: 1,
            goodFn: function (obj, limit) {
                for (var i = 0; i < obj.length; i++) {
                    if (i > limit) {
                        return;
                    }
                    if(obj.parents('.add-contact').length>0){//添加的联系人的星标
                        obj.eq(i).removeClass('s-unstar2').addClass('s-star3');
                    }else{
                        obj.eq(i).removeClass('s-unstar2').addClass('s-star2');
                    }
                }
            },
            nagativeFn: function (obj, limit) {
                for (var i = 0; i < obj.length; i++) {
                    if (i > limit) {
                        if(obj.parents('.add-contact').length>0){
                            obj.eq(i).removeClass('s-star3').addClass('s-unstar2');
                        }else{
                            obj.eq(i).removeClass('s-star2').addClass('s-unstar2');
                        }
                    } else {
                        if(obj.parents('.add-contact').length>0){
                            obj.eq(i).removeClass('s-unstar2').addClass('s-star3');
                        }else{
                            obj.eq(i).removeClass('s-unstar2').addClass('s-star2');
                        }
                    }
                }
            },
            mFn: function (obj) {
                var $field = obj;
                for (var i = 0; i < $field.length; i++) {
                    if ((i + 1) % 2 == 0) {
                        $field.eq(i).css('margin-right', 0);
                    }
                }
            }
        };
        //新建联系人.初始化
        function start() {
            $("#f-name").val("");
            $("#f-email").val("");
            $("#f-phone").val("");
            $("#f-fax").val("");
            $("#f-facebook").val("");
            $("#f-twitter").val("");
            $("#f-linkedIn").val("");
            $("#f-address").val("");
            $("#f-page").val("");
            $("#f-main").val("");
            $("#f-remark").val("");
            //获取所需列表
            statusList();//客户状态
            clientKinds();//客户类型
            clientSource();//客户来源
            clientGroup();//分组列表
            clientCountry();//国家地区
            clientTag(1);//客户标签列表
            clientTag(2);//联系人标签列表
        }

        start();
        var data = '';
        //获取页面填写信息
        function info() {
            var name = $("#f-name").val();
            var email = $("#f-email").val();
            var phone = $("#f-phone").val();
            var fax = $("#f-fax").val();
            var facebook = $("#f-facebook").val();
            var twitter = $("#f-twitter").val();
            var linkedIn = $("#f-linkedIn").val();
            var address = $("#f-address").val();
            var page = $("#f-page").val();
            var main = $("#f-main").val();
            var remark = $("#f-remark").val();
            var starLevel = $("fieldset .f-stars").find(".s-star2").length;
            var GroupId = $("#f-group").find("option:selected").val();
            var Source = $("#f-source").find("option:selected").val();
            var status = $('.status-current').find("label").attr("data-id");
            var customerType = $("#f-kinds").find("option:selected").val();
            var country = $("#f-country").find("option:selected").val();
            var scale = $('#f-size').val();

            var tagsId = '';
            var tagConts = $('#f-tag .tag-cont');
            for(var i=0;i<tagConts.length;i++){
                tagsId += tagConts.eq(i).attr('data-id')+',';
            }
            tagsId = tagsId.substring(0,tagsId.length-1);

            var getDefinedVals = [];
            var isLegal = true;
            $('#c-add input:text').each(function () {
                var $this = $(this);
                if ($this.val() != '') {
                    var getDefined = {};
                    getDefined.attributeId = $this.attr('data-id');
                    getDefined.code = $this.attr('data-code');
                    getDefined.value = $this.val();

                    getDefinedVals.push(getDefined);
                } else {
                    if ($this.attr('data-isRequired') == 'yes') {
                        $.Alert("请填写必填项目");
                        isLegal = false;
                        return false;
                    }
                }
            });
            if (!isLegal) return false;//自定义属性的必填项目没有填写


            if (name == "") {
                $.Alert("请填写必填项目");
                return;
            } else if ($.GetLength(name) > 64) {
                $.Alert('名称须小于32个汉字或64个字母');
                return;
            } else {
                var data = {};
                if (other.data) {
                    data = other.data;
                    data.setType = 'edit';
                    data.deleteContactIds = (other.delIds).join(',');
                    delete data.contacts;
                }
                data.customerTagIds = tagsId;
                data.name = name;
                data.defaultEmail = email;
                data.countries = country;
                data.facebook = facebook;
                data.twitter = twitter;
                data.linkedin = linkedIn;
                data.homepage = page;
                data.faxes = fax;
                data.address = address;
                data.mainProducts = main;
                data.remark = remark;
                data.phone = phone;
                data.starLevel = starLevel;
                data.customerGroupId = GroupId;
                data.customerSource = Source;
                data.status = status;
                data.customerType = customerType;
                data.customerDefinedValues = getDefinedVals;
                data.scale = scale;
                data = JSON.stringify(data);
                return data;
            }
        }

        //获取新增联系人信息
        function addContact() {
            $add = $(".add-contact");
            var contacts = "";
            for (var i = 0; i < $add.length; i++) {
                var j = i + 1;
                var id = $add.eq(i).attr('data-id');
                var name = $add.eq(i).find('.c-name').val();
                var email = $add.eq(i).find('.c-email').val();
                var phone = $add.eq(i).find('.c-phone').val();
                var facebook = $add.eq(i).find('.c-facebook').val();
                var twitter = $add.eq(i).find('.c-twitter').val();
                var linkedIn = $add.eq(i).find('.c-linkin').val();
                var company = $("#f-name").val();
                var position = $add.eq(i).find('.c-position').val();
                var birthday = $add.eq(i).find('.c-birthday').val();
                var starLevel = $add.eq(i).find(".s-star3").length;
                var remark = $add.eq(i).find('.c-remark').val();
                //联系人国家和客户的国家在一起
                var country = $("#f-country").find("option:selected").val();
                var sex = $add.eq(i).find('select[name="c-sex"]').val();

                var tagsId = '';
                var tagConts = $('.checked-tags .tag-cont');
                for(var i=0;i<tagConts.length;i++){
                    tagsId += tagConts.eq(i).attr('data-id')+',';
                }
                tagsId = tagsId.substring(0,tagsId.length-1);

                var shortName = ($add.eq(i).find('input[name=short]').val() || '');

                //获取用户输入 联系人自定义属性值
                var getDefineds = $add.eq(i).find('.c-add input');
                var getDefinedVals = [];
                for (var j = 0; j < getDefineds.length; j++) {
                    if (getDefineds.eq(j).val() != '') {
                        var getDefinedVal = {};
                        getDefinedVal.attributeId = getDefineds.eq(j).attr('data-id');
                        getDefinedVal.code = getDefineds.eq(j).attr('data-code');
                        getDefinedVal.value = getDefineds.eq(j).val();
                        getDefinedVals.push(getDefinedVal);
                    } else {
                        if (getDefineds.eq(j).attr('data-isRequired') == 'yes') {
                            isValid = false;
                            break;
                        }
                    }
                }
                getDefinedVals = JSON.stringify(getDefinedVals);

                if (custId == null || custId == '') {
                    custId = '0';
                }
                contacts += '{' +
                    '"id":"' + id +
                    '","customerId":"' + custId +
                    '","name":"' + name +
                    '","email":"' + email +
                    '","position":"' + position +
                    '","workingCompany":"' + company +
                    '","phone":"' + phone +
                    '","starLevel":' + starLevel +
                    ',"birthdayString":"' + birthday +
                    '","facebook":"' + facebook +
                    '","twitter":"' + twitter +
                    '","linkedin":"' + linkedIn +
                    '","remark":"' + remark +
                    '","contactDefinedValues":' + getDefinedVals +
                    ',"countries":"' + country +
                    '","sex":"' + sex +
                    '","shortName":"' + shortName +
                    '","contactTagIds":"' + tagsId +
                    '"},';
            }
            contacts = '[' + contacts.substring(0, contacts.length - 1) + ']';
            return contacts;
        }
        //添加客户
        $('#cust-add').on('click', function () {
            var Info = info(), url = Base.sitUrl + '/api/customer/v1/customer/save';
            var Contacts = addContact();
            var ContactsJson = eval('(' + Contacts + ')');

            var $add = $(".add-contact");//新建联系人 自定义属性 ，必填项验证
            for (var i = 0; i < $add.length; i++) {
                var getDefineds = $add.eq(i).find('.c-add input');
                for (var j = 0; j < getDefineds.length; j++) {
                    if (getDefineds.eq(j).val() == '' && getDefineds.eq(j).attr('data-isRequired') == 'yes') {
                        $.Alert('请填写必填项目');
                        return;
                    }
                }
            }

            for (var i = 0; i < ContactsJson.length; i++) {
                if (ContactsJson[i].name == '' || ContactsJson[i].email == '') {
                    $.Alert('请填写必填项目');
                    return;
                }
                if ($.GetLength(ContactsJson[i].name) > 64) {
                    $.Alert('名称须小于32个汉字或64个字母');
                    return;
                }
            }
            var data = Info.substring(0, Info.length - 1) + ',"contacts":' + Contacts + '}';
            if (other.data) {
                url = Base.sitUrl + '/api/customer/v1/customer/set';
            }
            $.ajax({
                url: url,
                type: 'POST',
                dataType: 'json',
                data: {
                    data: data
                },
                success: function (res) {
                    if (res.success) {
                        // $.Alert("创建成功！");
                        parent.location.reload();
                    } else {
                        $.unLogin(res);
                    }
                }
            })
        })
    });
});