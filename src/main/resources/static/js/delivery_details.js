import {$, createRow} from "./element.js";
import {HHMM, numberWithCommas} from "./format.js";
import {ajax, getJSON, setCSRFHeader} from "./ajax.js";
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

const setOrderStatus = (id, orderStatusId, riderId) => {
    ajax(
        "/api/orders/" + id,
        "PATCH",
        JSON.stringify({id, orderStatusId, riderId}),
        setCSRFHeader
    );
};

export const loadDetail = (id, group) => {
    getJSON("/api/orders/" + id).then(
        (obj) => {
            const order = obj["order"];

            const orderId = order["id"];
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
            $("distribName").innerText = order["distribName"];

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

            $("createTime").innerHTML = HHMM(order["createDate"]);
            $("allocateTime").innerHTML = HHMM(order["allocateDate"]);
            $("pickupTime").innerHTML = HHMM(order["pickupDate"]);
            $("completeTime").innerHTML = HHMM(order["completeDate"]);

            const arr = [
                "createTime",
                "allocateTime",
                "pickupTime",
                "completeTime"
            ];

            for (let i = 0; i < 4; i++) {
                if (i + 1 === orderStatusId) {
                    $(arr[i]).parentElement.className = "current-status current-status--orange";
                } else {
                    $(arr[i]).parentElement.className = "current-status current-status--normal";
                }
            }

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

            if (group > 2) {
                const buttonAttrib = [];

                const emptyOrangeButton = "button button--round button--empty-orange status-button-container__button";
                const emptyButton = "button button--round button--empty-white status-button-container__button";
                const orangeButton = "button button--round status-button-container__button";

                switch (orderStatusId) {
                    case 1:
                    case 6:
                        // 접수, 대기
                        buttonAttrib.push({
                            "text": "주문수정",
                            "className": emptyOrangeButton,
                        });
                        buttonAttrib.push({"text": "추가접수", "className": emptyOrangeButton});
                        if (group !== 3) {
                            buttonAttrib.push({
                                "text": "배달기사배차",
                                "className": orangeButton,
                                "onclick": () => setOrderStatus(orderId, 4)
                            });
                        }
                        buttonAttrib.push({
                            "text": "주문취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 5)
                        });
                        break;
                    case 2:
                        // 배차
                        buttonAttrib.push({
                            "text": "주문수정",
                            "className": emptyOrangeButton,
                        });
                        buttonAttrib.push({
                            "text": "추가접수",
                            "className": emptyOrangeButton,
                        });
                        if (group !== 3) {
                            buttonAttrib.push({
                                "text": "픽업",
                                "className": orangeButton,
                                "onclick": () => setOrderStatus(orderId, 3)
                            });
                            buttonAttrib.push({
                                "text": "배달기사배차",
                                "className": orangeButton,
                                "onclick": () => setOrderStatus(orderId, 2)
                            });
                        }
                        buttonAttrib.push({
                            "text": "배차취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 1)
                        });
                        buttonAttrib.push({
                            "text": "주문취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 5)
                        });

                        break;
                    case 3:
                        // 픽업
                        buttonAttrib.push({
                            "text": "주문수정",
                            "className": emptyOrangeButton,
                        });
                        buttonAttrib.push({
                            "text": "추가접수",
                            "className": emptyOrangeButton,
                        });
                        if (group !== 3) {
                            buttonAttrib.push({
                                "text": "완료",
                                "className": orangeButton,
                                "onclick": () => setOrderStatus(orderId, 4)
                            });
                            buttonAttrib.push({
                                "text": "배달기사재배차",
                                "className": orangeButton,
                                "onclick": () => setOrderStatus(orderId, 2)
                            });
                        }
                        buttonAttrib.push({
                            "text": "주문취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 5)
                        });
                        buttonAttrib.push({
                            "text": "배차취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 1)
                        });
                        buttonAttrib.push({
                            "text": "픽업취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 2)
                        });
                        break;
                    case 4:
                        // 완료
                        buttonAttrib.push({
                            "text": "추가접수",
                            "className": emptyOrangeButton,
                        });
                        buttonAttrib.push({
                            "text": "주문취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 5)
                        });
                        buttonAttrib.push({
                            "text": "완료취소",
                            "className": emptyButton,
                            "onclick": () => setOrderStatus(orderId, 3)
                        });
                        break;
                    case 5:
                        // 취소
                        buttonAttrib.push({
                            "text": "추가접수",
                            "className": emptyOrangeButton,
                        });
                        break;
                }

                const container = $("asdf");
                container.innerHTML = '';

                for (let ba of buttonAttrib) {
                    const btn = createButton(ba.text, ba.className, ba.onclick);
                    container.appendChild(btn);
                }
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
            const menu = order["menu"];

            tableMenu.innerHTML = "";

            const keys = ["label", "count", "price"];

            for (let i = 0; i < menu.length; i++) {
                const texts = keys.map((key) => menu[i][key]);
                texts.unshift(i + 1);
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
