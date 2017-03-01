require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'ztree'], function (maintab) {
        var div1=document.getElementById("div1");
        var div2=document.getElementById("div2");
        var flag=1;
        div2.onclick=function(){
            div1.className=(div1.className=="close1")?"open1":"close1";
            div2.className=(div2.className=="close2")?"open2":"close2";
            if(flag==1){
                $("#div2").attr("data-num",0)
                flag=0;
            }else{
                $("#div2").attr("data-num",1);
                flag=1;
            }
        }
        //获取角色
        function getRole(){
            $.ajax({
               type:"GET",
               url: Base.sitUrl + "/api/org/v1/org/role/list",
                success: function(data){
                    var list = '';
                    for(var i =0;i<data.data.length;i++){
                        list+='<option value="'+data.data[i].id+'">'+ data.data[i].name +'</option>';
                    }
                    $('#popRole').append(list);
                }
            })
        }
        getRole();
        //新建角色
        $("#pop-add-save").on('click', function () {
            var popAddName = $("#popAddName").val();
            var popAddEmail = $("#popAddEmail").val();
            var popRole = $("#popRole").find("option:selected").val();
            var popId=$("#div2").attr("data-num");
            $(".gender").find("input[type=radio]").each(function () {
                if ($(this).is(":checked")) {
                    popAddGender = $(this).data("num");
                }
            });
            $(".gender1").find("input[type=radio]").each(function () {
                if ($(this).is(":checked")) {
                    popAddGender1 = $(this).data("num");
                }
            });
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoAdd");
            var nodes = treeObj.getSelectedNodes();
            if (popAddName == "" || popAddEmail == "" || nodes == "") {
                $.Alert("请填写带星号的内容");
            } else {
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/org/v1/org/staff/save",
                    dataType: "json",
                    data: {
                        name: popAddName,
                        email: popAddEmail,
                        gender: popAddGender,
                        isAdmin:popAddGender1,
                        roleId:popRole,
                        isInvite:popId,
                        department: nodes[0].id
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }else{
                            parent.location.reload();
                            $.DestroyPopInPop();
                        }
                    }
                });
            }
        });
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
                open: true
            }
        }
        $.fn.zTree.init($("#treeDemoAdd"), setting, zNodes);
        $("#selectAll").on("click", selectAll);

        function selectAll() {
            var zTree = $.fn.zTree.getZTreeObj("treeDemo");
            zTree.setting.edit.editNameSelectAll = $("#selectAll").attr("checked");
        }
    });
});