/* !
 *  用于CRM联系人设置
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN', 'countries'], function (maintab) {
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
        //默认隐藏右半部分标题
        $('.r-titles').hide();
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                todayBtn: true,
                language: "zh-CN",
                pickerPosition: "bottom-right",
                autoclose: true
            });
        }
        var sessionKeyId = parent.document.getElementById("pageLeftUserName").innerText;
        //  星级效果
        $(document).on('click', '.starLevelOp>i', function (e) {
            var obj = $(this).parent().children('i');
            if ($(this).hasClass('s-unstar2')) {
                other.goodFn(obj, $(this).index());
            } else {
                other.nagativeFn(obj, $(this).index());
            }
            //星级设置
            var id = $(this).parents("tr").attr("data-id");
            var val = $(this).parents(".starLevelOp").find(".s-star3").length;
            var data = {
                id: id,
                starLevel: val,
                setType: 'setStar'
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/contacts/set',
                type: 'POST',
                dataType: 'json',
                async: false,
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    quoObj.filter();
                }
            });
        });
        var other = {
            index: 1,
            goodFn: function (obj, limit) {
                for (var i = 0; i < obj.length; i++) {
                    if (i > limit) {
                        return;
                    }
                    obj.eq(i).removeClass('s-unstar2').addClass('s-star3');
                }
            },
            nagativeFn: function (obj, limit) {
                for (var i = 0; i < obj.length; i++) {
                    if (i > limit) {
                        obj.eq(i).removeClass('s-star3').addClass('s-unstar2');
                    } else {
                        obj.eq(i).removeClass('s-unstar2').addClass('s-star3');
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
        //  左侧联系人分组/标签伸缩
        $('#conFilter li a').on('click', function (e) {
            $.EventFn(e);
            if ($(this).parent().find("ul").attr("class") == 'group-list' || $(this).parent().find("ul").attr("class") == 'label-list') {
                $(this).parent().find("ul").addClass("active");
                $(this).parent().find(".s-up2").addClass("s-down2");
                $(this).parent().find(".s-down2").removeClass("s-up2");
            } else {
                $(this).parent().find("ul").removeClass("active");
                $(this).parent().find(".s-up2").removeClass("s-down2");
                $(this).parent().find(".s-down2").addClass("s-up2");
            }

        });
        $(".page-left").on('click', "#conFilter .s-up2", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").addClass("active");
            $(this).addClass("s-down2");
            $(this).parents("li").find(".s-down2").removeClass("s-up2");
        });
        $(".page-left").on('click', "#conFilter .s-down2", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").removeClass("active");
            $(this).addClass("s-up2");
            $(this).parents("li").find(".s-up2").removeClass("s-down2");
        });
        $(".page-left").on('click', "#conFilter .s-add", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").addClass("active");
            $(this).parents("li").find(".addTags").show();
            $(this).addClass("s-close");
            $(this).parents("li").find(".s-close").removeClass("s-add");
        });
        $(".page-left").on('click', "#conFilter .s-close", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").addClass("active");
            $(this).parents("li").find(".addTags").hide();
            $(this).addClass("s-add");
            $(this).parents("li").find(".s-add").removeClass("s-close");
        });
        $(".page-left").on('click', "#conFilter .addTags", function (e) {
            $.EventFn(e);
            $(this).show();
        })
        //关闭按钮变换
        $('#batchClose').on('mouseenter', function () {
            $(this).addClass('s-updownBg s-dels4').removeClass('fa fa-times')
        })
        $('#batchClose').on('mouseleave', function () {
            $(this).addClass('fa fa-times').removeClass('s-updownBg s-dels4')
        });

        //  关闭面板
        $('.mclose').on('click', function () {
            $('.modals').removeClass('active');
            $('#assigns').val('');
            $('#btn-assign').hide();
            counObj = {
                arr: [],
                tmp: []
            };
        });

        //  批量操作
        $('.page_info>table>tbody').delegate('input[name=batch]', 'click', function (e) {
            var _ev = e || window.event;
            _ev.stopPropagation();

            var data = custObj.getAllChecked();

            if (data.dist.indexOf('0') != -1) {
                $('#btn-assigns').attr('disabled', 'disabled');
            }
            if (data.share.indexOf('0') != -1) {
                $('#btn-shares').attr('disabled', 'disabled');
            }
            if (data.del.indexOf('0') != -1) {
                $('#btn-dels').attr('disabled', 'disabled');
            }
        });


        //  打开新建标签面板
        $('.btn-addLabel').on('click', function () {
            if ($('.u-labels').hasClass('active')) {
                $(this).find('i').removeClass('fa-times').addClass('fa-plus');
                $('.u-labels').removeClass('active')
            } else {
                $(this).find('i').addClass('fa-times').removeClass('fa-plus');
                $('#labelName').val('');
                $('.u-labels').addClass('active');
            }
        });

        //  打开分配面板
        $('#btn-assigns,#btn-shares').on('click', function () {
            counObj = {
                arr: [],
                tmp: []
            };
        });

        var counObj = {
            arr: [],
            tmp: []
        };

        $("#btn-tags").on('click', function () {
            $("#tagsModal").addClass('active');
            $("#tagsModal").siblings().removeClass('active');
        });

        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 20
        };
        //  查询列表
        var quoObj = {
            /*
             * @filter 获取联系人列表
             */
            filter: function () {
                var data = {
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                };
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/list/query',
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data.results;
                        var page = res.data.totalItem;
                        if (data.length > 0) {
                            customerRe(data, page);
                        } else {
                            var none = '<div class="trNone">' +
                                '<div class="trnone-info">' +
                                '<img src="../images/empty-contact.png" width="60" height="80" alt="" />' +
                                '<p class="trnone-text">暂无联系人</p>'+
                                '</div>' +
                                '<a href="pop-contacts-add.html" class="trnone-btn btn btn-primary" data-code="contact_add" data-maintab></i><span>创建联系人</span></a>'+
                                '</div>';
                            $('.page_info>table>tbody').empty();
                            $('.page_info>table').after(none);
                        }
                    }
                });
            }
        }
        $.reHtml = function () {
            var data = {
                currentPage: pageObj.currentPage,
                pageSize: pageObj.pageSize
            };
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/contacts/list/query',
                data: {
                    data: JSON.stringify(data)
                },
                type: 'POST',
                dataType: 'json',
                // async:false,
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
                    var page = res.data.totalItem;
                    if (data.length > 0) {
                        customerRe(data, page);
                    } else {
                        var none = '<div class="trNone">' +
                            '<div class="trnone-info">' +
                            '<img src="../images/empty-contact.png" width="60" height="80" alt="" />' +
                            '<p class="trnone-text">暂无联系人</p>'+
                            '</div>' +
                            '<a href="pop-contacts-add.html" class="trnone-btn btn btn-primary" data-code="contact_add" data-maintab></i><span>创建联系人</span></a>'+
                            '</div>';
                        $('.page_info>table>tbody').empty().after(none);
                        $('.page_info>table').after(none);
                    }
                }
            });
        }
        //列表渲染
        function customerRe(dataJson, pageNum) {
            var html = "";
            $.each(dataJson, function (index, content) {
                var star1 = "";
                var star2 = "";
                var star3 = "";
                var star4 = "";
                var star5 = "";
                if (content.starLevel == 1) {
                    star1 = 's-star3';
                    star2 = 's-unstar2';
                    star3 = 's-unstar2';
                    star4 = 's-unstar2';
                    star5 = 's-unstar2';
                } else if (content.starLevel == 2) {
                    star1 = 's-star3';
                    star2 = 's-star3';
                    star3 = 's-unstar2';
                    star4 = 's-unstar2';
                    star5 = 's-unstar2';
                }
                else if (content.starLevel == 3) {
                    star1 = 's-star3';
                    star2 = 's-star3';
                    star3 = 's-star3';
                    star4 = 's-unstar2';
                    star5 = 's-unstar2';
                }
                else if (content.starLevel == 4) {
                    star1 = 's-star3';
                    star2 = 's-star3';
                    star3 = 's-star3';
                    star4 = 's-star3';
                    star5 = 's-unstar2';
                }
                else if (content.starLevel == 5) {
                    star1 = 's-star3';
                    star2 = 's-star3';
                    star3 = 's-star3';
                    star4 = 's-star3';
                    star5 = 's-star3';
                } else {
                    star1 = 's-unstar2';
                    star2 = 's-unstar2';
                    star3 = 's-unstar2';
                    star4 = 's-unstar2';
                    star5 = 's-unstar2';
                }
                var none = "";
                var tags = "";
                if (content.customerContactTags == "") {
                    none = "none";
                } else {
                    none = "";
                    if (content.customerContactTags.length > 2) {
                        for (var i = 0; i < 2; i++) {
                            if (content.customerContactTags[i].tagName && content.customerContactTags[i].tagName.length > 8) {
                                content.customerContactTags[i].tagName = content.customerContactTags[i].tagName.substring(0, 7) + '...'
                            }
                            tags += '<li class="tags-li" style="margin-right:5px;margin-top:5px;"><span data-tagId="' + content.customerContactTags[i].id + '">' + testNull(content.customerContactTags[i].tagName) + '</span><i class="s-updownBg s-dels3"></i></li>'
                        }
                    } else {
                        for (var i = 0; i < content.customerContactTags.length; i++) {
                            if (content.customerContactTags[i].tagName && content.customerContactTags[i].tagName.length > 8) {
                                content.customerContactTags[i].tagName = content.customerContactTags[i].tagName.substring(0, 7) + '...'
                            }
                            tags += '<li class="tags-li" style="margin-right:5px;margin-top:5px;"><span data-tagId="' + content.customerContactTags[i].id + '">' + testNull(content.customerContactTags[i].tagName) + '</span><i class="s-updownBg s-dels3"></i></li>'
                        }
                    }
                }
                if (content.followUpUsers !== '' && content.followUpUsers !== null) {
                    for (var i = 0; i < content.followUpUsers.length; i++) {
                        if (sessionKeyId == content.followUpUsers[i].userId) {
                            var followUpUser = content.followUpUsers[i].userName;
                            break;
                        } else {
                            var followUpUser = content.followUpUsers[0].userName;
                        }
                    }
                } else {
                    var followUpUser = "";
                }
                if (content.followUpUser !== "") {
                    if (content.followUpUser.length > 4) {
                        content.followUpUser = content.followUpUser.substring(0, 3) + '...'
                    }
                }
                if (content.position !== "" && content.position !== null) {
                    if (content.position.length > 4) {
                        content.position = content.position.substring(0, 3) + '...'
                    }
                }
                if (content.name !== "" && content.position !== null) {
                    if (content.name.length > 17) {
                        content.name = content.name.substring(0, 15) + '...'
                    }
                }
                if (content.workingCompany !== null && content.workingCompany !== '' && content.workingCompany !== undefined) {
                    if ($.GetLength(content.workingCompany) > 26) {
                        content.workingCompany = content.workingCompany.substring(0, 19) + '...'
                    }
                }
                html += '<tr data-id="' + content.id + '" data-highSeas="' + content.highSeas + '">' +
                    '<td><div class="checker"><span><input name="batch" type="checkbox" data-id="' + content.id + '"></span></div></td>' +
                    '<td class="sortsName">' +
                    '<a href="../html/pop-relation-detail.html?id=' + content.id + '&v=' + window.ver + '" data-maintab><span  class="s-special">' + testNull(content.name) + '</span></a>' +
                    '<br><span class="recentNews">' + testNull(content.recentNews) + '</span></td>' +
                    '</td>' +
                    '<td>' + testNull(content.workingCompany) + '</td>' +
                    // '<td>'+testNull(content.position)+'</td>'+
                    '<td class="starLevelOp">' +
                    '<i class="s-updownBg ' + star1 + '"></i>' +
                    '<i class="s-updownBg ' + star2 + '"></i>' +
                    '<i class="s-updownBg ' + star3 + '"></i>' +
                    '<i class="s-updownBg ' + star4 + '"></i>' +
                    '<i class="s-updownBg ' + star5 + '"></i>' +
                    '</td>' +
                    '<td><span>' + testNull(followUpUser) + '</span></td>' +
                    '<td style="position:relative;"><span>'+ (content.position || '') +'</span>' +
                    '<ul class="' + none + '">' +
                    tags +
                    '</ul></td>' +
                    '<td class="sortsTime">' + testNull(content.createTime) + '</td>' +
                    '</tr>';
            });
            $(".trNone").remove();
            $('.page_info>table>tbody').empty().html(html);

            var total = pageNum,
                ps = pageObj.pageSize,
                all = Math.ceil(total / ps);
            pageObj.lastpage = all;
            $.Page({
                total: total,
                _class: '.page',
                nowNum: pageObj.currentPage,
                allNum: all,
                callback: function (now, all) {
                    pageObj.currentPage = now;
                    console.log(now);

                        if($('#conFilter .label-list li.active').length>0){
                            var page = {
                                currentPage: now,
                                pageSize: pageObj.pageSize
                            };
                            var val = $('#conFilter .label-list li.active').attr("data-value");
                            var pageJson = JSON.stringify(page);
                            var conditions = '[{"filedName":"tagId","operateType":"=","filedValue":"' + val + '"}]';
                            var dataJson = pageJson.substring(0, pageJson.length - 1) + ',"conditions":' + conditions + '}';
                            leftFind(dataJson);
                        }else{
                            quoObj.filter();
                        }
                }
            });
        }

        //搜索框搜索
        $("#inputQuick").on('keyup', function () {
            var keyword = $("#inputQuick").val();
            if ($('#btn-underling-pop').css('display') == 'none') {
                var data = {
                    currentPage: 1,
                    pageSize: 20,
                    keyword: keyword
                }
            } else {
                var id = $('#btn-underling-pop').attr('data-id')
                var data = {
                    id: id,
                    currentPage: 1,
                    pageSize: 20,
                    keyword: keyword
                }
            }
            if (event.keyCode == 13) {
                if (keyword == "") {
                    quoObj.filter();
                } else {
                    $.ajax({
                        url: Base.sitUrl + '/api/customer/contacts/v1/contacts/list/query/keyword',
                        type: 'POST',
                        dataType: 'json',
                        data: {
                            data: JSON.stringify(data)
                        },
                        success: function (res) {
                            if (!res.success) {
                                $.unLogin(res);
                                return;
                            }

                            var data = res.data.results;
                            var page = res.data.totalItem;
                            customerRe(data, page);
                        }
                    });
                }
            }
        });
        // 所有选中任务id
        function getAllChecked() {
            var ids = "";
            $('.page_info .table tbody td input[type=checkbox]:checked').each(function () {
                var _id = $(this).attr('data-id');
                ids += _id + ',';
            });
            ids = ids.substring(0, ids.length - 1);
            return ids;
        }

        //标记到
        $('#tagsModal').on('click', 'ul li', function () {
            var val = $(this).attr("data-value");
            var ids = getAllChecked();
            var data = {
                ids: ids,
                tagId: val,
                setType: 'tag'
            }
            if ($('.page_info .table tbody td input[type=checkbox]:checked').length < 1) {
                $.Alert('请选择标记人员');
            } else {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/set',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        data: JSON.stringify(data)
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }

                        $("#tagsModal").removeClass("active");
                        quoObj.filter();
                    }
                });
            }
        });
        //删除标签
        $(document).on('click', '.tags-li .s-dels3', function (e) {
            $.EventFn(e);
            var id = $(this).parent().find('span').attr("data-tagid");
            var data = {
                id: id,
                setType: 'delTag'
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/contacts/set',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    quoObj.filter();
                }
            })
        })
        //左侧分组列表获取
        function leftInfo() {
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/list',
                type: 'POST',
                dataType: 'json',
                data: {
                    tagType: 2
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var tags = res.data,
                        tagsList = "";
                    for (var i = 0; i < tags.length; i++) {
                        tagsList += '<li data-value="' + tags[i].id + '">' + tags[i].name + '</li>'
                    }
                    $(".label-list").empty().append(tagsList);
                    $("#tagsModal").find("ul").empty().append(tagsList);
                }
            })
        }

        //添加标签
        $("#tagsAdd").on('click', function () {
            var name = $("#labelNames").val();
            if (name == '') {
                $.Alert('标签不能为空')
            } else {
                tagsAdd(name);
            }
        });
        //添加标签
        $("#btn-addLabel").on('click', function () {
            var name = $("#labelName").val();
            if (name == '') {
                $.Alert('标签不能为空')
            } else {
                tagsAdd(name);
            }
        });
        function tagsAdd(name) {
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/save',
                type: 'POST',
                dateType: 'json',
                data: {
                    tagType: 2,
                    name: name
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    $.Alert("添加成功！");
                    leftInfo();
                    $(".addTags").hide();
                    $(".s-close").addClass("s-add");
                    $(".s-add").removeClass("s-close");
                }
            })
        }

        //获取跟进人列表
        function followerList() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/underling/customer',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = '<option value="0">不限</option>',
                        html = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                        html += '<li data-value="' + data[i].id + '">' + data[i].name + '</li>'
                    }
                    $("#followList").empty().append(list);
                    $('#myModal .modal-body>ul').empty().append(html);
                }
            })
        }
        //获取公司列表
        function companyList() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/assign/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        html = '<option value="0">不限</option>';
                    for (var i = 0; i < data.length; i++) {
                        html += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                    }
                    $("#companyList").empty().append(html);
                }
            })
        }
        //获取客户标签列表
        function clientTags(){
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/list?tagType=2',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = '';
                    for (var i = 0; i < data.length; i++) {
                        list += '<li data-id="' + data[i].id + '">' + data[i].name + '</li>'
                    }
                    $("#filter-tag .tag-list").empty().append(list);
                }
            })
        }

        //下属
        $('#btn-underling').on('click', function (e) {
            if ($(this).hasClass('on')) {
                quoObj.filter();
                $('#btn-underling-pop').hide();
                $(this).removeClass('on')
                $(this).attr('data-toggle', 'modal');
                $(this).attr('data-target', '#myModal');
                $.EventFn(e)
            }
        });
        $('#myModal .modal-body>ul').on('click', '>li', function () {
            var id = $(this).attr('data-value')
            var name = $(this).text();
            $('#btn-underling').attr('data-toggle', '');
            $('#btn-underling').attr('data-target', '');
            $('#btn-underling').addClass('on');
            $('#btn-underling-pop').text(name);
            $('#btn-underling-pop').attr('data-id', id);
            $('#btn-underling-pop').show();
            $('#underling-close').click();
            var dataJson = '{"currentPage":1,"pageSize":20,"conditions":[{"filedName":"followUpUser","operateType":"=","filedValue":"' + id + '"}]}';
            clickFind(dataJson);
        });
        //获取搜索条件
        $("#btn-filter").on('click', function () {
            companyList();
            followerList();
            clientTags();

            var data = countries,
                list = '<option value="0">选择国家地区</option>';
            for (var i = 0; i < data.length; i++) {
                list += '<option value="' + data[i].id + '">' + data[i].cn + ' - ' + data[i].en + '</option>'
            }
            $("#countryList").empty().append(list);
        });
        $("#inlineCheckbox").change(function(){
            var checked = $(this).prop('checked');
            if(checked == true){
                $('input[name=checkstar]').prop('checked',true);
                $('input[name=checkstar]').parent().addClass('checked');
            }else{
                $('input[name=checkstar]').prop('checked',false);
                $('input[name=checkstar]').parent().removeClass('checked');
            }
        });
        $("input[name=checkstar]").change(function(){
            var checked = $(this).prop('checked');
            if(checked == true){
                for(var i =0;i<$("input[name=checkstar]").length;i++){
                    if(!$("input[name=checkstar]").eq(i).prop('checked') && i!=0) return;
                }
                $("#inlineCheckbox").prop('checked',true).parent().addClass('checked');
            }else{
                $("#inlineCheckbox").prop('checked',false).parent().removeClass('checked');
            }
        });

        $('#filterModal').on('click','.checked-tags',function(){
            $(this).next().toggle();
        });
        $('#filterModal').on('click','.tag-list li',function(){
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
        $('#filterModal').on('click','.checked-tags .mark',function(e) {
            $.EventFn(e);
        });
        $('#filterModal').on('click','.checked-tags .close-icon',function(e){
            $.EventFn(e);
            $(this).parent().remove();
        });

        $('#reset').click(function(){
            $('#keyword,#position').val('');
            $('input[name=checkstar]').prop('checked',false).parent().removeClass('checked');
            $('input[name=checktag]').prop('checked',false).parent().removeClass('checked');
            $('.checked-tags').empty();
            $('#companyList,#followList,#countryList').val('0');
        });
        $("#screen").unbind('click').on('click', function () {
            var inputKeyword = $("#keyword").val();//关键字
            var containsTags = $("input[name=checktag]:checked").val();
            var star='',tags='';//星级，标签
            var customerId = $("#companyList").val();//公司名称
            var followUpUser = $("#followList option:selected").val();//跟进人
            var position = $("#position").val();//职位
            var country = $('#countryList').val();//国家

            if ($('.checkstar').find("input[type=checkbox]:checked").length > 0) {
                if ($("#inlineCheckbox").prop("checked") == true) {
                    star = "1,2,3,4,5,";
                } else {
                    for (var i = 0; i < $('.checkstar').find("input[type=checkbox]:checked").length; i++) {
                        star += $('.checkstar').find("input[type=checkbox]:checked").eq(i).val() + ',';
                    }
                }
            }
            var starLevel = star.substring(0, star.length - 1);

            if ($(".checked-tags").children("span.tag-cont").length > 0) {
                for (var i = 0; i < $(".checked-tags").children("span.tag-cont").length; i++) {
                    tags += $(".checked-tags").children("span.tag-cont").eq(i).attr("data-id") + ',';
                }
            } else {
                tags += '0';
            }
            var tagIds = tags.substring(0, tags.length - 1);

            if (starLevel != "") {//星级
                pageObj.starLevels = starLevel;
            }
            if (tagIds != "") {//标签id
                pageObj.containsTags = containsTags?containsTags:1;
                pageObj.tagIds = tagIds;
            }
            if (customerId != "" && customerId!=0) {
                pageObj.customerId = customerId;
            }
            if (followUpUser != "" && followUpUser != 0) {
                pageObj.followUpUser= followUpUser;
            }

            pageObj.conditions = [];
            var condition='';
            if (inputKeyword != "") {
                condition = {"filedName":"name","operateType":"like","filedValue": inputKeyword};
                pageObj.conditions.push(condition);
            }
            if (position != "") {
                condition = {"filedName":"position","operateType":"like","filedValue":position};
                pageObj.conditions.push(condition);
            }
            if (country != "" && country != 0) {//国家地区
                condition = {"filedName":"countries","operateType":"=","filedValue":country};
                pageObj.conditions.push(condition);
            }
            pageObj.currentPage = 1;

            clickFind(JSON.stringify(pageObj));
        });

        //左边栏查询
        function leftFind(dataJson) {
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/contacts/list/query',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: dataJson
                },
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
                    var page = res.data.totalItem;
                    if (data == "") {
                        var none = '<div class="trNone">' +
                            '<div class="trnone-info">' +
                            '<img src="../images/empty-contact.png" width="60" height="80" alt="" />' +
                            '<p class="trnone-text">暂无联系人</p>'+
                            '</div>' +
                            '<a href="pop-contacts-add.html" class="trnone-btn btn btn-primary" data-code="contact_add" data-maintab></i><span>创建联系人</span></a>'+
                            '</div>';
                        $('.page_info>table>tbody').empty();
                        $('.page_info>table').after(none);
                    }else {                        
                        customerRe(data, page);
                    }
                }
            });
        }

        $('#conFilter').on('click', ".label-list li", function () {//标签查询
            $(this).addClass('active').siblings('li').removeClass('active');
            pageObj.currentPage = 1;
            var val = $(this).attr("data-value");
            var pageJson = JSON.stringify(pageObj);
            var conditions = '[{"filedName":"tagId","operateType":"=","filedValue":"' + val + '"}]';
            var dataJson = pageJson.substring(0, pageJson.length - 1) + ',"conditions":' + conditions + '}';
            leftFind(dataJson);
        });
        //点击查询
        function clickFind(dataJson) {
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/contacts/list/query',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: dataJson
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    if(!$('#filterModal').is(':hidden')){
                        $('#filterModal').modal('hide');
                    }
                    var data = res.data.results;
                    var page = res.data.totalItem;
                    customerRe(data, page);
                    if (data == "") {
                        var none = '<div class="trNone">' +
                            '<div class="trnone-info">' +
                            '<img src="../images/empty-contact.png" alt="" />' +
                            '<p class="trnone-text">暂无联系人</p>'+
                            '</div>' +
                            '<a href="pop-contacts-add.html" class="trnone-btn btn btn-primary" data-code="contact_add" data-maintab></i><span>创建联系人</span></a>'+
                            '</div>';
                        $('.page_info>table>tbody').empty();
                        $('.page_info>table').after(none);
                    }
                }
            })
        }

        //删除联系人
        $("#btn-dels").on('click', function () {
            var on = 0;
            $('.page_info .table tbody td input[type=checkbox]:checked').each(function () {
                var seas = $(this).parents('tr').attr('data-highSeas');
                if (seas == 1) {
                    $.Alert($(this).parents('tr').find('.sortsName span').text() + '是公海联系人,您不能删除');
                    on = 1;
                }
            });
            if (on == 1) {
                return;
            }
            var ids = getAllChecked();
            var del = "delete";
            var data = {
                ids: ids,
                setType: del
            };
            data = JSON.stringify(data);
            $.Confirm('确认删除？', '', function () {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/set',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        data: data
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        $('.m_batch').stop().animate({'left': '-100%'}, function () {
                            $(this).removeClass('active');
                        });
                        $.Alert("删除成功！");
                        quoObj.filter();
                    }
                });
            });
        });
        //字段空值
        function testNull(test) {
            if (test == null) {
                return "";
            } else {
                return test;
            }
        }
        //联系人
        $(".table thead th").on('click', function () {
            var $this = $(this),
                trSort = $(".table:first tbody tr");
            if ($this.attr("id") == "sortsName") {//客户名排序
                if ($this.find('.s-updownBg').hasClass('s-reorderList')) {
                    $this.find('.s-updownBg').removeClass('s-reorderList').addClass('s-orderList');
                    trSort = trSort.sort(function (a, b) {
                        return $(a).find('.s-special').text().localeCompare($(b).find('.s-special').text());
                    });
                } else {
                    $this.find('.s-updownBg').addClass('s-reorderList').removeClass('s-orderList');
                    trSort = trSort.sort(function (a, b) {
                        return $(b).find('.s-special').text().localeCompare($(a).find('.s-special').text());
                    });
                }
            }
            else if ($this.attr("id") == "sortsTime") {//时间排序
                if ($this.hasClass('up')) {
                    $this.find(".s-updownBg").addClass("s-reorderList").removeClass("s-orderList");
                    $this.removeClass("up");
                    trSort = trSort.sort(function(a, b){
                        return new Date($(a).find('.sortsTime').text()).getTime() - new Date($(b).find('.sortsTime').text()).getTime();
                    });
                }
                else {
                    $this.find(".s-updownBg").addClass("s-orderList").removeClass("s-reorderList");
                    $this.addClass("up");
                    trSort = trSort.sort(function(a, b){
                        return new Date($(b).find('.sortsTime').text()).getTime() - new Date($(a).find('.sortsTime').text()).getTime();
                    });
                }
            }
            else if ($(this).attr("id") == "sortsStar") {//星级筛选
                if (!$this.hasClass('up')) {//星级倒序
                    $this.find(".s-updownBg").addClass("s-reorderList").removeClass("s-orderList");
                    $this.addClass("up");
                    trSort = trSort.sort(function(a, b){
                        return $(a).find('.starLevelOp .s-star3').length - $(b).find('.starLevelOp .s-star3').length;
                    });
                }
                else {
                    $this.find(".s-updownBg").addClass("s-orderList").removeClass("s-reorderList");
                    $this.removeClass("up");
                    trSort = trSort.sort(function(a, b){
                        return $(b).find('.starLevelOp .s-star3').length - $(a).find('.starLevelOp .s-star3').length;
                    });
                }
            }

            $(".table:first tbody").empty().append(trSort);
        });

        $(document).on('click', 'tbody tr td', function () {
            var a = $(this).find("div.checker");
            if (a.length == 1) {
                return;
            } else {
                $(this).parent().find(".sortsName a").click();
            }
        });
        //页面初始化
        quoObj.filter();
        leftInfo();
        followerList();
    });
});