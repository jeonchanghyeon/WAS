import {$, createRow} from "./element.js";
import {numberWithCommas} from "./format.js";
import {getJSON} from "./ajax.js";
import {addCloseModalEvent} from "./modal.js"

const selectButton = (key, map, selected, unselected) => {
    map.forEach(value => value.className = unselected);
    map.get(key).className = selected;
};

const createButton = (text, className, onClick) => {
    const btn = document.createElement("button");

    btn.innerHTML = text;
    btn.className = className;
    btn.onclick = onClick;

    return btn;
};

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

            $("deliveryCost").innerText = numberWithCommas(order["deliveryCost"]) + "원";
            $("extraCharge").innerText = numberWithCommas(extraCharge) + "원";
            $("addCost").innerText = numberWithCommas(addCost) + "원";
            $("sum").innerText = numberWithCommas(sum) + "원";

            selectButton(
                order["deliveryCostPaymentType"],
                new Map(
                    [
                        [1, $("aside_cash")],
                        [2, $("aside_point")]
                    ]
                ),
                "button button--empty-orange delivery-pay-buttons__button",
                "button button--empty-white delivery-pay-buttons__button"
            );

            $("shopName").innerText = order["shopName"];
            $("customerTel").innerText = order["customerTel"];
            $("memo").innerText = order["memo"];
            $("road").innerText = order["road"];
            $("jibun").innerText = order["jibun"];
            $("addressDetail").innerText = order["addressDetail"];

            $("riderName").innerText = order["riderName"];
            $("riderTel").innerText = order["riderTel"];

            $("menuPrice").innerText = numberWithCommas(order["menuPrice"]) + "원";
            $("additionalMenuPrice").innerText = numberWithCommas(order["additionalMenuPrice"]) + "원";
            $("totalPrice").innerText = numberWithCommas(order["additionalMenuPrice"] + order["menuPrice"]) + "원";
            $("cookTime").innerText = order["cookTime"] + "분";

            let buttonAttrib = null;

            switch (orderStatusId) {
                case 1:
                case 6:
                    buttonAttrib = [
                        {
                            "text": "주문수정",
                            "className": "button button--round button--empty-orange status-button-container__button"
                        },
                        {
                            "text": "추가접수",
                            "className": "button button--round button--empty-orange status-button-container__button"
                        },
                        {
                            "text": "배달기사배차",
                            "className": "button button--round status-button-container__button"
                        },
                        {
                            "text": "주문취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                    ];

                    break;
                case 2:
                    buttonAttrib = [
                        {
                            "text": "주문수정",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "추가접수",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "픽업",
                            "className": "button button--round status-button-container__button"
                        },
                        {
                            "text": "배달기사재배차",
                            "className": "button button--round status-button-container__button"
                        },
                        {
                            "text": "배차취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "주문취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        }
                    ];

                    break;
                case 3:
                    buttonAttrib = [
                        {
                            "text": "주문수정",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "추가접수",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "완료",
                            "className": "button button--round status-button-container__button"
                        },
                        {
                            "text": "배달기사재배차",
                            "className": "button button--round status-button-container__button"
                        },
                        {
                            "text": "주문취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "배차취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "주문취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        }
                    ];

                    break;
                case 4:
                    buttonAttrib = [
                        {
                            "text": "추가접수",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "주문취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                        {
                            "text": "완료취소",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                    ];

                    break;
                case 5:
                    buttonAttrib = [
                        {
                            "text": "추가접수",
                            "className": "button button--round button--empty-white status-button-container__button"
                        },
                    ];

                    break;
            }

            const container = $("asdf");
            container.innerHTML = '';
            console.log(container);

            for (let ba of buttonAttrib) {
                const btn = createButton(ba.text, ba.className);
                container.appendChild(btn);
            }

            selectButton(
                order["paymentType"],
                new Map(
                    [
                        [1, $("card")],
                        [2, $("cash")],
                        [3, $("prepay")]
                    ]
                ),
                "button button--empty-orange others-right-row__button",
                "button button--empty-white others-right-row__button"
            );

            const tableMenu = $("menu_table");
            const menus = order["menu"];

            tableMenu.innerHTML = "";

            const keys = ["", "label", "count", "price"];

            for (let menu of menus) {
                const texts = keys.map((key) => menu[key]);
                const row = createRow(texts);

                tableMenu.appendChild(row);
            }

            $("delivery_detail_modal").style.display = "inherit";
        }
    ).catch((e) => {
        console.log(e);
    });

    getJSON("/api/orders/" + id + "/logs").then(
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
                "newValue"
            ];

            for (let log of logs) {
                const texts = keys.map((key) => {
                    const value = log[key];
                    if (key === "createDate") {
                        return HHMM(value);
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

addCloseModalEvent("delivery_detail_modal", "btn_close");