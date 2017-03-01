/* !
 *  用于通讯录
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab) {
        maintab.init();
        var addressId = $.GetQueryString('id');

        //编辑
        $('#bianji').on('click', function (e) {
            $.EventFn(e);
            var pIdx = parent.me.tabIdx();
            var index = $('#mainTab', parent.document).find('.currentClass').index();
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?type=0&id=' + addressId + '&pIdx='+ pIdx, '编辑');
        });
        var addressDetailObj = {
            statistics: function () {
                var data = {
                    id: addressId
                };
                $.ajax({
                    url: Base.sitUrl + '/api/addressList/v1/email/address/detail',
                    data: {
                        data: JSON.stringify(data)
                    },
                    type: 'POST',
                    success: function (res, phone) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data;
                        var email = data.email;
                        var tmp = [];
                        var tmp2 = [];
                        var html = '';
                        var html2 = '';
                        var html3 = '';
                        var html4 = '';
                        var html5 = '';
                        if (data.phone != null && data.phone != '') {
                            phone = data.phone;
                        } else {
                            phone = '';
                        }
                        $('#customerName').text(data.name);
                        console.log(phone);
                        if (email.indexOf(';') != -1) {
                            tmp = email.split(';');
                            if (tmp.length > 1) {
                                for (var i = 0; i < tmp.length; i++) {
                                    html += '<li>\
                                                <div style="height:50px;">\
                                                    <label class="col-sm-1" style="line-height:50px;">邮箱' + (i + 1) + '：</label>\
                                                    <div class="col-sm-11" style="line-height:50px;">' + tmp[i] + '</div>\
                                                </div>\
                                            </li>';
                                }
                            }
                        } else {
                            html = '<li>\
                                        <div style="height:50px;">\
                                            <label class="col-sm-1" style="line-height:50px;">邮箱：</label>\
                                            <div class="col-sm-11" style="line-height:50px;">' + email + '</div>\
                                        </div>\
                                    </li>';
                        }
                        if (phone.indexOf(';') != -1 && phone != null && phone != '') {
                            tmp2 = phone.split(';');
                            if (tmp2.length > 1) {
                                for (var i = 0; i < tmp2.length; i++) {
                                    html2 += '<li>\
                                                <div style="height:50px;">\
                                                    <label class="col-sm-1" style="line-height:50px;">电话' + (i + 1) + '：</label>\
                                                    <div class="col-sm-11" style="line-height:50px;">' + tmp2[i] + '</div>\
                                                </div>\
                                            </li>';
                                }
                            }
                        } else if (phone.indexOf(';') == -1 && phone != null && phone != '') {
                            html2 = '<li>\
                                        <div style="height:50px;">\
                                            <label class="col-sm-1" style="line-height:50px;">电话：</label>\
                                            <div class="col-sm-11" style="line-height:50px;">' + phone + '</div>\
                                        </div>\
                                    </li>';
                        }
                        $('#customerEmail').empty();
                        $('#customerEmail').append(html);
                        $('#customerPhone').empty();
                        $('#customerPhone').append(html2);
                        if (data.birthday != null && data.birthday != '') {
                            html3 = '<li>\
                                        <div style="height:50px;">\
                                            <label class="col-sm-1" style="line-height:50px;">生日：</label>\
                                            <div class="col-sm-11" style="line-height:50px;">' + data.birthday + '</div>\
                                        </div>\
                                    </li>';
                        }
                        $('#customerBirthday').empty();
                        $('#customerBirthday').append(html3);
                        if (data.company != null && data.company != '') {
                            html5 = '<li>\
                                        <div style="height:50px;">\
                                            <label class="col-sm-1" style="line-height:50px;">公司：</label>\
                                            <div class="col-sm-11" style="line-height:50px;">' + data.company + '</div>\
                                        </div>\
                                    </li>';
                        }
                        $('#customerBirthday').empty();
                        $('#customerBirthday').append(html5);
                        if (data.remark != null && data.remark != '') {
                            $('#customerRemark').text(data.remark);
                            html4 = '<li>\
                                        <div style="height:50px;">\
                                            <label class="col-sm-1" style="line-height:50px;">备注：</label>\
                                            <div class="col-sm-11" style="line-height:50px;">' + data.remark + '</div>\
                                        </div>\
                                    </li>';
                        }
                        $('#customerRemark').empty();
                        $('#customerRemark').append(html4);
                    }
                });
            }
        };
        addressDetailObj.statistics();
    });
});