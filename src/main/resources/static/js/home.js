import {ajax, getJSON, setCSRFHeader} from './ajax.js';
import {loadDetail} from './delivery_details.js';
import {calendarListener} from './calendar.js';
import {loadPoint} from './point.js';
import {$, appendOptions, createRow, formSerialize, jsonifyFormData} from './element.js';
import {fillZero, HHMM, mmdd, numberWithCommas} from './format.js';

loadPoint();

let baseForm = null;
let lastSubmittedFormData = null;

let selectedRow = null;
let selectedRowClassName = null;

let pageIndex = 1;
let isEmpty = false;

const Group = {
    GUEST: 1,
    RIDER: 2,
    SHOP: 3,
    BRANCH: 5,
    DISTRIB: 6,
    HEAD: 7,
};

const statusStr = ['접수', '배차', '픽업', '완료', '취소', '대기', '공유'];
const paymentTypeStr = ['카드', '현금', '선결제'];
const statusStyleName = ['status1', 'status2', 'status3', 'status4', 'status5', 'status6', 'status7'];

const checkboxIds = [
    'checkbox_accept',
    'checkbox_allocate',
    'checkbox_pickup',
    'checkbox_complete',
    'checkbox_cancel',
    'checkbox_suspend',
    'checkbox_share',
];

const spanIds = [
    'count_all',
    'count_accept',
    'count_allocate',
    'count_pickup',
    'count_complete',
    'count_cancel',
    'count_suspend',
    'count_share',
];

const resultList = $('result_list');
const branchSelect = $('select_branch');
const selectDistrib = $('select_distributor');

const checkboxAll = $('checkbox_all');
const statusCheckboxes = checkboxIds.map(checkboxId => $(checkboxId));

const statusText = spanIds.map(spanId => $(spanId));

const getOptionValue = (element) => {
    if (element.selectedIndex === -1) {
        return undefined;
    }

    return element.options[element.selectedIndex].value;
};

const getCurrentBranchId = () => {
    if (branchSelect === null) {
        return $('value_branch').value;
    }

    const branchId = getOptionValue(branchSelect);
    if (branchId === undefined) {
        return -1;
    }

    return parseInt(branchId, 10);
};

const createTable = (list, orders) => {
    const rowOnclick = (row, orderStatusId) => () => {
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

    orders.forEach((order) => {
        const {
            id,
            branchId, shopName, riderName,
            deliveryCost, additionalCost, paymentType,
            createDate, allocateDate, pickupDate, completeDate, cancelDate,
            memo,
        } = order;
        let {orderStatusId} = order;

        const createDay = `${mmdd(createDate)}-${HHMM(createDate)}`;
        const parsingOrderStatus = statusStr[orderStatusId - 1];
        const parsingPaymentType = paymentTypeStr[paymentType - 1];

        if (orderStatusId === 1 && (branchId !== getCurrentBranchId())) {
            orderStatusId = 7;
        }

        const sumOfAdditionalCost = additionalCost
            .map(data => data['cost'])
            .reduce((sum, number) => sum + number, 0);

        const row = createRow([
            fillZero(id.toString(), 5),
            createDay,
            shopName,
            parsingOrderStatus,
            HHMM(createDate),
            HHMM(allocateDate),
            HHMM(pickupDate),
            HHMM(completeDate),
            HHMM(cancelDate),
            numberWithCommas(deliveryCost),
            numberWithCommas(sumOfAdditionalCost),
            riderName,
            parsingPaymentType,
            memo,
        ]);

        row.className = statusStyleName[orderStatusId - 1];
        row.onclick = rowOnclick(row, orderStatusId);
        row.ondblclick = () => {
            loadDetail(id, $('group').value);
        };

        list.appendChild(row);
    });
};

const displayError = (error) => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');

    td.colSpan = 14;
    td.innerHTML = error.message;

    resultList.appendChild(tr);
    tr.appendChild(td);
};

const changeToStyleSafe = (element) => {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = '#c1c1c1';
    }
    element.style.color = '#FFFFFF';
};

const changeToStyleWarning = (element) => {
    for (let i = 0; i < element.labels.length; i++) {
        element.labels[i].style.color = 'white';
    }
    element.style.color = 'red';
};

const setSearchType = () => {
    $('search_feature').name = getOptionValue($('search_type'));
};

const uncheckOthers = (checkboxes) => {
    checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
    });
};

const isSomeChecked = checkboxes => checkboxes
    .some(data => data.checked === true);

const appendCheckboxValue = (formData, checkboxes) => {
    checkboxes.filter(checkbox => checkbox.checked === true)
        .forEach((checkbox) => {
            formData.append(checkbox.name, checkbox.value);
        });
};

function copyFormData(src) {
    const dst = new FormData();
    const entry = src.entries();

    /* eslint-disable */
    for (const [k, v] of entry) {
        dst.append(k, v);
    }
    /* eslint-enable */

    return dst;
}

const getOrders = formData => getJSON(`/api/orders?${formSerialize(formData)}`);

function emptyHandler() {
    throw new Error('데이터가 존재하지 않습니다.');
}

function submitOrderStatus() {
    const formData = copyFormData(baseForm);

    appendCheckboxValue(formData, statusCheckboxes);
    lastSubmittedFormData = formData;
    pageIndex = 1;

    getOrders(formData).then((obj) => {
        const {orders} = obj;

        resultList.innerHTML = '';

        isEmpty = orders.length === 0;
        if (isEmpty) {
            emptyHandler();
        }

        createTable(resultList, orders);
        pageIndex += 1;
    })
        .catch((error) => {
            displayError(error);
        });
}


const getRider = (branchId) => {
    getJSON(`/api/riders/list?id=${branchId}`).then((obj) => {
        if (obj.length === 1) {
            $('text_rider').value = obj[0]['name'];
        }
    });
};

const getShop = (branchId) => {
    getJSON(`/api/shops/list?id=${branchId}`).then((obj) => {
        if (obj.length === 1) {
            $('text_shop').value = obj[0]['name'];
        }
    });
};

const getBranchList = (element, distribId) => {
    getJSON(`/api/branches/list?id=${distribId}`).then((obj) => {
        const options = [{
            value: -1,
            text: '--',
        }];

        obj.forEach((o) => {
            const {id, name} = o;

            options.push({
                value: id,
                text: name,
            });
        });

        appendOptions(element, options);
    });
};

const getBranch = (distribId) => {
    getJSON(`/api/branches/list?id=${distribId}`).then((obj) => {
        if (obj.length === 1) {
            $('value_branch').value = obj[0]['id'];
            $('text_branch').value = obj[0]['name'];
        }
    });
};

const getDistribList = (element, headId) => {
    getJSON(`/api/distribs?id=${headId}`).then((obj) => {
        const options = [{
            value: -1,
            text: '--',
        }];

        obj.forEach((o) => {
            const {id, name} = o;

            options.push({
                value: id,
                text: name,
            });
        });

        appendOptions(element, options);
    });
};

const getDistrib = (headId) => {
    getJSON(`/api/distribs?id=${headId}`).then((obj) => {
        if (obj.length === 1) {
            $('text_distrib').value = obj[0]['name'];
        }
    });
};

const getBranchSettings = branchId => getJSON(`/api/branches/${branchId}/settings`).then((obj) => {
    const selectDefaultStart = $('select_default_start');
    const selectDelayTime = $('select_delay_time');
    const costWon = $('cost_won');
    const costPercent = $('cost_percent');

    const {branchSettings} = obj;
    const {
        basicStartTime, delayTime, extraCharge, extraChargePercent,
    } = branchSettings;

    const basicStartTimeIndex = basicStartTime / 10;
    selectDefaultStart.selectedIndex = basicStartTimeIndex;

    if (basicStartTimeIndex === 0) {
        changeToStyleSafe(selectDefaultStart);
    } else {
        changeToStyleWarning(selectDefaultStart);
    }

    const delayTimeIndex = delayTime / 10;
    selectDelayTime.selectedIndex = delayTimeIndex;

    if (delayTimeIndex === 0) {
        changeToStyleSafe(selectDelayTime);
    } else {
        changeToStyleWarning(selectDelayTime);
    }

    costWon.value = extraCharge;
    costPercent.value = extraChargePercent * 100;
});


const loadCounts = (counts) => {
    const arr = [
        'acceptCount',
        'allocateCount',
        'pickupCount',
        'completeCount',
        'cancelCount',
        'suspendCount',
        'shareCallCount',
    ];

    let sum = 0;
    for (let i = 1; i < statusText.length; i++) {
        const count = counts[arr[i - 1]];
        if (i !== 6) {
            statusText[i].innerHTML = count;
            sum += parseInt(count, 10);
        }
    }

    statusText[0].innerHTML = sum;
};

checkboxAll.onclick = function () {
    if (this.checked === true) {
        uncheckOthers(statusCheckboxes);
    }

    if (baseForm !== null) {
        submitOrderStatus();
    }
};

const checkboxOnclick = () => {
    checkboxAll.checked = !isSomeChecked(statusCheckboxes);

    if (baseForm !== null) {
        submitOrderStatus();
    }
};

statusCheckboxes.forEach((checkbox) => {
    checkbox.onclick = checkboxOnclick;
});

$('form_search').onsubmit = function () {
    if (getCurrentBranchId() === -1) {
        alert('지사를 선택해주세요.');
        return false;
    }
    setSearchType();

    const formData = new FormData(this);
    lastSubmittedFormData = formData;
    baseForm = formData;

    pageIndex = 1;

    getOrders(formData).then((obj) => {
        const {
            orders, counts,
        } = obj;

        resultList.innerHTML = '';

        loadCounts(counts);

        isEmpty = orders.length === 0;
        if (isEmpty) {
            emptyHandler();
        }

        createTable(resultList, orders);
        pageIndex += 1;
    })
        .catch((error) => {
            displayError(error);
        });

    return false;
};

const setBranchSetting = (branchId, formData) => ajax(`/api/branches/${branchId}/settings`,
    'POST',
    JSON.stringify(jsonifyFormData(formData)),
    setCSRFHeader);

$('form_default_start').onsubmit = $('form_delay_time').onsubmit = function () {
    const branchId = getCurrentBranchId();
    if (branchId !== -1) {
        const formData = new FormData(this);

        setBranchSetting(branchId, formData);
    }

    return false;
};

$('form_additional_cost').onsubmit = function () {
    const branchId = getCurrentBranchId();
    if (branchId !== -1) {
        const formData = new FormData(this);

        const extraChargePercent = formData.get('extraChargePercent').toString();
        formData.set('extraChargePercent', parseInt(extraChargePercent, 10) / 100.0);

        setBranchSetting(branchId, formData);
    }

    return false;
};

window.onscroll = function () {
    if ((window.innerHeight + window.scrollY) < $('window-parent').offsetHeight - 1
        || lastSubmittedFormData === null || isEmpty === true) {
        return;
    }

    const formData = copyFormData(lastSubmittedFormData);
    formData.append('pageIndex', pageIndex);

    getOrders(formData).then((obj) => {
        const {orders} = obj;

        isEmpty = orders.length === 0;

        createTable(resultList, orders);
        pageIndex += 1;
    })
        .catch((error) => {
            displayError(error);
        });
};

document.body.onload = () => {
    const id = $('userId').value;
    const group = $('group').value;

    switch (parseInt(group, 10)) {
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
            getDistribList(selectDistrib, id);

            selectDistrib.onchange = function () {
                const distribId = getOptionValue(this);

                if (this.selectedIndex === 0) {
                    appendOptions(branchSelect, [{text: '--', value: '-1'}]);
                } else {
                    getBranchList(branchSelect, distribId);
                }
            };

            branchSelect.onchange = function () {
                const branchId = getOptionValue(this);

                if (this.selectedIndex !== 0) {
                    getBranchSettings(branchId);
                }
            };

            break;
        default:
            break;
    }

    calendarListener();
};
