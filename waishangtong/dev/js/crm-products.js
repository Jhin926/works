/* !
 *  用于CRM产品设置
 */
require(['common'], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN'], function (maintab) {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code1]').each(function(){
            for(var i=0; i<funcList.length; i++){
                if(funcList[i].code == $(this).attr('data-code1') || funcList[i].code == $(this).attr('data-code2')){
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
        //默认隐藏右半部分标题
        $('.r-titles').hide();
        var $content = $('.page-content'),
            $filterModal = $('#filterModal');

        $content.on('click', '.m_batch>button', function (e) {
            $.EventFn(e);
            var type = $(this).attr('data-type');
            if (type == 'group') {
                $.modalsFn($('#groupsModal'));
            } else if (type == 'dels') {
                $.modalsFn($('#delsModal'), $(this));
            } else if (type == 'recover') {
                var ids = proObj.getAllChecked().ids;
                var parameter = JSON.stringify({'ids':ids});
                $.ajax({
                    url:Base.sitUrl + '/api/product/v1/product/recovery?data='+parameter,
                    success:function(res){
                        if(!res.success){
                            $.unLogin(res,'恢复失败,');
                            return;
                        }
                        location.reload();
                    }
                })
            } else if (type == 'email') {
                var ids = proObj.getAllChecked().ids;
                var Ids = '';
                if (ids.length >= 2) {
                    $.Alert('只能单个文件发送');
                    return
                }
                var Ids = '';
                for (var i = 0; i < ids.length; i++) {
                    Ids += ids[i] + ','
                }
                Ids = Ids.substring(0, Ids.length - 1);

                maintab.showTab(Base.url + '/html/pop-email-new.html?showType=right&modelType=99&ids=' + Ids + "&v=" + window.ver, '新建邮件');
            }
        });

        //  关闭面板
        $content.on('click', '.mclose,#btn-del-no', function (e) {
            $.EventFn(e);
            $('.modals').removeClass('active');
        });
       //关闭按钮变换
        $('#batchClose').on('mouseenter', function () {
            $(this).addClass('s-updownBg s-dels4').removeClass('fa fa-times')
        })
        $('#batchClose').on('mouseleave', function () {
            $(this).addClass('fa fa-times').removeClass('s-updownBg s-dels4')
        });

        $content.on("mouseenter",".page_info .product-img",function(){
            var index=$(".page_info .product-img").index(this);
            $(".big_img").hide();
            $(".big_img").eq(index).show();
        }).on("mouseleave",".page_info .product-img",function(){
            $(".big_img").hide();
        });

        //  分组
        $content.on('click', '.u-group>ul>li', function (e) {
            $.EventFn(e);

            var id = $(this).attr('data-id');
            var data = proObj.getAllChecked();

            proObj.groupFn(data.ids, id);
        });

        //  删除
        $content.on('click', '#btn-del-ok', function (e) {
            $.EventFn(e);

            var data = proObj.getAllChecked();
            proObj.deleteFn(data.ids);
        });

        //  左侧产品过滤
        $content.on('click', '#proFilter>li', function (e) {
            $.EventFn(e);
            if ($(this).hasClass('active')) {
                return;
            }
            var _txt = $(this).find('a').text();
            $('.r-titles>span.i_task').text(_txt);
            $(this).addClass('active').siblings('li').removeClass('active');
            pageObj.currentPage = 1;
            var groupId = parseInt($(this).attr('data-id'));
            if(groupId==-1){
                $('#btn-groups').attr('disabled',true);
                $('#btn-dels').attr('disabled',true);
                $('#btn-email').attr('disabled',true);
                $("#btn-recover").attr('disabled',false);
            }else {
                $('#btn-groups').attr('disabled',false);
                $('#btn-dels').attr('disabled',false);
                $('#btn-email').attr('disabled',false);
                $("#btn-recover").attr('disabled',true);
            }
            proObj.filter({catelogName: groupId});
        });
        $filterModal.on('click', '#reset', function (e) {
            $('#proName').val('');
            $('#proGroup').val('');
            $('#proDateBeg').val('');
            $('#proDateEnd').val('');
            $('#proType').val('');
        });
        //  过滤筛选
        $filterModal.on('click', '#screen', function (e) {
            pageObj.currentPage = 1;
            var $name = $('#proName'),
                $group = $('#proGroup'),
                $dateBeg = $('#proDateBeg'),
                $dateEnd = $('#proDateEnd'),
                $proType = $('#proType');
            if ($name.val() != '' && $.trim($name.val()) != '') {
                screenOpt.name = $name.val();
            }
            if ($group.val() != -1) {
                screenOpt.catelogName = $group.val();
            }
            if ($proType.val() != -1) {
                screenOpt.productType = $proType.val();
            }
            if($dateBeg.val() != '' && $.trim($dateBeg.val()) != ''){
                screenOpt.startDate = $dateBeg.val();
            }
            if($dateEnd.val() != '' && $.trim($dateEnd.val()) != ''){
                screenOpt.endDate = $dateEnd.val();
            }
            if(!($name.val() =='' && $group.val() ==-1 && $proType.val() ==-1 && $dateBeg.val() =='' && $dateEnd.val() =='')){//非所有为空的情况
                proObj.filter(screenOpt);
            }
            $('#filterModal').modal('hide');
        });

        //  查看产品详情
        $content.on('click', '.page_info tbody>tr', function (e) {
            $.EventFn(e);
            $(".big_img").hide();
            var id = parseInt($(this).find('input[name=batch]').attr('data-id'));
            if (!isNaN(id)) {
                maintab.showTab(Base.url + '/html/pop-product-detail.html?id=' + id + "&v=" + window.ver, '产品详情');
            }
        });
        //排序
        $content.on('click', '.page_info thead>tr>th', function (e) {
            $.EventFn(e);
            var _index = $(this).index(),
                list = $.filterObj.list;
            if (_index == 4) {
                var $i = $(this).children('i');
                if ($i.hasClass('s-orderList')) {
                    $.filterObj.type = 1;
                    $i.removeClass('s-orderList').addClass('s-reorderList');
                } else {
                    $.filterObj.type = 0;
                    $i.removeClass('s-reorderList').addClass('s-orderList');
                }
                proObj.filterShow(list, $.filterObj.total);
            }
        });
        //  通过产品名称快速搜索
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
            proObj.filterShow(tmp, leg);
        });


        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 20
        };

        var screenOpt = {};

        // 产品信息
        var proObj = {
            //  获取产品列表
            filter: function (obj) {
                var data = {
                    pageSize: pageObj.pageSize,
                    currentPage: pageObj.currentPage
                };
                if(obj != undefined){
                    if (Object.keys(obj).length > 0) {
                        $.extend(data, obj);
                        if (obj.createTime) {
                            data.type = obj.type || 1;
                        }
                    }
                }
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/list',
                    data: data,
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data.results;

                        //if(obj == undefined){
                            $.filterObj.list = list;
                            $.filterObj.total = res.data.totalItem;
                        //}
                        proObj.filterShow(list, res.data.totalItem);
                    }
                });
            },
            //  过滤展示
            filterShow: function (list, total) {
                var html = '';
                if (list.length > 0) {
                    if ($.filterObj.type == 1) {
                        list.sort(function (a, b) {
                            return new Date(a.updateTime).getTime() - new Date(b.updateTime).getTime();
                        });
                    } else if ($.filterObj.type == 0) {
                        list.sort(function (a, b) {
                            return new Date(b.updateTime).getTime() - new Date(a.updateTime).getTime();
                        });
                    }
                    for (var i = 0; i < list.length; i++) {
                        var key = list[i],
                            tobj = key.productTradeInfoEnter,
                            img = '../images/user.jpg';
                        if (key.pictures.length > 0) {
                            var img_list = key.pictures[0].url;
                            var _del="@58w";
                            img=img_list.replace(_del,'');
                        }
                        var groupName = '未分组';
                        if (key.catalogName && key.catalogName.length > 0) {
                            groupName = key.catalogName;
                        }

                        var m_name = '', m_abridge = '', m_sign = '', st_price = 0, ed_price = 0, mqt = 0;
                        if (key.fobPriceCurrencyName) {
                            m_abridge = key.fobPriceCurrencyName;
                            m_sign = m_abridge.substr(m_abridge.lastIndexOf('<>') + 2);
                        } else {
                            m_sign = '$';
                        }
                        if (tobj && tobj.fomPriceMin) {
                            st_price = tobj.fomPriceMin;
                        }
                        if (tobj && tobj.fomPriceMax) {
                            ed_price = tobj.fomPriceMax;
                        }
                        if (tobj && tobj.minOrderQuantity) {
                            mqt = tobj.minOrderQuantity;
                        }
                        if (key.name) {
                            m_name = key.name;
                            if (m_name.length >= 60) {
                                var pt_name = m_name.substr(0, 60) + '...';
                            } else {
                                var pt_name = m_name
                            }
                        }
						html += '<tr><td><div class="checker"><span><input name="batch" data-id="' + key.id + '" type="checkbox"></span></div></td>\
                            <td>\
                            <div class="product-img"><img src="' + img + '" alt="头像" />\
                            <div class="big_img"><img src="' + img + '" alt="头像" /></div>\
                            </div>\
                            <div class="product-survey" title="' + m_name + '">\
                            <p class="product-name">' + pt_name + '</p>\
                            <div><span>编号:' + (key.productNo || '') + '</span><span>价格:$' + st_price + '-' + ed_price + '</span><span>最小采购量:' + mqt + '</span></div></td>\
                            <td><span>' + groupName + '</span></td>\
                            <td><span>' + (key.typeName || '无品类') + '</span></td>\
                            <td style="position: relative;">\
                            <span class="sp-time">' + key.updateTime + '</span>' +
                            '<span class="product-count" style="right: 70px;"><i class="s-menuBg s-menu10"></i><span>' + list[i].quotationCount + '</span></span>' +
                            '<span class="product-count"><i class="s-updownBg s-pi"></i><span>' + list[i].piCount + '</span></span>' +
                            '</td></tr>';

                    }
                } else {
                    var none = '<div class="trNone">' +
                        '<div class="trnone-info">' +
                        '<img src="../images/empty-doc.png" alt="" />' +
                        '<p class="trnone-text">暂无产品</p>' +
                        '</div>' +
                        '<a href="pop-product-add.html" class="trnone-btn btn btn-primary" data-code1="product_add" data-code2="product_import" data-maintab></i><span>新建/导入产品</span></a>' +
                        '</div>';
                    $('.trNone').remove();
                    $('.page_info>table>tbody').empty();
                    $('.page_info>table').after(none);
                }
                if (html != '') {
                    $('.trNone').remove();
                    $('.page_info>table>tbody').empty();
                    $('.page_info>table>tbody').append(html);
                }
                $('.page_info>table>tbody img').error(function () {
                    $(this).attr('src', '../images/user.jpg');
                });
                var ps = pageObj.pageSize, all = Math.ceil(total / ps);
                $.Page({
                    total: total,
                    _class: '.page',
                    nowNum: pageObj.currentPage,
                    allNum: all,
                    callback: function (now, all) {
                        pageObj.currentPage = parseInt(now);
                        if ($('#proFilter li.active').length > 0) {
                            var groupId = parseInt($('#proFilter li.active').attr('data-id'));
                            proObj.filter({catelogName: groupId});
                        } else {
                            if(screenOpt == {}){
                                proObj.filter();
                            }else {//有筛选条件
                                proObj.filter(screenOpt);
                            }
                        }
                    }
                });
            },

            //获取产品类型列表
            getTypes: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/type/list',
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            console.log(res);
                            $.unLogin(res);
                            return;
                        }

                        var list = res.data,
                            html = '';

                        if (list.length > 0) {
                            html = '<option value="-1">请选择类型</option>';
                            for (var i = 0; i < list.length; i++) {
                                html += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                            }
                            $('#proType').empty().append(html);
                        }
                    }
                });
            },
            //  获取产品分组列表
            getGroups: function (type, showType) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/catelog/list',
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data,
                            html = '',
                            html2 = '',
                            html3 = '<li data-id="0"><a href="javascript:;" style="font-weight:bold;">全部产品</a></li><li data-id="0"><a href="javascript:;"style="font-weight:bold;">全部分组</a></li><li data-id="1"><a href="javascript:;">未分组</a></li>';
                        if (list.length > 0) {
                            html = '<option value="-1">请选择分组</option>';
                            for (var i = 0; i < list.length; i++) {
                                html += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                                html2 += '<li data-id="' + list[i].id + '">' + list[i].name + '</li>';
                                html3 += '<li data-id="' + list[i].id + '"><a href="javascript:;">' + list[i].name + '</a></li>';
                            }
                            html3+='<li data-id="-1" class="btn_delete"><a href="javascript:;" style="font-weight:bold;">已删除</a></li>'
                            $content.find('#proGroup,.u-group>ul').empty();
                            $('#proGroup').append(html);
                            $content.find('.u-group>ul').append(html2);
                            $content.find('#proFilter').empty().append(html3);
                        }
                    }
                });
            },
            //  添加产品分组
            addGroups: function (name) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/catelog/save',
                    data: {data: JSON.stringify({name: name})},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '添加失败,');
                            return;
                        }
                        $content.find('#typeNames').val('');
                        $content.find('.type-add').removeClass('active');
                        proObj.getGroups();
                    }
                });
            },
            //  切换产品状态列表
            deleteFn: function (ids) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/delete',
                    data: {
                        id: ids.join(';')
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
                        proObj.filter();
                    }
                });
            },
            //  分组到
            groupFn: function (ids, id) {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/catelog/edit',
                    data: {
                        id: ids.join(';'),
                        productCatelog: id
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res, '分组失败,');
                            return;
                        }
                        $('.modals').removeClass('active');
                        $('.m_batch').stop().animate({'left': '-100%'}, function () {
                            $(this).removeClass('active');
                        });
                        proObj.filter();
                    }
                });
            },
            //  获取选中客户id和可执行批量判断
            getAllChecked: function () {
                var data = {ids: []};
                $('input[name=batch]:checked').each(function () {
                    var _id = $(this).attr('data-id');
                    data.ids.push(parseInt(_id));
                });
                return data;
            }
        };
        //  获取产品类型列表
        proObj.filter();
        proObj.getGroups();
        proObj.getTypes();

    });
});