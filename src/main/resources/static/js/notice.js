import {ajax, getJSON, setCSRFHeader} from './ajax.js';
import {loadPoint} from './point.js';
import {$, appendOptions, createRow, formSerialize, getClosureToSelectButton, jsonifyFormData} from './element.js';
import {fillZero} from './format.js';

loadPoint();

const distribSelect = $('select-distrib-branch');
const userId = $('userId').value;

const noticeIds = [];

const formNoticeModify = $('form-notice-modify');
const formNoticePost = $('form-notice-post');
const checkboxBranchDistrib = $('checkbox-branch-distrib');
const checkboxShopBranch = $('checkbox-shop-branch');
const headNoticeForm = $('head-notice-form');
const distribNoticeForm = $('distrib-notice-form');
const branchNoticeForm = $('branch-notice-form');
const selectBranch = $('select-branch');
const selectDistribHead = $('select-distrib-head');
const btnHeadNotice = $('btn-head-notice');
const btnDistribNotice = $('btn-distrib-notice');
const btnBranchNotice = $('btn-branch-notice');
const btnNewNotice = $('btn-new-notice');

const displayDiv = (num) => {
    const ids = [
        'head-notice-area',
        'distrib-notice-area',
        'branch-notice-area',
        'notice-post-area',
        'notice-detail-area',
        'notice-modify-area',
    ];

    for (let i = 0; i < ids.length; i++) {
        const div = $(ids[i]);
        if (div !== null) {
            if (num === i) {
                div.style.display = 'initial';
            } else {
                div.style.display = 'none';
            }
        }
    }

    if (num === 3) {
        const checkboxIds = ['666', '555', '333', '444'];

        checkboxIds.map(checkboxId => $(checkboxId))
            .filter(checkbox => checkbox != null)
            .forEach((checkbox) => {
                checkbox.checked = true;
            });

        $('post-title').value = '';
        $('post-content').value = '';
    }
};

const changeButton = getClosureToSelectButton([
    btnHeadNotice,
    btnDistribNotice,
    btnBranchNotice,
], 'btn-notice-confirm-selected', 'btn-notice-confirm');

const parseTypes = (types) => {
    const label = ['', '기사 전체', '상점 전체', '', '지사 전체', '총판 전체'];
    const groups = types.map(type => parseInt(type, 10));

    return groups.map(group => label[group - 1]);
};

const getNotice = noticeId => getJSON(`/api/notices/${noticeId}`)
    .then((obj) => {
        const {notice} = obj;

        const {
            id, title, content, writerName, createDate, types,
        } = notice;

        $('detail-types').innerHTML = parseTypes(types);
        $('detail-notice-id').value = id;
        $('detail-writer-name').innerHTML = writerName;
        $('detail-title').innerHTML = title;
        $('detail-content').innerHTML = content;
        $('detail-createDate').innerHTML = createDate;

        displayDiv(4);
    });

const createNoticeList = (tbody, notices) => {
    tbody.innerHTML = '';
    noticeIds.length = 0;

    notices.forEach((notice) => {
        const {
            id, createDate, types, title,
        } = notice;

        noticeIds.push(id);

        const row = createRow([
            fillZero(id.toString(), 5),
            title,
            parseTypes(types),
            createDate
        ]);
        row.ondblclick = () => {
            getNotice(id);
        };

        tbody.appendChild(row);
    });
};

const submitBranchForm = () => {
    const formData = new FormData(branchNoticeForm);

    getJSON(`/api/notices?${formSerialize(formData)}`)
        .then((obj) => {
            const {notices} = obj;
            const tbody = $('result-branch-notice');

            createNoticeList(tbody, notices);
        });
};

const submitDistribForm = () => {
    const formData = new FormData(distribNoticeForm);

    getJSON(`/api/notices?${formSerialize(formData)}`)
        .then((obj) => {
            const {notices} = obj;
            const tbody = $('result-distrib-notice');

            createNoticeList(tbody, notices);
        });
};

const submitHeadForm = () => {
    const formData = new FormData(headNoticeForm);

    getJSON(`/api/notices?${formSerialize(formData)}`)
        .then((obj) => {
            const {notices} = obj;
            const tbody = $('result-head-notice');

            createNoticeList(tbody, notices);
        });
};

const getPrevId = (ids, currentId) => {
    for (let i = 1; i < ids.length; i++) {
        if (currentId.toString() === ids[i].toString()) {
            return ids[i - 1];
        }
    }

    return -1;
};

const getNextId = (ids, currentId) => {
    for (let i = 0; i < ids.length - 1; i++) {
        if (currentId.toString() === ids[i].toString()) {
            return ids[i + 1];
        }
    }

    return -1;
};

const loadHeadNotice = () => {
    submitHeadForm();
    changeButton(0);
    displayDiv(0);
};

const loadDistribNotice = () => {
    submitDistribForm();
    changeButton(1);
    displayDiv(1);
};

const loadBranchNotice = () => {
    submitBranchForm();
    changeButton(2);
    displayDiv(2);
};

if (btnHeadNotice !== null) {
    btnHeadNotice.onclick = loadHeadNotice;
}

if (btnDistribNotice !== null) {
    btnDistribNotice.onclick = loadDistribNotice;
}

if (btnBranchNotice !== null) {
    btnBranchNotice.onclick = loadBranchNotice;
}

if (btnNewNotice !== null) {
    btnNewNotice.onclick = () => {
        displayDiv(3);
    };
}

const getDistribList = (headId, element) => {
    getJSON(`/api/distribs?id=${headId}`)
        .then((obj) => {
            const options = [{
                value: '',
                text: '총판 선택',
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

const getBranchList = (distribId, element) => {
    getJSON(`/api/branches/list?id=${distribId}`)
        .then((obj) => {
            const options = [{
                value: '',
                text: '지사 선택',
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

if (distribSelect !== null) {
    getDistribList(userId, distribSelect);
}
if (selectBranch !== null) {
    appendOptions(selectBranch, [{text: '지사 선택', value: '-1'}]);
}

if (selectDistribHead != null) {
    getDistribList(userId, selectDistribHead);
}

if (distribSelect !== null) {
    distribSelect.onchange = function () {
        const distribId = this.options[this.selectedIndex].value;
        const branchSelect = selectBranch;

        if (this.selectedIndex === 0) {
            appendOptions(branchSelect, [{text: '지사 선택', value: '-1'}]);
        } else {
            getBranchList(distribId, branchSelect);
        }
    };
}

if (selectDistribHead !== null) {
    selectDistribHead.onchange = () => {
        submitDistribForm();
    };
}

if (selectBranch !== null) {
    selectBranch.onchange = () => {
        submitBranchForm();
    };
}

if (branchNoticeForm !== null) {
    branchNoticeForm.onsubmit = () => {
        submitBranchForm();

        return false;
    };
}

if (distribNoticeForm !== null) {
    distribNoticeForm.onsubmit = () => {
        submitDistribForm();

        return false;
    };
}

if (headNoticeForm !== null) {
    headNoticeForm.onsubmit = () => {
        submitHeadForm();

        return false;
    };
}

if (checkboxShopBranch !== null) {
    checkboxShopBranch.onclick = $('checkbox-rider-branch').onclick = () => {
        submitBranchForm();
    };
}


if (checkboxBranchDistrib !== null) {
    checkboxBranchDistrib.onclick = () => {
        submitDistribForm();
    };
}

['checkbox-branch-head', 'checkbox-distrib-head', 'checkbox-shop-head', 'checkbox-rider-head']
    .map(ids => $(ids))
    .filter(checkbox => checkbox != null)
    .forEach((checkbox) => {
        checkbox.onclick = submitHeadForm();
    });

if (formNoticePost !== null) {
    formNoticePost.onsubmit = () => {
        const formData = new FormData(formNoticePost);
        const jsonObject = jsonifyFormData(formData);
        const checkboxIds = ['666', '555', '333', '444'];

        jsonObject['types'] = checkboxIds.map(checkboxId => $(checkboxId))
            .filter(checkbox => (checkbox != null && checkbox.checked === true))
            .map(checkbox => checkbox.value);

        ajax('/api/notices',
            'PUT',
            JSON.stringify(jsonObject),
            setCSRFHeader)
            .then(loadHeadNotice);

        return false;
    };
}

if (formNoticeModify !== null) {
    formNoticeModify.onsubmit = () => {
        const id = $('modify-notice-write-id').value;
        const formData = new FormData(formNoticeModify);
        const jsonObject = jsonifyFormData(formData);
        const checkboxIds = ['5555', '3333', '4444', '6666'];

        jsonObject['types'] = checkboxIds.map(checkboxId => $(checkboxId))
            .filter(checkbox => (checkbox != null && checkbox.checked === true))
            .map(checkbox => checkbox.value);

        ajax(`/api/notices/${id}`,
            'POST',
            JSON.stringify(jsonObject),
            setCSRFHeader)
            .then(loadHeadNotice);

        return false;
    };
}

$('btn-modify').onclick = () => {
    const noticeId = $('detail-notice-id').value;

    getJSON(`/api/notices/${noticeId}`)
        .then((obj) => {
            const {notice} = obj;
            const {
                types, id, title, content,
            } = notice;

            for (let i = 0; i < types.length; i++) {
                if (types[i].toString() === '5') {
                    $('5555').checked = true;
                } else if (types[i].toString() === '3') {
                    $('3333').checked = true;
                } else if (types[i].toString() === '2') {
                    $('4444').checked = true;
                } else if (types[i].toString() === '6') {
                    $('6666').checked = true;
                }
            }

            $('modify-notice-write-id').value = id;
            $('modify-title').value = title;
            $('modify-content').innerHTML = content;

            displayDiv(5);
        });
};

$('btn-remove').onclick = () => {
    const id = $('detail-notice-id').value;

    ajax(`/api/notices/${id}`,
        'DELETE',
        null,
        setCSRFHeader)
        .then(loadHeadNotice);
};

$('btn-pre').onclick = () => {
    const noticeId = $('detail-notice-id').value;
    const prevId = getPrevId(noticeIds, noticeId);

    if (prevId !== -1) {
        getNotice(prevId);
    }
};

$('btn-post').onclick = () => {
    const noticeId = $('detail-notice-id').value;
    const nextId = getNextId(noticeIds, noticeId);

    if (nextId !== -1) {
        getNotice(nextId);
    }
};

loadHeadNotice();
