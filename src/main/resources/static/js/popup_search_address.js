import {getJSON} from './ajax.js'
import {$, createCol, createRow, formSerialize} from "./element.js"
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
                button.className = "enable-dong-container__button";

                button.innerHTML = dong["eubMyeonDong"];

                button.onclick = () => {
                    $("modal-address").value = dong["siDo"] + " " + dong["siGunGu"] + " " + dong["eubMyeonDong"];
                    $("modal-latitude").value = dong["latitude"];
                    $("modal-longitude").value = dong["longitude"];

                    searchAddress($("form-address"));
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
    $("address_modal").style.display = "inherit";

    loadEnableDong();
};

const consonantButtons = $("consonant-area").getElementsByTagName("button");

for (let i = 0; i < consonantButtons.length; i++) {
    consonantButtons[i].onclick = function () {
        $("consonant").value = this.value;
        loadEnableDong();
    };
}

const categoryButtons = $("category-list").getElementsByTagName("button");

for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].onclick = function () {
        $("category").value = this.innerHTML;

        searchAddress($("form-address"));
    };
}

const searchAddress = (form) => {
    const formData = new FormData(form);

    const address = formData.get("address") + $("category").value;
    formData.set("address", address);

    return getJSON("http://54.180.125.205:1111/address/get?" + formSerialize(formData)).then(
        obj => {
            const data = obj["data"];

            const container = $("address-result");
            container.innerHTML = '';

            for (let d of data) {
                const {title, road, jibun, x, y} = d;

                const cell = document.createElement('div');

                cell.innerHTML = '<div class="addr-contents-cell__contents-container">\n' +
                    '<div class="addr-contents-cell__road-addr">' + road + ' ' + title + '</div>\n' +
                    '<div class="addr-contents-cell__land-addr">\n' +
                    '<div class="addr-contents-cell__land-mark">지번</div>\n' +
                    jibun + '\n' +
                    '</div>\n' +
                    '</div>';

                cell.ondblclick = function () {
                    $("address-jibun").value = jibun;
                    $("jibun").value = jibun;
                    $("road").value = road;
                    $("latitude").value = x;
                    $("longitude").value = y;
                    $("distance").value = 0;
                    $("distance-factor").value = 0;

                    $("address_modal").style.display = "none";
                };

                const row = createRow(
                    [],
                    row => {
                        const col = createCol(
                            cell,
                            col => {
                                col.className = "addr-contents-cell";
                            }
                        );
                        row.appendChild(col);
                    }
                );

                container.appendChild(row);
            }
        }
    );
};

$("form-direct-search-address").onsubmit = function () {
    searchAddress(this);

    return false;
};

addCloseModalEvent("address_modal", "btn_close");