import {getJSON} from './ajax.js'
import {$, createCol, createRow, formSerialize} from "./element.js"
import {addCloseModalEvent} from "./modal.js";

const getFirstChosung = (str) => {
    const cho = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const code = str.charCodeAt(0) - 44032;

    if (code > -1 && code < 11172) {
        return cho[Math.floor(code / 588)];
    }

    return "";
};

const selectButton = (buttons, selected, unselected) => {
    return (index) => {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].className = (i === index) ? selected : unselected;
        }
    };
};

//동 이름 불러오기
const loadEnableDong = (isAll) => {
    const formData = new FormData($("form_enable_area"));

    return getJSON('/api/address/enable-dong?' + formSerialize(formData)).then(
        (obj) => {
            const container = $("enable_dong");
            const enableDongs = obj["enableDong"];

            container.innerHTML = "";

            if (isAll === true) {
                const button = document.createElement("button");
                button.className = "enable-dong-container__button";
                button.innerHTML = "전체";
                button.onclick = function () {

                    $("modal-address").value = "";
                    $("modal-latitude").value = $("shop-latitude").value;
                    $("modal-longitude").value = $("shop-longitude").value;

                    selectDong(0);
                };

                container.appendChild(button);
            }

            for (let i = 0; i < enableDongs.length; i++) {
                const dong = enableDongs[i];
                const button = document.createElement("button");

                button.className = "enable-dong-container__button";
                button.innerHTML = dong["eubMyeonDong"];
                button.onclick = function () {
                    $("bookmark-address").value = $("modal-address").value = dong["siDo"] + " " + dong["siGunGu"] + " " + dong["eubMyeonDong"];
                    $("modal-latitude").value = dong["latitude"];
                    $("modal-longitude").value = dong["longitude"];

                    if (isAll === true) {
                        selectDong(i + 1);
                    } else {
                        selectDong(i);
                    }
                };

                container.appendChild(button);
            }

            const dongButtons = container.getElementsByTagName("button");

            const selectDong = selectButton(
                dongButtons,
                'enable-dong-container__button enable-dong-container__button--selected',
                'enable-dong-container__button'
            );

            if (isAll === true) {
                selectDong(0);
            }
        }
    ).catch((e) => {
        console.log(e);
    });
};

export const modalOpen = (shopId) => {
    $("modal-shop-id").value = shopId;
    $("consonant").value = "0";

    loadEnableDong(true).then(
        () => {
            $("address_modal").style.display = "inherit";
        }
    );
};

const consonantButtons = $("consonant-area").getElementsByTagName("button");

const selectConsonant = selectButton(
    consonantButtons,
    'consonant-container__button consonant-container__button--selected',
    'consonant-container__button'
);

for (let i = 0; i < consonantButtons.length; i++) {
    consonantButtons[i].onclick = function () {
        $("consonant").value = this.value;
        const isAll = (i === 0);

        loadEnableDong(isAll).then(
            () => {
                selectConsonant(i);
            }
        );
    };
}

const categoryButtons = $("category-list").getElementsByTagName("button");

const selectCategory = selectButton(
    categoryButtons,
    'building-container__button building-container__button--selected',
    'building-container__button'
);

for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].onclick = function () {
        $("categoryId").value = this.value;
        selectCategory(i);
    };
}


$("btn-bookmark").onclick = () => {
    $("btn-bookmark").className = "fav-button fav-button--selected addr-sort__fav-button";
    $("btn-daum-search").className = "daum-button addr-sort__daum-button";
};

$("btn-daum-search").onclick = () => {
    $("btn-bookmark").className = "fav-button addr-sort__fav-button";
    $("btn-daum-search").className = "daum-button daum-button--selected addr-sort__daum-button";
};

$("form-address").onsubmit = function () {
    searchAddress(this);

    return false;
};

const searchAddress = (form) => {
    console.log($("method"));
    $("method").value = "daum";
    const formData = new FormData(form);
    const address = formData.get("address") + $("categoryId").value;

    formData.set("address", address);

    return getJSON("http://54.180.125.205:1111/address/get?" + formSerialize(formData)).then(
        obj => {
            const data = obj["data"];

            const container = $("address-result");
            container.innerHTML = '';

            for (let d of data) {
                const {title, road, jibun, x, y, isKeyword} = d;

                const cell = document.createElement('div');

                const div = document.createElement('div');
                div.className = "addr-contents-cell__contents-container";
                div.innerHTML =
                    '<div class="addr-contents-cell__road-addr">' + road + ' ' + title + '</div>\n' +
                    '<div class="addr-contents-cell__land-addr">\n' +
                    '<div class="addr-contents-cell__land-mark">지번</div>\n' +
                    jibun + '\n' +
                    '</div>';

                if (isKeyword === true) {
                    div.classList.add("addr-contents-cell__contents-container--flag");
                }

                cell.appendChild(div);

                cell.ondblclick = function () {
                    $("address-jibun").value = jibun;
                    $("jibun").value = jibun;
                    $("road").value = road;
                    $("latitude").value = x;
                    $("longitude").value = y;

                    const shopLatitude = $("shop-latitude").value;
                    const shopLongitude = $("shop-longitude").value;

                    // const distance = Math.sqrt((x - shopLatitude) * (x - shopLatitude) + (y - shopLongitude) * (y - shopLongitude));
                    const distance = 0;
                    $("distance").value = distance;
                    $("by-distance").value = distance + "km";

                    $("address_modal").style.display = "none";
                };

                const col = createCol(cell);
                col.className = "addr-contents-cell";

                const button = document.createElement('button');

                button.classList.add("star");
                button.classList.add("star--empty");

                const row = createRow([]);

                row.appendChild(col);
                row.appendChild(createCol(button));

                container.appendChild(row);
            }
        }
    );
};

$("form-direct-search-address").onsubmit = function () {
    searchAddress(this);

    return false;
};

const chosungButtons = $("chosung-buttons-area").getElementsByClassName("select-consonant-container__button");

const getBookmark = () => {
    console.log($("method"));
    $("method").value = "bookmark";
    const formData = new FormData($("form-bookmark"));
    const address = formData.get("address") + $("categoryId").value;

    formData.set("address", address);

    getJSON('http://54.180.125.205:1111/address/getBookMark?' + formSerialize(formData)).then(
        obj => {
            const container = $("address-result");
            container.innerHTML = '';

            const bookmark = obj["bookMark"];

            for (let bm of bookmark) {
                const {title, road, jibun, x, y} = bm;

                const cell = document.createElement('div');

                cell.innerHTML =
                    '<div class="addr-contents-cell__road-addr">' + road + ' ' + title + '</div>\n' +
                    '<div class="addr-contents-cell__land-addr">\n' +
                    '<div class="addr-contents-cell__land-mark">지번</div>\n' +
                    jibun + '\n' +
                    '</div>';

                cell.ondblclick = function () {
                    $("address-jibun").value = jibun;
                    $("jibun").value = jibun;
                    $("road").value = road;
                    $("latitude").value = x;
                    $("longitude").value = y;

                    const shopLatitude = $("shop-latitude").value;
                    const shopLongitude = $("shop-longitude").value;

                    // const distance = Math.sqrt((x - shopLatitude) * (x - shopLatitude) + (y - shopLongitude) * (y - shopLongitude));
                    const distance = 0;
                    $("distance").value = distance;
                    $("by-distance").value = distance + "km";

                    $("address_modal").style.display = "none";
                };

                const col = createCol(cell);
                col.className = "addr-contents-cell";

                const row = createRow([]);
                row.appendChild(col);

                container.appendChild(row);
            }
        }
    );
};

for (let cb of chosungButtons) {
    cb.onclick = function () {
        if ($("method").value === "bookmark") {
            $("chosung").value = "[" + this.value + "]";
            getBookmark();
        } else if ($("method").value === "daum") {
            const chosung = this.value;
            const formData = new FormData($("form-address"));
            const address = formData.get("address") + $("categoryId").value;

            formData.set("address", address);

            return getJSON("http://54.180.125.205:1111/address/get?" + formSerialize(formData)).then(
                obj => {
                    const data = obj["data"];

                    const container = $("address-result");
                    container.innerHTML = '';

                    for (let d of data) {
                        const {title, road, jibun, x, y, isKeyword} = d;

                        if (chosung !== "") {
                            if (getFirstChosung(title) !== chosung) {
                                continue;
                            }
                        }

                        const cell = document.createElement('div');

                        const div = document.createElement('div');
                        div.className = "addr-contents-cell__contents-container";
                        div.innerHTML =
                            '<div class="addr-contents-cell__road-addr">' + road + ' ' + title + '</div>\n' +
                            '<div class="addr-contents-cell__land-addr">\n' +
                            '<div class="addr-contents-cell__land-mark">지번</div>\n' +
                            jibun + '\n' +
                            '</div>';

                        if (isKeyword === true) {
                            div.classList.add("addr-contents-cell__contents-container--flag");
                        }

                        cell.appendChild(div);

                        cell.ondblclick = function () {
                            $("address-jibun").value = jibun;
                            $("jibun").value = jibun;
                            $("road").value = road;
                            $("latitude").value = x;
                            $("longitude").value = y;

                            const shopLatitude = $("shop-latitude").value;
                            const shopLongitude = $("shop-longitude").value;

                            // const distance = Math.sqrt((x - shopLatitude) * (x - shopLatitude) + (y - shopLongitude) * (y - shopLongitude));
                            const distance = 0;
                            $("distance").value = distance;
                            $("by-distance").value = distance + "km";

                            $("address_modal").style.display = "none";
                        };

                        const col = createCol(cell);
                        col.className = "addr-contents-cell";

                        const button = document.createElement('button');

                        button.classList.add("star");
                        button.classList.add("star--empty");

                        const row = createRow([]);

                        row.appendChild(col);
                        row.appendChild(createCol(button));

                        container.appendChild(row);
                    }
                }
            );
        }
    }
}

$("form-bookmark").onsubmit = () => {
    getBookmark();

    return false;
};

addCloseModalEvent("address_modal", "btn_close");