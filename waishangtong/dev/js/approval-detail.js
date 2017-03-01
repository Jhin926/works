require([ 'common' ], function () {
    require(['maintab', 'angular','angularAnimate','ZeroClipboard','ueditorLang','jqform', 'blockUI','datetimepickerCN'], function (maintab) {
        maintab.init();
        var $Id = parseInt($.GetQueryString('id'));
        var $type = parseInt($.GetQueryString('type'));
        var $bizId = parseInt($.GetQueryString('bizId'));
    var app=angular.module("approvalDetailModule",[]);
        app.filter('myFilter',function(){
            return function(_url){
                if(_url.indexOf('http://')<0){
                    return 'http://'+_url
                }else {
                    return _url;
                }
            }
        });
        app.controller('approvalDetail',['$scope','$http',function($scope,$http){

        $scope.approvalDetailList={};
        $scope.statusText='';
        $scope.uploaddata=[];

            function statusDict(data){
                var status=data.status;
                var bizType=data.bizType;
                if(status==1){
                    $scope.statusText="待审批";
                    $(".approval-btn-group").show();
                    $("#emailAttachment").show();
                    $(".approval-waiting textarea").show();
                    $(".status").css("background","#8E8F93");
                }else if(status==2){
                    $scope.statusText="通过";
                    $(".approval-theme").show();
                    $("#emailAttachment").hide();
                    $(".approval-btn-group").hide();
                    $("#added-appendix").hide();
                    $(".approval-waiting textarea").hide();
                    $(".status").css("background","#37C173");
                }else if(status==3){
                    $scope.statusText="不通过";
                    $(".approval-theme").show();
                    $(".approval-waiting textarea").hide();
                    $("#emailAttachment").hide();
                    $(".approval-btn-group").hide();
                    $("#added-appendix").hide();
                    $(".status").css("background","#FF605D");
                }
            };
            if($type==1){
                $(".approval_person").html("发起人：");
            }else{
                $(".approval_person").html("审批人：");
            }
            //获取审批详情
            function getApprovalDetail (){
                $http({
                    method:"post",
                    url:Base.sitUrl+'/api/approval/v1/details',
                    params:{
                        data:JSON.stringify({id:$Id})
                    }
                }).success(function(res){
                    if(!res.success){
                        $.Alert(res.message);
                        return
                    }
                    $scope.approvalDetailList=res.data;
                    var data=res.data;
                    data=statusDict(data);
                    var $id=$scope.approvalDetailList.bizId;
                    var $type=$scope.approvalDetailList.bizType;
                    if($type==1) {
                        $(".approval_detail").attr("src","../../pop-quotation-detail.html?showbtn=1&id="+$id);
                    }else if($type==2){
                        $(".approval_detail").attr("src","../../pop-pi-detail.html?showbtn=1&id="+$id);
                    }else if($type==3) {
                        $(".approval_detail").attr("src","../../pop-order-detail.html?showbtn=1&id="+$id);
                    }
                })
            }
            getApprovalDetail();
            //审核 添加附件
            $scope.addAttachment = function(){
                $('#up-files').click();
            }

            $('input[name=upFiles]').on('change', function (e) {
                $.EventFn(e);
                var sign = fileLimit($(this));
                if (sign.flag) {
                    uploadFujian(sign.name, sign.size);
                }
            });
            //  上传附件
            function uploadFujian(name, size, dictFileUpType) {
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
                        if (size < 1) {
                            size = size * 1024;
                            var $size=parseInt(size);
                            size += 'KB';
                        } else {
                            size += 'MB';
                        }
                        var url = res.data;
                        var html = '<li data-url="' + url + '"><i class="pub-icon fujian-excl-iocn"></i><span>' + name + '</span> <span class="att-size">( ' + size + ' )</span> <span class="removeLi">删除</span><span class="previewEml">预览</span></li>';
                        $("#added-appendix").show().prepend(html);
                        var $name=name;
                        var $type=name.substring(name.indexOf(".")+1);
                        $scope.uploaddata=[
                            {
                                "name" : $name,
                                "url" : url,
                                "size" : $size,
                                "contentType" :1
                            }
                        ]
                    }
                }).submit();
            }
            function fileLimit(obj) {
                var flag = true;
                var fileObj = obj.prop('files');

                var size = Math.round(fileObj[0].size / 1024 * 100) / 100 / 1024;//MB
                if (size > 20) {
                    $.Alert('上传附件需小于20MB');
                    flag = false;
                }
                return {flag: flag, name: fileObj[0].name, size: size};
            }
            //附件删除
            $('#added-appendix').on('click', '.removeLi', function () {
                $(this).parents("li").remove();
            });
            //附件预览
            $('#added-appendix').on('click', '.previewEml', function () {
                var url = $(this).parents('li').attr('data-url');
                var name = $(this).prev().prev().prev().text();
                var _length = url.lastIndexOf('.');
                var ext = url.substring(_length, url.length).toUpperCase();
                if (ext == ".PNG" || ext == ".JPG" || ext == '.JPEG' || ext == '.SVG' || ext == '.GIF') {
                    var html = '<img src="' + url + '" alt="" class="previewImg previewContent">'
                } else if (ext == ".TXT" || ext == '.JS' || ext == '.CSS') {
                    var html = '<iframe src="' + url + '" frameborder="0" class="previewIframe previewContent"></iframe>'
                } else if (ext == ".DOC" || ext == ".DOCX" || ext == '.XLS' || ext == '.XLSX' || ext == '.ET' ||
                    ext == '.PPT' || ext == '.PPTX' || ext == '.WPS' || ext == '.ZIP' || ext == '.RAR' || ext == '.7Z' || ext == '.PDF') {
                    var preurl = Base.sitUrl + '/api/export/v1/file/preview?data={file: \'' + url + '\'}';
                    var html = '<iframe src="' + preurl + '" frameborder="0" class="previewIframe previewContent"></iframe>'
                } else {
                    $.Alert(ext.toLowerCase() + '格式暂不支持预览');
                    return
                }
                $('#preview').find('h3').text(name);
                $('#preview').find('.previewContent').remove();
                $('#preview').append(html);
                $('#preview').show();
            });
            $('#previewClose').bind('click', function () {
                $('#preview').hide();
                $('#preview').find('.previewContent').remove();
            });
            //详情页 附件预览
            $scope.appendixShow = function(fujian){
                var url="http://"+fujian.url;
                var _length = url.lastIndexOf('.');
                var pnghref=url.substring(7);
                var id=fujian.bizId;
                var ext = url.substring(_length, url.length).toUpperCase();
                if (ext == ".PNG" || ext == ".JPG" || ext == '.JPEG' || ext == '.SVG' || ext == '.GIF') {
                    var html = '<img src="' + url + '" alt="" class="previewImg previewContent">'
                } else if (ext == ".TXT" || ext == '.JS' || ext == '.CSS') {
                    var html = '<iframe src="' + url + '" frameborder="0" class="previewIframe previewContent"></iframe>'
                } else if (ext == ".DOC" || ext == ".DOCX" || ext == '.XLS' || ext == '.XLSX' || ext == '.ET' ||
                    ext == '.PPT' || ext == '.PPTX' || ext == '.WPS' || ext == '.ZIP' || ext == '.RAR' || ext == '.7Z' || ext == '.PDF') {
                    $.Alert(ext.toLowerCase() + '格式暂不支持预览');
                    return
                    /*var preurl = Base.sitUrl + '/api/disk/v1/file/preview?data={id:' + id + '}';
                    var html = '<iframe src="' + preurl + '" frameborder="0" class="previewIframe previewContent"></iframe>';*/
                } else {
                    $.Alert(ext.toLowerCase() + '格式暂不支持预览');
                    return
                }
                $('#preview').show();
                $('#preview h3').text(fujian.name);
                $('#preview').find('.previewContent').remove();
                $('#preview').append(html);
            }
            //通过审核
           $scope.approvalPass = function(){
               var remark=$(".approval-remark").val();
               var $approval=$scope.approvalDetailList.bizId;
               $scope.postData={
                   "id" : $Id,   //所选ID
                   "status" : 2,    //审批状态（1-待审批 2-通过 3-不通过）
                   "approver" : $approval,
                   "approvalOpinions" : remark,
                   "approvalAttachmentEnters" :$scope.uploaddata
               };
               getPass();
           }
           //审核不通过
            $scope.approvalNoPass = function(){
                var remark=$(".approval-remark").val();
                var $approval=$scope.approvalDetailList.bizId;
                $scope.postData={
                    "id" : $Id,   //所选ID
                    "status" : 3,    //审批状态（1-待审批 2-通过 3-不通过）
                    "approver" : $approval,
                    "approvalOpinions" : remark,
                    "approvalAttachmentEnters" :$scope.uploaddata
                }
                getPass();
            }
            function getPass(){
                $http({
                    method:"get",
                    url:Base.sitUrl+'/api/approval/v1/approval',
                    params:{data:JSON.stringify($scope.postData)}
                }).success(function(res){
                    if(!res.success){
                        $.Alert(res.message);
                        return
                    }
                    getApprovalDetail();
                    parent.location.reload();
                })
            }

        }])
        angular.bootstrap(document.body,["approvalDetailModule"]);

        })
})