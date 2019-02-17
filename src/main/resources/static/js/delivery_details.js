import {$, createRow} from "./element.js";
import {HHMM} from "./format.js";
import {getJSON} from "./ajax.js";

export const loadDetail = (id) => {
    getJSON("/api/orders/" + id).then(
        (obj) => {
            const order = obj["order"];
            const riderId = order["riderId"];
            const orderStatusId = order["orderStatusId"];

            let sum = order["additionalCost"]
                .map((data) => data["cost"])
                .reduce((sum, number) => sum + number, 0);

            const addCost = order["additionalCost"]
                .find((data) => data["label"].toString() === "추가대행료")
                ["cost"];

            const extraCharge = sum - addCost;

            sum += order["deliveryCost"];

            $("distance").innerText = order["distance"] + "km";
            $("branchName").innerText = order["branchName"];

            $("deliveryCost").innerText = order["deliveryCost"] + "원";
            $("extraCharge").innerText = extraCharge + "원";
            $("addCost").innerText = addCost + "원";
            $("sum").innerText = sum + "원";

            const dcpayment = [$("aside_cash"), $("aside_point")];

            for (let i = 0; i < dcpayment.length; i++) {
                if (order["deliveryCostPaymentType"] - 1 === i) {
                    dcpayment[i].className = "aside-btn-selected";
                } else {
                    dcpayment[i].className = "aside-btn-unselected";
                }
            }

            $("shopName").innerText = order["shopName"];
            $("customerTel").innerText = order["customerTel"];
            $("memo").innerText = order["memo"];
            // $("road").innerText = order["road"];

            $("riderName").innerText = order["riderName"];
            // $("riderTel").innerText = order["riderTel"];

            $("menuPrice").innerText = order["menuPrice"] + "원";
            $("additionalMenuPrice").innerText = order["additionalMenuPrice"] + "원";
            $("totalPrice").innerText = order["additionalMenuPrice"] + order["menuPrice"] + "원";
            $("cookTime").innerText = order["cookTime"] + "분";

            const btns = [$("card"), $("cash"), $("prepay")];

            const paymentType = order["paymentType"];

            for (let i = 0; i < btns.length; i++) {
                if (i === paymentType - 1) {
                    btns[i].className = "pay-type-color-button";
                } else {
                    btns[i].className = "pay-type-default-button";
                }
            }

            const tableMenu = $("menu_table");
            const menus = order["menu"];

            tableMenu.innerHTML = "";

            const keys = ["", "label", "count", "price"];

            for (let menu of menus) {
                const texts = keys.map((key) => menu[key]);
                const row = createRow(texts);

                tableMenu.appendChild(row);
            }

            $("modal").style.display = "inherit";
        }
    ).catch((e) => {
        console.log(e);
    });

    getJSON("/api/orders/" + id + "/logs")
        .then(
        (obj) => {
            const logs = obj["logs"];
            const tableLog = $("log-table");

            tableLog.innerHTML = "";

            const keys = [
                "id",
                "createDate",
                "logType",
                "name",
                "oldValue",
                "newValue"];

            for (let log of logs) {
                const texts = keys.map((key) => {
                    const value = log[key];
                    if (key === "createDate") {
                        return HHMM(new Date(value));
                    } else {
                        return value;
                    }
                });

                const row = createRow(texts);

                tableLog.appendChild(row);
            }
        }
    ).catch((e) => {
        console.log(e);
    });
};

const buttons = [
    "orderStatusId1", "orderStatusId2", "orderStatusId3",
    "orderStatusId4", "orderStatusId5", "orderStatusId6"
].map((data) => $(data));

$("btn_close").onclick = () => {
    $("modal").style.display = "none";
};