require([ 'common' ], function () {
    require(['maintab', 'ztree'], function (maintab) {
        maintab.init();
        //树结构设定
        var setting = {
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true,
                    roleId: 0
                }
            },
            callback: {
            }
        };
        //角色管理
        $(document).on('mouseenter', '.list-group-item', function () {
            $(this).children("label.pop-set").show();
        });
        $(document).on('mouseleave', '.list-group-item', function () {
            $(this).children("label.pop-set").hide();
        });

        // MODAL ANIMATE
        $("#pop-add").on('click', function () {
            $("#add-modal").animate({
                right: '0'
            });
        });
        $(".modal-close-a").on('click', function () {
            $(".panel-modal").animate({
                right: '-900px'
            });
        });
        //查询角色
        $(".popSearch").on('click', function () {
            var queryName = $(".manege-search").val();
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/role/list",
                dataType: "json",
                data: {
                    name: queryName
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    $(".list-group").children().remove();
                    $(".list-group").empty();
                    for (var i = 0; i < data.length; i++) {
                        var liName = '<li class="list-group-item" data-roleId="' + data[i].id + '">' +
                            '<label class="popPSname" data-roleId="' + data[i].id + '">' + data[i].name + '</label>' +
                            '<label class="pop-set"><a href="javascript:" class="editPOP"><i class="i-edit"></i></a><a href="javascript:" class="removePOP"><i class="group-remove"></i></a></label>' +
                            '</li>';
                        $(".list-group").append(liName);
                    }
                }
            });
        });
        //角色管理
        $.list = function () {
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/role/list",
                dataType: "json",
                success: function (result) {
                    var data = result.data;
                    if (!result.success) {
                        $.Alert(result.message);
                        return
                    }
                    $("#list-group").empty();
                    for (var i = 0; i < data.length; i++) {
                        if (i == 0) {
                            var liName = '<li class="list-group-item" data-roleId="' + data[i].id + '">' +
                                '<label class="popPSname active" style="color:#4c73ec" data-roleId="' + data[i].id + '">' + data[i].name + '</label>' +
                                '<label class="pop-set"><a href="javascript:" class="editPOP"><i class="i-edit"></i></a><a href="javascript:" class="removePOP"><i class="group-remove"></i></a></label>' +
                                '</li>';
                        } else {
                            var liName = '<li class="list-group-item" data-roleId="' + data[i].id + '">' +
                                '<label class="popPSname" data-roleId="' + data[i].id + '">' + data[i].name + '</label>' +
                                '<label class="pop-set"><a href="javascript:" class="editPOP"><i class="i-edit"></i></a><a href="javascript:" class="removePOP"><i class="group-remove"></i></a></label>' +
                                '</li>';
                        }
                        $("#list-group").append(liName);
                    }
                    listOne(data[0].id)
                }
            });
        }

        //列表角色查询
        function reAjax() {
            $("#list-group").children().remove();
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/role/list",
                dataType: "json",
                success: function (result) {
                    var data = result.data;
                    $(".list-group").empty();
                    for (var i = 0; i < data.length; i++) {
                        var liName = '<li class="list-group-item" data-roleId="' + data[i].id + '">' +
                            '<label class="popPSname" data-roleId="' + data[i].id + '">' + data[i].name + '</label>' +
                            '<label class="pop-set"><a href="javascript:" class="editPOP"><i class="i-edit"></i></a><a href="javascript:" class="removePOP"><i class="group-remove"></i></a></label>' +
                            '</li>';
                        $(".list-group").append(liName);
                    }
                }
            });
        }

        //查看角色备注
        var arr=[];
        $.ajax({
            type: "get",
            url: Base.sitUrl + "/api/org/v1/org/role/list",
            success: function (data){
                if(data.success){
                    arr=data.data;
                }else{
                    $.Alert(result.message);
                    return;
                }

            }
        })
        //修改角色
        $(document).on('click', '.editPOP', function () {
            $("#edit-modal").animate({
                right: '0'
            });
            var popNAME = $(this).parents(".list-group-item").find(".popPSname").text();
            var roleId = $(this).parents(".list-group-item").find(".popPSname").attr("data-roleId");
            var remarkIdx = $(this).parents('.list-group-item').index();
            $('#edit-remark').val(arr[remarkIdx].remark);
            $("#pop-edit-name").val(popNAME);
        });
            $("#pop-edit-save").on('click', function () {
                var popEditName = $("#pop-edit-name").val();
                var remark = $("#edit-remark").val();
                if (popEditName == "") {
                    $.Alert("角色名不能为空");
                } else {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/role/edit",
                        dataType: "json",
                        data: {
                            id: roleId,
                            name: popEditName,
                            remark: remark,
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            $.Alert("添加成功！");
                            window.location.reload();
                        }
                    });
                }
            });


        //删除角色
        $(document).on('click', '.removePOP', function () {
            var roleId = $(this).parents(".list-group-item").find(".popPSname").attr("data-roleId");
            $.Confirm("确认删除？", "", function () {
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/org/v1/org/role/delete",
                    dataType: "json",
                    data: {
                        id: roleId
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        reAjax();
                    }
                });
            });
        });

        $('#saveTree').unbind('click').bind('click', function () {
            SaveTree()
        })
        function SaveTree() {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
            var nodes = treeObj.getCheckedNodes(true);
            var nodesNo = treeObj.getCheckedNodes(false);
            var permissionIds = '';
            var rolePermissionIds = '';
            for (var i = 0; i < nodes.length; i++) {
                if (nodes[i].rolePermissionId == 0) {
                    permissionIds += nodes[i].id + ','
                }
            }
            for (var i = 0; i < nodesNo.length; i++) {
                if (nodesNo[i].rolePermissionId !== 0) {
                    rolePermissionIds += nodesNo[i].rolePermissionId + ','
                }
            }
            permissionIds = permissionIds.substring(0, permissionIds.length - 1);
            rolePermissionIds = rolePermissionIds.substring(0, rolePermissionIds.length - 1);
            var roleId = $('#list-group').find('.active').attr('data-roleid');
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/role/permission/save/batch",
                dataType: "json",
                data: {
                    roleId: roleId,
                    permissionIds: permissionIds,
                    ids: rolePermissionIds
                },
                beforeSend: function (XHR) {
                    $.BlockUI();
                },
                complete: function (XHR, TS) {
                    $.UnblockUI();
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    $('label.popPSname.active').click();
                    $.Alert('保存成功')
                }
            });
        }
        $.list();

        //查询角色权限
        $(document).on('click', 'label.popPSname', function () {
            $(this).addClass('active');
            $(this).css('color', '#4c73ec');
            $(this).parents('li').siblings().find('label.popPSname').removeClass('active');
            $(this).parents('li').siblings().find('label.popPSname').css('color', '#3c3c3c');
            var roleId = $(this).attr("data-roleId");
            var zNodes = new Array();
            var status = "";
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/role/permission/list",
                dataType: "json",
                data: {
                    roleId: roleId
                },
                beforeSend: function (XHR) {
                    $.BlockUI();
                },
                complete: function (XHR, TS) {
                    $.UnblockUI();
                },
                success: function (result) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].hasRight == 1) {
                            status = true
                        } else {
                            status = false
                        }
                        zNodes[i] = {
                            id: data[i].permissionId,
                            pId: data[i].permissionPid,
                            name: data[i].name,
                            roleId: roleId,
                            rolePermissionId: data[i].rolePermissionId,
                            checked: status,
                            open: false
                        }
                    }
                    var code;

                    function setCheck() {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                            py = $("#py").attr("checked") ? "p" : "",
                            sy = $("#sy").attr("checked") ? "s" : "",
                            pn = $("#pn").attr("checked") ? "p" : "",
                            sn = $("#sn").attr("checked") ? "s" : "",
                            type = { "Y": 'ps', "N": 's'};
                        zTree.setting.check.chkboxType = type;
                        showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
                    }

                    function showCode(str) {
                        if (!code) code = $("#code");
                        code.empty();
                        code.append("<li>" + str + "</li>");
                    }

                    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                    setCheck();
                    $("#py").bind("change", setCheck);
                    $("#sy").bind("change", setCheck);
                    $("#pn").bind("change", setCheck);
                    $("#sn").bind("change", setCheck);
                }
            });
        });

        function listOne(roleId) {
            var zNodes = new Array();
            var status = "";
            var rolePermissionId = "";
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/role/permission/list",
                dataType: "json",
                data: {
                    roleId: roleId
                },
                beforeSend: function (XHR) {
                    $.BlockUI();
                },
                complete: function (XHR, TS) {
                    $.UnblockUI();
                },
                success: function (result) {
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].hasRight == 1) {
                            status = true
                        } else {
                            status = false
                        }
                        zNodes[i] = {
                            id: data[i].permissionId,
                            pId: data[i].permissionPid,
                            name: data[i].name,
                            roleId: roleId,
                            rolePermissionId: data[i].rolePermissionId,
                            checked: status
                        }
                    }
                    var code;
                    function setCheck() {
                        var zTree = $.fn.zTree.getZTreeObj("treeDemo"),
                            py = $("#py").attr("checked") ? "p" : "",
                            sy = $("#sy").attr("checked") ? "s" : "",
                            pn = $("#pn").attr("checked") ? "p" : "",
                            sn = $("#sn").attr("checked") ? "s" : "",
                            type = { "Y": 'ps', "N": 's'};
                        zTree.setting.check.chkboxType = type;
                        showCode('setting.check.chkboxType = { "Y" : "' + type.Y + '", "N" : "' + type.N + '" };');
                    }

                    function showCode(str) {
                        if (!code) code = $("#code");
                        code.empty();
                        code.append("<li>" + str + "</li>");
                    }

                    $.fn.zTree.init($("#treeDemo"), setting, zNodes);
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemo");
                    var expandNodes = treeObj.getNodesByParam("level", "0", null);
                    expandNodes = expandNodes.concat(treeObj.getNodesByParam("level", "1", null));
                    for(var i=0;i<expandNodes.length;i++){
                        treeObj.expandNode(expandNodes[i], true, false, false);
                    }
                    setCheck();
                    $("#py").bind("change", setCheck);
                    $("#sy").bind("change", setCheck);
                    $("#pn").bind("change", setCheck);
                    $("#sn").bind("change", setCheck);
                }
            });
        }


    });
});