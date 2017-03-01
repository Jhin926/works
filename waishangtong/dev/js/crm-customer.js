/* !
 *  用于CRM客户设置
 */
require(['common'], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN', 'jquery'], function (maintab) {
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
        var sessionKeyId = parent.document.getElementById("pageLeftUserName").innerText;
        $.sessionKeyIdFunc = function () {
            var Id = $('#pageLeftUserName', parent.document).attr('data-id');
            return Id;
        }
        //  星级效果
        $(document).on('click', '.starLevelOp>i', function (e) {
            $.EventFn(e);
            var obj = $(this).parent().children('i');
            if ($(this).hasClass('s-unstar2')) {
                other.goodFn(obj, $(this).index());
            } else {
                other.nagativeFn(obj, $(this).index());
            }
            //星级设置
            var id = $(this).parents("tr").attr("data-id");
            var val = $(this).parents(".starLevelOp").find(".s-star2").length;
            var data = {
                id: id,
                starLevel: val,
                setType: 'setStar'
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/set',
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
                    obj.eq(i).removeClass('s-unstar2').addClass('s-star2');
                }
            },
            nagativeFn: function (obj, limit) {
                for (var i = 0; i < obj.length; i++) {
                    if (i > limit) {
                        obj.eq(i).removeClass('s-star2').addClass('s-unstar2');
                    } else {
                        obj.eq(i).removeClass('s-unstar2').addClass('s-star2');
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
        //  左侧客户分组/标签伸缩
        $('#custFilter li a').on('click', function (e) {
            $.EventFn(e);
            if (!$(this).parent().attr("active")) {
                $(this).parent().addClass("active").siblings("li").removeClass("active");
            }
            if ($(this).parent().find("ul").attr("class") == 'group-list' || $(this).parent().find("ul").attr("class") == 'label-list' || $(this).parent().find("ul").attr("class") == 'highsea-list') {
                $(this).parent().find("ul").addClass("active");
                $(this).parent().find(".s-up2").addClass("s-down2");
                $(this).parent().find(".s-down2").removeClass("s-up2");
            } else {
                $(this).parent().find("ul").removeClass("active");
                $(this).parent().find(".s-up2").removeClass("s-down2");
                $(this).parent().find(".s-down2").addClass("s-up2");
            }
        });
        $(".page-left").on('click', "#custFilter .s-up2", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").addClass("active");
            $(this).addClass("s-down2");
            $(this).parents("li").find(".s-down2").removeClass("s-up2");
        });
        $(".page-left").on('click', "#custFilter .s-down2", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").removeClass("active");
            $(this).addClass("s-up2");
            $(this).parents("li").find(".s-up2").removeClass("s-down2");
        });
        $(".page-left").on('click', "#custFilter .s-add", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").addClass("active");
            $(this).parents("li").find(".addGroup").show();
            $(this).addClass("s-close");
            $(this).parents("li").find(".s-close").removeClass("s-add");
        });
        $(".page-left").on('click', "#custFilter .s-close", function (e) {
            $.EventFn(e);
            $(this).parents("li").find("ul").addClass("active");
            $(this).parents("li").find(".addGroup").hide();
            $(this).addClass("s-add");
            $(this).parents("li").find(".s-add").removeClass("s-close");
        });
        //关闭按钮变换
        $('#batchClose').on('mouseenter', function () {
            $(this).addClass('s-updownBg s-dels4').removeClass('fa fa-times')
        });
        $('#batchClose').on('mouseleave', function () {
            $(this).addClass('fa fa-times').removeClass('s-updownBg s-dels4')
        });
        //  关闭面板
        $('.mclose').on('click', function () {
            modalsClose();
        });
        function modalsClose() {
            $('.modals').removeClass('active');
            $('#assigns').val('');
            $('#btn-assign').hide();
            counObj = {
                arr: [],
                tmp: []
            };
        }

        //点击显示对应文字
        $(".my_customer").on("click", function () {
            $('.r-titles .model-name').text('我的客户');
        });
        $(".my_tag").on("click", function () {
            $('.r-titles .model-name').text('标签');
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
            $('#salesModal').addClass('active').css('left', $(this).position().left - 52).siblings('.modals').removeClass('active');
        });

        var counObj = {
            arr: [],
            tmp: []
        };

        //选项操作
        $("#btn-groups").on('click', function () {
            $("#groupsModal").addClass('active').siblings().removeClass('active');
        });
        $("#btn-tags").on('click', function () {
            $("#tagsModal").addClass('active').css("marginLeft", "90px").siblings().removeClass('active');
        });
        $("#btn-assigns").on('click', function () {
            $("#salesModal").addClass('active').css("marginLeft", "52px").siblings().removeClass('active');
        });
        $("#btn-shares").on('click', function () {
            $("#sharesModal").addClass('active').css("marginLeft", "250px").siblings().removeClass('active');
        });
        $('#output').click(function () {
            var ids = getAllChecked();
            parent.location.href = Base.sitUrl + '/api/customer/v1/export?data=' + JSON.stringify({'ids': ids});
        });
        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 20,
            conditions: []
        };
        var delObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 20,
            conditions: []
        };
        var repeatObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 20,
            keyword: ''
        };
        //  查询列表
        var quoObj = {
            filter: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/list/query',
                    data: {
                        data: JSON.stringify(pageObj)
                    },
                    type: 'POST',
                    dataType: 'json',
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
                        if (!$('#filterModal').is(':hidden')) {
                            $('#filterModal').modal('hide');
                        }
                        var data = res.data.results;
                        var page = res.data.totalItem;
                        if (data.length > 0) {
                            customerRe(data, page);
                        } else {
                            var none = '<div class="trNone">' +
                                '<div class="trnone-info">' +
                                '<img src="../images/empty-customer.png" alt="" />' +
                                '<p class="trnone-text">暂无客户</p>' +
                                '</div>' +
                                '<a href="pop-customer-add.html" class="trnone-btn btn btn-primary" data-code="customer_add" data-maintab></i><span>创建客户</span></a>' +
                                '</div>';
                            $('.page_info>table>tbody').empty();
                            $('.page_info>table').after(none);
                            $('.page').empty();
                        }
                    }
                });
            },
            del: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/list/query',
                    data: {
                        data: JSON.stringify(delObj)
                    },
                    type: 'POST',
                    dataType: 'json',
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
                        if (!$('#filterModal').is(':hidden')) {
                            $('#filterModal').modal('hide');
                        }
                        var data = res.data.results;
                        var page = res.data.totalItem;
                        if (data.length > 0) {
                            customerDe(data, page);
                        } else {
                            var none = '<div class="trNone">' +
                                '<div class="trnone-info">' +
                                '<img src="../images/empty-customer.png" alt="" />' +
                                '<p class="trnone-text">暂无客户</p>' +
                                '</div>' +
                                '<a href="pop-customer-add.html" class="trnone-btn btn btn-primary" data-code="customer_add" data-maintab></i><span>创建客户</span></a>' +
                                '</div>';
                            $('.page_info>table>tbody').empty();
                            $('.page_info>table').after(none);
                            $('.page').empty();
                        }
                    }
                });
            },
            repeatFilter: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/list/duplicate/customer/by/keyword',
                    type: 'POST',
                    data: {
                        data: JSON.stringify(repeatObj)
                    },
                    beforeSend: function (XHR) {
                        $.BlockUI();
                    },
                    complete: function (XHR, TS) {
                        $.UnblockUI();
                    },
                    success: function (data) {
                        if (data.data.results != "") {
                            $("#img_con").css("display", "none");
                            $(".table-responsive").css("display", "block");
                            var total = data.data.totalItem,
                                ps = repeatObj.pageSize,
                                all = data.data.totalPage;
                            $.Page({
                                total: total,
                                _class: '.page',
                                nowNum: repeatObj.currentPage,
                                allNum: all,
                                callback: function (now, all) {
                                    repeatObj.currentPage = now;
                                    quoObj.repeatFilter();
                                }
                            });
                            var list = "";
                            var data = data.data.results;
                            for (var i = 0; i < data.length; i++) {
                                var contacts = data[i].contactNames;
                                if (contacts) {
                                    contacts = contacts.substr(0, 12);
                                } else {
                                    contacts = data[i].contactNames;
                                }
                                var status;
                                if (data[i].statusName) {
                                    status = data[i].statusName.substr(0, 1);
                                } else {
                                    status = data[i].statusName;
                                }
                                var username = data[i].followUpUsers;
                                if (username.length > 0) {
                                    username = data[i].followUpUsers[0].userName;
                                } else {
                                    username = "";
                                }
                                list += "<tr class='table_title'><td><div class='table_status' style='background:" + data[i].statusColour + "'>" + testNull(status) + "</div></td><td>" + testNull(data[i].name) + "</td><td>" + testNull(contacts) + "</td><td>" + testNull(data[i].defaultEmail) + "</td><td>" + testNull(data[i].phone) + "</td><td>" + testNull(username) + "</td><td>" + testNull(data[i].createTime) + "</td></tr>"
                            }
                            $("#table_info").empty();
                            $("#table_info").append(list)
                        } else {
                            $(".table-responsive").css("display", "none");
                            $("#img_con").css("display", "block");
                        }
                    }
                })
            }
        }
        //列表渲染
        function customerRe(dataJson, pageNum) {
            var html = '';
            $.each(dataJson, function (index, content) {
                var star = '', none = "", tags = '';
                for (var i = 0; i < 5; i++) {//星级
                    if (i < content.starLevel) {
                        star += '<i class="s-updownBg s-star2"></i>';
                    } else {
                        star += '<i class="s-updownBg s-unstar2"></i>';
                    }
                }
                if (content.customerTags == "") {//标签
                    none = "none";
                } else {
                    for (var i = 0; i < 2; i++) {//最多显示两个标签
                        if (i >= content.customerTags.length) {
                            break;
                        }
                        if (content.customerTags[i].tagName.length > 8) {
                            content.customerTags[i].tagName = content.customerTags[i].tagName.substring(0, 7) + '...'
                        }
                        tags += '<li class="tags-li"><span data-tagId="' + content.customerTags[i].id + '">' + content.customerTags[i].tagName + '</span><i class="s-updownBg s-dels3"></i></li>'
                    }
                }
                var countriesNone = '';
                if (content.countries == 0) {
                    countriesNone = 'none';
                    content.countries = '12'
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
                if (content.statusName == "" || content.statusName == null) {
                    content.statusName = "";
                    var color = "#ccc";
                }
                if (content.followUpUser !== '' && content.followUpUser !== null && content.followUpUser !== undefined) {
                    if (content.followUpUser.length > 4) {
                        content.followUpUser = content.followUpUser.substring(0, 3) + '...'
                    }
                }
                if (content.customerSourceName !== '' && content.customerSourceName !== null && content.customerSourceName !== undefined) {
                    if (content.customerSourceName.length > 6) {
                        var SourceName = content.customerSourceName.substring(0, 5) + '...'
                    } else {
                        var SourceName = content.customerSourceName;
                    }
                }
                if (content.name !== '' && content.name !== null && content.name !== undefined) {
                    if ($.GetLength(content.name) > 40) {
                        content.name = content.name.substring(0, 40) + '...'
                    }
                }
                if (content.statusColour == null || content.statusColour == '') {
                    content.statusColour = '#bbb'
                }
                if (content.statusName == null || content.statusName == '') {
                    content.statusName = '无'
                }
                html += '<tr data-id="' + content.id + '" data-highSeas="' + content.highSeas + '">' +
                    '<td>' +
                    '<div class="checker"><span><input name="batch" type="checkbox" data-id="' + content.id + '"></span></div></td>' +
                    '<td style="text-align: center;padding: 8px 0;"><span class="s-status" style="float:none;background-color: ' + content.statusColour + ';">' + testNull(content.statusName.substring(0, 1)) + '</span></td>' +
                    '<td class="sortsName">' +
                    '<a href="../html/pop-customer-detail.html?id=' + content.id + '&v=' + window.ver + '" data-maintab><span  class="s-special">' + testNull(content.name) + '</span></a>' +
                    '<br><span class="recentNews">' + testNull(content.recentNews) + '</span></td>' +
                    '<td class="starLevelOp">' +
                    star +
                    '</td>' +
                    '<td><span>' + testNull(followUpUser) + '</span></td>' +
                    '<td title="' + testNull(content.customerSourceName) + '"><span>' + testNull(SourceName) + '</span></td>' +
                    '<td style="position:relative;"><img src="../images/country/PNG/' + content.countries + '.png" alt="国家" style="display:' + countriesNone + '" />' +
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
                    quoObj.filter();
                }
            });
        }

        //删除列表渲染
        function customerDe(dataJson, pageNum) {
            var html = '';
            $.each(dataJson, function (index, content) {
                var star = '', none = "", tags = '';
                for (var i = 0; i < 5; i++) {//星级
                    if (i < content.starLevel) {
                        star += '<i class="s-updownBg s-star2"></i>';
                    } else {
                        star += '<i class="s-updownBg s-unstar2"></i>';
                    }
                }
                if (content.customerTags == "") {//标签
                    none = "none";
                } else {
                    for (var i = 0; i < 2; i++) {//最多显示两个标签
                        if (i >= content.customerTags.length) {
                            break;
                        }
                        if (content.customerTags[i].tagName.length > 8) {
                            content.customerTags[i].tagName = content.customerTags[i].tagName.substring(0, 7) + '...'
                        }
                        tags += '<li class="tags-li"><span data-tagId="' + content.customerTags[i].id + '">' + content.customerTags[i].tagName + '</span><i class="s-updownBg s-dels3"></i></li>'
                    }
                }
                var countriesNone = '';
                if (content.countries == 0) {
                    countriesNone = 'none';
                    content.countries = '12'
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
                if (content.statusName == "" || content.statusName == null) {
                    content.statusName = "";
                    var color = "#ccc";
                }
                if (content.followUpUser !== '' && content.followUpUser !== null && content.followUpUser !== undefined) {
                    if (content.followUpUser.length > 4) {
                        content.followUpUser = content.followUpUser.substring(0, 3) + '...'
                    }
                }
                if (content.customerSourceName !== '' && content.customerSourceName !== null && content.customerSourceName !== undefined) {
                    if (content.customerSourceName.length > 6) {
                        var SourceName = content.customerSourceName.substring(0, 5) + '...'
                    } else {
                        var SourceName = content.customerSourceName;
                    }
                }
                if (content.name !== '' && content.name !== null && content.name !== undefined) {
                    if ($.GetLength(content.name) > 40) {
                        content.name = content.name.substring(0, 40) + '...'
                    }
                }
                if (content.statusColour == null || content.statusColour == '') {
                    content.statusColour = '#bbb'
                }
                if (content.statusName == null || content.statusName == '') {
                    content.statusName = '无'
                }
                html += '<tr data-id="' + content.id + '" data-highSeas="' + content.highSeas + '">' +
                    '<td>' +
                    '<div class="checker"><span><input name="batch" type="checkbox" data-id="' + content.id + '"></span></div></td>' +
                    '<td style="text-align: center;padding: 8px 0;"><span class="s-status" style="float:none;background-color: ' + content.statusColour + ';">' + testNull(content.statusName.substring(0, 1)) + '</span></td>' +
                    '<td class="sortsName">' +
                    '<a href="../html/pop-customer-detail.html?id=' + content.id + '&v=' + window.ver + '" data-maintab><span  class="s-special">' + testNull(content.name) + '</span></a>' +
                    '<br><span class="recentNews">' + testNull(content.recentNews) + '</span></td>' +
                    '<td class="starLevelOp">' +
                    star +
                    '</td>' +
                    '<td><span>' + testNull(followUpUser) + '</span></td>' +
                    '<td title="' + testNull(content.customerSourceName) + '"><span>' + testNull(SourceName) + '</span></td>' +
                    '<td style="position:relative;"><img src="../images/country/PNG/' + content.countries + '.png" alt="国家" style="display:' + countriesNone + '" />' +
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
                    quoObj.filter();
                }
            });
        }
        //搜索框搜索
        $("#inputQuick,#custName").on('keyup', function () {
            var keyword = $("#inputQuick").val() || $("#custName").val();
            if ($('#btn-underling-pop').css('display') == 'none') {
                var data = {
                    currentPage: 1,
                    pageSize: 10,
                    keyword: keyword
                }
            } else {
                var id = $('#btn-underling-pop').attr('data-id');
                var data = {
                    id: id,
                    currentPage: 1,
                    pageSize: 10,
                    keyword: keyword
                }
            }
            if (event.keyCode == 13) {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/list/query/keyword',
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

        //分组到
        $('#groupsModal').on('click', "ul li", function () {
            var val = $(this).attr("data-value");
            var ids = getAllChecked();
            var data = {
                ids: ids,
                customerGroupId: val,
                setType: 'group'
            }
            if ($('.page_info .table tbody td input[type=checkbox]:checked').length < 1) {
                $.Alert('请选择要分组人员');
            } else {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/set',
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

                        $("#groupsModal").removeClass("active");
                        quoObj.filter();
                        $.Alert("操作成功");
                    }
                });
            }
        });
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
                    url: Base.sitUrl + '/api/customer/v1/customer/set',
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
        //分配客户
        $('#salesModal').on('click', "ul li", function () {
            var val = $(this).attr("data-value");
            var ids = getAllChecked();
            var data = {
                ids: ids,
                userId: val,
                setType: 'allot'
            }
            if ($('.page_info .table tbody td input[type=checkbox]:checked').length < 1) {
                $.Alert('请选择要分配人员');
            } else {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/set',
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

                        $("#salesModal").removeClass("active");
                        quoObj.filter();
                        $.Alert("操作成功");
                    }
                });
            }
        });
        //共享客户
        $('#sharesModal').on('click', "ul li", function () {
            var val = $(this).attr("data-value");
            var ids = getAllChecked();
            var data = {
                ids: ids,
                userId: val,
                setType: 'share'
            }
            if ($('.page_info .table tbody td input[type=checkbox]:checked').length < 1) {
                $.Alert('请选择要分组人员');
            } else {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/set',
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
                        $("#sharesModal").removeClass("active");
                        quoObj.filter();
                        $.Alert("操作成功");
                    }
                });
            }
        });
        //删除标签
        $(document).on('click', '.tags-li .s-dels3', function (e) {
            $.EventFn(e)
            var id = $(this).parent().find('span').attr("data-tagid");
            var data = {
                id: id,
                setType: 'delTag'
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/set',
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
                    quoObj.filter();
                }
            })
        })
        //左侧分组列表获取
        function leftInfo() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/left/filters',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: '{}'
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var groups = res.data.groups,
                        tags = res.data.tags,
                        groupList = "",
                        highseaList = '',
                        tagsList = "";
                    var groupAll = '<li data-value="">全部分组</li>';
                    for (var i = 0; i < groups.length; i++) {
                        groupList += '<li data-value="' + groups[i].id + '">' + groups[i].name + ' <span>(' + (groups[i].totalCount || '无') + ')</span></li>';
                        highseaList += '<li data-value="' + groups[i].id + '">' + groups[i].name + ' <span>(' + (groups[i].totalCountHighSeas || '无') + ')</span></li>';
                    }
                    for (var i = 0; i < tags.length; i++) {
                        if ($.GetLength(tags[i].name) > 13) {
                            var name = $.autoAddEllipsis(tags[i].name, 12)
                        } else {
                            var name = tags[i].name
                        }
                        tagsList += '<li data-value="' + tags[i].id + '" title="' + tags[i].name + '">' + name + '</li>'
                    }
                    $(".group-list").empty().append(groupAll).append(groupList);
                    $(".highsea-list").empty().append(groupAll).append(highseaList);
                    $(".label-list").empty().append(tagsList);
                    $("#groupsModal").find("ul").empty().append(groupList);
                    $("#tagsModal").find("ul").empty().append(tagsList);
                }
            })
        }

        //添加标签
        $("#tagsAdd").on('click', function () {
            var name = $("#labelNames").val();
            tagsAdd(name);
        });
        function tagsAdd(name) {
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/save',
                type: 'POST',
                dateType: 'json',
                data: {
                    tagType: 1,
                    name: name
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    $.Alert("添加成功！");
                    leftInfo();
                    $(".addGroup").hide();
                    $(".s-close").addClass("s-add");
                    $(".s-add").removeClass("s-close");
                }
            })
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
                        list = '<option value="0">全</option>';
                    for (var i = 0; i < data.length; i++) {
                        var name = data[i].name;
                        list += '<option value="' + data[i].id + '">' + name + '</option>';
                    }
                    $("#statusList").empty().append(list);
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
                        list = "<option value='0'>请选择</option>";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#sourceList").empty().append(list);
                }
            })
        }

        //获取客户类型列表
        function clientType() {
            $.ajax({
                url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                type: 'POST',
                data: {'group': 'customer.type'},
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = "<option value='0'>请选择</option>";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].value + '</option>'
                    }
                    $("#custType").empty().append(list);
                }
            })
        }

        //获取客户分组列表
        function clientGroup() {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/group/list',
                type: 'POST',
                data: {'group': 'customer.type'},
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = "<option value='0'>请选择</option>";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#custGroup").empty().append(list);
                }
            })
        }

        //获取客户标签列表
        function clientTags() {
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/list?tagType=1',
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


        //获取国家地区列表
        function clientCountry() {
            var data = $.countries,
                list = '<option value="0">选择国家地区</option>';
            for (var i = 0; i < data.length; i++) {
                list += '<option value="' + data[i].id + '">' + data[i].cn + ' - ' + data[i].en + '</option>'
            }
            $("#countryList").empty().append(list);
        }

        //获取主营产品类型
        function clientPdtType() {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/list',
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data,
                        list = '<option value="0">请选择</option>';
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdtType").empty().append(list);
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
                        option = "",
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        option += '<option value="' + data[i].id + '">' + data[i].name + '</option>';
                        list += '<li data-value="' + data[i].id + '">' + data[i].name + '</li>';
                    }
                    var none = '<option value="">不限</option>';

                    $("#followerList").empty().append(none).append(option);
                    $("#salesModal").find("ul").empty().append(list);
                    $("#sharesModal").find("ul").empty().append(list);
                    $('#myModal .modal-body>ul').empty().append(list)
                }
            })
        }

        $('#filterModal').on('click', '.checked-tags', function () {
            $(this).next().toggle();
        });
        $('#filterModal').on('click', '.tag-list li', function () {
            var $this = $(this);
            $this.parent().hide();
            var checkedTags = $this.parent().prev('.checked-tags').find('.tag-cont');

            for (var i = 0; i < checkedTags.length; i++) {
                if ($this.attr('data-id') == checkedTags.eq(i).attr('data-id')) {
                    return;
                }
            }

            var tag = '<span class="tag-cont" data-id="' + $(this).attr('data-id') + '"><span class="mark ellipsis">' + $(this).text() + '</span><i class="close-icon"></i></span>';
            $this.parent().prev('.checked-tags').append(tag);
        });
        $('#filterModal').on('click', '.checked-tags .mark', function (e) {
            $.EventFn(e);
        });
        $('#filterModal').on('click', '.checked-tags .close-icon', function (e) {
            $.EventFn(e);
            $(this).parent().remove();
        });

        $("#pdtType").change(function () {
            var id = $(this).val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
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
                    $("#pdtType2").empty().append('<option value="">请选择产品类型</option>').append(list);
                }
            })
        });
        $("#pdtType2").change(function () {
            var id = $(this).val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
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
                    $("#pdtType3").empty();
                    $("#pdtType3").append('<option value="">请选择产品类型</option>');
                    $("#pdtType3").append(list);
                }
            })
        });
        $("#pdtType3").change(function () {
            var id = $(this).val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
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
                    $("#pdtType4").empty();
                    $("#pdtType4").append('<option value="">请选择产品类型</option>');
                    $("#pdtType4").append(list);
                }
            })
        });
        $("#inlineCheckbox").change(function () {
            var checked = $(this).prop('checked');
            if (checked == true) {
                $('input[name=checkstar]').prop('checked', true);
                $('input[name=checkstar]').parent().addClass('checked');
            } else {
                $('input[name=checkstar]').prop('checked', false);
                $('input[name=checkstar]').parent().removeClass('checked');
            }
        });
        $("input[name=checkstar]").change(function () {
            var checked = $(this).prop('checked');
            if (checked == true) {
                for (var i = 0; i < $("input[name=checkstar]").length; i++) {
                    if (!$("input[name=checkstar]").eq(i).prop('checked') && i != 0) return;
                }
                $("#inlineCheckbox").prop('checked', true).parent().addClass('checked');
            } else {
                $("#inlineCheckbox").prop('checked', false).parent().removeClass('checked');
            }
        });

        $('#screen').click(function (e) {
            $.EventFn(e);
            var status = $("#statusList").val();//客户状态
            var name = $("#keyword").val();//关键字
            var containsTags = $("input[name=checktag]:checked").val();
            var star = '', tags = '';//星级，标签
            var latestContactDays = $("#lastTime").val();//未联系时间
            var countries = $("#countryList").val();//国家地区
            var custGroup = $('#custGroup').val();//客户分组
            var custType = $('#custType option:selected').index();//客户类型
            var customerSource = $("#sourceList").val();//客户来源
            var productType = '';//主营产品
            var followCond = $("#followType input[type=radio]:checked").val();//跟进情况

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
                tags += '0'
            }
            var tagIds = tags.substring(0, tags.length - 1);

            var productType1 = $("#pdtType option:selected").val();
            var productType2 = $("#pdtType2 option:selected").val();
            var productType3 = $("#pdtType3 option:selected").val();
            var productType4 = $("#pdtType4 option:selected").val();
            if (productType4 !== undefined && productType4 !== "") {
                productType = productType4;
            } else if (productType3 !== undefined && productType3 !== "") {
                productType = productType3;
            } else if (productType2 !== undefined && productType2 !== "") {
                productType = productType2;
            } else if (productType1 !== undefined && productType1 !== "") {
                productType = productType1;
            }

            pageObj.conditions = [];
            var condition;
            if (status != '' && status != 0) {//客户状态
                condition = {"filedName": "status", "operateType": "=", "filedValue": status};
                pageObj.conditions.push(condition);
            }
            if (name != "") {//关键字
                pageObj.keyword = name;
            }
            if (starLevel != "") {//星级
                pageObj.starLevels = starLevel;
            }
            if (tagIds != "") {//标签id
                pageObj.containsTags = containsTags ? containsTags : 1;
                pageObj.tagIds = tagIds;
            }
            if (latestContactDays != "" && latestContactDays != 0) {//未联系时间
                pageObj.latestContactDays = latestContactDays;
            }
            if (countries != "" && countries != 0) {//国家地区
                condition = {"filedName": "countries", "operateType": "=", "filedValue": countries};
                pageObj.conditions.push(condition);
            }
            if (custGroup != "" && custGroup != "0") {//客户分组
                pageObj.customerGroupId = custGroup;
            }
            if (custType != "" && custType != "0") {//客户类型
                pageObj.customerType = custType;
            }
            if (customerSource != "" && customerSource != "0") {//客户来源
                condition = {"filedName": "customerSource", "operateType": "=", "filedValue": customerSource};
                pageObj.conditions.push(condition);
            }
            if (productType != "" && productType != "0") {//主营产品
                pageObj.productType = productType;
            }
            if (followCond != undefined) {//跟进情况
                pageObj.followStatus = followCond ? followCond : 0;
            }
            if (status == '' && name == '' && starLevel == '' && tagIds == '' && latestContactDays == '' && countries == '' && custGroup == '' && custType == '' && customerSource == '' && productType == '' && followCond == '') {
                pageObj.conditions = [];
            }

            pageObj.currentPage = 1;
            quoObj.filter();
        });
        $('#reset').click(function () {
            $('#filterModal input#keyword').val('');
            $('input[name=checkstar]').prop('checked', false).parent().removeClass('checked');
            $('input[name=checktag]').prop('checked', false).parent().removeClass('checked');
            $('.checked-tags').empty();
            $('#lastTime,#statusList,#countryList,#custGroup,#custType,#sourceList').val('0');
            $('.pdtType select').val(0);
            $('#followType input').prop('checked', false).parent().removeClass('checked');
        });
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
            var id = $(this).attr('data-value');
            var name = $(this).text();
            $('#btn-underling').attr('data-toggle', '');
            $('#btn-underling').attr('data-target', '');
            $('#btn-underling').addClass('on');
            $('#btn-underling-pop').text(name);
            $('#btn-underling-pop').attr('data-id', id);
            $('#btn-underling-pop').show();
            $('#underling-close').click();
            pageObj.conditions = [{"filedName": "followUpUser", "operateType": "=", "filedValue": id}];
            quoObj.filter();
        });
        //获取筛选条件
        $("#btn-filter").on('click', function () {
            statusList();
            clientSource();
            clientCountry();
            clientType();
            clientGroup();
            clientTags();
            clientPdtType();
        });
        //左边栏查询
        function leftFind(dataJson) {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/list/query',
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
                    customerRe(data, page);
                    if (data == "") {
                        var none = '<div class="trNone">' +
                            '<div class="trnone-info">' +
                            '<img src="../images/empty-customer.png" alt="" />' +
                            '<p class="trnone-text">暂无客户</p>' +
                            '</div>' +
                            '<a href="pop-customer-add.html" class="trnone-btn btn btn-primary" data-code="customer_add" data-maintab></i><span>创建客户</span></a>' +
                            '</div>';
                        $('.page_info>table').after(none);
                    }
                }
            });
        }

        $('#custFilter').on('click', ".group-list li", function () {//分组查询
            $('.label-list').find('li.active').removeClass('active');
            $(this).addClass('active').siblings('li').removeClass('active');
            $('#highSeas').removeClass('active');

            //按钮组
            $('#btn-groups').attr('disabled', false);
            $('#btn-tags').attr('disabled', false);
            $('#btn-assigns').attr('disabled', false);
            $('#btn-shares').attr('disabled', false);
            $('#btn-dels').attr('disabled', false);
            $('#output').attr('disabled', false);
            $('#nohighSeas-btn').attr('disabled', true);

            var val = $(this).attr("data-value");
            pageObj.currentPage = 1;
            if ($(this).index() == 0) {//全部分组
                pageObj.conditions = [{"filedName": "highSeas", "operateType": "=", "filedValue": 0}];
            } else {
                pageObj.conditions = [{
                    "filedName": "customerGroupId",
                    "operateType": "=",
                    "filedValue": val
                }, {"filedName": "highSeas", "operateType": "=", "filedValue": 0}];
            }

            var pageJson = JSON.stringify(pageObj);
            $('.r-titles .model-name').text('分组客户');
            if (val == '') {
                quoObj.filter();
            } else {
                leftFind(pageJson);
            }
        });

        $('#custFilter .highsea-list').on('click', 'li', function () {
            $('.label-list').find('li.active').removeClass('active');
            $(this).addClass('active').siblings('li').removeClass('active');

            $('#btn-dels').attr('disabled', false);
            $('#nohighSeas-btn').attr('disabled', true);

            var val = $(this).attr("data-value");
            pageObj.currentPage = 1;
            if ($(this).index() == 0) {//全部分组
                pageObj.conditions = [{"filedName": "highSeas", "operateType": "=", "filedValue": 1}];
            } else {
                pageObj.conditions = [{
                    "filedName": "customerGroupId",
                    "operateType": "=",
                    "filedValue": val
                }, {"filedName": "highSeas", "operateType": "=", "filedValue": 1}];
            }
            var pageJson = JSON.stringify(pageObj);
            $('.r-titles .model-name').text('公海客户');
            if (val == '') {
                quoObj.filter();
            } else {
                leftFind(pageJson);
            }
        });
        $('#custFilter').on('click', ".label-list li", function () {//标签查询
            $('.group-list').find('li.active').removeClass('active');
            $(this).addClass('active').siblings('li').removeClass('active');
            $('#highSeas').removeClass('active');


            //按钮组
            $('#btn-groups').attr('disabled', false);
            $('#btn-tags').attr('disabled', false);
            $('#btn-assigns').attr('disabled', false);
            $('#btn-shares').attr('disabled', false);
            $('#btn-dels').attr('disabled', false);
            $('#output').attr('disabled', false);
            $('#nohighSeas-btn').attr('disabled', true);

            var val = $(this).attr("data-value");
            pageObj.currentPage = 1;
            pageObj.conditions = [{"filedName": "tagId", "operateType": "=", "filedValue": val}];

            var pageJson = JSON.stringify(pageObj);
            $('.r-titles .model-name').text('客户');
            leftFind(pageJson);
        });
        $('#nohighSeas-btn').on('click', function (e) {//添加公海客户到私海
            $.EventFn(e);
            var ids = getAllChecked();
            var data = {
                ids: ids
            };
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $("#highSeas").parent().click();
                    leftInfo()
                }
            })
        });
        //恢复客户
        $('#btn-recover').on('click', function (e) {//恢复已删除客户
            $.EventFn(e);
            var ids = getAllChecked();
            var data = {
                ids: ids,
                "setType": "retrieve",
            };
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/customer/set',
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
                    console.log("success");
                    location.reload();
                }
            })
        });
        //删除客户
        $("#btn-dels").on('click', function () {
            var on = 0;
            $('.page_info .table tbody td input[type=checkbox]:checked').each(function () {
                var seas = $(this).parents('tr').attr('data-highSeas');
                if (seas == 1) {
                    $.Alert($(this).parents('tr').find('.sortsName span').text() + '是公海客户,您不能删除');
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
            if (ids == "") {
                $.Alert("请选择要删除人员");
            } else {
                $.Confirm('确认删除？', '', function () {
                    $.ajax({
                        url: Base.sitUrl + '/api/customer/v1/customer/set',
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
                                $('.m_batch').removeClass('active');
                            });
                            $.Alert("删除成功！");
                            quoObj.filter();
                        }
                    });
                });
            }
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
                        return $(a).find('.starLevelOp .s-star2').length - $(b).find('.starLevelOp .s-star2').length;
                    });
                }
                else {
                    $this.find(".s-updownBg").addClass("s-orderList").removeClass("s-reorderList");
                    $this.removeClass("up");
                    trSort = trSort.sort(function(a, b){
                        return $(b).find('.starLevelOp .s-star2').length - $(a).find('.starLevelOp .s-star2').length;
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

        //点击客户查重
        $("#find_comm").on("click", function () {
            $("#search_info").css("display", "block")
            $("#table_info").empty();
            $("#focus_search").val("");
            $("#img_con").css("display", "none");
            $("#hide_img").css("display", "none");
            $(".table-responsive").css("display", "none");
            $("#search_info .page").empty();
            $('.r-titles .model-name').text('客户查重');
        })
        $("#click_other").on('click', function () {
            $("#search_info").css("display", "none");
            $('.r-titles .model-name').text('公海客户');
        });
        //客户查重输入框
        $("#focus_search").on("keyup", function () {
            $("#hide_img").show();
        });
        $("#hide_img").on("click", function () {
            $("#focus_search").val("");
            $(this).hide();
        });
        //客户查重匹配
        $("#click_search").on("click", function () {
            var popVal = $("#focus_search").val();
            if (popVal == "") {
                $.Alert("请输入内容");
            } else {
                repeatObj.keyword = popVal;
                quoObj.repeatFilter();
            }
        });
        //已删除列表
        $("#find_delete").on("click", function () {
            $("#search_info").css("display", "none");
            delObj.isDel = 1;
            quoObj.del();
            //按钮组
            $("#btn-recover").attr("disabled", false);
            $('#btn-groups').attr('disabled', true);
            $('#btn-tags').attr('disabled', true);
            $('#btn-assigns').attr('disabled', true);
            $('#btn-shares').attr('disabled', true);
            $('#btn-dels').attr('disabled', true);
            $('#output').attr('disabled', true);
            $('#nohighSeas-btn').attr('disabled', true);
            $('.r-titles .model-name').text('已删除客户');
        });


        //页面初始化
        quoObj.filter();//页面初始化
        leftInfo();
        followerList();
    });
});
