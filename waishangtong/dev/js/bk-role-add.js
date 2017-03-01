require([ 'common' ], function () {
    require(['maintab', 'blockUI'], function (maintab) {
        //新建角色
        $("#pop-add-save").on('click', function () {
            var popAddName = $("#pop-name").val();
            var remark = $("#remark").val();
            if (popAddName == "") {
                $.Alert("角色名不能为空");
            } else {
                $.ajax({
                    type: "POST",
                    url: Base.sitUrl + "/api/org/v1/org/role/save",
                    dataType: "json",
                    data: {
                        name: popAddName,
                        remark: remark,
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }
                        if (result.success) {
                            parent.location.reload();
                            $.DestroyPopInPop();
                        } else {
                            $.Alert(result.message);
                        }
                    }
                });
            }
        });
    });
});