/* !
 *  用于通讯录
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN'], function (maintab) {
        maintab.init();
        if (jQuery().datetimepicker) {
            $('.emailTime').datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                todayBtn: false,
                language: "zh-CN",
                startDate: new Date(),
                pickerPosition: "bottom",
                autoclose: true
            });
        }

        //  通过客户名、邮箱称快速搜索
        $('.page-content').on('input', '#inputQuick', function (e) {
            $.EventFn(e);
            var value = $(this).val();
            var list = addressObj.sortName;
            var tmp = [];
            var tmp2 = [];
            var html = '';
            for (var i = 0; i < list.length; i++) {
                if (list[i].email.indexOf(value) != -1) {
                    tmp.push(list[i]);
                }
            }
            if (tmp.length == 0) {
                html = '<tr>' +
                    '<td colspan="6" style="text-align: center;">还没有收到邮件</td>' +
                    '</tr>';
                $('.page_info>table>tbody').empty();
                $('.page_info>table>tbody').append(html);
                return;
            } else if (tmp.length > 0) {
                for (var j = 0; j < tmp.length; j++) {
                    tmp2.push(tmp[j]);
                }
                ;
                addressObj.contactList(tmp2, tmp2.length);
            }
        });
        //关闭按钮变换
        $('#batchClose').on('mouseenter', function () {
            $(this).addClass('s-updownBg s-dels4').removeClass('fa fa-times')
        })
        $('#batchClose').on('mouseleave', function () {
            $(this).addClass('fa fa-times').removeClass('s-updownBg s-dels4')
        })
        //跳转详情页
        $('.page_info').on('click', 'tbody>tr', function (e) {
            $.EventFn(e);
            var id = $(this).find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-statistics-detail.html?id=' + id + "&v=" + window.ver, '通讯录详情');
        });

        //显示筛选
        $('.btn-about').on('click', '#btn-filter', function (e) {
            $('#sx-condition').slideToggle("slow");
        });

        //筛选
        $('#shaixuan-btn').on('click', function (e) {
            $.EventFn(e);
            var obj1 = {
                filedName: 'name',
                operateType: 'like',
                filedValue: $("#contactType").val()
            };
            var obj2 = {
                filedName: 'email',
                operateType: 'like',
                filedValue: $("#filter-keyword").val()
            };
            var emailTimeC = $("#filter-emailTimeC option:selected").val();
            var obj3 = {
                filedName: 'createTime',
                operateType: emailTimeC,
                filedValue: $("#filter-emailTime").val()
            };
            var obj4 = {
                filedName: 'company',
                operateType: 'like',
                filedValue: $("#filter-company").val()
            };
            obj1 = JSON.stringify(obj1);
            obj2 = JSON.stringify(obj2);
            obj3 = JSON.stringify(obj3);
            obj4 = JSON.stringify(obj4);
            var conditions = '[' + obj1 + ',' + obj2 + ',' + obj4 + ',' + obj3 + ']';
            addressObj.statistics(null, null, conditions);
        });

        //排序
        $('.page_info').on('click', '>table>thead>tr>th', function (e) {
            $.EventFn(e);
            var obj = [];
            if ($(this).attr('id') == 'contacter') {
                if ($(this).attr('data-type') == '0') {
                    obj = addressObj.sortName.sort(function (a, b) {
                        return a.name.charCodeAt() - b.name.charCodeAt();
                    });
                    $(this).attr('data-type', '1');
                    addressObj.contactList(obj, addressObj.total);
                } else {
                    obj = addressObj.sortName.sort(function (a, b) {
                        return b.name.charCodeAt() - a.name.charCodeAt();
                    });
                    $(this).attr('data-type', '0');
                    addressObj.contactList(obj, addressObj.total);
                }
            } else if ($(this).attr('id') == 'sortTime') {
                if ($(this).attr('data-type') == '0') {
                    obj = addressObj.sortName.sort(function (a, b) {
                        return new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime();
                    });
                    $(this).attr('data-type', '1');
                    addressObj.contactList(obj, addressObj.total);
                } else {
                    obj = addressObj.sortName.sort(function (a, b) {
                        return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
                    });
                    $(this).attr('data-type', '0');
                    addressObj.contactList(obj, addressObj.total);
                }
            } else {
                return;
            }

        });
        //获取id
        function getAllChecked() {
            var data = {ids: ''};
            $('input[name=batch]:checked').each(function () {
                var _id = $(this).attr('data-id');
                data.ids += parseInt(_id) + ','
            });
            data.ids = data.ids.substring(0, data.ids.length - 1)
            return data;
        }

        //删除
        $('#btn-dels').on('click', function () {
            $('#delsModal').show()
        });
        $('#btn-del-ok').on('click', function () {
            var ids = getAllChecked()
            $.ajax({
                url: Base.sitUrl + '/api/addressList/v1/email/address/delete',
                data: {
                    data: JSON.stringify(ids)
                },
                type: 'POST',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res, '删除失败,');
                        return;
                    }
                    $('.modals').removeClass('active');
                    $('#delsModal').hide()
                    $('.m_batch').stop().animate({'left':'-100%'});
                    addressObj.statistics();
                }
            });
        })
        $('#btn-del-no').on('click', function () {
            $('#delsModal').hide()
        })

        var pageObj = {
            homepage: 1,
            lastpage: null,
            currentPage: 1,
            pageSize: 20
        };

        var addressObj = {
            lastpage: null,
            currentPage: 1,             //  当前页
            sortName: [],
            total: 0,
            statistics: function (currentPage, pageSize, conditions) {
                if (conditions == undefined) {
                    conditionsNew = "";
                } else {
                    conditionsNew = '"conditions":' + conditions;
                }
                var data = '{' +
                    '"currentPage":' + pageObj.currentPage + ',' +
                    '"pageSize":' + pageObj.pageSize + ',' +
                    conditionsNew +
                    '}';
                //收件箱
                $.ajax({
                    url: Base.sitUrl + '/api/addressList/v1/email/address/list',
                    data: {
                        data: data
                    },
                    type: 'POST',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var data = res.data,
                            obj = data.results;
                        addressObj.sortName = obj;
                        addressObj.total = res.data.totalItem;
                        addressObj.contactList(obj, addressObj.total);
                    }
                });
            },
            contactList: function (obj, total) {
                var html = '';
                if (obj.length > 0) {
                    for (var i = 0; i < obj.length; i++) {
                        html += '<tr>\
                                    <td><div class="checker"><span><input type="checkbox" data-id="' + obj[i].id + '" name="batch"></span></div></td>\
                                    <td>\
                                        <div class="sender">\
                                            <i class="pub-icon sender1-icon"></i>\
                                            <span class="span-name ellipsis">' + obj[i].name + '</span>\
                                        </div>\
                                    </td>\
                                    <td>\
                                        <div class="email">' + obj[i].email + '</div>\
                                    </td>\
                                    <td>\
                                        <div class="email">' + obj[i].company + '</div>\
                                    </td>\
                                    <td>\
                                        <div class="inbox-time">' + obj[i].updateTime + '</div>\
                                    </td>\
                                </tr>';
                    }
                } else {
                    html = '<tr>' +
                        '<td colspan="6" style="text-align: center;">通讯录空空如也</td>' +
                        '</tr>';
                    return;
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
                        addressObj.statistics();
                    }
                });
            },
        };
        addressObj.statistics();
    });
});