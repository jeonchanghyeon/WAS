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

String.prototype.toTimestampFormat = function () {
    if (this.toString() === "--") return "-1";
    const tmp = this.split(" / ");
    const newDate = tmp[0] + " " + tmp[1] + ":00";
    return newDate;
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

function convertToValidDate(date) {
    if (isNaN(Date.parse(date))) {
        return "-"
    }

    return (new Date(date)).HHMM()
}

function ajax(url, method, func, content = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);


    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

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
    let selectValue = distributorSelect.options[distributorSelect.selectedIndex].value;

    if (distributorSelect.selectedIndex !== 0) {
        const url = "status/distributors?distributorId=" + selectValue;
        ajax(url, "get", resultJsSelector)
    }
}

function changeBranchSelect() {
    let selectValue = branchSelect.options[branchSelect.selectedIndex].value;

    changeToSubmittedStyle(selectDefaultStart);
    changeToSubmittedStyle(selectDelayTime);
    changeToSubmittedStyle(costWon);
    changeToSubmittedStyle(costPercent);

    if (branchSelect.selectedIndex !== 0) {
        const url = "status/branch-settings/" + selectValue;
        ajax(url, "get", getBranchSetting)
    }
}

function getBranchSetting(obj) {
    try {
        const branchSetting = obj["branchSettings"];

        let basicStartTime = branchSetting["basicStartTime"];
        let delayTime = branchSetting["delayTime"];

        let basicStartTimeIndex = null;
        let delayTimeIndex = null;

        if (basicStartTime >= 0 && basicStartTime <= 60) {
            basicStartTimeIndex = basicStartTime / 10
        }
        if (delayTime >= 0 && delayTime <= 60) {
            delayTimeIndex = delayTime / 10;
        }

        costWon.value = branchSetting["extraCharge"];
        costPercent.value = branchSetting["extraChargePercent"] * 100;
        selectDefaultStart.selectedIndex = basicStartTimeIndex;
        selectDelayTime.selectedIndex = delayTimeIndex;
    } catch (error) {
        console.log(error.message)
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
    let branchValue = branchSelect.options[branchSelect.selectedIndex].value;
    const startDateText = startDateSelect.value;
    const endDateText = endDateSelect.value;

    if (branchSelect.selectedIndex === 0) {
        //branchText = "-1";
    }

    const paymentCheckedArray = [];
    const serviceCheckedArray = [];

    for (let i = 0; i < paymentType.length; i++) {
        paymentCheckedArray.push(i)
    }
    for (let i = 0; i < serviceType.length; i++) {
        serviceCheckedArray.push(i)
    }

    const searchType = document.getElementById("search_type");
    const selectFeature = document.getElementById("search_feature");

    const searchType_ = searchType.options[searchType.selectedIndex].value;
    const word = selectFeature.value;

    const url =
        "status/orders?" +
        "branch-id=" + branchValue +
        "&start-date=" + startDateText.toTimestampFormat() +
        "&end-date=" + endDateText.toTimestampFormat() +
        "&payment-type=" + paymentCheckedArray +
        "&is-shared=" + serviceCheckedArray;
    // "&" + searchType_ + "=" + word;

    ajax(url, "get", resultJsSearchList);
    return false;
}

let selectedRow = null;
let selectedRowClassName = null;

function resultJsSearchList(obj) {
    try {
        const orders = obj["orders"];
        const counts = obj["counts"];

        container.innerHTML = '';
        const size = orders.length;

        statusText[0].innerHTML = size;
        for (let i = 1; i < numText; i++) {
            if (i === shareCallIndex) {
                statusText[shareCallIndex].innerHTML = counts[numText + 1];
            } else {
                statusText[statusMapIndex[i]].innerHTML = counts[i - 1];
            }
        }

        if (size === 0) {
            throw new Error("데이터가 존재하지 않습니다.")
        }

        for (let i = 0; i < size; i++) {
            const order = orders[i];
            const row = document.createElement("tr");

            if (order.shared === "true") {
                order.orderStatusId = shareCallIndex;
                order.status = "공유콜";
            }

            if (!checkBox[statusMapIndex[order.orderStatusId]].checked) {
                continue;
            }

            let sumOfadditionalCost = 0;
            for (let i = 0; i < order.additionalCost.length; i++) {
                sumOfadditionalCost += order.additionalCost[i].cost;
            }

            let parsingStatus = ["대기", "배차", "상점거절", "상점확인전", "예약", "완료", "접수", "취소", "픽업"];
            let parsingPaymentType = ["카드", "현금", "선결제"];

            const text = [
                order.id.toString().fillZero(),
                (new Date(order.createDate)).mmdd() + "-" + (new Date(order.createDate)).HHMM(),
                order.shopName,
                parsingStatus[order.orderStatusId - 1],
                convertToValidDate(order.createDate),
                convertToValidDate(order.allocateDate),
                convertToValidDate(order.pickupDate),
                convertToValidDate(order.completeDate),
                convertToValidDate(order.cancelDate),
                order.deliveryCost.toString().numberWithCommas(),
                sumOfadditionalCost,
                order.riderName,
                parsingPaymentType[order.paymentType - 1],
                order.memo];

            for (let j = 0; j < text.length; j++) {
                const col = document.createElement("td");
                col.innerHTML = text[j];
                col.className = statusMap[order.orderStatusId - 1];
                row.appendChild(col);
            }

            row.onclick = function () {
                if (selectedRow != null) {
                    let cols = selectedRow.getElementsByTagName("td");
                    for (let i = 0; i < cols.length; i++) {
                        cols[i].className = selectedRowClassName;
                    }
                }

                let cols = this.getElementsByTagName("td");
                for (let i = 0; i < cols.length; i++) {
                    cols[i].className = 'selected_row';
                }

                selectedRow = row;
                selectedRowClassName = statusMap[order.orderStatusId - 1];
            };
            container.appendChild(row)
        }

    } catch (error) {
        console.log(error.message);

        const td = document.createElement("td");
        td.colSpan = 14;
        td.innerHTML = error.message;
        container.appendChild(td);
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
    let myCalendar;
    dhtmlXCalendarObject.prototype.langData["kr"] = {
        dateformat: '%Y-%m-%d / 09:00',
        monthesFNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthesSNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        daysFNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        daysSNames: ["일", "월", "화", "수", "목", "금", "토"],
        weekstart: 1,
        weekname: "w",
        today: "Heute",
        clear: "Reinigen"
    };
    myCalendar = new dhtmlXCalendarObject(["select_start_date", "select_end_date"]);
    myCalendar.hideTime();
    myCalendar.loadUserLanguage('kr');
}

function postOnSubmit(action, func) {
    return function () {
        try {
            let url = action + getCurrentBranchId();
            const formData = new FormData(this);

            let jsonObject = {};
            for (const [key, value]  of formData.entries()) {
                if (key === 'extraChargePercent') {
                    jsonObject[key] = value / 100.0;
                } else {
                    jsonObject[key] = value;
                }
            }

            ajax(url, "POST", func, JSON.stringify(jsonObject));

        } catch (error) {
            console.log(error.message);
        }

        return false;
    }
}

function getCurrentBranchId() {
    try {
        return branchSelect.options[branchSelect.selectedIndex].value;
    } catch (e) {
        console.log(e.message);
        return ""
    }
}

function changeToSubmittedStyle(element) {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = "#c1c1c1";
    }
    element.style.color = "#FFFFFF";
}

function changeToUnsubmittedStyle(element) {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = "white";
    }
    element.style.color = "red";
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

const formDefaultStart = document.getElementById("form_default_start");
const formDelayTime = document.getElementById("form_delay_time");
const formAdditionalCost = document.getElementById("form_additional_cost");

const selectDefaultStart = document.getElementById("select_default_start");
const selectDelayTime = document.getElementById("select_delay_time");
const costWon = document.getElementById('cost_won');
const costPercent = document.getElementById('cost_percent');

costPercent.onchange = costWon.onchange = selectDelayTime.onchange = selectDefaultStart.onchange = function () {
    changeToUnsubmittedStyle(this)
};

selectDelayTime.onchange = selectDefaultStart.onchange = function () {
    changeToUnsubmittedStyle(this)
};

const statusText = [];
const col = document.getElementById("status_area").getElementsByTagName("table")[0].rows[0].cells;
for (let i = 0; i < col.length; i++) {
    statusText[i] = col[i].getElementsByTagName("span")[0];
}

const numCheckBox = 8;
const numText = 8;
const shareCallIndex = 8;

for (let i = 0; i < numCheckBox; i++) {
    checkBox[i].onclick = changeStatusCheckBox(i, showSearchList)
}

distributorSelect.onchange = changeDistributeSelect;
branchSelect.onchange = changeBranchSelect;
document.forms[0].onsubmit = showSearchList;

formDefaultStart.onsubmit = postOnSubmit("status/branch-settings/", function () {
    changeToSubmittedStyle(selectDefaultStart);
});

formDelayTime.onsubmit = postOnSubmit("status/branch-settings/", function () {
    changeToSubmittedStyle(selectDelayTime);
});

formAdditionalCost.onsubmit = postOnSubmit("status/branch-settings/", function () {
    changeToSubmittedStyle(costWon);
    changeToSubmittedStyle(costPercent);
});