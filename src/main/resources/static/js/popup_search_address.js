import {ajax, getJSON} from './ajax.js'
import {$, createRow, formSerialize} from "./element.js"
import {addCloseModalEvent} from "./modal.js";

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
                    const address = dong["siDo"] + " " + dong["siGunGu"] + " " + dong["eubMyeonDong"];
                    console.log(address);

                    searchAddress({
                        address: address,
                        latitude: 0,
                        longitude: 0,
                    })
                };

                container.appendChild(button);
            }
        }
    ).catch((e) => {
        console.log(e);
    });
};

export const modalOpen = (shopId) => {
    $("modal-shop-id").value = shopId;
    $("modal").style.display = "inherit";

    loadEnableDong();
};

const consonantArea = $("consonant-area");

const buttons = consonantArea.getElementsByTagName("button");

for (let i = 0; i < buttons.length; i++) {

    buttons[i].onclick = function () {
        $("consonant").value = this.value;
        loadEnableDong();
    };
}

const searchAddress = (
    {
        pageIndex = 1,
        limitCount = 15,
        address,
        latitude,
        longitude,
        searchType = 4
    }) => {

    const url = "http://13.209.35.180:1111/address/get.json?" +
        "pageIndex=" + pageIndex + "&" +
        "limitCount=" + limitCount + "&" +
        "address=" + address + "&" +
        "latitude=" + latitude + "&" +
        "longitude=" + longitude + "&" +
        "searchType=" + searchType;

    ajax(
        url,
        "GET",
        null,
        xhr => {
            xhr.withCredentials = true;
        }
    ).then(
        res => {
            const obj = JSON.parse(res);
            const container = $("address-result");
            for (let o of obj) {
                const {
                    road,
                    x,
                    y,
                    jibun,
                    title
                } = o;

                const row = createRow([
                    "",
                    title,
                    jibun,
                    road,
                ]);

                container.appendChild(row);
            }
        }
    );
};

addCloseModalEvent("modal", "btn_close");