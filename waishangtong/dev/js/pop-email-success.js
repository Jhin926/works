require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'ztree'], function (maintab) {
        var emailId = $.GetQueryString('id');
        var email = $.GetQueryString('email');
        maintab.init();
        $('#email-detail').click(function () {
            maintab.showTab(Base.sitUrl + '/html/pop-email-detailOut.html?id=' + emailId + "&v=" + window.ver, '邮件详情')
        })
        //点击卡片添加通讯录
        $('.email-list').on('click', '.newtongxunlu', function (e) {
            $.EventFn(e);
            // var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            var email = $(this).parents('li').find('.email-success-title').text();
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?name=' + email + "&v=" + window.ver, '新建通讯录');
        });
        //  添加为联系人
        $('.email-list').on('click', '.btn-blockAdd', function (e) {
            $.EventFn(e);
            var email = $(this).parents('li').find('.email-success-title').text();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?name=' + email + "&v=" + window.ver, '添加联系人');
        });
        //点击卡片往来邮件
        $('.email-list').on('click', '.come-go', function (e) {
            $.EventFn(e);
            var email = $(this).parents('li').find('.email-success-title').text();
            maintab.showTab(Base.url + '/html/pop-come-go-email.html?email=' + email + "&v=" + window.ver, '往来邮件');
        });

        function emailCard(email) {//邮件卡片
            var data = {
                value: email
            }
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/visitingcards',
                type: 'POST',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    var data = res.data;
                    var html = '';
                    for (var i = 0; i < data.length; i++) {
                        var status = data[i].status;
                        if (status == 1) {
                            html += '<li>\
				                        <span class="email-success-title">' + data[i].email + '</span>\
				                        <div class="card-btn-group" style="">\
				                            <a href="#" class="btn-blockAdd">添加为联系人</a>\
				                            <span>|</span>\
				                            <a href="#" class="newtongxunlu">添加到通讯录</a>\
				                            <span>|</span>\
				                            <a href="#" class="come-go">来往邮件</a>\
				                        </div>\
				                    </li>'
                        } else if (status == 1) {
                            html += '<li>\
				                        <span class="email-success-title">' + data[i].email + '</span>\
				                        <div class="card-btn-group" style="display:inline-block;float:right;margin-right:200px">\
				                            <a href="#" class="btn-blockAdd">添加为联系人</a>\
				                            <span>|</span>\
				                            <a href="#" class="disabled">添加到通讯录</a>\
				                            <span>|</span>\
				                            <a href="#" class="come-go">来往邮件</a>\
				                        </div>\
				                    </li>'
                        } else {
                            html += '<li>\
				                        <span class="email-success-title">' + data[i].email + '</span>\
				                        <div class="card-btn-group" style="display:inline-block;float:right;margin-right:200px">\
				                            <a href="#" class="disabled">添加为联系人</a>\
				                            <span>|</span>\
				                            <a href="#" class="disabled">添加到通讯录</a>\
				                            <span>|</span>\
				                            <a href="#" class="come-go">来往邮件</a>\
				                        </div>\
				                    </li>'
                        }
                    }
                    $('.email-list').empty().append(html)
                }
            })
        }

        emailCard(email)
    });
});