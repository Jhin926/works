/* !
 *  用于客户详情
 */
require([ 'common' ], function () {
    require([  'maintab', 'blockUI', 'jqform', 'ztree', 'bootstrap','angular','datetimepickerCN'], function (maintab) {
        var custId = parseInt($.GetQueryString('id')),
            $detail = $('.box-customer-detail'),
            $items = $detail.find('.status-items'),
            $menus = $detail.find('.s-menus'),
            $group = $detail.find('#groupsModal'),
            $del = $detail.find('#delsModal'),
            $transfer = $detail.find('#transfer'),
            custName = '';
        var titleName;
        maintab.init();
        var pageObj = {
            pageSize: $.pageObj ? $.pageObj.pageSize : 8,
            currentPage: $.pageObj ? $.pageObj.currentPage : 1//如果没有应该设置默认当前页数是1，之前写的是8
        };
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                language: 'zh-CN',
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                format: "yyyy-mm-dd hh:ii",
                bootcssVer: 3//因为html里的写法不规范，所以必须要加上这个时间插件才能正常显示
            });
        }
        var app=angular.module("All",[]);
        app.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.headers.post["Content-Type"] =
                "application/x-www-form-urlencoded";
            $httpProvider.defaults.
            transformRequest.unshift(function(data,
                                              headersGetter) {
                var key, result = [];
                for (key in data) {
                    if (data.hasOwnProperty(key)) {
                        result.push(encodeURIComponent(key) + "="
                            + encodeURIComponent(data[key]));
                    }
                }
                return result.join("&");
            });
        }]);
        app.controller("merge",['$scope','$http',function($scope,$http){
            $scope.pageObj = {
                homepage: 1,
                currentPage: 1,
                lastpage: null,
                pageSize: 10,
                conditions: [],
                keyword: ''
            };
            $scope.customerId=custId;
            $scope.choicedId='';
            $scope.customerList = {};
            $scope.showGroup = false;
            $scope.customerGroupList = [
                {id: '0',name: '全部分组'}
            ];
            $scope.chiocedGroup = {
                id: 0,
                name: '选择分组'
            };
            $scope.chiocedCustomer = {};
            $scope.mean={};
            $scope.meansList={};
            $scope.meansListNew={};

            $scope.changeStyle=function($event){
                var thisDom=$event.target;
                $(thisDom).parents('.customer-list').find('div.radio').find('span.checked').removeClass('checked');
                $(thisDom).parent().addClass('checked');
                $scope.chiocedCustomer = $(thisDom).val();
                if($scope.chiocedCustomer==$scope.customerId){
                    $.Alert("不能选择客户自己")
                    $(thisDom).prop("disabled",true);
                    $("#btn-sure").prop("disabled",true);
                }else{
                    $("#btn-sure").prop("disabled",false);
                }
            };
            $scope.getList=function(){
                customerList();
            };
            //提交
            var choicedId;
            $scope.save=function(){
                    choicedId = $scope.chiocedCustomer;
                var customerId=$scope.customerId,
                    idsString=customerId+','+choicedId,
                    ids=idsString.split(',')
                var data={
                    ids:ids
                };
                if(!choicedId){
                    $.Alert('请先选择客户！');
                    return
                }else{
                    $http({
                        method:'post',
                        url:Base.sitUrl + '/api/customer/v1/customer/merge/data',
                        data:{
                            data:JSON.stringify(data)
                        }
                    })
                        .success(function(res){
                            if(!res.success){
                                $.unLogin(res);
                                return
                            }
                            if(customerId==res.data[0].id){
                                $scope.mean=$scope.meansList=res.data[0];
                                $scope.mean.subId = choicedId;
                                $scope.mean.id = res.data[0].id;
                                $scope.meansListNew=res.data[1];
                            }else{
                                $scope.mean=$scope.meansList=res.data[1];
                                $scope.mean.subId = choicedId;
                                $scope.mean.id = res.data[1].id;
                                $scope.meansListNew=res.data[0];
                            }
                        })
                    $('#customer').modal('hide');
                    $("#customerdetail").modal('show');
                }
            };
            $scope.chooseLeft = function(){
                $scope.mean=$scope.meansList;
                $scope.mean.name=$scope.meansList.name;
                $scope.mean.subId=choicedId;
                $scope.mean.id=$scope.customerId;
                $(".leftcon ul>li span").addClass("checked");
                $(".rightcon ul>li span").removeClass("checked");
            }
            $scope.chooseRight = function(){
                $scope.mean=$scope.meansListNew;
                $scope.mean.name=$scope.meansListNew.name;
                $scope.mean.subId=choicedId;
                $scope.mean.id=$scope.customerId;
                $(".leftcon ul>li span").removeClass("checked");
                $(".rightcon ul>li span").addClass("checked");
            }
            $scope.meansSend=function(){
                $http({
                    method:'get',
                    url: Base.sitUrl + '/api/customer/v1/customer/merge',
                    params:{
                        data: JSON.stringify($scope.mean)
                    }
                })
                    .success(function(res){
                        if(!res.success){
                            $.unLogin(res);
                            return
                        }
                        $.Alert("合并成功");
                        parent.location.reload();
                    })

            }
            //选择分组
            $scope.chioceGroup = function(_group){
                $scope.chiocedGroup = _group;
                $scope.showGroup = false;

                $scope.pageObj.currentPage = 1;
                if(_group.id!='0'){
                    $scope.pageObj.conditions = [{"filedName":"customerGroupId","operateType":"=","filedValue":_group.id}];
                }else {
                    $scope.pageObj.conditions = [];
                }

                customerList();
            };
            //客户列表
            function customerList(){
                $http({
                    method:'post',
                    url: Base.sitUrl + '/api/customer/v1/customer/list/query',
                    data: {data: JSON.stringify($scope.pageObj)}
                }).success(function(res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    $scope.customerList = res.data.results;
                    var total = res.data.totalItem,
                        all = Math.ceil(res.data.totalItem/res.data.pageSize);
                    $.Page({
                        total: total,
                        _class: '.customer-page',
                        nowNum: $scope.pageObj.currentPage,
                        allNum: all,
                        callback: function (now, all) {
                            $scope.pageObj.currentPage = now;
                            customerList();
                        }
                    });
                });
            }
            customerList();

            //客户分组列表
            $http({
                method:'post',
                url: Base.sitUrl + '/api/customer/v1/customer/group/list'
            }).success(function(res) {
                if (!res.success) {
                    $.unLogin(res);
                    return
                }
                $scope.customerGroupList = $scope.customerGroupList.concat(res.data);
            });


        $('.screen-choiced').click(function(){
            $('.screen-list').toggle();
        });
            //  顶部菜单
        $detail.on('click', '.s-menus>li', function (e) {
            $.EventFn(e);

            var index = $(this).index();
            $detail.find('.modals').removeClass('active');
            if (index == 0) {
                maintab.addTab(Base.url + '/html/pop-customer-add.html?id=' + custId + "&v=" + window.ver, '编辑客户');
            } else if (index == 1) {
                if ($del.hasClass('active')) {
                    return false;
                }
                $del.addClass('active');
            } else if (index == 2) {
                if ($group.hasClass('active')) {
                    return false;
                }
                $group.addClass('active');
                //detailObj.setCustomerInfo({ids: custId,setType: 'group',customerGroupId:})
            } else if (index == 3) {
                if ($transfer.hasClass('active')) {
                    return false;
                }
                $transfer.addClass('active');
            } else if (index == 4) {
                /*var data = {ids: custId, setType: 'unFollow'};
                detailObj.setCustomerInfo(data, null);*/
                $.EventFn(e);
                customerList();
                $('#customer').modal('show');
            }
        });
        $detail.on('click','.doc-handle',function(e){
            $.EventFn(e);
            $('.doc-handle-cont').hide();
            $(this).next().show();
        });

        var uploadOpt = {};
        $detail.on('click','.doc-upload',function(e){
            uploadOpt.size = $(this).attr('data-size');
            uploadOpt.file = $(this).attr('data-url');
            uploadOpt.name = $(this).attr('data-name');
            $('#cloudModal').modal('show')
        });
        //上传到云盘
        $('#addCloud').click(function(){
            $('#cloudModal').modal('hide');
            var nodes = $.fn.zTree.getZTreeObj("treeCloud").getSelectedNodes();
            if (nodes == '') {
                var pid = '0';
            } else {
                var pid = nodes[0].id;
            }
            var data = {
                pid: pid,
                type: '1',
                shareType: '1',
                operateType: '0',
                userType: '0'
            };
            $.extend(data,uploadOpt);
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
                            uploadOpt = {};
                        });
                    } else {
                        $.unLogin(res);
                        return;
                    }
                }
            });
        });
        $detail.on('click','.doc-delete',function(e){
            $.EventFn(e);
            var docContainer = $(this).closest('.tab-content');
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/document/delete',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify({id:docContainer.attr('data-id')})
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    docContainer.remove();
                    var doumentsCount = parseInt($('.documentCount').text());
                    $('.documentCount').text(--doumentsCount);
                }
            });
        });
        $('document').bind('click', function (e) {//点击其他位置分组隐藏
            $.EventFn(e);
            $group.removeClass('active');
            $menus.removeClass('active');
            $transfer.removeClass('active');
            $('.doc-handle-cont').hide();

            //点击其他位置，如果联系人邮箱和客户概览在编辑的状态，那么就取消编辑状态
            if ($('.edit-mail').hasClass('active')) {
                $('.edit-mail').removeClass('active').prev().addClass('active');
            }
            if ($('.info-overview select').hasClass('active')) {
                $('.info-overview select').removeClass('active').prev().removeClass('active');
            }
        });

        $('.info-overview select').click(function(e){
            $.EventFn(e);
        });
        //  删除客户
        $detail.on('click', '#del-ok', function (e) {
            $.EventFn(e);

            detailObj.setCustomerInfo({ids: custId, setType: 'delete', type: 'customer'});
        });
        //取消删除客户
        $detail.on('click', '#del-no', function (e) {
            $.EventFn(e);
            $('.modals').removeClass('active');
        });
        //  客户分组
        $detail.on('click', '.u-group>ul>li', function (e) {
            $.EventFn(e);

            var _id = $(this).attr('data-id'),
                _name = $(this).text();
            detailObj.setCustomerInfo({ids: custId, setType: 'group', customerGroupId: _id, groupName: _name});
        });
        //客户转移
        $detail.on('click', '.u-transfer>ul>li', function (e) {
            $.EventFn(e);

            var data = {ids: custId, setType: 'allot', userId: $(this).attr('data-id')};
            detailObj.setCustomerInfo(data, null);

            //var _id = $(this).attr('data-id'),
            //  _name = $(this).text();
            //detailObj.setCustomerInfo({ids: custId, setType: 'group', customerGroupId: _id, groupName: _name});
        });
        //  打开状态列表
        $detail.on('click', '.status-list>.status-current>span', function (e) {
            $.EventFn(e);

            var $list = $(this).closest('.status-list'),
                $items = $list.children('.status-items');
            if ($items.hasClass('active')) {
                $items.removeClass('active');
            } else {
                $items.addClass('active');
            }
        });
        //  选择状态
        $detail.on('click', '.status-list>.status-items>li', function (e) {
            $.EventFn(e);

            var html = $(this).children().prop('outerHTML'),
                id = parseInt($(this).children().attr('data-id')),
                $current = $('.status-current');

            if (html == $current.children('label').prop('outerHTML')) {
                return;
            }
            html += '<span><i class="s-updownBg s-up"></i></span>';
            $current.empty();
            $current.append(html);
            $(this).parent().removeClass('active');
            var data = {
                id: custId,
                status: id,
                setType: "setStatus"
            };
            detailObj.setCustomerInfo(data);
        });

        //  展开小菜单
        $detail.on('click', '.s-other', function (e) {
            $.EventFn(e);

            var $ul = $(this).next('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
                $ul.addClass('active');
            }
        });
        //  设置星级
        $detail.on('click', '.status-star>i', function (e) {
            $.EventFn(e);
            var index = $(this).index() + 1,
                data = {};
            data.id = custId;
            data.starLevel = index;
            data.setType = 'setStar';
            detailObj.setCustomerInfo(data);
        });
        $detail.on('click', '.info-edit', function (e) {
            $.EventFn(e);

            maintab.showTab(Base.url + '/html/pop-customer-add.html?id=' + custId + "&v=" + window.ver, '编辑客户');
        });
        //  
        $detail.on('mouseover', '.upload-imgList>li', function (e) {
            $.EventFn(e);

            var $i = $detail.find('.upload-imgList>i.s-dels3');
            if ($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active').siblings('li').removeClass('active');
            $i.addClass('active').css({'top': ($(this).position().top - 4), 'left': $(this).position().left + 62});
        });
        //  上传图片
        $detail.on('change', '#up-image', function () {
            var obj = $(this).prop('files')[0];
            if (obj) {
                detailObj.uploadFile('img', obj, $('#upload-img'));
            }
        });
        //  上传文件
        $detail.on('change', '#up-files', function () {
            var obj = $(this).prop('files')[0];
            if (obj) {
                detailObj.uploadFile('file', obj, $('#upload-file'));
            }
        });
        //  删除图片
        $detail.on('click', '.upload-imgList>i.s-dels3', function (e) {
            $.EventFn(e);

            var list = $detail.find('.upload-imgList>li');
            for (var i = 0; i < list.length; i++) {
                if (list.eq(i).hasClass('active')) {
                    list.eq(i).remove();
                    $(this).removeClass('active');
                    break;
                }
            }
        });
        //  删除文件
        $detail.on('click', '.list-file>li>.s-dels3', function (e) {
            $.EventFn(e);

            var $li = $(this).parent();
            $li.remove();
            if ($detail.find('.list-file>li').length == 0) {
                $detail.find('.list-file').remove();
            }
        });
        //  切换卡片
        $detail.on('click', '.box-quick-menu>li', function (e) {
            $.EventFn(e);
            var _index = $(this).index(),
                $val = $detail.find('#box-follow');
            if ($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active').siblings('li').removeClass('active');
            $detail.find('.quick-input').removeClass('active');
            if ($val.val()) {
                $val.val('');
            }
            if(_index==0) {//写跟进
                $detail.find('.btn-sign').addClass('active');
                $detail.find('.box-selects').removeClass('active');
                $detail.find('.box-selects2').addClass('active');
                $(".box-selects2").show();
            }else if (_index == 1) {//写任务
                $detail.find('.btn-sign').removeClass('active');
                $detail.find('.list-file').remove();
                $detail.find('.box-selects').addClass('active');
                $detail.find('.box-selects2').removeClass('active');
                $detail.find('#task-remind').attr('data-id', 5).text('5分钟后');
                $detail.find('#task-remind').next('ul').children('li:first').addClass('active').siblings('li').removeClass('active');
                $(".box-selects2").hide();
                $(".selects4").show();
            } else if(_index==2){//写邮件
                $(".box-selects2").show();
                $(".selects4").hide();
                var emailAddr = $('.cust-email').text();
                maintab.showTab(Base.url + '/html/pop-email-new.html?name=' + emailAddr +"&showType=right&v=" + window.ver, '新建邮件');
            }
            $detail.find('.quick-input').attr('data-type', $(this).index());
        });
        //  取消
        $detail.on('click', '.btn-decision>a', function (e) {
            $.EventFn(e);
            $('#box-follow').parent('div').removeClass('active');
            $detail.find('#box-follow').val('');
        });
        //  发布
        $detail.on('click', '.btn-publish', function (e) {
            $.EventFn(e);
            var data = {customerId: custId},
                type = parseInt($detail.find('.quick-input').attr('data-type')),
                $content = $detail.find('#box-follow'),
                $fli = $detail.find('.list-file>li'),
                tmp = [];
            if ($content.val() == null || $.trim($content.val()) == '') {
                $content.attr('placeholder', '请输入需发布的内容');
                $.Alert('发布内容不能为空');
                return false;
            }
            if (type) {
                data.name = '快速创建任务';
                data.description = $content.val();
                data.customerName = $detail.find('.cust-name').text();
                data.remindTime = $detail.find('#task-remind').attr('data-id');
                data.executionTimeType = 1;
                var curr = new Date();
                data.executionTime = $.dateObj(curr.getTime() + 24 * 60 * 60 * 1000)._getDatetime();
            } else {
                for (var i = 0; i < $fli.length; i++) {
                    tmp.push({attachmentType: parseInt($fli.eq(i).attr('data-type')), attachment: $fli.eq(i).attr('data-url'), attachmentName: $fli.eq(i).children('span').text()});
                }
                data.paramType = 0;
                var custContId = $('#customerContacts').attr('data-id');
                data.customerContactsId = custContId!=''?custContId:0;

                var followTime = $('.fllow-time-check input').val();
                if(followTime!=''){
                    data.followTimeString = followTime;
                }

                data.attachments = tmp;
                data.content = $content.val();
            }
            detailObj.saveFollowOrTask(data, type);
            data = {}, type = null;
        });
        //  输入内容
        $detail.on('click', '#box-follow', function (e) {
            $.EventFn(e);

            var $input = $detail.find('.quick-input');
            if ($input.hasClass('active')) {
                return false;
            }
            $input.addClass('active');
        });
        //  
        $detail.on('click', '.model-select', function (e) {
            $.EventFn(e);
            $(this).children('ul').toggleClass('active');
        });

        //  提醒时间
        $detail.on('click', '.model-select>ul>li', function (e) {
            $.EventFn(e);
            var $ul = $(this).parent().removeClass('active');
            $ul.prev('label').text($(this).text()).attr('data-id', $(this).attr('data-id'));
            $(this).addClass('active').siblings().removeClass('active');
        });
        //  开启面板
        $detail.on('click', '.show-models', function (e) {
            $.EventFn(e);

            var type = $(this).attr('data-type'),
                selector = '.show-' + type;
            if ($(selector).hasClass('active')) {
                return false;
            }
            $detail.find('.models2').removeClass('active');
            $detail.find(selector).addClass('active');
        });
        //  关闭面板
        $detail.on('click', '.models2-top>.s-dels6', function (e) {
            $.EventFn(e);

            $detail.find('.models2').removeClass('active');
        });

        //  添加联系人
        $detail.on('click', '.add-contact', function (e) {
            $.EventFn(e);
            var index = $('#mainTab', parent.document).find('.currentClass').index();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?custId=' + custId + '&type=customer&index=' + index + "&v=" + window.ver, '添加联系人');
        });
        //详情页点击添加联系人
        $detail.on("click","#add_contacts",function(e){
            $.EventFn(e);
            var index = $('#mainTab', parent.document).find('.currentClass').index();
            maintab.showTab(Base.url + '/html/pop-contacts-add.html?custId=' + custId + '&type=customer&index=' + index + "&v=" + window.ver, '添加联系人');
        })
        //删除联系人
        $detail.on('click', '.list-concat>li>p>span>.s-dels3', function (e) {
            $.EventFn(e);

            var $li = $(this).closest('li'),
                data = {setType: 'delete', type: 'contact'};
            data.ids = $li.attr('data-id');
            detailObj.setCustomerInfo(data, $li);
        });
        //查看联系人详情
        $detail.on('click', '.list-concat>li>p>span', function (e) {
            $.EventFn(e);
            var contId = $(this).closest('li').attr('data-id');
            maintab.addTab(Base.url + '/html/pop-relation-detail.html?id=' + contId + "&v=" + window.ver, '联系人详情');
        });

        $detail.on('click', '.list-concat>li>p>.s-mail2', function (e) {
            $.EventFn(e);
            var name = $(this).parents('li').find('.concat-mail').text();
            maintab.showTab(Base.url + '/html/pop-email-new.html?name=' + name + "&showType=right&v=" + window.ver, '新建邮件');
        });
        //  编辑联系人
        $detail.on('click', '.list-concat>li>p>.concat-mail,.list-concat>li>p>.s-edit2', function (e) {
            $.EventFn(e);
            var $mail, $edit, data = {setType: 'editMail', type: 'contact'};
            if ($(this).hasClass('concat-mail')) {
                $mail = $(this);
                $edit = $(this).next('.edit-mail');
            } else {
                $mail = $(this).prevAll('.concat-mail');
                $edit = $(this).prev('.edit-mail');
            }
            if ($mail.hasClass('active')) {
                $detail.find('.concat-mail').addClass('active').next('.edit-mail').removeClass('active');
                $mail.removeClass('active').next('.edit-mail').addClass('active');
                $edit.focus();
            } else {
                $mail.addClass('active').next('.edit-mail').removeClass('active');
                data.id = parseInt($(this).closest('li').attr('data-id'));
                data.email = $(this).prev('.edit-mail').val();
                detailObj.setCustomerInfo(data, $(this).closest('li'));
            }
        });
        //  编辑概览
        $detail.on('click', '.edit-overview', function (e) {
            $.EventFn(e);
            var $view = $detail.find('.info-overview'),
                $show = $detail.find('.overview-show'),
                $select = $detail.find('#overview-source,#overview-type,#overview-group'),
                data = {};

            if ($show.hasClass('active')) {
                $show.removeClass('active');
                $select.removeClass('active');
                data.id = custId;
                data.setType = 'editOverview';
                data.customerGroupId = $detail.find('#overview-group').val();
                data.customerType = $detail.find('#overview-type').val();
                data.customerSource = $detail.find('#overview-source').val();
                detailObj.setCustomerInfo(data);
            } else {
                $show.addClass('active');
                $select.addClass('active');
            }
        });
        //添加标签
        $detail.on('click', '#tagsModal ul li', function () {
            var $this = $(this);
            var val = $(this).attr("data-value");
            var data = {
                ids: custId,
                tagId: val,
                setType: 'tag'
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

                    $("#tagsModal").removeClass("active");
                    var tagLi = '<li data-id="' + $this.attr('data-value') + '"><span>' + $this.attr('title') + '</span><i class="s-updownBg s-dels3"></i></li>';
                    if ($('.list-label').children('li').length == 0) {
                        $('.list-label').empty();
                    }
                    $('.list-label').append(tagLi);
                }
            });
        });

        //  添加标签(跟进人)
        $detail.on('click', '.models2-content .set-btn', function (e) {
            $.EventFn(e);
            var $content = $(this).parent().children('input'),
                list = $(this).prev('.list-follower'),
                flag = $.errorsFn($content, '请输入内容'),
                data = {};
            if (flag && ($content.length > 0)) {//添加标签的功能没用咯
                if ($(this).hasClass('add-contact')) {
                } else if ($(this).hasClass('add-label')) {
                    data.setType = 'addTag';
                    data.tagName = $content.val();
                    if ($content.val().length > 255) {
                        $.Alert('标签内容不得超出255个字');
                        return false;
                    }
                    data.id = custId;
                    detailObj.setCustomerInfo(data);
                }
            } else if (list.length > 0) {
                data.ids = custId;
                data.setType = 'addFollower';
                data.userId = $detail.find('.list-follower>li.active').attr('data-id');
                data.name = $detail.find('.list-follower>li.active').text();
                detailObj.setCustomerInfo(data);
            }
        });
        //  选择跟进人
        $detail.on('click', '.list-follower>li', function (e) {
            $.EventFn(e);

            if ($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active').siblings('li').removeClass('active');
        });
        //  删除标签(跟进人)
        $detail.on('click', '.list-label>li>i,.list-follow>li>span>i', function (e) {
            $.EventFn(e);
            var $li = $(this).parent(),
                data = {},
                obj;
            if ($li.parent().hasClass('list-label')) {
                obj = $li;
                data = {id: parseInt(obj.attr('data-id')), setType: 'delTag'};
            } else {
                obj = $li.parent();
                data = {followUpUserId: parseInt(obj.attr('data-id')), setType: 'delFollower'};
            }
            detailObj.setCustomerInfo(data, obj);
            id = null, data = null, obj = null;
        });
        //  取消跟进
        $detail.on('click', '.cancel-follow', function (e) {
            var data = {ids: custId, setType: 'unFollow'};
            detailObj.setCustomerInfo(data, null);
        });
        //  下载
        $detail.on('click', '.upload-filelist>li>label>a,.doc-download', function (e) {
            $.EventFn(e);
            var type = $(this).attr('data-type'),
                _name = $(this).attr('data-name'),
                _val = $(this).attr('data-url'),
                $li = $(this).closest('li');
            if (type == 0) {
                var data = {name: _name, value: _val};
                detailObj.getFile(data);
            } else {
                detailObj.delFollowFile($li.attr('data-id'), $li);
            }
        });

        //  卡片切换
        $detail.on('click', '.tabs-menu>li', function (e) {
            $.EventFn(e);

            if ($(this).hasClass('active')) {
                return false;
            }
            var type = $(this).attr('data-type'),
            selector = '.tabs-' + type;
            $(this).addClass('active').siblings('li').removeClass('active');
            $(selector).addClass('active').siblings('.box-tab').removeClass('active');

            detailObj.timeObj.currentPage = 1;
            detailObj.followObj.currentPage = 1;
            detailObj.page.currentPage = 1;
            detailObj.fileObj.currentPage = 1;

            $('.page').addClass('active');
            if (type == 'follow') {
                detailObj.getCustomerRelationsList(detailObj.followObj, 'follow');
            } else if (type == 'email') {
                detailObj.getCustomerRelationsList(detailObj.page, 'email');
            } else if (type == 'edm') {
                detailObj.getCustomerRelationsList(detailObj.page, 'edm');
            } else if (type == 'quotation') {
                detailObj.getCustomerRelationsList(detailObj.page, 'quotation');
            } else if (type == 'pi') {
                detailObj.getCustomerRelationsList(detailObj.page, 'pi');
            } else if (type == 'order') {
                detailObj.getCustomerRelationsList(detailObj.page, 'order');
            } else if (type == 'task') {
                detailObj.getCustomerRelationsList(detailObj.page, 'task');
            } else if (type == 'timeline') {
                detailObj.getCustomerRelationsList(detailObj.timeObj, 'timeline');
            } else if (type == 'file') {
                detailObj.getCustomerRelationsList(detailObj.fileObj, 'file');
            }
        });

        //  基本资料切换
        $detail.on('click', '.info-tab>li', function (e) {
            $.EventFn(e);

            if ($(this).hasClass('active')) {
                return false;
            }
            $(this).addClass('active').siblings('li').removeClass('active');
        });

        //  新建系列
        $detail.on('click', '.tab-top>a,.trNone>a', function (e) {
            $.EventFn(e);

            var type = $(this).attr('data-type');
            var pIdx = parent.me.tabIdx();

            if (type == 'email') {
                var emailAddr = $('.cust-email').text();
                maintab.showTab(Base.url + '/html/pop-email-new.html' + "?name="+ emailAddr +"&showType=right&v=" + window.ver, '新建邮件');
            } else if (type == 'edm') {
                maintab.showTab(Base.url + '/html/pop-letter-new.html' + "?&v=" + window.ver, '新建营销信');
            } else if (type == 'quotation') {
                maintab.showTab(Base.url + '/html/pop-quotation-add.html?custId=' + custId + '&pIdx=' + pIdx + "&v=" + window.ver, '新建报价单');
            } else if (type == 'pi') {
                maintab.showTab(Base.url + '/html/pop-pi-add.html?custId=' + custId + '&pIdx=' + pIdx + "&v=" + window.ver, '新建PI');
            } else if (type == 'order') {
                maintab.showTab(Base.url + '/html/pop-order-add.html?custId=' + custId + '&pIdx=' + pIdx + "&v=" + window.ver, '新建订单');
            } else if (type == 'task') {
                maintab.showTab(Base.url + '/html/pop-task.html?custId=' + custId + '&custName=' + custName + '&pIdx=' + pIdx + "&v=" + window.ver, '新建任务');
            } else if (type == 'upload') {
                maintab.showTab(Base.url + '/html/pop-upload-file.html?custId=' + custId + "&v=" + window.ver, '上传文档');
            } else if (type == 'follow') {
                maintab.showTab(Base.url + '/html/pop-upload.html?id=' + custId + '&pIdx=' + pIdx + "&v=" + window.ver, '新建跟进');
            } else {
                maintab.showTab(Base.url + '/html/pop-upload.html?id=' + custId + '&pIdx=' + pIdx + "&v=" + window.ver, '新建跟进');
            }
        });

        //  卡片详情
        $detail.on('click', '.tab-content', function (e) {
            $.EventFn(e);

            var id = $(this).attr('data-id'),
                $sign = $(this).closest('.box-tab'),
                _type = $(this).attr('data-type');
            if ($sign.hasClass('tabs-email')) {
                var eType = $(this).attr('data-etype');
                if (eType == '2') {
                    maintab.showTab(Base.url + '/html/pop-email-detailOut.html?id=' + id + '&uri=/api/email/outbox/v1/detail' + "&v=" + window.ver, '邮件详情');
                } else {
                    maintab.showTab(Base.url + '/html/pop-email-detail.html?id=' + id + '&uri=/api/email/inbox/v1/detail' + "&v=" + window.ver, '邮件详情');
                }
            } else if ($sign.hasClass('tabs-quotation')) {
                maintab.showTab(Base.url + '/html/pop-quotation-detail.html?id=' + id + "&v=" + window.ver, '报价单详情');
            } else if ($sign.hasClass('tabs-pi')) {
                maintab.showTab(Base.url + '/html/pop-pi-detail.html?id=' + id + "&v=" + window.ver, 'pi详情');
            } else if ($sign.hasClass('tabs-order')) {
                maintab.showTab(Base.url + '/html/pop-order-detail.html?id=' + id + "&v=" + window.ver, '订单详情');
            } else if ($sign.hasClass('tabs-edm')) {
                maintab.showTab(Base.url + '/html/pop-letter-detail.html?id=' + id + "&v=" + window.ver, '营销信详情');
            } else if ($sign.hasClass('tabs-task')) {
                maintab.showTab(Base.url + '/html/pop-detail.html?taskId=' + id + "&v=" + window.ver, '任务详情');
            } else if ($sign.hasClass('tabs-time')) {
                if (_type.length > 0) {
                    if (_type == 'email') {
                        maintab.showTab(Base.url + '/html/pop-email-detail.html?id=' + id + '&uri=/api/email/inbox/v1/detail' + "&v=" + window.ver, '邮件详情');
                    } else if (_type == 'quotation') {
                        maintab.showTab(Base.url + '/html/pop-quotation-detail.html?id=' + id + "&v=" + window.ver, '报价单详情');
                    } else if (_type == 'pi') {
                        maintab.showTab(Base.url + '/html/pop-pi-detail.html?id=' + id + "&v=" + window.ver, 'pi详情');
                    } else if (_type == 'order') {
                        maintab.showTab(Base.url + '/html/pop-order-detail.html?id=' + id + "&v=" + window.ver, '订单详情');
                    } else if (_type == 'edm') {
                        maintab.showTab(Base.url + '/html/pop-letter-detail.html?id=' + id + "&v=" + window.ver, '营销信详情');
                    } else if (_type == 'task') {
                        maintab.showTab(Base.url + '/html/pop-detail.html?taskId=' + id + "&v=" + window.ver, '任务详情');
                    }
                }
            }
        });

        $(window).on('click', function (e) {

            if (e.target.closest('.status-items') != $items[0]) {
                $detail.find('.status-items').removeClass('active');
            }

            if (e.target.closest('.s-menus') != $menus[0]) {
                $detail.find('.s-menus').removeClass('active');
            }
        });

        var detailObj = {
            info: {},
            list: {source: [], type: [], group: [], employee: [], status: [], currency: [], area: []},
            data: {followIds: [], contactIds: []},
            page: {customerId: custId, type: 1, id: custId, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage},
            timeObj: {customerId: custId, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage},
            followObj: {customerId: custId, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage, paramType: 0},
            fileObj: {customerId: custId, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage},
            //  新建跟进（任务）
            saveFollowOrTask: function (obj, type) {
                var url = Base.sitUrl + '/api/user/v1/user/followup/save';
                if (type) {
                    url = Base.sitUrl + '/api/task/v1/task/save';
                }
                $.ajax({
                    url: url,
                    type: 'POST',
                    data: {
                        data: JSON.stringify(obj)
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('发布失败，' + res.message);
                            return;
                        }
                        $.Alert('发布成功！');
                        $detail.find('#box-follow').val('');
                        $detail.find('.list-file').remove();
                        $detail.find('.upload-imgList>li').each(function () {
                            $(this).remove();
                        });
                        $detail.find('.quick-input').removeClass('active');
                        if (type) {
                            $detail.find('#task-remind').attr('data-id', 5).text('5分钟后');
                            $detail.find('#task-remind').next('ul').children('li:first').addClass('active').siblings('li').removeClass('active');
                        }
                        $.when(detailObj.getEmployees())
                            .then(detailObj.getUnits('currency'))
                            .then(detailObj.getStatusList())
                            .then(detailObj.getCustomerRelationsList(detailObj.timeObj, 'timeline'));
                    }
                });
            },
            //  设置客户状态
            setCustomerInfo: function (obj, objs) {
                var url = Base.sitUrl + '/api/customer/v1/customer/set';
                if (obj.setType == 'editMail' || obj.setType == 'delete') {
                    if (obj.type == 'contact') {
                        url = Base.sitUrl + '/api/customer/contacts/v1/contacts/set';
                    }
                }
                $.ajax({
                    url: url,
                    data: {
                        data: JSON.stringify(obj)
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('设置失败，' + res.message);
                            return false;
                        }
                        if (obj.setType == 'setStar') {//设置星级
                            var $star = $detail.find('.status-star'),
                                $list = $star.children('i'),
                                num = obj.starLevel,
                                less = 5 - num,
                                html = '<i class="s-updownBg s-star2"></i>';
                            if (num > 0) {
                                for (var i = 1; i < num; i++) {
                                    html += '<i class="s-updownBg s-star2"></i>';
                                }
                                for (var i = 0; i < less; i++) {
                                    html += '<i class="s-updownBg s-unstar2"></i>';
                                }
                            } else {
                                for (var i = 0; i < 4; i++) {
                                    html += '<i class="s-updownBg s-unstar2"></i>';
                                }
                            }
                            $star.empty().append(html);
                            html = null;
                            var $find = $('.s-find', parent.document);
                            if ($find.length > 0) {
                                $find.click();
                            }
                        }
                        else if (obj.setType == 'editOverview') {
                            $detail.find('.o-source').text($detail.find('#overview-source>option:selected').text());
                            $('.cust-source').text($detail.find('#overview-source>option:selected').text());
                            $detail.find('.o-type').text($detail.find('#overview-type>option:selected').text());
                            $('.cust-type').text($detail.find('#overview-type>option:selected').text());
                            $detail.find('.o-group').text($detail.find('#overview-group>option:selected').text());
                        } else if (obj.setType == 'addTag') {
                            var $label = $detail.find('.list-label');
                            $detail.find('.models2').removeClass('active');
                            $detail.find('.models2-content>input').val('');
                            $detail.find('.list-label').append('<li data-id="' + res.data.id + '"><span>' + obj.tagName + '</span><i class="s-updownBg s-dels3"></i></li>');
                            if ($label.children('li').length > 0) {
                                $label.children('span').remove();
                            }
                        } else if (obj.setType == 'delTag') {
                            if (objs.parent().children('li').length <= 1) {
                                objs.parent().prepend('<span>无</span>');
                            }
                            if (objs) {
                                objs.remove();
                            }
                        } else if (obj.setType == 'addFollower') {
                            var html = '<li data-id="' + obj.ids + '" data-user="' + obj.userId + '"><i class="s-updownBg s-users2"></i><span>' + obj.name + '<i class="s-updownBg s-dels3"></i></span></li>',
                                $follow = $detail.find('.list-follow');
                            $detail.find('.list-follow').append(html);
                            $detail.find('.models2').removeClass('active');
                            if ($follow.children('li').length > 0) {
                                $follow.children('span').remove();
                            }
                        } else if (obj.setType == 'editMail') {
                            objs.find('.concat-mail').text(obj.email);
                        } else if (obj.setType == 'delete') {
                            if (obj.type == 'contact') {
                                objs.remove();
                                if ($detail.find('.list-concat>li').length == 0) {
                                    $detail.find('.list-concat').append('无');
                                }
                            } else {
                                $.Alert('删除成功！', '', function () {
                                    parent.location.reload();
                                });
                            }
                        } else if (obj.setType == 'group') {
                            $detail.find('.modals,.s-menus').removeClass('active');
                            $detail.find('.o-group').text(obj.groupName);
                            $detail.find('#overview-group').val(obj.customerGroupId);
                        } else if (obj.setType == 'unFollow' || obj.setType == 'delFollower' || obj.setType == 'allot') {
                            parent.location.reload();
                        } else if (obj.setType == 'setStatus') {
                            parent.location.reload();
                        } else if (obj.setType == 'allot') {
                            //转移成功之后的处理
                        }
                    }
                });
            },
            //  删除跟进附件
            delFollowFile: function (id, obj) {
                $.ajax({
                    url: Base.sitUrl + '/api/user/v1/user/followup/attach/delete',
                    data: {
                        id: id
                    },
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        obj.remove();
                    }
                });
            },
            //  获取国家地区列表
            getAllArea: function (id) {
                $.ajax({
                    url: Base.sitUrl + '/api/sys/v1/sys/countries/get',
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('获取国家地区列表失败，', res.message);
                            return;
                        }

                        var list = res.data;
                        for (var a = 0; a < list.length; a++) {
                            if (list[a].id == id) {
                                $detail.find('.top-title>label>img').attr('src', '../images/country/PNG/' + list[a].id + '.png')
                                $detail.find('.top-title>label>span,.cust-area').text(list[a].cn || '未设置');
                                break;
                            }
                        }
                    }
                });
            },
            //  根据id获取客户详情
            getCustomerById: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/v1/customer/detail',
                    data: {
                        data: JSON.stringify({id: custId})
                    },
                    type: 'POST',
                    async: false,
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('获取客户详情失败，' + res.message);
                            return;
                        }
                        var obj = res.data,
                            slist = detailObj.list.source,
                            glist = detailObj.list.group,
                            tlist = detailObj.list.type,
                            elist = detailObj.list.employee,
                            stlist = detailObj.list.status,
                            arealist = detailObj.list.area,
                            starHTML = '',
                            tagHTML = '',
                            contactHTML = '',
                            fllowContact = '',
                            followHTML = '';
                        if (obj.highSeas == 1) {//公海客户
                            $('.s-menus li:last-child').remove();
                        }
                        var taglist = obj.customerTags && obj.customerTags.length > 0 ? obj.customerTags : [],
                            contactlist = obj.contacts,
                            followlist = obj.followUpUsers,
                            $span = $detail.find('.top-title>span');
                        detailObj.info = obj;
                        var contacts=res.data.contacts;
                        var list_info='';
                        var starLevel='';
                        for(var a=0;a<contacts.length;a++){
                            starLevel=contacts[a].starLevel;
                            var starlist='';
                            if (starLevel > 0 && starLevel <= 5) {
                                for (var s = 0; s < starLevel; s++) {
                                    starlist += '<i class="s-updownBg s-star2"></i>';
                                }
                                var un_star = 5 -starLevel;
                                for (var us = 0; us < un_star; us++) {
                                    starlist += '<i class="s-updownBg s-unstar2"></i>';
                                }
                            }
                        list_info+='<div class="info-content info-style con_info">'+
                                '<p class="info-caption">联系人</p>'+
                                '<table class="info-table">'+
                                '<tbody>'+
                                '<tr>'+
                                '<td>姓名：</td>'+
                            '<td class="con-name">'+
                                testNull(contacts[a].name)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>公司名称：</td>'+
                            '<td class="con-com_name">'+
                                testNull(contacts[a].workingCompany)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>职位：</td>'+
                            '<td class="con-position">'+
                                testNull(contacts[a].position)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>国家：</td>'+
                            '<td class="con-country">'+
                                testNull(contacts[a].countriesName)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>邮箱：</td>'+
                            '<td class="con-email">'+
                                testNull(contacts[a].email)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>星级</td>'+
                                '<td class="con-star" id="con-stars"'+a+'>'+starlist+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>生日</td>'+
                                '<td class="con-date">'+
                                testNull(contacts[a].birthday)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>联系电话：</td>'+
                            '<td class="con-phone">'+
                                 testNull(contacts[a].phone)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>FaceBook：</td>'+
                            '<td class="con-facebook">'+
                                 testNull(contacts[a].facebook)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>Twitter：</td>'+
                            '<td class="con-twitter">'+
                                 testNull(contacts[a].twitter)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>Linkedin：</td>'+
                            '<td class="con-linkedin">'+
                                testNull(contacts[a].linkedin)+
                                '</td>'+
                                '</tr>'+
                                '<tr>'+
                                '<td>备注：</td>'+
                            '<td class="con-remark">'+
                                testNull(contacts[a].remark)+
                                '</td>'+
                                '</tr>'+
                                '</tbody>'+
                                '</table>'+
                                '</div>'
                        }
                        $("#con-content").empty();
                        $("#con-content").append(list_info);
                        $detail.find('.cust-name').text(obj.name);
                        $detail.find('.cust-email').text(obj.defaultEmail || '');
                        $detail.find('.cust-phone').text(obj.phone || '');
                        $detail.find('.cust-fax').text(obj.faxes || '');
                        $detail.find('.cust-facebook').text(obj.facebook || '');
                        $detail.find('.cust-twitter').text(obj.twitter || '');
                        $detail.find('.cust-linkedin').text(obj.linkedin || '');
                        $detail.find('.cust-address').text(obj.address || '');
                        $detail.find('.cust-homepage').text(obj.homepage || '');
                        $detail.find('.cust-mainProducts').text(obj.mainProducts || '');
                        $detail.find('.cust-remark').text(obj.remark || '');
                        //自定义属性展示
                        var getDefineds = obj.customerDefinedValues;
                        var definedCont = $detail.find('#info-content .info-table tbody');
                        for (var i = 0; i < getDefineds.length; i++) {
                            var html = '<tr><td>' + getDefineds[i].name + '</td><td>' + getDefineds[i].value + '</td></tr>';
                            definedCont.append(html);
                        }
                        if (obj.countriesName == '' || obj.countriesName == null) {
                            $detail.find('.top-title>label').remove();
                        } else {
                            detailObj.getAllArea(obj.countries);
                        }
                        detailObj.getDropdownContent('source', $detail.find('#overview-source'), obj.customerSource);
                        detailObj.getDropdownContent('type', $detail.find('#overview-type'), obj.customerType);
                        detailObj.getDropdownContent('group', $detail.find('#overview-group'), obj.customerGroupId);


                        $detail.find('.overview-time').text(obj.createTime || '');
                        var _name = obj.name || '';
                        var _num=obj.customerNo;
                        if (_name.length > 80) {
                            _name = _name.slice(_name.length / 2) + '...' + _name.slice(-(_name.length / 8));
                        }
                        $("#titleName").text(_name);
                        titleName = _name;
                        $("#title_num").text("【"+_num+"】");

                        for (var st = 0; st < stlist.length; st++) {
                            if (stlist[st].id == obj.status) {
                                var _sName = stlist[st].name;
                                _sName = _sName.substr(0, 1);
                                $detail.find('.status-current').empty();
                                $detail.find('.status-current').append('<label style="background-color: ' + stlist[st].colour + ';" data-id="' + stlist[st].id + '">' + _sName + '</label><span><i class="s-updownBg s-up"></i></span>');
                                break;
                            }
                        }

                        if (obj.starLevel > 0 && obj.starLevel <= 5) {
                            for (var s = 0; s < obj.starLevel; s++) {
                                starHTML += '<i class="s-updownBg s-star2"></i>';
                            }
                            var unStar = 5 - obj.starLevel;
                            for (var us = 0; us < unStar; us++) {
                                starHTML += '<i class="s-updownBg s-unstar2"></i>';
                            }
                            $detail.find('.status-star').empty().append(starHTML);
                        } else if (obj.starLevel > 5) {
                            for (var s = 0; s < 6; s++) {
                                starHTML += '<i class="s-updownBg s-star2"></i>';
                            }
                            $detail.find('.status-star').empty().append(starHTML);
                        }
                        if (taglist.length > 0) {
                            for (var _tag = 0; _tag < taglist.length; _tag++) {
                                tagHTML += '<li data-id="' + taglist[_tag].id + '"><span>' + taglist[_tag].tagName + '</span><i class="s-updownBg s-dels3"></i></li>';
                            }
                        } else {
                            tagHTML = '<span>无</span>';
                        }
                        $detail.find('.list-label').empty();
                        $detail.find('.list-label').append(tagHTML);
                        if (contactlist.length > 0) {
                            for (var c = 0; c < contactlist.length; c++) {
                                var clist = contactlist[c];
                                contactHTML += '<li data-id="' + clist.id + '">\
                                                    <p><i class="s-updownBg s-users2"></i><span>' + clist.name + '<i class="s-updownBg s-dels3"></i></span><i class="s-updownBg s-mail2"></i></p>\
                                                    <p><i class="s-updownBg s-mail"></i><label>邮箱：</label><span class="concat-mail active">' + (clist.email || '') + '</span><input type="text" class="edit-mail" value="' + (clist.email || '') + '"><i class="s-updownBg s-edit2"></i></p>\
                                                </li>';
                                fllowContact += '<li data-id="'+ clist.id +'">'+ clist.name +'</li>';
                            }
                        } else {
                            contactHTML = '<span>无</span>';
                            fllowContact = '<li>无</li>';
                        }
                        $detail.find('.contact-num').text(contactlist.length);
                        $detail.find('.list-concat').empty().append(contactHTML);
                        $('#custContList').empty().append(fllowContact);
                        if (followlist && followlist.length > 0) {
                            for (var f = 0; f < followlist.length; f++) {
                                var _name = followlist[f].userName || '匿名',
                                    _dels = '';
                                for (var n = 0; n < elist.length; n++) {
                                    if (elist[n].id == followlist[f].userId) {
                                        //_name = elist[n].name;
                                        $detail.find('.list-follower>li').eq(n).remove();
                                        break;
                                    }
                                }
                                if (followlist[f].delFlag > 0) {
                                    _dels = '<i class="s-updownBg s-dels3"></i>';
                                }
                                followHTML += '<li data-id="' + followlist[f].id + '" data-user="' + followlist[f].userId + '">\
                                                    <i class="s-updownBg s-users2"></i>\
                                                    <span>' + _name + '' + _dels + '</span>\
                                                </li>';
                            }
                        } else {
                            followHTML = '<span>无</span>';
                        }
                        $detail.find('.list-follow').empty();
                        $detail.find('.list-follow').append(followHTML);

                        for (var s in obj.statics) {
                            var _selector = '.' + s;
                            var str = obj.statics[s];
                            if(str>=10000){
                                str = '9999+';
                            }
                            $(_selector).text(str);
                        }
                    }
                });
            },

            // 获取标签列表
            getTagsList: function () {
                var dataType = {};
                $.ajax({
                    url: Base.sitUrl + '/api/user/v1/user/tag/list',
                    data: {
                        tagType: 1
                    },
                    success: function (data) {
                        //console.log(data);
                        var obj = data.data;
                        var tagsList = '';
                        for (var i = 0; i < obj.length; i++) {
                            tagsList += '<li data-value="' + obj[i].id + '" title="' + obj[i].name + '">' + obj[i].name + '</li>'
                        }
                        $("#tagsModal").find("ul").empty();
                        $("#tagsModal").find("ul").append(tagsList);
                    }
                })
            },

            //获取云文档文件夹
            getCloudNode: function () {
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/disk/v1/folder/list/all",
                    dataType: "json",
                    data: {
                        data: JSON.stringify({view: '0'})
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        var data = result.data;
                        var dataJson = new Array();
                        for (var i = 0; i < data.length; i++) {
                            if (data[i].type == 0) {
                                dataJson.push(data[i])
                            }
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
                        for (var i = 0; i < dataJson.length; i++) {
                            zNodes[i] = {
                                id: dataJson[i].id,
                                pId: dataJson[i].pid,
                                name: dataJson[i].name
                            }
                        }
                        $.fn.zTree.init($("#treeCloud"), setting, zNodes);
                    }
                });
            },

            //  客户详情-相关联列表
            getCustomerRelationsList: function (obj, type) {
                var url = Base.sitUrl, data = {data: JSON.stringify(obj)};
                if (type == 'follow') {
                    url += '/api/user/v1/user/followup/list/page';
                    data = obj;
                } else if (type == 'email') {
                    url += '/api/customer/v1/detail/emails';
                } else if (type == 'edm') {
                    url += '/api/customer/v1/detail/edms';
                } else if (type == 'task') {
                    data = obj;
                    url += '/api/task/v1/task/timeline/list';
                } else if (type == 'quotation') {
                    data = obj;
                    url += '/api/quotation/v1/quotation/timeline/list';
                } else if (type == 'pi') {
                    data = obj;
                    url += '/api/pi/v1/pi/timeline/list';
                } else if (type == 'order') {
                    data = obj;
                    url += '/api/order/v1/order/timeline/list';
                } else if (type == 'timeline') {
                    data = obj;
                    url += '/api/user/v1/user/timeline/list';
                } else if (type == 'file') {
                    url += '/api/user/v1/document/list/page';
                }
                $.ajax({
                    url: url,
                    data: data,
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }

                        var list = res.data.results,
                            unit = detailObj.list.currency,
                            html = '',typeText = '',imgName='empty-doc.png';
                        if (type == 'follow') {
                            $('.followCount').text(res.data.totalItem);
                            typeText ='跟进';
                            imgName='empty-fllow.png';
                            if(list.length>0){
                                for (var i = 0; i < list.length; i++) {
                                    var _content = list[i].content,
                                        _time = list[i].createTime,
                                        _name = list[i].createUserName || '匿名',
                                        files = list[i].attachments,
                                        imgList = '', fileList = '';

                                    if (files.length > 0) {
                                        for (var f = 0; f < files.length; f++) {
                                            var _fname = files[f].attachmentName,
                                                _url = 'http://' + files[f].attachment;
                                            if (files[f].attachmentType == 1) {
                                                fileList += '<li data-id="' + files[f].id + '">\
                                                        <label><i class="s-updownBg s-link4"></i><span>' + _fname + '</span></label>\
                                                        <label>\
                                                            <a href="javascript:;" data-url="' + _url + '" data-name="' + _fname + '" download data-type="0">下载</a>\
                                                            <span>|</span>\
                                                            <a href="javascript:;" data-type="1">删除</a>\
                                                        </label>\
                                                    </li>';
                                            } else {
                                                imgList += '<li><img src="' + _url + '" alt="图片"></li>';
                                            }
                                        }
                                        fileList = '<ul class="upload-filelist">' + fileList + '</ul>';
                                        imgList = '<ul class="upload-imglist">' + imgList + '</ul>';
                                    }
                                    html += '<div class="tab-content" data-id="' + list[i].id + '">\
                                            <label class="tab-sign"><i class="s-menuBg s-menu16"></i></label>\
                                            <div class="tab-style">\
                                                <div class="style-title"><span>' + _time + '</span><span>' + _name + '</span><span>创建了跟进</span></div>\
                                                <div class="style-content">\
                                                    <div class="follow-style">\
                                                        <p>' + _content + '</p>' + imgList + '<div class="clear"></div>' + fileList + '\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="clear"></div>\
                                        </div>';
                                }
                            }
                        } 
                        else if (type == 'email') {
                            typeText ='邮件';
                            imgName='empty-email.png';
                            var _emailType = '<i class="s-updownBg s-left2"></i>',
                                _content = '', _subject = '';
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].emailType == 2) {
                                    _emailType = '<i class="s-updownBg s-left3"></i>';
                                } else {
                                    _emailType = '<i class="s-updownBg s-left2"></i>';
                                }
                                _content = $.trim(list[i].content);
                                _subject = list[i].subject;
                                if (_content.length == 0) {
                                    _content = '（无内容）';
                                }
                                if (_subject.length == 0) {
                                    _subject = '（无主题）';
                                }
                                if (_subject.length > 30) {
                                    _subject = _subject.slice(0, 30) + '...';
                                }
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="email" data-etype="' + list[i].emailType + '">\
                                            <label class="tab-sign"><i class="s-menuBg s-menu17"></i></label>\
                                            <div class="tab-style">\
                                                <div class="style-title"><span>' + (list[i].sendTime).substring(0,(list[i].sendTime).lastIndexOf('.')) + '</span><span>' + list[i].fromName + '</span><span>给</span><span>' + list[i].toName + '</span><span>发了邮件</span></div>\
                                                <div class="style-content">\
                                                    <div class="email-style">\
                                                        <p><i class="s-updownBg s-dot"></i><span>' + _subject + '</span></p>\
                                                        <p>' + _emailType + '\
                                                            <span>' + _content + '</span>\
                                                        </p>\
                                                        <!--<label>4</label>-->\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="clear"></div>\
                                        </div>';
                            }
                        }
                        else if (type == 'edm') {
                            imgName='empty-edm.png';
                            typeText ='EDM';
                            var _emailType = '<i class="s-updownBg s-left2"></i>',
                                _content = '', _subject = '';
                            list = list;
                            for (var i = 0; i < list.length; i++) {
                                if (list[i].emailType == 2) {
                                    _emailType = '<i class="s-updownBg s-left3"></i>';
                                } else {
                                    _emailType = '<i class="s-updownBg s-left2"></i>';
                                }
                                _content = $.trim(list[i].content);
                                _subject = list[i].subject;
                                /*if(_content.length > 30){
                                 _content = _content.slice(0,30)+'...';
                                 }*/
                                if (_content.length == 0) {
                                    _content = '（无内容）';
                                }
                                if (_subject.length == 0) {
                                    _subject = '（无主题）';
                                }
                                if (_subject.length > 30) {
                                    _subject = _subject.slice(0, 30) + '...';
                                }
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="email">\
                                            <label class="tab-sign"><i class="s-menuBg s-menu17"></i></label>\
                                            <div class="tab-style">\
                                                <div class="style-title"><span>' + list[i].sendTime + '</span><span>' + list[i].fromName + '</span><span>给</span><span>' + list[i].toName + '</span><span>发了邮件</span></div>\
                                                <div class="style-content">\
                                                    <div class="email-style">\
                                                        <p><i class="s-updownBg s-dot"></i><span>' + _subject + '</span></p>\
                                                        <p>' + _emailType + '\
                                                            <span>' + _content + '</span>\
                                                        </p>\
                                                        <!--<label>4</label>-->\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="clear"></div>\
                                        </div>';
                            }
                        }
                        else if (type == 'quotation') {
                            imgName='empty-quo.png';
                            typeText ='报价单';
                            $('.quotationCount').text(res.data.totalItem);
                            for (var i = 0; i < list.length; i++) {
                                var _name = list[i].createUserName,
                                    _content = list[i].name,
                                    _unit = '';
                                /*if(_content.length > 30){
                                 _content = _content.slice(0,30)+'...';
                                 }*/
                                for (var u = 0; u < unit.length; u++) {
                                    if (unit[u].id == list[i].unit) {
                                        _unit = unit[u].value;
                                        break;
                                    }
                                }
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="quotation">\
                                    <label class="tab-sign"><i class="s-menuBg s-menu10"></i></label>\
                                    <div class="tab-style">\
                                        <div class="style-title"><span>' + list[i].createTime + '</span><span>' + _name + '</span><span>创建了报价单</span></div>\
                                        <div class="style-content">\
                                            <div class="quotation-style">\
                                                <label>' + _content + '</label>\
                                                <p>总金额：<span>' + list[i].price + _unit + '</span></p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="clear"></div>\
                                </div>';
                            }
                        }
                        else if (type == 'pi') {
                            imgName='empty-pi.png';
                            typeText ='PI';
                            $('.piCount').text(res.data.totalItem);
                            for (var i = 0; i < list.length; i++) {
                                var _name = list[i].createUserName,
                                    _content = list[i].name,
                                    _unit = '';
                                for (var u = 0; u < unit.length; u++) {
                                    if (unit[u].id == list[i].unit) {
                                        _unit = unit[u].value;
                                        break;
                                    }
                                }
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="pi">\
                                    <label class="tab-sign"><i class="s-menuBg s-menu11"></i></label>\
                                    <div class="tab-style">\
                                        <div class="style-title"><span>' + list[i].createTime + '</span><span>' + _name + '</span><span>创建了PI</span></div>\
                                        <div class="style-content">\
                                            <div class="quotation-style">\
                                                <label>' + _content + '</label>\
                                                <p>总金额：<span>' + list[i].price + _unit + '</span></p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="clear"></div>\
                                </div>';
                            }
                        }
                        else if (type == 'order') {
                            imgName='empty-order.png';
                            typeText ='订单';
                            $('.orderCount').text(res.data.totalItem);
                            for (var i = 0; i < list.length; i++) {
                                var _name = list[i].createUserName,
                                    _content = list[i].name,
                                    _unit = '';
                                for (var u = 0; u < unit.length; u++) {
                                    if (unit[u].id == list[i].unit) {
                                        _unit = unit[u].value;
                                        break;
                                    }
                                }
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="order">\
                                    <label class="tab-sign"><i class="s-menuBg s-menu12"></i></label>\
                                    <div class="tab-style">\
                                        <div class="style-title"><span>' + list[i].createTime + '</span><span>' + _name + '</span><span>创建了订单</span></div>\
                                        <div class="style-content">\
                                            <div class="quotation-style">\
                                                <label>' + _content + '</label>\
                                                <p>总金额：<span>' + list[i].price + _unit + '</span></p>\
                                            </div>\
                                        </div>\
                                    </div>\
                                    <div class="clear"></div>\
                                </div>';
                            }
                        }
                        else if (type == 'task') {
                            imgName='empty-task.png';
                            typeText ='任务';
                            $('.taskCount').text(res.data.totalItem);
                            for (var i = 0; i < list.length; i++) {
                                var sign = '', sign2 = '', _name = list[i].name;
                                if (list[i].status == 2) {
                                    sign = '';
                                    sign2 = '<span class="red">已超时</span>';
                                } else if (list[i].status == 3) {
                                    sign = '<i class="s-updownBg s-end"></i>';
                                    sign2 = '<span class="green">已完成</span>';
                                }
                                if (_name.length > 25) {
                                    _name.substr(0, 20) + '...';
                                }
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="task">\
                                            <label class="tab-sign"><i class="s-menuBg s-menu8"></i></label>\
                                            <div class="tab-style">\
                                                <div class="style-title"><span>' + list[i].createTime + '</span><span>' + (list[i].createUserName || '匿名' ) + '</span><span>创建了任务</span></div>\
                                                <div class="style-content">\
                                                    <div class="task-style">\
                                                        <p>' + sign + sign2 + '\
                                                            <label>' + _name + '</label>\
                                                        </p>\
                                                    </div>\
                                                </div>\
                                            </div>\
                                            <div class="clear"></div>\
                                        </div>';
                            }
                        }
                        else if (type == 'timeline') {
                            for (var i = 0; i < list.length; i++) {
                                var _title = '', _type = '', _titleStyle = '',
                                    _name = list[i].createUserName || '匿名',
                                    _sign = '<i class="s-menuBg s-menu18"></i>',
                                    _content = list[i].content;
                                if (list[i].contentType == 1) {
                                    _title = '创建客户';
                                    _type = 'customer';
                                }
                                else if (list[i].contentType == 2) {
                                    _title = '创建联系人';
                                    _type = 'contact';
                                }
                                else if (list[i].contentType == 3) {
                                    _title = '创建跟进';
                                    _sign = '<i class="s-menuBg s-menu16"></i>';
                                    _type = 'follow';
                                }
                                else if (list[i].contentType == 4) {
                                    _title = '创建报价单';
                                    _sign = '<i class="s-menuBg s-menu10"></i>';
                                    _type = 'quotation';
                                }
                                else if (list[i].contentType == 5) {
                                    _title = '创建PI';
                                    _sign = '<i class="s-menuBg s-menu11"></i>';
                                    _type = 'pi';
                                }
                                else if (list[i].contentType == 6) {
                                    _title = '创建订单';
                                    _sign = '<i class="s-menuBg s-menu12"></i>';
                                    _type = 'order';
                                }
                                else if (list[i].contentType == 7) {
                                    _title = '创建任务';
                                    _sign = '<i class="s-menuBg s-menu8"></i>';
                                    _type = 'task';
                                }
                                else if (list[i].contentType == 8) {
                                    _title = '创建标签';
                                }
                                else if (list[i].contentType == 9) {
                                    _title = '修改客户资料';
                                }
                                else if (list[i].contentType == 10) {
                                    _title = '修改联系人资料';
                                }
                                else if (list[i].contentType == 11) {
                                    _title = '修改了客户状态';
                                }
                                else if (list[i].contentType == 12) {
                                    _title = '修改了报价单';
                                    _sign = '<i class="s-menuBg s-menu10"></i>';
                                    _type = 'follow';
                                }
                                else if (list[i].contentType == 13) {
                                    _title = '修改了PI';
                                    _sign = '<i class="s-menuBg s-menu11"></i>';
                                    _type = 'pi';
                                }
                                else if (list[i].contentType == 14) {
                                    _title = '修改了订单';
                                    _sign = '<i class="s-menuBg s-menu12"></i>';
                                    _type = 'quotation';
                                }
                                else if (list[i].contentType == 15) {
                                    _title = '修改了任务';
                                    _sign = '<i class="s-menuBg s-menu8"></i>';
                                    _type = 'task';
                                }
                                else if (list[i].contentType == 16) {
                                    _title = '修改了客户分组';
                                }
                                else if (list[i].contentType == 17) {
                                    _title = '跟进客户';
                                    _sign = '<i class="s-menuBg s-menu16"></i>';
                                }
                                else if (list[i].contentType == 18) {
                                    _title = '取消跟进客户';
                                    _sign = '<i class="s-menuBg s-menu16"></i>';
                                }
                                else if (list[i].contentType == 19) {
                                    _title = '分享了客户';
                                }
                                else if (list[i].contentType == 20) {
                                    _title = '取消分享客户';
                                }
                                else if (list[i].contentType == 21) {
                                    _title = '转移了客户';
                                }
                                else if (list[i].contentType == 22) {
                                    _title = '发邮件';
                                    _sign = '<i class="s-menuBg s-menu17"></i>';
                                    _type = 'email';
                                }
                                else if (list[i].contentType == 23) {
                                    _title = '发EDM';
                                    _sign = '<i class="s-menuBg s-menu4"></i>';
                                    _type = 'edm';
                                }
                                else if (list[i].contentType == 24) {
                                    _title = '删除了客户';
                                }
                                else if (list[i].contentType == 25) {
                                    _title = '删除了联系人';
                                }
                                else if (list[i].contentType == 26) {
                                    _title = '删除了跟进';
                                    _sign = '<i class="s-menuBg s-menu16"></i>';
                                }
                                else if (list[i].contentType == 27) {
                                    _title = '删除了报价单';
                                    _sign = '<i class="s-menuBg s-menu10"></i>';
                                }
                                else if (list[i].contentType == 28) {
                                    _title = '删除了PI';
                                    _sign = '<i class="s-menuBg s-menu11"></i>';
                                }
                                else if (list[i].contentType == 29) {
                                    _title = '删除订单';
                                    _sign = '<i class="s-menuBg s-menu12"></i>';
                                }
                                _titleStyle = '<div class="style-title"><span>' + list[i].createTime + '</span><span>' + _name + '</span><span>' + _title + '</span></div>';

                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="' + _type + '">\
                                            <label class="tab-sign">' + _sign + '</label>\
                                            <div class="tab-style">' + _titleStyle + '<div class="style-content">' + _content + '</div>\
                                            </div>\
                                            <div class="clear"></div>\
                                        </div>';
                            }
                        }
                        else if (type == 'file') {
                            //imgName='empty-doc.png';
                            typeText ='文档';
                            $('.documentCount').text(res.data.totalItem);
                            for (var i = 0; i < list.length; i++) {
                                var docSource = '<span class="doc-img-local"></span>',
                                    goCloud = '<li class="doc-upload" data-size="'+ list[i].documentSizeOld +'" data-url="'+list[i].documentUrl+'" data-name="'+ list[i].documentName +'">上传到云盘</li>';
                                if(list[i].source == 1){
                                    docSource = '<span class="doc-img-cloud"></span>';
                                    goCloud = ''
                                }
                                html += '<div class="tab-content" data-id="'+ list[i].id +'">\
                                            <label class="tab-sign"><i class="s-menuBg s-menu18"></i></label>\
                                            <div class="tab-style">\
                                                <div class="style-title">\
                                                <span>' + list[i].createTime + '</span><span>' + (list[i].createUserName || '匿名' ) + '</span><span>上传了文档</span>\
                                                <i class="doc-handle"></i>\
                                                <ul class="doc-handle-cont">\
                                                <li class="doc-download" data-url="'+list[i].documentUrl+'" data-name="'+ list[i].documentName +'" download data-type="0">下载</li>'+ goCloud +
                                                '<li class="doc-delete">删除</li>\
                                                </ul>\
                                                </div>\
                                                <div class="style-content">\
                                                    <div class="file-style"><p>'+ docSource +
                                                    '<span>【' + list[i].documentName.substring(list[i].documentName.lastIndexOf('.')+1) + '】</span>\
                                                    <span>' + list[i].documentName.substring(0,list[i].documentName.lastIndexOf('.')) + '</span>\
                                                    <span style="float: right;">' + list[i].documentSize + '</span>\
                                                   </p></div>\
                                                </div>\
                                            </div>\
                                            <div class="clear"></div>\
                                        </div>';
                            }
                        }
                        var selector = '.tabs-' + type + ' .tab-middle .tab-line';
                        $detail.find(selector).nextAll('.tab-content').remove();
                        if(html == ''){
                            $detail.find(selector).nextAll('.trNone').remove();
                            html = '<div class="trNone">' +
                            '<div class="trnone-info" style="margin-top: 11px;">' +
                            '<img src="../images/'+ imgName +'" alt="" />' +
                            '<p class="trnone-text">暂无'+ typeText +'</p>'+
                            '</div>'+
                            '<a href="javascript:;" class="trnone-btn btn btn-primary" data-type="'+ type +'">创建'+ typeText +'</a>'+
                            '</div>';
                        }
                        $detail.find(selector).after(html);
                        html = '';
                        if (type == 'follow') {
                            $detail.find('.tabs-follow .tab-middle img').load(function () {
                                $.cutImage(this, 68, 68);
                            });
                        }
                        var ps = pageObj.pageSize, all = Math.ceil(res.data.totalItem / ps);
                        if (all == 1) {
                            $('.page').addClass('active');
                            return false;
                        }
                        else {
                            $('.page').removeClass('active');
                        }
                        $.Page({
                            total: res.data.totalItem,
                            _class: '.page',
                            nowNum: obj.currentPage,
                            allNum: all,
                            callback: function (now, all) {
                                var obj = detailObj.timeObj;
                                if (type == 'timeline') {
                                    detailObj.timeObj.currentPage = now;
                                    obj = detailObj.timeObj;
                                } else if (type == 'follow') {
                                    detailObj.followObj.currentPage = now;
                                    obj = detailObj.followObj;
                                } else if (type == 'file') {
                                    detailObj.fileObj.currentPage = now;
                                    obj = detailObj.fileObj;
                                } else {
                                    detailObj.page.currentPage = now;
                                    obj = detailObj.page;
                                }
                                detailObj.getCustomerRelationsList(obj, type);
                            }
                        });
                    }
                });
            },
            //  下载文件
            getFile: function (obj) {
                console.log(Base.sitUrl + '/api/file/download?data=' + JSON.stringify(obj));
                $('.doc-handle-cont').hide();
                window.location.href = Base.sitUrl + '/api/file/download?data=' + JSON.stringify(obj);
            },
            //  获取客户概览下拉内容
            getDropdownContent: function (type, obj, id) {
                var url = '', data = {};
                if (type == 'source') {
                    url = Base.sitUrl + '/api/org/v1/org/staff/customer/source/list';
                } else if (type == 'group') {
                    url = Base.sitUrl + '/api/customer/v1/customer/group/list';
                } else if (type == 'type') {
                    url = Base.sitUrl + '/api/sys/v1/sys/dictionary/get';
                    data = {group: 'customer.type'};
                }
                if (url.length > 0) {
                    $.ajax({
                        url: url,
                        data: data,
                        type: 'POST',
                        dataType: 'json',
                        success: function (res) {
                            if (!res.success) {
                                $.unLogin(res);
                                return;
                            }
                            var list = res.data,
                                html = '', html2 = '';
                            if (list.length > 0) {
                                for (var i = 0; i < list.length; i++) {
                                    if (type == 'type') {
                                        //detailObj.list.type.push(list[i]);
                                        html += '<option value="' + list[i].id + '">' + list[i].value + '</option>';
                                        if (list[i].id == id) {
                                            $detail.find('.o-type,.cust-type').text(list[i].value);
                                            $detail.find('#overview-type').val(id);
                                        }
                                    } else {
                                        if (type == 'source') {
                                            if (list[i].id == id) {
                                                $detail.find('.o-source,.cust-source').text(list[i].name);
                                                $detail.find('#overview-source').val(id);
                                            }
                                        } else if (type == 'group') {
                                            if (list[i].id == id) {
                                                $detail.find('.o-group,.cust-group').text(list[i].name);
                                                $detail.find('#overview-group').val(id);
                                            }
                                            html2 += '<li data-id="' + list[i].id + '">' + list[i].name + '</li>';
                                        }
                                        html += '<option value="' + list[i].id + '">' + list[i].name + '</option>';
                                    }
                                }
                                if (type == 'group') {
                                    $detail.find('.u-group>ul').empty();
                                    $detail.find('.u-group>ul').append(html2);
                                }
                                if (obj) {
                                    obj.empty();
                                    obj.append(html);
                                }
                            }
                        }
                    });
                }
            },
            //  获取跟进人
            getEmployees: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/staff/list',
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data,
                            html = '';
                        detailObj.list.employee = list;
                        if (list.length > 0) {
                            for (var i = 0; i < list.length; i++) {
                                var name = list[i].name || '匿名';
                                if (name.length > 13) {
                                    name = name.slice(0, 10) + '...';
                                }
                                html += '<li data-id="' + list[i].id + '">' + name + '</li>';
                            }
                        } else {
                            html = '无';
                        }
                        $transfer.find('.u-transfer>ul').empty().append(html);
                        $detail.find('.list-follower').empty().append(html);
                    }
                });
            },
            //  获取状态
            getStatusList: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/staff/customer/status/list',
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data,
                            html = '';
                        for (var i = 0; i < list.length; i++) {
                            var _name = list[i].name;
                            _name = _name.substr(0, 1);
                            html += '<li><label style="background-color: ' + list[i].colour + ';" data-id="' + list[i].id + '">' + _name + '</label></li>'
                        }
                        detailObj.list.status = list;
                        $detail.find('.status-items').empty();
                        $detail.find('.status-items').append(html);
                        detailObj.getCustomerById();//之前用then写法，并不能保证这个方法执行完了之后再执行这个
                    }
                });
            },
            //  时间轴
            //  获取单位
            getUnits: function (type) {
                $.ajax({
                    url: Base.sitUrl + '/api/sys/v1/sys/dictionary/get',
                    data: {group: type},
                    type: 'POST',
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        var list = res.data;
                        detailObj.list.currency = list;
                    }
                });
            },
            //  上传文件
            uploadFile: function (type, obj, selector) {
                selector.ajaxForm({
                    url: Base.sitUrl + '/api/file/upload',
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    complete: function () {
                        $.UnblockUI();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('上传失败,' + res.message);
                            return;
                        }
                        var url = 'http://' + res.data,
                            $list = $detail.find('.list-file'),
                            $upload = $detail.find('.btns-upload'),
                            html = '', _type = 0, _sign = '<i class="s-updownBg s-link5"></i>';
                        if (type == 'file') {
                            _type = 1;
                            _sign = '<i class="s-updownBg s-link3"></i>'
                        }
                        if ($list.length == 0) {
                            html = '<ul class="list-file">\
                                            <li data-url="' + res.data + '" data-type="' + _type + '">' + _sign + '<span>' + obj.name + '</span>\
                                            <i class="s-updownBg s-dels3"></i>\
                                        </li>\
                                    </ul>';
                            $upload.after(html);
                        } else {
                            html = '<li data-url="' + res.data + '" data-type="' + _type + '">' + _sign + '<span>' + obj.name + '</span>\
                                        <i class="s-updownBg s-dels3"></i>\
                                    </li>';
                            $list.append(html);
                        }
                    }
                }).submit();
                $detail.find('#upload-img,#upload-file')[0].reset();
            }
        };
        //社交
        //社交内容切换
        $('#info-li').bind('click', function () {
            $(this).addClass('active');
            $('#info-content').show();
            $('#info-content').siblings('.tab-content').hide();
            $(this).siblings('li').removeClass('active');
        })
        $('#fb-li').bind('click', function () {
            $(this).addClass('active');
            $('#fb-content').show();
            $('#fb-content').siblings('.tab-content').hide();
            $(this).siblings('li').removeClass('active');
            sameOne(custId, 1);
        })
        $('#tw-li').bind('click', function () {
            $(this).addClass('active');
            $('#tw-content').show();
            $('#tw-content').siblings('.tab-content').hide();
            $(this).siblings('li').removeClass('active');
        })
        $('#lk-li').bind('click', function () {
            $(this).addClass('active');
            $('#lk-content').show();
            $('#lk-content').siblings('.tab-content').hide();
            $(this).siblings('li').removeClass('active');
            sameOne(custId, 3);
        })
        //字段空值
        function testNull(test) {
            if (test == null) {
                return "";
            } else {
                return test;
            }
        }

        //相似人员列表
        function sameList(uri) {
            $.ajax({
                url: Base.sitUrl + uri,
                type: 'POST',
                data: {
                    keyword: titleName
                },
                success: function (res) {
                    var data = res.data;
                    var html = '';
                    if (data.length > 5) {
                        var h = 5
                    } else {
                        var h = data.length
                    }
                    for (var i = 0; i < h; i++) {
                        html += '<div class="the-same-as" data-fb="' + data[i].facebookId + '">\
                                    <img src="../images/user.jpg" alt="头像"/>\
                                    <span>' + data[i].name + '</span>\
                                    <label>\
                                        <i class="s-updownBg s-yes"></i>\
                                        <span>|</span>\
                                        <i class="s-updownBg s-no"></i>\
                                    </label>\
                                </div>';
                    }
                    $('#sameorno').empty();
                    $('#sameorno').append(html);
                }
            })
        }

        //是否已经确认为同一个人
        function sameOne(usreId, type) {
            var data = {
                customerId: usreId,
                type: type
            }
            $.ajax({
                url: Base.sitUrl + '/api/social/customer/info',
                type: 'POST',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        console.log(res.message);
                        return
                    }
                    var data = res.data;
                    if (data !== null && data !== undefined && data !== '') {
                        $('.fb-name').text(testNull(data.name));
                        $('.fb-email').text(testNull(data.email));
                        $('.fb-gender').text(testNull(data.gender));
                        $('.fb-birthday').text(testNull(data.birthday));
                        $('#sameorno').parents('.right-content').hide();
                    } else {
                        if (type == 1) {
                            var uri = '/api/facebook/search'
                        } else if (type == 3) {
                            var uri = '/api/linkedIn/search'
                        }
                        sameList(uri);
                        $('#sameorno').parents('.right-content').show();
                    }
                }
            })
        }

        //确认是同一个人
        function checkPop(userId, socialId, type, check) {
            var data = {
                userId: userId,
                socialId: socialId,
                type: type,
                isCheck: check,
                signType: check
            }
            $.ajax({
                url: Base.sitUrl + '/api/social/is/check',
                type: 'POST',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        console.log(res.message);
                        return
                    }
                    $('.the-same-as').hide();
                    $('.the-same-as').prev('label').hide();
                }
            })
        }

        //点击确认是同一人
        $('.detail-middle-right').on('click', '.s-yes', function () {
            var fbId = $(this).parents('.the-same-as').attr('data-fb');
            checkPop(custId, fbId, 1, 1);
        });
        $.when(detailObj.getEmployees())
            .then(detailObj.getUnits('currency'))
            .then(detailObj.getStatusList())
            .then(detailObj.getCustomerRelationsList(detailObj.timeObj, 'timeline'))
            .then(detailObj.getTagsList())
            .then(detailObj.getCloudNode());
        }])
        angular.bootstrap( document.body , ['All']);
    });
});