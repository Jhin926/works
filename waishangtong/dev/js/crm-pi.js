/* !
 *  用于CRM PI单设置
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
        maintab.init();
        var $content = $('.page-content'),
            $filterModal = $('#filterModal');

        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 20
        };
        $.filterObj.type = 2;
        $content.on('click', '.m_batch>button', function (e) {
            $.EventFn(e);

            var type = $(this).attr('data-type');
            if (type == 'dels') {
                $.modalsFn($('#delsModal'));
            } else if (type == 'email') {
                var ids = piObj.getAllChecked().ids;
                var Ids = '';
                if (ids.length >= 2) {
                    $.Alert('只能单个文件发送')
                    return
                }
                for (var i = 0; i < ids.length; i++) {
                    Ids += ids[i] + ','
                }
                Ids = Ids.substring(0, Ids.length - 1);

                maintab.showTab(Base.url + '/html/pop-email-new.html?showType=right&modelType=101&ids=' + ids + "&v=" + window.ver, '发邮件');
            }
        });
        //  关闭面板
        $content.on('click', '.mclose,#btn-del-no', function () {
            $('.modals').removeClass('active');
        });
        //关闭按钮变换
        $('#batchClose').on('mouseenter', function () {
            $(this).addClass('s-updownBg s-dels4').removeClass('fa fa-times')
        })
        $('#batchClose').on('mouseleave', function () {
            $(this).addClass('fa fa-times').removeClass('s-updownBg s-dels4')
        })
        //  删除报价单
        $content.on('click', '#btn-del-ok', function () {
            var ids = piObj.getAllChecked().ids;
            piObj.changeQuoStatus(ids, 0);
        });
        //  查看报价详情
        $content.on('click', '.page_info tbody>tr', function (e) {
            $.EventFn(e);

            var id = parseInt($(this).find('input[name=batch]').attr('data-id'));
            if (!isNaN(id)) {
                maintab.showTab(Base.url + '/html/pop-pi-detail.html?id=' + id + "&v=" + window.ver, 'PI详情');
            }
        });
        //  通过报价单名快速搜索
        $content.on('input', '#inputQuick', function (e) {
            $.EventFn(e);

            var _val = $(this).val(),
                list = $.filterObj.list,
                tmp = [],
                leg = $.filterObj.total;
            for (var i = 0; i < list.length; i++) {
                if (list[i].name.indexOf(_val) != -1) {
                    tmp.push(list[i]);
                }
            }
            if (_val) {
                leg = 0;
            } else {
                leg = $.filterObj.total;
            }
            piObj.filterShow(tmp, leg);
        });

        //  排序
        $content.on('click', '.page_info thead>tr>th', function (e) {
            $.EventFn(e);
            var _index = $(this).index(), list = $.filterObj.list;
            if (_index == 6) {
                var $i = $(this).children('i');
                if ($i.hasClass('s-orderList')) {
                    $.filterObj.type = 1;
                    $i.removeClass('s-orderList').addClass('s-reorderList');
                    piObj.filterShow(list, $.filterObj.total);
                } else {
                    $.filterObj.type = 0;
                    $i.removeClass('s-reorderList').addClass('s-orderList');
                    piObj.filterShow(list, $.filterObj.total);
                }
            }
        });
        //获取下属
        $('#btn-underling').click(function (e) {
            if ($(this).hasClass('on')) {
                piObj.filter();
                $('#btn-underling-pop').hide();
                $(this).removeClass('on').attr({'data-toggle':'modal','data-target':'#myModal'});
                $.EventFn(e)
            } else {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/underling/customer',
                    type: 'POST',
                    dataType: 'json',
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        var data = result.data;
                        var list = '';
                        for (var i = 0; i < data.length; i++) {
                            list += '<li data-id="' + data[i].id + '">' + data[i].name + '</li>';
                        }
                        $('.modal-body>ul').empty().append(list)
                    }
                });
            }
        })
        //下属
        $('.modal-body>ul').on('click', '>li', function () {
            var id = $(this).attr('data-id');
            var name = $(this).text();
            $('#btn-underling').addClass('on').attr({'data-toggle':'','data-target':''})
            $('#btn-underling-pop').text(name).attr('data-id', id).show();
            $('#underling-close').click();
            piObj.filter({id: id});
        })
        //  报价对象
        var piObj = {
            filter: function (obj) {
                var data = {
                    pageSize: pageObj.pageSize,
                    currentPage: pageObj.currentPage
                };
                obj = obj || {};
                if (Object.keys(obj).length > 0) {
                    $.extend(data,obj);
                }
                $.ajax({
                    url: Base.sitUrl + '/api/pi/v1/pi/list',
                    data: data,
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data.results;
                        $.filterObj.list = list;
                        $.filterObj.total = res.data.totalItem;
                        piObj.filterShow(list, $.filterObj.total);
                    }
                });
            },
            changeQuoStatus: function (ids, type) {
                $.ajax({
                    url: Base.sitUrl + '/api/pi/v1/pi/batch/delete',
                    data: {
                        ids: ids.join(';')
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '删除失败,');
                            return;
                        }
                        $('.modals').removeClass('active');
                        $('.m_batch').stop().animate({'left': '-100%'}, function () {
                            $(this).removeClass('active');
                        });
                        piObj.filter();
                    }
                });
            },
            getAllChecked: function () {
                var data = {ids: []};
                $('input[name=batch]:checked').each(function () {
                    var _id = $(this).attr('data-id');
                    data.ids.push(parseInt(_id));
                });
                return data;
            },
            /*
             * @filterShow 过滤展示
             */
            filterShow: function (list, total) {
                var html = '';
                if (list.length > 0) {
                    if ($.filterObj.type == 1) {
                        list.sort(function(a, b){
                            return new Date(a.createTime).getTime() - new Date(b.createTime).getTime();
                        });
                    }else if($.filterObj.type == 0) {
                        list.sort(function(a, b){
                            return new Date(b.createTime).getTime() - new Date(a.createTime).getTime();
                        });
                    }
                    for (var i = 0; i < list.length; i++) {
                        var name = list[i].name;
                        if (name.length >= 25) {
                            name = name.substr(0, 25) + '...';
                        }
                        html += '<tr>\
                                    <td><div class="checker"><span><input type="checkbox" name="batch" data-id="' + list[i].id + '"></span></div></td>\
                                    <td><span>' + list[i].piNo + '</span></td>\
                                    <td title="' + list[i].name + '"><span>' + name + '</span></td>\
                                    <td class="customer-card" style="position:relative"><span class="s-special customer-card-name" data-id="' + list[i].customerId + '">' + (list[i].customerName || '匿名') + '</span><div class="sender-condition-style"></div></td>\
                                    <td><span>' + list[i].total + ' USD' + '</span></td>\
                                    <td><span>' + list[i].seller + '</span></td>\
                                    <td><span class="sp-time">' + list[i].createTime + '</span></td>\
                                </tr>';
                    }
                } else {
                    var none = '<div class="trNone">' +
                        '<div class="trnone-info">' +
                        '<img src="../images/empty-pi.png" alt="" />' +
                        '<p class="trnone-text">暂无PI</p>'+
                        '</div>' +
                        '<a href="pop-pi-add.html" class="trnone-btn btn btn-primary" data-code="pi_add" data-maintab></i><span>创建PI</span></a>'+
                        '</div>';
                    $('.trNone').remove();
                    $('.page_info>table>tbody').empty();
                    $('.page_info>table').after(none);
                }
                if(html!=''){
                    $('.trNone').remove();
                    $('.page_info>table>tbody').empty().append(html);
                }
                var ps = pageObj.pageSize, all = Math.ceil(total / ps);
                $.Page({
                    total: total,
                    _class: '.page',
                    nowNum: pageObj.currentPage,
                    allNum: all,
                    callback: function (now, all) {
                        pageObj.currentPage = parseInt(now);
                        piObj.filter(screenOpt);
                    }
                });
            }
        };
        //名片
        $('.table').unbind('mouseenter').on('mouseenter', '.customer-card', function () {
            var id = $(this).find('.customer-card-name').attr('data-id');
            var html = emailAccountCard(id);
            $(this).find('.sender-condition-style').empty().append(html);
            if ($(this).attr('data-num') == '1') {
                var top = $(this).find('.sender-condition-style').height() - 10;
                var h = '-' + top + 'px';
                $(this).find('.sender-condition-style').css('top', h)
            }
            $(this).find('.sender-condition-style').show();
        })
        $('.table').on('mouseleave', '.customer-card', function () {
            $(this).find('.sender-condition-style').hide();
        });
        //客户名片
        function emailAccountCard(id) {
            var data = {
                id: id
            }
            var html;
            $.ajax({
                url: Base.sitUrl + '/api/customer/v1/visitingcard',
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
                    var data = res.data;
                    var tx = data.status;
                    var gh = data.isHighSeas;
                    var comp = data.customerName;
                    var gonghai = '';
                    if (gh == 1) {
                        gonghai = '<span>公海</span>';
                    }
                    switch (tx) {
                        case 1:
                            html2 = '<ul><li>' +                //陌生发件人
                                '<div class="sender-condition">' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default newtongxunlu">添加通讯录</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 2:
                            html2 = '<ul><li>' +                //通讯录好友
                                '<div class="sender-condition">' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group" style="margin-left:-118px;"><button type="button" class="btn btn-default tongxunlu">通讯录好友</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 3://我的联系人
                            html2 = '<ul><li data-customer="' + data.customerId + '" data-cont="' + data.customerContactsId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockDetail">查看联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin">写跟进</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 4://我的客户
                            html2 = '<ul><li data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-blockAdd">添加为联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 5://公海联系人
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCont">添加到私海</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 6://公海客户
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label>' + gonghai + '</div>' +
                                '<button type="button" class="btn btn-primary btn-lg btn-block btn-privateCust">添加到私海</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go">往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 7://同事联系人
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-default btn-lg btn-block btn-blockDetail btn-gray" disabled>查看联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                        case 8://同事客户
                            html2 = '<ul><li data-id="' + data.id + '" data-customer="' + data.customerId + '">' +
                                '<div class="sender-condition">' +
                                '<div class="company-info"><i class="pub-icon ding-icon"></i><span class="ellipsis company-name name-blue">' + comp + '</span></div>' +
                                '<div class="belong-yewuy"><label>所属业务员：</label><span>' + data.salesmanName + '</span></div>' +
                                '<button type="button" class="btn btn-default btn-lg btn-block btn-gray btn-blockAdd" disabled>添加联系人</button>' +
                                '<div class="btn-group condition-cz-btn" role="group"><button type="button" class="btn btn-default xiegenjin" disabled>写跟进</button><button type="button" class="btn btn-default fayoujian" data-emlAddr="'+ data.email +'">发邮件</button><button type="button" class="btn btn-default come-go" disabled>往来邮件</button></div>' +
                                '</div>' +
                                '</li></ul>';
                            break;
                    }
                    html = html2;
                }
            })
            return html;
        }

        //点击卡片写跟进
        $('.table').on('click', '.xiegenjin', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-upload.html?id=' + id + "&v=" + window.ver, '写跟进');
        });
        //点击卡片添加通讯录
        $('.table').on('click', '.newtongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/pop-statistics-new.html?id=' + id + "&v=" + window.ver, '新建通讯录');
        });
        //点击卡片通讯录
        $('.table').on('click', '.tongxunlu', function (e) {
            $.EventFn(e);
            var id = $(this).closest('tr').find('input[name=batch]').attr('data-id');
            maintab.showTab(Base.url + '/html/email-statistics.html' + "?&v=" + window.ver, '通讯录');
        });
        //点击卡片发邮件
        $('.table').on('click', '.fayoujian', function (e) {
            $.EventFn(e);
            var name = $(this).attr('data-emlAddr');
            name = name=='null'?'':name;
            maintab.showTab(Base.url + '/html/pop-email-new.html?showType=right&name='+ name + "&v=" + window.ver, '发邮件');
        });
        //添加客户到私海
        $('.table').on('click', '.btn-privateCust', function (e) {
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
                    $oThis.text('已添加到私海')
                }
            })
        });
        //添加联系人到私海
        $('.table').on('click', '.btn-privateCont', function (e) {
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

        //点击卡片往来邮件
        $('.table').on('click', '.come-go', function (e) {
            $.EventFn(e);
            var email = $(this).parent().prevAll('.sender-condition-img').find('.sender-condition-name').text();
            maintab.showTab(Base.url + '/html/pop-come-go-email.html?email=' + email + "&v=" + window.ver, '往来邮件');
        });
        //  添加为联系人
        $('.table').on('click', '.btn-blockAdd', function (e) {
            $.EventFn(e);
            var name = $(".detailSender").val();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?name=' + name + '&v=' + window.ver, '添加联系人');
        });
        //  查看联系人
        $('.table').on('click', '.btn-blockDetail', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-cont');
            maintab.showTab(Base.url + '/html/pop-relation-detail.html?id=' + id + "&v=" + window.ver, '联系人详情');
        });
        //查看公司
        $('.table').on('click', '.company-name', function (e) {
            $.EventFn(e);
            var id = $(this).parents('li').attr('data-customer');
            maintab.showTab(Base.url + '/html/pop-customer-detail.html?id=' + id + "&v=" + window.ver, '客户详情');
        });

        var screenOpt = {};
        $filterModal.on('click', '#reset', function (e) {
            $('#quoName').val('');
            $('#custInfo').val('');
            $('#proDateBeg').val('');
            $('#proDateEnd').val('');
        });
        //  过滤筛选
        $filterModal.on('click', '#screen', function (e) {
            pageObj.currentPage = 1;
            var $name = $('#quoName'),
                $custInfo = $('#custInfo'),
                $dateBeg = $('#proDateBeg'),
                $dateEnd = $('#proDateEnd'),
                inputOpt = {};
            if ($name.val() != '' && $.trim($name.val()) != '') {
                inputOpt.keyword = $name.val();
            }
            if ($custInfo.val() != '' && $.trim($custInfo.val()) != '') {
                inputOpt.customerInfo = $custInfo.val();
            }
            if($dateBeg.val() != '' && $.trim($dateBeg.val()) != ''){
                inputOpt.startDate = $dateBeg.val();
            }
            if($dateEnd.val() != '' && $.trim($dateEnd.val()) != ''){
                inputOpt.endDate = $dateEnd.val();
            }
            screenOpt = inputOpt;
            piObj.filter(screenOpt);//如果没有输入任何值，那就过滤全部
            $('#filterModal').modal('hide');
        });
        piObj.filter();
    });
});