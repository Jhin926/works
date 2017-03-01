require([ 'common' ], function () {
    require(['maintab', 'ztree', 'blockUI'], function (maintab) {
        //显示相应的功能按钮
        var funcList = top.funcList;
        $('[data-code]').each(function(){
            for(var i=0; i<funcList.length; i++){
                if(funcList[i].code == $(this).attr('data-code')){//添加客户
                    $(this).removeClass('none');
                }
            };
        });

        // 右侧弹窗初始化
        maintab.init();
        // 树结构设定
        var IDMark_A = "_a";
        var setting = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
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
                beforeDrag: beforeDrag,
                beforeEditName: beforeEditName,
                beforeRemove: beforeRemove,
                beforeRename: beforeRename,
                onRemove: onRemove,
                onRename: onRename
            }
        };
        var settingPlus = {
            view: {
                addHoverDom: addHoverDom,
                removeHoverDom: removeHoverDom,
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
                beforeDrag: beforeDrag,
                beforeEditName: beforeEditName,
                beforeRemove: beforeRemove,
                beforeRename: beforeRename,
                beforeClick: queryDepPop,
                onRemove: onRemove,
                onRename: onRename,
                onClick: onClick
            }
        };
        //树结构
        var log, className = "dark";

        function beforeDrag(treeId, treeNodes) {
            return false;
        }

        function dataOrg() {
            var data;
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
                    data = result.data;
                }
            });
            return data;
        }

        var dataOrgJson = dataOrg();
        //部门人员人数
        function addDiyDom(treeId, treeNode) {
            var data = dataOrgJson;
            var a = $("#treeDemo").find("a");
            if (treeNode.parentNode && treeNode.parentNode.id != 2) return;
            var aObj = $("#" + treeNode.tId + IDMark_A);
            for (var i = 0; i < data.length; i++) {
                if (treeNode.id == data[i].id) {
                    var editStr = "<span class='ztreepopNum' id='diyBtn_" + treeNode.id + "' title='" + treeNode.name + "'>" + data[i].staffSum + "</span>";
                    aObj.after(editStr);
                }
            }
        }

        //树结构
        var zNodes = new Array();
        var data = dataOrgJson;
        for (var i = 0; i < data.length; i++) {
            zNodes[i] = {
                id: data[i].id,
                pId: data[i].pid,
                name: data[i].name,
                staffSum: data[i].staffSum,
                open: true
            }
        }
        $.fn.zTree.init($("#treeDemo"), settingPlus, zNodes);
        $.fn.zTree.init($("#treeDemoBtn"), setting, zNodes);
        $.fn.zTree.init($("#treeDemoAdd"), setting, zNodes);
        $("#selectAll").bind("click", selectAll);
        //树结构查询部门人员
        function queryDepPop(treeId, treeNode) {
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
                    var pageLeftUserName = $('#pageLeftUserName', parent.document).attr('data-admin');
                    $(".table tbody").children().remove();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].status == 1) {
                            statusName = "已激活";
                        } else if (data[i].status == 2) {
                            statusName = "已禁用";
                        } else if (data[i].status == 3) {
                            statusName = "已邀请";
                        } else if (data[i].status == 4) {
                            statusName = "未激活";
                        } else if (data[i].status == 5) {
                            statusName = "已离职";
                        } else if (data[i].status == 0) {
                            statusName = "未知";
                        }
                        ;
                        if (data[i].isAdmin == 1) {
                            isAdmin = "部门管理员"
                        } else {
                            isAdmin = "普通员工"
                        }
                        if (pageLeftUserName == data[i].id) {
                            var disabled = 'disabled'
                        } else {
                            var disabled = ''
                        }
                        var liName = '<tr data-id="' + data[i].id + '">' +
                            '<td><div class="checker" id="uniform-allCheckbox"><span><input type="checkbox" id="allCheckbox" data-id="' + data[i].id + '" data-roleId="' + data[i].roleId + '" data-dep="' + data[i].department + '"' + disabled + '></span></div></td>' +
                            '<td><a class="pop-name blue" href="bk-org-detail.html?id=' + data[i].id + '&v=' + window.ver + '" data-maintab>' + testNull(data[i].name) + '</a></td>' +
                            '<td>' + testNull(data[i].departmentName) + '</td>' +
                            '<td>' + testNull(data[i].email) + '</td>' +
                            '<td><label class="supervisor blue">' + testNull(isAdmin) + '</label></td>' +
                            '<td class="blue">' + testNull(data[i].roleName) + '</td>' +
                            '<td>' + testNull(statusName) + '</td>' +
                            '<td>' + testNull(data[i].lastLoginTime) + '</td>' +
                            '</tr>';
                        $(".table tbody").append(liName);
                    }
                    return data.length;
                }
            });
        }
        function onClick(e, treeId, treeNode) {
            showLog("[ " + getTime() + " onRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }
        function beforeEditName(treeId, treeNode) {
            className = (className === "dark" ? "" : "dark");
            showLog("[ " + getTime() + " beforeEditName ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.selectNode(treeNode);
            return confirm("确认进入编辑 " + treeNode.name + " 状态？")
        }

        //树结构删除
        function beforeRemove(treeId, treeNode) {
            className = (className === "dark" ? "" : "dark");
            showLog("[ " + getTime() + " beforeRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.selectNode(treeNode);
            var status = false
            if (parseInt(treeNode.staffSum) > 0) {
                $.Alert('不能删除有员工的部门')
                return false
            } else {
                if (confirm("确定删除 " + treeNode.name + " 吗")) {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/organization/delete",
                        dataType: "json",
                        data: {
                            id: treeNode.id
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            $.Alert("删除成功");
                            queryDep();
                        }
                    });
                    status = true
                }
            }
            return status
        }

        function onRemove(e, treeId, treeNode) {
            showLog("[ " + getTime() + " onRemove ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
        }

        //树结构重命名
        function beforeRename(treeId, treeNode, newName) {
            className = (className === "dark" ? "" : "dark");
            showLog("[ " + getTime() + " beforeRename ]&nbsp;&nbsp;&nbsp;&nbsp; " + treeNode.name);
            if (newName.length == 0) {
                alert("内容不能为空.");
                var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                setTimeout(function () {
                    zTree.editName(treeNode)
                }, 10);
                return false;
            } else {
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/org/v1/org/organization/edit",
                    dataType: "json",
                    data: {
                        id: treeNode.id,
                        name: newName
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        $.Alert("编辑成功");
                    }
                });
            }
            return true;
        }

        function onRename(e, treeId, treeNode) {
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

        var newCount = 1;

        function addHoverDom(treeId, treeNode) {
            var sObj = $("#" + treeNode.tId + "_span");
            if (treeNode.editNameFlag || $("#addBtn_" + treeNode.id).length > 0) return;
            var addStr = "<span class='button add' id='addBtn_" + treeNode.id
                + "' title='add node' onfocus='this.blur();'></span>";
            sObj.after(addStr);
            var btn = $("#addBtn_" + treeNode.id);
            //树结构添加部门
            if (btn) btn.on("click", function () {
                $(".addAll").show();
                $("input[name=addDep]").val("");
                $("input[name=ztreeEmail]").val("");
                $("input[name=ztreeName]").val("");
                $("#addBtnDep").unbind('click').on('click', function () {
                    var addDep = $("input[name=addDep]").val();
                    var treeNodeId = treeNode.id;
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    zTree.addNodes(treeNode, {id: (100 + newCount), pId: treeNode.id, name: addDep, staffSum: 0});
                    if (addDep == '') {
                        $.Alert("请填写完整");
                    } else {
                        $.ajax({
                            type: "POST",
                            url: Base.sitUrl + "/api/org/v1/org/organization/save",
                            dataType: "json",
                            data: {
                                name: addDep,
                                pid: treeNodeId
                            },
                            success: function (result) {
                                if (!result.success) {
                                    $.Alert(result.message);
                                    return;
                                }
                                // $.Alert("添加成功")
                                window.location.reload()
                                // queryDep();
                                $(".addAll").hide()
                            }
                        });
                    }
                });
                //树结构添加角色
                $("#addBtnUser").unbind('click').on('click', function () {
                    var addEmail = $("input[name=ztreeEmail]").val();
                    var addName = $("input[name=ztreeName]").val();
                    var addGender = $("#ztreeGender option:selected").val();
                    var treeNodeId = treeNode.id;
                    // var zTree = $.fn.zTree.getZTreeObj("treeDemo");
                    // zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:addDep});
                    if (addEmail == '' || addName == '') {
                        $.Alert("请填写完整");
                    } else {
                        $.ajax({
                            type: "POST",
                            url: Base.sitUrl + "/api/org/v1/org/staff/save",
                            dataType: "json",
                            data: {
                                name: addName,
                                email: addEmail,
                                gender: addGender,
                                department: treeNodeId
                            },
                            success: function (result) {
                                if (!result.success) {
                                    $.Alert(result.message);
                                    return;
                                }
                                $.Alert("添加成功");
                                queryDep();
                                $(".addAll").hide();
                            }
                        });
                    }
                });
            });
        };
        function removeHoverDom(treeId, treeNode) {
            $("#addBtn_" + treeNode.id).parent().siblings(".ztreepopNum").show();
            $("#addBtn_" + treeNode.id).unbind().remove();
        };
        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
        }

        //关闭树结构新增
        $(".addAll-close").on('click', function () {
            $(".addAll").hide();
        })

        //查询部门函数
        function queryDep() {
            var zNodes = new Array();
            var data = dataOrg();
            for (var i = 0; i < data.length; i++) {
                zNodes[i] = {
                    id: data[i].id,
                    pId: data[i].pid,
                    name: data[i].name,
                    staffSum: data[i].staffSum,
                    open: true
                }
            }
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
            $("#selectAll").bind("click", selectAll);
        }

        // MODAL ANIMATE
        $("#pop-add").on('click', function () {
            $("#add-modal").animate({
                right: '0'
            });
        });

        //获取总列表
        $.ajax({
            type: "POST",
            url: Base.sitUrl + "/api/org/v1/org/staff/list",
            dataType: "json",
            success: function (result) {
                if (!result.success) {
                    $.Alert(result.message);
                    return;
                }
                var data = result.data;
                var pageLeftUserName = $('#pageLeftUserName', parent.document).attr('data-admin');
                $(".table tbody").children().remove();
                for (var i = 0; i < data.length; i++) {
                    if (data[i].status == 1) {
                        statusName = "已激活";
                    } else if (data[i].status == 2) {
                        statusName = "已禁用";
                    } else if (data[i].status == 3) {
                        statusName = "已邀请";
                    } else if (data[i].status == 4) {
                        statusName = "未激活";
                    } else if (data[i].status == 5) {
                        statusName = "已离职";
                    } else if (data[i].status == 0) {
                        statusName = "未知";
                    }
                    ;
                    if (data[i].isAdmin == 1) {
                        isAdmin = "部门管理员"
                    } else {
                        isAdmin = "普通员工"
                    }
                    if (pageLeftUserName == data[i].id) {
                        var disabled = 'disabled'
                    } else {
                        var disabled = ''
                    }
                    var liName = '<tr>' +
                        '<td><div class="checker" id="uniform-allCheckbox"><span><input type="checkbox" id="allCheckbox" data-id="' + data[i].id + '" data-roleId="' + data[i].roleId + '" data-dep="' + data[i].department + '"' + disabled + '></span></div></td>' +
                        '<td><a class="pop-name blue" href="bk-org-detail.html?id=' + data[i].id + '&v=' + window.ver + '" data-maintab>' + testNull(data[i].name) + '</a></td>' +
                        '<td>' + testNull(data[i].departmentName) +
                        '</td>' +
                        '<td>' + testNull(data[i].email) + '</td>' +
                        '<td><label class="supervisor blue">' + testNull(isAdmin) + '</label></td>' +
                        '<td class="blue">' + testNull(data[i].roleName) + '</td>' +
                        '<td>' + testNull(statusName) + '</td>' +
                        '<td>' + testNull(data[i].lastLoginTime) + '</td>' +
                        '</tr>';
                    $(".table tbody").append(liName);
                }
            }
        });

        //全选&&全不选
        $(".table thead tr input[type=checkbox]").on('click', function () {
            var pageLeftUserName = $('#pageLeftUserName', parent.document).attr('data-admin');
            if ($(".table thead tr input[type=checkbox]")[0].checked) {
                for (var i = 0; i < $(".table tbody tr input[type=checkbox]").length; i++) {
                    var checkboxI = $(".table tbody tr input[type=checkbox]").eq(i);
                    var id = $(".table tbody tr input[type=checkbox]").eq(i).attr('data-id');
                    if (pageLeftUserName == id) {
                        continue;
                    }
                    // checkboxI.parent().addClass("checked");
                    checkboxI.parents('tr').addClass("active");
                    checkboxI.parents("span").addClass("checked");
                    checkboxI.checked = true;
                }
            } else {
                for (var i = 0; i < $(".table tbody tr input[type=checkbox]").length; i++) {
                    var checkboxI = $(".table tbody tr input[type=checkbox]").eq(i);
                    checkboxI.parents("span").removeClass("checked");
                    checkboxI.parents('tr').removeClass("active");
                    checkboxI.checked = false;
                }
            }

        });
        //取消管理员权限按钮
        if ($("#pageLeftUserName", parent.document).attr("data-admin") != '1') {
            $("#depManageNot").remove();
            $(".depManage").remove();
        }
        //删除
        $("#delete").on('click', function () {
            var idS = "";
            var roleId = "";
            var depId = "";
            var adminId = new Array();
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                    adminId.push(checkboxI2.attr('data-id'))
                    // roleId	+= checkboxI2.attr('data-roleId');
                }
            }
            var pageLeftUserName = $('#pageLeftUserName', parent.document).attr('data-admin');
            idS = idS.substr(0, idS.length - 1);
            for (var i = 0; i < adminId.length; i++) {
                if (adminId[i] == pageLeftUserName) {
                    $.Alert('不能删除自己')
                    return
                }
            }
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认删除？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "delete",
                            department: depId
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            window.location.reload();
                        }
                    });
                });
            }
        });
        //分配角色
        $("#allotRole").on('click', function () {
            var idS = "";
            var roleId = "";
            var depId = "";
            var roleName = "";
            var roleLen = 0;
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                var roleNameI = $("tbody").find(".pop-name").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                    roleName += roleNameI.text() + " , ";
                    roleLen += 1;
                }
            }
            idS = idS.substr(0, idS.length - 1);
            roleName = roleName.substr(0, roleName.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $("#allot-modal").show();
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/org/v1/org/role/list",
                    dataType: "json",
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        var data = result.data;
                        var psList = "";
                        for (var i = 0; i < data.length; i++) {
                            psList += '<li data-roleNum="' + data[i].id + '">' +
                                '<input type="radio" name="rolesId" class="roleCheckbox">' +
                                '<label class="roleNameLabel" >' + data[i].name + '</label>' +
                                '</li>';
                        }
                        $("ul.roles-list").empty();
                        $("ul.roles-list").append(psList);
                        $("#rolesName").text(roleName);
                        $("#roleNUM").text(roleLen);
                    }
                });
            }
            $("#allot-modal-save").on('click', function () {
                for (var i = 0; i < $(".roles-list li input[type=radio]").length; i++) {
                    if ($(".roles-list li input[type=radio]")[i].checked) {
                        roleId = $(".roles-list li input[type=radio]").eq(i).parent().attr("data-roleNUM");
                    }
                }
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/org/v1/org/staff/set",
                    dataType: "json",
                    data: {
                        ids: idS,
                        setType: "setRole",
                        roleId: roleId
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        window.location.reload();
                        $("#allot-modal").hide();
                    }
                });
            });
        });

        //设置管理员
        $("#depManage").on('click', function () {
            var idS = "";
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                    // roleId	+= checkboxI2.attr('data-roleId');
                }
            }
            idS = idS.substr(0, idS.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认设置？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "setAdmin"
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ajaxRe();
                        }
                    });
                });
            }
        });
        //取消管理员
        $("#depManageNot").on('click', function () {
            var idS = "";
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                    // roleId	+= checkboxI2.attr('data-roleId');
                }
            }
            idS = idS.substr(0, idS.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认取消？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "setAdminNot"
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ajaxRe();
                        }
                    });
                });
            }
        });
        //修改部门
        $("#btnEditDep").on('click', function () {
            var idS = "";
            var roleId = "";
            var depId = "";
            var roleName = "";
            var roleLen = 0;
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                var roleNameI = $("tbody").find("label.pop-name").eq(i);
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                    roleName += roleNameI.text() + "，";
                    roleLen += 1;
                }
            }
            idS = idS.substr(0, idS.length - 1);
            roleName = roleName.substr(0, roleName.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $("#depEdit-modal").show();
                $("#editDep-modal-save").on('click', function () {
                    depId = $("#depEdit-modal input[name=editDepModal]");
                    var treeObj = $.fn.zTree.getZTreeObj("treeDemoBtn");
                    var nodes = treeObj.getSelectedNodes();
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "setDepartment",
                            department: nodes[0].id
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            window.location.reload();
                            $("#depEdit-modal").hide();
                        }
                    });
                });
            }
        });
        //发送激活邀请
        $("#invite").on('click', function () {
            var idS = "";
            var roleId = "";
            var depId = "";
            var on = 0;
            var name;
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    if (checkboxI2.parents('tr').find('td:nth-child(6)').text() == '') {
                        name = checkboxI2.parents('tr').find('td:nth-child(2)').find('a').text();
                        on = 1;
                        break;
                    }
                    if (checkboxI2.parents('tr').find('td:nth-child(7)').text() == '已激活') {
                        name = checkboxI2.parents('tr').find('td:nth-child(2)').find('a').text();
                        on = 2;
                        break;
                    }
                    idS += checkboxI2.attr('data-id') + ",";
                }
            }
            if (on == 1) {
                $.Alert(name + '未分配角色，不能发送邀请');
                return;
            } else if (on == 2) {
                $.Alert(name + '已激活');
                return;
            }
            idS = idS.substr(0, idS.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认发送激活邀请？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "activate"
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ajaxRe();
                        }
                    });
                });
            }
        });
        //密码重置
        $("#rePassword").on('click', function () {
            var idS = "";
            var roleId = "";
            var depId = "";
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                }
            }
            idS = idS.substr(0, idS.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认发送密码重置邮件？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "reset"
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ajaxRe();
                        }
                    });
                });
            }
        });
        //离职
        $("#leavePos").on('click', function () {
            var idS = "";
            var roleId = "";
            var depId = "";
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                }
            }
            idS = idS.substr(0, idS.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认设置为离职？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "setLeave"
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ajaxRe();
                        }
                    });
                });
            }
        });
        //禁用
        $("#disabled").on('click', function () {
            var idS = "";
            var roleId = "";
            var depId = "";
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                    // roleId	+= checkboxI2.attr('data-roleId');
                }
            }
            idS = idS.substr(0, idS.length - 1);
            if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认设置为禁用？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "setDisable",
                            department: depId
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ajaxRe();
                        }
                    });
                });
            }
        });
        //启用
        $("#start").on("click",function(){
            var idS = "";
            var roleId = "";
            var depId = "";
            var lengthI = $("tbody").find("input[type='checkbox']").length;
            for (var i = 0; i < lengthI; i++) {
                var checkboxI1 = $("tbody").find("input[type='checkbox']")[i];
                var checkboxI2 = $("tbody").find("input[type='checkbox']").eq(i);
                depId = checkboxI2.attr('data-dep');
                if (checkboxI1.checked) {
                    idS += checkboxI2.attr('data-id') + ",";
                    // roleId	+= checkboxI2.attr('data-roleId');
                }
            }
            idS = idS.substr(0, idS.length - 1);
                if (idS == "") {
                $.Alert("请选择人员");
                return;
            } else {
                $.Confirm("确认设置为启用？", "", function () {
                    $.ajax({
                        type: "POST",
                        url: Base.sitUrl + "/api/org/v1/org/staff/set",
                        dataType: "json",
                        data: {
                            ids: idS,
                            setType: "setActivate",
                        },
                        success: function (result) {
                            if (!result.success) {
                                $.Alert(result.message);
                                return;
                            }
                            ajaxRe();
                        }
                    });
                });
            }
        })
        //刷新函数
        function ajaxRe() {
            $(".table tbody tr").remove();
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/org/v1/org/staff/list",
                dataType: "json",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    $(".list-group").children().remove();
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].status == 1) {
                            statusName = "已激活";
                        } else if (data[i].status == 2) {
                            statusName = "已禁用";
                        } else if (data[i].status == 3) {
                            statusName = "已邀请";
                        } else if (data[i].status == 4) {
                            statusName = "未激活";
                        } else if (data[i].status == 5) {
                            statusName = "已离职";
                        } else if (data[i].status == 0) {
                            statusName = "未知";
                        }
                        ;
                        if (data[i].isAdmin == 1) {
                            isAdmin = "部门管理员"
                        } else {
                            isAdmin = "普通员工"
                        }
                        var liName = '<tr>' +
                            '<td><div class="checker" id="uniform-allCheckbox"><span><input type="checkbox" id="allCheckbox"  data-admin="' + data[i].isAdmin + '" data-id="' + data[i].id + '" data-roleId="' + data[i].roleId + '" data-dep="' + data[i].department + '"></span></div></td>' +
                            '<td><a class="pop-name blue" href="bk-org-detail.html?id=' + data[i].id + '&v=' + window.ver + '" data-maintab>' + testNull(data[i].name) + '</a></td>' +
                            '<td>' + testNull(data[i].departmentName) + '</td>' +
                            '<td>' + testNull(data[i].email) + '</td>' +
                            '<td><label class="supervisor blue">' + testNull(isAdmin) + '</label></td>' +
                            '<td class="blue">' + testNull(data[i].roleName) + '</td>' +
                            '<td>' + testNull(statusName) + '</td>' +
                            '<td>' + testNull(data[i].lastLoginTime) + '</td>' +
                            '</tr>';
                        $(".table tbody").append(liName);
                    }
                }
            });
        }

        $(".addAll .newDep-a").on('click', function () {
            $(this).addClass("blue");
            $(this).siblings().removeClass("blue");
            $(".newDep").show();
            $(".newUser").hide();
        });
        $(".addAll .newUser-a").on('click', function () {
            $(this).addClass("blue");
            $(this).siblings().removeClass("blue");
            $(".newDep").hide();
            $(".newUser").show();
        });
        $(".role-modal-close").on('click', function () {
            $("#allot-modal").hide();
            $("#depEdit-modal").hide();
        });

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