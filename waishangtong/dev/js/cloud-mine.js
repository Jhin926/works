require([ 'common' ], function () {
    require(['maintab', 'angular','angularAnimate', 'blockUI'], function (maintab) {
        maintab.init();
        var sessionKeyId = $('#pageLeftUserName', parent.document).attr("data-id");
        var cloudType = $.GetQueryString('type');//等于1是云盘管理

        var app=angular.module("All",[]);
        app.controller("fileList",['$scope','$http',function($scope,$http){
            $scope.view = cloudType==1?'1':'0';
            $scope.cloudTitle = cloudType==1?'成员云盘':'我的云盘';
            $scope.userId = sessionKeyId;//用户id
            $scope.showHandle = false;//显示头部操作
            $scope.currentId=0;//当前文件夹id
            $scope.stepList = [];//点开文件夹的记录
            $scope.title = '全部文件';//目录地址
            $scope.isShow = false;//是否显示编辑
            $scope.isEmpty = false;//是否有数据
            $scope.btnArr = {//控制按钮可选与否
                isDownload: true,
                isSendEml: true,
                isEditName: true,
                isDel: true
            };
            $scope.checkFile = [];//选中的文件，或者文件夹
            $scope.uploadHref = 'pop-cloud-upload.html?userId=' + sessionKeyId + '&v=' + window.ver;
            $scope.diskHref = 'pop-cloud-new.html?userId=' + sessionKeyId + "&v=" + window.ver;
            $scope.isMycloud = true;//是否我的云盘
            $scope.isMange = cloudType==1?true:false;//是否是管理云盘
            $scope.isRoot = true;

            function formateData(data){
                for (var i = 0; i < data.length; i++) {
                    if (data[i].name.length > 50) {
                        data[i].subName = data[i].name.substring(0, 50) + '...';
                    }else{
                        data[i].subName = data[i].name;
                    }
                    if(data[i].type == 0){
                        data[i].imgSrc = '../../images/new/cloudfile0.png';
                    }else if(data[i].type == 1){
                        data[i].imgSrc = '../../images/new/cloudfile1.png';
                    }else {//云盘成员列表
                        data[i].imgSrc = '../../images/new/cloudfile0.png';
                    }
                }
                return data;
            }

            function getRootList(){
                $.BlockUI();
                $http({
                    method:'post',
                    url: Base.sitUrl + '/api/disk/v1/root/folder/list',
                    params:{
                        data: {
                            view: $scope.view,
                            userId: $scope.userId
                        }
                    }})
                    .success(function(res) {
                        $.UnblockUI();
                        if (!res.success) {
                            $.unLogin(res);
                            return
                        }

                        var data = res.data;
                        //新建链接数据
                        if (data.length > 0) {
                            $scope.isEmpty = false;
                            $scope.files = $scope.rootFiles = formateData(data);
                        } else {//没有数据
                            $scope.isEmpty = true;
                        }
                    });
            }

            function cloudMange(){
                $.BlockUI();
                $http({
                    method:'post',
                    url: Base.sitUrl + '/api/org/v1/org/staff/list'
                }).success(function(res) {
                    $.UnblockUI();
                    if (!res.success) {
                        $.unLogin(res);
                        return
                    }


                    var data = res.data;
                    //新建链接数据
                    if (data.length > 0) {
                        $scope.isEmpty = false;
                        $scope.files = $scope.rootFiles = formateData(data);
                    } else {//没有数据
                        $scope.isEmpty = true;
                    }
                });
            }

            if($scope.isMange){//云盘管理
                cloudMange();
            }else{
                getRootList();
            }
            $scope.prev = function(){
                if($scope.isRoot){//当前在根目录下
                    $.Alert('已经是根目录了');
                }else{
                    $scope.isEmpty = false;
                    $scope.title = $scope.title.substring(0,$scope.title.lastIndexOf('>'));
                    if($scope.stepList.length<=0){//这种情况只能是成员云盘刚打开
                        $scope.isRoot = true;
                        $scope.files = $scope.rootFiles;
                    }else if($scope.stepList.length==1){
                        if($scope.isMange && $scope.isMycloud){//后台成员列表，会回到成员列表刚打开的状况
                            $scope.currentId = $scope.stepList.pop();
                            $scope.reload();
                        }else {//前台或者后台云共享倒数第二步
                            $scope.isRoot = true;
                            $scope.files = $scope.rootFiles;
                        }
                    }else{
                        $scope.currentId = $scope.stepList.pop();
                        $scope.reload();
                    }
                }
            };
            $scope.reload = function(){
                if($scope.isRoot){
                    $scope.files = $scope.rootFiles;
                }else{
                    $.BlockUI();
                    $http({
                        method:'post',
                        url: Base.sitUrl + '/api/disk/v1/sub/file/list',
                        params:{
                            data:{
                                view: $scope.view,
                                userId: $scope.userId,
                                pid: $scope.currentId
                            }
                        }})
                        .success(function(res) {
                            $.UnblockUI();
                            if (!res.success) {
                                $.unLogin(res);
                                return
                            }

                            var data = res.data;
                            if (data.length > 0) {
                                $scope.isEmpty = false;
                                $scope.files = formateData(data);
                            } else {//没有数据的情况
                                $scope.isEmpty = true;
                            }
                        });
                }
            };
            $scope.homePage = function(){
                $scope.isRoot = true;
                $scope.currentId = 0;
                $scope.title = '全部文件';
                $scope.stepList = [];
                if($scope.rootFiles && $scope.rootFiles.length>0){
                    $scope.isEmpty = false;
                    $scope.files = $scope.rootFiles;
                }
            };
            $scope.getDetail = function(_data,$event){
                if($scope.isMange && $scope.isMycloud && $scope.isRoot){//云盘管理,成员云盘，根目录
                    $scope.isRoot = false;
                    $scope.userId = _data.id;
                    $scope.currentId = 0;
                    $scope.title += ('>'+ _data.name);
                    $scope.reload();
                    $scope.checkFile = [];
                }else{
                    if(_data.type==0){//文件夹
                        $scope.isRoot = false;
                        $scope.currentId = _data.id;
                        $scope.stepList.push(_data.pid);
                        $scope.title += ('>'+ _data.name);
                        $scope.reload();
                        $scope.checkFile = [];
                    }else{//文件
                        var url = _data.file;
                        var name = _data.name;
                        var id = _data.id;
                        var _length = url.lastIndexOf('.');
                        var ext = url.substring(_length, url.length).toUpperCase();
                        if (ext == ".PNG" || ext == ".JPG" || ext == '.JPEG' || ext == '.SVG' || ext == '.GIF') {
                            if(url.indexOf('http')>=0){
                                var html = '<img src="' + url + '" alt="" class="previewImg previewContent">';
                            }else{
                                var html = '<img src="http://' + url + '" alt="" class="previewImg previewContent">';
                            }
                        } else if (ext == ".TXT" || ext == '.JS' || ext == '.CSS') {
                            var html = '<iframe src="' + url + '" frameborder="0" class="previewIframe previewContent"></iframe>'
                        } else if (ext == ".DOC" || ext == ".DOCX" || ext == '.XLS' || ext == '.XLSX' || ext == '.ET' ||
                            ext == '.PPT' || ext == '.PPTX' || ext == '.WPS' || ext == '.ZIP' || ext == '.RAR' || ext == '.7Z') {
                            var preurl = Base.sitUrl + '/api/disk/v1/file/preview?data={id:' + id + '}';
                            var html = '<iframe src="' + preurl + '" frameborder="0" class="previewIframe previewContent"></iframe>'
                        } else {
                            $.Alert(ext.toLowerCase() + '格式暂不支持预览');
                            return
                        }

                        $('#preview').find('h3').text(name);
                        $('#preview').find('.previewContent').remove();
                        $('#preview').append(html).show();
                    }
                }
            };
            $scope.check = function(_file,$event){
                $event.stopPropagation();
                var $this = $($event.target);
                if($this.prop('checked')==true){
                    $this.parent().addClass('checked');
                    if($scope.checkFile.indexOf(_file)<0){
                        $scope.checkFile.push(_file);
                    }
                }else{
                    $this.parent().removeClass('checked');
                    if($scope.checkFile.indexOf(_file)>=0){
                        $scope.checkFile.splice($scope.checkFile.indexOf(_file),1);
                    }
                }

                if($scope.checkFile.length ==1){//只有一个选中
                    if($scope.checkFile[0].type==0 || $scope.checkFile[0].type==undefined){//文件夹（第二种情况是管理的成员文件夹）
                        $scope.btnArr = {
                            isDownload: true,
                            isSendEml: true,
                            isEditName: false,
                            isDel: false
                        };
                    }else{
                        $scope.btnArr = {
                            isDownload: false,
                            isSendEml: false,
                            isEditName: false,
                            isDel: false
                        };
                    }
                }else if($scope.checkFile.length>1){
                    var checkedFloder = [];
                    for(var idx in $scope.checkFile){
                        if($scope.checkFile[idx].type==0){//文件夹
                            checkedFloder.push($scope.checkFile[idx]);
                        }
                    }
                    if(checkedFloder.length<=0){//选中的全部是文件
                        $scope.btnArr = {
                            isDownload: true,
                            isSendEml: false,
                            isEditName: true,
                            isDel: false
                        };
                    }else{//选中的是文件和文件夹，或者全部是文件夹
                        $scope.btnArr = {
                            isDownload: true,
                            isSendEml: true,
                            isEditName: true,
                            isDel: false
                        };
                    }
                }

                $scope.showHandle = $scope.checkFile.length > 0?true:false;
            };
            $scope.delete = function(){
                $.Confirm('确认删除？', '', function () {
                    var checkedIds = [];
                    for(var idx in $scope.checkFile){
                        checkedIds.push($scope.checkFile[idx].id);
                    }
                    $.BlockUI();
                    $http({
                        method:'post',
                        url: Base.sitUrl + '/api/disk/v1/file/delete',
                        params:{
                            data:{
                                ids: checkedIds.join()
                            }
                        }})
                        .success(function(res) {
                            $.UnblockUI();
                            if (res.success) {
                                $.Alert('删除成功');
                                for(var idx in $scope.checkFile){
                                    $scope.files.splice($scope.files.indexOf($scope.checkFile[idx]),1);
                                }
                                $scope.checkFile = [];
                                $scope.showHandle = false;
                            } else {
                                $.Alert(res.message)
                            }
                        });
                });
            };
            $scope.confirm = function(){
                var data = {
                    id: $scope.checkFile[0].id,
                    view: $scope.view,
                    name: $scope.checkFile[0].name,
                    pid: $scope.checkFile[0].pid
                };
                if(!$scope.isMycloud){//共享云盘
                    data.shareType = 2;
                    data.operatetype = 0;
                    data.usertype = 0;
                }
                /*if($scope.isMycloud && $scope.isMange){//云盘管理，成员云盘的编辑，现在编辑功能隐藏了
                    delete data.pid
                }*/
                $.BlockUI();
                $http({
                    method:'get',
                    url: Base.sitUrl + '/api/disk/v1/file/edit',
                    params:{
                        data:data
                    }}).success(function (res) {
                    $.UnblockUI();
                    if (res.success) {
                        $.Alert('操作成功');
                        $scope.files[$scope.files.indexOf($scope.checkFile[0])].name=$scope.checkFile[0].name;
                        $scope.files = formateData($scope.files);
                        $scope.isShow = false;
                    } else {
                        $.unLogin(res);
                    }
                });
            };
            $scope.closePreview = function(){
                $('#preview').hide().find('.previewContent').remove();
            };
            $scope.sendEmail = function(){
                var data = [];
                for(var idx in $scope.checkFile){
                    var json = {
                        name: $scope.checkFile[idx].name,
                        value: $scope.checkFile[idx].file
                    };
                    data.push(json);
                }
                maintab.showTab(Base.url + '/html/pop-email-new.html?typeCloud=11&data=' + JSON.stringify(data) + "&v=" + window.ver, '新建邮件');
            };
            $scope.download = function(){
                var data = {
                    name: $scope.checkFile[0].name,
                    value: $scope.checkFile[0].file
                };
                var postData = 'data=' + JSON.stringify(data);
                window.location.href = Base.sitUrl + '/api/file/download?' + postData;
            };
            $scope.switchCloud = function(_isMy){
                $scope.isMycloud = _isMy;
                $scope.title = '全部文件';
                $scope.isRoot = true;
                $scope.currentId = 0;
                $scope.stepList = [];
                if($scope.isMange){//云盘管理
                    $scope.diskHref = 'pop-cloud-newShare-bk.html?userId=0&v=' + window.ver;
                    $scope.uploadHref = 'pop-cloud-uploadShare-bk.html?userId=0&v=' + window.ver;
                    if(_isMy){
                        cloudMange();
                    }else{
                        $scope.userId = '0';
                        getRootList();
                    }
                }else {
                    if(_isMy){//我的云盘
                        $scope.userId = sessionKeyId;
                        $scope.uploadHref = 'pop-cloud-upload.html?userId=' + sessionKeyId + '&v=' + window.ver;
                    }else{
                        $scope.userId = '0';
                        $scope.uploadHref = 'pop-cloud-uploadShare.html?userId=' + sessionKeyId + "&v=" + window.ver;
                    }
                    getRootList();
                }
            };
        }]);
        angular.bootstrap( document.body , ['All']);
    });
});