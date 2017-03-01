/* !
 *  用于邮件详情
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN', 'jqprint', 'ztree'], function (maintab) {
        maintab.init();
        var emailId = $.GetQueryString('id');
        var uri = $.GetQueryString('uri');
        $('.email-detail-main-content').attr('src', Base.sitUrl + '/html/read.html?type=1&id=' + emailId + "&v=" + window.ver);
        //添加客户到私海
        $('.email-detail').on('click', 'tbody>tr .btn-privateCust', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            var data = {
                id: id
            }
            var $oThis = $(this)
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/into/private/seas',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    $oThis.text('已添加到私海')
                }
            })
        });
        //添加联系人到私海
        $('.email-detail').on('click', 'tbody>tr .btn-privateCont', function (e) {
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
                    $oThis.text('已添加到私海')
                }
            })
        });
        //点击卡片添加通讯录
        $('.email-detail').on('click', '.newtongxunlu', function (e) {
            $.EventFn(e);
            var name = $(this).closest('.sender-condition').find('.sender-condition-name').text();
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?name=' + name + "&v=" + window.ver, '新建通讯录');
        });
        //点击卡片通讯录
        $('.email-detail').on('click', '.tongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/email-statistics', '通讯录');
        });
        //  添加为联系人
        $('.email-detail').on('click', '.btn-blockAdd', function (e) {
            $.EventFn(e);
            var name = $(".detailSender").val();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?name=' + name + "&v=" + window.ver, '添加联系人');
        });
        //  查看联系人
        $('.email-detail').on('click', '.btn-blockDetail', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-cont');
            maintab.showTab(Base.url + '/html/pop-relation-detail.html?id=' + id + "&v=" + window.ver, '联系人详情');
        });

        //切换时区
        $('.email-detail').on('click', '.sender-time-icon', function (e) {
            $.EventFn(e);
            $('.check-time').css('display', 'inline-block');
        });
        $('.check-time').change(function () {
            var getOffset = $(this).val();
            var getTime = $(this).prev();
            var getOldOffset = Number(getTime.attr('data-time'));
            getTime.text($.calcTime(getTime.text(), getOldOffset, getOffset)).attr('data-time', getOffset);
        });

        //查看公司
        $('.email-detail').on('click', '.company-name', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-customer-detail.html?id=' + id + "&v=" + window.ver, '客户详情');
        });
        //点击卡片写跟进
        $('.email-detail').on('click', '.xiegenjin', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-upload.html?type=1&id=' + id + "&v=" + window.ver, '写跟进');
        });
        //点击卡片往来邮件
        $('.email-detail').on('click', '.come-go', function (e) {
            $.EventFn(e);
            var email = $('.detailSender').val();
            var h = email.search(/\;/)
            email = email.substring(0, h);
            maintab.showTab(Base.url + '/html/pop-come-go-email.html?email=' + email + "&v=" + window.ver, '往来邮件');
        });

        //点击回复按钮带值跳转发件箱
        $('#reEmail').on('click', function (e) {
            $.EventFn(e);
            var id = emailId;
            maintab.showTab(Base.url + '/html/pop-email-new.html?type=1&showType=right&id=' + id + "&v=" + window.ver, '邮件回复');
        });

        //点击全部回复按钮带值跳转发件箱
        $('#allReEmail').on('click', function (e) {
            $.EventFn(e);
            var id = emailId;
            maintab.showTab(Base.url + '/html/pop-email-new.html?type=1&showType=right&id=' + id + "&v=" + window.ver, '全部回复');
        });

        //点击转发按钮带值跳转发件箱
        $('#zfEmail').on('click', function (e) {
            $.EventFn(e);
            var id = emailId;
            maintab.showTab(Base.url + '/html/pop-email-new.html?type=2&showType=right&id=' + id + "&v=" + window.ver, '邮件转发');
        });

        //点击卡片发邮件
        $('.sender-info').on('click', '.sender-condition>.condition-cz-btn>.fayoujian', function (e) {
            $.EventFn(e);
            var id = emailId;
            maintab.showTab(Base.url + '/html/pop-email-new.html?type=0&showType=right&id=' + id + "&v=" + window.ver, '发邮件');
        });

        //显示or关闭标签按钮
        $('.email-detail').on('mouseenter', '.mark-p', function (e) {
            $.EventFn(e);
            var closeIcon = $(this).children('.close-icon');
            if (closeIcon.css('display') == 'none') {
                closeIcon.show();
            }
        });
        $('.email-detail').on('mouseleave', '.mark-p', function (e) {
            $.EventFn(e);
            var closeIcon = $(this).children('.close-icon');
            if (closeIcon.css('display') == 'block') {
                closeIcon.hide();
            }
        });
        $('.email-detail').on('click', '.close-icon', function (e) {
            $.EventFn(e);
            var ths = $(this);
            var id = $(this).parent('.mark-p').attr('data-id');
            if (ths.css('display') == 'block') {
                ths.hide();
                ths.parent('.mark-p').remove();
                detailObj.deleteTag(id);
                parent.$.reHtml();
            }
        });
        //附件另存为
        $('.email-detail').on('click', '#down', function (e) {
            $.EventFn(e);
            var filename = $(this).attr('data-name');
            var value = $(this).attr('data-url');
            detailObj.downloadFujian(filename, value);
        });

        //操作下拉显示操作菜单
        $('.email-detail').on('click', '.caozuo-down-icon', function (e) {
            $.EventFn(e);
            if ($('.caozuo-down-show').css("display") == 'none') {
                $('.caozuo-down-show').show();
                $(this).css('transform', 'rotate(180deg)');
            } else {
                $('.caozuo-down-show').hide();
                $(this).css('transform', 'rotate(0deg)');
            }
        });
        $('.email-detail').on('click', '.caozuo-down-show>li', function (e) {
            $.EventFn(e);
            var inn = $(this).index();
            if (inn == 0) {
                var id = emailId;
                maintab.showTab(Base.url + '/html/pop-email-new.html?type=3&showType=right&id=' + id + "&v=" + window.ver, '编辑邮件');
            } else if (inn == 1) {
                var id = emailId;
                var data = {
                    id: emailId,
                    folder: $('.subject').attr('data-folder'),
                    content: '1'
                }
                data = JSON.stringify(data)
                maintab.showTab(Base.url + '/html/pop-email-new.html?type=10&showType=right&id=' + id + '&data=' + data + "&v=" + window.ver, '作为附件转发');
            } else if (inn == 2) {
                var data = {
                    id: emailId,
                    folder: $('.subject').attr('data-folder'),
                    content: '1'
                }
                $.ajax({
                    url: Base.sitUrl + '/api/email/v1/to/attachment',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        data: JSON.stringify(data)
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
                            return
                        }
                        var data = res.data;
                        var filename = data.name;
                        var url = data.url;
                        var data = {
                            name: filename,
                            value: 'http://' + url
                        };
                        var postData = 'data=' + JSON.stringify(data);
                        window.location.href = Base.sitUrl + '/api/file/download?' + postData;
                    }
                })
            } else if (inn == 3) {
                var emailName = $('.email-detail-theme .subject').text();
                maintab.showTab(Base.url + '/html/pop-task.html?type=email&emailName=' + emailName + "&v=" + window.ver, '新建任务');
            } else if (inn == 4) {
                $(this).children('.modals').addClass('active');
                $(this).siblings('li').children('.modals').removeClass('active');
                detailObj.inboxMenu();
            } else if (inn == 5) {
                $(this).children('.modals').addClass('active');
                $(this).siblings('li').children('.modals').removeClass('active');
                detailObj.inboxMenu();
            } else if (inn == 6) {
                detailObj.deleteEmail(emailId);
                $('.caozuo-down-show').hide();
            } else if (inn == 7) {
                var on = $("#spam").attr("data-on");
                on = parseInt(on);
                detailObj.rubishEmail(emailId, on);
                $('.caozuo-down-show').hide();
            } else if (inn == 8) {
                $(".caozuo-down-show").hide();
                window.print();
            }
        });
        //创建任务
        $('.email-detail').on('click', '.caozuo-down-show>li>.new-built-task>.btn-group>.btn-sure', function (e) {
            $.EventFn(e);
            var renwuShow = $(this).closest('.new-built-task');
            var desc = renwuShow.children('.new-built-task-c').find('textarea').val();
            var executionTime = renwuShow.children('.new-built-task-time').find('input').val();
            if (executionTime != null && executionTime != '' && desc != null && desc != '') {
                task = 1;
                detailObj.creatTask(null, null, desc, null, null, null, executionTime);
                if (renwuShow.css('display') == 'block') {
                    renwuShow.hide();
                }
                renwuShow.parent('.renwuShow').children('.pub-icon').removeClass('task-icon').addClass('tasked-icon');
                $('.caozuo-down-show').children('li').children('.modals').removeClass('active');
                $('.caozuo-down-show').hide();
            } else {
                confirm("请输入任务时间或内容！");
            }
        });
        $('.email-detail').on('click', '.caozuo-down-show>li>.new-built-task>.btn-group>.btn-cancel', function (e) {
            $.EventFn(e);
            $('.caozuo-down-show').children('li').children('.modals').removeClass('active');
            $('.caozuo-down-show').hide();
        });
        //新建分组展开
        $('.emailcreatgroup-t').on('click', function (e) {
            $.EventFn(e);

            var stabs = $(this).find('.s-updownBg');
            if (stabs.hasClass('s-add')) {
                $(this).find('.s-add').removeClass('s-add').addClass('s-close');
                $(this).parent('.emailcreatgroup').find('.emailcreatgroup-b').show();
            } else {
                $(this).find('.s-close').removeClass('s-close').addClass('s-add');
                $(this).parent('.emailcreatgroup').find('.emailcreatgroup-b').hide();
            }
        });
        //分配分组
        $('#groupsModal').on('click', '>.mbody>.group-list>li', function (e) {
            $.EventFn(e);
            var ids = [emailId];
            var value = $(this).attr('data-id');
            detailObj.distributionGroup(ids, value);
            $('.caozuo-down-show').children('li').children('.modals').removeClass('active');
            $('.caozuo-down-show').hide();
        });
        //分配标签
        $('#tagsModal').on('click', '>.mbody>.label-list>li', function (e) {
            var ids = [emailId];
            var tagId = $(this).attr('data-id');
            var tagName = $(this).attr('data-accountId');
            detailObj.distributionTag(ids, tagId, tagName)
            $('.caozuo-down-show').children('li').children('.modals').removeClass('active');
            $('.caozuo-down-show').hide();
        });

        //  关闭面板
        $(".caozuo-down-show").on('click', '.mclose', function (e) {
            $.EventFn(e);
            $(this).parent(".mhead").parent(".modals").removeClass('active');
        });
        var detailObj = {
            emailDetail: function (obj) {
                var xb = obj.isStar;
                var tags = obj.tags;
                var subject = obj.subject;
                var sender = obj.froms[0];
                var recipient = obj.tos;
                var detailccs = obj.ccs;
                var receivedTime = obj.receivedTime;
                var fujian = obj.attachments;
                var tx = obj.visitingCard.status;
                var comp = obj.visitingCard.customerName;
                var gh = obj.visitingCard.isHighSeas;
                var html3 = '';
                var html2 = '';
                var gonghai = '';
                var spam = obj.spam;
                if (spam == 1) {
                    $("#spam").text('标记为非垃圾邮件').attr("data-on", "0");
                }
                if (tags == null || tags == '') {
                    $('.marks-group').parent().remove();
                } else {
                    for (var i = 0; i < tags.length; i++) {
                        html3 += '<li class="mark-p" data-id="' + tags[i].id + '" style="border:1px solid #ff7200;border-radius:8px;">\
                                            <span class="mark ellipsis">' + tags[i].name + '</span>\
                                            <i class="pub-icon close-icon"></i>\
                                        </li>';
                    }
                    $('.marks-group').append(html3);
                }
                if (gh == 1) {
                    gonghai = '<span>公海</span>';
                }
                if (obj.visitingCard.customerContactsName !== null) {
                    var status = obj.visitingCard.customerContactsName.substring(0, 1);
                }
                switch (tx) {
                    case 1:
                        userimg = '<i class="pub-icon sender4-icon"></i>';
                        html2 = '<ul><li data-id="' + obj.id + '">' +                //陌生发件人
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                            '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default newtongxunlu">添加通讯录</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                    case 2:
                        userimg = '<i class="pub-icon sender4-icon"></i>';
                        html2 = '<ul><li data-id="' + obj.id + '">' +                //通讯录好友
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                            '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default tongxunlu">通讯录好友</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                    case 3:
                        userimg = '<i class="pub-icon sender1-icon"></i>';//我的联系人
                        html2 = '<ul><li data-id="' + obj.id + '" data-customer="' + obj.visitingCard.customerId + '" data-cont="' + obj.visitingCard.customerContactsId + '">' +
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<div class="company-info"><span class="s-status" style="background-color: ' + obj.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                            '<div class="belong-yewuy"><label>所属业务员：</label><span>' + obj.visitingCard.salesmanName + '</span></div>' +
                            '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockDetail">查看联系人</button>' +
                            '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin">写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                    case 4:
                        userimg = '<i class="pub-icon sender1-icon"></i>';//我的客户
                        html2 = '<ul><li data-id="' + obj.id + '" data-customer="' + obj.visitingCard.customerId + '">' +
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<div class="company-info"><span class="s-status" style="background-color: ' + obj.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                            '<div class="belong-yewuy"><label>所属业务员：</label><span>' + obj.visitingCard.salesmanName + '</span></div>' +
                            '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                            '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                    case 5:
                        userimg = '<i class="pub-icon sender3-icon"></i>';//公海联系人
                        html2 = '<ul><li data-id="' + obj.id + '" data-customer="' + obj.visitingCard.customerId + '">' +
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<div class="company-info"><span class="s-status" style="background-color: ' + obj.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                            '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                            '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCont">添加到私海</button>' +
                            '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                    case 6:
                        userimg = '<i class="pub-icon sender3-icon"></i>';//公海客户
                        html2 = '<ul><li data-id="' + obj.id + '" data-customer="' + obj.visitingCard.customerId + '">' +
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><i class="pub-icon sender3-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<div class="company-info"><span class="s-status" style="background-color: ' + obj.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                            '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                            '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCust">添加到私海</button>' +
                            '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                    case 7:
                        userimg = '<i class="pub-icon sender2-icon"></i>';//同事联系人
                        html2 = '<ul><li data-id="' + obj.id + '" data-customer="' + obj.visitingCard.customerId + '">' +
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<div class="company-info"><span class="s-status" style="background-color: ' + obj.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                            '<div class="belong-yewuy"><label>所属业务员：</label><span>' + obj.visitingCard.salesmanName + '</span></div>' +
                            '<button type="button" class="btn btn-default btn-lg btn-block btn-blockDetail btn-gray" disabled>查看联系人</button>' +
                            '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                    case 8:
                        userimg = '<i class="pub-icon sender2-icon"></i>';//同事客户
                        html2 = '<ul><li data-id="' + obj.id + '" data-customer="' + obj.visitingCard.customerId + '">' +
                            '<div class="sender-condition">' +
                            '<div class="sender-condition-img"><i class="pub-icon sender2-icon" style="top:0;"></i><span class="ellipsis sender-condition-name">' + obj.visitingCard.title + '</span></div>' +
                            '<div class="company-info"><span class="s-status" style="background-color: ' + obj.visitingCard.customerStatusColour + ';">' + status + '</span><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                            '<div class="belong-yewuy"><label>所属业务员：</label><span>' + obj.visitingCard.salesmanName + '</span></div>' +
                            '<button type="button" class="btn btn-default btn-lg btn-block btn-gray btn-blockAdd" disabled>添加联系人</button>' +
                            '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                            '</div>' +
                            '</li></ul>';
                        break;
                }
                $('#sender-condition').append(html2);
                if (xb == 1) {
                    startab = '<i class="pub-icon star stared-icon" data-id="' + emailId + '" data-value="1"></i>';
                } else {
                    startab = '<i class="pub-icon star star-icon" data-id="' + emailId + '" data-value="0"></i>';
                }
                if (sender.name != null && sender.name != '') {
                    fjr = sender.name + sender.value + '; ';
                } else {
                    fjr = sender.value + '; ';
                }
                sjr = '';
                for (var i = 0; i < recipient.length; i++) {
                    if (recipient[i].name != null && recipient[i].name != '') {
                        sjr += recipient[i].name + recipient[i].value + '; ';
                    } else {
                        sjr += recipient[i].value + '; ';
                    }
                }

                csr = '';
                for (var j = 0; j < detailccs.length; j++) {
                    if (detailccs[j].name != null && detailccs[j].name != '') {
                        csr += detailccs[j].name + detailccs[j].value + '; ';
                    } else {
                        csr += detailccs[j].value + '; ';
                    }
                }

                var html01 = '';
                if (csr) {
                    html01 = '<li>\
                                        <div class="form-group">\
                                            <label class="control-label">抄送</label>\
                                            <input class="detailccs" disabled="disabled" value="' + csr + '">\
                                            <div class="clear"></div>\
                                        </div>\
                                    </li>';
                    $('#ccs').empty().append(html01);
                }
                $('.email-detail-theme').prepend(startab);  //星标
                $('.subject').text(subject || '--').attr({
                    'data-messageNumber': obj.messageNumber,
                    'data-folder': obj.folder
                });  //主题
                $('.detailSender').val(fjr);  //发件人
                $('.detailRecipient').val(sjr);  //收件人

                if(receivedTime){
                    receivedTime = receivedTime.substring(0,receivedTime.lastIndexOf('.'));
                }

                $('.sender-info-time').text(receivedTime || '--');  //收到时间
                if (fujian != null && fujian != '') {
                    $('.attachment-amount').text(fujian.length);
                    var fj = '';
                    for (var i = 0; i < fujian.length; i++) {
                        fj += '<li data-url="' + fujian[i].value + '">\
                                    <div class="attachment-img" style="background-image: url(../images/new/cloudfile1.png); background-size: 100%;"></div>\
                                    <div class="attachment-info">\
                                        <h4 class="attachment-tit">' + fujian[i].name + '</h4>\
                                        <p class="attachment-size" data-size="' + fujian[i].size + '">' + parseFloat(fujian[i].size / 1024).toFixed(2) + ' KB</p>\
                                        <div class="attachment-handle">\
                                            <a id="down" data-name="' + fujian[i].name + '" data-url="' + fujian[i].value + '">下载</a>\
                                            <a class="previewEml" href="javascript:;">预览</a>\
                                            <a class="saveCloud" href="javascript:;">存云盘</a>\
                                        </div>\
                                    </div>\
                                </li>';
                        $('.attachment-list').append(fj);
                    }
                } else {
                    $('.fujian').hide();
                }
                if (obj.tracking == 1 && obj.traceRecords !== "") {
                    var recordsLi = '';
                    for (var i = 0; i < obj.traceRecords.length; i++) {
                        recordsLi += '<li><span>' + obj.traceRecords[i].address + '</span><span>' + formatDate(obj.traceRecords[i].traceTime) + '</span></li>';
                    }
                    var traceRecordsHtml = '<div style="position:relative;position: relative;padding: 5px;width: 60%;background: #fff;border-radius: 20px;box-shadow: 0 0 2px #ddd;">' +
                        '<span><i class="i-zhuizong"></i>&nbsp;&nbsp;追踪记录</span>' +
                        '<span style="margin-left:10px;">' + formatDate(obj.traceRecords[obj.traceRecords.length - 1].traceTime) + '被打开 | ' + obj.traceRecords[obj.traceRecords.length - 1].address + '(' + obj.traceRecords[obj.traceRecords.length - 1].ip + ')</span>' +
                        '<a href="javascript:;" class="zhuizong" style="float:right;color:#82a1ff">共打开' + obj.traceRecords.length + '次&nbsp;<span><img src="../../images/tongji-up.png"></span></a>' +
                        '<div style="position:absolute;display:none;right:0;" id="zhuizongDiv">' +
                        '<p>追踪记录(共打开' + obj.traceRecords.length + '次)</p>' +
                        '<ul>' + recordsLi + '</ul>' +
                        '</div>' +
                        '</div>';
                    $(".about-t-e-info").after(traceRecordsHtml);
                }
            },
            //收件箱菜单
            inboxMenu: function () {
                var data = {};
                $.ajax({
                    url: Base.sitUrl + '/api/email/inbox/v1/menus',
                    type: 'GET',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var listg = data.emailGroup;
                        var listt = data.tags;
                        var html1 = '';
                        var html2 = '';
                        for (var i = 0; i < listg.length; i++) {
                            html1 += '<li data-id="' + listg[i].id + '" data-accountId="' + listg[i].name + '">' + listg[i].name + '<span class="removeMenu">×</span></li>';
                        }
                        for (var i = 0; i < listt.length; i++) {
                            html2 += '<li data-id="' + listt[i].id + '" data-accountId="' + listt[i].name + '">' + listt[i].name + '<span class="removeMenu">×</span></li>';
                        }
                        $('#groupsModal>.mbody>.group-list').empty().append(html1);
                        $('#tagsModal>.mbody>.label-list').empty().append(html2);
                    }
                });
                return data;
            },
            //标记为垃圾邮件
            rubishEmail: function (emailId, value) {
                var data = {
                    ids: [emailId],
                    value: value
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/inbox/v1/spam',
                    type: 'POST',
                    data: postData,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        parent.$.reHtml();
                        var index = $('#mainTab', parent.document).find('.currentClass').index();
                        parent.me.closeOne(index);
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
                    executionTime: executionTime   //任务时间
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
            //分配分组
            distributionGroup: function (emailId, groupId) {
                var data = {
                    ids: emailId,
                    value: groupId
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/inbox/v1/group',
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
            deleteTag: function (id) {  //取消标签
                var data = {
                    id: id
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/v1/tag/delete',
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
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var html = '<li class="mark-p" data-id="' + tagId + '" style="border:1px solid #ff7200;border-radius:8px;">' +
                            '<span class="mark ellipsis">' + tagName + '</span>' +
                            '<i class="pub-icon close-icon" style="display: none;"></i>' +
                            '</li>';
                        $(".marks-group").append(html);
                        if(parent.$.reHtml){
                            parent.$.reHtml();
                        }
                    }
                });
            },
            //删除邮件
            deleteEmail: function (ids) {
                var data = {
                    'ids': [ids]
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/inbox/v1/delete',
                    type: 'POST',
                    data: postData,
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('删除，' + res.message);
                            return;
                        }
                        //parent.$.reHtml();
                        parent.location.reload();
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
                    url: Base.sitUrl + '/api/email/inbox/v1/star',
                    type: 'POST',
                    data: postData,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        if(parent.$.reHtml && parent.$.reInboxMenu){
                            parent.$.reHtml();
                            parent.$.reInboxMenu();
                        }
                    }
                });
            },
            downloadFujian: function (filename, url) {
                var data = {
                    name: filename,
                    value: url
                };
                var postData = 'data=' + JSON.stringify(data);
                window.location.href = Base.sitUrl + '/api/file/download?' + postData;
            }
        };

        //时间戳转换
        function formatDate(now) {
            var now = new Date(now);
            var year = now.getFullYear();
            var month = now.getMonth() + 1;
            var date = now.getDate();
            var hour = now.getHours();
            var minute = now.getMinutes();
            var second = now.getSeconds();
            if (hour < 11) {
                hour = '0' + hour;
            } else {
                hour = hour;
            }
            ;
            if (minute < 11) {
                minute = '0' + minute;
            } else {
                minute = minute;
            }
            ;
            if (second < 11) {
                second = '0' + second;
            } else {
                second = second;
            }

            return   year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
        }

        $(function () {
            function dataOrg() {
                var dataJson = new Array();
                var data = {
                    view: '0'
                }
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/disk/v1/folder/list/all",
                    dataType: "json",
                    async: false,
                    data: {
                        data: JSON.stringify(data)
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        var data = result.data;
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].type == 0) {
                                dataJson.push(data[i])
                            }
                        }
                    }
                });
                return dataJson;
            }

            var setting = {
                view: {
                    selectedMulti: false
                },
                edit: {
                    enable: true,
                    editNameSelectAll: true
                },
                data: {
                    simpleData: {
                        enable: true
                    }
                },
                callback: {
                    beforeDrag: false
                }
            };

            var zNodes = new Array();
            var data = dataOrg();
            for (var i = 0; i < data.length; i++) {
                zNodes[i] = {
                    id: data[i].id,
                    pId: data[i].pid,
                    name: data[i].name,
                    open: true
                }
            }
            $.fn.zTree.init($("#treeDemoAdd"), setting, zNodes);
        });

        //存云盘
        $('.attachment-list').on('click', '.saveCloud', function () {
            $('.fileTree').toggle();
            $(this).closest('li').addClass('active').siblings().removeClass('active');
        });
        $('.btn-saveCloud').click(function () {
            var nodes = $.fn.zTree.getZTreeObj("treeDemoAdd").getSelectedNodes();
            if (nodes == '') {
                var pid = '0';
            } else {
                var pid = nodes[0].id;
            }
            var curLi = $(".attachment-list li.active");
            var fileName = curLi.find('.attachment-tit').text();
            var size = curLi.find('.attachment-size').attr("data-size");
            var url = 'http://' + curLi.attr('data-url');
            var data = {
                pid: pid,
                name: fileName,
                file: url,
                size: size,
                type: '1',
                shareType: '1',
                operateType: '0',
                userType: '0'
            };
            $.ajax({
                url: Base.sitUrl + '/api/disk/v1/file/save',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                beforeSend: function (XHR) {
                    $.BlockUI();
                },
                complete: function (XHR, TS) {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (res.success) {
                        $.Alert('保存成功!', '', function () {
                            $('.fileTree').hide();
                        });
                    } else {
                        $.unLogin(res);
                        return;
                    }
                }
            })
        });

        //预览
        $('.attachment-list').on('click', '.previewEml', function () {
            var url = 'http://' + $(this).parents('li').attr('data-url');
            var name = $(this).parent().prev().prev().text();
            var _length = url.lastIndexOf('.');
            var ext = url.substring(_length, url.length).toUpperCase();
            if (ext == ".PNG" || ext == ".JPG" || ext == '.JPEG' || ext == '.SVG' || ext == '.GIF') {
                var html = '<img src="' + url + '" alt="" class="previewImg previewContent">'
            } else if (ext == ".TXT" || ext == '.JS' || ext == '.CSS') {
                var preurl = Base.sitUrl + '/api/export/v1/file/preview?data={file: \'' + url + '\'}';
                var html = '<iframe src="' + preurl + '" frameborder="0" class="previewIframe previewContent"></iframe>'
            } else if (ext == ".DOC" || ext == ".DOCX" || ext == '.XLS' || ext == '.XLSX' || ext == '.ET' ||
                ext == '.PPT' || ext == '.PPTX' || ext == '.WPS' || ext == '.ZIP' || ext == '.RAR' || ext == '.7Z' || ext == '.PDF') {
                var preurl = Base.sitUrl + '/api/export/v1/file/preview?data={file: \'' + url + '\'}';
                var html = '<iframe src="' + preurl + '" frameborder="0" class="previewIframe previewContent"></iframe>'
            } else {
                $.Alert(ext.toLowerCase() + '格式暂不支持预览');
                return
            }
            $('#preview').find('h3').text(name);
            $('#preview').find('.previewContent').remove();
            $('#preview').append(html).show();
        });
        $('#previewClose').bind('click', function () {
            $('#preview').hide().find('.previewContent').remove();
        });

        $(document).on('click', '.zhuizong', function () {
            if ($("#zhuizongDiv").css("display") == 'block') {
                $(this).find("img").css('transform', 'rotate(0deg)');
                $("#zhuizongDiv").hide();
            } else {
                $("#zhuizongDiv").show();
                $(this).find("img").css('transform', 'rotate(180deg)');
            }
        })
        $(document).on('mouseenter', '.label-list li', function () {
            $(this).find(".removeMenu").show();
        })
        $(document).on('mouseleave', '.label-list li', function () {
            $(this).find(".removeMenu").hide();
        })
        //  星标选定
        $(document).on('click', '.star', function (e) {
            $.EventFn(e);
            if ($(this).hasClass('star-icon')) {
                $(this).removeClass('star-icon').addClass('stared-icon');
                listVal = $(this).attr('data-value');
                if (listVal == 0) {
                    listVal = 1
                }
                listId = $(this).attr('data-id');
                detailObj.starChange(listId, 1);
            } else {
                $(this).removeClass('stared-icon').addClass('star-icon');
                listVal = $(this).attr('data-value');
                if (listVal == 1) {
                    listVal = 0
                }
                listId = $(this).attr('data-id');
                detailObj.starChange($(this).attr('data-id'), 0);
            }
        });
        $('#tagsModal').on('click', '>.mbody>.label-list>li>.removeMenu', function (e) {
            $.EventFn(e);
            var oThis = $(this);
            var id = $(this).parents('li').attr("data-id");
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/user/tag/delete',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: id
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }

                    oThis.parent().remove();
                }
            })
        })
        $.getFrame = function (h) {
            var obj = document.getElementById('myIframe').contentWindow.document.getElementById('data').value;
            obj = eval("(" + obj + ")")
            detailObj.emailDetail(obj)
            var spaceH = $('html').height() - $('#header-h').height() - 30
            if (spaceH > h) {
                $('.email-detail-main').height(spaceH)
            } else {
                $('.email-detail-main').height(h)
            }
        }
    });
});