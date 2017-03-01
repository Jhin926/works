require([ 'common' ], function () {
    require(['maintab'], function (mainTab) {
        //查询列表
        $.ajax({
            url: Base.sitUrl + "/api/org/v1/org/staff/limit/edm/list",
            dataType: "json",
            type: "POST",
            success: function (result) {
                if (!result.success) {
                    $.Alert(result.message);
                    return;
                }

                var data = result.data;
                for (var i = 0; i < data.length; i++) {
                    var spNumber = data[i].totalNumber - data[i].usedNumber;
                    var trList = '<tr data-id="' + data[i].id + '">' +
                        '<td width="20%" data-uerId="' + data[i].userId + '"><label class="blue">' + data[i].userName + '</label></td>' +
                        '<td width="20%" data-dep="' + data[i].department + '"><label>' + data[i].departmentName + '</label></label></td>' +
                        '<td width="20%"><label>' + data[i].usedNumber + '</label></td>' +
                        '<td width="20%">' +
                        '<input type="text" class="table-input" value="' + data[i].totalNumber + '">' +
                        '</td></tr>';
                    $(".table tbody").append(trList);
                }
            }
        });
        //修改列表
        $("#save").unbind('click').on('click', function () {
            var trI = $(".table tbody").children("tr");
            var dataJson = "";
            var editData = "";
            for (var i = 0; i < trI.length; i++) {
                var inputNum = trI.eq(i).find("input[type=text]").val();
                var num = parseInt(trI.eq(i).find("td:nth-child(3)").text());
                if (isNaN(inputNum)) {
                    $.Alert("请填写数字");
                    trI.eq(i).find("input[type=text]").css("border", "1px solid red");
                    return;
                }
                dataJson += '{"key":"' + trI.eq(i).data("id") + '","value":"' + inputNum + '","valueI":"' + num + '","type":"' + 3 + '"}' + ',';
            }
            dataJson = dataJson.substr(0, dataJson.length - 1);
            editData = '{"keyValueTypes":[' + dataJson + ']}';
            $.Confirm("确认修改？", "", function () {
                $.ajax({
                    url: Base.sitUrl + "/api/org/v1/org/staff/limit/edm/edit",
                    dataType: "json",
                    type: "POST",
                    data: {
                        data: editData
                    },
                    success: function (result) {
                        if (!result.success) {
                            $.Alert(result.message);
                            return;
                        }

                        window.location.reload();
                    }
                });
            });
        });
    });
});