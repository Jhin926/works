/* !
 *  用于发件箱设置
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab) {
        maintab.init();
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
            $('#mainIframe', parent.document).attr('src', Base.url + '/html/pop-email-newOut.html?showType=right&type=0&id=' + id + "&v=" + window.ver);
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
                maintab.showTab(Base.url + '/html/pop-email-newOut.html?showType=right&type=5&id=' + id + "&v=" + window.ver, title);
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

        //标签
        $('.table').on('mouseenter', '.mark-p', function (e) {
            $.EventFn(e);
            $(this).find('.close-icon').show();
            var closeIcon = $(this).children('.close-icon');
            if (closeIcon.css('display') == 'none') {
                closeIcon.show();
            }
        });
        $('.table').on('mouseleave', '.mark-p', function (e) {
            $.EventFn(e);
            $(this).find('.close-icon').hide();
            var closeIcon = $(this).children('.close-icon');
            if (closeIcon.css('display') == 'block') {
                closeIcon.hide();
            }
        });
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
            cnasleChecked();
        });

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

        //显示or隐藏卡片
        $('.page_info').on('mouseenter', '.sender-condition-td', function (e) {
            $.EventFn(e);
            $(this).find('.sender-condition-style').show();
        });
        $('.page_info').on('mouseleave', '.sender-condition-td', function (e) {
            $.EventFn(e);
            $(this).children('.sender-condition-style').hide();
        });
        //改变读取状态
        $('.page_info').on('click', 'tbody>tr', function (e) {
            $.EventFn(e);
            var ids = $(this).find('input[name=batch]').attr('data-id');
            var value = $(this).attr('isRead');
            if (value == 0) {
                emailObj.isRead(ids, 1);
                $(this).attr('isRead', '1').css('font-weight', '400');
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
            draft: function (obj, group, unread, star, deleted, spam, draft, tag, subject, content) {
                var data = {
                    group: 0,
                    unread: 0,
                    star: 0,
                    deleted: 0,
                    spam: 0,
                    draft: 0,
                    tag: '',
                    subject: '',
                    content: '',
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                };
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
                                '<td colspan="6" style="text-align: center;">还没有草稿！</td>' +
                                '</tr>';
                            $('.page_info>table>tbody').empty().append(html);
                            return;
                        }
                        emailObj.sortName = list;
                        emailObj.total = res.data.totalItem;
                        emailObj.shujuzhanshi(list, emailObj.total, '000');
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
                        if (fjicon == 1) {
                            ficon = '<i class="pub-icon list-fujian-icon"></i>';
                        }
                        var markstag = '';
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

                        if (list[i].visitingCard != null && list[i].visitingCard != '') {
                            var tx = list[i].visitingCard.status;
                            var gh = list[i].visitingCard.isHighSeas;
                            var comp = list[i].visitingCard.customerName;
                            var userimg = '';
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
                                default :
                                    userimg = '<i class="pub-icon sender2-icon"></i>';//同事客户
                                    html2 = '';
                                    break;
                            }
                            var condition = '<div class="sender-condition-style">' + html2 + '</div>';

                            var inboxContent = '<a class="email-content-info ellipsis"href="pop-email-detail.html" data-maintab><span class="pull-left">' + ficon + list[i].subject + '<span style="margin:0 5px;">-</span></span><span class="list-content ellipsis">' + list[i].content + '</span></a><ul class="marks-group">' + markstag + '</ul>';
                            var startab = '';
                            if (xb == 1) {
                                startab = '<i class="pub-icon star stared-icon" data-id="' + list[i].id + '" data-value="1"></i>';
                            } else {
                                startab = '<i class="pub-icon star star-icon" data-id="' + list[i].id + '" data-value="0"></i>';
                            }

                            var inboxContent = '<a class="email-content-info ellipsis"href="pop-email-detail.html"data-maintab><span style="max-width:665px;" class="pull-left">' + ficon + list[i].subject + '<span style="margin:0 5px;">-</span></span><span class="list-content ellipsis">' + _content + '</span></a><ul class="marks-group" style="display: inline-block;overflow: hidden;height: 25px;margin:0;float:right">' + markstag + '</ul>';
                            if (noread == 1) {
                                html += '<tr isRead="1" data-type=' + type + '>\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis">' + testNull(list[i].visitingCard.title) + '</span></div>' + condition + '</td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time sortTime">' + ed + '</div></td>\
                                        <td>' + startab + '</td>\
                                    </tr>';
                            } else {
                                html += '<tr isRead="0" style="font-weight:700;"  data-type=' + type + ' class="isRead">\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis">' + testNull(list[i].visitingCard.title) + '</span></div>' + condition + '</td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time sortTime">' + ed + '</div></td>\
                                        <td>' + startab + '</td>\
                                    </tr>';
                            }
                        } else {//没有小卡片
                            var userimg = '<i class="pub-icon sender2-icon"></i>';
                            var startab = '';
                            var inboxContent = '<a class="email-content-info ellipsis"href="pop-email-detail.html"data-maintab><span style="max-width:665px;" class="pull-left">' + ficon + list[i].subject + '<span style="margin:0 5px;">-</span></span><span class="list-content ellipsis">' + _content + '</span></a><ul class="marks-group" style="display: inline-block;overflow: hidden;height: 25px;margin:0;float:right">' + markstag + '</ul>';
                            if (xb == 1) {
                                startab = '<i class="pub-icon star stared-icon" data-id="' + list[i].id + '" data-value="1"></i>';
                            } else {
                                startab = '<i class="pub-icon star star-icon" data-id="' + list[i].id + '" data-value="0"></i>';
                            }
                            if (noread == 1) {
                                html += '<tr isRead="1" data-type=' + type + '>\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis">' + list[i].emailAddress + '</span></div></td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time sortTime">' + ed + '</div></td>\
                                        <td>' + startab + '</td>\
                                    </tr>';
                            } else {
                                html += '<tr isRead="0" style="font-weight:700;" data-type=' + type + ' class="isRead">\
                                        <td><div class="checker"><span><input type="checkbox" data-id="' + list[i].id + '" name="batch"></span></div></td>\
                                        <td class="sender-condition-td" data-email="' + list[i].emailAddress + '" data-count="0"><div class="sender">' + userimg + '<span class="span-name ellipsis">' + list[i].emailAddress + '</span></div></td>\
                                        <td class="inboxContent">' + inboxContent + '</td>\
                                        <td><div class="inbox-time sortTime">' + ed + '</div></td>\
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
                        emailObj.draft();
                    }
                })
            },
            //删除草稿
            deleteEmail: function (ids) {
                var uri = '/api/email/v1/draft/delete';
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
                        emailObj.draft();
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
                return data;
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
                    emailObj.total= res.data.totalItem;
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
                        $('.page_info>table>tbody').empty().append(html);
                        return;
                    }
                    emailObj.sortName = list;
                    emailObj.total = res.data.totalItem;
                    var type = '000';
                    emailObj.shujuzhanshi(list, emailObj.total, '000');
                }
            });
        };

        $('.page-right').css({float: 'left', width: '99%'});
        emailObj.draft();//初始草稿列表
    });
});