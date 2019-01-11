import {ajax} from './ajax.js'
import {getMeta} from "./meta.js";

const windowModal = document.getElementById("modal");
const textDistance = document.getElementById("distance");
const textBranchName = document.getElementById("branchName");
const textDeliveryCost = document.getElementById("deliveryCost");
const btnAsideCash = document.getElementById("aside_cash");
const btnAsidePoint = document.getElementById("aside_point");
const imgStatusBar = document.getElementById("statusBar");
const textShopName = document.getElementById("shopName");
const textStartingTel = document.getElementById("startingTel");
const textStartingRoad = document.getElementById("startingRoad");
const textRiderName = document.getElementById("riderName");
const textRiderTel = document.getElementById("riderTel");
const textCustomerTel = document.getElementById("customerTel");
const textRoad = document.getElementById("road");
const textMemo = document.getElementById("memo");
const tableMenu = document.getElementById("menu_table");
const textMenuPrice = document.getElementById("menuPrice");
const textAdditionalMenuPrice = document.getElementById("additionalMenuPrice");
const textTotalPrice = document.getElementById("totalPrice");
const textOrderAutoCancelTime = document.getElementById("orderAutoCancelTime");
const textCookTime = document.getElementById("cookTime");
const btnCash = document.getElementById("cash");
const btnCard = document.getElementById("card");
const btnPrepay = document.getElementById("prepay");
const textExtraCharge = document.getElementById("extraCharge");
const textAddCost = document.getElementById("addCost");
const textSum = document.getElementById("sum");


export const loadDetail = (id, riderId) => {
    try {
        const url = "/orders/" + id;

        ajax(url, "GET", (obj) => {
                const order = obj["order"];

                riderId = order["riderId"];

                textDistance.innerText = order["distance"] + "km";
                textBranchName.innerText = order["branchName"];

                textDeliveryCost.innerText = order["deliveryCost"] + "원";

                const additionalCost = order["additionalCost"];

                let addCost = 0;
                let sum = 0;

                for (let i = 0; i < additionalCost.length; i++) {
                    if (additionalCost[i]["label"] == "추가대행료") {
                        addCost = additionalCost[i]["cost"];
                    }
                    sum += additionalCost[i]["cost"];
                }
                const extraCharge = sum - addCost;

                sum += order["deliveryCost"];

                textExtraCharge.innerText = extraCharge + "원";
                textAddCost.innerText = addCost + "원";
                textSum.innerText = sum + "원";

                const deliveryCostPaymentType = order["deliveryCostPaymentType"];

                switch (deliveryCostPaymentType) {
                    case 1:
                        btnAsideCash.className = "aside-btn-selected";
                        btnAsidePoint.className = "aside-btn-unselected";
                        break;
                    case 2:
                        btnAsideCash.className = "aside-btn-unselected";
                        btnAsidePoint.className = "aside-btn-selected";
                        break;
                }

                const orderStatusId = order["orderStatusId"];

                switch (orderStatusId) {
                    case 1:
                        imgStatusBar.src = "/img/status_bar4.png";
                        break;
                    case 2:
                        imgStatusBar.src = "/img/status_bar3.png";
                        break;
                    case 3:
                        imgStatusBar.src = "/img/status_bar2.png";
                        break;
                    case 4:
                        imgStatusBar.src = "/img/status_bar1.png";
                        break;
                }

                textShopName.innerText = order["shopName"];
                textStartingTel.innerText = order["startingTel"];
                textStartingRoad.innerText = order["startingRoad"];

                textRiderName.innerText = order["riderName"];
                textRiderTel.innerText = order["riderTel"];

                textCustomerTel.innerText = order["customerTel"];
                textRoad.innerText = order["road"];
                textMemo.innerText = order["memo"];

                const menu = order["menu"];

                tableMenu.innerHTML = "";

                for (let i = 0; i < menu.length; i++) {
                    const row = document.createElement("tr");
                    const temp = ["", "label", "", "price", "count", "price"];

                    for (let j = 0; j < temp.length; j++) {
                        const col = document.createElement("td");
                        if (j === 0) {
                            col.innerHTML = i + 1;
                        } else {
                            col.innerHTML = menu[i][temp[j]];
                        }
                        row.appendChild(col);
                    }
                    tableMenu.appendChild(row);
                }

                textMenuPrice.innerText = order["menuPrice"] + "원";
                textAdditionalMenuPrice.innerText = order["additionalMenuPrice"] + "원";
                textTotalPrice.innerText = order["additionalMenuPrice"] + order["menuPrice"] + "원";

                textOrderAutoCancelTime.innerText = order["orderAutoCancelTime"] + "분";
                textCookTime.innerText = order["cookTime"] + "분";

                const paymentType = order["paymentType"];

                switch (paymentType) {
                    case 1:
                        btnCash.className = "btn-selected";
                        btnCard.className = "btn-unselected";
                        btnPrepay.className = "btn-unselected";
                        break;
                    case 2:
                        btnCash.className = "btn-unselected";
                        btnCard.className = "btn-selected";
                        btnPrepay.className = "btn-unselected";
                        break;
                    case 3:
                        btnCash.className = "btn-unselected";
                        btnPrepay.className = "btn-selected";
                        btnCard.className = "btn-unselected";
                        break;
                }

                for (let i = 0; i < buttons.length; i++) {
                    buttons[i].onclick = function () {
                        const url = "/orders/" + id;

                        const obj = {
                            "id": id,
                            "orderStatusId": this.value,
                            "riderId": riderId
                        };

                        const content = JSON.stringify(obj);

                        ajax(
                            url,
                            "PATCH",
                            () => {

                            },
                            content,
                            csrfHeader,
                            csrfToken
                        )
                    };

                    buttons[i].onsubmit = () => false;
                }

                windowModal.style.visibility = "visible";
            }
        )
    } catch (error) {
        console.log(error.message);
    }
};

const ids = [
    "orderStatusId1",
    "orderStatusId2",
    "orderStatusId3",
    "orderStatusId4",
    "orderStatusId5",
    "orderStatusId6"
];

const buttons = [];

for (let i = 0; i < ids.length; i++) {
    buttons[i] = document.getElementById(ids[i]);
}

const btnClose = document.getElementById("btn_close");
btnClose.onclick = () => {
    windowModal.style.visibility = "hidden";
};

const csrfToken = getMeta("_csrf");
const csrfHeader = getMeta("_csrf_header");