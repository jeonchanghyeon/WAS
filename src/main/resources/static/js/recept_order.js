import {withPostMethod} from "./ajax.js";
import {getMeta} from './meta.js'

let receptForm = document.getElementById("recept_form");

receptForm.onsubmit = function () {
    const formData = new FormData(this);

    withPostMethod(
        "/order-reception/efg",
        formData,
        () => {

        },
        csrfHeader,
        csrfToken
    );

    return false;
};

const sum = document.getElementById("sum");

const additionalMenuPrice = document.getElementById("additional-menuPrice");
const menuPrice = document.getElementById("menu-price");

menuPrice.onchange =
    additionalMenuPrice.onchange = () => {
        sum.value = parseInt(menuPrice.value) + parseInt(additionalMenuPrice.value) + "원";
    };

const deliveryCost = document.getElementById("delivery-cost");
const additionalCost = document.getElementById("additional-cost");
const addCost = document.getElementById("add-cost");
const extraCharge = document.getElementById("extra-charge");
const btnAddress = document.getElementById("btn_address");

btnAddress.onclick = () => {
    const windowModal = document.getElementById("modal");
    windowModal.style.visibility = "visible";
    return false;
};

btnAddress.onsubmit = () => false;


addCost.onchange =
    extraCharge.onchange = () => {
        additionalCost.value = parseInt(deliveryCost.value)  + parseInt(addCost.value) + parseInt(extraCharge.value) + "원";
    };


const csrfToken = getMeta("_csrf");
const csrfHeader = getMeta("_csrf_header");

const loadPint = () => document.getElementById("point").value = 0;
const loadShopId = () => document.getElementById("shop_id").value = 1;

loadPint();
loadShopId();


// TODO 상품 메뉴
// TODO 대행료 지불방법 불러오기