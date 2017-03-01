require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'ztree', 'jqform'], function (maintab) {
        var userId = $.GetQueryString('userId')
        //上传文件
        $("#savenewFile").on('click', function () {
            var treeObj = $.fn.zTree.getZTreeObj("treeDemoAdd");
            var nodes = treeObj.getSelectedNodes();
            if (nodes == '') {
                var pid = '0'
            } else {
                var pid = nodes[0].id
            }
            var fileName = $("#Newfilename").val();
            var size = $("#Newfilename").attr("data-size");
            var url = $("#Newfilename").attr("data-url");
            var sizeArr = size.split(','),
                urlArr = url.split(','),
                fileNameArr = fileName.split(',');
            var diskfiles = new Array();
            for(var i=0;i<sizeArr.length;i++){
                var childArr = {
                    pid: pid,
                    name:fileNameArr[i],
                    file:urlArr[i],
                    size:sizeArr[i],
                    type: '1',
                    shareType: '1',
                    operateType: '0',
                    userType: '0'
                }
                diskfiles.push(childArr)
            }
            var data = {
                diskfiles:diskfiles
            };
            $.ajax({
                url: Base.sitUrl + '/api/disk/v1/file/save/batch',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                beforeSend: function (XHR) {
                    $.BlockUI();
                },
                complete: function (XHR, TS) {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (res.success) {
                        //var data = parent.$.file(userId, pid);//更新云文件列表
                        $.DestroyPopInPop();
                        parent.location.reload();
                    } else {
                        $.unLogin(res);
                        return
                    }
                }
            })
        });
        function dataOrg() {
            var dataJson = new Array();
            var data = {
                view: '0'
            }
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/disk/v1/folder/list/all",
                dataType: "json",
                async: false,
                data: {
                    data: JSON.stringify(data)
                },
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var data = result.data;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].type == 0) {
                            dataJson.push(data[i])
                        }
                    }
                }
            });
            return dataJson;
        }

        $('#up-files').on('change', function (e) {
            $.EventFn(e);
            var sign = fileLimit($(this));
            var fileList = document.getElementById('up-files').files;
            if (sign.flag) {
                var name = '',size = '';
                for(var i=0;i<fileList.length;i++){
                    name += fileList[i].name + ','
                    size += fileList[i].size + ','
                }
                name = name.substring(0,name.length-1)
                size = size.substring(0,size.length-1)
                uploadFujian(name, size);
            }
        });
        //  上传附件
        function uploadFujian(name, size) {
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
                    $('#Newfilename').val(name).attr({"data-url": url,"data-size": size});
                }
            }).submit();
        }

        function fileLimit(obj) {
            var flag = true;
            var fileObj = obj.prop('files');
            var sizeS = fileObj[0].size;
            return {flag: flag, name: fileObj[0].name, size: sizeS};
        }

        var dataOrgJson = dataOrg();
        // 树结构设定
        var setting = {
            view: {
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
                beforeDrag: false
            }
        };

        //树结构
        $(document).ready(function () {
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
        });
        var PId = $('#navInput', parent.document).attr('data-pid');
        var treeObj = $.fn.zTree.getZTreeObj("treeDemoAdd");
        var node = treeObj.getNodeByParam("id", PId);
        treeObj.selectNode(node);
        setting.callback.onClick = onClick;
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
    });
});