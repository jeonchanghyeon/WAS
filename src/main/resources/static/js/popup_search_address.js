import {ajax, withGetMethod} from './ajax.js'

document.body.onload = loadDong;

//동 이름 불러오기
function loadDong() {
    const url = "/abce/ewe";

    const formEnableArea = document.getElementById("form_enable_area");
    const formData = new FormData(formEnableArea);

    withGetMethod(
        url,
        formData,
        (obj) => {
            try {
                const container = document.getElementById("enableArea");
                const enableDong = obj["enableDong"];

                container.innerHTML = "";

                for (let i = 0; i < enableDong.length; i++) {

                    const div = document.createElement("div");
                    const span = document.createElement("span");

                    span.innerHTML = enableDong[i]["eubMyeonDong"];

                    div.appendChild(span);
                    container.appendChild(div);
                }
            } catch (error) {
                console.log(error.message);
            }
        });
}


const formAddress = document.getElementById("form_address");

formAddress.onsubmit = searchAddress;

//건물명
function searchAddress() {
    let siGunGu;
    let eubMyeonDong;
    let siDo;

    const userId = "god";
    const address = siDo + " " + siGunGu + " " + eubMyeonDong;
    const pageIndex = 1;
    const searchType = 1;

    const url = "http://13.209.35.180:1547/address/get?" +
        "userId=${userId}&" +
        "address=${address}&" +
        "pageIndex=${index}&" +
        "searchType=${searchType}";

    ajax(
        url,
        "GET",
        (obj) => {
            try {
                const data = obj["data"];

                const address = document.getElementById("address");

                for (let i = 0; i < data.length; i++) {
                    const tr = document.createElement("tr");
                    for (let j = 0; j < 3; j++) {
                        const td = document.createElement("td");

                        tr.appendChild(td);
                    }
                    tr.appendChild(address);
                }

            } catch (error) {
                console.log(error.message);
            }
        }
    );

    return false;
}


const btnClose = document.getElementById("btn_close");

btnClose.onclick = () => {
    const windowModal = document.getElementById("modal");
    windowModal.style.visibility = "hidden";
};