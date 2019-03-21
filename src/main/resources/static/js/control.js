import {getJSON} from './ajax.js';
import {loadPoint} from './point.js';
import {$, createRow, formSerialize, getClosureToSelectButton} from './element.js';
import {
    addListener,
    createInfoWindow,
    createMarker,
    createPolyline,
    getMarkersPosition,
    getPolylinesCoords,
    hideInfo,
    initMap,
    removeViews,
    setMapToCenterOfCoords,
    showInfo
} from './naver.js';
import {fillZero} from './format.js';
import {loadDetail} from './delivery_details.js';

loadPoint();

const map = initMap();

const Group = {
    GUEST: 1,
    RIDER: 2,
    SHOP: 3,
    BRANCH: 5,
    DISTRIB: 6,
    HEAD: 7,
};

const markers = [];
const infos = [];
const polylines = [];
const pathMarker = [];

const ridersArea = $('rider-control-area');
const shopsArea = $('shop-control-area');
const downs = $('down-control-area');
const branchesArea = $('branch-control-area');
const formBranchSearch = $('form-branch-search');
const formRiderSearch = $('form-rider-search');
const formShopSearch = $('form-shop-search');
const shopBranchId = $('shop-branch-id');
const riderBranchId = $('rider-branch-id');
const mapDown = $('map-down');
const btnRiderControl = $('btn-rider-control');
const btnShopControl = $('btn-shop-control');

const getClosureToSelectArea = areas => (index) => {
    for (let i = 0; i < areas.length; i++) {
        const area = areas[i];

        if (area !== null) {
            if (index === i) {
                area.style.display = 'initial';
            } else {
                area.style.display = 'none';
            }
        }
    }
};

const displayGroupControl = (group) => {
    if (mapDown !== null) {
        mapDown.style.display = 'none';
    }
    $('map').style.height = '100%';

    const isBranch = (group === Group.BRANCH) ? 1 : 0;
    getClosureToSelectArea([downs, branchesArea])(isBranch);

    if (isBranch === 1) {
        return;
    }

    const isRider = (group === Group.RIDER) ? 1 : 0;

    getClosureToSelectArea([shopsArea, ridersArea])(isRider);
    getClosureToSelectButton([btnShopControl, btnRiderControl],
        'btn-control-selected',
        'btn-control-unselected')(isRider);
};

const getRiderStatus = riderId => getJSON(`/api/riders/${riderId}`).then((obj) => {
    const {rider} = obj;
    const {
        tel, name, orders,
    } = rider;

    const table = $('rider-order-status');
    table.innerHTML = '';

    removeViews(polylines);
    removeViews(pathMarker);

    orders.forEach((order) => {
        const {
            id, shopName, orderStatusId,
            addressDetail,
            startingLatitude, startingLongitude,
            destinationLatitude, destinationLongitude,
        } = order;

        let sMarkerIconUrl = null;
        let dMarkerIconUrl = null;
        let strokeColor = null;

        if (orderStatusId.toString() === '2') {
            sMarkerIconUrl = '/img/marker-start-allocated.png';
            dMarkerIconUrl = '/img/marker-arrival-allocated.png';
            strokeColor = '#ff6d8b';
        } else if (orderStatusId.toString() === '3') {
            sMarkerIconUrl = '/img/marker-start.png';
            dMarkerIconUrl = '/img/marker-arrival-pickup.png';
            strokeColor = '#c043ff';
        }

        const startPosition = {
            latitude: startingLatitude,
            longitude: startingLongitude,
        };

        const destinationPosition = {
            latitude: destinationLatitude,
            longitude: destinationLongitude,
        };

        const polyline = createPolyline({
            map,
            path: [startPosition, destinationPosition],
            strokeColor,
        });

        polylines.push(polyline);

        const smarker = createMarker({
            map,
            position: startPosition,
            icon: sMarkerIconUrl,
        });

        const dmarker = createMarker({
            map,
            position: destinationPosition,
            icon: dMarkerIconUrl,
        });

        markers.push(smarker);
        markers.push(dmarker);

        pathMarker.push(smarker);
        pathMarker.push(dmarker);

        const btnStatus = document.createElement('button');

        if (orderStatusId.toString() === '2') {
            btnStatus.className = 'btn_allow';
            btnStatus.innerText = '배차';
        } else if (orderStatusId.toString() === '3') {
            btnStatus.className = 'btn_pickup';
            btnStatus.innerText = '픽업';
        }

        const div = document.createElement('div');
        div.innerHTML = `<span>${shopName}</span>\n`
            + '<span> > </span>\n'
            + `<span>${addressDetail}</span>`;

        const btnDetail = document.createElement('button');
        btnDetail.className = 'btn_detail';
        btnDetail.innerText = '주문상세보기';
        btnDetail.onclick = () => {
            loadDetail(id, $('group').value);
        };

        const row = createRow([btnStatus, div, btnDetail]);

        table.appendChild(row);
    });

    setMapToCenterOfCoords(map, getPolylinesCoords(polylines));

    $('rider-name').innerHTML = name;
    $('rider-tel').innerHTML = tel;

    mapDown.style.display = 'initial';
    const mapDownHeight = mapDown.offsetHeight;

    $('map').style.height = `calc(100% - ${mapDownHeight}px)`;
});

const drawOverlay = (targetMap, latitude, longitude, name, userGroup, id, riderWorkOn, riderTotal) => {
    let markerIcon = null;
    let infoIcon = null;
    let infoTextColor = null;

    switch (userGroup) {
        case Group.BRANCH:
            markerIcon = '/img/marker-branch.png';
            infoIcon = '/img/bubble-blue.png';
            infoTextColor = '#FFFFFF';
            break;

        case Group.SHOP:
            markerIcon = '/img/marker-shop.png';
            infoIcon = '/img/bubble-red.png';
            infoTextColor = '#FFFFFF';
            break;

        case Group.RIDER:
            markerIcon = '/img/marker-rider.png';
            infoIcon = '/img/bubble-white.png';
            infoTextColor = '#4a4a4a';
            break;

        default:
            break;
    }

    const marker = createMarker({
        map: targetMap,
        position: {latitude, longitude},
        icon: markerIcon,
    });

    markers.push(marker);

    const info = createInfoWindow({
        map: targetMap,
        position: {latitude, longitude},
        name,
        icon: infoIcon,
        textColor: infoTextColor,
    });

    infos.push(info);

    switch (userGroup) {
        case Group.BRANCH:
            addListener(info, 'click', () => {
                selectBranch(id, name, riderWorkOn, riderTotal, latitude, longitude);
            });
            addListener(marker, 'click', () => {
                selectBranch(id, name, riderWorkOn, riderTotal, latitude, longitude);
            });
            break;

        case Group.RIDER:
            addListener(info, 'click', () => {
                getRiderStatus(id);
            });
            addListener(marker, 'click', () => {
                getRiderStatus(id);
            });
            break;

        default:
            break;
    }
};

const getRiderControl = () => {
    const workOn = $('work-on');
    const workOff = $('work-off');

    workOn.onclick = getRiderControl;
    workOff.onclick = getRiderControl;

    const isWorkOn = workOn.checked;
    const isWorkOff = workOff.checked;

    const riderStatusId = $('rider-status-id');

    if (isWorkOn === false || isWorkOff === false) {
        riderStatusId.value = isWorkOn * 1 + isWorkOff * 2;
    } else {
        riderStatusId.value = 0;
    }

    const formData = new FormData(formRiderSearch);

    removeViews(markers);
    removeViews(infos);
    removeViews(polylines);

    const branchName = $('branch-name').innerText.toString();
    const branchLatitude = parseFloat($('branch-latitude').value);
    const branchLongitude = parseFloat($('branch-longitude').value);

    drawOverlay(map, branchLatitude, branchLongitude, branchName, Group.BRANCH);

    getJSON(`/api/riders?${formSerialize(formData)}`).then((obj) => {
        const {riders} = obj;

        const tableRiders = $('riders');
        tableRiders.innerHTML = '';

        for (let i = 0; i < riders.length; i++) {
            const rider = riders[i];

            const {
                id, name, tel, riderStatusId,
                allocateCount, completeCount, pickupCount,
                latitude, longitude,
            } = rider;

            const img = document.createElement('img');

            switch (riderStatusId) {
                case 1:
                    img.src = '/img/dot.png';
                    break;
                case 2:
                    img.src = '/img/dot-black.png';
                    break;
                default:
                    break;
            }
            img.width = '10';
            img.height = '10';

            const text = [
                img,
                name,
                fillZero(allocateCount, 2),
                fillZero(pickupCount, 2),
                fillZero(completeCount, 2),
                tel,
            ];

            drawOverlay(map, latitude, longitude, name, Group.RIDER, id);

            const row = createRow(text);

            row.ondblclick = () => {
                getRiderStatus(id);
            };

            tableRiders.appendChild(row);
        }

        setMapToCenterOfCoords(map, getMarkersPosition(markers));
        displayGroupControl(Group.RIDER);
    });
};

const selectBranch = (id, name, riderWorkOn, riderTotal, latitude, longitude) => {
    $('branch-name').innerText = name;
    riderBranchId.value = id;
    shopBranchId.value = id;
    $('count-worker').innerText = `${riderWorkOn}/${riderTotal}`;

    $('branch-latitude').value = latitude;
    $('branch-longitude').value = longitude;

    getRiderControl();
};

const getBranchControl = () => {
    const formData = new FormData(formBranchSearch);

    if (formBranchSearch !== null) {
        getJSON(`/api/branches?${formSerialize(formData)}`).then((obj) => {
            const {branches} = obj;

            const tableBranches = $('branches');
            tableBranches.innerHTML = '';

            removeViews(markers);
            removeViews(infos);
            removeViews(polylines);

            branches.forEach((branch) => {
                const {
                    latitude, riderTotal, name, id, riderWorkOn, shareCallNum, longitude,
                } = branch;

                const text = [
                    name,
                    `${fillZero(riderWorkOn, 2)}명/${fillZero(riderTotal, 2)}명`,
                    shareCallNum,
                ];

                const btn = document.createElement('button');
                btn.className = 'btn-select';
                btn.innerHTML = '선택';
                btn.onclick = () => {
                    selectBranch(id, name, riderWorkOn, riderTotal, latitude, longitude);
                };

                text.push(btn);

                const row = createRow(text);

                tableBranches.appendChild(row);

                drawOverlay(map, latitude, longitude, name, Group.BRANCH,
                    id, riderWorkOn, riderTotal);
            });

            setMapToCenterOfCoords(map, getMarkersPosition(markers));
            displayGroupControl(Group.BRANCH);
        });
    }
};

const getShopControl = () => {
    const formData = new FormData(formShopSearch);

    removeViews(markers);
    removeViews(infos);

    const branchName = $('branch-name').innerText.toString();
    const branchLatitude = parseFloat($('branch-latitude').value);
    const branchLongitude = parseFloat($('branch-longitude').value);

    drawOverlay(map, branchLatitude, branchLongitude, branchName, Group.BRANCH);

    getJSON(`/api/shops?${formSerialize(formData)}`).then((obj) => {
        const {shops} = obj;

        const tableShops = $('shops');
        tableShops.innerHTML = '';

        for (let i = 0; i < shops.length; i++) {
            const shop = shops[i];
            const {
                name, tel,
                acceptCount, allocateCount, completeCount, pickupCount,
                latitude, longitude,
            } = shop;

            const text = [
                name,
                fillZero(acceptCount, 2),
                fillZero(allocateCount, 2),
                fillZero(completeCount, 2),
                fillZero(pickupCount, 2),
                tel,
            ];

            drawOverlay(map, latitude, longitude, name, Group.SHOP);

            const row = createRow(text);

            tableShops.appendChild(row);
        }

        getJSON(`/api/orders/statuses?branch-id=${shopBranchId.value}`).then((object) => {
            const {info} = object;

            const infoKey = [
                'acceptCount',
                'allocateCount',
                'pickupCount',
                'completeCount',
            ];

            const countId = [
                'count-accept',
                'count-allocate',
                'count-pickup',
                'count-complete',
            ];

            let sum = 0;

            for (let i = 0; i < infoKey.length; i++) {
                sum += info[infoKey[i]];
                $(countId[i]).innerHTML = info[infoKey[i]];
            }

            $('count-all').innerHTML = sum;

            setMapToCenterOfCoords(map, getMarkersPosition(markers));
            displayGroupControl(Group.SHOP);
        });
    });

    getJSON(`/api/riders?branch-id=${shopBranchId.value}`).then((obj) => {
        const {riders} = obj;

        for (let i = 0; i < riders.length; i++) {
            const rider = riders[i];
            const {id, name, riderStatusId, latitude, longitude} = rider;

            if (riderStatusId === 1) {
                drawOverlay(map, latitude, longitude, name, Group.RIDER, id);
            }
        }
    });
};

const group = $('group').value;
const id = $('userId').value;

switch (parseInt(group, 10)) {
    case Group.HEAD:
    case Group.DISTRIB:
        getBranchControl();
        $('btn-close').onclick = getBranchControl;
        btnRiderControl.onclick = getRiderControl;
        btnShopControl.onclick = getShopControl;
        break;

    case Group.BRANCH:
        riderBranchId.value = id;
        shopBranchId.value = id;
        getRiderControl();
        btnRiderControl.onclick = getRiderControl;
        btnShopControl.onclick = getShopControl;
        break;

    case Group.SHOP:
        shopBranchId.value = id;
        getShopControl();
        break;

    default:
        break;
}

if (formBranchSearch !== null) {
    formBranchSearch.onsubmit = () => {
        getBranchControl();
        return false;
    };
}

if (formBranchSearch !== null) {
    formRiderSearch.onsubmit = () => {
        getRiderControl();
        return false;
    };
}

formShopSearch.onsubmit = () => {
    getShopControl();
    return false;
};

$('afe').onclick = function () {
    if (this.checked === true) {
        showInfo(infos);
    } else {
        hideInfo(infos);
    }
};
