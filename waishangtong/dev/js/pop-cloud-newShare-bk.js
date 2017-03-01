require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab) {
        var editData = $.GetQueryString('data');
        if (editData !== '' && editData !== null && editData !== undefined) {
            var data = eval("(" + editData + ")");
            $('#Newfilename').val(data.name);
            if (data.operatetype == 1) {
                $('#NewfilePower').prop('checked', true);
                $('#NewfilePower').parent('span').addClass('checked');
            } else {
                $('#NewfilePower').prop('checked', false);
                $('#NewfilePower').parent('span').removeClass('checked');
            }
            if (data.usertype == 0) {
                $('#Newfilepeople1').prop('checked', true);
                $('#Newfilepeople1').parent('span').addClass('checked');
                $('#Newfilepeople2').prop('checked', false);
                $('#Newfilepeople2').parent('span').removeClass('checked');
            } else {
                $('#Newfilepeople1').prop('checked', false);
                $('#Newfilepeople1').parent('span').removeClass('checked');
                $('#Newfilepeople2').prop('checked', true);
                $('#Newfilepeople2').parent('span').addClass('checked');
            }
            var user = new Array();
            user = data.userid.split(',');
            if (data.userid !== '') {
                $.ajax({
                    url: Base.sitUrl + '/api/org/v1/org/staff/list',
                    type: 'POST',
                    dataType: 'json',
                    async: false,
                    success: function (res) {
                        var data = res.data;
                        if (data.length > 0) {
                            var html = '';
                            for (var i = 0; i < data.length; i++) {
                                for (var j = 0; j < user.length; j++) {
                                    if (data[i].id == user[j]) {
                                        console.log(123)
                                        html += '<span class="emailAccount left successSpan" data-id="' + data[i].id + '">' +
                                            '<span class="emailLabel">' + data[i].name + '</span>' +
                                            '<i class="i-emailClose"></i>' +
                                            '</span>'
                                    }
                                }
                            }
                            $('.stepCont2 span.emailAccount').remove();
                            $('.stepCont2').prepend(html);
                            $('#addPop').css('display', 'inline-block');
                        } else {
                            $(".modelDwon").empty();
                        }
                    }
                });
            }
        }
        var userId = $.GetQueryString('userId');
        $('#savenewFile').bind('click', function () {
            var pid = $('#navInput', parent.document).attr("data-pid");
            pid = pid==0?1:pid;
            var name = $('#Newfilename').val();
            if ($('#NewfilePower').parent('span').hasClass('checked')) {
                var operateType = 1
            } else {
                var operateType = 0
            }
            if ($('#Newfilepeople1').parent('span').hasClass('checked')) {
                var userType = 0
            } else if ($('#Newfilepeople2').parent('span').hasClass('checked')) {
                var userType = 1
            }
            var userIds = '';
            for (var i = 0; i < $('.emailAccount').length; i++) {
                userIds += $('.emailAccount').eq(i).attr('data-id') + ','
            }
            userIds = userIds.substring(0, userIds.length - 1);
            if (editData !== '' && editData !== null && editData !== undefined) {
                var url = '/api/disk/v1/file/edit';
                var data = {
                    view: '1',
                    id: eval("(" + editData + ")").id,
                    pid: pid,
                    name: name,
                    shareType: '2',
                    operateType: operateType,
                    userType: userType,
                    userIds: userIds
                }
            } else {
                var url = '/api/disk/v1/file/save'
                var data = {
                    pid: pid,
                    name: name,
                    file: '',
                    size: '0',
                    type: '0',
                    shareType: '2',
                    operateType: operateType,
                    userType: userType,
                    userIds: userIds
                }
            }
            $.ajax({
                url: Base.sitUrl + url,
                type: 'POST',
                dataType: 'json',
                data: {
                    data: JSON.stringify(data)
                },
                success: function (res) {
                    if (res.success) {
                        $.DestroyPopInPop();
                        parent.location.reload();
                    } else {
                        $.unLogin(res);
                        return
                    }
                }
            })
        })
        //跟进人
        function follower() {
            $.ajax({
                url: Base.sitUrl + '/api/org/v1/org/staff/list',
                type: 'POST',
                dataType: 'json',
                async: false,
                success: function (res) {
                    var data = res.data;
                    if (data.length > 0) {
                        var html = '';
                        for (var i = 0; i < data.length; i++) {
                            var name = data[i].name;
                            html += '<li data-id="' + data[i].id + '"><input type="checkbox" id="checkbox' + i + '" name="model-checkbox">&nbsp;<label for="checkbox' + i + '" style="display: inline-block;margin-left: 5px;position: absolute;margin-top: 5px;">' + data[i].name + '</label></li>';
                        }
                        $(".modelDwon").empty();
                        $(".modelDwon").append(html);
                        for (var i = 0; i < $('.emailAccount').length; i++) {
                            for (var j = 0; j < $('.modelDwon').find('li').length; j++) {
                                if ($('.emailAccount').eq(i).attr('data-id') == $('.modelDwon').find('li').eq(j).attr('data-id')) {
                                    $('.modelDwon').find('li').eq(j).find('input[type=checkbox]').prop('checked', true);
                                }
                            }
                        }
                    } else {
                        $(".modelDwon").empty();
                    }
                }
            });
        }

        $('#addPop').bind('click', function () {
            follower();
        })
        $('.stepCont2').on('click', '.i-emailClose', function () {
            $(this).parents('span.emailAccount').remove();
        })
        //选择人员
        $('#sure').on('click', function () {
            var h = $('.modelDwon').find('li input[type=checkbox]:checked').length;
            var html = '';
            for (var i = 0; i < h; i++) {
                var name = $('.modelDwon').find('li input[type=checkbox]:checked').eq(i).parents('li').find('label').text();
                var id = $('.modelDwon').find('li input[type=checkbox]:checked').eq(i).parents('li').attr('data-id');
                html += '<span class="emailAccount left successSpan" data-id="' + id + '">' +
                    '<span class="emailLabel">' + name + '</span>' +
                    '<i class="i-emailClose"></i>' +
                    '</span>'
            }
            $('.stepCont2 span.emailAccount').remove();
            $('.stepCont2').prepend(html);
            $('#myModal .close').click();
        })
        //添加员工
        $('input[name=f-people]').bind('click', function () {
            if ($('#Newfilepeople2').prop('checked')) {
                $('#addPop').show();
            } else {
                $('#addPop').hide();
            }
        })
    });
});