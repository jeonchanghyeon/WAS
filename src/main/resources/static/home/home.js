function getUserData() {
    $.ajax({
        url: "../home/get/" + $("#userId").val(),
        method: "GET",
        dataType: "json",
        success: function (data) {
            if (data.resultCode === 0) {
                if (data.user.length < 1) { // 받아온 데이터가 없는 경우
                    alert("데이터가 존재하지 않습니다.");
                    return;
                }
                var tbody = $("#userListTable").find("tbody");
                tbody.empty();

                var html = "<tr>";
                html += "<td>" + data.user.id + "</td>";
                html += "<td>" + data.user.serverName + "</td>";
                html += "</tr>";
                tbody.append(html);
            } else {
                alert(data.description);
            }
        },
        error: function (xhr, status, err) {
            alert(status + "\n" + err);
        }
    });
}

function insertData() {
    if ($("#userId").val() === '') {
        alert("사용자ID를 작성해주세요");
        return;
    }

    if ($("#userLocation").find("option:selected").val() === '') {
        alert("소속DB를 선택해주세요");
        return;
    }

    $.ajax({
        url: "../home/add",
        method: "POST",
        data: {
            "id": $("#userId").val(),
            "serverId": $("#userLocation").find("option:selected").val()
        },
        dataType: "json",
        success: function (data) {
            if (data.resultCode === 0) {
                alert("작성 완료되었습니다.");
                window.location.href = "../home";
            }
        },
        error: function (xhr, status, err) {
            alert(status + "\n" + err);
        }
    });
}