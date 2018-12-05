Date.prototype.mmdd = function () {
    let mm = (this.getMonth() + 1).toString();
    let dd = this.getDate().toString();
    return (mm[1] ? mm : '0' + mm[0]) + "-" + (dd[1] ? dd : '0' + dd[0]);
};

Date.prototype.HHMM = function () {
    let HH = this.getHours().toString();
    let MM = this.getMinutes().toString();
    return (HH[1] ? HH : '0' + HH[0]) + ":" + (MM[1] ? MM : '0' + MM[0]);
};

String.prototype.fillZero = function () {
    let zeroNum = 5 - this.length;
    if (zeroNum < 0) {
        return this;
    }
    return '00000'.substr(this.length, zeroNum) + this;
};

String.prototype.numberWithCommas = function () {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

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
    let selectText = distributorSelect.options[distributorSelect.selectedIndex].text;

    if (distributorSelect.selectedIndex !== 0) {
        const url = "status/distributors?distributorName=" + selectText;
        ajax(url, "get", resultJsSelector)
    }
}

function resultJsSelector(obj) {
    let option = document.createElement('option');

    branchSelect.innerHTML = "";
    option.defaultSelected;
    option.value = "";
    option.text = "--";
    branchSelect.appendChild(option);

    for (let i = 0; i < obj.length; i++) {
        option = document.createElement('option');
        option.value = obj[i];
        option.text = obj[i];
        branchSelect.appendChild(option);
    }
}

function showSearchList() {
    let branchText = branchSelect.options[branchSelect.selectedIndex].text;
    const startDateText = startDateSelect.options[startDateSelect.selectedIndex].text;
    const endDateText = endDateSelect.options[endDateSelect.selectedIndex].text;

    if (branchSelect.selectedIndex === 0) {
        branchText = "-1";
    }

    const paymentCheckedArray = [];
    const serviceCheckedArray = [];

    for (let i = 0; i < paymentType.length; i++) {
        paymentCheckedArray.push(paymentType[i].checked)
    }
    for (let i = 0; i < serviceType.length; i++) {
        serviceCheckedArray.push(serviceType[i].checked)
    }

    const url =
        "status/orders?" +
        "branch=" + branchText +
        "&start_date=" + startDateText +
        "&end_date=" + endDateText +
        "&payment_type=" + paymentCheckedArray +
        "&service_type=" + serviceCheckedArray;

    ajax(url, "get", resultJsSearchList);
    return false;
}

function resultJsSearchList(obj) {
    const orders = obj["resultObject"]["orders"];
    const counts = obj["resultObject"]["counts"];

    container.innerHTML = '';
    const size = orders.length;

    statusText[0].innerHTML = size;
    for (let i = 1; i < numText; i++) {
        if (i === shareCallIndex) {
            statusText[shareCallIndex].innerHTML = counts[numText + 1];
        }
        else {
            statusText[statusMapIndex[i]].innerHTML = counts[i - 1];
        }
    }

    if (size === 0) {
        if (branchSelect.selectedIndex !== 0) {
            const td = document.createElement("td");
            td.colSpan = 14;
            td.innerHTML = "데이터가 존재하지 않습니다.";
            container.appendChild(td);
        }
        return;
    }

    for (let i = 0; i < size; i++) {
        const order = orders[i];
        const row = document.createElement("tr");

        if (order.shared === "true") {
            order.statusId = shareCallIndex;
            order.status = "공유콜";
        }

        if (!checkBox[statusMapIndex[order.statusId]].checked) {
            continue;
        }

        const text = [
            order.id.toString().fillZero(),
            (new Date(order.createDate)).mmdd() + "-" + (new Date(order.createDate)).HHMM(),
            order.shop,
            order.status,
            (new Date(order.createDate)).HHMM(),
            (new Date(order.allocateDate)).HHMM(),
            (new Date(order.pickupDate)).HHMM(),
            (new Date(order.completeDate)).HHMM(),
            (new Date(order.cancelDate)).HHMM(),
            order.deliveryCost.toString().numberWithCommas(),
            "0",    //추가 대행료(계산필요)
            order.riderName,
            order.paymentType,
            order.requests];

        for (let j = 0; j < text.length; j++) {
            const col = document.createElement("td");
            col.innerHTML = text[j];
            col.className = statusMap[order.statusId - 1];
            row.appendChild(col);
        }
        container.appendChild(row)
    }
}

function changeStatusCheckBox(idx, func) {
    return function () {
        if (idx === 0) {
            for (let i = 1; i < numCheckBox; i++) {
                checkBox[i].checked = checkBox[0].checked
            }
        } else {
            let isAllChecked = true;
            for (let i = 1; i < numCheckBox; i++) {
                if (checkBox[i].checked === false) {
                    isAllChecked = false;
                    break;
                }
            }
            checkBox[0].checked = isAllChecked
        }
        func()
    }
}


function calOnLoad() {
    var myForm, formData, formData2;
    formData = [
        {type: "settings", position: "label-left", inputWidth: 145},
        {type: "calendar", name: "with_icon", dateFormat: "%Y-%m-%d", value: ""}
    ];
    formData2 = [
        {type: "settings", position: "label-left", labelWidth: 10, inputWidth: 145},
        {type: "calendar", label: "~", dateFormat: "%Y-%m-%d", value: ""}
    ];
    new dhtmlXForm("select_start_date", formData);
    new dhtmlXForm("select_end_date", formData2);
}

let statusMap = ["status1", "status2", "status3", "status4", "status6", "status5", "status7"];
let statusMapIndex = [0, 1, 2, 3, 4, 6, 5, 7];

const container = document.getElementById("result_list");
const distributorSelect = document.getElementById("select_distributor");
const branchSelect = document.getElementById("select_branch");
const startDateSelect = document.getElementById("select_start_date");
const endDateSelect = document.getElementById("select_end_date");
const paymentType = document.getElementsByName("payment_type");
const serviceType = document.getElementsByName("service_type");

const checkBox = document.getElementsByName("status");

const statusText = [];
const col = document.getElementById("status_area").getElementsByTagName("table")[0].rows[0].cells;
for(let i = 0; i < col.length; i++) {
    statusText[i] = col[i].getElementsByTagName("span")[0];
}

const numCheckBox = 8;
const numText = 8;
const shareCallIndex = 7;

for (let i = 0; i < numCheckBox; i++) {
    checkBox[i].onclick = changeStatusCheckBox(i, showSearchList)
}

distributorSelect.onchange = changeDistributeSelect;
document.forms[0].onsubmit = showSearchList;

