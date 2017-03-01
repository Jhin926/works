/* !
 *  用于邮件详情
 */
require([ 'common' ], function () {
    require(['blockUI', 'jqprint'], function () {
        var emailId = $.GetQueryString('id');
        var type = $.GetQueryString('type');
        if (type == 1) {//收件详情
            var uri = '/api/email/inbox/v1/detail?id=' + emailId;
            email(uri)
        } else if (type == 2) {//发件详情
            var uri = '/api/email/outbox/v1/detail?id=' + emailId;
            email(uri)
        } else if (type == 3) {//开发信详情
            devLetter(emailId)
        }

        function email(uri) {//邮件详情
            $.ajax({
                url: Base.sitUrl + uri,
                type: 'get',
                success: function (res) {
                    var data = res.data
                    $('body').empty().append(data.content)
                    data.content = ''
                    var div = '<textarea style="display:none" id="data">' + JSON.stringify(data) + '</textarea>'
                    $('body').append(div)
                    var h = $('html').height() + 100
                    parent.$.getFrame(h)
                }
            })
        }

        function devLetter(emailId) {//开发信详情
            $.ajax({
                url: Base.sitUrl + '/api/edm/v1/email/content',
                type: 'POST',
                dataType: 'json',
                data: {
                    id: emailId
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }

                    var data = res.data;
                    var content = data.content;
                    content = content.replace(/&#39;/g, '\"')
                    $('body').empty().html(content);
                    parent.$.devLetterDetail(data)
                    var h = $('html').height() + 100
                    parent.$.getFrame(h)
                }
            })
        }
    });
});