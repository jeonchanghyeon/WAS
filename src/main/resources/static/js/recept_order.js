import {ajax, getJSON, setCSRFHeader} from "./ajax.js";
import {$, createCol, createRow, formSerialize, jsonifyFormData} from "./element.js"
import {modalOpen} from "./popup_search_address.js"
import {loadPoint} from "./point.js";
import {numberWithCommas} from "./format.js";
import {addCloseModalEvent} from "./modal.js";

loadPoint();


const receptionForm = $("reception_form");

const submitReceptionForm = () => {
    const formData = new FormData(receptionForm);

    const jsonObject = jsonifyFormData(formData);


    return ajax(
        "api/orders",
        "PUT",
        JSON.stringify(jsonObject),
        setCSRFHeader
    );
};

$("wait").onclick = () => {
    $("is-suspend").value = true;
};

receptionForm.onsubmit = function () {
    submitReceptionForm().then(() => {
        $("is-suspend").value = false;
    });

    return false;
};

const sum = $("sum");
const additionalMenuPrice = $("additional-menu-price");
const menuPrice = $("menu-price");

menuPrice.onchange
    = additionalMenuPrice.onchange
    = () => {
    let a = 0;
    let b = 0;
    console.log(menuPrice.value);
    if (menuPrice.value === "") {
        a = 0;
    } else {
        a = parseInt(menuPrice.value);
    }
    if (additionalMenuPrice.value === "") {
        b = 0;
    } else {
        b = parseInt(additionalMenuPrice.value);
    }
    sum.value
        = a + b + "원";
};

const deliveryCost = $("delivery-cost");
const additionalCost = $("additional-cost");
const addCost = $("add-cost");
const extraCharge = $("extra-charge");

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
        };

        result_section.appendChild(label);
    }

    $("shop_search_modal").style.display = "initial";
};

$("btn_branch_name").onclick = () => {
    getJSON('api/branches').then(getBranch)
        .catch((e) => {
            console.log(e);
        });

};

$("btn_shop_name").onclick = () => {
    const selectedBranchId = $("branchId").value;

    if (selectedBranchId === "") {
        alert("지사를 선택해주세요.");
    } else {
        getJSON('api/shops?branch-id=' + selectedBranchId).then(getShop);
    }
};

addCost.onchange
    = deliveryCost.onchange
    = () => {
    let a = 0;
    let b = 0;
    let c = 0;
    if (deliveryCost.value === "") {
        a = 0;
    } else {
        a = parseInt(deliveryCost.value);
    }
    if (addCost.value === "") {
        b = 0;
    } else {
        b = parseInt(addCost.value);
    }
    if (extraCharge.value === "") {
        c = 0;
    } else {
        c = parseInt(extraCharge.value);
    }
    additionalCost.value = a + b + c + "원";
};

$("form-branch-search").onsubmit = function () {
    const formData = new FormData(this);

    getJSON('api/branches?' + formSerialize(formData)).then(getBranch);

    return false;
};

$("form-shop-search").onsubmit = function () {
    const formData = new FormData(this);
    const branchId = $("branchId").value;

    formData.append("branch-id", branchId);

    getJSON('api/shop?' + formSerialize(formData)).then(getShop);

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

let menuList = [];

$("btn-menu").onclick = () => {
    const shopId = $("shopId").value;

    if (shopId === "") {
        alert("상점을 선택해주세요.");
    } else {
        getJSON("api/shops/" + shopId + "/menu-list").then(
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
                    const row = createRow(
                        [
                            menu[i].label,
                            numberWithCommas(menu[i].price)
                        ],
                        row => {
                            const btn = document.createElement("button");
                            btn.className = "button button--empty-orange total-menu-container__button";
                            btn.innerHTML = "선택";

                            btn.onclick = () => {

                                console.log(
                                    menuList.find((data) => data.id === menu[i].id)
                                );

                                if (menuList.find((data) => data.id === menu[i].id) === undefined) {
                                    menuList.push(
                                        {
                                            id: menu[i].id,
                                            item: {
                                                label: menu[i].label,
                                                price: menu[i].price
                                            },
                                            count: 0
                                        }
                                    );

                                    const row = createRow(
                                        [
                                            menu[i].id,
                                            menu[i].label,
                                            numberWithCommas(menu[i].price)
                                        ]
                                    );

                                    selected.appendChild(row);
                                }

                            };

                            const col = createCol(btn);
                            row.appendChild(col);
                        }
                    );

                    table.appendChild(row);
                }

                $("menu_modal").style.display = "initial";
            }
        );
    }
};

$("menu-modal-confirm").onclick = () => {
    const tbody = $("menu-list");

    tbody.innerHTML = '';

    for (let i = 0; i < menuList.length; i++) {
        const row = createRow(
            [
                menuList[i].id,
                menuList[i].item.label,
                0,
                menuList[i].item.price,
                menuList[i].count,
                menuList[i].item.price * menuList[i].count
            ]
        );

        tbody.appendChild(row);
    }

    $("menu_modal").style.display = "none";
};

addCloseModalEvent("branch_search_modal", "branch-close-button");
addCloseModalEvent("shop_search_modal", "shop-close-button");
addCloseModalEvent("menu_modal", "menu-close-button");

// TODO 상품 메뉴
// TODO 대행료 지불방법 불러오기