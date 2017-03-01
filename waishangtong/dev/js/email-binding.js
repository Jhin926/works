/*
 用于账号绑定
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab, ZeroClipboard) {
        window['ZeroClipboard'] = ZeroClipboard;
        //手动设置页面切换
        $("#setting-btn").on('click', function () {
            $("#email-binding").hide();
            $("#setting").show();
            var address = $("#email-binding .emailAddress").val();
            var password = $("#email-binding .password").val();
            $("#setting .emailAddress").val(address);
            $("#setting .password").val(password);
            addressNum = address.search("@");
            addressPostfix = address.substring(addressNum + 1, address.length);
            if (addressPostfix !== "" && addressNum > 0) {
                $("#receiveHost").val('imap.' + addressPostfix);
                $("#smtpHost").val('smtp.' + addressPostfix);
            }
            //邮箱验证
            var val = $("#setting .emailAddress").val();
            if (!reg.test(val) && val !== "") {
                $("#setting .emailAddress").css("border", "1px solid red");
                $("#setting .emailAddress").parent().next(".errorEmail").show();
            } else {
                $("#setting .emailAddress").css("border", "1px solid #ccc");
                $("#setting .emailAddress").parent().next(".errorEmail").hide();
            }
        });
        $("#back").on('click', function () {
            $("#email-binding").show();
            $("#setting").hide();
        });
        //收件类型切换
        $("#receiveServerType").on('change', function () {
            var address = $("#email-binding .emailAddress").val();
            addressNum = address.search("@");
            addressPostfix = address.substring(addressNum + 1, address.length);
            var kinds = $(this).find("option:selected").attr("data-kind");
            if (addressPostfix !== "") {
                $("#receiveHost").val(kinds + '.' + addressPostfix);
            }
        });
        //SSL选择
        $("#receiveSsl").on('click', function () {
            if ($("#receiveSsl").parent().attr("class") == "checked") {
                $("#receivePort").val(993);
            } else {
                $("#receivePort").val(143);
            }
        });
        $("#smtpSsl").on('click', function () {
            if ($("#smtpSsl").parent().attr("class") == "checked") {
                $("#smtpPort").val(456);
                $("#startTls").attr("disabled", true);
                $("#startTls").parents(".erroMes").css("color", "#ccc");
            } else {
                $("#smtpPort").val(25);
                $("#startTls").attr("disabled", false);
                $("#startTls").parents(".erroMes").css("color", "#333");
            }
        });
        //邮箱验证
        var reg = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/;
        $("#email-binding .emailAddress,#setting .emailAddress").on('change', function () {
            $("#errorCont").hide();
            var val = $(this).val();
            if (!reg.test(val)) {
                $(this).css("border", "1px solid red");
                $(this).parent().next(".errorEmail").show();
            } else {
                $(this).css("border", "1px solid #ccc");
                $(this).parent().next(".errorEmail").hide();
            }
        });
        $("#setting input[type!=checkbox]").on('input', function () {
            if ($(this).val() !== "") {
                $(this).css("border-color", "#ccc");
            }
        })
        //账号创建.简单设置
        $("#create-btn").on('click', function () {
            var emailAddress = $("#email-binding .emailAddress").val();
            var password = $("#email-binding .password").val();
            var data = {
                simple: 1,
                emailAddress: emailAddress,
                password: password
            };
            data = JSON.stringify(data);
            if (emailAddress !== "" && password !== "" && reg.test(emailAddress)) {
                $.ajax({
                    url: Base.sitUrl + '/api/user/email/v1/binding',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        data: data
                    },
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    success: function (result) {
                        if (result.code == 400003) {
                            $("#errorCont").show();
                            $(".blockUI").remove();
                            return;
                        }

                        if (!result.success) {
                            $(".blockUI").remove();
                            $("#errorCont").show();
                            $("#errorCont").children().remove();
                            $("#errorCont").text(result.message);
                            return;
                        }
                        if (result.success) {
                            parent.location.reload();
                            $.DestroyPopInPop();
                        } else {
                            $.Alert(result.message);
                        }
                    }
                });
            } else if (emailAddress == "") {
                $.Alert("请输入邮箱地址！");
            } else if (password == "") {
                $.Alert("请输入密码！");
            }
        });
        //账号创建.手动设置设置
        $("#create-btn-detail").on('click', function () {
            var emailAddress = $("#setting .emailAddress").val();
            var password = $("#setting .password").val();
            var smtpHost = $("#smtpHost").val();
            var smtpPort = parseInt($("#smtpPort").val());
            var smtpSsl = $("#smtpSsl").parent().attr("class") == "checked" ? 1 : 0;
            var receiveServerType = parseInt($("#receiveServerType option:selected").val());
            var receiveHost = $("#receiveHost").val();
            var receivePort = parseInt($("#receivePort").val());
            var receiveSsl = $("#receiveSsl").parent().attr("class") == "checked" ? 1 : 0;
            var startTls = $("#startTls").parent().attr("class") == "checked" ? 1 : 0;
            var data = {
                simple: 0,
                emailAddress: emailAddress,
                password: password,
                smtpHost: smtpHost,
                smtpPort: smtpPort,
                smtpSsl: smtpSsl,
                receiveServerType: receiveServerType,
                receiveHost: receiveHost,
                receivePort: receivePort,
                receiveSsl: receiveSsl,
                startTls: startTls
            };
            data = JSON.stringify(data);
            if (emailAddress !== "" && password !== "" && reg.test(emailAddress)) {
                $.ajax({
                    url: Base.sitUrl + '/api/user/email/v1/binding',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        data: data
                    },
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    success: function (result) {
                        if (result.code == 400003) {
                            $("#errorContS").show();
                            $(".blockUI").remove();
                            return;
                        }
                        ;
                        if (!result.success) {
                            $(".blockUI").remove();
                            $("#errorContS").show();
                            $("#errorContS").children().remove();
                            $("#errorContS").text(result.message);
                            return;
                        }
                        if (result.success) {
                            parent.location.reload();
                            $.DestroyPopInPop();
                        } else {
                            $.Alert(result.message);
                        }
                    }
                });
            } else {
                $.Alert("请填写完整！");
                $("#setting").find("input[type!=checkbox]").each(function (element) {
                    if ($(this).val() == "") {
                        $(this).css("border-color", "red");
                    }
                });
            }
        });
    });
});