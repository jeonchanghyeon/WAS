import {ajax, withGetMethod, withPostMethod} from './ajax.js'

let selectedRow = null;
let selectedRowClassName = null;

const loadCounts = (counts) => {
    statusText[0].innerHTML = size;

    for (let i = 1; i < counts.length; i++) {
        statusText[i].innerHTML = counts[i];
    }
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
        selectedRowClassName = statusStyleName[orderStatusId - 1];
    };

    return row;
};

const resultJsSearchList = (obj) => {
    try {
        const orders = obj["orders"];
        const counts = obj["counts"];

        container.innerHTML = '';
        const size = orders.length;

        loadCounts(counts);

        if (size === 0) {
            throw new Error("데이터가 존재하지 않습니다.")
        }

        for (let i = 0; i < size; i++) {
            const order = orders[i];

            let sumOfadditionalCost = 0;
            for (let i = 0; i < order["additionalCost"].length; i++) {
                sumOfadditionalCost += order["additionalCost"][i]["cost"];
            }

            const text = [
                order["id"].toString().fillZero(),
                order["createDate"].mmdd() + "-" + order["createDate"].mmdd(),
                order["shopName"],
                parsingStatus[order["orderStatusId"] - 1],
                order["createDate"].HHMM(),
                order["allocateDate"].HHMM(),
                order["pickupDate"].HHMM(),
                order["completeDate"].HHMM(),
                order["cancelDate"].HHMM(),
                order["deliveryCost"].toString().numberWithCommas(),
                sumOfadditionalCost,
                order["riderName"],
                parsingPaymentType[order["paymentType"] - 1],
                order["memo"]
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

const changeToSubmittedStyle = (element) => {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = "#c1c1c1";
    }
    element.style.color = "#FFFFFF";
};

const changeToUnsubmittedStyle = (element) => {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = "white";
    }
    element.style.color = "red";
};

const parsingStatus = ["접수", "배차", "픽업", "완료", "취소", "대기", "상점확인전", "상점거절", "예약"];
const parsingPaymentType = ["카드", "현금", "선결제"];
const statusStyleName = ["status1", "status2", "status3", "status4", "status6", "status5", "status7"];
const checkboxIds = [
    "checkbox_all",
    "checkbox_received",
    "checkbox_allocated",
    "checkbox_pickup",
    "checkbox_completed",
    "checkbox_waiting",
    "checkbox_canceled",
    "checkbox_shared"
];
const spanIds = [
    "count_all",
    "count_recived",
    "count_allocated",
    "count_pickup",
    "count_completed",
    "count_waiting",
    "count_canceled",
    "count_shared",
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

const selectDefaultStart = document.getElementById("select_default_start");
const selectDelayTime = document.getElementById("select_delay_time");
const costWon = document.getElementById('cost_won');
const costPercent = document.getElementById('cost_percent');

function showSearchList() {
    const url = "status/orders";
    withGetMethod(url, resultJsSearchList, this);

    return false;
};

const uncheckOthers = () => {
    for (let i = 1; i < checkbox.length; i++) {
        checkbox[i].checked = !checkbox[0].checked
    }
};

checkbox[0].onclick = () => {
    uncheckOthers();
    showSearchList();
};

for (let i = 1; i < checkbox.length; i++) {
    checkbox[i].onclick = showSearchList;
}

costPercent.onchange
    = costWon.onchange
    = selectDelayTime.onchange
    = selectDefaultStart.onchange
    = function () {
    changeToUnsubmittedStyle(this)
};

selectDelayTime.onchange
    = selectDefaultStart.onchange
    = function () {
    changeToUnsubmittedStyle(this)
};

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

    changeToSubmittedStyle(selectDefaultStart);
    changeToSubmittedStyle(selectDelayTime);
    changeToSubmittedStyle(costWon);
    changeToSubmittedStyle(costPercent);

    if (branchSelect.selectedIndex !== 0) {
        const url = "status/branch-settings/" + selectValue;
        ajax(url, "get", (obj) => {
            try {
                const branchSetting = obj["branchSettings"];

                let basicStartTime = branchSetting["basicStartTime"];
                let delayTime = branchSetting["delayTime"];

                let basicStartTimeIndex = basicStartTime / 10;
                let delayTimeIndex = delayTime / 10;

                costWon.value = branchSetting["extraCharge"];
                costPercent.value = branchSetting["extraChargePercent"] * 100;

                selectDefaultStart.selectedIndex = basicStartTimeIndex;
                selectDelayTime.selectedIndex = delayTimeIndex;
            } catch (error) {
                console.log(error.message)
            }
        })
    }
};

document.forms[0].onsubmit = showSearchList;

formDefaultStart.onsubmit = () => {
    const url = "status/branch-settings/" + getCurrentBranchId();
    withPostMethod(url, () => {
        changeToSubmittedStyle(selectDefaultStart);
    });

    return false;
};

formDelayTime.onsubmit = () => {
    const url = "status/branch-settings/" + getCurrentBranchId();
    withPostMethod(url, () => {
        changeToSubmittedStyle(selectDelayTime);
    });

    return false;
};

formAdditionalCost.onsubmit = () => {
    const url = "status/branch-settings/" + getCurrentBranchId();
    withPostMethod(url, () => {
        changeToSubmittedStyle(costWon);
        changeToSubmittedStyle(costPercent);
    });

    return false;
};