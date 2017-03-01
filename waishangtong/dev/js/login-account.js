/* !
 *  用于邮件模板
 */
require([ 'common' ], function () {
    require(['blockUI', 'cityselect'], function (citySelect) {
        $('input[name=password]').bind('input', function () {
            var pw = $(this).val();
            if (pw.length > 6 && pw.length < 12) {
                $('.pwAlert').show();
                $('.pwAlert .pw:first-child').addClass('active').siblings('.pw').removeClass('active');
                $('#pwP').text('弱');
            } else if (pw.length >= 12 && pw.length < 18) {
                $('.pwAlert').show();
                $('.pwAlert .pw:first-child').addClass('active');
                $('.pwAlert .pw:nth-child(2)').addClass('active');
                $('.pwAlert .pw:nth-child(3)').removeClass('active');
                $('#pwP').text('中');
            } else if (pw.length >= 18) {
                $('.pwAlert').show();
                $('.pwAlert').find('.pw').addClass('active');
                $('#pwP').text('强');
            } else {
                $('.pwAlert').find('.pw').removeClass('active');
                $('#pwP').text('');
            }
        })
        $('#city').citySelect({});
    });
});