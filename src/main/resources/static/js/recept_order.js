import {ajax, getJSON, setCSRFHeader} from "./ajax.js";
import {$, createRow, formSerialize, jsonifyFormData} from "./element.js"
import {deliveryCostSum, extraChargeValue, modalOpen} from "./popup_search_address.js"
import {loadPoint} from "./point.js";
import {numberWithCommas} from "./format.js";
import {addCloseModalEvent} from "./modal.js";

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

const toInt = (element) => {
    const integer = parseInt(element.value);

    if (isNaN(integer) === true) {
        return 0;
    }

    return integer;
};

//지사 설정 불러오기
const getBranchSettings = (branchId) =>
    getJSON("/api/branches/" + branchId + "/settings").then(
        (obj) => {
            const branchSetting = obj["branchSettings"];

            $("branch-extra-charge-percent").value = branchSetting["extraChargePercent"];
            $("branch-extra-charge").value = branchSetting["extraCharge"];
        });

const getShopSettings = (shopId) =>
    getJSON("/api/users/" + shopId).then(
        obj => {
            const users = obj["user"];
            const latitude = users["latitude"];
            const longitude = users["longitude"];
            const additional = users["additional"];
            const address = users["address"];

            const deliveryCostBaseType = additional["deliveryCostBaseType"];
            const distanceFactor = additional["distanceFactor"];
            const deliveryCostPaymentType = additional["deliveryCostPaymentType"];

            $("shop-address").value = address;
            $("shop-latitude").value = latitude;
            $("shop-longitude").value = longitude;
            $("distance-factor").value = distanceFactor;

            switch (parseInt(deliveryCostPaymentType)) {
                case 1:
                    $("money").checked = true;
                    break;
                case 2:
                    $("pt").checked = true;
                    break;
            }

            switch (parseInt(deliveryCostBaseType)) {
                case 1 :
                    $("setting_distance").checked = true;
                    break;
                case 2:
                    $("setting_dong").checked = true;
                    $("by-distance").value = "";
                    break;
            }
        }
    );

const receptionForm = $("reception_form");

const submitReceptionForm = () => {
    const formData = new FormData(receptionForm);

    const jsonObject = jsonifyFormData(formData);

    jsonObject["menu"] = menuList.map((data) => {
        return {
            price: data.price,
            count: data.count,
            label: data.label
        }
    });
    jsonObject["additional-cost"] = extraChargeValue;

    return ajax(
        "/api/orders",
        "PUT",
        JSON.stringify(jsonObject),
        setCSRFHeader
    );
};

$("wait").onclick = () => {
    $("is-suspend").value = true;
};

receptionForm.onsubmit = function () {
    const selectedBranchId = $("branchId").value;
    const shopId = $("shopId").value;

    if (selectedBranchId === "") {
        alert("지사를 선택해주세요.");
        return false;
    }
    if (shopId === "") {
        alert("상점을 선택해주세요.");
        return false;
    }

    submitReceptionForm().then(() => {
        $("is-suspend").value = false;
        alert("접수 되었습니다");
        location.reload();
    }).catch(() =>{
        alert("예기치 않은 오류 입니다");
    });

    return false;
};

const sum = $("sum");
const additionalMenuPrice = $("additional-menu-price");
const menuPrice = $("menu-price");

menuPrice.onchange
    = additionalMenuPrice.onchange
    = () => {
    sum.value
        = numberWithCommas(toInt(menuPrice) + toInt(additionalMenuPrice)) + "원";
};

const deliveryCost = $("delivery-cost");
const additionalCost = $("additional-cost");
const addCost = $("add-cost");
const extraCharge = $("extra-charge");
const byDistance = $("by-distance");
const byDong = $("by-dong");

$("btn_address").onclick = () => {
    const shopId = $("shopId").value;

    if (shopId === "") {
        alert("상점을 선택해주세요.");
    } else {
        modalOpen(shopId);
    }
};

const getBranch = (obj) => {
    const branches = obj["branches"];

    const result_section = $("branch-result-section");
    result_section.innerHTML = '';

    for (let branch of branches) {

        const label = document.createElement("label");
        label.className = "radio-item radio-item--hovered result-section__radio-item";

        label.innerHTML =
            '<input class="radio-item__input" type="radio" name="branchId" form="form-result-branch" value=' + branch["id"] + '>' +
            '<span class="radio-item__shape result-section__shape"></span>' + branch["name"];

        label.onclick = () => {
            $("result-branch-name").value = branch["name"];
            getBranchSettings(branch["id"]);
        };

        result_section.appendChild(label);
    }

    $("branch_search_modal").style.display = "initial";
};

const getShop = (obj) => {
    const shops = obj["shops"];

    const result_section = $("shop-result-section");
    result_section.innerHTML = '';

    for (let shop of shops) {

        const label = document.createElement("label");
        label.className = "radio-item radio-item--hovered result-section__radio-item";

        label.innerHTML =
            '<input class="radio-item__input" type="radio" name="shopId" form="form-result-shop" value=' + shop["id"] + '>' +
            '<span class="radio-item__shape result-section__shape"></span>' + shop["name"];

        label.onclick = () => {
            $("result-shop-name").value = shop["name"];
            getShopSettings(shop["id"]);
        };

        result_section.appendChild(label);
    }

    $("shop_search_modal").style.display = "initial";
};

$("btn_branch_name").onclick = () => {
    getJSON('/api/branches').then(getBranch)
        .catch((e) => {
            console.log(e);
        });

};

$("btn_shop_name").onclick = () => {
    const selectedBranchId = $("branchId").value;

    if (selectedBranchId === "") {
        alert("지사를 선택해주세요.");
    } else {
        getJSON('/api/shops?branch-id=' + selectedBranchId).then(getShop);
    }
};

addCost.onchange
    = deliveryCost.onchange
    = () => {
    const intAdditionalCost = toInt(addCost) + deliveryCostSum;
    additionalCost.value = numberWithCommas(intAdditionalCost) + "원";
};

$("form-branch-search").onsubmit = function () {
    const formData = new FormData(this);

    getJSON('/api/branches?' + formSerialize(formData)).then(getBranch);

    return false;
};

$("form-shop-search").onsubmit = function () {
    const formData = new FormData(this);
    const branchId = $("branchId").value;

    formData.append("branch-id", branchId);

    getJSON('/api/shop?' + formSerialize(formData)).then(getShop);

    return false;
};

$("form-result-branch").onsubmit = function () {
    const formData = new FormData(this);

    $("branchId").value = formData.get('branchId');
    $("branchName").value = formData.get('branchName');
    $("shopId").value = "";
    $("shopName").value = "";

    $("branch_search_modal").style.display = "none";

    return false;
};

$("form-result-shop").onsubmit = function () {
    const formData = new FormData(this);

    $("shopId").value = formData.get('shopId');
    $("shopName").value = formData.get('shopName');

    $("shop_search_modal").style.display = "none";

    return false;
};

const menuList = [];
let selectedMenu = null;

$("btn-menu").onclick = () => {
    const shopId = $("shopId").value;

    if (shopId === "") {
        alert("상점을 선택해주세요.");
    } else {
        getJSON("/api/shops/" + shopId + "/menu-list").then(
            () => {
                // const menus = obj["menu"];

                const menu = [
                    {
                        id: 1,
                        label: "짬뽕",
                        price: 3000
                    },
                    {
                        id: 2,
                        label: "자장면",
                        price: 3000
                    }
                ];

                const table = $("all-menu");
                const selected = $("selected-menu");

                table.innerText = '';
                selected.innerText = '';
                menuList.length = 0;

                for (let i = 0; i < menu.length; i++) {
                    const btn = document.createElement("button");
                    btn.className = "button button--empty-orange total-menu-container__button";
                    btn.innerHTML = "선택";

                    btn.onclick = () => {
                        if (menuList.find((data) => data.id === menu[i].id)
                            === undefined) {
                            const item = new Item(menu[i].id, menu[i].label, menu[i].price);

                            menuList.push(item);

                            const span = document.createElement('span');
                            span.innerHTML = '0';

                            const minusBtn = document.createElement('button');
                            minusBtn.className = "num-count__minus num-count__minus--disable";

                            minusBtn.onclick = () => {
                                item.sub();

                                if (item.count > 0) {
                                    minusBtn.className = "num-count__minus";
                                } else {
                                    minusBtn.className = "num-count__minus num-count__minus--disable";
                                }

                                span.innerHTML = item.count;
                            };

                            const plusBtn = document.createElement('button');
                            plusBtn.className = "num-count__plus";

                            plusBtn.onclick = () => {
                                item.add();
                                if (item.count > 0) {
                                    minusBtn.className = "num-count__minus";
                                } else {
                                    minusBtn.className = "num-count__minus num-count__minus--disable";
                                }

                                span.innerHTML = item.count;
                            };

                            const div = document.createElement('div');
                            div.className = "num-count";

                            div.appendChild(minusBtn);
                            div.appendChild(span);
                            div.appendChild(plusBtn);

                            const row = createRow(
                                [
                                    item.id,
                                    item.label,
                                    div,
                                    numberWithCommas(item.price)
                                ]
                            );

                            selected.appendChild(row);
                        }
                    };

                    const row = createRow([
                        menu[i].label,
                        numberWithCommas(menu[i].price),
                        btn
                    ]);

                    table.appendChild(row);
                }

                $("menu_modal").style.display = "initial";
            }
        );
    }
};

const writeMenuList = () => {
    const tbody = $("menu-list");

    tbody.innerHTML = '';

    for (let item of menuList) {
        const row = createRow(
            [
                item.id,
                item.label,
                0,
                item.price,
                item.count,
                item.price * item.count
            ],
        );

        row.onclick = () => {
            selectedMenu = item.id;
        };

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
    }
};

$("btn-add").onclick = () => {
    if (selectedMenu !== null) {
        const target = menuList.find((data) => data.id === selectedMenu)

        if (target !== undefined) {
            target.count++;
            writeMenuList();
        }
    }
};

$("menu-modal-confirm").onclick = () => {
    writeMenuList();
    $("menu_modal").style.display = "none";
};

addCloseModalEvent("branch_search_modal", "branch-close-button");
addCloseModalEvent("shop_search_modal", "shop-close-button");
addCloseModalEvent("menu_modal", "menu-close-button");