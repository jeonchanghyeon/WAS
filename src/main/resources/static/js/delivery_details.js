function ajax(url, method, func, content = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);


    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            try {
                const obj = JSON.parse(this.responseText);
                console.log(obj);
                func(obj);
            } catch (error) {
            }
        }
    };

    xhr.send(content)
}

function onload() {
    try {
        const id = 1667
        const url = "/orders/" + id

        ajax(url, "GET", function (obj) {
                const order = obj["order"];


                document.getElementById("deliveryCost").innerText = order["deliveryCost"];
                document.getElementById("distance").innerText = order["distance"];
                document.getElementById("shopName").innerText = order["shopName"];
                document.getElementById("memo").innerText = order["memo"];
                document.getElementById("riderName").innerText = order["riderName"];
                document.getElementById("riderTel").innerText = order["riderTel"];
                document.getElementById("startingTel").innerText = order["startingTel"];
                document.getElementById("startingRoad").innerText = order["startingRoad"];
                document.getElementById("customerTel").innerText = order["customerTel"];
                document.getElementById("road").innerText = order["road"];
                document.getElementById("orderAutoCancelTime").innerText = order["orderAutoCancelTime"];
                document.getElementById("cookTime").innerText = order["cookTime"];


                const menu = order["menu"];

                for (let i = 0; i < menu.length; i++) {
                    menu[i]["price"]
                    menu[i]["counts"]
                    menu[i]["label"]
                }


                const paymentType = order["paymentType"];
                const deliveryCostPaymentType = order["deliveryCostPaymentType"];

                const orderStatusId = order["orderStatusId"];

                console.log("상태 : " + orderStatusId);
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

            }
        )
    } catch (error) {
        console.log(error.message);
    }
}