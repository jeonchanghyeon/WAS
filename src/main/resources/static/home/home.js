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

var statusMap = [0, 1, 2, 3, 4, 6, 5, 7];

function ajax(url, method, func, content = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            try {
                const obj = JSON.parse(this.responseText);
                console.log(obj);
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
    ajax("status/distributors?distributorName=" + selectText, "get", resultJsSelector)
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
    const branchSelect = document.getElementById("select_branch");
    const startDateSelect = document.getElementById("select_start_date");
    const endDateSelect = document.getElementById("select_end_date");
    const paymentType = document.getElementsByName("payment_type");
    const serviceType = document.getElementsByName("service_type");

    var branchText = branchSelect.options[branchSelect.selectedIndex].text;
    const startDateText = startDateSelect.options[startDateSelect.selectedIndex].text;
    const endDateText = endDateSelect.options[endDateSelect.selectedIndex].text;

    if(branchText === "--") branchText = "-1";

    const paymentCheckedArray = [];
    const serviceCheckedArray = [];
    for(let i = 0; i < paymentType.length; i++) paymentCheckedArray.push(paymentType[i].checked)
    for(let i = 0; i < serviceType.length; i++) serviceCheckedArray.push(serviceType[i].checked)

    const url = "status/orders?branch=" + branchText + "&start_date=" + startDateText + "&end_date=" + endDateText +
                    "&payment_type=" + paymentCheckedArray + "&service_type=" + serviceCheckedArray;

    ajax(url, "get", resultJsSearchList);
}

function resultJsSearchList(obj) {
    const container = document.getElementById("result_list");
    const orders = obj["resultObject"]["orders"];
    const counts = obj["resultObject"]["counts"];

    container.innerHTML = '';
    const size = orders.length;

    document.getElementById("statusTextAll").innerHTML = size;
    for(let i = 1; i < 7; i++) document.getElementById("statusText" + i).innerHTML = counts[i-1];
    document.getElementById("statusText7").innerHTML = counts[9];

    if(size === 0) {
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

    const checkBox = [];
    checkBox[0] = document.getElementById("statusAll");
    for(let i = 1; i <= 7; i++) checkBox[i] = document.getElementById("status" + i);

    for(let i = 0; i < size; i++) {
        const row = document.createElement("tr");

        if(orders[i].shared === "true") {
            orders[i].statusId = 7;
            orders[i].status = "공유콜";
        }

        if(!checkBox[orders[i].statusId].checked) continue;

        const text = [ orders[i].id.toString().fillZero(),
                        (new Date(orders[i].createDate)).mmdd() + "-" + (new Date(orders[i].createDate)).HHMM(),
                        orders[i].shop,
                        orders[i].status,
                        (new Date(orders[i].createDate)).HHMM(),
                        (new Date(orders[i].allocateDate)).HHMM(),
                        (new Date(orders[i].pickupDate)).HHMM(),
                        (new Date(orders[i].completeDate)).HHMM(),
                        (new Date(orders[i].cancelDate)).HHMM(),
                        orders[i].deliveryCost.toString().numberWithCommas(),
                        "0",    //추가 대행료(계산필요)
                        orders[i].riderName,
                        orders[i].paymentType,
                        orders[i].requests ];
        for(let j = 0; j < text.length; j++) {
            const col = document.createElement("td");
            col.innerHTML = text[j];
            col.className = "status" + statusMap[orders[i].statusId];
            row.appendChild(col);
        }
        container.appendChild(row)
    }
}

function changeStatusCheckBox(idx) {
    const checkBox = [];
    checkBox[0] = document.getElementById("statusAll");
    for(let i = 1; i <= 7; i++) checkBox[i] = document.getElementById("status" + i);

    if(idx === 0) {
        if(checkBox[0].checked === true) for(let i = 1; i <= 7; i++) checkBox[i].checked = true
        else for(let i = 1; i <= 7; i++) checkBox[i].checked = false
    } else {
        var isAllChecked = checkBox[1].checked;
        let i;
        for(i = 2; i <= 7; i++) {
            if(isAllChecked !== checkBox[i].checked) {
                checkBox[0].checked = false;
                break;
            }
        }
        if(i === 8) checkBox[0].checked = isAllChecked
    }

    showSearchList(checkBox);
}

function calOnLoad(name) {
    var myCalendar = new dhtmlXCalendarObject(name);
    console.log("show calendar");
    myCalendar.setDate(new Date(2013,2,1,16,0));
    myCalendar.show();
    myCalendar.showToday();
}

document.getElementById("statusAll").onclick = function(){changeStatusCheckBox(0)};
for(let i = 1; i <= 7; i++) document.getElementById("status" + i).onclick = function(){changeStatusCheckBox(i)};

document.getElementById("select_distributor").onchange = changeDistributeSelect;
document.getElementById("btn_feature").onclick = showSearchList;

document.getElementById("select_start_date").onclick = function(){calOnLoad("tmp")};
document.getElementById("select_end_date").onclick = function(){calOnLoad("end_calendar")};