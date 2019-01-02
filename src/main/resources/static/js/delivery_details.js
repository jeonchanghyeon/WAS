import {ajax} from './ajax.js'

let id = null;

document.body.onload = () => {
    try {
        id = document.getElementById("ordersId").value;
        const url = "/orders/" + id;

        ajax(url, "GET", (obj) => {
                const order = obj["order"];

                document.getElementById("distance").innerText = order["distance"] + "km";
                document.getElementById("branchName").innerText = order["branchName"];

                document.getElementById("deliveryCost").innerText = order["deliveryCost"];

                const deliveryCostPaymentType = order["deliveryCostPaymentType"];

                switch (deliveryCostPaymentType) {
                    case 1:
                        document.getElementById("aside_cash").className = "aside_btn_selected";
                        document.getElementById("aside_point").className = "aside_btn_unselected";
                        break;
                    case 2:
                        document.getElementById("aside_cash").className = "aside_btn_unselected";
                        document.getElementById("aside_point").className = "aside_btn_selected";
                        break;
                }

                const orderStatusId = order["orderStatusId"];

                switch (orderStatusId) {
                    case 1:
                        document.getElementById("statusBar").src = "/img/status_bar4.png";
                        break;
                    case 2:
                        document.getElementById("statusBar").src = "/img/status_bar3.png";
                        break;
                    case 3:
                        document.getElementById("statusBar").src = "/img/status_bar2.png";
                        break;
                    case 4:
                        document.getElementById("statusBar").src = "/img/status_bar1.png";
                        break;
                }

                document.getElementById("shopName").innerText = order["shopName"];
                document.getElementById("startingTel").innerText = order["startingTel"];
                document.getElementById("startingRoad").innerText = order["startingRoad"];

                document.getElementById("riderName").innerText = order["riderName"];
                document.getElementById("riderTel").innerText = order["riderTel"];

                document.getElementById("customerTel").innerText = order["customerTel"];
                document.getElementById("road").innerText = order["road"];
                document.getElementById("memo").innerText = order["memo"];

                const menu = order["menu"];

                const menuTable = document.getElementById("menu_table");
                menuTable.innerHTML = "";

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
                    menuTable.appendChild(row);
                }

                document.getElementById("menuPrice").innerText = order["menuPrice"] + "원";
                document.getElementById("additionalMenuPrice").innerText = order["additionalMenuPrice"] + "원";
                document.getElementById("totalPrice").innerText = order["additionalMenuPrice"] + order["menuPrice"] + "원";

                document.getElementById("orderAutoCancelTime").innerText = order["orderAutoCancelTime"] + "분";
                document.getElementById("cookTime").innerText = order["cookTime"] + "분";

                const paymentType = order["paymentType"];

                switch (paymentType) {
                    case 1:
                        document.getElementById("cash").className = "btn_selected";
                        document.getElementById("card").className = "btn_unselected";
                        document.getElementById("prepay").className = "btn_unselected";
                        break;
                    case 2:
                        document.getElementById("cash").className = "btn_unselected";
                        document.getElementById("card").className = "btn_selected";
                        document.getElementById("prepay").className = "btn_unselected";
                        break;
                    case 3:
                        document.getElementById("cash").className = "btn_unselected";
                        document.getElementById("prepay").className = "btn_selected";
                        document.getElementById("card").className = "btn_unselected";
                        break;
                }
            }
        )
    } catch (error) {
        console.log(error.message);
    }
};

document.getElementById("changeStatus").onsubmit = () => {
    try {
        const url = "orders/" + id;
        const formData = new FormData(this);

        let jsonObject = {};
        for (const [key, value]  of formData.entries()) {
            jsonObject[key] = value;
        }

        ajax(url, "PATCH");
    } catch (error) {
        console.log(error.message);
    }

    return false;
};