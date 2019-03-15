import {$, jsonifyFormData} from "./element.js";
import {filterNumber, isNumber, numberCommasRemove, numberWithCommas, YYYYmmdd} from "./format.js";
import {ajax, getJSON, setCSRFHeader} from "./ajax.js";
import {addCloseModalEvent, addCloseButtonEvent} from "./modal.js";

let point_ = null;

const Group = {
    GUEST: 1,
    RIDER: 2,
    SHOP: 3,
    BRANCH: 5,
    DISTRIB: 6,
    HEAD: 7
};

const GroupMap = new Map();
GroupMap.set(2, "rider");
GroupMap.set(3, "shop");
GroupMap.set(5, "branch");
GroupMap.set(6, "distrib");
GroupMap.set(7, "head");

const id = $("userId").value;
const group = parseInt($("group").value);

export const loadPoint = () => {
    function showMileage(point) {
        point_ = point;
        $("point").innerText = numberWithCommas(point);

        return point;
    }

    getPoint().then(showMileage);
};

//Controller
export function getPoint() {
    let result = -1;

    return getJSON("/api/point")
        .then((res) => {
                if (res["resultCode"] * 1 === 0) {
                    result = res["point"]["point"] * 1;
                } else {
                    console.log(res["description"]);
                }
                return result;
            }
        ).catch((e) => {
            console.log(e);
            return result;
        })
}

export function getAccountInfo(id) {
    let accountInfo = '-';

    return getJSON('api/users/' + id + '/account')
        .then((obj) => {
                if (obj["resultCode"] * 1 === 0) {
                    let owner = obj["owner"];
                    let account = obj["account"];
                    let bank = obj["bank"];
                    accountInfo = `${owner} ${account} ${bank}`;
                } else {
                    console.log(obj["description"])
                }
                return accountInfo;
            }
        ).catch((e) => {
            console.log(e);
            return '-';
        });
}

export function withdrawPoint(json) {
    let result = false;

    ajax("/api/point", "POST", JSON.stringify(json), setCSRFHeader)
        .then((obj) => {
            const res = JSON.parse(obj);

            if (res["resultCode"] * 1 === 0) {
                alert("출금 되었습니다");
                result = true;
            }
            else {
                alert(res["description"]);
            }
        }).catch((e) => {
        console.log(e);
        alert("서버 장애로 출금에 실패 했습니다.");
    });
    return result;
}

export function depositPoint(receiverId, json) {
    let result = false;

    ajax("/api/point/" + receiverId, "PUT", JSON.stringify(json), setCSRFHeader)
        .then((obj) => {
            const res = JSON.parse(obj);

            if (res["resultCode"] * 1 === 0) {
                alert("송금 되었습니다");
                result = true;
            }
            else {
                alert(res["description"]);
            }
        }).catch((e) => {
        console.log(e);
        alert("서버 장애로 송금에 실패 했습니다.");
    });

    return result;
}

export function getUserList(userId, group, name) {
    let uri = null;

    if (GroupMap.has(group)) {
        switch (group) {
            case Group.DISTRIB:
                uri = '/api/' + GroupMap.get(group) + 's?id=' + userId;
                if (name !== null && name !== '') uri += '&name=' + name;
                break;
            case Group.BRANCH:
                uri = '/api/' + GroupMap.get(group) + 'es/list?id=' + userId;
                if (name !== null && name !== '') uri += '&name=' + name;
                break;
            default:
                uri = '/api/' + GroupMap.get(group) + 's/list?id=' + userId;
                if (name !== null && name !== '') uri += '&name=' + name;
        }
    }
    return getJSON(uri)
        .then((res) => res)
        .catch((e) => {
            console.log(e);
            return null;
        });
}

//View
const showAccountInfo = function (accountInfo) {
    $("bank-account").innerHTML = accountInfo;
    return accountInfo;
};

const checkEnableWithdraw = function (accountInfo) {
    if (accountInfo === '-') {
        $('withdraw_amount_input').disabled = true;
        $('withdraw_password').disabled = true;
        $('withdraw_button').disabled = true;
    } else {
        $('withdraw_amount_input').disabled = false;
        $('withdraw_password').disabled = false;
        $('withdraw_button').disabled = false;
    }
    return accountInfo;
};

const showWithdrawSection = function () {
    $('withdraw_amount_input').value = '';
    $('deducted_amount_input').value = '';
    $('deducted_amount').value = '';
    $('withdraw_password').value = '';

    getAccountInfo(id)
        .then(showAccountInfo)
    //.then(checkEnableWithdraw);

    $('btn-withdraw').checked = true;
    $("withdraw-section").style.display = "flex";
    $("withdraw-submit-section").style.display = "flex";

    $("transfer-section").style.display = "none";
    $("deposit-submit-section").style.display = "none";
};

const showDepositSection = function () {
    $('transfer_amount_input').value = '';
    $('reduce_amount_input').value = '';
    $('reduce_amount').value = '';
    $('deposit_password').value = '';
    $('user-id-result').value = '';
    $('user-name-result').value = '';

    $('btn-deposit').checked = true;
    $("withdraw-section").style.display = "none";
    $("withdraw-submit-section").style.display = "none";

    $("transfer-section").style.display = "flex";
    $("deposit-submit-section").style.display = "flex";
};

const showMileageStatus = function (point) {
    const date = YYYYmmdd(new Date());
    $("mileage").innerText = numberWithCommas(point) + "원";
    $("mileage-description").innerHTML = `${date} 현재 마일리지`;

    return point;
};
const changeWithdrawPoint = function (point) {
    $('withdraw_amount_input').value = numberWithCommas(point);
    $("deducted_amount_input").value = numberWithCommas(point);
    $('deducted_amount').value = point;

    return point;
};

const changeDepositPoint = function (point) {
    $('transfer_amount_input').value = numberWithCommas(point);
    $("reduce_amount_input").value = numberWithCommas(point);
    $('reduce_amount').value = point;

    return point;
};

const showFullPoint = function () {
    getPoint()
        .then(changeWithdrawPoint);
};

const showMileageModal = function () {
    $('mileage_modal').style.display = 'initial';
    getPoint()
        .then(showMileageStatus);
    switch (group) {
        case Group.HEAD:
            $("process-button-container").style.display = "none";
            showDepositSection();
            break;
        default:
            showWithdrawSection();
    }
};

function getSelectedGroup() {
    const selector = $('transfer-group-search-selector');
    return selector.options[selector.selectedIndex].value * 1;
}

//Event
const submitWithdrawForm = function () {
    const formData = new FormData(this);

    const point = formData.get("point");
    const password = formData.get("point-password");

    if (point === '') {
        alert("출금 금액을 입력해 주세요.");
        return false;
    }
    if (!isNumber(point) || point < 0) {
        alert("정상적인 출금 금액이 아닙니다. (" + point + ")");
        return false;
    }
    if (password === '') {
        alert("비밀번호를 입력해 주세요.");
        return false;
    }

    const jsonObject = jsonifyFormData(formData);
    return withdrawPoint(jsonObject);
};

const submitDepositForm = function () {
    const formData = new FormData(this);

    const point = formData.get("point");
    const password = formData.get("point-password");
    const receiverId = formData.get('receiver-id');

    if (receiverId === '') {
        alert("송금 대상을 선택해 주세요.");
        return false;
    }
    if (point === '') {
        alert("송금 금액을 입력해 주세요.");
        return false;
    }
    if (!isNumber(point) || point < 0) {
        alert("정상적인 송금 금액이 아닙니다. (" + point + ")");
        return false;
    }
    if (password === '') {
        alert("비밀번호를 입력해 주세요.");
        return false;
    }

    const jsonObject = jsonifyFormData(formData);
    return depositPoint(receiverId, jsonObject);
};

$("point-area").onclick = showMileageModal;     //헤더 포인트 영역
$('btn-withdraw').onclick = showWithdrawSection;    //마일리지 출금 영역 버튼
$('btn-deposit').onclick = showDepositSection;  //마일리지 송금 영역 버튼
$("btn-full-withdraw").onclick = showFullPoint; //전액인출 버튼

const withdrawInput = $('withdraw_amount_input');
withdrawInput.onkeydown = filterNumber; //출금 금액 입력
withdrawInput.onkeyup = function (ev) {
    ev.stopPropagation();
    ev.target.value = ev.target.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    $('deducted_amount_input').value = ev.target.value;
};
withdrawInput.onfocus = function (ev) {
    ev.target.value = numberCommasRemove(ev.target.value);
    $('deducted_amount_input').value = ev.target.value;
};
withdrawInput.onblur = function (ev) {
    ev.target.value = ev.target.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    if (!isNumber(ev.target.value)) {
        $('deducted_amount_input').value = '';
        withdrawInput.value = '';
        return;
    }
    $('deducted_amount').value = ev.target.value;
    ev.target.value = numberWithCommas(ev.target.value);
    $('deducted_amount_input').value = ev.target.value;
};

const depositInput = $('transfer_amount_input');
depositInput.onkeydown = filterNumber; //송금 금액 입력
depositInput.onkeyup = function (ev) {
    ev.stopPropagation();
    ev.target.value = ev.target.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    $('reduce_amount_input').value = ev.target.value;
};
depositInput.onfocus = function (ev) {
    ev.target.value = numberCommasRemove(ev.target.value);
    $('reduce_amount_input').value = ev.target.value;
};
depositInput.onblur = function (ev) {
    ev.target.value = ev.target.value.replace(/[\ㄱ-ㅎㅏ-ㅣ가-힣]/g, '');
    if (!isNumber(ev.target.value)) {
        $('reduce_amount_input').value = '';
        depositInput.value = '';
        return;
    }
    $('reduce_amount').value = ev.target.value;
    ev.target.value = numberWithCommas(ev.target.value);
    $('reduce_amount_input').value = ev.target.value;
};


$('transfer-users-search-button').onclick = function () { //송금 대상 모달 활성화 버튼
    showDepositUserSearchModal(id, getSelectedGroup());
};

$("withdraw-form").onsubmit = submitWithdrawForm; //출금 버튼
$("deposit-form").onsubmit = submitDepositForm; //출금 버튼


/********************************************************************/
const showDepositUserSearchModal = function (id, searchGroup) {
    if (!GroupMap.has(searchGroup)) return;

    const groupName = GroupMap.get(searchGroup);

    const initElement = function () {
        $('transfer_modal_' + groupName).style.display = 'initial';
        $('transfer_modal_' + groupName).focus();
        $(groupName + '-name').value = '';
        $(groupName + '-id').value = '';
        $(groupName + '_search_name').value = '';   //이름 검색
        $(groupName + '_search_id').value = '';    //검색 id
        $(groupName + '_result').innerHTML = '';    //결과 리스트
        let distribSelector = $(groupName + "_" + GroupMap.get(Group.DISTRIB) + "_selector");
        let branchSelector = $(groupName + "_" + GroupMap.get(Group.BRANCH) + "_selector");
        if (distribSelector !== null) distribSelector.innerHTML = '<option value="0" disabled="disabled" selected="selected" hidden="hidden">총판선택</option>';
        if (branchSelector !== null) branchSelector.innerHTML = '<option value="0" disabled="disabled" selected="selected" hidden="hidden">지사선택</option>';
    };

    const showInitModal = function () {
        initElement();

        switch (searchGroup) {
            case Group.DISTRIB:
                if (group === Group.DISTRIB) {
                    $(groupName + '_search_id').value = 1;
                    getUserList(1, Group.DISTRIB, null)
                        .then(showUserListToRadio);
                } else {
                    $(groupName + '_search_id').value = id;
                    getUserList(id, Group.DISTRIB, null)
                        .then(showUserListToRadio);
                }
                break;
            case Group.BRANCH:
                getUserList(id, Group.DISTRIB, null)
                    .then((obj) => showUserListToSelector(Group.DISTRIB, searchGroup, obj));
                break;
            case Group.SHOP:
            case Group.RIDER:
                getUserList(id, Group.DISTRIB, null)
                    .then((obj) => showUserListToSelector(Group.DISTRIB, searchGroup, obj));
        }
    };

    const showUserListToRadio = function (obj) {
        if (obj === null) return;

        const size = obj.length;
        const result_section = $(groupName + "_result");
        result_section.innerHTML = '';

        for (let i = 0; i < size; i++) {
            const name = obj[i]["name"];
            const id = obj[i]["id"];

            const label = document.createElement("label");
            label.className = "radio-item radio-item--hovered transfer-list-container__radio-item";
            label.innerHTML =
                '<input class="radio-item__input" type="radio" name="options">' +
                '<span class="radio-item__shape"></span>' + name;

            label.onclick = () => {
                $(groupName + "-name").value = name;
                $(groupName + "-id").value = id;
                $(groupName + '_search_name').value = name;
            };

            result_section.appendChild(label);
        }
    };

    const showUserListToSelector = function (selectorGroup, searchGroup, obj) {
        if (obj === null) return;

        const nextProcess = function (selectedId) {
            if (selectorGroup === Group.DISTRIB) {
                switch (searchGroup) {
                    case Group.BRANCH:
                        $(GroupMap.get(searchGroup) + '_search_id').value = selectedId;
                        searchResult(selectedId, searchGroup, null);
                        break;
                    case Group.SHOP:
                    case Group.RIDER:
                        getUserList(id, Group.BRANCH, null)
                            .then((obj) => showUserListToSelector(Group.BRANCH, searchGroup, obj));
                }
            } else if (selectorGroup === Group.BRANCH) {
                $(GroupMap.get(searchGroup) + '_search_id').value = selectedId;
                searchResult(selectedId, searchGroup, null);
            }
        };

        const size = obj.length;
        const selector = $(groupName + '_' + GroupMap.get(selectorGroup) + '_selector');

        if (size === 1) {
            selector.innerHTML = '';
        }
        for (let i = 0; i < size; i++) {
            const selectedName = obj[i]["name"];
            const selectedId = obj[i]["id"];

            const option = document.createElement("option");
            option.value = selectedId;
            option.innerText = selectedName;

            selector.appendChild(option);

            if (size === 1) {
                nextProcess(selectedId);
            }
        }

        if (size !== 1) {
            selector.onchange = (ev) => {
                nextProcess(ev.target.value);
            };
        }
    };

    const searchResult = function (id, searchGroup, name) {
        $(groupName + "-name").value = '';
        $(groupName + "-id").value = '';
        getUserList(id, searchGroup, name)
            .then(showUserListToRadio);
    };

    const submitResultForm = function () {

        const name = $(groupName + "-name").value;
        const id = $(groupName + "-id").value;

        if (name === '' && id === '') {
            alert("송금 대상을 선택해 주세요.");
            return false;

        } else {
            $('user-name-result').value = name;
            $('user-id-result').value = id * 1;
            return true;
        }
    };

    showInitModal();
    addCloseButtonEvent('transfer_modal_'+ groupName, 'transfer-' + groupName + '-close-button');
    // addCloseKeyEvent('transfer_modal_'+ groupName);

    $(groupName + '_ok_button').onclick = () => {
        const result = submitResultForm();
        if (result) $('transfer_modal_' + groupName).style.display = 'none';
    };

    $(groupName + '_result_button').onclick = function () {
        const name = $(groupName + '_search_name').value;
        const id = $(groupName + '_search_id').value;
        if (id !== '') searchResult(id * 1, searchGroup, name);
    };

    $(groupName + '_search_name').onkeydown = function (ev) {
        const ENTER = 13;
        ev = ev || window.event;
        let keyID = (ev.which) ? ev.which : ev.keyCode;
        if (keyID === ENTER) {
            const name = $(groupName + '_search_name').value;
            const id = $(groupName + '_search_id').value;
            if (id !== '') searchResult(id * 1, searchGroup, name);
            return;
        }
    }
};

addCloseModalEvent("mileage_modal", "mileage-close-button");