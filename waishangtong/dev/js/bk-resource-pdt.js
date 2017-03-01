require([ 'common' ], function () {
    require([ 'jqform', 'jqueryUI'], function () {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code]').each(function(){
            for(var i=0; i<funcList.length; i++){
                if(funcList[i].code == $(this).attr('data-code')){//添加客户
                    $(this).removeClass('none');
                }
            };
        });
        // 资源设置左边栏切换
        $("#group-set-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#group-set").show();
            $("#group-set").siblings(".panel-body").hide();
            $('.panel-left').height($('.panel-right').height())
        });
        $("#pdt-li").on('click', function () {
            $(this).children(".panel-left-label").addClass("active");
            $(this).siblings().find(".panel-left-label").removeClass("active");
            $("#pdtIn-set").show();
            $("#pdtIn-set").siblings(".panel-body").hide();
            pdt1();
            pdtGroup();
            uploadHis();
        });
        // 添加分组
        $(".addGoup").on('click', function () {
            var groupLen = $(this).prev("ul").find('li').length;

            var addCont = '<li data-id="" data-type="1" data-totalCount="">' +
                '<i class="iconfont group-move"></i>' +
                '<input type="text" class="resource-input" value="" placeholder="">' +
                '<i class="iconfont group-remove"></i>' +
                '</li>';
            $(this).prev("ul").append(addCont);
            $('#group-set-save').show();
        });
        //分组设置.查询列表
        groupRe();
        $("#group-set-li").on('click', function () {
            groupRe();
        });
        function groupRe() {
            $("#group-set ul").children("li").remove();
            $.ajax({
                url: Base.sitUrl + "/api/product/v1/product/catelog/list",
                dataType: "json",
                type: "POST",
                success: function (result) {
                    if (!result.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = result.data;
                    if (data.length > 0) {
                        $('#group-set-save').show();
                    }
                    for (var i = 0; i < data.length; i++) {
                        var sign = data[i].name.substring(0, 1);
                        var liList = '<li data-id="' + data[i].id + '" data-type="" data-totalCount="' + data[i].totalCount + '">' +
                            '<i class="iconfont group-move"></i>' +
                            '<input type="text" class="resource-input" value="' + data[i].name + '" placeholder="">' +
                            '<i class="iconfont group-remove"></i>' +
                            '</li>';
                        $("#group-set ul").append(liList);
                    }
                }
            });
        }

        //分组设置删除
        $(document).on('click', '#group-set .group-remove', function () {
            var $oThis = $(this);
            var totalCount = parseInt($(this).parents('li').attr('data-totalCount'));
            if (totalCount > 0) {
                $.Alert('此状态中有关联信息,请取消后删除')
            } else {
                $.Confirm("确认删除？", "", function () {
                    $oThis.parent().hide();
                    $oThis.parent("").attr("data-type", "2");
                });
            }
        });

        //拖动重新排序
        $(".resource-ul").sortable({
            change: function (event, ui) {
                console.log(ui.item.index());
            }
        });

        //分组设置.修改列表
        $("#group-set-save").on('click', function () {
            var liI = $("#group-set ul").children("li");
            var dataJson = "";
            var editData = "";
            var typeVal = "";
            for (var i = 0; i < liI.length; i++) {
                var inputNum = liI.eq(i).find("input[type=text]").val();
                var orders = liI.eq(i).index() + 1;
                if (liI.eq(i).data("type") !== "") {
                    typeVal = liI.eq(i).data("type");
                } else {
                    typeVal = 3;
                }
                if (inputNum == "" && liI.eq(i).css('display') !== 'none') {
                    $.Alert("名称不能为空！");
                    return;
                }
                var dataLi = '{"key":"' + liI.eq(i).data("id") + '","value":"' + inputNum + '","type":"' + typeVal + '","valueI":"' + orders + '"}' + ',';
                if (inputNum == "") {
                    dataLi = '';
                } else {
                    dataJson += dataLi;
                }
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueTypes":[' + dataJson + ']}';
            $.ajax({
                url: Base.sitUrl + "/api/org/v1/org/staff/product/catelog/edit",
                dataType: "json",
                type: "POST",
                data: {
                    data: editData
                },
                success: function (result) {
                    if (!result.success) {
                        $.unLogin(res);
                        return;
                    }

                    $.Alert("保存成功！");
                    groupRe();
                }
            });
        });

        //产品导入
        //获取产品类型
        function pdt1() {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=0',
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    ;
                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt1").empty().append('<option value="">请选择产品类型</option>').append(list);
                }
            })
        }

        $("#pdt1").on('change', function () {
            var id = $("#pdt1 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt2").empty().append('<option value="">请选择产品类型</option>').append(list);
                }
            })
        })
        $("#pdt2").on('change', function () {
            var id = $("#pdt2 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt3").empty().append('<option value="">请选择产品类型</option>').append(list);
                }
            })
        })
        $("#pdt3").on('change', function () {
            var id = $("#pdt3 option:selected").val();
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/type/sublist?pid=' + id,
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = res.data,
                        list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdt4").empty().append('<option value="">请选择产品类型</option>').append(list);
                }
            })
        })
        //获取产品分组
        function pdtGroup() {
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/catelog/list',
                type: 'GET',
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data;
                    var list = "";
                    for (var i = 0; i < data.length; i++) {
                        list += '<option value="' + data[i].id + '">' + data[i].name + '</option>'
                    }
                    $("#pdtGroup").empty().append('<option value="">请选择产品分组</option>').append(list);
                }
            })
        }

        //下载导入模板
        function downloadTem() {
            window.location.href = Base.sitUrl + '/api/product/v1/product/template/download';
        }

        $("#downloadTem").on('click', function () {
            downloadTem();
        });
        //添加附件
        $(".add-attachment").on('click', function () {
            if ($("#addFiles").children("li").length > 0) {
                $.Alert("只支持一个上传文件");
                return false;
            } else {
                return $('#up-files').click();
            }
        });
        $('#up-files').on('change', function (e) {
            $.EventFn(e);
            var sign = fileLimit($(this));
            uploadFujian(sign.name);
        });
        //  上传附件
        function uploadFujian(name, dictFileUpType) {
            $('#form_file').ajaxForm({
                url: Base.sitUrl + '/api/file/upload',
                beforeSend: function () {
                    $.BlockUI();
                },
                complete: function () {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var url = 'http://' + res.data;
                    var html = '<li data-url="' + url + '" style="display: inline-block;padding: 5px 0;"><i class=""></i><span class="filesName">' + name + '</span>&nbsp;&nbsp;&nbsp;<span class="file-del" style="color:#4b73ec;cursor:pointer;">删除</span></li>';
                    $('#addFiles').prepend(html);
                }
            }).submit();
        }

        function fileLimit(obj) {
            var flag = true;
            var fileObj = obj.prop('files');
            var size = Math.round(fileObj[0].size / 1024 * 100) / 100 / 1024;//MB
            var sizeS = fileObj[0].size;
            if (size > 5) {
                $.Alert('上传附件需小于5MB');
                flag = false;
            }
            return {flag: flag, name: fileObj[0].name, size: sizeS};
        }

        //删除上传表格
        $(document).on('click', '.file-del', function () {
            $(this).parent().remove();
        });
        //产品上传
        function pdtUpload() {
            var productCatelog;
            var productType1 = $("#pdt1 option:selected").val();
            var productType2 = $("#pdt2 option:selected").val();
            var productType3 = $("#pdt3 option:selected").val();
            var productType4 = $("#pdt4 option:selected").val();
            if (productType4 !== undefined && productType4 !== "") {
                productType = productType4;
            } else if (productType3 !== undefined && productType3 !== "") {
                productType = productType3;
            } else if (productType2 !== undefined && productType2 !== "") {
                productType = productType2;
            } else if (productType1 !== undefined && productType1 !== "") {
                productType = productType1;
            }
            var productCatelog = $("#pdtGroup option:selected").val();
            if ($("#addFiles").find("li").length < 1) {
                $.Alert('请添加产品模板')
                return
            }
            var fileName = $("#addFiles").find("li").eq(0).find('.filesName').text();
            var path = $("#addFiles").find("li").eq(0).attr("data-url");
            var data = {
                productType: productType,
                productCatelog: productCatelog,
                url: path,
                taskName: fileName,
                fileName: fileName
            }
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/import',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                beforeSend: function () {
                    $.BlockUI();
                },
                complete: function () {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    uploadHis();
                    $.Alert('上传成功')
                }
            });
        }

        $("#pdtUpload").on('click', function () {
            pdtUpload();
        });
        //  分页
        var pageObj = {
            homepage: 1,
            currentPage: 1,
            lastpage: null,
            pageSize: 10
        };
        //导入历史
        function uploadHis() {
            var data = {
                currentPage: pageObj.currentPage,
                pageSize: pageObj.pageSize
            };
            $.ajax({
                url: Base.sitUrl + '/api/product/v1/product/import/history',
                type: 'POST',
                data: {
                    currentPage: pageObj.currentPage,
                    pageSize: pageObj.pageSize
                },
                dataType: 'json',
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var data = res.data.results;
                    var pageNum = res.data.totalItem;
                    var trList = "";
                    for (var i = 0; i < data.length; i++) {
                        var time = data[i].createTime;
                        if (data[i].status == 1) {
                            var status = '导入中';
                        } else if (data[i].status == 2) {
                            var status = '导入成功';
                        }
                        trList += '<tr data-id="' + data[i].id + '">' +
                            '<td>' + data[i].taskName + '</td>' +
                            '<td>' + time + '</td>' +
                            '<td>' + data[i].productCatelog + '</td>' +
                            '<td>' + status + '</td>' +
                            '<td>' + data[i].productSum + '</td>' +
                            '<td><span class="del-td" style="color:#4b73ec;cursor:pointer;">删除本次导入产品</span></td>' +
                            '</tr>';
                    }
                    $(".table tbody").empty().append(trList);
                    $('.i-content-wrapper').stop().animate({'scrollTop': 0}, 500);
                    $('.panel-left').height($('.panel-right').height())
                }
            })
        }

        $(document).on('click', '.del-td', function () {
            var id = $(this).parents("tr").attr("data-id");
            $.Confirm('确认删除？', '', function () {
                $.ajax({
                    url: Base.sitUrl + '/api/product/v1/product/import/delete',
                    type: 'POST',
                    dataType: 'json',
                    data: {
                        id: id
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.unLogin(res);
                            return;
                        }
                        uploadHis();
                        $(this).parents("td").remove();
                    }
                });
            });
        });
    });
});