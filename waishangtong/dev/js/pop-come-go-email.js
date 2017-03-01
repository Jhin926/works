require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab) {
        maintab.init();
        var emailAddr = $.GetQueryString('email');

        //点击到邮件详情
        $('.come-go-email').on('click', 'ul>li', function (e) {
            $.EventFn(e);
            var id = $(this).attr('data-id');
            var isRead = $(this).attr('isRead');
            var type = $(this).attr('data-type');
            if (isRead == 0) {
                var html = '';
                $(this).attr('isRead', '1');
                comeGoObj.isRead(id, 1);
                $(this).find('.dot-icon').hide();
            }
            if ($(this).find('.pub-icon').hasClass('go-icon')) {
                maintab.showTab(Base.url + '/html/pop-email-detailOut.html?id=' + id + "&uri=", '邮件详情');
            } else if ($(this).find('.pub-icon').hasClass('come-icon')) {
                maintab.showTab(Base.url + '/html/pop-email-detail.html?id=' + id + "&uri=", '邮件详情');
            }
        });

        var pageObj = {
            currentPage: 1,
            pageSize: 20
        };
        var comeGoObj = {
            comeGoList: function (emailAddr) {    //往来邮件
                var data = {
                    email: emailAddr,
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                };
                $.ajax({
                    url: Base.sitUrl + '/api/email/v1/history',
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'GET',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var list = data.results;
                        var html = '';
                        if (list.length == 0) {
                            html = '<li style="text-align:center;">没有往来邮件！</li>';
                            $('.come-go-email-list').empty().append(html);
                            return;
                        }
                        if (list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].type == 1 && list[i].isRead == 0) {
                                    html += '<li data-id="' + list[i].id + '" isRead="' + list[i].isRead + '" data-type="' + list[i].type + '">\
								                <h4><i class="dot-icon"></i>' + list[i].name + '<span class="come-go-time">' + list[i].sendTime + '</span></h4>\
								                <div class="list-email-info">\
								                    <div class="list-email-info-title"><i class="pub-icon come-icon"></i>' + list[i].subject + '</div>\
								                    <div class="list-email-info-content">' + list[i].content + '</div>\
								                </div>\
								            </li>';
                                } else if (list[i].type == 2 && list[i].isRead == 0) {
                                    html += '<li data-id="' + list[i].id + '" isRead="' + list[i].isRead + '" data-type="' + list[i].type + '">\
								                <h4><i class="dot-icon"></i>' + list[i].name + '<span class="come-go-time">' + list[i].sendTime + '</span></h4>\
								                <div class="list-email-info">\
								                    <div class="list-email-info-title"><i class="pub-icon go-icon"></i>' + list[i].subject + '</div>\
								                    <div class="list-email-info-content">' + list[i].content + '</div>\
								                </div>\
								            </li>';
                                } else if (list[i].type == 1 && list[i].isRead == 1) {
                                    html += '<li data-id="' + list[i].id + '" isRead="' + list[i].isRead + '" data-type="' + list[i].type + '">\
								                <h4>' + list[i].name + '<span class="come-go-time">' + list[i].sendTime + '</span></h4>\
								                <div class="list-email-info">\
								                    <div class="list-email-info-title"><i class="pub-icon come-icon"></i>' + list[i].subject + '</div>\
								                    <div class="list-email-info-content">' + list[i].content + '</div>\
								                </div>\
								            </li>';
                                } else if (list[i].type == 2 && list[i].isRead == 1) {
                                    html += '<li data-id="' + list[i].id + '" isRead="' + list[i].isRead + '" data-type="' + list[i].type + '">\
								                <h4>' + list[i].name + '<span class="come-go-time">' + list[i].sendTime + '</span></h4>\
								                <div class="list-email-info">\
								                    <div class="list-email-info-title"><i class="pub-icon go-icon"></i>' + list[i].subject + '</div>\
								                    <div class="list-email-info-content">' + list[i].content + '</div>\
								                </div>\
								            </li>';
                                }
                            }

                            $('.come-go-email-list').empty().append(html);
                        }
                    }
                });
                return data;
            },
            //改变已读时的展示状态
            isRead: function (id, value) {
                var data = {
                    ids: [id],
                    value: value
                };
                var postData = 'data=' + JSON.stringify(data);
                $.ajax({
                    url: Base.sitUrl + '/api/email/inbox/v1/read',
                    type: 'POST',
                    data: postData,
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                        }
                    }
                });
                return data;
            }
        };
        comeGoObj.comeGoList(emailAddr);
    });
});