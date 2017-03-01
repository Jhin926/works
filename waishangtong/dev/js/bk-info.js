require([ 'common' ], function () {
    require(['jquery','countries'], function () {
        //获取国家地区列表
        var data = countries,
            list = '<option value="0">请选择国家</option>';
        for (var i = 0; i < data.length; i++) {
            list += '<option value="' + data[i].id + '">' + data[i].cn + ' - ' + data[i].en + '</option>'
        }
        $("#countriesInput").empty().append(list);

        var countryData = countries;

        function infoAjax() {
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/sys/v1/vendor/get",
                dataType: "json",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    var sysVendorAccount = data.sysVendorAccount;
                    if (sysVendorAccount !== null || sysVendorAccount !== "") {
                        var html = '';
                        var edm = sysVendorAccount.edmTotal - sysVendorAccount.edmUse;
                        var now = Date.parse(new Date());
                        var sur = sysVendorAccount.expireDate - now;
                        var surTime = sur / 1000 / 60 / 60 / 24;
                        surTime = surTime.toFixed(0);
                        surTime = parseInt(surTime) + 1;
                        $("#name").text(data.name).attr('data-id', data.id);
                        $("#address").text(data.address);
                        for (var i = 0; i < countryData.length; i++) {
                            if (countryData[i].id == data.countries) {
                                $('#countriesInput').find('option[value=' + countryData[i].id + ']').attr('selected', true);
                                $("#countries").text(countryData[i].cn);
                            }
                        }
                        $("#telephone").text(data.telephone);
                        $("#email").text(data.email);
                        $("#homepage").text(data.homepage);
                        $("#faxes").text(data.faxes);
                        $("#masterUserEmail").text(sysVendorAccount.masterUserEmail);
                        $("#expireDate").text(new Date(sysVendorAccount.expireDate).format('yyyy-MM-dd'));
                        $("#expireDay").text(surTime)
                        $("#subAccountUse").text(sysVendorAccount.subAccountUse);
                        $("#subAccountTotal").text(sysVendorAccount.subAccountTotal);
                        $("#edm").text(edm);
                        $("#storageUse").text(sysVendorAccount.storageUse);
                        $("#storageTotal").text(sysVendorAccount.storageTotal);
                        for (var i = 0; i < data.params.length; i++) {
                            html += '<li class="list-group-item list-group-itemNew">' +
                                '<label class="labelLeft labelSet" style="display:inline-block;"><span class="set">' + data.params[i].name + '</span>：</label>' +
                                '<input type="text" name="" class="inputInfo0 labelLeft" style="display:none;margin-right:24px;width:38%;" value="' + data.params[i].name + '">' + ' ' +
                                '<label class="labelRight" style="display:inline-block;">' + data.params[i].value + '</label>' +
                                '<input type="text" name="" class="inputInfo" style="display:none;" value="' + data.params[i].value + '">' +
                                '<a href="javascript:void[0]" class="delete" style="display:none;"><i class="group-remove"></i></a>' +
                                '</li>';
                        }
                        $('#infoCompany li:last-child').before(html)
                    } else {
                        $("#name").text(data.name);
                        $("#address").text(data.address);
                        $("#countries").text(data.countries);
                        $("#telephone").text(data.telephone);
                        $("#email").text(data.email);
                        $("#homepage").text(data.homepage);
                        $("#faxes").text(data.faxes);
                        $("#masterUserEmail").text('0');
                        $("#expireDate").text('0');
                        $("#expireDay").text('0');
                        $("#subAccountUse").text('0');
                        $("#subAccountTotal").text('0');
                        $("#edm").text('0');
                        $("#storageUse").text('0');
                        $("#storageTotal").text('0');
                    }
                }
            });
        }

        //清空
        $('#space').on('click', function () {
            $("#nameInput").val('');
            $("#addressInput").val('');
            $("#countriesInput").find('option').eq(0).attr('selected', true);
            $("#telephoneInput").val('');
            $("#emailInput").val('');
            $("#homepageInput").val('');
            $("#faxesInput").val('');
        });

        // 编辑
        $("#edit").on('click', function () {
            $('#space').show();
            $(this).hide();
            $(".inputInfo").show();
            $(".inputInfo0").show();
            $(".selectInfo").show();
            $(".labelRight").hide();
            $(".buttonSet").show();
            $("#addList").show();
            $(".labelSet").hide();
            $(".delete").show();
            $(".list-group-item").each(function () {
                var text = $(this).find(".labelRight").text();
                var valLeft = $(this).find(".set").text();
                $(this).find(".inputInfo").val(text);
                $(this).find("input.labelLeft").val(valLeft);
            });
        });
        // 保存
        $("#save").on('click', function () {
            var id = $('#name').attr('data-id');
            var nameVal = $("#nameInput").val();
            var addressVal = $("#addressInput").val();
            var countriesVal = $("#countriesInput option:selected").val();
            var telephoneVal = $("#telephoneInput").val();
            var emailVal = $("#emailInput").val();
            var homepageVal = $("#homepageInput").val();
            var faxesVal = $("#faxesInput").val();
            var value = '';
            for (var i = 0; i < $('.list-group-itemNew').length; i++) {
                if ($('.list-group-itemNew').eq(i).find('input[type=text]').eq(0).val() !== '') {
                    var dataJson = {
                        name: $('.list-group-itemNew').eq(i).find('input[type=text]').eq(0).val(),
                        value: $('.list-group-itemNew').eq(i).find('input[type=text]').eq(1).val()
                    }
                    dataJson = JSON.stringify(dataJson)
                } else {
                    $.Alert('请填写自定义字段名称')
                    return
                }
                value += dataJson + ','
            }
            value = value.substring(0, value.length - 1);
            var data = {
                id: id,
                name: nameVal,
                address: addressVal,
                countries: countriesVal,
                telephone: telephoneVal,
                email: emailVal,
                homepage: homepageVal,
                faxes: faxesVal
            }
            data = JSON.stringify(data);
            data = data.substring(0, data.length - 1) + ',' + '"params":[' + value + ']}'
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/sys/v1/vendor/edit",
                dataType: "json",
                data: {
                    data: data
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    window.location.reload();
                    // $.Alert("保存成功！");
                }
            });
            $(".inputInfo").hide();
            $(".inputInfo0").hide();
            $(".labelRight").show();
            $(".selectInfo").hide();
            $(".buttonSet").hide();
            $("#addList").hide();
            $(".labelSet").show();
            $(".delete").hide();
            $('#space').hide();
            $('#edit').show();
            $(".list-group-item").each(function () {
                var oThis = $(this);
                var val = $(this).find(".inputInfo").val();
                var valLeft = $(this).find("input.labelLeft").val();
                $(this).find(".labelRight").text(val);
                $(this).find(".set").text(valLeft);
                if (valLeft == "") {
                    oThis.remove();
                }
            });
        });
        // 取消
        $("#cancel").on('click', function () {
            $('#space').hide();
            $('#edit').show();
            $(".inputInfo").hide();
            $(".inputInfo0").hide();
            $(".selectInfo").hide();
            $(".labelRight").show();
            $(".buttonSet").hide();
            $("#addList").hide();
            $(".labelSet").show();
            $(".delete").hide();
        });
        // 删除
        $(document).on('click', '.delete', function () {
            $(this).parents("li.list-group-item").remove();
        });
        // 添加字段
        $(".addList").on('click', function () {
            var addContent = '<li class="list-group-item list-group-itemNew">' +
                '<label class="labelLeft labelSet" style="display:none;"><span class="set">自定义字段</span>：</label>' +
                '<input type="text" name="" class="inputInfo0 labelLeft" style="display:inline-block;margin-right:24px;width:38%;">' + ' ' +
                '<label class="labelRight" style="display:none;">自定义属性</label>' +
                '<input type="text" name="" class="inputInfo" style="display:inline-block;">' +
                '<a href="javascript:void[0]" class="delete" style="display:inline-block;"><i class="group-remove"></i></a>' +
                '</li>';
            $(this).parents("li.list-group-item").before(addContent);
        });
        infoAjax();
    });
});



