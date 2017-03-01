/* !
 *  用于添加编辑角色
 */
require([ 'common' ], function () {
    require([ 'maintab', 'validationLang' ], function (mainTab) {

        var $saveRole = $('#saveRole'),
            $cancelAddRole = $('#cancelAddRole'),
            $eSaveRole = $('#editSaveRole'),
            $eCancelAddRole = $('#editCancelAddRole'),
            roleId = $.GetQueryString('roleid'),
            $addRoleForm = $('#addRoleForm'),
            $editRoleForm = $('#editRoleForm');

        // 校验
        $addRoleForm.validate();
        $editRoleForm.validate();

        // 取消
        $cancelAddRole.on('click', function () {
            $.DestroyPopInPop();
        });
        $eCancelAddRole.on('click', function () {
            $.DestroyPopInPop();
        });

        // 获取角色
        if (roleId != null) {   // 判断是否编辑状态
            $.AjaxFun({
                data: {
                    _mt: 'userSecurity_getRoles'
                },
                success: function (result) {
                    $.each(result.data, function (index, obj) {
                        if (obj.id == roleId) {
                            renderRoleForm(obj);
                            return;
                        }
                        ;
                    });
                }
            });
        }
        ;

        // 添加角色
        $saveRole.on('click', function () {
            if ($addRoleForm.valid()) {  // 判断是否通过校验
                var name = $.trim($('[name="name"]').val());
                var description = $.trim($('[name="description"]').text());
                $.AjaxFun({
                    data: {
                        _mt: 'userSecurity_addRole',
                        name: name,
                        description: description
                    },
                    success: function (result) {
                        if (result.success)
                            $.Alert('添加成功！', '', function () {
                                parent.location.href = parent.location.href;
                            })
                        //parent.mainTab.destroy();
                        else $.Alert(result.message);
                    }
                });
            }
            ;
            return false;
        });

        // 编辑角色表单赋值
        function renderRoleForm(obj) {
            var $name = $('[name="name"]'),
                $description = $('[name="description"]');
            if (obj['name']) $name.val(obj['name']);
            if (obj['description']) $description.text(obj['description']);
            // 编辑保存
            $eSaveRole.on('click', function (e) {
                e.preventDefault();
                var name = $.trim($name.val()),
                    description = $.trim($description.text());
                if (name == obj.name || description == obj.description) return;
                obj.name = $.trim($name.val());
                obj.description = $.trim($description.text());
                if ($editRoleForm.valid()) {  // 判断是否通过校验
                    $.AjaxFun({
                        data: {
                            _mt: 'userSecurity_editRole',
                            roleEntity: JSON.stringify(obj)
                        },
                        success: function (result) {
                            if (result.success)
                                parent.mainTab.destroy();
                            else $.Alert(result.message);
                        }
                    });
                }
                return false;
            });
        };
    });
});
