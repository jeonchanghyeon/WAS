import {ajax, getJSON, setCSRFHeader} from "./ajax.js";
import {$, formSerialize, jsonifyFormData} from "./element.js"
import {modalOpen} from "./popup_search_address.js"
import {loadPoint} from "./point.js";

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
    sum.value
        = parseInt(menuPrice.value)
        + parseInt(additionalMenuPrice.value)
        + "원";
};

const deliveryCost = $("delivery-cost");
const additionalCost = $("additional-cost");
const addCost = $("add-cost");
const extraCharge = $("extra-charge");
const btnAddress = $("btn_address");
const btnBranchName = $("btn_branch_name");
const btnShopName = $("btn_shop_name");

btnAddress.onclick = () => {
    const shopId = $("shop_id").value;
    modalOpen(shopId);

    return false;
};

btnBranchName.onsubmit
    = btnShopName.onsubmit
    = btnAddress.onsubmit
    = () => false;

addCost.onchange
    = deliveryCost.onchange
    = () => {
    additionalCost.value
        = parseInt(deliveryCost.value)
        + parseInt(addCost.value)
        + parseInt(extraCharge.value)
        + "원";
};

// TODO 상품 메뉴
// TODO 대행료 지불방법 불러오기