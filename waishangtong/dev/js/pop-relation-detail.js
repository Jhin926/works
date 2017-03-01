/* !
 *  用于联系人详情
 */
require([ 'common' ], function () {
    require([  'maintab', 'blockUI', 'jqform', 'ztree','datetimepickerCN'], function (maintab) {
        var rId = $.GetQueryString('id'),
            $detail = $('.box-customer-detail'),
            $menus = $detail.find('.s-menus'),
            $group = $detail.find('#groupsModal'),
            $del = $detail.find('#delsModal'),
            contName = '';
        var titleName, custId, contId;
        maintab.init();
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
        var pageObj = {
            pageSize: $.pageObj ? $.pageObj.pageSize : 8,
            currentPage: $.pageObj ? $.pageObj.currentPage : 8
        };

        $detail.on('click', '.tab-content', function (e) {
            $.EventFn(e);

            var id = $(this).attr('data-id'),
                $sign = $(this).closest('.box-tab'),
                _type = $(this).attr('data-type'),
                userId = $(this).attr('data-userid'),
                curUserId = $(top.document).find('#pageLeftUserName').attr('data-id');
            if ($sign.hasClass('tabs-email')) {
                var eType = $(this).attr('data-etype');
                if (eType == '2') {
                    maintab.showTab(Base.url + '/html/pop-email-detailOut.html?id=' + id + '&uri=/api/email/outbox/v1/detail' + "&v=" + window.ver, '邮件详情');
                } else {
                    maintab.showTab(Base.url + '/html/pop-email-detail.html?id=' + id + '&uri=/api/email/inbox/v1/detail' + "&v=" + window.ver, '邮件详情');
                }
            } else if ($sign.hasClass('tabs-quotation')) {
                //if(userId == curUserId) {
                    maintab.showTab(Base.url + '/html/pop-quotation-detail.html?id=' + id + "&v=" + window.ver, '报价单详情');
                //}
            } else if ($sign.hasClass('tabs-pi')) {
                //if(userId == curUserId){
                    maintab.showTab(Base.url + '/html/pop-pi-detail.html?id=' + id + "&v=" + window.ver, 'pi详情');
                //}
            } else if ($sign.hasClass('tabs-order')) {
                //if(userId == curUserId) {
                    maintab.showTab(Base.url + '/html/pop-order-detail.html?id=' + id + "&v=" + window.ver, '订单详情');
                //}
            } else if ($sign.hasClass('tabs-edm')) {
                maintab.showTab(Base.url + '/html/pop-letter-detail.html?id=' + id + "&v=" + window.ver, '营销信详情');
            } else if ($sign.hasClass('tabs-task')) {
                maintab.showTab(Base.url + '/html/pop-detail.html?taskId=' + id + "&v=" + window.ver, '任务详情');
            } else if ($sign.hasClass('tabs-time')) {
                if (_type.length > 0) {
                    if (_type == 'email') {
                        var eType = $(this).attr('data-etype');
                        if (eType == '2') {
                            maintab.showTab(Base.url + '/html/pop-email-detailOut.html?id=' + id + '&uri=/api/email/outbox/v1/detail' + "&v=" + window.ver, '邮件详情');
                        } else {
                            maintab.showTab(Base.url + '/html/pop-email-detail.html?id=' + id + '&uri=/api/email/inbox/v1/detail' + "&v=" + window.ver, '邮件详情');
                        }
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

        //  设置星级
        $detail.on('click', '.status-star>i', function (e) {
            $.EventFn(e);

            var index = $(this).index() + 1,
                data = {};
            data.id = rId;
            data.starLevel = index;
            data.setType = 'setStar';

            detailObj.setRelationInfo(data);
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
        //  顶部菜单
        $detail.on('click', '.s-menus>li', function (e) {
            $.EventFn(e);

            var index = $(this).index();
            $detail.find('.modals').removeClass('active');
            if (index == 0) {
                maintab.showTab(Base.url + '/html/pop-contacts-add.html?id=' + rId + "&v=" + window.ver, '编辑联系人');
            } else if (index == 1) {
                if ($del.hasClass('active')) {
                    return false;
                }
                $del.addClass('active');
            }
        });
        $detail.on('click','.doc-handle',function(e){
            $.EventFn(e);
            $('.doc-handle-cont').hide();
            $(this).next().show();
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

        $('body').bind('click', function (e) {//点击其他位置分组隐藏
            $.EventFn(e);
            $('.doc-handle-cont').hide();
        });
        //  删除联系人
        $detail.on('click', '#del-ok', function (e) {
            $.EventFn(e);

            detailObj.setRelationInfo({ids: rId, setType: 'delete'});
        });
        //  编辑概览
        $detail.on('click', '.edit-overview', function (e) {
            var $view = $detail.find('.info-overview'),
                $show = $view.find('.overview-show'),
                $input = $view.find('>li>input'),
                data = {};

            if ($show.hasClass('active')) {
                $show.removeClass('active');
                $input.removeClass('active');
                data.id = rId;
                data.setType = 'editOverview';
                data.phone = $detail.find('.overview-phone').val();
                data.email = $detail.find('.overview-email').val();
                detailObj.setRelationInfo(data);
            } else {
                $show.addClass('active');
                $input.addClass('active');
            }
        });
        //  回复邮件
        $detail.on('click', '.info-overview>li>.s-mail2', function (e) {
            $.EventFn(e);
            var emlAddr = $(this).parent().find('.o-email').text();
            maintab.showTab(Base.url + '/html/pop-email-new.html?name=' + emlAddr + '&showType=right&v=' + window.ver, '回复邮件');
        });

        $(window).on('click', function (e) {

            if (e.target.closest('.s-menus') != $menus[0]) {
                $detail.find('.s-menus').removeClass('active');
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
            }else if (_index == 1) {//写任务
                $detail.find('.btn-sign').removeClass('active');
                $detail.find('.list-file').remove();
                $detail.find('.box-selects').addClass('active');
                $detail.find('.box-selects2').removeClass('active');
                $detail.find('#task-remind').attr('data-id', 5).text('5分钟后');
                $detail.find('#task-remind').next('ul').children('li:first').addClass('active').siblings('li').removeClass('active');
            } else if(_index==2){//写邮件
                var emailAddr = $('.o-email').text();
                maintab.showTab(Base.url + '/html/pop-email-new.html' + "?name="+ emailAddr +"&showType=right&v=" + window.ver, '新建邮件');
            }
            $detail.find('.quick-input').attr('data-type', $(this).index());
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
        //  添加标签(跟进人)
        $detail.on('click', '.models2-content .set-btn', function (e) {
            $.EventFn(e);

            var $content = $(this).parent().children('input'),
                list = $(this).prev('.list-follower'),
                flag = $.errorsFn($content, '请输入内容'),
                data = {};
            if (flag && ($content.length > 0)) {
                data.setType = 'addTag';
                data.tagName = $content.val();
                if ($content.val().length > 255) {
                    $.Alert('标签内容不得超出255个字');
                    return false;
                }
                data.id = rId;
                detailObj.setRelationInfo(data);
            } else if (list.length > 0) {
                data.ids = rId;
                data.setType = 'addFollower';
                data.userId = $detail.find('.list-follower>li.active').attr('data-id');
                data.name = $detail.find('.list-follower>li.active').text();
                detailObj.setRelationInfo(data);
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
            detailObj.setRelationInfo(data, obj);
            id = null, data = null, obj = null;
        });
        //  取消跟进
        $detail.on('click', '.cancel-follow', function (e) {
            var data = {ids: rId, setType: 'unFollow'};
            detailObj.setRelationInfo(data, null);
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
        //  
        $detail.on('click', '.model-select', function (e) {
            $.EventFn(e);
            var $ul = $(this).children('ul');
            if ($ul.hasClass('active')) {
                $ul.removeClass('active');
            } else {
                $('.model-select>ul').removeClass('active');
                $ul.addClass('active');
            }
        });
        //  下载
        $detail.on('click', '.upload-filelist>li>label>a, .doc-download', function (e) {
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

        //  提醒时间
        $detail.on('click', '.model-select>ul>li', function (e) {
            $.EventFn(e);
            var $ul = $(this).parent();
            var $label = $ul.prev('label');
            var txt = $(this).text();
            var id = $(this).attr('data-id');
            $label.attr('data-id', id);
            $(this).addClass('active').siblings().removeClass('active');
            $label.text(txt);
            $ul.removeClass('active');
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

            var data = {customerId: custId, customerContactsId: rId},
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
                data.remindTime = $detail.find('#task-remind').attr('data-id');
                data.executionTimeType = 1;
                var curr = new Date();
                data.executionTime = $.dateObj(curr.getTime() + 24 * 60 * 60 * 1000)._getDatetime();
            } else {
                for (var i = 0; i < $fli.length; i++) {
                    tmp.push({attachmentType: parseInt($fli.eq(i).attr('data-type')), attachment: $fli.eq(i).attr('data-url'), attachmentName: $fli.eq(i).children('span').text()});
                }
                data.paramType = 1;
                data.attachments = tmp;
                data.content = $content.val();
            }
            detailObj.saveFollowOrTask(data, type);
            data = {}, type = null;
        });

        //  卡片切换
        $detail.on('click', '.tabs-menu>li', function (e) {
            $.EventFn(e);

            if ($(this).hasClass('active')) {
                return false;
            }
            var /*index = $(this).index(),*/
                type = $(this).attr('data-type'),
                selector = '.tabs-' + type;
            $(this).addClass('active').siblings('li').removeClass('active');
            $(selector).addClass('active').siblings('.box-tab').removeClass('active');

            detailObj.timeObj.currentPage = 1;
            detailObj.followObj.currentPage = 1;
            detailObj.page.currentPage = 1;
            detailObj.fileObj.currentPage = 1;

            $('.page').addClass('active');
            if (type == 'follow') {
                detailObj.getRelationsList(detailObj.followObj, 'follow');
            } else if (type == 'email') {
                detailObj.getRelationsList(detailObj.page, 'email');
            } else if (type == 'edm') {
                detailObj.getRelationsList(detailObj.page, 'edm');
            } else if (type == 'quotation') {
                detailObj.getRelationsList(detailObj.page, 'quotation');
            } else if (type == 'pi') {
                detailObj.getRelationsList(detailObj.page, 'pi');
            } else if (type == 'order') {
                detailObj.getRelationsList(detailObj.page, 'order');
            } else if (type == 'task') {
                detailObj.getRelationsList(detailObj.page, 'task');
            } else if (type == 'timeline') {
                detailObj.getRelationsList(detailObj.timeObj, 'timeline');
            } else if (type == 'file') {
                detailObj.getRelationsList(detailObj.fileObj, 'file');
            }
        });
        //  新建系列
        $detail.on('click', '.tab-top>a,.trNone>a', function (e) {
            $.EventFn(e);

            var type = $(this).attr('data-type');
            var pIdx = parent.me.tabIdx();
            if (type == 'email') {
                maintab.showTab(Base.url + '/html/pop-email-new.html?name=' + $('.o-email').text() + "&showType=right&v=" + window.ver, '新建邮件');
            } else if (type == 'edm') {
                maintab.showTab(Base.url + '/html/pop-letter-new.html' + "?&v=" + window.ver, '新建营销信');
            } else if (type == 'quotation') {
                maintab.showTab(Base.url + '/html/pop-quotation-add.html?custId=' + custId + '&contId=' + pIdx + '&pIdx=' + pIdx + "&v=" + window.ver, '新建报价单');
            } else if (type == 'pi') {
                maintab.showTab(Base.url + '/html/pop-pi-add.html?custId=' + custId + '&contId=' + pIdx + '&pIdx=' + pIdx + "&v=" + window.ver, '新建PI');
            } else if (type == 'order') {
                maintab.showTab(Base.url + '/html/pop-order-add.html?custId=' + custId + '&contId=' + pIdx + '&pIdx=' + pIdx + "&v=" + window.ver, '新建订单');
            } else if (type == 'task') {
                maintab.showTab(Base.url + '/html/pop-task.html?custId=' + custId + '&contId=' + rId + '&contName=' + contName + "&v=" + window.ver, '新建任务');
            } else if (type == 'upload') {
                maintab.showTab(Base.url + '/html/pop-upload-file.html?custId=' + custId + "&contId=" + rId + "&v=" + window.ver, '上传文档');
            } else if (type == 'follow') {
                maintab.showTab(Base.url + '/html/pop-upload-cont.html?id=' + rId + '&pIdx=' + parent.me.tabIdx() + "&v=" + window.ver, '新建跟进');
            } else {
                maintab.showTab(Base.url + '/html/pop-upload-cont.html?id=' + rId + '&pIdx=' + parent.me.tabIdx() + "&v=" + window.ver, '新建跟进');
            }
        });
        //  编辑联系人
        $detail.on('click', '.info-edit', function (e) {
            $.EventFn(e);

            maintab.showTab(Base.url + '/html/pop-contacts-add.html?id=' + rId + "&v=" + window.ver, '编辑联系人');
        });
        var detailObj = {
            page: {contactsId: rId, id: rId, type: 2, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage},
            timeObj: {customerContactsId: rId, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage},
            followObj: {customerContactsId: rId, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage, paramType: 1},
            fileObj: {customerContactsId: rId, pageSize: pageObj.pageSize, currentPage: pageObj.currentPage},
            list: {employee: []},
            info: {},
            //  设置联系人
            setRelationInfo: function (obj, objs) {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/set',
                    type: 'POST',
                    data: {
                        data: JSON.stringify(obj)
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('设置失败，' + res.message);
                            return;
                        }
                        if (obj.setType == 'setStar') {
                            var $star = $detail.find('.status-star'),
                                $list = $star.children('i'),
                                num = obj.starLevel,
                                less = 5 - num,
                                html = '<i class="s-updownBg s-star3"></i>';
                            if (num > 0) {
                                for (var i = 1; i < num; i++) {
                                    html += '<i class="s-updownBg s-star3"></i>';
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
                        } else if (obj.setType == 'editOverview') {
                            $detail.find('.o-phone,.con-phone').text(obj.phone || '');
                            $detail.find('.o-email,.con-email').text(obj.email || '');

                        } else if (obj.setType == 'addTag') {
                            var $label = $detail.find('.list-label');
                            $detail.find('.models2').removeClass('active');
                            $detail.find('.models2-content>input').val('');
                            $detail.find('.list-label').append('<li data-id="' + res.data.id + '"><span>' + obj.tagName + '</span><i class="s-updownBg s-dels3"></i></li>');
                            if ($label.children('li').length > 0) {
                                $label.children('span').remove();
                            }
                        } else if (obj.setType == 'addFollower') {
                            var html = '<li data-id="' + obj.ids + '" data-user="' + obj.userId + '"><i class="s-updownBg s-users2"></i><span>' + obj.name + '<i class="s-updownBg s-dels3"></i></span></li>',
                                $follow = $detail.find('.list-follow');
                            $detail.find('.list-follow').append(html);
                            $detail.find('.models2').removeClass('active');
                            if ($follow.children('li').length > 0) {
                                $follow.children('span').remove();
                            }
                        } else if (obj.setType == 'delTag') {
                            if (objs) {
                                objs.remove();
                            }
                        } else if (obj.setType == 'unFollow' || obj.setType == 'delFollower') {
                            parent.location.reload();
                        }
                    }
                });
            },
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
                        if (type) {
                            $detail.find('#task-remind').attr('data-id', 5).text('5分钟后');
                            $detail.find('#task-remind').next('ul').children('li:first').addClass('active').siblings('li').removeClass('active');
                        }
                        detailObj.getEmployees();
                        detailObj.getRelationInfo();
                        detailObj.getUnits();
                        detailObj.getRelationsList(detailObj.timeObj, 'timeline');
                    }
                });
            },
            //  联系人详情-相关联列表
            getRelationsList: function (obj, type) {
                var url = Base.sitUrl, data = {data: JSON.stringify(obj)};
                if (type == 'follow') {
                    url += '/api/user/v1/user/followup/list/page';
                    data = obj;
                } else if (type == 'email') {
                    url += '/api/customer/contacts/v1/detail/emails';
                } else if (type == 'edm') {
                    url += '/api/customer/contacts/v1/detail/edms';
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
                            for (var i = 0; i < list.length; i++) {
                                var _content = list[i].content,
                                // _time = $.dateObj(list[i].createTime)._getDatetime(),
                                    _time = list[i].createTime,
                                    _name = detailObj.info.name || '匿名',
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
                        else if (type == 'email') {
                            typeText ='邮件';
                            imgName='empty-email.png';
                            $('.emailCount').text(res.data.totalItem);
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
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="email" data-etype="' + list[i].emailType + '">\
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
                        else if (type == 'edm') {
                            imgName='empty-edm.png';
                            typeText ='EDM';
                            $('.edmCount').text(res.data.totalItem);
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
                                var _time = list[i].createTime,
                                    _name = list[i].createUserName,
                                    _content = list[i].name,
                                    _unit = '';
                                for (var u = 0; u < unit.length; u++) {
                                    if (unit[u].id == list[i].unit) {
                                        _unit = unit[u].value;
                                        break;
                                    }
                                }
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="quotation" data-userId ="'+ list[i].createUser +'">\
                                    <label class="tab-sign"><i class="s-menuBg s-menu10"></i></label>\
                                    <div class="tab-style">\
                                        <div class="style-title"><span>' + _time + '</span><span>' + _name + '</span><span>创建了报价单</span></div>\
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
                                var _time = list[i].createTime,
                                    _name = list[i].createUserName,
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
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="pi" data-userId ="'+ list[i].createUser +'">\
                                    <label class="tab-sign"><i class="s-menuBg s-menu11"></i></label>\
                                    <div class="tab-style">\
                                        <div class="style-title"><span>' + _time + '</span><span>' + _name + '</span><span>创建了PI</span></div>\
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
                                var _time = list[i].createTime,
                                    _name = list[i].createUserName,
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
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="order" data-userId ="'+ list[i].createUser +'">\
                                    <label class="tab-sign"><i class="s-menuBg s-menu12"></i></label>\
                                    <div class="tab-style">\
                                        <div class="style-title"><span>' + _time + '</span><span>' + _name + '</span><span>创建了订单</span></div>\
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
                                var time = $.dateObj(list[i].createTime)._getDatetime(),
                                    sign = '', sign2 = '', _name = list[i].name;
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
                                                <div class="style-title"><span>' + time + '</span><span>' + (list[i].createUserName || '匿名' ) + '</span><span>创建了任务</span></div>\
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
                                /*if(_content.length > 30){
                                 _content = _content.slice(0,30)+'...';
                                 }*/
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
                                /*if(list[i].contentType == 1){
                                 _titleStyle = '<div class="style-title"><span>'+list[i].createTime+'</span><span>'+_title+'</span><span>'+_name+'</span></div>';
                                 }*/
                                html += '<div class="tab-content" data-id="' + list[i].id + '" data-type="' + _type + '">\
                                            <label class="tab-sign">' + _sign + '</label>\
                                            <div class="tab-style">' + _titleStyle + '<div class="style-content">' + _content + '</div>\
                                            </div>\
                                            <div class="clear"></div>\
                                        </div>';
                            }
                        }
                        else if (type == 'file') {
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
                                detailObj.getRelationsList(obj, type);
                            }
                        });
                    }
                });
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
            //  下载文件
            getFile: function (obj) {
                console.log(Base.sitUrl + '/api/file/download?data=' + JSON.stringify(obj));
                $('.doc-handle-cont').hide();
                window.location.href = Base.sitUrl + '/api/file/download?data=' + JSON.stringify(obj);
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
            //  联系人详情
            getRelationInfo: function () {
                $.ajax({
                    url: Base.sitUrl + '/api/customer/contacts/v1/contacts/detail',
                    type: 'POST',
                    data: {
                        data: JSON.stringify({id: rId})
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('获取联系人详情失败，' + res.message);
                            return;
                        }
                        var countryNum = JSON.parse(country());
                        var obj = res.data;
                        custId = obj.customerId;
                        contId = obj.id;
                        detailObj.fileObj.customerId = obj.customerId;

                        var taglist = obj.customerContactTags && obj.customerContactTags.length > 0 ? obj.customerContactTags : [],
                            elist = detailObj.list.employee,
                            followlist = obj.followUpUsers,
                            tagHTML = '', followHTML = '', starHTML = '';
                        detailObj.info = obj;
                        for (var i = 0; i < countryNum.length; i++) {
                            if (obj.countries == countryNum[i].id) {
                                $detail.find('.top-title>label>img').attr('src', '../images/country/PNG/' + countryNum[i].id + '.png')
                                $detail.find('.top-title>label>span,.cust-area').text(countryNum[i].cn || '未设置');
                                obj.countries = countryNum[i].cn;
                                break;
                            }
                        }
                        if (obj.countries == 0) {
                            var countriesNone = 'none';
                            obj.countries = '中国'
                        }
                        titleName = contName = obj.name;
                        $detail.find('.overview-time').text(obj.createTime);
                        $detail.find('.o-phone').text(obj.phone || '');
                        $detail.find('.o-email').text(obj.email || '');
                        $detail.find('.overview-phone').val(obj.phone || '');
                        $detail.find('.overview-email').val(obj.email || '');
                        $detail.find('.overview-position').text(obj.position || '无职位');
                        $detail.find('.con-user').text(obj.name || '');
                        $detail.find('.con-countries').empty();
                        $detail.find('.con-countries').append('<img src="../images/country/PNG/' + obj.countries + '.png" alt="国家" style="display:' + countriesNone + '" />');

                        for (var i = 0; i < obj.contacts.length; i++) {
                            var contacts = ' <span style="cursor: pointer;" data-id="'+ obj.contacts[i].id +'">'+obj.contacts[i].name+'</span> '+',';
                            if(i==(obj.contacts.length)-1){
                                contacts = contacts.substring(0,contacts.length-1);
                            }
                            $detail.find('.con-name').append(contacts);
                        }

                        $detail.find('.con-position,.relation-position').text(obj.position || '无职位');
                        $detail.find('.con-company,.relation-company').text(obj.workingCompany || '');
                        $detail.find('.con-company').attr('data-id', obj.customerId)
                        $detail.find('.re-status').text(obj.customer.statusName || '');
                        $detail.find('.con-email').text(obj.email || '');
                        $detail.find('.con-birth').text(obj.birthday || '');
                        $detail.find('.con-phone').text(obj.phone || '');
                        $detail.find('.con-facebook').text(obj.facebook || '');
                        $detail.find('.con-twitter').text(obj.twitter || '');
                        $detail.find('.con-linkedin').text(obj.linkedin || '');
                        $detail.find('.con-remark').text(obj.remark || '');
                        $detail.find('.top-title>span').text(obj.name || '');

                        //自定义属性展示
                        var getDefineds = obj.contactDefinedValues;
                        var definedCont = $detail.find('#info-content .info-table tbody');

                        for (var i = 0; i < getDefineds.length; i++) {
                            var html = '<tr><td>' + getDefineds[i].name + '</td><td>' + getDefineds[i].value + '</td></tr>';
                            definedCont.append(html);
                        }

                        if (obj.starLevel > 0 && obj.starLevel <= 5) {
                            for (var s = 0; s < obj.starLevel; s++) {
                                starHTML += '<i class="s-updownBg s-star3"></i>';
                            }
                            var unStar = 5 - obj.starLevel;
                            for (var us = 0; us < unStar; us++) {
                                starHTML += '<i class="s-updownBg s-unstar2"></i>';
                            }
                            $detail.find('.status-star').empty().append(starHTML);
                        } else if (obj.starLevel > 5) {
                            for (var s = 0; s < 6; s++) {
                                starHTML += '<i class="s-updownBg s-star3"></i>';
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
                                if (followlist[f].userId == obj.followUpUser) {
                                    $detail.find('.cancel-follow').addClass('active');
                                    $detail.find('.s-menus').append('<li>取消跟进</li>');
                                    continue;
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
                            $(_selector).text(obj.statics[s]);
                        }
                    }
                });
                $('.contact-img img').each(function () {
                    $.cutImage(this, 68, 68);
                });
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
                        $detail.find('.list-follower').empty().append(html);
                    }
                });
            },
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
        //国旗
        function country() {
            var data = "";
            $.ajax({
                url: Base.sitUrl + '/api/sys/v1/sys/countries/get',
                type: 'POST',
                dataType: 'json',
                async: false,
                success: function (res) {
                    data += JSON.stringify(res.data);
                }
            });
            return data;
        }

        detailObj.getEmployees();
        detailObj.getRelationInfo();
        detailObj.getUnits();
        detailObj.getRelationsList(detailObj.timeObj, 'timeline')
        detailObj.getCloudNode();
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
            sameOne(rId, 1);
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
            sameOne(rId, 3);
        });
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
        })
        //查看公司详情
        $('.con-company').on('click', function () {
            var id = $(this).attr('data-id');
            maintab.showTab(Base.sitUrl + '/html/pop-customer-detail.html?id=' + id, '客户详情')
        });

        //查看相关联系人详情
        $('.con-name').on('click', 'span', function (e) {
            $.EventFn(e);
            var id = $(this).attr('data-id');
            if(rId != id){
                maintab.showTab(Base.sitUrl + '/html/pop-relation-detail.html?id=' + id, '联系人详情');
            }
        });
    });
});