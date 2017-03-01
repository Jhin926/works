/* !
 *  用于个人设置
 */
require( [ 'common' ], function(){
    require( [ 'ztree', 'maintab', 'setpassword', 'validationLang', 'rsa' ], function( zTree, maintab, setPsd ){

        // 右侧弹窗初始化
        maintab.init();

        // 修改密码模块初始化
        setPsd.init();

        // 参数设置
        var setting = {
            view: {
                showIcon: showIconForTree
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };

        // 角色管理树据
        var zNodes =[
            { name:"常用功能", open:true,
                children: [
                    { name:"CRM功能",
                        children: [
                            { name:"客户",
                                children: [
                                    { name:"查看客户列表"},
                                    { name:"编辑客户"},
                                    { name:"删除客户"},
                                    { name:"查看客户详情"}
                                ]
                            },
                            { name:"邮件",
                                children: [
                                    { name:"查看邮件列表"},
                                    { name:"查看邮件详情"}
                                ]
                            },
                            { name:"商机"},
                            { name:"任务"}
                        ]},
                    { name:"系统功能",
                        children: [
                            { name:"组织架构"},
                            { name:"角色管理"}
                        ]}
                ]}
        ];

        /*
         * @description: 定义是否显示树节点的图标
         * @treeId: 树的ID
         * @treeNode: 树对象
         */
        function showIconForTree( treeId, treeNode ) {
            return !treeNode.isParent;
        };

        $.fn.zTree.init($("#roleTree"), setting, zNodes);
        
        //  yuexiahandao@gmail.com  85802178
        var a = null;
        function openWindow(url, param) {
            a = window.open(url,'new',param);
            var t = setInterval(function(){
                if(a.closed){
                    clearInterval(t);
                    socialAccount('help');
                }
            },500);
        }
        
        //  查询绑定账户信息
        socialAccount('param');
        function socialAccount(param){
            // $.AjaxFun({
            //     data: {
            //         _mt: 'socialAuth_socialAccounts'
            //     },
            //     type: 'GET',
            //     success: function(result){
            //         var list = result.data;
            //         console.log(result.data);
            //         if(list && list.length > 0){
            //             for(var i =0; i<list.length;i++){
            //                 var _t = '<div class="binding-user binding-hasimg" id=user_'+list[i].id+'_'+list[i].accountId+'>'+
            //                         '<img src='+list[i].imageUrl+'>'+
            //                         '<span class="binding-user-name">'+list[i].displayName+'</span>'+
            //                         '<span class="binding-user-btn">'+
            //                             '<a class="btn btn-success btn-xs">导入产品</a>'+
            //                         '</span>'+
            //                         '<a href="javascript:;" class="close">×</a>'+
            //                     '</div>';
            //                 var _p = '.'+list[i].socialType;
            //                 console.log(_p);
            //                 $(_p).prepend(_t);
            //                 var _btn = $(_p).prev('.binding-btn').find('button');
            //                 _btn.text('已连接').removeClass('btn-default').addClass('btn-primary').attr('disabled',true);
            //             }
            //         }
            //     }
            // });
        };
        //  facebook 授权
        // $('#facebook').click(function(){
        //     authFn('socialAuth_facebook','f');
        // });
        
        //  twitter 授权
        $('#twitter').click(function(){
            authFn('socialAuth_twitter','t');
        });
        function authFn(url,type){
            // $.AjaxFun({
            //     data: {
            //         _mt: url
            //     },
            //     type: 'GET',
            //     success: function(result){
            //         if( !result.success ){ $.Alert( result.message ); return false;}
            //         var _w = 600;
            //         var _h = 500;
            //         var _l = (window.screen.availWidth -10 - _w) / 2;
            //         var _t = (window.screen.availHeight - _h) / 2;
            //         if(type == 'f'){
            //             addListener($('#facebook')[0],'click',openWindow(result.data, 'top='+_t+', left='+_l+', width='+_w+', height='+_h+',location=no,menubar=no,resizeable=no,scrollbars=auto,status=no,toolbar=no'));
            //         }else if(type == 't'){
            //             addListener($('#twitter')[0],'click',openWindow(result.data, 'top='+_t+', left='+_l+', width='+_w+', height='+_h+',location=no,menubar=no,resizeable=no,scrollbars=auto,status=no,toolbar=no'));
            //         }
            //     }
            // });
        }
        //左侧点击切换
        $(document).on('click','#sideMenu li',function(){
            if($(this).find(".sub-menu").css("display") == 'none'){
                $(this).find(".sub-menu").show();
                $(this).find(".s-menuUp").css("transform","rotate(180deg)");
            }else{
                $(this).find(".sub-menu").hide();
                $(this).siblings().find("ul").hide();
                $(this).find(".s-menuUp").css("transform","rotate(0deg)");
            }
        });
        $("#sideFooter .side-footer-btn").on('click',function(){
            if($(this).parent().find(".side-footer-pop").css("display") == 'none'){
                $(this).parent().find(".side-footer-pop").show();
                $(this).parent().find(".side-footer-pop li").eq(0).hide();
            }else{
                $(this).parent().find(".side-footer-pop").hide();
            }
        })
            
        //email账号绑定查询
        function emailBinding(){
            $.ajax({
                url:Base.sitUrl + '/api/user/v1/account/binding/list',
                type:'POST',
                dataType:'json',
                success:function(res){
                    if(!res.success){$.unLogin(res);return;};
                    var data = res.data;
                    var i = 0;
                    $("#emailAccount").find(".binding-user").remove();
                    for(var j=0;j<data.length;j++){
                        if(data[j].type == 1){
                            if(data[j].isBinding == 1){
                                $("#emailLink").hide();
                                $("#emailAccount").show();
                                var account = '<div class="binding-user">'+
                                                    '<span class="binding-user-name" data-id="'+data[j].accountId+'">'+data[j].accountName+'</span>'+
                                                '</div>';
                                $("#emailAccount").find("#emailUnbinding").before(account);
                            }
                        }
                    }
                }
            });
        }
        //email解绑
        function emailUnbinding(){
            $.ajax({
                url:Base.sitUrl + '/api/user/email/v1/unbinding',
                type:'POST',
                dataType:'json',
                data:{
                    type:1
                },
                success:function(res){
                    if(!res.success){$.Alert(!res.message);return;};
                    $("#emailLink").show();
                    $("#emailAccount").hide();
                    emailBinding();
                }
            });
        }
        $("#emailUnbinding").on('click',function(){
            $.Confirm("确认解除绑定？","",function(){
                emailUnbinding();
            });
        })
        emailBinding();
        //facebook
        $('#facebookBtn').bind('click',function(){
            var uri = 'https://graph.facebook.com/oauth/authorize?client_id=1695631794021366&display=page&redirect_uri='+Base.sitUrl+'/html/main.html&scope=public_profile,publish_stream,email,user_birthday,user_photos,friends_photos'
            parent.location.href = uri ;
        });
        //facebook账号绑定查询
        function fbBinding(){
            $.ajax({
                url:Base.sitUrl + '/api/facebook/detail',
                type:'POST',
                dataType:'json',
                data:{
                    id:$('#pageLeftUserName',parent.document).attr('data-id')
                },
                success:function(res){
                    if(!res.success){$.Alert(!res.message);return;};
                    var data = res.data;
                    if(data !== null && data !== '' && data !== undefined){
                        var account = '<div class="binding-user">'+
                                        '<span class="binding-user-name" data-id="'+data.id+'" data-fbid="'+data.facebookId+'">'+data.email+'</span>'+
                                    '</div>'+
                                    '<a href="#" class="close" id="fbbinding1" style="color:blue;'+
                                    'opacity:.65;font-size:12px;top:15px;">解绑</a>';
                        $('#facebookBtn').parent().hide();
                        $('#facebookBtn').parent().before(account);
                        $('#facebook').hide();
                        $('.facebook').show();
                    } 
                }
            });
        }
        //facebook解绑
        function fbUnbinding(){
            var id = $('#pageLeftUserName',parent.document).attr('data-id')
            var data = {
                userId:parseInt(id),
                type:1
            }
            $.ajax({
                url:Base.sitUrl + '/api/social/unbinding',
                type:'POST',
                dataType:'json',
                data:{
                    data:JSON.stringify(data)
                },
                success:function(res){
                    if(!res.success){$.Alert(!res.message);return;};
                    $("#fbLink").show();
                    $("#fbAccount").hide();
                    fbBinding();
                }
            });
        }
        $(document).on('click',"#fbbinding1",function(){
            $.Confirm("确认解除绑定？","",function(){
                fbUnbinding();
            });
        })
        fbBinding();
    });
});
