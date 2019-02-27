import {ajax, getJSON, setCSRFHeader} from "./ajax.js";
import {$, createRow, formSerialize, jsonifyFormData} from "./element.js"
import {modalOpen} from "./popup_search_address.js"
import {loadPoint} from "./point.js";
import {numberWithCommas} from "./format.js";
import {addCloseModalEvent} from "./modal.js";

loadPoint();

const receptForm = $("recept_form");

receptForm.onsubmit = function () {
    const formData = new FormData(this);

    ajax(
        "/order-reception/efg",
        "POST",
        JSON.stringify(jsonifyFormData(formData)),
        setCSRFHeader
    );

    return false;
};

const sum = $("sum");
const additionalMenuPrice = $("additional-menuPrice");
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
const btnAddress = $("btn_address");
const btnBranchName = $("btn_branch_name");
const btnShopName = $("btn_shop_name");

btnAddress.onclick = () => {
    const shopId = $("shopId").value;

    if (shopId === "") {
        alert("상점을 선택해주세요.");
    } else {
        modalOpen(shopId);
    }

    return false;
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

btnBranchName.onclick = () => {
    getJSON('api/branches').then(getBranch)
        .catch((e) => {
            console.log(e);
        });

    return false;
};

btnShopName.onclick = () => {
    const selectedBranchId = $("branchId").value;

    if (selectedBranchId === "") {
        alert("지사를 선택해주세요.");
    } else {
        getJSON('api/shops?branch-id=' + selectedBranchId).then(getShop);
    }

    return false;
};

btnBranchName.onsubmit
    = btnShopName.onsubmit
    = btnAddress.onsubmit
    = () => false;

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

let asdf = [];

$("btn-menu").onclick = () => {
    const shopId = $("shopId").value;

    if (shopId === "") {
        alert("상점을 선택해주세요.");
    } else {
        getJSON("api/shops/" + shopId + "/menu-list").then(
            obj => {
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
                                    asdf.find((data) => data.id === menu[i].id)
                                );

                                if (asdf.find((data) => data.id === menu[i].id) === undefined) {
                                    asdf.push(
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
                                            '<div class="num-count">\n' +
                                            '<input class="num-count__minus num-count__minus--disable" type="button"/>\n' +
                                            '<div name="value">0</div>\n' +
                                            '<input class="num-count__plus" type="button"/>\n' +
                                            '</div>',
                                            numberWithCommas(menu[i].price)
                                        ]
                                    );

                                    selected.appendChild(row);
                                }

                            };

                            row.appendChild(btn);
                        }
                    );

                    table.appendChild(row);
                }

                $("menu_modal").style.display = "initial";
            }
        );
    }

    return false;
};

$("menu-modal-confirm").onclick = () => {
    const tbody = $("asdfasdf");

    tbody.innerHTML = '';

    for (let i = 0; i < asdf.length; i++) {
        const row = createRow(
            [
                asdf[i].id,
                asdf[i].item.label,
                0,
                asdf[i].item.price,
                asdf[i].count,
                asdf[i].item.price * asdf[i].count
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