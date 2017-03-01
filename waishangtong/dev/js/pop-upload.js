/* !
 *  上传文档
 */
require([ 'common'], function () {
    require([ 'jqform','datetimepickerCN'], function () {

        var $upload = $('.box-upload'),
            custId = parseInt($.GetQueryString('id')),
            typeIf = parseInt($.GetQueryString('type')),
            contId = parseInt($.GetQueryString('contId')),
            pIdx = Number($.GetQueryString('pIdx'));
        $upload.on('change', '#up-files,#up-image', function (e) {
            $.EventFn(e);

            var obj = $(this).prop('files')[0],
                name = $(this).attr('name'),
                type = 'img',
                that = $upload.find('#upload-img');
            if (obj) {
                if (name == 'upFiles') {
                    type = 'file';
                    that = $upload.find('#upload-file')
                }
                uploadObj.uploadFile(type, obj, that);
            }
        });
        if (jQuery().datetimepicker) {
            $('.datetime-picker').datetimepicker({
                language: 'zh-CN',
                todayBtn: 1,
                autoclose: 1,
                todayHighlight: 1,
                startView: 2,
                minView: 2,
                format: "yyyy-mm-dd hh:ii",
                bootcssVer: 3//因为html里的写法不规范，所以必须要加上这个时间插件才能正常显示
            });
        }
        //获取关联联系人
        $.ajax({
            url: Base.sitUrl + '/api/customer/v1/customer/detail',
            type:"POST",
            data:{
                data: JSON.stringify({id: custId}),
            },
            success:function(res){
                if(!res.success){
                    $.Alert( res.message);
                }
                var data=res.data.contacts;
                var list='';
                if(data!=''){
                for(var i=0;i<data.length;i++){
                        list+= '<option data-id="'+ data[i].id +'">'+data[i].name +'</option>';
                    }
                }else{
                    list+= '<option>无</option>';
                }
                $("#custContList2").empty().append(list);
            }
        })
        $upload.on('click', '.list-file .s-dels3', function (e) {
            $.EventFn(e);

            $(this).parent().remove();
            if ($('.list-file>li').length == 0) {
                $('.list-file').remove();
            }
        });

        $upload.on('click', 'button:first-child', function (e) {
            $.EventFn(e);

            var _val = $upload.find('#box-follow'),
                tmp = [],
                $list = $('.list-file>li'),
                data = {};
            if(_val.val()==""){
                $.Alert("请填写内容");
                return;
            }
            if (_val.val() != null || _val.val() != '') {
                for (var i = 0; i < $list.length; i++) {
                    tmp.push({attachmentType: $list.eq(i).attr('data-type'), attachment: $list.eq(i).attr('data-url'), attachmentName: $list.eq(i).children('span').text()})
                }
                // if(typeIf){//新建跟进的情况
                //     typeIf = typeIf == 1 ?1:0;
                // }
                var followTime = $('.fllow-time-check input').val();
                var contact=$("#custContList2").find("option:selected").val();
                if(followTime!=''){
                    data.followTimeString = followTime;
                }
                if (typeIf == 1) {
                    data.paramType = 1;
                    data.customerId = null;
                    data.customerContactsId = contId;
                    data.attachments = tmp;
                    data.content = _val.val();
                    data.name=contact;
                    data.followTimeString = followTime;
                } else {
                    data.paramType = 0;
                    data.customerId = custId;
                    data.customerContactsId = contId;
                    data.attachments = tmp;
                    data.content = _val.val();
                    data.name=contact;
                    data.followTimeString = followTime;
                }
                uploadObj.addFollow(data)
            }
        });

        $upload.on('click', 'button:last-child', function (e) {
            e.preventDefault();
            var index = $('#mainTab', parent.document).find('currentClass').index();
            parent.me.closeOne(index);
        });
        var uploadObj = {
            addFollow: function (obj) {
                $.ajax({
                    url: Base.sitUrl + '/api/user/v1/user/followup/save',
                    type: 'POST',
                    data: {
                        data: JSON.stringify(obj)
                    },
                    dataType: 'json',
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('创建失败，' + res.message);
                            return;
                        }
                        $.Alert('新建跟进成功！', '', function () {
                            var index = $('#mainTab', parent.document).find('.currentClass').index();

                            parent.me.refresh2(pIdx, 'part');
                            parent.me.closeOne(index, true);
                        });
                    }
                });
            },
            uploadFile: function (type, obj, that) {
                that.ajaxForm({
                    url: Base.sitUrl + '/api/file/upload',
                    beforeSend: function () {
                        $.BlockUI();
                    },
                    complete: function () {
                        $.UnblockUI();
                    },
                    success: function (res) {
                        if (!res.success) {
                            $.Alert('上传失败,' + res.message);
                            return;
                        }
                        var url = 'http://' + res.data,
                            html = '';
                        var $upload = $('.btns-upload');
                        var $list = $('.list-file'),
                            sign = 1;
                        if (type == 'img') {
                            sign = 0;
                        }
                        if ($list.length == 0) {
                            html = '<ul class="list-file">\
                                            <li data-url="' + res.data + '" data-type="' + sign + '">\
                                            <i class="s-updownBg s-link3"></i>\
                                            <span>' + obj.name + '</span>\
                                            <i class="s-updownBg s-dels3"></i>\
                                        </li>\
                                    </ul>';
                            $upload.after(html);
                        } else {
                            html = '<li data-url="' + res.data + '" data-type="' + sign + '">\
                                        <i class="s-updownBg s-link3"></i>\
                                        <span>' + obj.name + '</span>\
                                        <i class="s-updownBg s-dels3"></i>\
                                    </li>';
                            $list.append(html);
                        }
                        $('.up-form')[0].reset();
                    }
                }).submit();
            }
        };
    });
});