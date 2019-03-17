import {getJSON} from './ajax.js';
import {$, createCol, createRow, formSerialize, getClosureToSelectButton} from './element.js';
import {addCloseModalEvent} from './modal.js';
import {createMarker, getDistance, initMap, removeMarkers, setMarkerCenter} from './naver.js';

const map = initMap();
let deliveryCostSum = 0;
let extraCharge = null;

export const getDeliveryCostSum = () => deliveryCostSum;
export const getExtraChargeValue = () => extraCharge;

const ADDRESS_API_URL = 'http://54.180.125.205:1111';
const markers = [];

const getBookmark = () => {
    const formData = new FormData($('form-bookmark'));
    return getJSON(`${ADDRESS_API_URL}/address/getBookMark?${formSerialize(formData)}`);
};

const getCost = (shopId) => {
    const formData = new FormData($('form-cost'));
    getJSON(`/api/shops/${shopId}/delivery-cost?${formSerialize(formData)}`).then((obj) => {
        ({deliveryCostSum, extraCharge} = obj);
        const {deliveryCost} = obj;

        $('delivery-cost').value = deliveryCost;
        $('extra-charge').value = `${deliveryCostSum}원`;
    });
};

const modalClose = (jibun, road, latitude, longitude) => () => {
    $('address-jibun').value = jibun;
    $('cost-jibun').value = jibun;
    $('jibun').value = jibun;
    $('road').value = road;
    $('latitude').value = latitude;
    $('longitude').value = longitude;

    const shopLatitude = parseFloat($('shop-latitude').value);
    const shopLongitude = parseFloat($('shop-longitude').value);

    const dstLatitude = parseFloat(latitude);
    const dstLongitude = parseFloat(longitude);

    const distance = getDistance(map,
        {
            Latitude: shopLatitude,
            Longitude: shopLongitude,
        },
        {
            Latitude: dstLatitude,
            Longitude: dstLongitude,
        });

    $('cost-distance').value = distance;
    $('distance').value = distance;
    $('by-distance').value = `${distance}km`;

    $('address_modal').style.display = 'none';

    const shopId = $('shopId').value;
    getCost(shopId);

    removeMarkers(markers);

    const marker = createMarker({
        map,
        position: {
            latitude: dstLatitude,
            longitude: dstLongitude,
        },
        icon: '/img/marker-shop.png',
    });

    markers.push(marker);

    setMarkerCenter(map, markers);
};

const bookmarkCallback = (obj) => {
    const result = $('address-result');
    result.innerHTML = '';

    const bookmark = obj['bookMark'];

    bookmark.forEach((bm) => {
        const {
            title, road, jibun, x, y,
        } = bm;

        const cell = document.createElement('div');

        cell.innerHTML = `<div class="addr-contents-cell__road-addr">${road} ${title}</div>\n`
            + '<div class="addr-contents-cell__land-addr">\n'
            + `<div class="addr-contents-cell__land-mark">지번</div>\n${
                jibun}\n`
            + '</div>';
        cell.ondblclick = modalClose(jibun, road, y, x);

        const col = createCol(cell);
        col.className = 'addr-contents-cell';

        const row = createRow([]);
        row.appendChild(col);

        result.appendChild(row);
    });
};

const getBookmarkList = () => getBookmark().then(obj => new Set(obj['bookMark'].map(data => data['jibun'])));

const selectBookmarkButton = () => {
    $('btn-bookmark').className = 'fav-button fav-button--selected addr-sort__fav-button';
    $('btn-daum-search').className = 'daum-button addr-sort__daum-button';
    $('method').value = 'bookmark';
};

const selectDaumButton = () => {
    $('btn-bookmark').className = 'fav-button addr-sort__fav-button';
    $('btn-daum-search').className = 'daum-button daum-button--selected addr-sort__daum-button';
    $('method').value = 'daum';
};

const getFirstChosung = (str) => {
    const chosung = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
    const code = str.charCodeAt(0) - 44032;

    if (code > -1 && code < 11172) {
        return chosung[Math.floor(code / 588)];
    }

    return '';
};

const getAddress = () => {
    const searchType = $('search-type').value;
    let form = null;

    if (searchType === '0') {
        form = $('form-address');
    } else if (searchType === '1') {
        form = $('form-direct-search-address');
    }

    const formData = new FormData(form);
    const address = formData.get('address') + $('categoryId').value;
    formData.set('address', address);
    return getJSON(`${ADDRESS_API_URL}/address/get?${formSerialize(formData)}`);
};

const bookmarkListCallback = bookmark => getAddress().then((obj) => {
    const {data} = obj;

    const result = $('address-result');
    result.innerHTML = '';

    data.forEach((d) => {
        const {
            title, road, jibun, x, y, isKeyword,
        } = d;

        const chosung = $('chosung').value;
        if (chosung === '[]' || `[${getFirstChosung(title)}]` === chosung) {
            const cell = document.createElement('div');

            const div = document.createElement('div');
            div.className = 'addr-contents-cell__contents-container';
            div.innerHTML = `<div class="addr-contents-cell__road-addr">${road} ${title}</div>\n`
                + '<div class="addr-contents-cell__land-addr">\n'
                + `<div class="addr-contents-cell__land-mark">지번</div>\n${
                    jibun}\n`
                + '</div>';

            if (isKeyword === true) {
                div.classList.add('addr-contents-cell__contents-container--flag');
            }

            cell.appendChild(div);
            cell.ondblclick = modalClose(jibun, road, y, x);

            const col = createCol(cell);
            col.className = 'addr-contents-cell';

            const row = createRow([]);
            row.appendChild(col);

            result.appendChild(row);
        }
    });
}).then(selectDaumButton);

const requestByMethod = () => {
    const method = $('method').value;
    if (method === 'bookmark') {
        getBookmark().then(bookmarkCallback).then(selectBookmarkButton);
    } else if (method === 'daum') {
        getBookmarkList().then(bookmarkListCallback);
    }
};

// 동 이름 불러오기
const getEnableDong = (isAll) => {
    const formData = new FormData($('form_enable_area'));

    return getJSON(`/api/address/enable-dong?${formSerialize(formData)}`).then((obj) => {
        const {enableDong} = obj;
        // const enableDongs = obj['enableDong'];
        const container = $('enable_dong');
        container.innerHTML = '';

        let selectDong = null;

        if (isAll === true) {
            const button = document.createElement('button');

            button.className = 'enable-dong-container__button';
            button.innerHTML = '전체';
            button.onclick = () => {
                $('bookmark-address').value = $('modal-address').value = '';
                $('modal-latitude').value = $('shop-latitude').value;
                $('modal-longitude').value = $('shop-longitude').value;

                requestByMethod();

                selectDong(0);
            };

            container.appendChild(button);
        }

        const btnOnclick = (index, siDo, siGunGu, eubMyeonDong, latitude, longitude) => () => {
            $('bookmark-address').value = $('modal-address').value = `${siDo} ${siGunGu} ${eubMyeonDong}`;
            $('modal-latitude').value = latitude;
            $('modal-longitude').value = longitude;

            requestByMethod();

            if (isAll === true) {
                selectDong(index + 1);
            } else {
                selectDong(index);
            }
        };

        for (let i = 0; i < enableDong.length; i++) {
            const dong = enableDong[i];

            const {
                siDo, siGunGu, eubMyeonDong,
                latitude, longitude,
            } = dong;

            const button = document.createElement('button');

            button.className = 'enable-dong-container__button';
            button.innerHTML = eubMyeonDong;
            button.onclick = btnOnclick(i, siDo, siGunGu, eubMyeonDong, latitude, longitude);

            container.appendChild(button);
        }

        const dongButtons = container.getElementsByTagName('button');
        selectDong = getClosureToSelectButton(dongButtons,
            'enable-dong-container__button enable-dong-container__button--selected',
            'enable-dong-container__button');

        if (isAll === true) {
            selectDong(0);
        }
    });
};

export const modalOpen = (shopId) => {
    $('modal-shop-id').value = shopId;
    $('consonant').value = '0';

    getEnableDong(true).then(() => {
        $('address_modal').style.display = 'inherit';
    });
};

addCloseModalEvent('address_modal', 'btn_close');

$('form-address').onsubmit = () => {
    $('chosung').value = '[]';
    $('search-type').value = 0;
    getBookmarkList().then(bookmarkListCallback);
    return false;
};

$('form-direct-search-address').onsubmit = function () {
    $('direct-latitude').value = $('shop-latitude').value;
    $('direct-longitude').value = $('shop-longitude').value;
    $('search-type').value = 1;
    getBookmarkList().then(bookmarkListCallback);
    return false;
};

$('form-bookmark').onsubmit = () => {
    getBookmark().then(bookmarkCallback).then(selectBookmarkButton);
    return false;
};

const consonantButtons = $('consonant-area').getElementsByTagName('button');

const selectConsonant = getClosureToSelectButton(consonantButtons,
    'consonant-container__button consonant-container__button--selected',
    'consonant-container__button');

for (let i = 0; i < consonantButtons.length; i++) {
    consonantButtons[i].onclick = function () {
        $('consonant').value = this.value;
        const isAll = (i === 0);
        getEnableDong(isAll).then(() => {
            selectConsonant(i);
        });
    };
}

const categoryButtons = $('category-list').getElementsByTagName('button');

const selectCategory = getClosureToSelectButton(categoryButtons,
    'building-container__button building-container__button--selected',
    'building-container__button');

for (let i = 0; i < categoryButtons.length; i++) {
    categoryButtons[i].onclick = function () {
        $('categoryId').value = this.value;
        requestByMethod();
        selectCategory(i);
    };
}

const chosungButtons = $('chosung-buttons-area').getElementsByClassName('select-consonant-container__button');

for (let i = 0; i < chosungButtons.length; i++) {
    const cb = chosungButtons[i];
    cb.onclick = function () {
        $('chosung').value = `[${this.value}]`;
        requestByMethod();
    };
}
