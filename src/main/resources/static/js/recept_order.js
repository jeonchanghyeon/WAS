import {ajax, getJSON, setCSRFHeader} from './ajax.js';
import {$, createRow, formSerialize, jsonifyFormData} from './element.js';
import {getDeliveryCostSum, getExtraChargeValue, modalOpen} from './popup_search_address.js';
import {loadPoint} from './point.js';
import {numberWithCommas} from './format.js';
import {addCloseModalEvent} from './modal.js';

loadPoint();

class Item {
    constructor(id, label, price) {
        this.id = id;
        this.label = label;
        this.price = price;
        this.count = 0;
    }

    add() {
        this.count += 1;
    }

    sub() {
        if (this.count > 0) {
            this.count -= 1;
        }
    }
}

const menuList = [];
let selectedMenu = null;

const toInt = (element) => {
    const integer = parseInt(element.value, 10);

    if (Number.isNaN(integer) === true) {
        return 0;
    }

    return integer;
};

// 지사 설정 불러오기
const getBranchSettings = branchId => getJSON(`/api/branches/${branchId}/settings`).then((obj) => {
    const {branchSettings} = obj;
    const {
        extraChargePercent, extraCharge,
    } = branchSettings;

    $('branch-extra-charge-percent').value = extraChargePercent;
    $('branch-extra-charge').value = extraCharge;
});

const getShopSettings = shopId => getJSON(`/api/users/${shopId}`).then((obj) => {
    const {user} = obj;
    const {
        latitude, longitude, additional, address,
    } = user;
    const {deliveryCostBaseType, distanceFactor, deliveryCostPaymentType} = additional;

    $('shop-address').value = address;
    $('shop-latitude').value = latitude;
    $('shop-longitude').value = longitude;
    $('distance-factor').value = distanceFactor;
    $('delivery-cost-payment-type').value = deliveryCostPaymentType;
    
    const uncheckedStyle = 'button button--empty-white cost-type-container__button';
    const checkedStyle = 'button button--empty-orange cost-type-container__button';
    const ptTarget = $('pt');
    const moneyTarget = $('money');
    switch (parseInt(deliveryCostPaymentType, 10)) {
        case 1:
        case undefined:
            ptTarget.className = checkedStyle + ' cost-type-container__button--margin';
            moneyTarget.className = uncheckedStyle;
            break;
        case 2:
            ptTarget.className = uncheckedStyle + ' cost-type-container__button--margin';
            moneyTarget.className = checkedStyle;
            break;
        default:
            break;
    }

    switch (parseInt(deliveryCostBaseType, 10)) {
        case 1:
            $('setting_distance').checked = true;
            break;
        case 2:
            $('setting_dong').checked = true;
            $('by-distance').value = '';
            break;
        default:
            break;
    }
});

const receptionForm = $('reception_form');

const submitReceptionForm = () => {
    const formData = new FormData(receptionForm);

    const jsonObject = jsonifyFormData(formData);

    jsonObject.menu = menuList.map(data => ({
        price: data.price,
        count: data.count,
        label: data.label,
    }));
    jsonObject['additional-cost'] = getExtraChargeValue();

    return ajax('/api/orders',
        'PUT',
        JSON.stringify(jsonObject),
        setCSRFHeader);
};

$('wait').onclick = () => {
    $('is-suspend').value = true;
};

receptionForm.onsubmit = function () {
    const selectedBranchId = $('branchId').value;
    const shopId = $('shopId').value;

    if (selectedBranchId === '') {
        alert('지사를 선택해주세요.');
        return false;
    }
    if (shopId === '') {
        alert('상점을 선택해주세요.');
        return false;
    }

    submitReceptionForm().then(() => {
        $('is-suspend').value = false;
        alert('접수 되었습니다');
        window.location.reload();
    }).catch(() => {
        alert('예기치 않은 오류 입니다');
    });

    return false;
};

const sum = $('sum');
const additionalMenuPrice = $('additional-menu-price');
const menuPrice = $('menu-price');

menuPrice.onchange = additionalMenuPrice.onchange = () => {
    sum.value = `${numberWithCommas(toInt(menuPrice) + toInt(additionalMenuPrice))}원`;
};

const deliveryCost = $('delivery-cost');
const additionalCost = $('additional-cost');
const addCost = $('add-cost');

$('btn_address').onclick = () => {
    const shopId = $('shopId').value;

    if (shopId === '') {
        alert('상점을 선택해주세요.');
    } else {
        modalOpen(shopId);
    }
};

const getBranch = (obj) => {
    const {branches} = obj;

    const resultSection = $('branch-result-section');
    resultSection.innerHTML = '';

    branches.forEach((branch) => {
        const {id, name} = branch;

        const label = document.createElement('label');
        label.className = 'radio-item radio-item--hovered result-section__radio-item';

        label.innerHTML = `<input class="radio-item__input" type="radio" name="branchId" form="form-result-branch" value=${id}>`
            + `<span class="radio-item__shape result-section__shape"></span>${name}`;

        label.onclick = () => {
            $('result-branch-name').value = name;
            getBranchSettings(id);
        };

        resultSection.appendChild(label);
    });

    $('branch_search_modal').style.display = 'initial';
};

const getShop = (obj) => {
    const {shops} = obj;

    const resultSection = $('shop-result-section');
    resultSection.innerHTML = '';

    shops.forEach((shop) => {
        const label = document.createElement('label');
        label.className = 'radio-item radio-item--hovered result-section__radio-item';

        label.innerHTML = `<input class="radio-item__input" type="radio" name="shopId" form="form-result-shop" value=${shop.id}>`
            + `<span class="radio-item__shape result-section__shape"></span>${shop.name}`;

        label.onclick = () => {
            $('result-shop-name').value = shop.name;
            getShopSettings(shop.id);
        };

        resultSection.appendChild(label);
    });

    $('shop_search_modal').style.display = 'initial';
};

$('btn_branch_name').onclick = () => {
    getJSON('/api/branches').then(getBranch);
};

$('btn_shop_name').onclick = () => {
    const selectedBranchId = $('branchId').value;

    if (selectedBranchId === '') {
        alert('지사를 선택해주세요.');
    } else {
        getJSON(`/api/shops?branch-id=${selectedBranchId}`).then(getShop);
    }
};

addCost.onchange = deliveryCost.onchange = () => {
    const intAdditionalCost = toInt(addCost) + getDeliveryCostSum();
    additionalCost.value = `${numberWithCommas(intAdditionalCost)}원`;
};

$('form-branch-search').onsubmit = function () {
    const formData = new FormData(this);

    getJSON(`/api/branches?${formSerialize(formData)}`).then(getBranch);

    return false;
};

$('form-shop-search').onsubmit = function () {
    const formData = new FormData(this);
    const branchId = $('branchId').value;

    formData.append('branch-id', branchId);

    getJSON(`/api/shop?${formSerialize(formData)}`).then(getShop);

    return false;
};

$('form-result-branch').onsubmit = function () {
    const formData = new FormData(this);

    $('branchId').value = formData.get('branchId');
    $('branchName').value = formData.get('branchName');
    $('shopId').value = '';
    $('shopName').value = '';

    $('branch_search_modal').style.display = 'none';

    return false;
};

$('form-result-shop').onsubmit = function () {
    const formData = new FormData(this);

    $('shopId').value = formData.get('shopId');
    $('shopName').value = formData.get('shopName');

    $('shop_search_modal').style.display = 'none';

    return false;
};

$('btn-menu').onclick = () => {
    const shopId = $('shopId').value;

    if (shopId === '') {
        alert('상점을 선택해주세요.');

        return;
    }

    getJSON(`/api/shops/${shopId}/menu-list`).then((obj) => {
        const menu = [
            {
                id: 1,
                label: '짬뽕',
                price: 3000,
            },
            {
                id: 2,
                label: '자장면',
                price: 3000,
            },
        ];

        const table = $('all-menu');
        const selected = $('selected-menu');

        table.innerText = '';
        selected.innerText = '';
        menuList.length = 0;

        const btnOnclick = m => () => {
            if (menuList.find(data => data.id === m.id) !== undefined) {
                return;
            }

            const item = new Item(m.id, m.label, m.price);

            menuList.push(item);

            const span = document.createElement('span');
            span.innerHTML = '0';

            const minusBtn = document.createElement('button');
            minusBtn.className = 'num-count__minus num-count__minus--disable';

            minusBtn.onclick = () => {
                item.sub();

                if (item.count > 0) {
                    minusBtn.className = 'num-count__minus';
                } else {
                    minusBtn.className = 'num-count__minus num-count__minus--disable';
                }

                span.innerHTML = item.count;
            };

            const plusBtn = document.createElement('button');
            plusBtn.className = 'num-count__plus';

            plusBtn.onclick = () => {
                item.add();
                if (item.count > 0) {
                    minusBtn.className = 'num-count__minus';
                } else {
                    minusBtn.className = 'num-count__minus num-count__minus--disable';
                }

                span.innerHTML = item.count;
            };

            const div = document.createElement('div');
            div.className = 'num-count';

            div.appendChild(minusBtn);
            div.appendChild(span);
            div.appendChild(plusBtn);

            const row = createRow([
                item.id,
                item.label,
                div,
                numberWithCommas(item.price),
            ]);

            selected.appendChild(row);
        };

        menu.forEach((m) => {
            const btn = document.createElement('button');
            btn.className = 'button button--empty-orange total-menu-container__button';
            btn.innerHTML = '선택';

            btn.onclick = btnOnclick(m);

            const row = createRow([
                m.label,
                numberWithCommas(m.price),
                btn,
            ]);

            table.appendChild(row);
        });

        $('menu_modal').style.display = 'initial';
    });
};

const writeMenuList = () => {
    const tbody = $('menu-list');

    tbody.innerHTML = '';

    const rowOnclick = itemId => () => {
        selectedMenu = itemId;
    };

    menuList.forEach((item) => {
        const row = createRow([
            item.id,
            item.label,
            0,
            item.price,
            item.count,
            item.price * item.count,
        ]);

        row.onclick = rowOnclick(item.id);
        row.ondblclick = () => {
            for (let i = 0; i < menuList.length; i++) {
                if (menuList[i].id === item.id) {
                    menuList.splice(i, 1);
                    break;
                }
            }
            writeMenuList();
        };

        tbody.appendChild(row);
    });
};

$('btn-add').onclick = () => {
    if (selectedMenu !== null) {
        const target = menuList.find(data => data.id === selectedMenu);

        if (target !== undefined) {
            target.count += 1;
            writeMenuList();
        }
    }
};

$('menu-modal-confirm').onclick = () => {
    writeMenuList();
    $('menu_modal').style.display = 'none';
};

addCloseModalEvent('branch_search_modal', 'branch-close-button');
addCloseModalEvent('shop_search_modal', 'shop-close-button');
addCloseModalEvent('menu_modal', 'menu-close-button');
