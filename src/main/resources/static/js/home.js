import {ajax, withGetMethod, withPostMethod} from './ajax.js'
import {loadDetail} from './delivery_details.js'
import {getMeta} from './meta.js'
import {calendarListener} from './calendar.js'

const Group = {
    GUEST: 1,
    RIDER: 2,
    SHOP: 3,
    BRANCH: 5,
    DISTRIB: 6,
    HEAD: 7,
};

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
            selectedRow.className = selectedRowClassName;
        }

        // 스타일 저장
        selectedRow = this;
        selectedRowClassName = statusStyleName[orderStatusId - 1];

        // 선택 스타일 지정
        this.className = 'selected-row';
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
        const createDay = createDate.mmdd() + "-" + createDate.HHMM();

        const shopName = order["shopName"];

        let orderStatusId = null;

        if (order["orderStatusId"] === 1 && order["branchId"] !== parseInt(getCurrentBranchId())) {
            orderStatusId = 7;
        } else {
            orderStatusId = order["orderStatusId"];
        }

        const parsingOrderStatus = statusStr[orderStatusId - 1];

        const createTime = createDate.HHMM();
        const allocateTime = allocateDate.HHMM();
        const pickupTime = pickupDate.HHMM();
        const completeTime = completeDate.HHMM();
        const cancelTime = cancelDate.HHMM();
        const deliveryCost = order["deliveryCost"].toString().numberWithCommas();
        let sumOfAdditionalCost = 0;
        const riderName = order["riderName"];
        const parsingPaymentType = paymentTypeStr[order["paymentType"] - 1];
        const memo = order["memo"];

        for (let i = 0; i < order["additionalCost"].length; i++) {
            sumOfAdditionalCost += order["additionalCost"][i]["cost"];
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
            sumOfAdditionalCost,
            riderName,
            parsingPaymentType,
            memo,
        ];

        const row = createRow(text, orderStatusId);

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
    if (branchSelect === null) {
        return branchValue.value;
    }
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

const statusStr = ["접수", "배차", "픽업", "완료", "취소", "대기", "공유"];
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

const distributorText = document.getElementById("text_distrib");
const branchText = document.getElementById("text_branch");
const shopText = document.getElementById("text_shop");
const riderText = document.getElementById("text_rider");
const branchValue = document.getElementById("value_branch");


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

function appendOptions(element, size, texts, values) {
    element.innerHTML = "";

    let option = document.createElement('option');
    option.defaultSelected;
    option.value = "-1";
    option.text = "--";
    element.appendChild(option);

    for (let i = 0; i < size; i++) {
        option = document.createElement('option');
        option.text = texts[i];
        option.value = values[i];
        element.appendChild(option);
    }
    console.log(element);
}

const getRider = (branchId) => {
    const url = "/api/riders/list?id=" + branchId;

    ajax(
        url,
        "get",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                riderText.value = obj[0]["name"];
            }
        }
    );
};

const getShop = (branchId) => {
    const url = "/api/shops/list?id=" + branchId;

    ajax(
        url,
        "get",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                shopText.value = obj[0]["name"];
            }
        }
    );
};

const getBranchList = (distribId) => {
    const url = "/api/branches/list?id=" + distribId;

    ajax(
        url,
        "get",
        (obj) => {
            const values = [];
            const texts = [];

            for (let i = 0; i < obj.length; i++) {
                values[i] = obj[i]["id"];
                texts[i] = obj[i]["name"];
            }

            appendOptions(branchSelect, obj.length, texts, values);
        }
    );
};

const getBranch = (distribId) => {
    const url = "/api/branches/list?id=" + distribId;

    ajax(
        url,
        "get",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                branchValue.value = obj[0]["id"];
                branchText.value = obj[0]["name"];
            }
        }
    );
};

const getDistribList = (headId) => {
    const url = "/api/distribs?id=" + headId;

    ajax(
        url,
        "get",
        (obj) => {
            const values = [];
            const texts = [];

            for (let i = 0; i < obj.length; i++) {
                values[i] = obj[i]["id"];
                texts[i] = obj[i]["name"];
            }

            appendOptions(distributorSelect, obj.length, texts, values);
        });
};

const getDistrib = (headId) => {
    const url = "/api/distribs?id=" + headId;

    ajax(
        url,
        "get",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                distributorText.value = obj[0]["name"];
            }
        }
    );
};

const getBranchSettings = (branchId) => {
    const url = "/api/branches/" + branchId + "/settings";
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
        const url = "/api/branches/" + branchId + "/settings";
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
    const url = "/api/orders";

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


document.body.onload = () => {
    const id = document.getElementById("userId").value;
    const group = document.getElementById("group").value;

    switch (parseInt(group)) {
        case Group.RIDER :
            getRider(id);
            getBranch(id);

            break;

        case Group.SHOP:
            getShop(id);
            getBranch(id);

            break;

        case Group.BRANCH:
            getDistrib(id);
            getBranch(id);

            break;

        case Group.DISTRIB:
            getDistrib(id);

            branchSelect.onchange = function () {
                const branchId = this.options[this.selectedIndex].value;

                if (this.selectedIndex !== 0) {
                    getBranchSettings(branchId);
                }
            };

            break;

        case Group.HEAD:

            getDistribList(id);

            distributorSelect.onchange = function () {
                const distribId = this.options[this.selectedIndex].value;

                if (this.selectedIndex === 0) {
                    appendOptions(branchSelect, 0)
                } else {
                    getBranchList(distribId)
                }
            };

            branchSelect.onchange = function () {
                const branchId = this.options[this.selectedIndex].value;

                if (this.selectedIndex !== 0) {
                    getBranchSettings(branchId);
                }
            };

            break;
    }

    calendarListener();
};