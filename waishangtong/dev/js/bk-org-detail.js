require(['common'], function () {
    require(['maintab', 'blockUI', 'ztree'], function (maintab) {
        var id = $.GetQueryString('id'),
            targetType = 0;
        //获取角色
        var arr=[];
        function getRole() {
            $.ajax({
                type: "GET",
                url: Base.sitUrl + "/api/org/v1/org/role/list",
                success: function (data) {
                    var list = '';
                    for (var i = 0; i < data.data.length; i++) {
                        list += '<option value="' + data.data[i].id + '">' + data.data[i].name + '</option>';
                    }
                    $('#popEditRole').append(list);
                }
            })
        }
        getRole();
        //查询性别和部门角色
        var popEditGender='';
        $("#pop-add-edit").on('click', function () {
            $.ajax({
                type: "Get",
                url: Base.sitUrl + "/api/org/v1/org/staff/list/detail",
                data: {
                    id: id,
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    arr=data;
                    popEditGender=data.gender;
                    $("#popEditRole option[value='"+arr.roleId+"']").attr("selected",true);
                    if (data.gender == 1) {
                        $("#man").attr("checked", true).parent().addClass("checked");
                        $("#woman").attr("checked", false).parent().removeClass("checked");
                    } else {
                        $("#woman").attr("checked", true).parent().addClass("checked");
                        $("#man").attr("checked", false).parent().removeClass("checked");
                    }
                    if (data.isAdmin == 0) {
                        $("#staff").prop("checked", true).parent().addClass("checked");
                    } else {
                        $("#department").prop("checked", true).parent().addClass("checked");
                    }

                }
            })
            //角色编辑
            $("#panel-modal-pop").hide();
            $("#edit-modal").show();
            $("#popEditName").val($("#pop-name").text());
            $("#popEditEmail").val($("#pop-email").text());
            $("#edit-pop-dep").val($("#pop-status").text());
            $("#edit-modal .popId").text($("#panel-modal-pop .popId").text());
        });
        $("#pop-edit-save").on('click', function () {
            var popEditName = $("#popEditName").val();
            var popEditEmail = $("#popEditEmail").val();
            var popId = $("#edit-modal .depId").text();
            var depId = $("#edit-modal .popId").text();
            var popRole = $("#popEditRole").find("option:selected").val();

            if($("#edit-modal .gender").attr("checked")){
                popEditGender = $(this).data("num");
            }else{
                $("#edit-modal .gender").find("input[type=radio]").each(function () {
                    if ($(this).is(":checked")) {
                        popEditGender = $(this).data("num");
                    }
                });
            }
            $("#edit-modal .gender1").find("input[type=radio]").each(function () {
                if ($(this).is(":checked")) {
                    popEditGender1 = $(this).data("num");
                }
            });
            var popEditDep = $("#edit-pop-dep").val();
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoDetail");
            var nodes = treeObj.getSelectedNodes();
            if (popEditName == "" || popEditEmail == "" || popEditDep == "") {
                $.Alert("请填写带星号的内容");
            } else {
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/org/v1/org/staff/edit",
                    dataType: "json",
                    data: {
                        id: id,
                        name: popEditName,
                        email: popEditEmail,
                        isAdmin: popEditGender1,
                        gender: popEditGender,
                        roleId: popRole,
                        department: nodes[0].id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
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
            }
        });
        //查询角色详情
        $.ajax({
            type: "POST",
            url: Base.sitUrl + "/api/org/v1/org/staff/list/detail",
            dataType: "json",
            data: {
                id: id
            },
            success: function (result) {
                if (!result.success) {
                    $.Alert(result.message);
                    return;
                }
                var data = result.data;
                var statusName = "";
                if (data.status == 1) {
                    statusName = "已激活";
                } else if (data.status == 2) {
                    statusName = "已禁用";
                } else if (data.status == 3) {
                    statusName = "已邀请";
                } else if (data.status == 4) {
                    statusName = "未激活";
                } else if (data.status == 5) {
                    statusName = "已离职";
                } else if (data.status == 0) {
                    statusName = "未知";
                }
                ;
                if (data.gender == 1) {
                    gender = "男"
                } else {
                    gender = "女"
                }
                $("#pop-name").text(testNull(data.name));
                $("#pop-email").text(testNull(data.email));
                $("#pop-gender").text(testNull(gender));
                $("#pop-role").text(testNull(data.roleName));
                $("#pop-status").text(testNull(statusName));
                $("#client-num").text(testNull(data.customerNum));
                $("#pop-time").text(testNull(data.lastLoginTime));
                $("#panel-modal-pop .depId").text(testNull(data.id));
                $("#panel-modal-pop .popId").text(testNull(data.department));
                var treeObj = $.fn.zTree.getZTreeObj("treeDemoDetail");
                var node = treeObj.getNodeByParam("id", data.department);
                treeObj.selectNode(node);
                setting.callback.onClick = onClick;
            }
        });
        // 树结构设定
        var IDMark_A = "_a";
        var setting = {
            view: {
                addDiyDom: addDiyDom,
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
                beforeDrag: beforeDrag
            }
        };

        //树结构
        var log, className = "dark";

        function beforeDrag(treeId, treeNodes) {
            return false;
        }

        //部门人员人数
        function addDiyDom(treeId, treeNode) {
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/organization/list",
                dataType: "json",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    var a = $("#treeDemo").find("a");
                    if (treeNode.parentNode && treeNode.parentNode.id != 2) return;
                    var aObj = $("#" + treeNode.tId + IDMark_A);
                    for (var i = 0; i < data.length; i++) {
                        if (treeNode.id == data[i].id) {
                            $.ajax({
                                type: "POST",
                                url: Base.sitUrl + "/api/org/v1/org/staff/list",
                                dataType: "json",
                                data: {
                                    department: treeNode.id
                                },
                                success: function (result) {
                                    if (!result.success) {
                                        $.Alert(result.message);
                                        return;
                                    }
                                    var data = result.data;
                                    var editStr = "<span class='ztreepopNum' id='diyBtn_" + treeNode.id + "' title='" + treeNode.name + "'>" + data.length + "</span>";
                                    aObj.after(editStr);
                                }
                            });
                        }
                    }
                }
            });
        }

        //树结构
        var zNodes = new Array();
        $.ajax({
            type: "POST",
            url: Base.sitUrl + "/api/org/v1/org/organization/list",
            dataType: "json",
            async: false,
            success: function (result) {
                if (!result.success) {
                    $.Alert(result.message);
                    return;
                }
                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    zNodes[i] = {
                        id: data[i].id,
                        pId: data[i].pid,
                        name: data[i].name,
                        open: true
                    }
                }
                $.fn.zTree.init($("#treeDemoDetail"), setting, zNodes);
                $("#selectAll").bind("click", selectAll);
            }
        });
        function onClick(e, treeId, treeNode) {
            showLog("[ " + getTime() + " onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }

        function showLog(str) {
            if (!log) log = $("#log");
            log.append("<li class='" + className + "'>" + str + "</li>");
            if (log.children("li").length > 8) {
                log.get(0).removeChild(log.children("li")[0]);
            }
        }

        function getTime() {
            var now = new Date(),
                h = now.getHours(),
                m = now.getMinutes(),
                s = now.getSeconds(),
                ms = now.getMilliseconds();
            return (h + ":" + m + ":" + s + " " + ms);
        }

        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
        }

        //字段空值
        function testNull(test) {
            if (test == null) {
                return "";
            } else {
                return test;
            }
        }
    });
});