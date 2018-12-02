Date.prototype.mmdd = function() {
    var mm = (this.getMonth() + 1).toString();
    var dd = this.getDate().toString();
    return (mm[1] ? mm : '0'+mm[0]) + "-" + (dd[1] ? dd : '0'+dd[0]);
};
Date.prototype.HHMM = function() {
    var HH = this.getHours().toString();
    var MM = this.getMinutes().toString();
    return (HH[1] ? HH : '0'+HH[0]) + ":" + (MM[1] ? MM : '0'+MM[0]);
};
String.prototype.fillZero = function() {
    var zeroNum = 5 - this.length;
    if(zeroNum < 0) return this;
    return '00000'.substr(this.length, zeroNum) + this;
};
String.prototype.numberWithCommas = function() {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

var statNameMap = ["", "접수", "배차", "픽업", "완료", "취소", "대기"];
var payNameMap = ["", "카드", "현금", "선결제"];

function ajax(url, method, func, content = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            try {
                const obj = JSON.parse(this.responseText);
                func(obj);
            } catch (error) {
            }
        }
    };

    xhr.send(content)
}

function changeDistributeSelect() {
    const distributorSelect = document.getElementById("select_distributor");
    var selectText = distributorSelect.options[distributorSelect.selectedIndex].text;

    if(selectText === "--") selectText = "-1";
    ajax("status/distributors?distributorNum=" + selectText, "get", resultJsSelector)
}

function resultJsSelector(obj) {
    const selector = document.getElementById('select_branch');
    let option = document.createElement('option');

    selector.innerHTML = "";
    option.defaultSelected;
    option.value = "";
    option.text = "--";
    selector.appendChild(option);

    for (let i = 0; i < obj.length; i++) {
        option = document.createElement('option');
        option.value = obj[i];
        option.text = obj[i];
        selector.appendChild(option);
    }
}

function showSearchList() {
    let content = null;
    const branchSelect = document.getElementById("select_branch");
    const startDateSelect = document.getElementById("select_start_date");
    const endDateSelect = document.getElementById("select_end_date");

    var branchText = branchSelect.options[branchSelect.selectedIndex].text;
    const startDateText = startDateSelect.options[startDateSelect.selectedIndex].text;
    const endDateText = endDateSelect.options[endDateSelect.selectedIndex].text;

    if(branchText === "--") branchText = "-1";
    ajax("status/orders?branch=" + branchText + "&start_date=" + startDateText + "&end_date=" + endDateText, "get", resultJsSearchList);
}

function resultJsSearchList(obj) {
    const container = document.getElementById("result_list");
    container.innerHTML = '';
    const size = obj["resultObject"]["orders"].length;

    document.getElementById("statusTextAll").innerHTML = size;
    for(let i = 1; i <= 7; i++) document.getElementById("statusText" + i).innerHTML = obj["resultObject"]["counts"][i-1];

    if(size == 0) {
        const branchSelect = document.getElementById("select_branch");
        const branchText = branchSelect.options[branchSelect.selectedIndex].text;
        if(branchText === "--") container.innerHTML = '';
        else {
            const td = document.createElement("td");
            td.colSpan = 14;
            td.innerHTML = "데이터가 존재하지 않습니다.";
            container.appendChild(td);
        }
        return;
    }

    for(let i = 0; i < size; i++) {
        const row = document.createElement("tr");
        const text = [ obj["resultObject"]["orders"][i].id.toString().fillZero(),
                        (new Date(obj["resultObject"]["orders"][i].createDate)).mmdd() + "-" + (new Date(obj["resultObject"]["orders"][i].createDate)).HHMM(),
                        obj["resultObject"]["orders"][i].shop,
                        statNameMap[obj["resultObject"]["orders"][i].status],
                        (new Date(obj["resultObject"]["orders"][i].createDate)).HHMM(),
                        (new Date(obj["resultObject"]["orders"][i].allocateDate)).HHMM(),
                        (new Date(obj["resultObject"]["orders"][i].pickupDate)).HHMM(),
                        (new Date(obj["resultObject"]["orders"][i].completeDate)).HHMM(),
                        (new Date(obj["resultObject"]["orders"][i].cancelDate)).HHMM(),
                        obj["resultObject"]["orders"][i].deliveryCost.toString().numberWithCommas(),
                        "0",    //추가 대행료(계산필요)
                        obj["resultObject"]["orders"][i].riderName,
                        payNameMap[obj["resultObject"]["orders"][i].paymentType],
                        obj["resultObject"]["orders"][i].requests];
        for(let j = 0; j < text.length; j++) {
            console.log(text[j]);
            const col = document.createElement("td");
            col.innerHTML = text[j];
            row.appendChild(col);
        }
        container.appendChild(row)
    }
}

function changeStatusCheckBox(idx) {
    const selectedCheckBox = document.getElementById("statusAll");
    if(document.status.elements[0].checked == true)
        for(let i = 1; i <= 7; i++) document.status.elements[i].checked = true
}

document.getElementById("statusAll").onclick = function(){changeStatusCheckBox(0)};
for(let i = 1; i <= 7; i++) document.getElementById("statusAll").onclick = function(){changeStatusCheckBox(i)};

document.getElementById("select_distributor").onchange = changeDistributeSelect;
document.getElementById("btn_feature").onclick = showSearchList;