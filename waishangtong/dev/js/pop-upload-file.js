require(['common'], function () {
    require(['maintab', 'blockUI', 'ztree', 'jqform', 'bootstrap'], function (maintab) {
        var custId = $.GetQueryString('custId'),
            contId = $.GetQueryString('contId'),
            pIdx = Number($.GetQueryString('pIdx'));

        //云文档
        (function () {
            // 树结构设定
            var setting = {
                view: {
                    selectedMulti: false
                },
                check: {
                    enable: true
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
            $.ajax({
                type: "POST",
                url: Base.sitUrl + "/api/disk/v1/all/visible/file/list",
                dataType: "json",
                success: function (result) {
                    if (!result.success) {
                        $.Alert(result.message);
                        return;
                    }
                    var cloudFile = result.data;

                    var zNodes = new Array();
                    for (var i = 0; i < cloudFile.length; i++) {
                        if (cloudFile[i].type == 1) {
                            var pIcon = "pIcon";
                            var status = false
                        } else {
                            var pIcon = "";
                            var status = true
                        }
                        zNodes[i] = {
                            id: cloudFile[i].id,
                            pId: cloudFile[i].pid,
                            name: cloudFile[i].name,
                            type: cloudFile[i].type,
                            url: cloudFile[i].file,
                            actualSize: cloudFile[i].actualSize,
                            open: false,
                            nocheck: status,
                            iconSkin: pIcon
                        }
                    }
                    $.fn.zTree.init($("#treeCloud"), setting, zNodes);
                }
            });
        })();
        //云文件选择
        $('#addCloud').click(function () {
            var treeObj = $.fn.zTree.getZTreeObj("treeCloud");
            var nodes = treeObj.getCheckedNodes(true);//选中的文档

            var html = '';
            var checkedFiles = $('.file-list').find('li');
            if (checkedFiles.length > 0) {
                for (var i = 0; i < nodes.length; i++) {
                    var isHad = false;
                    for (var j = 0; j < checkedFiles.length; j++) {
                        var liUrl = checkedFiles.eq(j).attr('data-url');
                        if (liUrl == nodes[i].url) {
                            isHad = true;
                            break;
                        }
                    }
                    if(!isHad){
                        html += '<li data-size="' + nodes[i].actualSize + '" data-url="' + nodes[i].url + '" data-source="1">\
                        <p class="file-img"><img src="../images/ico-file.png" width="30" height="30" alt="" /></p>\
                        <p class="file-tit">' + nodes[i].name + '</p>\
                        <i class="del-file"></i>\
                        </li>';
                    }
                }
            } else {
                for (var i = 0; i < nodes.length; i++) {
                    html += '<li data-size="' + nodes[i].actualSize + '" data-url="' + nodes[i].url + '" data-source="1">\
                        <p class="file-img"><img src="../images/ico-file.png" width="30" height="30" alt="" /></p>\
                        <p class="file-tit">' + nodes[i].name + '</p>\
                        <i class="del-file"></i>\
                        </li>';
                }
            }
            $(".file-list").prepend(html);
            $('#cloudModal').modal('hide');
        });

        //本地文件
        $('.file-local').click(function () {
            $('#up-files').click();
        });
        $('#up-files').change(function (e) {
            $.EventFn(e);
            $('#file-form').ajaxForm({
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
                    var urlStr = res.data;
                    var urlArr = urlStr.split(',');

                    var fileList = document.getElementById('up-files').files;
                    var fileCont = $('.file-list');
                    for (var i = 0; i < fileList.length; i++) {
                        var html = '<li data-size="' + fileList[i].size + '" data-url="' + urlArr[i] + '" data-source="0">\
                        <p class="file-img"><img src="../images/ico-file.png" width="30" height="30" alt="" /></p>\
                        <p class="file-tit">' + fileList[i].name + '</p>\
                        <i class="del-file"></i>\
                        </li>';
                        fileCont.append(html);
                    }
                }
            }).submit();
        });
        //删除文件
        $('.file-list').on('click', '.del-file', function () {
            $(this).closest('li').remove();
        });
        //上传文件
        $('.upload').click(function () {
            var ajaxUrl = '/api/user/v1/document/save';
            var data = {};
            var files = $('.file-list li');
            if (files.length > 1) {
                ajaxUrl = '/api/user/v1/document/save/batch';
                data.documents = [];
                for (var i = 0; i < files.length; i++) {
                    var fileObj = {
                        customerId: custId,
                        documentName: files.eq(i).find('.file-tit').text(),
                        documentUrl: files.eq(i).attr('data-url'),
                        documentSize: files.eq(i).attr('data-size'),
                        source: files.eq(i).attr('data-source')
                    };
                    if (contId != null) {
                        fileObj.customerContactsId = contId;
                    }
                    data.documents.push(fileObj);
                }
            } else if (files.length == 1) {
                data = {
                    customerId: custId,
                    documentName: files.find('.file-tit').text(),
                    documentUrl: files.attr('data-url'),
                    documentSize: files.attr('data-size'),
                    source: files.attr('data-source')
                };
                if (contId != null) {
                    data.customerContactsId = contId;
                }
            } else {
                $.Alert('没有选择文件！');
                return;
            }
            $.ajax({
                url: Base.sitUrl + ajaxUrl,
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                    } else {
                        $.Alert('上传文档成功！', '', function () {
                            var index = $('#mainTab', parent.document).find('.currentClass').index();

                            parent.me.refresh2(pIdx, 'part');
                            parent.me.closeOne(index, true);
                        });
                    }
                }
            });
        });
        //取消
        $('.cancel').click(function (e) {
            e.preventDefault();
            var index = $('#mainTab', parent.document).find('currentClass').index();
            parent.me.closeOne(index);
        });
    });
});