// cookie 相关操作
define( [ 'common' ], function(){
    return {
        // 添加Cookie
        addCookie: function(name, value, options) {
            if (arguments.length > 1 && name != null) {
                if (options == null) {
                    options = {};
                }
                if (value == null) {
                    options.expires = -1;
                }
                if (typeof options.expires == "number") {
                    var time = options.expires;
                    var expires = options.expires = new Date();
                    expires.setTime(expires.getTime() + time * 1000);
                }
                document.cookie = encodeURIComponent(String(name)) + "=" + encodeURIComponent(String(value)) + (options.expires ? "; expires=" + options.expires.toUTCString() : "") + (options.path ? "; path=" + options.path : "") + (options.domain ? "; domain=" + options.domain : ""), (options.secure ? "; secure" : "");
            }
        },
        // 获取Cookie
        getCookie: function(name) {
            if (name != null) {
                var value = new RegExp("(?:^|; )" + encodeURIComponent(String(name)) + "=([^;]*)").exec(document.cookie);
                return value ? decodeURIComponent(value[1]) : null;
            }
        },
        // 移除Cookie
        removeCookie: function(name, options) {
            this.addCookie(name, null, options);
        }
    }
});