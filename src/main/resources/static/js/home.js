import {ajax, withGetMethod, withPostMethod} from './ajax.js'

Date.prototype.mmdd = function () {
    let mm = (this.getMonth() + 1).toString();
    let dd = this.getDate().toString();
    return (mm[1] ? mm : '0' + mm[0]) + "-" + (dd[1] ? dd : '0' + dd[0]);
};

Date.prototype.HHMM = function () {
    if (isNaN(this)) {
        return "-"
    }

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

let selectedRow = null;
let selectedRowClassName = null;

const loadCounts = (counts) => {
    // const arr = [
    //     "acceptCount",
    //     "allocateCount",
    //     "pickupCount",
    //     "completeCount",
    //     "cancelCount",
    //      "suspendCount",
    //     "shareCallCount"
    // ];

    statusText[1].innerHTML = counts["acceptCount"];
    statusText[2].innerHTML = counts["allocateCount"];
    statusText[3].innerHTML = counts["pickupCount"];
    statusText[4].innerHTML = counts["completeCount"];
    statusText[5].innerHTML = counts["cancelCount"];
    statusText[6].innerHTML = counts["suspendCount"];
    statusText[7].innerHTML = counts["shareCallCount"];
};

const createRow = (text, orderStatusId) => {
    const row = document.createElement("tr");

    for (let j = 0; j < text.length; j++) {
        const col = document.createElement("td");
        col.innerHTML = text[j];
        col.className = statusStyleName[orderStatusId - 1];
        row.appendChild(col);
    }

    row.onclick = function () {
        if (selectedRow != null) {
            // 스타일 복구
            let cols = selectedRow.getElementsByTagName("td");
            for (let i = 0; i < cols.length; i++) {
                cols[i].className = selectedRowClassName;
            }
        }

        // 선택 스타일 지정
        let cols = this.getElementsByTagName("td");
        for (let i = 0; i < cols.length; i++) {
            cols[i].className = 'selected_row';
        }

        // 스타일 저장
        selectedRow = row;
        selectedRowClassName = statusStyleName[orderStatusId - 1];
    };

    return row;
};

const resultJsSearchList = (obj) => {
    try {
        const orders = obj["orders"];
        const counts = obj["counts"];

        console.log(orders);
        container.innerHTML = '';
        const size = orders.length;

        statusText[0].innerHTML = size;
        loadCounts(counts);

        if (size === 0) {
            throw new Error("데이터가 존재하지 않습니다.")
        }

        for (let i = 0; i < size; i++) {
            const order = orders[i];

            const createDate = new Date(order["createDate"]);
            const allocateDate = new Date(order["allocateDate"]);
            const pickupDate = new Date(order["pickupDate"]);
            const completeDate = new Date(order["completeDate"]);
            const cancelDate = new Date(order["cancelDate"]);

            const id = order["id"].toString().fillZero();
            const createDay = createDate.mmdd() + "-" + createDate.mmdd();
            const shopName = order["shopName"];
            const parsingOrderStatus = statusStr[order["orderStatusId"] - 1];
            const createTime = createDate.HHMM();
            const allocateTime = allocateDate.HHMM();
            const pickupTime = pickupDate.HHMM();
            const completeTime = completeDate.HHMM();
            const cancelTime = cancelDate.HHMM();
            const deliveryCost = order["deliveryCost"].toString().numberWithCommas();
            let sumOfadditionalCost = 0;
            const riderName = order["riderName"];
            const parsingPaymentType = paymentTypeStr[order["paymentType"] - 1];
            const memo = order["memo"];

            for (let i = 0; i < order["additionalCost"].length; i++) {
                sumOfadditionalCost += order["additionalCost"][i]["cost"];
            }

            const text = [
                id,
                createDay,
                shopName,
                parsingOrderStatus,
                createTime,
                allocateTime,
                pickupTime,
                completeTime,
                cancelTime,
                deliveryCost,
                sumOfadditionalCost,
                riderName,
                parsingPaymentType,
                memo,
            ];

            const row = createRow(text, order["orderStatusId"]);

            container.appendChild(row)
        }

    } catch (error) {
        console.log(error.message);

        const td = document.createElement("td");
        td.colSpan = 14;
        td.innerHTML = error.message;
        container.appendChild(td);
    }
};

const getCurrentBranchId = () => {
    return branchSelect.options[branchSelect.selectedIndex].value;
};

const changeToStyleSafe = (element) => {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = "#c1c1c1";
    }
    element.style.color = "#FFFFFF";
};

const changeToStyleWarning = (element) => {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = "white";
    }
    element.style.color = "red";
};

const statusStr = ["접수", "배차", "픽업", "완료", "취소", "대기", "상점확인전", "상점거절", "예약"];
const paymentTypeStr = ["카드", "현금", "선결제"];
const statusStyleName = ["status1", "status2", "status3", "status4", "status5", "status6", "status7"];

const checkboxIds = [
    "checkbox_all",
    "checkbox_accept",
    "checkbox_allocate",
    "checkbox_pickup",
    "checkbox_complete",
    "checkbox_cancel",
    "checkbox_suspend",
    "checkbox_share"
];

const spanIds = [
    "count_all",
    "count_accept",
    "count_allocate",
    "count_pickup",
    "count_complete",
    "count_cancel",
    "count_suspend",
    "count_share"
];

const container = document.getElementById("result_list");
const distributorSelect = document.getElementById("select_distributor");
const branchSelect = document.getElementById("select_branch");

const checkbox = [];
for (let i = 0; i < checkboxIds.length; i++) {
    checkbox[i] = document.getElementById(checkboxIds[i]);
}

const statusText = [];
for (let i = 0; i < spanIds.length; i++) {
    statusText[i] = document.getElementById(spanIds[i]);
}

const formDefaultStart = document.getElementById("form_default_start");
const formDelayTime = document.getElementById("form_delay_time");
const formAdditionalCost = document.getElementById("form_additional_cost");
const formSearch = document.getElementById("form_search");

const selectDefaultStart = document.getElementById("select_default_start");
const selectDelayTime = document.getElementById("select_delay_time");
const costWon = document.getElementById('cost_won');
const costPercent = document.getElementById('cost_percent');

function showSearchList() {
    const selectSearchType = document.getElementById('search_type');

    for (let i = 0; i < selectSearchType.options.length; i++) {
        const searchTypeName = selectSearchType.options[i].value;
        let dstSearchType = document.getElementById(searchTypeName).value;

        if (i === selectSearchType.selectedIndex) {
            dstSearchType = document.getElementById("search_feature").value
        } else {
            dstSearchType = null;
        }
    }

    const url = "status/orders";
    withGetMethod(url, resultJsSearchList, formSearch);

    return false;
}

const uncheckOthers = () => {
    for (let i = 1; i < checkbox.length; i++) {
        checkbox[i].checked = false;
    }
};

const isAllUnchecked = () => {
    let reval = true;

    for (let i = 1; i < checkbox.length; i++) {
        if (checkbox[i].checked === true) {
            reval = false;
            break;
        }
    }

    return reval;
};

checkbox[0].onclick = function () {
    if (this.checked === true) {
        uncheckOthers();
    }
    showSearchList();
};

for (let i = 1; i < checkbox.length; i++) {
    checkbox[i].onclick = () => {
        checkbox[0].checked = isAllUnchecked();
        showSearchList();
    };
}

distributorSelect.onchange = () => {
    let selectValue = distributorSelect.options[distributorSelect.selectedIndex].value;

    if (distributorSelect.selectedIndex !== 0) {
        const url = "status/distributors?distributorId=" + selectValue;
        ajax(url, "get",
            (obj) => {
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
            });
    }
};

branchSelect.onchange = () => {
    let selectValue = branchSelect.options[branchSelect.selectedIndex].value;

    if (branchSelect.selectedIndex !== 0) {
        const url = "status/branch-settings/" + selectValue;
        ajax(url, "get", (obj) => {
            try {
                const branchSetting = obj["branchSettings"];

                const basicStartTime = branchSetting["basicStartTime"];
                const basicStartTimeIndex = basicStartTime / 10;
                selectDefaultStart.selectedIndex = basicStartTimeIndex;

                if (basicStartTimeIndex === 0) {
                    changeToStyleSafe(selectDefaultStart);
                } else {
                    changeToStyleWarning(selectDefaultStart);
                }

                const delayTime = branchSetting["delayTime"];
                const delayTimeIndex = delayTime / 10;
                selectDelayTime.selectedIndex = delayTimeIndex;

                if (delayTimeIndex === 0) {
                    changeToStyleSafe(selectDelayTime);
                } else {
                    changeToStyleWarning(selectDelayTime);
                }

                costWon.value = branchSetting["extraCharge"];
                costPercent.value = branchSetting["extraChargePercent"] * 100;

            } catch (error) {
                console.log(error.message)
            }
        })
    }
};

formSearch.onsubmit = showSearchList;

formDefaultStart.onsubmit = () => {
    const url = "status/branch-settings/" + getCurrentBranchId();
    withPostMethod(url);

    return false;
};

formDelayTime.onsubmit = () => {
    const url = "status/branch-settings/" + getCurrentBranchId();
    withPostMethod(url);

    return false;
};

formAdditionalCost.onsubmit = () => {
    const url = "status/branch-settings/" + getCurrentBranchId();
    withPostMethod(url);

    return false;
};