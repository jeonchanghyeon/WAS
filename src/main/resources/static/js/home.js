import {ajax, getJSON, setCSRFHeader} from './ajax.js'
import {loadDetail} from './delivery_details.js'
import {calendarListener} from './calendar.js'
import {loadPoint} from "./point.js";
import {$, appendOptions, createRow, formSerialize, jsonifyFormData} from "./element.js";
import {fillZero, HHMM, mmdd, numberWithCommas} from "./format.js";

loadPoint();

function createTable(resultList, orders) {
    for (let i = 0; i < orders.length; i++) {
        const order = orders[i];

        const createDate = order["createDate"];
        const id = fillZero(order["id"].toString(), 5);
        const createDay = mmdd(createDate) + "-" + HHMM(createDate);

        let orderStatusId = order["orderStatusId"];
        if (order["orderStatusId"] === 1
            && (order["branchId"] !== getCurrentBranchId())) {
            orderStatusId = 7;
        }
        const parsingOrderStatus = statusStr[orderStatusId - 1];

        const sum = order["additionalCost"]
            .map((data) => data["cost"])
            .reduce((sum, number) => sum + number, 0);
        const parsingPaymentType = paymentTypeStr[order["paymentType"] - 1];

        const row = createRow(
            [
                id,
                createDay,
                order["shopName"],
                parsingOrderStatus,
                HHMM(createDate),
                HHMM(order["allocateDate"]),
                HHMM(order["pickupDate"]),
                HHMM(order["completeDate"]),
                HHMM(order["cancelDate"]),
                numberWithCommas(order["deliveryCost"]),
                numberWithCommas(sum),
                order["riderName"],
                parsingPaymentType,
                order["memo"]
            ],
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
                    loadDetail(id, $("group").value);
                };
            });

        resultList.appendChild(row)
    }
}

const displayError = (error) => {
    const tr = document.createElement("tr");
    const td = document.createElement("td");

    td.colSpan = 14;
    td.innerHTML = error.message;

    resultList.appendChild(tr);
    tr.appendChild(td);
};

const getOptionValue = (element) => {
    if (element.selectedIndex === -1) {
        return undefined;
    }

    return element.options[element.selectedIndex].value;
};

const getCurrentBranchId = () => {
    if (branchSelect === null) {
        return $("value_branch").value;
    }

    const branchId = getOptionValue(branchSelect);
    if (branchId === undefined) {
        return -1;
    }

    return parseInt(branchId);
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

const setSearchType = () => {
    $("search_feature").name = getOptionValue($('search_type'));
};

const uncheckOthers = (checkboxes) => {
    for (let checkbox of checkboxes) {
        checkbox.checked = false;
    }
};

const isAllUnchecked = (checkboxes) =>
    checkboxes.every(
        (data) =>
            data.checked === true
    );

const appendCheckboxValue = (formData, checkboxes) => {
    for (let checkbox of checkboxes) {
        if (checkbox.checked === true) {
            formData.append(checkbox.name, checkbox.value)
        }
    }
};

function submitOrderStatus() {
    const formData = copyFormData(baseForm);

    appendCheckboxValue(formData, checkboxes);

    lastSubmittedFormData = formData;

    pageIndex = 1;

    getOrders(formData).then(
        (obj) => {
            const orders = obj["orders"];

            resultList.innerHTML = '';

            isEmpty = orders.length === 0;
            if (isEmpty) {
                emptyHandler();
            }

            createTable(resultList, orders);
            pageIndex++;
        }
    ).catch((error) => {
        console.log(error);
        displayError(error);
    });
}

function emptyHandler() {
    throw new Error("데이터가 존재하지 않습니다.");
}

const getRider = (branchId) => {
    getJSON("/api/riders/list?id=" + branchId).then(
        (obj) => {
            if (obj.length !== 1) {

            } else {
                $("text_rider").value = obj[0]["name"];
            }
        });
};

const getShop = (branchId) => {
    getJSON("/api/shops/list?id=" + branchId).then(
        (obj) => {
            if (obj.length !== 1) {

            } else {
                $("text_shop").value = obj[0]["name"];
            }
        });
};

const getBranchList = (element, distribId) => {
    getJSON("/api/branches/list?id=" + distribId).then(
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

const getBranch = (distribId) => {
    getJSON("/api/branches/list?id=" + distribId).then(
        (obj) => {
            if (obj.length !== 1) {

            } else {
                $("value_branch").value = obj[0]["id"];
                $("text_branch").value = obj[0]["name"];
            }
        });
};

const getDistribList = (element, headId) => {
    getJSON("/api/distribs?id=" + headId).then(
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
    getJSON("/api/distribs?id=" + headId).then(
        (obj) => {
            if (obj.length !== 1) {

            } else {
                $("text_distrib").value = obj[0]["name"];
            }
        });
};

const getBranchSettings = (branchId) =>
    getJSON("/api/branches/" + branchId + "/settings").then(
        (obj) => {
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
        });

const getOrders = (formData) =>
    getJSON('/api/orders?' + formSerialize(formData));

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

const checkboxAll = $("checkbox_all");
const checkboxes = [];
for (let checkboxId of checkboxIds) {
    checkboxes.push($(checkboxId));
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

checkboxAll.onclick = function () {
    if (this.checked === true) {
        uncheckOthers(checkboxes);
    }

    if (baseForm !== null) {
        submitOrderStatus();
    }
};

for (let checkbox of checkboxes) {
    checkbox.onclick = () => {
        checkboxAll.checked = isAllUnchecked(checkboxes);

        if (baseForm !== null) {
            submitOrderStatus();
        }
    };
}

$("form_search").onsubmit = function () {
    if (getCurrentBranchId() === -1) {
        alert("지사를 선택해주세요.");
        return false;
    }
    setSearchType();

    const formData = new FormData(this);
    lastSubmittedFormData = baseForm = formData;

    pageIndex = 1;

    getOrders(formData).then(
        (obj) => {
            const orders = obj["orders"];
            const counts = obj["counts"];

            resultList.innerHTML = '';

            loadCounts(counts);

            isEmpty = orders.length === 0;
            if (isEmpty) {
                emptyHandler()
            }

            createTable(resultList, orders);
            pageIndex++;
        }
    ).catch((error) => {
        console.log(error);
        displayError(error);
    });

    return false;
};

const setBranchSetting = (branchId, formData) =>
    ajax(
        "/api/branches/" + branchId + "/settings",
        "POST",
        JSON.stringify(jsonifyFormData(formData)),
        setCSRFHeader
    );

$("form_default_start").onsubmit
    = $("form_delay_time").onsubmit = function () {
    const branchId = getCurrentBranchId();
    if (branchId !== -1) {
        const formData = new FormData(this);

        setBranchSetting(branchId, formData);
    }

    return false;
};

$("form_additional_cost").onsubmit = function () {
    const branchId = getCurrentBranchId();
    if (branchId !== -1) {
        const formData = new FormData(this);

        const extraChargePercent = formData.get("extraChargePercent");
        formData.set("extraChargePercent", extraChargePercent / 100.0);

        setBranchSetting(branchId, formData);
    }

    return false;
};

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) < $("window-parent").offsetHeight - 1
        || lastSubmittedFormData === null || isEmpty === true) {
        return;
    }

    const formData = copyFormData(lastSubmittedFormData);
    formData.append("pageIndex", pageIndex);

    getOrders(formData).then(
        (obj) => {
            const orders = obj["orders"];

            isEmpty = orders.length === 0;

            createTable(resultList, orders);
            pageIndex++;
        }
    ).catch((error) => {
        console.log(error);
        displayError(error);
    });
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