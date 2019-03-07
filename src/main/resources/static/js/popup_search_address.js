import {getJSON} from './ajax.js'
import {$, createCol, createRow, formSerialize, getClosureToSelectButton} from "./element.js"
import {addCloseModalEvent} from "./modal.js";

export const modalOpen = (shopId) => {
    $("modal-shop-id").value = shopId;
    $("consonant").value = "0";

    getEnableDong(true).then(() => {
        $("address_modal").style.display = "inherit";
    });
};

const modalClose = (jibun, road, latitude, longitude) => () => {
    $("address-jibun").value = jibun;
    $("jibun").value = jibun;
    $("road").value = road;
    $("latitude").value = latitude;
    $("longitude").value = longitude;

    // TODO
    // const shopLatitude = $("shop-latitude").value;
    // const shopLongitude = $("shop-longitude").value;
    // const distance = Math.sqrt((x - shopLatitude) * (x - shopLatitude) + (y - shopLongitude) * (y - shopLongitude));

    const distance = 0;
    $("distance").value = distance;
    $("by-distance").value = distance + "km";

    $("address_modal").style.display = "none";
};

addCloseModalEvent("address_modal", "btn_close");

const getBookmarkList = () =>
    getBookmark().then(obj => new Set(obj["bookMark"].map(data => data["jibun"])));

const getBookmark = () => {
    const formData = new FormData($("form-bookmark"));
    return getJSON('http://54.180.125.205:1111/address/getBookMark?' + formSerialize(formData));
};

const getAddress = () => {
    const searchType = $("search-type").value;
    let form = null;

    if (searchType === '0') {
        form = $("form-address");
    } else if (searchType === '1') {
        form = $("form-direct-search-address");
    }

    const formData = new FormData(form);
    const address = formData.get("address") + $("categoryId").value;
    formData.set("address", address);
    return getJSON("http://54.180.125.205:1111/address/get?" + formSerialize(formData));
};

const getFirstChosung = (str) => {
    const chosung =
        ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
    const code = str.charCodeAt(0) - 44032;

    if (code > -1 && code < 11172) {
        return chosung[Math.floor(code / 588)];
    }

    return "";
};

//동 이름 불러오기
const getEnableDong = (isAll) => {
    const formData = new FormData($("form_enable_area"));

    return getJSON('/api/address/enable-dong?' + formSerialize(formData)).then(
        (obj) => {

            const enableDongs = obj["enableDong"];
            const container = $("enable_dong");
            container.innerHTML = "";

            if (isAll === true) {
                const button = document.createElement("button");

                button.className = "enable-dong-container__button";
                button.innerHTML = "전체";
                button.onclick = () => {
                    $("bookmark-address").value = $("modal-address").value = "";
                    $("modal-latitude").value = $("shop-latitude").value;
                    $("modal-longitude").value = $("shop-longitude").value;

                    requestByMethod();

                    selectDong(0);
                };

                container.appendChild(button);
            }

            for (let i = 0; i < enableDongs.length; i++) {
                const dong = enableDongs[i];
                const eubMyeonDong = dong["eubMyeonDong"];
                const button = document.createElement("button");

                button.className = "enable-dong-container__button";
                button.innerHTML = eubMyeonDong;
                button.onclick = () => {
                    $("bookmark-address").value = $("modal-address").value =
                        dong["siDo"] + " " + dong["siGunGu"] + " " + eubMyeonDong;
                    $("modal-latitude").value = dong["latitude"];
                    $("modal-longitude").value = dong["longitude"];

                    requestByMethod();

                    if (isAll === true) {
                        selectDong(i + 1);
                    } else {
                        selectDong(i);
                    }
                };

                container.appendChild(button);
            }

            const dongButtons = container.getElementsByTagName("button");
            const selectDong = getClosureToSelectButton(
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

const bookmarkCallback = obj => {
    const result = $("address-result");
    result.innerHTML = '';

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
        cell.ondblclick = modalClose(jibun, road, x, y);

        const col = createCol(cell);
        col.className = "addr-contents-cell";

        const row = createRow([]);
        row.appendChild(col);

        result.appendChild(row);
    }

};

const bookmarkListCallback = bookmark => getAddress().then(
    obj => {
        const data = obj["data"];

        const result = $("address-result");
        result.innerHTML = '';

        for (let d of data) {
            const {title, road, jibun, x, y, isKeyword} = d;

            const chosung = $("chosung").value;
            if (chosung !== "[]") {
                if ("[" + getFirstChosung(title) + "]" !== chosung) {
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
            cell.ondblclick = modalClose(jibun, road, x, y);

            const col = createCol(cell);
            col.className = "addr-contents-cell";

            const button = document.createElement('button');

            button.classList.add("star");
            if (bookmark.has(jibun) === false) {
                button.classList.add("star--empty");
            }
            const row = createRow([]);

            row.appendChild(col);
            row.appendChild(createCol(button));

            result.appendChild(row);
        }
    }
).then(selectDaumButton);

const selectBookmarkButton = () => {
    $("btn-bookmark").className = "fav-button fav-button--selected addr-sort__fav-button";
    $("btn-daum-search").className = "daum-button addr-sort__daum-button";
    $("method").value = "bookmark";
};

const selectDaumButton = () => {
    $("btn-bookmark").className = "fav-button addr-sort__fav-button";
    $("btn-daum-search").className = "daum-button daum-button--selected addr-sort__daum-button";
    $("method").value = "daum";
};

$("form-address").onsubmit = () => {
    $("chosung").value = "[]";
    $("search-type").value = 0;
    getBookmarkList().then(bookmarkListCallback);
    return false;
};

$("form-direct-search-address").onsubmit = function () {
    $("direct-latitude").value = $("shop-latitude").value;
    $("direct-longitude").value = $("shop-longitude").value;
    $("search-type").value = 1;
    getBookmarkList().then(bookmarkListCallback);
    return false;
};

$("form-bookmark").onsubmit = () => {
    getBookmark().then(bookmarkCallback).then(selectBookmarkButton);
    return false;
};

const consonantButtons = $("consonant-area").getElementsByTagName("button");

const selectConsonant = getClosureToSelectButton(
    consonantButtons,
    'consonant-container__button consonant-container__button--selected',
    'consonant-container__button'
);

for (let i = 0; i < consonantButtons.length; i++) {
    consonantButtons[i].onclick = function () {
        $("consonant").value = this.value;
        const isAll = (i === 0);
        getEnableDong(isAll).then(
            () => {
                selectConsonant(i);
            }
        );
    };
}

const requestByMethod = () => {
    const method = $("method").value;
    if (method === "bookmark") {
        getBookmark().then(bookmarkCallback).then(selectBookmarkButton);
    } else if (method === "daum") {
        getBookmarkList().then(bookmarkListCallback);
    }
};

const categoryButtons = $("category-list").getElementsByTagName("button");

const selectCategory = getClosureToSelectButton(
    categoryButtons,
    'building-container__button building-container__button--selected',
    'building-container__button'
);

for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].onclick = function () {
        $("categoryId").value = this.value;
        requestByMethod();
        selectCategory(i);
    };
}

const chosungButtons =
    $("chosung-buttons-area").getElementsByClassName("select-consonant-container__button");

for (let cb of chosungButtons) {
    cb.onclick = function () {
        $("chosung").value = "[" + this.value + "]";
        requestByMethod();
    }
}