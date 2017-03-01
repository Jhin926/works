require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab) {
        var userId = $.GetQueryString('userId')
        $('#savenewFile').bind('click', function () {
            var pid = $('#navInput', parent.document).attr("data-pid");
            var name = $('#Newfilename').val();
            var data = {
                pid: pid,
                name: name,
                file: '',
                size: '0',
                type: '0',
                shareType: '1',
                operateType: '0',
                userType: '0',
                userIds: '0'
            }
            $.ajax({
                url: Base.sitUrl + '/api/disk/v1/file/save',
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (res.success) {
                        //var data = parent.$.file(userId, pid);//跟新云盘列表
                        $.DestroyPopInPop();
                        parent.location.reload();
                    } else {
                        $.unLogin(res);
                        return
                    }
                }
            })
        })
    });
});