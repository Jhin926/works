/*!
 *  website base js        
 */
// baseurl
var _pathArr = (window.location + '').split('/');
var Base = {
    url: _pathArr[ 0 ] + '//' + _pathArr[ 2 ],
    builtUrl: _pathArr[ 0 ] + '//' + _pathArr[ 2 ] + '/html',
    adminUrl: _pathArr[ 0 ] + '//' + _pathArr[ 2 ] + '/html/admin',
    jsUrl: _pathArr[ 0 ] + '//' + _pathArr[ 2 ] + '/js/app',
    libUrl: _pathArr[ 0 ] + '//' + _pathArr[ 2 ] + '/js/lib',
    reqUrl: _pathArr[ 0 ] + '//' + _pathArr[ 2 ] + '/service/invoke.jhtml',
    //sitUrl: 'http://console.waishangtongmail.com'
    sitUrl: 'http://localhost'
};

/* ! requirejs main config开发环境需要*/
require.config({
    paths: {
        'jquery': Base.libUrl + '/jquery-1.10.2.min',
        // angular
        //'angular': 'https://code.angularjs.org/1.2.9/angular',
        'angular': Base.libUrl + '/angular.min',
        //angular animate
        'angularAnimate': Base.libUrl + '/angular-animate',
        // bootstrap框架
        'bootstrap': Base.libUrl + '/bootstrap/js/bootstrap.min',
        // 时间选择
        'datetimepicker': Base.libUrl + '/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min',
        // 时间选择汉化
        'datetimepickerCN': Base.libUrl + '/bootstrap-datetimepicker/js/bootstrap-datetimepicker.zh-cn',
        // 表单美化
        'uniform': Base.libUrl + '/uniform/jquery.uniform.min',
        // 校验相关
        'validationLang': Base.libUrl + '/jquery-validation/messages_zh.min',
        // 滚动插件
        'slimScroll': Base.libUrl + '/jquery-slimscroll/jquery.slimscroll.min',
        // ztree插件
        'ztree': Base.libUrl + '/zTree_v3/js/jquery.ztree.all-3.5.min',
        // jquery form 插件
        'jqform': Base.libUrl + '/jquery.form',
        // jquery blockUI
        'blockUI': Base.libUrl + '/jquery.blockui.min',
        // bootstrap-colorpicker
        'colorpicker': Base.libUrl + '/bootstrap-colorpicker/js/bootstrap-colorpicker',
        // UEditor
        'ueditorconfig': Base.libUrl + '/UEditor/ueditor.config',
        'ueditor': Base.libUrl + '/UEditor/ueditor.all.min',
        'ueditorLang': Base.libUrl + '/UEditor/lang/zh-cn/zh-cn',
        'ZeroClipboard': Base.libUrl + '/UEditor/third-party/zeroclipboard/ZeroClipboard.min',
        // cookie操作相关
        'cookiehandle': Base.jsUrl + '/cookiehandle',
        'validate': Base.libUrl + '/jquery-validation/jquery.validate.min',
        // 右侧弹窗
        'maintab': Base.jsUrl + '/maintab',
        // 重置密码模块
        'setpassword': Base.jsUrl + '/setpassword',
        // 密码加密码
        'rsa': Base.jsUrl + '/rsa',
        // 密码加密码
        'base64': Base.jsUrl + '/base64',
        // 密码加密码
        'jsbn': Base.jsUrl + '/jsbn',
        // 密码加密码
        'rng': Base.jsUrl + '/rng',
        // 密码加密码
        'prng4': Base.jsUrl + '/prng4',
        // jquery-UI
        'jqueryUI': Base.libUrl + '/jquery-ui.min',
        // 选色板
        'evol': Base.libUrl + '/evol-colorpicker/evol-colorpicker.min',
        //打印
        'jqprint': Base.libUrl + '/jquery.jqprint-0.3',
        //日历
        'calendar': Base.libUrl + '/fullcalendar.min',
        //下拉框美化
        'selectPick': Base.libUrl + '/select-pick/selectpick',
        //socket
        'swfobject': Base.libUrl + '/message/swfobject',
        'web_socket': Base.libUrl + '/message/web_socket',
        //省市
        'cityselect': Base.libUrl + '/city/jquery.cityselect',
        // app
        'app': Base.jsUrl + '/app',
        //产品品类数据
        'category': 'category',
        'countries' : 'countries'
    },
    shim: {
        'bootstrap': [ 'jquery' ],
        'datetimepickerCN': [ 'datetimepicker' ],
        'uniform': [ 'jquery' ],
        'slimScroll': [ 'jquery' ],
        'ztree': [ 'jquery' ],
        'jqform': [ 'jquery' ],
        'blockUI': [ 'jquery' ],
        'colorpicker': [ 'jquery' ],
        'setpassword': [ 'jquery', 'validationLang', 'rsa' ],
        'gridly': ['jquery'],
        'rng': [ 'prng4' ],
        'rsa': [ 'base64', 'jsbn', 'rng' ],
        'ueditorLang': [ 'ueditor' ],
        'ueditor': [ 'ueditorconfig' ],
        'jqueryUI': ['jquery'],
        'evol': ['jquery', 'jqueryUI'],
        'jqprint': ['jquery'],
        'calendar': ['jquery'],
        'selectPick': ['jquery'],
        'cityselect': ['jquery'],
        'angularAnimate': ['angular'],
        "angular":{
            exports: "angular"
        }
    }
});

require([ 'uniform' ], function () {
    // 单选、多选插件初始化
    $(':radio, :checkbox').uniform();
});

// 定义各种公用方法
require([ 'jquery', 'blockUI' ], function () {
    $(document).on('keydown', function (e) {
        if (e.keyCode == 116) {
            $.EventFn(e);
            if (self != top) {//不是顶层
                window.location.reload();
            }
            else {//顶层
                if (window.frames.main) {
                    window.frames.main.location.reload();
                }
            }
        }
    });

    //根据返回参数做不同的处理
    $.unLogin = function (_result, _startMsg, _endMsg){
        if(_result.code=='200005' || _result.code=='200006'){
            top.location.href = '/html/login.html';
        }else {
            _startMsg = _startMsg!=undefined? _startMsg : '';
            _endMsg = _endMsg!=undefined? _endMsg : '';
            $.Alert(_startMsg + _result.message + _endMsg);
        }
    };

    //切换搜索按钮右侧图标
    $('.box-inputs').on('input', '#inputQuick', function (e) {
        var value = $(this).val();
        if (value.length > 0) {
            $('#c-search-btn').removeClass('s-updownBg s-find').addClass('clear-icon-email2');
        } else {
            $('#c-search-btn').addClass('s-updownBg s-find').removeClass('clear-icon-email2');
        }
    });

    $('.box-inputs').on('click', '.clear-icon-email2', function (e) {
        $.EventFn(e);
        $('#inputQuick').val('');
        $('#c-search-btn').addClass('s-updownBg s-find').removeClass('clear-icon-email2');
    });
// wrapper function to  block element(indicate loading)
    $.BlockUI = function (el, centerY) {
        var el = (el != undefined) ? jQuery(el) : jQuery('body');
        if (el.height() <= 400) {
            centerY = true;
        }
        el.block({
            message: '<div class="blockui-img"></div>',
            centerY: centerY != undefined ? centerY : true,
            css: {
                top: '10%',
                border: 'none',
                padding: '2px',
                backgroundColor: 'none'
            },
            overlayCSS: {
                backgroundColor: '#000',
                opacity: 0.15,
                cursor: 'wait'
            }
        });
    };

    // wrapper function to  un-block element(finish loading)
    $.UnblockUI = function (el, clean) {
        var el = (el != undefined) ? jQuery(el) : jQuery('body');
        jQuery(el).unblock({
            onUnblock: function () {
                jQuery(el).css('position', '');
                jQuery(el).css('zoom', '');
            }
        });
    };
    // 通用ajax,在$.ajax基础上进行的封装
    $.AjaxFun = function (options) {
        var defaultOpts = {
            // 通用url
            url: Base.sitUrl + '/service/invoke.jhtml',
            type: "POST",
            dataType: "json",
            //timeout: 600,
            beforeSend: function (XHR) {
                $.BlockUI();
            },
            complete: function (XHR, TS) {
                $.UnblockUI();
            }
        };
        // 整合参数
        var opts = $.extend({}, defaultOpts, options);
        // 执行请求
        $.ajax(opts);
    };

    // 弹窗框内关掉销毁弹窗的方法
    $.DestroyPopInPop = function () {
        $(parent.document.body).find('#sPop').animate({ width: 0 }, 500, function () {
            $(parent.document.body).find('#mainTab, #iframeWrap').empty();
        });
    };

    //  重置标签默认事件并防止向上冒泡事件
    $.EventFn = function (e) {
        var _ev = e || window.event;
        _ev.preventDefault();
        _ev.stopPropagation();
    };

    $.modalsFn = function (target, obj) {
        var $modal = target;
        if ($modal.hasClass('active')) {
            return;
        }
        if (obj) {
            $modal.addClass('active').css('left', obj.position().left).siblings('.modals').removeClass('active');
        } else {
            $modal.addClass('active').siblings('.modals').removeClass('active');
        }
    };
    //字节判断
    $.GetLength = function (str) {
        return str.replace(/[^\x00-\xff]/g, "aa").length;
    };

    //截取字符串，全角长度是半角2倍
    $.autoAddEllipsis = function (pStr, pLen) {
        var _cutString = '',
            trueLength = 0;
        for(var i =0; i<pStr.length; i++){
            if((pStr.charAt(i)).charCodeAt(0) > 128){
                trueLength+=2;
            }else {
                trueLength+=1;
            }
            if(trueLength>pLen){
                _cutString = (pStr.substring(0, i-1))+'...';
            }else if(trueLength == pLen){
                _cutString = (pStr.substring(0, i))+'...';
            }else {
                if(i == (pStr.length-1)){
                    _cutString = pStr
                }
            }
        }
        return _cutString;
    }

    // 日期格式化
    // 对Date的扩展，将 Date 转化为指定格式的String
    // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
    // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
    // 例子：
    // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
    // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
    Date.prototype.format = function (format) {
        var o = {
            "M+": this.getMonth() + 1, // month
            "d+": this.getDate(), // day
            "h+": this.getHours(), // hour
            "m+": this.getMinutes(), // minute
            "s+": this.getSeconds(), // second
            "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
            "S": this.getMilliseconds()
        };
        if (/(y+)/.test(format))
            format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(format))
                format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        return format;
    };

    Array.prototype.indexOf = function(val) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] == val) return i;
        }
        return -1;
    };


    Array.prototype.remove = function(val) {
        var index = this.indexOf(val);
        if (index > -1) {
            this.splice(index, 1);
        }
    };

    Array.prototype.unique = function() {
        var n = {},r=[];
        for(var i = 0; i < this.length; i++) {
            if (!n[this[i]]) {
                n[this[i]] = true;
                r.push(this[i]);
            }
        }
        return r;
    };


    // 获取url后缀, name:后缀名
    $.GetQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null)return  window.decodeURI(r[2]);
        return null;
    };

    // 判断权限 return
    $.GetCurrentPermission = function () {
        $.AjaxFun({
            data: {
                _mt: 'user_getCurrentPermission'
            },
            success: function (result) {
                if (result.data.isgod == 1) {
                    $('[data-permission]').show();
                } else if (result.data.isgod == 0) {
                    $('[data-permission]').hide();
                    $.each(result.data.permissions, function (index, item) {
                        $('[data-permission="' + item + '"]').show();
                    });
                }
            }
        });
    };

    //  设置显示时间格式
    $.dateObj = function (timestamp) {
        var dateObj = {
            _setTimestamp: null,
            _getDates: function () {
                var ns = dateObj._setTimestamp;
                if (!dateObj._setTimestamp) {
                    return;
                }
                if (ns.length < 13) {
                    ns = dateObj._setTimestamp + '000';
                }
                var date = new Date(parseInt(ns));
                return date;
            },
            _getYear: function () {
                return dateObj._getDates().getFullYear();
            },
            _getMonth: function () {
                var m = dateObj._getDates().getMonth() + 1;
                if (m <= 9) {
                    m = '0' + m;
                }
                return m;
            },
            _getDate: function () {
                var d = dateObj._getDates().getDate();
                if (d <= 9) {
                    d = '0' + d;
                }
                return d;
            },
            _getHour: function () {
                var H = dateObj._getDates().getHours();
                if (H <= 9) {
                    H = '0' + H;
                }
                return H;
            },
            _getMinutes: function () {
                var M = dateObj._getDates().getMinutes();
                if (M <= 9) {
                    M = '0' + M;
                }
                return M;
            },
            _getSeconds: function () {
                var s = dateObj._getDates().getSeconds();
                if (s <= 9) {
                    s = '0' + s;
                }
                return s;
            },
            _getDatetime: function () {
                return dateObj._getYear() + '-' + dateObj._getMonth() + '-' + dateObj._getDate() + ' ' + dateObj._getHour() + ':' + dateObj._getMinutes();
            },
            _getDatetime2: function () {
                return dateObj._getMonth() + '月' + dateObj._getDate() + '日 ' + dateObj._getHour() + ':' + dateObj._getMinutes();
            },
            _getDatetime3: function () {
                return dateObj._getYear() + '-' + dateObj._getMonth() + '-' + dateObj._getDate();
            },
            _getDatetime4: function () {
                return dateObj._getYear() + '-' + dateObj._getMonth() + '-' + dateObj._getDate() + ' ' + dateObj._getHour() + ':' + dateObj._getMinutes() + ':' + dateObj._getSeconds();
            }
        };

        dateObj._setTimestamp = timestamp;

        return dateObj;
    };

    // 拾色器插件
    $.fn.Colorpicker = function (options) {
        // 设置默认颜色
        var defaults = {
            current: '#CCCCCC',
            colors: [ '#000000', '#434343', '#666666', '#999999', '#B7B7B7', '#CCCCCC', '#D9D9D9', '#EFEFEF', '#F3F3F3', '#FFFFFF',
                '#980000', '#FF0000', '#FF9900', '#FFFF00', '#01FF00', '#01FFFF', '#4A86E8', '#0000FF', '#9900FF', '#FF00FF',
                '#e7b8b0', '#F4CCCC', '#fbe5cd', '#fff2cd', '#d8ead2', '#d8ead2', '#c9daf8', '#cfe2f3', '#dad2e9', '#ebd1dc',
                '#dd7e6a', '#e99998', '#f9ca9c', '#ffe59a', '#b6d7a8', '#a2c3c8', '#a4c2f4', '#9fc5e9', '#b4a7d5', '#d6a6be',
                '#cc4025', '#e06665', '#f6b26b', '#fed966', '#92c47d', '#76a5af', '#6d9eeb', '#6fa8dd', '#8d7cc2', '#c17ba0',
                '#a61c00', '#cc0001', '#e69137', '#f1c332', '#69a84f', '#46818f', '#3c78d8', '#3e85c7', '#674fa7', '#a64d79',
                '#85200c', '#990100', '#b45f05', '#bf9100', '#37761d', '#144f5d', '#1055cc', '#0c5395', '#351d75', '#741b47',
                '#5b0f01', '#660000', '#773f04', '#7e6000', '#274f13', '#0c343c', '#1c4587', '#073863', '#20124d', '#4c1131' ]
        };
        var opts = $.extend({}, defaults, options);
        var colorpickerHtml = '<div id="colorPicker" class="colorpicker"></div>';
        if ($('#colorPicker').length <= 0) $('body').append(colorpickerHtml);
        var $colorPicker = $('#colorPicker');
        $colorPicker.empty();

        $.each(opts.colors, function (index, color) {
            $colorPicker.append('<a title="' + color + '" style="background-color:' + color + '" href="#" data-color="' + color + '"></a>');
        });
        return this.each(function () {
            var $btn = $(this),
                $colorBox = $btn.find('i'),
                index = parseInt($colorBox.data('index'));
            // 设置默认底色
            $colorBox.css('backgroundColor', opts.current).attr('data-index', opts.current);
            // 添加事件
            $('body').on('click', function () {
                $colorPicker.hide();
            });
            $(this).on('click', function (e) {
                var $this = $(this),
                    domHeight = $(this).height(),
                    domWidth = $(this).width(),
                    posLeft = $(this).offset().left,
                    posTop = $(this).offset().top + domHeight + 8;
                $colorPicker.children('a').eq(index).addClass('current').siblings().removeClass('current');
                $colorPicker.show().css({
                    top: posTop,
                    left: posLeft
                });
                // 选择颜色
                $colorPicker.off().on('click', 'a', function (e) {
                    e.preventDefault();
                    var index = $(this).index(),
                        color = $(this).data('color');
                    $this.children('i').css('backgroundColor', color).data('index', index);
                });
                return false;
            });
        });
    };

    //切换时区
    function toTwo(_num) {
        _num = _num.toString();
        if (_num.length < 2) _num = '0' + _num.toString();
        return _num;
    }

    $.calcTime = function (_time, _oldOffset, _offset) {
        var d = new Date(_time).getTime();//取得时间，转换成时间戳
        var dStand = d - _oldOffset * 60 * 60000;//取得标准时间戳

        var nd = new Date(dStand + _offset * 60 * 60000);//取得当前所在时区的时间

        var year = nd.getFullYear();
        var month = toTwo(nd.getMonth() + 1);
        var date = toTwo(nd.getDate());
        var hour = toTwo(nd.getHours());
        var minute = toTwo(nd.getMinutes());
        var second = toTwo(nd.getSeconds());

        return year + "-" + month + "-" + date + "   " + hour + ":" + minute + ":" + second;
    }
});

// menu
require([ 'jquery', 'bootstrap' ], function () {
    $.getUser = function () {
        var storage = localStorage.getItem('__userInfo'),
            id = -1,
            name = '匿名',
            userMaster = -1;
        if (storage) {
            name = storage.substr(0, storage.indexOf(';'))
            id = parseInt(storage.substr(storage.indexOf(';') + 1));
            userMaster = parseInt(storage.substr(storage.lastIndexOf(';') + 1));
        }
        return {
            id: id,
            name: name,
            master: userMaster
        };
    }

    // 监听窗口变化，重置左侧菜单滚动高度
    $('.page-content').height($('.i-content-wrapper').height());
    $('#sPop').height($('.page-content').height());
    $('.page-left').height($('.i-content-wrapper').height());

    function leftStatus(){
        var contentHeight = $('.logo').outerHeight()+$('#sideMenu').outerHeight() + $('#sideFooter').outerHeight(),
            containerHeight = $('.i-sidebar').outerHeight();
        if(contentHeight>=containerHeight){
            $('.side-footer').css('position', 'relative');
        }else {
            $('.side-footer').css('position', 'absolute');
        }
    }
    leftStatus();

    $(window).resize(function () {
        leftStatus();
        $('.page-content').height($('.i-content-wrapper').height());
        $('#sPop').height($('.page-content').height());
        $('.page-left').height($('.i-content-wrapper').height());
        //  批量操作面板
        if ($('.m_batch').css('left') != '0px') {//操作面板隐藏
            $('.m_batch').css('left', '-100%');
        }
        //  左侧浮动层高度
        $('.pop-left').height('100%');
    });
    $('.page-content').scroll(function () {
        var _iHeight = $('.i-content-wrapper').height(),
            _pHeight = $('.page-right').height(),
            _height = 0;

        var _height = (_pHeight - _iHeight) > 0 ? _pHeight : _iHeight;
        $('.page-left').height(_height);
    });

    $.Page = function (opt) {
        if (!opt._class) {
            return false;
        }

        var obj = $(opt._class),
            allNum = opt.allNum || 5,
            nowNum = opt.nowNum || 1,
            html = '',
            callback = opt.callback || function () {
            };
        obj.off('click', '>a');
        if (opt.allNum <= 0) {
            obj.empty();
            return false;
        }
        if (nowNum >= 4 && allNum >= 6) {
            html = '<a href="javascript:;" data-page="1">首页</a>';
        }
        if (nowNum >= 2) {
            html += '<a href="javascript:;" data-page="' + (nowNum - 1) + '">&lt;</a>';
        }

        if (allNum <= 5) {
            for (var i = 1; i <= allNum; i++) {
                if (nowNum == i) {
                    html += '<a href="javascript:;" class="active">' + i + '</a>';
                } else {
                    html += '<a href="javascript:;" data-page="' + i + '">' + i + '</a>';
                }
            }
        } else {
            for (var i = 1; i <= 5; i++) {
                if (nowNum == 1 || nowNum == 2) {
                    if (nowNum == i) {
                        html += '<a href="javascript:;" class="active">' + i + '</a>';
                    } else {
                        html += '<a href="javascript:;" data-page="' + i + '">' + i + '</a>';
                    }
                } else if ((allNum - nowNum) == 0 || (allNum - nowNum) == 1) {
                    if ((allNum - nowNum) == 0 && i == 5) {
                        html += '<a href="javascript:;" class="active">' + (allNum - 5 + i) + '</a>';
                    } else if ((allNum - nowNum) == 1 && i == 4) {
                        html += '<a href="javascript:;" class="active">' + (allNum - 5 + i) + '</a>';
                    } else {
                        html += '<a href="javascript:;" data-page="' + (allNum - 5 + i) + '">' + (allNum - 5 + i) + '</a>';
                    }
                } else {
                    if (i == 3) {
                        html += '<a href="javascript:;" class="active">' + (nowNum - 3 + i) + '</a>';
                    } else {
                        html += '<a href="javascript:;" data-page="' + (nowNum - 3 + i) + '">' + (nowNum - 3 + i) + '</a>';
                    }
                }
            }
            if (allNum - nowNum > 1) {
                html += '<a href="javascript:;" data-page="' + (parseInt(nowNum) + 1) + '">&gt;</a>';
            }
            if ((allNum - nowNum) >= 3 && allNum >= 6) {
                html += '<a href="javascript:;" data-page="' + allNum + '">尾页</a>';
            }
        }
        var type = 2;
        if (type == 2) {
            html += '<input type="text" /><button type="button">确定</button>';
        }
        html += '<span style="margin:0 10px;">共'+ (opt.total || '') +'条记录</span>';
        obj.empty();
        obj.append(html);
        obj.on('click', '>button', function (e) {
            var _val = parseInt(obj.find('input').val());
            if (_val) {
                if (_val > opt.allNum) {
                    return false;
                }
            } else {
                return false;
            }
            $.Page({
                _class: opt._class,
                nowNum: _val,
                allNum: opt.allNum,
                callback: callback
            });
            callback(_val, allNum);
        });
        obj.on('click', '>a', function (e) {
            if ($(this).hasClass('active')) {
                return false;
            }
            var now = $(this).attr('data-page');
            $.Page({
                _class: opt._class,
                nowNum: now,
                allNum: opt.allNum,
                callback: callback
            });
            callback(now, allNum);
        });
    };

    $.errorsFn = function (obj, msg) {
        var flag = true;
        var errors = '<ddxi8lo xiv class="errors">\
                    <span></span>\
                </div>';
        if ((obj.val() == null || $.trim(obj.val()) == '') || obj.val() == -1) {
            if (!obj.hasClass('error')) {
                obj.addClass('error');
                if (obj.next('.errors').length == 0) {
                    obj.after(errors);
                }
                obj.next('.errors').addClass('active');
                obj.next('.errors').children('span').text(msg);
            }
            flag = false;
        } else {
            obj.removeClass('error');
            obj.next('.errors').removeClass('active');
        }
        return flag;
    };

    $.cutImage = function (img, fitwidth, fitheight) {
        var image = new Image();
        image.src = img.src;
        if (image.width > fitwidth && image.height > fitheight) {
            if (image.width > image.height) {
                img.height = fitheight;
            } else {
                img.width = fitwidth;
            }
        } else {
            img.style.cssText = 'position: absolute;top: 50%;margin-top:'+ (-(img.height / 2))+'px;left:50%;margin-left:'+ (-(img.width / 2)) + 'px';
        }
    };


    // 多选表单选择
    $('.table').on('click', 'td input:checkbox', function () {
        var $span = $(this).parent();
        var $tr = $(this).closest("tr");
        if ($(this).prop("checked")) {
            $tr.addClass("active");
            $span.addClass("checked");
        } else {
            $tr.removeClass("active");
            $span.removeClass("checked");
        }
    }).on('click', 'th input:checkbox', function (e) {
        var $tr = $(this).closest("table").find("tbody tr");
        var $span = $(this).closest("table").find("tr .checker span");
        var $allRadio = $(this).closest("table").find("tbody :checkbox");
        if ($(this).prop("checked")) {
            $tr.addClass("active");
            $span.addClass("checked");
            $allRadio.prop("checked", true);
        } else {
            $tr.removeClass("active");
            $span.removeClass("checked");
            $allRadio.prop("checked", false);
        }
    });

    //  左侧浮动层
    $('#s_tack').on('click', function (e) {
        $(this).addClass('s-thumbs').removeClass('s-unthumbs');
        $('.page-left').stop().animate({'margin-left': -$('.page-left').width()-15}, 500);
        $('.page-right').animate({'width': '99.4%'},500,function () {
            $('.r-titles').show();
        });
    });

    //  点击右边标题，打开左边浮动层
    $('.page-right>.page-title>.titles>.i_task').on('click', function (e) {
        if($('.page-left').length>0){//有左侧部分
            $('#s_tack').removeClass('s-thumbs').addClass('s-unthumbs');
            $('.page-left').stop().animate({'margin-left': 0}, 500);
            $('.page-right').animate({'width': '87%'},500,function () {
                $('.r-titles').hide();
            });
        }
    });

    //滚动监听事件提醒标志
    $(".i-content-wrapper,.mid,.page-content").bind('scroll', function () {
        var h = $(".i-content-wrapper").scrollTop();
        var h1 = $(".page-content").scrollTop();
        var hBk = $(".mid").scrollTop();
        if (h > 50 || hBk > 50 || h1 > 50) {
            parent.$.disNone();
        } else {
            parent.$.disBlock();
        }
    });
    //  过滤
    $('#btn-filter').on('click', function () {
        if ($(this).hasClass('active')) {
            $(this).removeClass('active');
            $('#filter').hide();
        } else {
            $(this).addClass('active');
            $('#filter').show();
        }
    });

    //  关闭面板
    $('#batchClose').on('click', function () {
        $('.m_batch').stop().animate({'left': '-100%'}, function () {
            $('.m_batch').removeClass('active');
        });
    });

    //  全选/全不选
    $('.page_info>table>thead').delegate('#all', 'click', function () {
        if (!$(this).attr('checked')) {
            $(this).parent().addClass('checked');
            $('input[name=batch]').each(function () {
                $(this).attr('checked', true);
            });
            $('.m_batch').addClass('active').stop().animate({'left': 0});
        } else {
            $(this).parent().removeClass('checked');
            $('input[name=batch]').each(function () {
                $(this).attr('checked', false);
            });
            $('.m_batch').stop().animate({'left': '-100%'}, function () {
                $('.m_batch').removeClass('active');
            });
        }
        $(this).attr('checked', !$(this).attr('checked'));
    });

    //  记录checked状态
    $('.page_info>table>tbody').delegate('input[name=batch]', 'click', function (e) {
        var _ev = e || window.event;
        _ev.stopPropagation();

        $('.modals').removeClass('active');
        $(this).attr('checked', !$(this).attr('checked'));
        if (!$(this).attr('checked')) {
            $(this).parent().removeClass('checked');
            $(this).closest('tr').removeClass('active');
        } else {
            $(this).parent().addClass('checked');
            $(this).closest('tr').addClass('active');
        }
        if ($('input[name=batch]:checked').length == 0) {
            $('.m_batch').stop().animate({'left': '-100%'}, function () {
                $(this).removeClass('active');
            });

            $('#all').attr('checked', false).closest('span').removeClass('checked');
        } else {
            $('.m_batch').addClass('active').stop().animate({'left': 0});
        }

        if ($('input[name=batch]:checked').length == $('input[name=batch]').length) {
            $('#all').attr('checked', true).closest('span').addClass('checked');
        } else {
            $('#all').attr('checked', false).closest('span').removeClass('checked');
        }
    });

    //  过滤参数
    $.filterObj = {
        list: [],
        total: 0,
        type: 0
    };
    //  分页参数
    $.pageObj = {
        currentPage: 1,
        pageSize: 8
    };
    //  关闭
    $('.mclose').on('click', function () {
        $(this).closest('.modals').removeClass('active');
    });
        // alert编写
    jQuery.Alert = function (message, imageUrl, fn) {
        var page_content = $(document.body);// $("div[class = 'page-content']");
        var alertMessage = '确定要关闭吗？ ';
        var imageTag = '';
        var fn = ($.isFunction(fn) && fn) ? fn : $.noop;//add by lwf  是否传入回调函数 并且是否为函数形式
        if (message) {
            alertMessage = message;
        }
        if (imageUrl) {
            imageTag = "<img src='" + imageUrl + "' />";
        }
        var content = '<div id="alert_Modal" class="modal fade" aria-hidden="true" role="basic" tabindex="-1" style="display: none;z-index:100001!important;"><div class="modal-dialog modal-dialog-marTop" style="width: 300px;margin-top:180px;"><div class="modal-content"><div class="modal-header">    <button class="close" aria-hidden="true" onclick="$.Alert.destoryAlert()" type="button"></button><h4 class="modal-title" style="text-align:left;">提示</h4></div><div class="modal-body"> '
            + imageTag
            + alertMessage
            + '</div><div class="modal-footer"><button class="btn btn-primary" type="button" onclick="$.Alert.destoryAlert()">确定</button></div></div></div></div>';
        // 添加alert弹出框
        var alert_Modal = [];

        function addAlert() {
            page_content.append(content);
            var alert_Modal_Interval = window.setInterval(function () {
                alert_Modal = $('#alert_Modal');
                if (alert_Modal.length > 0) {
                    alert_Modal.modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    alert_Modal.on('hidden.bs.modal', function (e) {
                        alert_Modal.remove();
                        fn.call(this);
                    });
                    alert_Modal.modal("show");
                    clearInterval(alert_Modal_Interval);
                }
            }, 50);
        }

        addAlert();
    };
    // 销毁alert弹出框
    jQuery.Alert.destoryAlert = function () {
        $('#alert_Modal').modal('hide');
    };

    // confirm编写
    jQuery.Confirm = function (message, imageUrl, fn) {
        var page_content = $(document.body);// $("div[class = 'page-content']");
        var alertMessage = '确定要操作吗？ ';
        var r;
        var imageTag = '';
        var fn = ($.isFunction(fn) && fn) ? fn : $.noop;//add by wjl  是否传入回调函数 并且是否为函数形式
        if (message) {
            alertMessage = message;
        }
        if (imageUrl) {
            imageTag = "<img src='" + imageUrl + "' />";
        }
        var content = '<div id="confirm_Modal" class="modal fade" aria-hidden="true" role="basic" tabindex="-1" style="display: none;z-index:100001!important;"><div class="modal-dialog" style="width: 300px;margin-top:140px;"><div class="modal-content"><div class="modal-header">  <h4 class="modal-title" style="text-align:left;">提示</h4></div><div class="modal-body">'
            + imageTag
            + alertMessage
            + '</div><div class="modal-footer"><button class="btn btn-primary" data-dismiss="modal" id="okDopConfirmButton" type="button">确定</button><button class="btn default" type="button" id="destoryDopConfirmButton">关闭</button></div></div></div></div>';
        // 添加confirm弹出框
        var Confirm_Modal = [];

        function addConfirm() {
            page_content.append(content);
            Confirm_Modal = $('#confirm_Modal');
            if (Confirm_Modal.length > 0) {
                Confirm_Modal.modal({
                    backdrop: 'static',
                    keyboard: false
                });
                Confirm_Modal.on('hidden.bs.modal', function (e) {
                    Confirm_Modal.remove();
                });
                Confirm_Modal.modal("show");

                $("#destoryDopConfirmButton").bind("click", function () {
                    $.Confirm.destoryConfirm();   //取消的时候不需要回调
                });
                $("#okDopConfirmButton").bind("click", function () {
                    //fn.call(this);
                    fn();
                });
            };

        }

        addConfirm();
    };

    // 销毁confirm弹出框
    jQuery.Confirm.destoryConfirm = function () {
        $('#confirm_Modal').modal('hide');
    };

    // errAlert编写
    jQuery.Err = function (message, imageUrl) {
        var page_content = $(document.body);// $("div[class = 'page-content']");
        var alertMessage = '关闭 ';
        var imageTag = '';
        if (message) {
            alertMessage = message;
        }
        if (imageUrl) {
            imageTag = "<img src='" + imageUrl + "' />";
        }
        var content = '<div id="err_Modal" class="modal fade" aria-hidden="true" role="basic" tabindex="-1" style="display: none;"><div class="modal-dialog" style="width: 400px;margin-top:180px;"><div class="modal-content"><div class="modal-header">   <button class="close" aria-hidden="true" onclick="jQuery.Err.destoryAlert()" type="button"></button><h4 class="modal-title" style="text-align:left;">异常信息</h4></div><div class="modal-body"> '
            + imageTag
            + '<div  style="resize:none; border:1px solid #CCC;width:338px;margin-bottom:-20px; height:180px; overflow:auto">'
            + alertMessage
            + '</div>'
            + '</div><div class="modal-footer"><button class="btn blue" type="button" onclick="jQuery.Err.destoryAlert()">确定</button></div></div></div></div>';
        // 添加alert弹出框
        var err_Modal = [];

        function addAlert() {
            page_content.append(content);
            var alert_Modal_Interval = window.setInterval(function () {
                err_Modal = $('#err_Modal');
                if (err_Modal.length > 0) {
                    err_Modal.modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                    err_Modal.on('hidden.bs.modal', function (e) {
                        err_Modal.remove();
                    });
                    err_Modal.modal("show");
                    clearInterval(alert_Modal_Interval);
                }
            }, 50);
        }

        addAlert();
    };

    // 销毁ErrAlert弹出框
    jQuery.Err.destoryAlert = function () {
        $('#err_Modal').modal("hide");
    };
});