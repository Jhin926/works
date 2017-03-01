/* !
 *  用于个人设置
 */
require([ 'common' ], function () {
    require([ 'ztree', 'maintab', 'setpassword', 'validationLang', 'rsa' ], function (zTree, mainTab, setPsd) {

        // 右侧弹窗初始化
        mainTab.init();

        var $rolesList = $('#rolesList'),
            $roleTree = $('#roleTree');

        // 获取角色管理信息列表
        $.BlockUI();    // 加载状态
        $.AjaxFun({
            data: {
                _mt: 'userSecurity_getRoles'
            },
            success: function (result) {
                //console.log( result );
                var html = '';
                $.each(result.data, function (index, obj) {
                    html += '<li><a data-roleId="' + obj.id + '" href="#">' + obj.name + '</a></li>'
                });
                $rolesList.append(html).find('li:first').addClass('current');
                // 解除加载状态
                $.UnblockUI();
            }
        });

        // 参数设置
        var setting = {
            callback: {
                beforeExpand: zTreeBeforeExpand,
                onCheck: zTreeOnCheck
            },
            check: {
                enable: true
            },
            data: {
                simpleData: {
                    enable: true
                }
            }
        };

        // 勾选状态
        function zTreeOnCheck(event, treeId, treeNode) {
            treeNode.cusFiled = treeNode.checked ? 1 : 0;
            $.AjaxFun({
                data: {
                    _mt: 'userSecurity_editRole',
                    roleEntity: JSON.stringify(treeNode)
                },
                success: function (result) {
                    console.log(result);
                }
            });
        };

        // 展开时获取子级
        function zTreeBeforeExpand(treeId, treeNode) {
            console.log(treeNode);
        };

        // 获取对应权限信息列表
        function initTree(roleId, pId) {
            var roleId = roleId || 1,
                pId = pId || -1;
            $.AjaxFun({
                data: {
                    _mt: 'userSecurity_getRoleCategoriesAndAllCate',
                    roleId: roleId,
                    pCateId: -1
                },
                success: function (result) {
                    var znodes = result.data;
                    $.each(znodes, function (index, obj) {
                        // 持有或者不持有？
                        obj.checked = ( obj.cusFiled == 1 ) ? true : false;
                        // 是否父节点
                        obj.isParent = ( obj.isLeaf == 0 ) ? true : false;
                    });
                    $.fn.zTree.init($roleTree, setting, znodes);
                }
            });
        };

        // 点击角色管理显示对应权限树
        $rolesList.on('click', 'li>a', function () {
            var roleId = $(this).data('roleid');
            $(this).parent('li').addClass('current').siblings('li').removeClass('current');
            initTree(roleId);
            return false;
        });

        // 默认显示第一个树
        initTree();
    });
});
