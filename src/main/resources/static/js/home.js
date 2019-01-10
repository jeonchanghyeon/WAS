import {ajax, withGetMethod, withPostMethod} from './ajax.js'
import {loadDetail} from './delivery_details.js'
import {getMeta} from './meta.js'

Date.prototype.mmdd = function () {
    const mm = (this.getMonth() + 1).toString();
    const dd = this.getDate().toString();
    return (mm[1] ? mm : '0' + mm[0]) + "-" + (dd[1] ? dd : '0' + dd[0]);
};

Date.prototype.HHMM = function () {
    if (isNaN(this)) {
        return "-"
    }

    const HH = this.getHours().toString();
    const MM = this.getMinutes().toString();
    return (HH[1] ? HH : '0' + HH[0]) + ":" + (MM[1] ? MM : '0' + MM[0]);
};

String.prototype.fillZero = function () {
    const zeroNum = 5 - this.length;
    if (zeroNum < 0) {
        return this;
    }
    return '00000'.substr(this.length, zeroNum) + this;
};

String.prototype.numberWithCommas = function () {
    return this.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function copyFormData(src) {
    const dst = new FormData();

    for (const pair of src.entries()) {
        dst.append(pair[0], pair[1]);
    }

    return dst;
}

const loadCounts = (counts) => {

    const arr = [
        "acceptCount",
        "allocateCount",
        "pickupCount",
        "completeCount",
        "cancelCount",
        "suspendCount",
        "shareCallCount"
    ];

    let sum = 0;
    for (let i = 1; i < statusText.length; i++) {
        const count = counts[arr[i - 1]];
        if (i !== 6) {
            statusText[i].innerHTML = count;
            sum += parseInt(count);
        }
    }

    statusText[0].innerHTML = sum;
};

const createRow = (text, orderStatusId) => {
    const row = document.createElement("tr");

    row.className = statusStyleName[orderStatusId - 1];

    for (let i = 0; i < text.length; i++) {
        const col = document.createElement("td");
        col.innerHTML = text[i];
        row.appendChild(col);
    }

    row.onclick = function () {
        if (selectedRow != null) {
            // 스타일 복구
            selectedRow = selectedRowClassName;
        }

        // 선택 스타일 지정
        selectedRow = 'selected_row';

        // 스타일 저장
        selectedRow = row;
        selectedRowClassName = statusStyleName[orderStatusId - 1];
    };

    row.ondblclick = function () {
        loadDetail(text[0]);
    };

    return row;
};

function createTable(resultList, orders) {

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];

        const createDate = new Date(order["createDate"]);
        const allocateDate = new Date(order["allocateDate"]);
        const pickupDate = new Date(order["pickupDate"]);
        const completeDate = new Date(order["completeDate"]);
        const cancelDate = new Date(order["cancelDate"]);

        const id = order["id"].toString().fillZero();
        const createDay = createDate.mmdd() + "-" + createDate.mmdd();
        const shopName = order["shopName"];

        let parsingOrderStatus = null;

        if (order["orderStatusId"] === 1 && order["branchId"] !== parseInt(getCurrentBranchId())) {
            parsingOrderStatus = "공유";
        } else {
            parsingOrderStatus = statusStr[order["orderStatusId"] - 1];
        }

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

        resultList.appendChild(row)
    }
}

function displayError(error) {

    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.colSpan = 14;
    td.innerHTML = error.message;

    resultList.appendChild(tr);
    tr.appendChild(td);
}

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

const container = document.getElementById("window-parent");
const resultList = document.getElementById("result_list");
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
const csrfToken = getMeta("_csrf");
const csrfHeader = getMeta("_csrf_header");

let baseForm = null;
let lastSubmittedFormData = null;
let selectedRow = null;
let selectedRowClassName = null;
let pageIndex = 1;
let isEmpty = false;

function setSearchType() {
    const selectSearchType = document.getElementById('search_type');

    for (let i = 0; i < selectSearchType.options.length; i++) {
        let searchTypeName = selectSearchType.options[i].value;
        let dstSearchType = document.getElementById(searchTypeName);

        if (i === selectSearchType.selectedIndex) {
            dstSearchType.value = document.getElementById("search_feature").value
        } else {
            dstSearchType.value = "";
        }
    }
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

function submitOrderStatus() {
    if (baseForm === null) {
        return;
    }

    const formData = copyFormData(baseForm);

    for (let i = 1; i < checkbox.length; i++) {
        if (checkbox[i].checked === true) {
            formData.append(checkbox[i].name, checkbox[i].value)
        }
    }

    lastSubmittedFormData = formData;

    getOrders(
        formData,
        (obj) => {
            const orders = obj["orders"];

            resultList.innerHTML = '';

            if (orders.length === 0) {
                isEmpty = true;
                emptyHandler();
            } else {
                isEmpty = false;
            }

            createTable(resultList, orders);

            pageIndex = 2;
        }
    );
}

function emptyHandler() {
    throw new Error("데이터가 존재하지 않습니다.");
}

checkbox[0].onclick = function () {
    if (this.checked === true) {
        uncheckOthers();
    }
    submitOrderStatus();
};

for (let i = 1; i < checkbox.length; i++) {
    checkbox[i].onclick = () => {
        checkbox[0].checked = isAllUnchecked();
        submitOrderStatus();
    };
}

distributorSelect.onchange = () => {
    const selectValue = distributorSelect.options[distributorSelect.selectedIndex].value;

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
    const selectValue = branchSelect.options[branchSelect.selectedIndex].value;

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

formSearch.onsubmit = function () {
    if (parseInt(getCurrentBranchId()) !== -1) {
        setSearchType();

        const formData = new FormData(this);
        lastSubmittedFormData = baseForm = formData;

        getOrders(
            formData,
            (obj) => {
                const orders = obj["orders"];
                const counts = obj["counts"];

                resultList.innerHTML = '';

                loadCounts(counts);

                if (orders.length === 0) {
                    isEmpty = true;
                    emptyHandler()
                } else {
                    isEmpty = false;
                }

                createTable(resultList, orders);

                pageIndex = 2;
            }
        );
    }

    return false;
};

formDefaultStart.onsubmit
    = formDelayTime.onsubmit
    = formAdditionalCost.onsubmit = function () {

    const branchId = parseInt(getCurrentBranchId());
    if (branchId !== -1) {
        const url = "status/branch-settings/" + branchId;
        const formData = new FormData(this);
        withPostMethod(
            url,
            formData,
            () => {

            },
            csrfHeader,
            csrfToken
        );
    }

    return false;
};

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) < container.offsetHeight - 1 || lastSubmittedFormData === null || isEmpty === true) {
        return;
    }

    const formData = copyFormData(lastSubmittedFormData);
    formData.append("pageIndex", pageIndex);

    getOrders(
        formData,
        (obj) => {
            const orders = obj["orders"];

            isEmpty = orders.length === 0;

            createTable(resultList, orders);
            pageIndex++;
        }
    );
};

function getOrders(formData, func) {
    const url = "status/orders";

    withGetMethod(
        url,
        formData,
        (obj) => {
            try {
                func(obj);
            } catch (error) {
                console.log(error.message);
                displayError(error);
            }
        });
}