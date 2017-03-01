require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'swfobject', 'web_socket'], function (maintab) {
        //websocket
        var socketId;
        var socketVendorId;
        WEB_SOCKET_SWF_LOCATION = "WebSocketMain.swf";
        WEB_SOCKET_DEBUG = false;
        try {
            WebSocket.loadFlashPolicyFile("xmlsocket://" + host + ":10843");
        } catch (e) {
        }
        var host = window.location.host.split(":")[0];
        var defaultUrl = "ws://" + host + ":8085/";
        var ws;

        function websocket(listener, url, group_id, user_id) {
            if (url == null || url == "") {
                url = defaultUrl;
            }
            ws = new WebSocket(url);
            ws.onopen = function () {
                console.log("websocket onOpen : " + url);
            };
            ws.onmessage = function (e) {
                var data = e.data;
                var jsonObj = eval('(' + e.data + ')');
                if (jsonObj.type == 1) {
                    var connectionId = jsonObj.data;
                    if (undefined == user_id) {
                        user_id = "";
                    }
                    var uuid = generateUUID();
                    var message = "{\"id\":\"" + uuid + "\",\"type\":1,\"data\":{\"id\":\"" + connectionId + "\",\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\"}}";
                    ws.send(message);
                } else if (jsonObj.type == 2) {
                    //心跳包，不处理
                    // console.log(jsonObj.data);
                } else if (jsonObj.type == 100) {
                    // console.log(jsonObj);
                    listener(jsonObj.data);
                }
            };
            ws.onclose = function () {
                console.log("websocket onClose : " + url);
            };
            ws.onerror = function () {
                console.log("websocket onError : " + url);
            };
        }

        function send(data) {
            var uuid = generateUUID();

            var message = "{\"id\":\"" + uuid + "\",\"type\":100,\"data\":\"" + data + "\"}";
            ws.send(message);
        }

        function generateUUID() {
            var s = [];
            var hexDigits = "0123456789abcdef";
            for (var i = 0; i < 36; i++) {
                s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
            }
            s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
            s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
            s[8] = s[13] = s[18] = s[23] = "-";

            var uuid = s.join("");
            return uuid;
        }

        var code = $.GetQueryString('code');
        if (code) {
            $.ajax({
                url: Base.sitUrl + '/api/facebook/auth/login',
                type: 'POST',
                data: {
                    code: code
                },
                success: function (res) {
                    if (!res.success) {
                        return
                    }
                }
            })
        }

        window.checkActive = function(_href){
            var allMenus = $('#sideMenu').find('a');
            var _this;
            for(var i=0;i<allMenus.length;i++){
                var getHref = allMenus.eq(i).attr('data-href');
                if(getHref!=undefined) {
                    if (_href.indexOf(getHref) >= 0) {
                        _this = allMenus.eq(i);
                        tabActive(_this);
                        break;
                    }
                }
            }
        };
        //切换左侧边栏 选中状态
        function tabActive(_this){
            if (!_this.parent("li").hasClass('active')) {
                _this.parent("li").addClass('active').siblings('li').removeClass('active');
            } else {
                _this.parent("li").removeClass('active');
            }
        }
        $(document).on('click', '.sub-menu>li>a,.side-footer-pop>li>a,.i-sidebar-menu>li>a', function () {
            $.disBlock();
            var $href = $(this).attr('data-href'),
                _href = '';
            var $this = $(this);
            if ($this.next('ul').length > 0) {//有子目录不做处理
                tabActive($this);

                var contentHeight = $('.logo').outerHeight()+$('#sideMenu').outerHeight() + $('#sideFooter').outerHeight(),
                    containerHeight = $('.i-sidebar').outerHeight();
                if(contentHeight>=containerHeight){
                    $('.side-footer').css('position', 'relative');
                }else {
                    $('.side-footer').css('position', 'absolute');
                }
                return false;
            }

            if ($href == './index.html') {//主页
                _href = './index.html?v=' + window.ver;
            } else if ($href == './crm-task.html') {//任务
                _href = './crm-task.html?v=' + window.ver;
            } else if ($href == './develop-letter.html') {//开发信
                _href = './develop-letter.html?v=' + window.ver;
            } else if ($href == './crm-customer.html') {//客户
                _href = './crm-customer.html?v=' + window.ver;
            } else if ($href == './crm-contacts.html') {//联系人
                _href = './crm-contacts.html?v=' + window.ver;
            } else if ($href == '../admin/bk-info.html') {//企业后台
                _href = './admin/bk-info.html?v=' + window.ver;
            } else if ($href == '../admin/bk-org.html') {//组织架构
                _href = './admin/bk-org.html?v=' + window.ver;
            } else if ($href == '../admin/bk-resource-set.html') {//资源设置
                _href = './admin/bk-resource-set.html?v=' + window.ver;
            } else if ($href == '../admin/bk-role-manage.html') {//角色管理
                _href = './admin/bk-role-manage.html?v=' + window.ver;
            } else if ($href == '../admin/bk-sales-set.html') {//营销分配
                _href = './admin/bk-sales-set.html?v=' + window.ver;
            } else if ($href == './new-email.html') {//写邮件
                _href = './pop-email-new.html?v=' + window.ver;
            } else if ($href == './email-inbox.html') {//收件箱
                _href = './email-inbox.html?v=' + window.ver;
                $(this).find('.alertSocket').remove();
            } else if ($href == './email-outbox.html') {//发件箱
                _href = './email-outbox.html?v=' + window.ver;
                $(this).find('.alertSocket').remove();
            } else if ($href == './email-statistics.html') {//通讯录
                _href = './email-statistics.html?v=' + window.ver;
            }else if ($href == './email-trash.html') {//垃圾邮件
                _href = './email-trash.html?v=' + window.ver;
            }else if ($href == './email-draft.html') {//草稿箱
                _href = './email-draft.html?v=' + window.ver;
            } else if ($href == './crm-products.html') {//产品
                _href = './crm-products.html?v=' + window.ver;
            } else if ($href == './crm-quotation.html') {//报价
                _href = './crm-quotation.html?v=' + window.ver;
            } else if ($href == './crm-pi.html') {//PI
                _href = './crm-pi.html?v=' + window.ver;
            } else if ($href == './crm-order.html') {//订单
                _href = './crm-order.html?v=' + window.ver;
            } else if ($href == '../statistics/underling.html') {//统计
                _href = './statistics/underling.html?v=' + window.ver;
            } else if ($href == './user-binding.html') {//账户绑定
                _href = './user-binding.html?v=' + window.ver;
            } else if ($href == 'user-setting.html') {//个人设置
                _href = './user-setting.html?v=' + window.ver;
            } else if ($href == './statistics/underling.html') {//个人设置
                _href = './statistics/underling.html?v=' + window.ver;
            } else if ($href == './cloud/myCloud.html') {//云盘
                _href = './cloud/myCloud.html?v=' + window.ver;
            } else if ($href == '../cloud/myCloud.html') {//云盘
                _href = './cloud/myCloud.html?type=1&v=' + window.ver;
            }else{
                _href = $href+'?type=1&v=' + window.ver;
            }

            var iframeSrc = $('#mainIframe').attr('src');
            if(iframeSrc.indexOf('pop-email-new.html')>=0){//当前在编辑邮件
                $('#mainIframe')[0].contentWindow.window.saveDraft(_href);
            }else {
                $('#mainIframe').attr('src', _href);
                tabActive($this);
            }
        });
        function menuData() {
            var data;
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/right/menu/list',
                type: 'GET',
                dataType: 'json',
                async: false,
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }
                    data = res.data;
                }
            })
            return data;
        }

        var menuDataJson = menuData();
        $.menuPower = function (code) {
            var data = menuDataJson;
            var on = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].permissionCode == code) {
                    on = 1
                }
            }
            return on;
        };
        var menuObj = {
            menuFn: function (flag) {
                var data = menuDataJson;
                var menuList = new Array();
                var menusBk = new Array();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].permissionCode == "sendmail") {
                        var array = {id: 1, name: data[i].name, href: './new-email.html', type: '邮件'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "inbox") {
                        var array = {id: 2, name: data[i].name, href: data[i].url, type: '邮件'};
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "outbox") {
                        var array = {id: 3, name: data[i].name, href: data[i].url, type: '邮件'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "emailaddress") {
                        var array = {id: 5, name: data[i].name, href: data[i].url, type: '邮件'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "emailtrash") {
                        var array = {id: 16, name: data[i].name, href: data[i].url, type: '邮件'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "emaildraft") {
                        var array = {id: 17, name: data[i].name, href: data[i].url, type: '邮件'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "customer") {
                        var array = {id: 6, name: data[i].name, href: data[i].url, type: 'CRM'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "contact") {
                        var array = {id: 7, name: data[i].name, href: data[i].url, type: 'CRM'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "task") {
                        var array = {id: 8, name: data[i].name, href: data[i].url, type: 'CRM'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "product") {
                        var array = {id: 9, name: data[i].name, href: data[i].url, type: 'CRM'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "quotation") {
                        var array = {id: 10, name: data[i].name, href: data[i].url, type: 'CRM'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "pi") {
                        var array = {id: 11, name: data[i].name, href: data[i].url, type: 'CRM'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "order") {
                        var array = {id: 12, name: data[i].name, href: data[i].url, type: 'CRM'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "statistic") {
                        var array = {id: 13, name: data[i].name, href: data[i].url, type: '工具'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "bindaccount") {
                        var array = {id: 14, name: data[i].name, href: data[i].url, type: '工具'}
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "yunpan") {
                        var array = {id: 15, name: data[i].name, href: data[i].url, type: '工具'};
                        menuList.push(array);
                        continue;
                    } else if (data[i].permissionCode == "approval") {
                        var array = {id: 18, name: data[i].name, href: './approval/view/approval.html', type: '工具'};
                        menuList.push(array);
                    } else if (data[i].permissionCode == "foreigntrade") {
                        var array = {id: 19, name: data[i].name, href: './trade-tools/view/exchange-rate-list.html', type: '工具'};
                        menuList.push(array);
                    } else if (data[i].permissionCode == "main") {
                        var mainHtml = '<li>\
                                            <a data-href="./index.html" href="javascript:;">\
                                                <i class="s-menuBg s-lgmenu"></i><span>首页</span>\
                                            </a>\
                                        </li>\
                                        ';
                    } else if (data[i].permissionCode == "EDM") {
                        var ltHtml = '<li>\
                                            <a data-href="./develop-letter.html" href="javascript:;">\
                                                <i class="s-menuBg s-devLogo"></i><span>开发信</span>\
                                            </a>\
                                        </li>';
                    } else if (data[i].permissionCode == "company") {
                        var array = {id: 1, name: '企业资料', href: '../admin/bk-info.html'}
                        menusBk.push(array)
                    } else if (data[i].permissionCode == "resouce") {
                        var array = {id: 4, name: '角色管理', href: '../admin/bk-role-manage.html'}
                        menusBk.push(array)
                    } else if (data[i].permissionCode == "organization") {
                        var array = {id: 3, name: '组织架构', href: '../admin/bk-org.html'}
                        menusBk.push(array)
                    } else if (data[i].permissionCode == "role") {
                        var array = {id: 2, name: '资源设置', href: '../admin/bk-resource-set.html'}
                        menusBk.push(array)
                    } else if (data[i].permissionCode == "EDMsetting") {
                        var array = {id: 5, name: '营销分配', href: '../admin/bk-sales-set.html'}
                        menusBk.push(array)
                    } else if (data[i].permissionCode == "yunpan_bk") {
                        var array = {id: 6, name: '网盘管理', href: '../cloud/myCloud.html'}
                        menusBk.push(array)
                    }
                }
                var menus = [],
                    _href = localStorage.getItem('__currentPage');
                var storage = localStorage.getItem('__userInfo'),
                    id = 0,
                    userMaster = -1;
                if (storage) {
                    id = parseInt(storage.substr(storage.indexOf(';') + 1));
                    userMaster = parseInt(storage.substr(storage.lastIndexOf(';') + 1));
                }
                if (_href && _href.length > 0) {
                    $('#mainIframe').attr('src', _href);
                }
                if (flag == -1 && userMaster == 1) {
                    $('.side-footer-pop').find("li").eq(0).remove();
                    $('.side-footer-pop').prepend('<li><a id="comeback" data-href="../admin/bk-info.html" href="javascript:;">企业后台</a></li>');
                } else {
                    $('.side-footer-pop').find("li").eq(0).remove();
                    $('.side-footer-pop').prepend('<li><a id="comeback" data-href="../index.html" href="javascript:;">外贸通</a></li>');
                }
                if (location.pathname.indexOf('/activate.html') !== -1) {
                    return;
                } else if (!storage && location.pathname.indexOf('/login.html') == -1) {
                    parent.location.href = Base.builtUrl + '/login.html';
                    return;
                }
                if (flag != -1) {
                    menus = menusBk;
                    html = '<li class="active"><ul class="sub-menu" style="display: block;">';
                    for (var i = 0, list = menus.length; i < list; i++) {
                        html += '<li><a data-href="' + menus[i].href + '" href="javascript:;"><i class="s-menuBg s-admin' + menus[i].id + '"></i><span>' + menus[i].name + '</span></a></li>';
                    }
                    html += '</ul></li>';
                } else {
                    var menus = menuList,
                        tmp = {};
                    var html = mainHtml + ltHtml;
                    for (var i = 0; i < menus.length; i++) {
                        var menu = menus[i];
                        if (!tmp[menu.type]) {
                            tmp[menu.type] = [];
                        }
                        tmp[menu.type].push(menu);
                    }
                    for (var k in tmp) {
                        var key = tmp[k],
                            i = '<i class="s-menuBg s-lgmenu3"></i>';
                        if (k == '工具') {
                            i = '<i class="s-menuBg s-lgmenu4"></i>';
                        } else if (k == '邮件') {
                            i = '<i class="s-menuBg s-lgmenu2"></i>';
                        }
                        if (key.length == 0) {
                            html += '<li><a href="javascript:;">' + i + '<span>' + k + '</span></a></li>';
                        } else {
                            var htmp = '';
                            for (var j = 0; j < key.length; j++) {
                                htmp += '<li><a data-href="' + key[j].href + '" href="javascript:;"><i class="s-menuBg s-menu' + key[j].id + '"></i><span>' + key[j].name + '</span></a></li>';
                            }
                            if(k == '邮件'){
                                html += '<li class="active"><a href="javascript:;">' + i + '<span>' + k + '</span><i class="s-menuBg s-menuUp"></i></a>' +
                                    '<ul class="sub-menu">' + htmp + '</ul>' +
                                    '</li>';
                            }else{
                                html += '<li><a href="javascript:;">' + i + '<span>' + k + '</span><i class="s-menuBg s-menuUp"></i></a>' +
                                    '<ul class="sub-menu">' + htmp + '</ul>' +
                                    '</li>';
                            }
                        }
                    }
                }
                $('#sideMenu').empty().append(html);
            }
        };
        menuObj.menuFn(-1);

        // 菜单底部个人设置弹窗
        var $sideFooter = $('#sideFooter'),
            $sideFooterPop = $sideFooter.find('.side-footer-pop');
        $sideFooter.on('click', 'a.side-footer-btn', function () {
            $sideFooterPop.toggle();
        });

        // 退出登录
        $sideFooter.on('click', '.btn-loginout', function (e) {
            e.preventDefault();
            $.ajax({
                url: Base.sitUrl + '/api/user/v1/logout',
                type: 'POST',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res, '退出失败,');
                        return;
                    }
                    location.href = Base.builtUrl + "/login.html?&v=" + window.ver;
                    localStorage.removeItem("__userInfo");
                    localStorage.removeItem('__currentPage');
                }
            });
        });

        $('.side-footer').on('click', '.side-footer-pop>li>a', function () {
            if ($(this).attr("data-href") == '../admin/bk-info.html') {//企业后台
                $('#mainIframe').attr('src', 'admin/bk-info.html');
                menuObj.menuFn(1);
            } else if ($(this).attr("data-href") == '../index.html') {
                $('#mainIframe').attr('src', './index.html');
                menuObj.menuFn(-1);
            }
            $sideFooterPop.hide();
        });

        $.disNone = function () {
            $(".i-alert").hide();
        }
        $.disBlock = function () {
            $(".i-alert").show();
        }

        //左边栏用户名
        $.ajax({
            url: Base.sitUrl + '/api/user/v1/session',
            type: 'POST',
            dataType: 'json',
            async: false,
            success: function (res) {
                socketId = res.data.id;
                socketVendorId = res.data.vendorId;
                var name = res.data.name;
                if($.GetLength(name) > 10){
                    name = name.substring(0,7) + '...'
                }
                $("#pageLeftUserName").text(name).attr({'title': res.data.name,"data-id": res.data.id,"data-admin": res.data.isAdmin})
                if (escape(name).indexOf( "%u" )<0){
                    var useName=(name.substring(0,2)).toUpperCase();
                    $(".useName").text(useName);
                } else {
                    $(".useName").text((name.substring(0,1)));
                }
                var firstLogin = res.data.firstLogin;
                if (firstLogin) {
                    $('#mainIframe').attr('src', './user-binding.html')
                }
            }
        });
        websocket(output, "ws://47.89.36.89:8085", socketVendorId, socketId);

        function output(str) {
            var data = eval("(" + str + ")");
            if (data.inboxCount > 0 && data.inboxCount !== null && data.inboxCount !== undefined) {
                for (var i = 0; i < $('.sub-menu').find('a').length; i++) {
                    if ($('.sub-menu').find('a').eq(i).attr('data-href') == './email-inbox.html') {
                        if ($('.sub-menu').find('a').eq(i).find('.alertSocket').length > 0) {
                            var num = parseInt($('.sub-menu').find('a').eq(i).find('.alertSocket').text()) + data.inboxCount;
                            $('.sub-menu').find('a').eq(i).find('.alertSocket').text(num)
                        } else {
                            var inboxCountHtml = '<span class="alertSocket">' + data.inboxCount + '</span>';
                            $('.sub-menu').find('a').eq(i).append(inboxCountHtml);
                        }
                    }
                }
            }
            if (data.outboxCount > 0 && data.outboxCount !== null && data.outboxCount !== undefined) {
                for (var i = 0; i < $('.sub-menu').find('a').length; i++) {
                    if ($('.sub-menu').find('a').eq(i).attr('data-href') == './email-outbox.html') {
                        if ($('.sub-menu').find('a').eq(i).find('.alertSocket').length > 0) {
                            var num = parseInt($('.sub-menu').find('a').eq(i).find('.alertSocket').text()) + data.outboxCount;
                            $('.sub-menu').find('a').eq(i).find('.alertSocket').text(num)
                        } else {
                            var outboxCountHtml = '<span class="alertSocket">' + data.outboxCount + '</span>';
                            $('.sub-menu').find('a').eq(i).append(outboxCountHtml);
                        }
                    }
                }
            }
        }

        //当前登录的客户的所有功能列表
        $.ajax({
            url: Base.sitUrl + '/api/org/v1/org/right/function/list',
            type: 'GET',
            dataType: 'json',
            success: function (res) {
                if (!res.success) {
                    $.unLogin(res);
                    return
                }
                window.funcList = res.data;
            }
        });
    });
});