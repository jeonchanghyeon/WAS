import {getJSON} from './ajax.js'
import {$, formSerialize} from "./element.js"

//동 이름 불러오기
const loadEnableDong = () => {
    const formData = new FormData($("form_enable_area"));

    getJSON('/api/address/enable-dong?' + formSerialize(formData)).then(
        (obj) => {
            const container = $("enable_dong");
            const enableDongs = obj["enableDong"];

            container.innerHTML = "";

            for (let dong of enableDongs) {
                const button = document.createElement("button");

                button.innerHTML = dong["eubMyeonDong"];

                button.onclick = () => {
                    const jibun = dong["siDo"] + " " + dong["siGunGu"] + " " + dong["eubMyeonDong"];
                    alert(jibun);
                    $("jibun").value = jibun;
                };

                container.appendChild(button);
            }
        }
    ).catch((e) => {
        console.log(e);
    });
};

// $("form_address").onsubmit = searchAddress;

//건물명
const searchAddress = (userId, address) => {
    getJSON(`http://13.209.35.180:1547/address/get?userId=${userId}&address=${address}&searchType=1`).then(
        (obj) => {
            // const data = obj["data"];
            //
            // const address = $("address");
            // for (let i = 0; i < data.length; i++) {
            //     const tr = document.createElement("tr");
            //     for (let j = 0; j < 3; j++) {
            //         const td = document.createElement("td");
            //
            //         tr.appendChild(td);
            //     }
            //     tr.appendChild(address);
            // }

            console.log(obj);
        }
    ).catch((e) => {
        console.log(e);
    });
};

$("modal").onclick = (ev) => {
    if (ev.target.id === "modal") {
        modalClose();
    }
};

$("btn_close").onclick = () => {
    modalClose();
};

//TODO 외곽 클릭시 창 닫기

export const modalClose = () => {
    $("modal").style.display = "none";
};

export const modalOpen = (shopId) => {
    $("modal-shop-id").value = shopId;
    $("modal").style.display = "inherit";
};

const consonantArea = $("consonant-area");

const buttons = consonantArea.getElementsByTagName("button");

for (let i = 0; i < buttons.length; i++) {

    buttons[i].onclick = function () {
        $("consonant").value = this.value;
        loadEnableDong();
    };
}

$("form-jibun").onsubmit = function () {
    $("jibun").value += " " + $("jibun-detail").value;

    const formData = new FormData(this);

    const userId = 1;
    const address = formData.get("jibun");

    getJSON(`http://13.209.35.180:1547/address/get?userId=${userId}&address=${address}&searchType=1`).then(
        (obj) => console.log(obj)
    );

    return false;
};