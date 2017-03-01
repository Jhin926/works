/* !
 *  用于发件箱设置
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN'], function (maintab) {
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
        var $filterModal = $('#filterModal');
        var screenOpt = {};
        $filterModal.on('click', '#reset', function (e) {
            $('#keyword').val('');
            $('#addresser').val('');
            $('#recipient').val('');
            var getCheck = $('#attachment input:radio').parent();
            for(var i =0;i<getCheck.length;i++){
                getCheck.eq(i).removeClass('checked');
            }
            $('#proDateBeg').val('');
            $('#proDateEnd').val('');
        });
        //  过滤筛选
        $filterModal.on('click', '#screen', function (e) {
            pageObj.currentPage = 1;
            var $name = $('#keyword'),
                $addresser = $('#addresser'),
                $recipient = $('#recipient'),
                $dateBeg = $('#proDateBeg'),
                $dateEnd = $('#proDateEnd'),
                inputOpt = {};
            if ($name.val() != '' && $.trim($name.val()) != '') {
                inputOpt.keyword = $name.val();
            }
            if ($addresser.val() != '' && $.trim($addresser.val()) != '') {
                inputOpt.sender = $addresser.val();
            }
            if ($recipient.val() != '' && $.trim($recipient.val()) != '') {
                inputOpt.receiver = $recipient.val();
            }
            if($dateBeg.val() != '' && $.trim($dateBeg.val()) != ''){
                inputOpt.startDate = $dateBeg.val();
            }
            if($dateEnd.val() != '' && $.trim($dateEnd.val()) != ''){
                inputOpt.endDate = $dateEnd.val();
            }

            inputOpt.hasAttachment = -1;
            var getCheck = $('#attachment input:radio').parent();
            for(var i =0;i<getCheck.length;i++){
                if(getCheck.eq(i).hasClass('checked')){
                    inputOpt.hasAttachment = i -1;
                }
            }
            inputOpt.filtrate = 1;

            screenOpt = inputOpt;

            emailObj.filter(screenOpt);
            $('#filterModal').modal('hide');
        });
        $('#addEmail').click(function () {//新建邮箱
            $('#mainIframe', parent.document).attr('src', './pop-email-new.html?&v=' + window.ver);
        });
        //字段空值
        function testNull(test) {
            if (test == null || test == undefined || test == '') {
                return "";
            } else {
                return test;
            }
        }

        //添加客户到私海
        $('.page_info').on('click', 'tbody>tr .btn-privateCust', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            var data = {
                id: id
            }
            var $oThis = $(this);
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $oThis.text('查看客户')
                    $oThis.addClass('company-name').removeClass('btn-privateCust')
                }
            })
        });
        //添加联系人到私海
        $('.page_info').on('click', 'tbody>tr .btn-privateCont', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            var data = {
                id: id
            }
            var $oThis = $(this)
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $oThis.text('查看联系人');
                    $oThis.addClass('btn-blockDetail').removeClass('btn-privateCont');
                }
            })
        });
        //点击卡片写跟进
        $('.page_info').on('click', 'tbody>tr .xiegenjin', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-cont');
            maintab.showTab(Base.url + '/html/pop-upload.html?id=' + id + "&v=" + window.ver, '写跟进');
        });
        //点击卡片添加通讯录
        $('.page_info').on('click', '.newtongxunlu', function (e) {
            $.EventFn(e);
            var email = $(this).parents('.sender-condition').find('.sender-condition-name').text();
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?name=' + email + "&v=" + window.ver, '新建通讯录');
        });
        //点击卡片通讯录
        $('.page_info').on('click', '.tongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/email-statistics.html' + "?&v=" + window.ver, '通讯录');
        });
        //点击卡片发邮件
        $('.page_info').on('click', 'tbody>tr .fayoujian', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            $('#mainIframe', parent.document).attr('src', Base.url + '/html/pop-email-newOut.html?type=0&id=' + id + "&v=" + window.ver);
        });

        //点击卡片往来邮件
        $('.page_info').on('click', 'tbody>tr .come-go', function (e) {
            $.EventFn(e);
            var email = $(this).parents('td').attr('data-email');
            maintab.showTab(Base.url + '/html/pop-come-go-emailOut.html?email=' + email + "&v=" + window.ver, '往来邮件');
        });
        $('.page_info').on('click', '.sender-condition', function (e) {
            $.EventFn(e);
        });
        //点击到邮件详情
        $('.page_info').on('click', 'tbody>tr', function (e) {
            $.EventFn(e);
            var id = $(this).find('input[name=batch]').attr('data-id');
            var title = $(this).find('.inboxContent').find('a').text();
            var type = $(this).attr('data-type');
            if ($.GetLength(title) > 10) {
                title = $.autoAddEllipsis(title, 8);
            }
            if (type == '000') {
                maintab.showTab(Base.url + '/html/pop-email-newOut.html?type=5&id=' + id + "&v=" + window.ver, title);
            } else {
                maintab.showTab(Base.url + '/html/pop-email-detailOut.html?id=' + id + "&uri=/api/email/outbox/v1/detail" + "&v=" + window.ver, title);
            }
        });
        //  添加为联系人
        $('.page_info').on('click', '.btn-blockAdd', function (e) {
            $.EventFn(e);
            var email = $(this).parents('.sender-condition').find('.sender-condition-name').text();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?name=' + email + "&v=" + window.ver, '添加联系人');
        });
        //  查看联系人
        $('.page_info').on('click', '.btn-blockDetail', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-cont');
            maintab.showTab(Base.url + '/html/pop-relation-detail.html?id=' + id + "&v=" + window.ver, '联系人详情');
        });
        //查看公司
        $('.page_info').on('click', '.company-name', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-customer-detail.html?id=' + id + "&v=" + window.ver, '客户详情');
        });
        //添加通讯录
        $('.page_info').on('click', '.btn-newStatistics', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?id=', '添加通讯录');
        });
        //添加私海联系人
        $('.page_info').on('click', '.btn-privateCont', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            var data = {
                id: id
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/contacts/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                    }
                }
            })
        });
        //添加私海客户
        $('.page_info').on('click', '.btn-privateCust', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            var data = {
                id: id
            }
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                }
            })
        });
        //关闭按钮变换
        $('#batchClose').on('mouseenter', function () {
            $(this).addClass('s-updownBg s-dels4').removeClass('fa fa-times')
        })
        $('#batchClose').on('mouseleave', function () {
            $(this).addClass('fa fa-times').removeClass('s-updownBg s-dels4')
        })
        //点击分组到
        $('.m_batch').on('click', '#btn-groups', function () {
            $('#groupsModal').addClass('active').siblings('.modals').removeClass('active');
        });
        //分配分组
        $('.m_batch').on('click', '#groupsModal>.mbody>.group-list>li', function (e) {
            $.EventFn(e);
            var ids = emailObj.getAllChecked().ids;
            var value = $(this).attr('data-id');
            emailObj.distributionGroup(ids, value)
            modalsClose();
            $(this).parent(".mhead").parent(".modals").removeClass('active');
            $('.m_batch').stop().animate({'left': '-100%'}, function () {
                $(this).removeClass('active');
            });
        });

        //标记为
        $('#btn-tags').on('click', function () {
            $('#tagsModal').addClass('active').css('left', $(this).position().left).siblings('.modals').removeClass('active');
        });

        //分配标签
        $('.m_batch').on('click', '#tagsModal>.mbody>.label-list>li', function (e) {
            $.EventFn(e);
            var emailId = emailObj.getAllChecked().ids;
            var tagId = $(this).attr('data-id');
            var tagName = $(this).attr('data-accountId');
            emailObj.distributionTag(emailId, tagId, tagName);
            modalsClose();
            $('.m_batch').stop().animate({'left': '-100%'}, function () {
                $(this).removeClass('active');
            });
        });
        //标签
        $('.table').on('mouseenter', '.mark-p', function (e) {
            $.EventFn(e);
            $(this).find('.close-icon').show();
            var closeIcon = $(this).children('.close-icon');
            if (closeIcon.css('display') == 'none') {
                closeIcon.show();
            }
        })
        $('.table').on('mouseleave', '.mark-p', function (e) {
            $.EventFn(e);
            $(this).find('.close-icon').hide();
            var closeIcon = $(this).children('.close-icon');
            if (closeIcon.css('display') == 'block') {
                closeIcon.hide();
            }
        })
        $('.table').on('click', '.close-icon', function (e) {
            $.EventFn(e);
            var getTag = $(this).parent();
            var id = $(this).closest('li').attr("data-id");
            var data = {
                id: id
            }
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/tag/delete',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {//删除标签
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    getTag.remove();
                    // emailObj.filter();
                    //emailObj.caogao();
                }
            })
        })
        //  打开删除
        $('.m_batch').on('click', '#btn-dels', function (e) {
            $.EventFn(e);
            $.Confirm('确认删除？', '', function () {
                var ids = emailObj.getAllChecked().ids;
                emailObj.deleteEmail(ids);
                $('.m_batch').stop().animate({'left': '-100%'}, function () {
                    $(this).removeClass('active');
                });
            });
        });
        //  关闭面板
        $(".m_batch").on('click', '.mclose', function (e) {
            $.EventFn(e);
            modalsClose();
            $(this).parent(".mhead").parent(".modals").removeClass('active');
            cnasleChecked();
            $('.m_batch').stop().animate({'left': '-100%'}, function () {
                $(this).removeClass('active');
            });
        });
        function modalsClose() {
            $('.modals').removeClass('active');
            $('#assigns').val('');
            $('#btn-assign').hide();
        }

        //取消删除
        $('#delsModal').on('click', '#btn-del-no', function (e) {
            $.EventFn(e);
            var ids = emailObj.getAllChecked().ids;
            cnasleChecked();
            $('.m_batch').stop().animate({'left': '-100%'}, function () {
                $(this).removeClass('active');
            });
        });
        //取消选中方法
        function cnasleChecked() {
            $('#tableSort').find("input[name='batch']").each(function () {
                $(this).attr("checked", false);
                $(this).parent('span').removeClass('checked');
            });
        }
        $(document).on('click', function (e) {
            $.EventFn(e);
            $(this).find('.new-built-task').hide();
        });
        $('.page_info').on('click', '.renwuShow>.new-built-task>.btn-group>.btn-cancel', function (e) {
            $.EventFn(e);
            var renwuShow = $(this).closest('.new-built-task');
            if (renwuShow.css('display') == 'block') {
                renwuShow.hide();
            }
        });
        //创建任务
        $('.page_info').on('click', '.renwuShow>.new-built-task>.btn-group>.btn-sure', function (e) {
            $.EventFn(e);
            var renwuShow = $(this).closest('.new-built-task');
            var desc = renwuShow.children('.new-built-task-c').find('textarea').val();
            var executionTime = renwuShow.children('.new-built-task-time').find('input').val();
            var task = renwuShow.parent('.renwuShow').children('i').attr('data-task');
            var id = renwuShow.parents('tr').find('td:first-child').find('input[type=checkbox]').attr('data-id');
            if (executionTime != null && executionTime != '' && desc != null && desc != '') {
                task = 1;
                emailObj.creatTask(null, null, desc, null, null, null, executionTime, id);
                if (renwuShow.css('display') == 'block') {
                    renwuShow.hide();
                }
                renwuShow.parent('.renwuShow').children('.pub-icon').removeClass('task-icon').addClass('tasked-icon');
            } else {
                confirm("请输入任务时间或内容！");
            }
        });

        //显示or隐藏条件
        $('.page_info').on('mouseenter', '.sender-condition-td', function (e) {
            $.EventFn(e);
            $(this).find('.sender-condition-style').show();
        });
        $('.page_info').on('mouseleave', '.sender-condition-td', function (e) {
            $.EventFn(e);
            $(this).children('.sender-condition-style').hide();
        });
        //全部分组
        $('#emailFilter').unbind('click').on('click', '.s-up2', function (e) {
            $.EventFn(e);
            $(this).addClass('s-down2').removeClass('s-up2');
        })
        $('#emailFilter').unbind('click').on('click', '.s-down2', function (e) {
            $.EventFn(e);
            $(this).addClass('s-up2').removeClass('s-down2');
            $(this).parents('li').find('ul').removeClass('active');
        })
        //  左侧客户分组/标签伸缩
        $('#emailFilter').on('click', '>li', function (e) {
            $.EventFn(e);
            $('#btn-groups,#btn-tags,#btn-assigns').show();//显示标记为，分组，转发按钮；
            $(this).addClass('activeFilter').siblings('li').removeClass('activeFilter');
            var inx = $(this).index();
            if (inx > 0 && inx < 3) {//草稿或者星标
                if ($(this).hasClass('active')) {
                    return;
                }
                $(this).addClass('active').siblings('li').removeClass('active');
            } else {
                $(this).siblings('li').removeClass('active');
            }

            if(inx == 0){
                emailObj.filter();
            }else if (inx == 1) {
                var $i = $(this).children('a').children('i.s-updownBg'),
                    $group = $('.group-list'),
                    $list = $('.group-list>li');
                if ($i.hasClass('s-up2')) {
                    $i.removeClass('s-up2').addClass('s-down2');
                    $group.addClass('active');
                    if ($list.length == 0) {
                        emailObj.inboxMenu($group);
                    }
                    $group.addClass('active');
                } else {
                    $i.removeClass('s-down2').addClass('s-up2');
                    $group.removeClass('active');
                }
            } else if (inx == 2) {
                pageObj.currentPage = 1;
                if ($('#btn-underling-pop').css('display') == 'none') {
                    emailObj.filter(null, null, null, 1);
                } else {
                    var id = $('#btn-underling-pop').attr('data-id');
                    $.reHtml(id, null, null, null, 1);
                }
            } else if (inx == 3) {//草稿
                pageObj.currentPage = 1;
                if ($('#btn-underling-pop').css('display') == 'none') {
                    emailObj.caogao();
                } else {
                    var id = $('#btn-underling-pop').attr('data-id')
                    $.reCaogao(id);
                }
                $('#btn-groups,#btn-tags,#btn-assigns').hide();
            } else if (inx == 4) {
                var getTarget = e.target;
                var $i = $(this).children('a').children('span').children('i.s-updownBg').eq(1),
                    $a = $(this).children('a')[0],
                    $ul = $(this).children('ul.label-list'),
                    $div = $(this).children('.emailcreatgroup');
                if ($i[0] == getTarget || $a == getTarget) {
                    if ($i.hasClass('s-up2')) {
                        $i.removeClass('s-up2').addClass('s-down2');
                        $ul.addClass('active');
                    } else {
                        $i.removeClass('s-down2').addClass('s-up2');
                        $ul.removeClass('active');
                    }
                }
            }
        });
        $('#emailFilter').on('click', '.s-add', function (e) {
            $.EventFn(e);
            var stabs = $(this);
            if (stabs.parents('li').find('ul').hasClass('active')) {
                stabs.parents('li').find('ul').addClass('active')
            } else {
                stabs.parents('li').find('ul').removeClass('active')
            }
            if (stabs.hasClass('s-add')) {
                $(this).find('.s-add').removeClass('s-add').addClass('s-close');
                $(this).parents('li').find('.emailcreatgroup').addClass('active');
                stabs.addClass('s-close').removeClass('s-add');
            } else {
                $(this).find('.s-close').removeClass('s-close').addClass('s-add');
                $(this).parents('li').find('.emailcreatgroup').removeClass('active');
                stabs.addClass('s-add').removeClass('s-close');
            }
        });
        $('#emailFilter').on('click', '.s-close', function (e) {
            $.EventFn(e);
            var stabs = $(this)
            if (stabs.parents('li').find('ul').hasClass('active')) {
                stabs.parents('li').find('ul').addClass('active')
            } else {
                stabs.parents('li').find('ul').removeClass('active')
            }
            if (stabs.hasClass('s-add')) {
                $(this).find('.s-add').removeClass('s-add').addClass('s-close');
                $(this).parents('li').find('.emailcreatgroup').addClass('active');
                stabs.addClass('s-close').removeClass('s-add');
            } else {
                $(this).find('.s-close').removeClass('s-close').addClass('s-add');
                $(this).parents('li').find('.emailcreatgroup').removeClass('active');
                stabs.addClass('s-add').removeClass('s-close');
            }
        });
        //  分组过滤
        $('#emailFilter').on('click', '.group-list>li', function (e) {
            $.EventFn(e);
            $(this).addClass('groupLi').siblings().removeClass('groupLi');
            var groupId = $(this).attr('data-id');
            pageObj.currentPage = 1;
            if ($('#btn-underling-pop').css('display') == 'none') {
                emailObj.filter(null, groupId);
            } else {
                var id = $('#myModal .modal-body>ul>li.active').attr('data-id');
                $.reHtml(id, null, groupId);
            }
        });
        //  标签过滤
        $('#emailFilter').on('click', '.label-list>li', function (e) {
            $.EventFn(e);
            $(this).addClass('labelLi').siblings('li').removeClass('labelLi');
            var tagId = $(this).attr('data-id');
            pageObj.currentPage = 1;
            if ($('#btn-underling-pop').css('display') == 'none') {
                emailObj.filter(null, null, null, null, null, null, null, tagId);
            } else {
                var id = $('#myModal .modal-body>ul>li.active').attr('data-id')
                $.reHtml(id, null, null, null, null, null, null, tagId)
            }
        });

        //  星标选定
        $('.page_info').on('click', '.star', function (e) {
            $.EventFn(e);
            if ($(this).hasClass('star-icon')) {
                $(this).removeClass('star-icon').addClass('stared-icon');
                listVal = $(this).attr('data-value');
                if (listVal == 0) {
                    listVal = 1
                }
                listId = $(this).attr('data-id');
                emailObj.starChange(listId, 1);
            } else {
                $(this).removeClass('stared-icon').addClass('star-icon');
                listVal = $(this).attr('data-value');
                if (listVal == 1) {
                    listVal = 0
                }
                listId = $(this).attr('data-id');
                emailObj.starChange($(this).attr('data-id'), 0);
            }
        });
        //改变读取状态
        $('.page_info').on('click', 'tbody>tr', function (e) {
            $.EventFn(e);
            var ids = $(this).find('input[name=batch]').attr('data-id');
            var value = $(this).attr('isRead');
            if (value == 0) {
                emailObj.isRead(ids, 1);
                $(this).attr('isRead', '1');
                $(this).css('font-weight', '400');
            }
        });

        //排序
        $('.page_info').on('click', '>table>thead>tr>th', function (e) {
            $.EventFn(e);
            var list = [];
            if ($(this).attr('id') == 'sender') {
                list = emailObj.sortName.sort(function (a, b) {
                    return a.emailAddress.charCodeAt() - b.emailAddress.charCodeAt();
                });
                emailObj.shujuzhanshi(list, emailObj.total);
            } else if ($(this).attr('id') == 'sortTime') {
                if ($(this).attr('data-type') == '0') {
                    list = emailObj.sortName.sort(function (a, b) {
                        return new Date(a.sendTime).getTime() - new Date(b.sendTime).getTime();
                    });
                    $(this).attr('data-type', '1');
                    emailObj.shujuzhanshi(list, emailObj.total);
                } else {
                    list = emailObj.sortName.sort(function (a, b) {
                        return new Date(b.sendTime).getTime() - new Date(a.sendTime).getTime();
                    });
                    $(this).attr('data-type', '0');
                    emailObj.shujuzhanshi(list, emailObj.total);
                }
            } else {
                return;
            }

        });

        //  通过客户名、邮箱称快速搜索
        $('.page-content').on('keyup', '#inputQuick', function (e) {
            $.EventFn(e);
            if ($('#btn-underling-pop').css('display') == 'none') {
                var obj = {
                    filtrate: 1,
                    keyword: $("#inputQuick").val() || ''
                };
            } else {
                var id = $('#btn-underling-pop').attr('data-id')
                var obj = {
                    filtrate: 1,
                    keyword: $("#inputQuick").val() || '',
                    id: id
                };
            }
            if (event.keyCode == 13) {
                if (obj.addressType != -1 || obj.emailTime != '' || obj.keyword != '' || obj.attachmentName != '') {
                    emailObj.filter(obj);
                } else {
                    emailObj.filter();
                }
            }
        });

        var pageObj = {
            homepage: 1,
            lastpage: null,
            currentPage: 1,
            pageSize: 20
        };

        var emailObj = {
            lastpage: null,
            currentPage: 1,             //  当前页
            sortName: [],
            total: 0,
            page: {pageSize: pageObj.pageSize, currentPage: pageObj.currentPage},
            //  获取收件箱列表
            filter: function (obj, group, unread, star, deleted, spam, draft, tag, subject, content) {
                var data = {
                    group: group || 0,
                    unread: unread || 0,
                    star: star || 0,
                    deleted: deleted || 0,
                    spam: spam || 0,
                    draft: draft || 0,
                    tag: tag || '',
                    subject: subject || '',
                    content: content || '',
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                };
                if (obj) {
                    $.extend(data,obj);
                }
                //收件箱
                $.ajax({
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    url: Base.sitUrl + '/api/email/outbox/v1/search',
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
                        var list = res.data.results;
                        var html = '';
                        emailObj.sortName = list;
                        emailObj.total = res.data.totalItem;
                        emailObj.shujuzhanshi(list, emailObj.total);
                    }
                });
            },
            caogao: function (obj, group, unread, star, deleted, spam, draft, tag, subject, content) {
                var data = {
                    group: group || 0,
                    unread: unread || 0,
                    star: star || 0,
                    deleted: deleted || 0,
                    spam: spam || 0,
                    draft: draft || 0,
                    tag: tag || '',
                    subject: subject || '',
                    content: content || '',
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                };
                if (obj) {
                    data.filtrate = obj.filtrate;
                    data.addressType = obj.addressType;
                    data.adress = obj.adress;
                    data.keyword = obj.keyword;
                    data.attachmentName = obj.attachmentName;
                    data.emailTimeComparator = obj.emailTimeComparator;
                    data.emailTime = obj.emailTime;
                }
                //草稿
                $.ajax({
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    url: Base.sitUrl + '/api/email/draft/v1/search',
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
                        var list = res.data.results;
                        var html = '';
                        if (list.length == 0) {
                            html = '<tr>' +
                                '<td colspan="6" style="text-align: center;">还没有收到邮件</td>' +
                                '</tr>';
                            $('.page_info>table>tbody').empty();
                            $('.page_info>table>tbody').append(html);
                            return;
                        }
                        emailObj.sortName = list;
                        emailObj.total = res.data.totalItem;
                        var type = '000';
                        emailObj.shujuzhanshi(list, emailObj.total, type);
                    }
                });
            },
            shujuzhanshi: function (list, total, type) {
                var html = '', html2 = '';

                if (list.length <= 0) {
                    html = '<tr>' +
                        '<td colspan="6" style="text-align: center;">还没有收到邮件</td>' +
                        '</tr>';
                } else {
                    for (var i = 0; i < list.length; i++) {
                        var fjicon = list[i].hasAttachment;
                        var ed = $.dateObj(new Date(list[i].sendTime).getTime())._getDatetime();
                        var xb = list[i].isStar;
                        var noread = list[i].isRead;
                        var ficon = '';
                        if (list[i].visitingCard != null && list[i].visitingCard != '') {
                            var tx = list[i].visitingCard.status;
                            var gh = list[i].visitingCard.isHighSeas;
                            var comp = list[i].visitingCard.customerName;
                            if (fjicon == 1) {
                                ficon = '<i class="pub-icon list-fujian-icon"></i>';
                            }
                            userimg = '';
                            var gonghai = '';
                            if (gh == 1) {
                                gonghai = '<span>公海</span>';
                            }
                            if (list[i].visitingCard.customerStatusName !== null) {
                                var status = list[i].visitingCard.customerStatusName.substring(0, 1);
                            } else {
                                var status = '';
                            }
                            switch (tx) {
                                case 1:
                                    userimg = '<i class="pub-icon sender4-icon"></i>';
                                    html2 = '<ul><li data-id="' + list[i].id + '">' +                //陌生发件人
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default newtongxunlu">添加通讯录</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                                case 2:
                                    userimg = '<i class="pub-icon sender4-icon"></i>';
                                    html2 = '<ul><li data-id="' + list[i].id + '">' +                //通讯录好友
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default tongxunlu">通讯录好友</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                                case 3:
                                    userimg = '<i class="pub-icon sender1-icon"></i>';//我的联系人
                                    html2 = '<ul><li data-id="' + list[i].id + '" data-customer="' + list[i].visitingCard.customerId + '" data-cont="' + list[i].visitingCard.customerContactsId + '">' +
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<div class="company-info"><span class="s-status" style="background-color: ' + list[i].visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                        '<div class="belong-yewuy"><label>所属业务员：</label><span>' + list[i].visitingCard.salesmanName + '</span></div>' +
                                        '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockDetail">查看联系人</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin">写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                                case 4:
                                    userimg = '<i class="pub-icon sender1-icon"></i>';//我的客户
                                    html2 = '<ul><li data-id="' + list[i].id + '" data-customer="' + list[i].visitingCard.customerId + '">' +
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<div class="company-info"><span class="s-status" style="background-color: ' + list[i].visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                        '<div class="belong-yewuy"><label>所属业务员：</label><span>' + list[i].visitingCard.salesmanName + '</span></div>' +
                                        '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                                case 5:
                                    userimg = '<i class="pub-icon sender3-icon"></i>';//公海联系人
                                    html2 = '<ul><li data-id="' + list[i].id + '" data-customer="' + list[i].visitingCard.customerId + '">' +
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<div class="company-info"><span class="s-status" style="background-color: ' + list[i].visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                        '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                        '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCont">添加到私海</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                                case 6:
                                    userimg = '<i class="pub-icon sender3-icon"></i>';//公海客户
                                    html2 = '<ul><li data-id="' + list[i].id + '" data-customer="' + list[i].visitingCard.customerId + '">' +
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<div class="company-info"><span class="s-status" style="background-color: ' + list[i].visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                        '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                        '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCust">添加到私海</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                                case 7:
                                    userimg = '<i class="pub-icon sender2-icon"></i>';//同事联系人
                                    html2 = '<ul><li data-id="' + list[i].id + '" data-customer="' + list[i].visitingCard.customerId + '">' +
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<div class="company-info"><span class="s-status" style="background-color: ' + list[i].visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                        '<div class="belong-yewuy"><label>所属业务员：</label><span>' + list[i].visitingCard.salesmanName + '</span></div>' +
                                        '<button type="button" class="btn btn-default btn-lg btn-block btn-blockDetail btn-gray" disabled>查看联系人</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                                case 8:
                                    userimg = '<i class="pub-icon sender2-icon"></i>';//同事客户
                                    html2 = '<ul><li data-id="' + list[i].id + '" data-customer="' + list[i].visitingCard.customerId + '">' +
                                        '<div class="sender-condition">' +
                                        '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + list[i].visitingCard.title + '</span></div>' +
                                        '<div class="company-info"><span class="s-status" style="background-color: ' + list[i].visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                        '<div class="belong-yewuy"><label>所属业务员：</label><span>' + list[i].visitingCard.salesmanName + '</span></div>' +
                                        '<button type="button" class="btn btn-default btn-lg btn-block btn-gray btn-blockAdd" disabled>添加联系人</button>' +
                                        '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                        '</div>' +
                                        '</li></ul>';
                                    break;
                            }
                            var condition = '<div class="sender-condition-style">' + html2 + '</div>';
                            var markstag = '';
                            var inboxContent = '<a class="email-content-info ellipsis"href="pop-email-detail.html" data-maintab><span class="pull-left">' + ficon + list[i].subject + '<span style="margin:0 5px;">-</span></span><span class="list-content ellipsis">' + list[i].content + '</span></a><ul class="marks-group">' + markstag + '</ul>';
                            var startab = '';
                            if (xb == 1) {
                                startab = '<i class="pub-icon star stared-icon" data-id="' + list[i].id + '" data-value="1"></i>';
                            } else {
                                startab = '<i class="pub-icon star star-icon" data-id="' + list[i].id + '" data-value="0"></i>';
                            }
                            if (list[i].tags != null && list[i].tags != '') {
                                if (list[i].tags.length > 2) {
                                    for (var l = 0; l < 2; l++) {
                                        markstag += '<li class="mark-p" style="margin-top:5px;margin-right:5px;color:#ff7200;border:1px solid #ff7200;border-radius:8px;" data-id="' + list[i].tags[l].id + '"><span class="mark ellipsis">' + list[i].tags[l].name + '</span><i class="pub-icon close-icon"></i></li>';
                                    }
                                    $('#inboxContent>.marks-group').append(markstag);
                                } else {
                                    for (var l = 0; l < list[i].tags.length; l++) {
                                        markstag += '<li class="mark-p" style="margin-top:5px;margin-right:5px;color:#ff7200;border:1px solid #ff7200;border-radius:8px;" data-id="' + list[i].tags[l].id + '"><span class="mark ellipsis">' + list[i].tags[l].name + '</span><i class="pub-icon close-icon"></i></li>';
                                    }
                                    $('#inboxContent>.marks-group').append(markstag);
                                }
                            }
                            var _content = list[i].content;
                            if (_content) {
                                _content = list[i].content.replace(/</, "&lt;");
                            }
                            if (_content.length > 28 && list[i].subject.length > 28) {
                                list[i].subject = list[i].subject.substring(0, 14) + '...';
                                _content = _content.substring(0, 14) + '...';
                            } else if (_content.length > 28) {
                                _content = _content.substring(0, 27) + '...'
                            } else if (list[i].subject.length > 28) {
                                list[i].subject = list[i].subject.substring(0, 27) + '...'
                            }
                            var inboxContent = '<a class="email-content-info ellipsis"href="pop-email-detail.html"data-maintab><span style="max-width:665px;" class="pull-left">' + ficon + list[i].subject + '<span style="margin:0 5px;">-</span></span><span class="list-content ellipsis">' + _content + '</span></a><ul class="marks-group" style="display: inline-block;overflow: hidden;height: 25px;margin:0;float:right">' + markstag + '</ul>';
                            if (noread == 1) {
                                html += '<tr isRead="1" data-type=' + type + '>\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis">' + testNull(list[i].visitingCard.title) + '</span></div>' + condition + '</td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time">' + ed + '</div></td>\
                                        <td>' + startab + '</td>\
                                    </tr>';
                            } else {
                                html += '<tr isRead="0" style="font-weight:700;"  data-type=' + type + 'data-type=' + type + ' class="isRead">\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis">' + testNull(list[i].visitingCard.title) + '</span></div>' + condition + '</td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time">' + ed + '</div></td>\
                                        <td>' + startab + '</td>\
                                    </tr>';
                            }
                        } else {
                            if (noread == 1) {
                                html += '<tr isRead="1" data-type=' + type + '>\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis"></span></div>' + condition + '</td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time">' + ed + '</div></td>\
                                        <td>' + startab + '</td>\
                                    </tr>';
                            } else {
                                html += '<tr isRead="0" style="font-weight:700;" data-type=' + type + ' class="isRead">\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis"></span></div>' + condition + '</td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time">' + ed + '</div></td>\
                                        <td>' + startab + '</td>\
                                    </tr>';
                            }
                        }
                    }
                }

                $('.page_info>table>tbody').empty().append(html);

                var total = total;
                var all = Math.ceil(total / pageObj.pageSize);
                $.Page({
                    total: total,
                    _class: '.page',
                    nowNum: pageObj.currentPage,
                    allNum: all,
                    callback: function (now, all) {
                        pageObj.currentPage = now;
                        var typeFilter = $(".activeFilter").attr('data-index');
                        if (typeFilter == '1') {
                            emailObj.filter(null, null, null, 1);
                        } else if (typeFilter == '2') {
                            emailObj.caogao();
                        } else if (typeFilter == '0') {
                            var idGroup = $(".activeFilter").find('.groupLi').attr('data-id');
                            emailObj.filter(null, idGroup);
                        } else if (typeFilter == '3') {
                            var idGroup = $(".activeFilter").find('.labelLi').attr('data-id');
                            emailObj.filter(null, idGroup);
                        } else {
                            if(!$('#sx-condition').is(':hidden')){
                                if ($('#btn-underling-pop').css('display') == 'none') {
                                    var obj = {
                                        filtrate: 1
                                    };
                                } else {
                                    var id = $('#btn-underling-pop').attr('data-id');
                                    var obj = {
                                        filtrate: 1,
                                        id: id
                                    };
                                }
                                if (obj.addressType != -1 || obj.emailTime != '' || obj.keyword != '' || obj.attachmentName != '') {
                                    emailObj.filter(obj);
                                } else {
                                    emailObj.filter();
                                }
                            }else{
                                emailObj.filter();
                            }
                        }
                    }
                })
            },
            //收件箱菜单
            inboxMenu: function () {
                var data = {};
                $.ajax({
                    url: Base.sitUrl + '/api/email/outbox/v1/menus',
                    type: 'GET',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var listg = data.emailGroup;
                        var listt = data.tags;
                        var html1 = '<li data-id="" data-accountId="">全部分组</li>';
                        var html2 = '';
                        var star = '(' + data.starEmailCount + ')';
                        var caogao = '(' + data.draftEmailCount + ')';
                        for (var i = 0; i < listg.length; i++) {
                            html1 += '<li data-id="' + listg[i].id + '" data-accountId="' + listg[i].name + '">' + listg[i].name + '</li>';
                        }
                        for (var i = 0; i < listt.length; i++) {
                            var name = listt[i].name;
                            name = $.autoAddEllipsis(name, 8);
                            html2 += '<li data-id="' + listt[i].id + '" data-accountId="' + listt[i].name + '">' + name + '</li>';
                        }
                        $('#emailFilter>li>a>span.starNum').empty().append(star);
                        $('#emailFilter>li>a>span.caogaoNum').empty().append(caogao);
                        $('#emailFilter>li>.group-list').empty().append(html1);
                        $('#groupsModal>.mbody>.group-list').empty().append(html1);
                        $('#emailFilter>li>.label-list').empty().append(html2);
                        $('#tagsModal>.mbody>.label-list').empty().append(html2);
                        if (listg.length < 1) {
                            $('#emailFilter>li>.group-list').remove();
                        }
                        if (listt.length < 1) {
                            $('#emailFilter>li>.label-list').remove();
                        }
                    }
                });
            },
            //星标
            starChange: function (ids, value) {
                var data = {
                    ids: [ids],
                    value: value
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/outbox/v1/star',
                    type: 'POST',
                    data: postData,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        emailObj.inboxMenu();
                    }
                });
            },
            //删除邮件
            deleteEmail: function (ids) {
                var uri = '/api/email/outbox/v1/delete';
                var data = {
                    'ids': ids
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + uri,
                    type: 'POST',
                    data: postData,
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
                        var typeFilter = $(".activeFilter").attr('data-index');
                        if (typeFilter == '1') {
                            emailObj.filter(null, null, null, 1);
                        } else if (typeFilter == '2') {
                            emailObj.caogao();
                        } else if (typeFilter == '0') {
                            emailObj.filter(null, id);
                        } else if (typeFilter == '3') {
                            emailObj.filter(null, id);
                        } else {
                            emailObj.filter();
                        }
                    }
                });
            },
            //分配分组
            distributionGroup: function (emailId, groupId) {
                var data = {
                    ids: emailId,
                    value: groupId
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/outbox/v1/group',
                    type: 'POST',
                    data: postData,
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
                        $.reHtml();
                    }
                });
            },
            //分配标签
            distributionTag: function (emailId, tagId, tagName) {
                var data = {
                    ids: emailId,
                    value: tagId,
                    name: tagName
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/v1/tag/add',
                    type: 'POST',
                    data: postData,
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
                        $.reHtml();
                    }
                });
            },
            //改变已读时的展示状态
            isRead: function (emailId, value) {
                var data = {
                    ids: [emailId],
                    value: value
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/outbox/v1/read',
                    type: 'POST',
                    data: postData,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                    }
                });
            },
            //创建任务
            creatTask: function (name, customerId, desc, createUse, remindTime, executionTimeType, executionTime) {
                var data = {
                    name: name,    //任务名称
                    customerId: customerId,    //客户名称
                    desc: desc,//任务内容
                    createUse: createUse,   //任务负责人
                    remindTime: remindTime,   //提醒
                    executionTimeType: executionTimeType,//时间类型
                    executionTime: executionTime,   //任务时间
                    emailId: id,//emailID
                    emailBoxType: 2//发件箱
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/task/v1/task/save',
                    type: 'POST',
                    data: postData,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                    }
                });
            },
            getAllChecked: function () {  //  获取选中客户id和可执行批量判断
                var data = {ids: [], dist: '', del: '', arry: []};
                var list = emailObj.currentData;
                $('input[name=batch]:checked').each(function () {
                    var _id = $(this).attr('data-id');
                    data.ids.push(parseInt(_id));
                    data.dist += $(this).attr('data-dist') + ';';
                    data.del += $(this).attr('data-del') + ';';
                });
                return data;
            }
        };
        emailObj.filter();
        emailObj.inboxMenu();
        //发件箱菜单
        $.reInboxMenu = function (id) {
            if (id) {
                var http = 'POST'
            } else {
                var http = 'GET'
            }
            var data = {
                id: id
            }
            $.ajax({
                url: Base.sitUrl + '/api/email/outbox/v1/menus',
                type: http,
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data;
                    var listg = data.emailGroup;
                    var listt = data.tags;
                    var html1 = '<li data-id="" data-accountId="">全部分组</li>';
                    var html2 = '';
                    var star = '(' + data.starEmailCount + ')';
                    var caogao = '(' + data.draftEmailCount + ')';
                    for (var i = 0; i < listg.length; i++) {
                        html1 += '<li data-id="' + listg[i].id + '" data-accountId="' + listg[i].name + '">' + listg[i].name + '</li>';
                    }
                    for (var i = 0; i < listt.length; i++) {
                        var name = listt[i].name;
                        name = $.autoAddEllipsis(name, 8);
                        html2 += '<li data-id="' + listt[i].id + '" data-accountId="' + listt[i].name + '">' + name + '</li>';
                    }
                    $('#emailFilter>li>a>span.starNum').empty().append(star);
                    $('#emailFilter>li>a>span.caogaoNum').empty().append(caogao);
                    $('#emailFilter>li>.group-list').empty().append(html1);
                    $('#groupsModal>.mbody>.group-list').empty().append(html1);
                    $('#emailFilter>li>.label-list').empty().append(html2);
                    $('#tagsModal>.mbody>.label-list').empty().append(html2);
                    if (listg.length < 1) {
                        $('#emailFilter>li>.group-list').remove();
                    }
                    if (listt.length < 1) {
                        $('#emailFilter>li>.label-list').remove();
                    }
                }
            });
        }
        //下属邮件
        $('#btn-underling').on('click', function () {
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/underling/customer',
                type: 'GET',
                success: function (res) {
                    var data = res.data;
                    var html = ''
                    for (var i = 0; i < data.length; i++) {
                        html += '<li data-id="' + data[i].id + '">' + data[i].name + '</li>'
                    }
                    $('#myModal .modal-body>ul').empty().append(html)
                }
            })
        })
        $('#myModal .modal-body>ul').on('click', '>li', function () {//选择下属
            $(this).addClass('active').siblings('li').removeClass('active');
            var id = $('#myModal .modal-body>ul>li.active').attr('data-id');
            var name = $('#myModal .modal-body>ul>li.active').text();
            $('#btn-underling').attr({'data-toggle': '', 'data-target': '', 'id': 'btn-underling-active'});
            $('#btn-underling-pop').text(name).attr('data-id', id).show();
            $('#underling-close').click()
            $.reInboxMenu(id)
            $.reHtml(id)
        });
        $('body').on('click', '#btn-underling-active', function () {//返回自己的邮箱
            window.location.reload();
        });


        $.reHtml = function (id, obj, group, unread, star, deleted, spam, draft, tag, subject, content) {
            if (id) {
                var data = {
                    group: group || 0,
                    unread: unread || 0,
                    star: star || 0,
                    deleted: deleted || 0,
                    spam: spam || 0,
                    draft: draft || 0,
                    tag: tag || '',
                    subject: subject || '',
                    content: content || '',
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize,
                    id: id
                };
            } else {
                var data = {
                    group: group || 0,
                    unread: unread || 0,
                    star: star || 0,
                    deleted: deleted || 0,
                    spam: spam || 0,
                    draft: draft || 0,
                    tag: tag || '',
                    subject: subject || '',
                    content: content || '',
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                };
            }
            //收件箱
            $.ajax({
                data: {
                    data: JSON.stringify(data)
                },
                type: 'POST',
                url: Base.sitUrl + '/api/email/outbox/v1/search',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var list = res.data.results;
                    var html = '';
                    if (list.length == 0) {
                        html = '<tr>' +
                            '<td colspan="6" style="text-align: center;">还没有收到邮件</td>' +
                            '</tr>';
                        $('.page_info>table>tbody').empty();
                        $('.page_info>table>tbody').append(html);
                        return;
                    }
                    emailObj.sortName = list;
                    emailObj.total = res.data.totalItem;
                    emailObj.shujuzhanshi(list, emailObj.total);
                }
            });
        }
        $.reCaogao = function (id, obj, group, unread, star, deleted, spam, draft, tag, subject, content) {
            var data = {
                group: group || 0,
                unread: unread || 0,
                star: star || 0,
                deleted: deleted || 0,
                spam: spam || 0,
                draft: draft || 0,
                tag: tag || '',
                subject: subject || '',
                content: content || '',
                currentPage: pageObj.currentPage,
                pageSize: pageObj.pageSize,
                id: id
            };
            if (obj) {
                data.filtrate = obj.filtrate;
                data.addressType = obj.addressType;
                data.adress = obj.adress;
                data.keyword = obj.keyword;
                data.attachmentName = obj.attachmentName;
                data.emailTimeComparator = obj.emailTimeComparator;
                data.emailTime = obj.emailTime;
            }
            //草稿
            $.ajax({
                data: {
                    data: JSON.stringify(data)
                },
                type: 'POST',
                url: Base.sitUrl + '/api/email/draft/v1/search',
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
                    var list = res.data.results;
                    var html = '';
                    if (list.length == 0) {
                        html = '<tr>' +
                            '<td colspan="6" style="text-align: center;">还没有收到邮件</td>' +
                            '</tr>';
                        $('.page_info>table>tbody').empty();
                        $('.page_info>table>tbody').append(html);
                        return;
                    }
                    emailObj.sortName = list;
                    emailObj.total = res.data.totalItem;
                    var type = '000';
                    emailObj.shujuzhanshi(list, emailObj.total, type);
                }
            });
        }
    });
});