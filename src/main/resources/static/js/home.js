import {ajax, withGetMethod, withPostMethod} from './ajax.js'
import {loadDetail} from './delivery_details.js'
import {getMeta} from './meta.js'
import {calendarListener} from './calendar.js'
import {loadPoint} from "./point.js";
import {$, appendOptions, createRow} from "./element.js";
import {fillZero, HHMM, mmdd, numberWithCommas} from "./format.js";

function createTable(resultList, orders) {

    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];

        const createDate = new Date(order["createDate"]);
        const allocateDate = new Date(order["allocateDate"]);
        const pickupDate = new Date(order["pickupDate"]);
        const completeDate = new Date(order["completeDate"]);
        const cancelDate = new Date(order["cancelDate"]);

        const id = fillZero(order["id"].toString(), 5);
        const createDay = mmdd(createDate) + "-" + HHMM(createDate);
        const shopName = order["shopName"];

        let orderStatusId = null;

        if (order["orderStatusId"] === 1 && order["branchId"] !== parseInt(getCurrentBranchId())) {
            orderStatusId = 7;
        } else {
            orderStatusId = order["orderStatusId"];
        }

        const parsingOrderStatus = statusStr[orderStatusId - 1];

        const createTime = HHMM(createDate);
        const allocateTime = HHMM(allocateDate);
        const pickupTime = HHMM(pickupDate);
        const completeTime = HHMM(completeDate);
        const cancelTime = HHMM(cancelDate);
        const deliveryCost = numberWithCommas(order["deliveryCost"].toString());

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

        const row = createRow(
            text,
            (row) => {
                row.className = statusStyleName[orderStatusId - 1];

                row.onclick = () => {
                    if (selectedRow != null) {
                        // 스타일 복구
                        selectedRow.className = selectedRowClassName;
                    }

                    // 스타일 저장
                    selectedRow = row;
                    selectedRowClassName = statusStyleName[orderStatusId - 1];

                    // 선택 스타일 지정
                    row.className = 'selected-row';
                };

                row.ondblclick = () => {
                    loadDetail(id);
                };
            });

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

const getOptionValue = (element) => element.options[element.selectedIndex].value;

const getCurrentBranchId = () => {
    if (branchSelect === null) {
        return $("value_branch").value;
    }

    return getOptionValue(branchSelect);
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

function setSearchType() {
    const selectSearchType = $('search_type');

    for (let i = 0; i < selectSearchType.options.length; i++) {
        let searchTypeName = selectSearchType.options[i].value;
        let dstSearchType = $(searchTypeName);

        if (i === selectSearchType.selectedIndex) {
            dstSearchType.value = $("search_feature").value
        } else {
            dstSearchType.value = "";
        }
    }
}

const uncheckOthers = (checkboxes) => {
    for (let i = 1; i < checkboxes.length; i++) {
        checkboxes[i].checked = false;
    }
};

const isAllUnchecked = (checkboxes) => {
    let flag = true;

    for (let i = 1; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
            flag = false;
            break;
        }
    }

    return flag;
};

const appendCheckboxValue = (formData, checkboxes) => {

    for (let i = 1; i < checkboxes.length; i++) {
        if (checkboxes[i].checked === true) {
            formData.append(checkboxes[i].name, checkboxes[i].value)
        }
    }
};

function submitOrderStatus() {
    const formData = copyFormData(baseForm);

    appendCheckboxValue(formData, checkboxes);

    lastSubmittedFormData = formData;

    console.log(2);
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

const getRider = (branchId) => {
    const url = "/api/riders/list?id=" + branchId;

    ajax(
        url,
        "GET",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                $("text_rider").value = obj[0]["name"];
            }
        }
    );
};

const getShop = (branchId) => {
    const url = "/api/shops/list?id=" + branchId;

    ajax(
        url,
        "GET",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                $("text_shop").value = obj[0]["name"];
            }
        }
    );
};

const getBranchList = (element, distribId) => {
    const url = "/api/branches/list?id=" + distribId;

    ajax(
        url,
        "GET",
        (obj) => {
            const options = [{
                value: -1,
                text: "--"
            }];

            for (let i = 0; i < obj.length; i++) {
                const id = obj[i]["id"];
                const name = obj[i]["name"];

                options.push({
                    value: id,
                    text: name
                });
            }

            appendOptions(element, options);
        }
    );
};

const getBranch = (distribId) => {
    const url = "/api/branches/list?id=" + distribId;

    ajax(
        url,
        "GET",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                $("value_branch").value = obj[0]["id"];
                $("text_branch").value = obj[0]["name"];
            }
        }
    );
};

const getDistribList = (element, headId) => {
    const url = "/api/distribs?id=" + headId;

    ajax(
        url,
        "GET",
        (obj) => {
            const options = [{
                value: -1,
                text: "--"
            }];

            for (let i = 0; i < obj.length; i++) {
                const id = obj[i]["id"];
                const name = obj[i]["name"];

                options.push({
                    value: id,
                    text: name
                });
            }

            appendOptions(element, options);
        });
};

const getDistrib = (headId) => {
    const url = "/api/distribs?id=" + headId;

    ajax(
        url,
        "GET",
        (obj) => {

            if (obj.length !== 1) {

            } else {
                $("text_distrib").value = obj[0]["name"];
            }
        }
    );
};

const getBranchSettings = (branchId) => {
    const url = "/api/branches/" + branchId + "/settings";
    ajax(url, "GET", (obj) => {

        const selectDefaultStart = $("select_default_start");
        const selectDelayTime = $("select_delay_time");
        const costWon = $('cost_won');
        const costPercent = $('cost_percent');

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
    })
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
                console.log(func);
                console.log(error);
                displayError(error);
            }
        });
}

loadPoint();

const Group = {
    GUEST: 1,
    RIDER: 2,
    SHOP: 3,
    BRANCH: 5,
    DISTRIB: 6,
    HEAD: 7,
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

const resultList = $("result_list");
const branchSelect = $("select_branch");

const checkboxes = [];
for (let i = 0; i < checkboxIds.length; i++) {
    checkboxes[i] = $(checkboxIds[i]);
}

const statusText = [];
for (let i = 0; i < spanIds.length; i++) {
    statusText[i] = $(spanIds[i]);
}

let baseForm = null;
let lastSubmittedFormData = null;

let selectedRow = null;
let selectedRowClassName = null;

let pageIndex = 1;
let isEmpty = false;

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

checkboxes[0].onclick = function () {
    if (this.checked === true) {
        uncheckOthers(checkboxes);
    }

    if (baseForm !== null) {
        submitOrderStatus();
    }
};

for (let i = 1; i < checkboxes.length; i++) {
    checkboxes[i].onclick = () => {
        checkboxes[0].checked = isAllUnchecked(checkboxes);

        if (baseForm !== null) {
            submitOrderStatus();
        }
    };
}

$("form_search").onsubmit = function () {
    if (getCurrentBranchId() !== "-1") {
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

$("form_default_start").onsubmit
    = $("form_delay_time").onsubmit
    = $("form_additional_cost").onsubmit = function () {

    const branchId = parseInt(getCurrentBranchId());
    if (branchId !== -1) {
        const csrfToken = getMeta("_csrf");
        const csrfHeader = getMeta("_csrf_header");

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
    if ((window.innerHeight + window.scrollY) < $("window-parent").offsetHeight - 1 || lastSubmittedFormData === null || isEmpty === true) {
        return;
    }

    const formData = copyFormData(lastSubmittedFormData);
    formData.append("pageIndex", pageIndex);

    console.log(1);
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

document.body.onload = () => {
    const id = $("userId").value;
    const group = $("group").value;

    switch (parseInt(group)) {
        case Group.RIDER:
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
                const branchId = getOptionValue(this);

                if (this.selectedIndex !== 0) {
                    getBranchSettings(branchId);
                }
            };

            break;

        case Group.HEAD:

            const selectDistrib = $("select_distributor");
            getDistribList(selectDistrib, id);

            selectDistrib.onchange = function () {
                const distribId = getOptionValue(this);

                if (this.selectedIndex === 0) {
                    appendOptions(branchSelect, [{text: "--", value: "-1"}]);
                } else {
                    getBranchList(branchSelect, distribId)
                }
            };

            branchSelect.onchange = function () {
                const branchId = getOptionValue(this);

                if (this.selectedIndex !== 0) {
                    getBranchSettings(branchId);
                }
            };

            break;
    }

    calendarListener();
};