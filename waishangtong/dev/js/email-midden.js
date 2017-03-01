/* !
 *  用于通讯录
 */
require([ 'common' ], function () {
    require(['maintab', 'blockUI', 'datetimepickerCN'], function (maintab) {
        maintab.init();

        if (jQuery().datetimepicker) {
            $('.emailTime').datetimepicker({
                format: "yyyy-mm-dd hh:ii",
                todayBtn: false,
                language: "zh-CN",
                startDate: new Date(),
                pickerPosition: "bottom",
                autoclose: true
            });
        }

        var getListObj = {
            homepage: 1,
            lastpage: null,
            currentPage: 1,
            pageSize: 20,
            group: 0,
            unread: 0,
            star: 0,
            deleted: 0,
            spam: 1,
            tag: '',
            subject: '',
            content: ''
        };

        $('.close-side-handle').click(function(){
            $('.side-handle').css('left','-101%');
        });

        $('input[name=allCheck]').change(function(){
            if($(this).prop('checked')){
                $('.side-handle').css('left',0);

                $('input[name=check]').prop('checked',true).parent().addClass('checked');
            }else{
                $('.side-handle').css('left','-101%');
                $('input[name=check]').prop('checked',false).parent().removeClass('checked');
            }
        });
        $('.email-list').on('click','input[name=check]',function(e){
            e.stopPropagation();
            var $this = $(this);
            if($this.prop('checked')){
                $('.side-handle').css('left',0);
                $this.parent().addClass('checked');
                $this.closest('li').addClass('active');
            }else{
                $this.parent().removeClass('checked');
                var getChecked = $('.email-list input[name=check]:checked');
                if(getChecked.length<=0){
                    $('.side-handle').css('left','-101%');
                }
                $this.closest('li').removeClass('active');
            }
        });
        $('.email-list').on('click','.list-item',function(){
            maintab.showTab(Base.url + '/html/pop-email-detail.html?id=' + $(this).attr('data-id') + "&v=" + window.ver, '详情');
        });

        $('.email-list').on('click','.tag-close',function(e){
            $.EventFn(e);
            var _this = this;
            var id = $(this).parent().attr('data-id');
            deleteTag(id, function(){
                $(_this).parent().remove();
            });
        });
        $('#btn-del').click(function(){
            var checkedItem = $('input[type=checkbox][name=check]:checked');
            var idArr = [];
            if(checkedItem.length>0){
                for(var i=0;i<checkedItem.length;i++){
                    idArr.push(checkedItem.eq(i).closest('.list-item').attr('data-id'));
                }
                deleteEml(idArr);
            }else{
                $.Alert('请至少勾选一封邮件！');
            }
        });

        $('#quikSearch').on('input',function(){
            var $this = $(this);
            if($this.val()!=''){
                $this.next().removeClass('ico-search').addClass('ico-search-clear');
            }else{
                $this.next().addClass('ico-search').removeClass('ico-search-clear');
            }
        });
        $('#quikSearch').keyup(function(e){
            if(e.keyCode == 13){
                if($(this).val() != ''){
                    var obj = {
                        filtrate: 1,
                        keyword: $(this).val(),
                        attachmentName: ''
                    };
                    getList(obj);
                }
            }
        });
        $('.search').on('click','.ico-search-clear',function(){
            $('#quikSearch').val('');
            $(this).addClass('ico-search').removeClass('ico-search-clear')
        });

        //获取列表
        function getList(_obj){
            var filterObj = getListObj;
            if(_obj){
                $.extend(filterObj, _obj);
            }
            //收件箱
            $.ajax({
                url: Base.sitUrl + '/api/email/inbox/v1/search',
                data: {
                    data: JSON.stringify(filterObj)
                },
                type: 'POST',
                beforeSend: function (XHR) {
                    $.BlockUI();
                },
                complete: function (XHR, TS) {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    var list = res.data.results;
                    showList(list,res.data);
                }
            });
        }

        function showList(_list,_data){
            var addresseeImg = 'sender4-icon';
            var html = '';
            for(var i =0;i<_list.length;i++){
                var time = _list[i].sendTime.substring(0,_list[i].sendTime.lastIndexOf('.'));//时间
                var sta = _list[i].visitingCard.status;//图标
                if(sta == 1 || sta == 2){
                    addresseeImg = 'sender4-icon';
                }else if(sta == 3 || sta == 4){
                    addresseeImg = 'sender1-icon';
                }else if(sta == 5 || sta == 6){
                    addresseeImg = 'sender3-icon';
                }else if(sta == 7 || sta == 8){
                    addresseeImg = 'sender2-icon';
                }
                var tagsList = '';
                if(_list[i].tags != null && _list[i].tags != ''){
                    var tagsLength = _list[i].tags.length;
                    tagsLength= tagsLength>2?2:tagsLength;//最多显示两个标签
                    for(var j = 0;j<tagsLength;j++){
                        tagsList+='<span class="tag-item" data-id="'+ _list[i].tags[j].id +'">\
                            <span class="tag-name ellipsis">'+ _list[i].tags[j].name +'</span>\
                            <i class="pub-icon tag-close"></i>\
                            </span>';
                    }
                }
                html += '<li class="list-item" data-id="'+ _list[i].id +'">\
                <div class="email-check"><input name="check" type="checkbox" /></div>\
                <div class="addressee"><i class="pub-icon '+ addresseeImg +'"></i>\
                <span class="addressee-name ellipsis">'+ _list[i].visitingCard.title +'</span></div>\
                <div class="email">\
                <span class="email-subject ellipsis">'+ _list[i].subject +'</span>\
                <span class="email-content ellipsis">- '+ _list[i].content +'</span>\
                <div class="tags-list">'+ tagsList +'</div></div>\
                <div class="time">'+ time +'</div>\
                <div class="clear"></div>\
                </li>';
            }
            $('.email-list').empty().append(html);
            $('.email-list').find(':checkbox').uniform();
            var total = _data.totalItem,
                all= Math.ceil(total / getListObj.pageSize);
            $.Page({
                total: total,
                _class: '.page',
                nowNum: getListObj.currentPage,
                allNum: all,
                callback: function (now, all) {
                    getListObj.currentPage = now;
                    getList();
                }
            });
        }

        function deleteTag(id,callback) {
            $.ajax({
                url: Base.sitUrl + '/api/email/v1/tag/delete',
                type: 'POST',
                data: 'data=' + JSON.stringify({id: id}),
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    if(callback && typeof callback==='function'){
                        callback();
                    }
                }
            });
        }

        function deleteEml(ids){
            var postData = 'data=' + JSON.stringify({
                    'ids': ids
                });
            $.ajax({
                url: Base.sitUrl + '/api/email/inbox/v1/delete',
                type: 'POST',
                data: postData,
                beforeSend: function (XHR) {
                    $.BlockUI();
                },
                complete: function (XHR, TS) {
                    $.UnblockUI();
                },
                success: function (res) {
                    if (!res.success) {
                        $.unLogin(res);
                        return;
                    }
                    getList();
                }
            });
        }

        getList();
    });
});