import {getJSON} from './ajax.js';
import {loadPoint} from './point.js';
import {$, createRow, formSerialize, getClosureToSelectButton} from './element.js';
import {fillZero} from './format.js';
import {loadDetail} from './delivery_details.js';
import {
    addListener,
    Coord,
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

const drawOrder = (orderStatusId, start, destination) => {
    let sMarkerIconUrl = null;
    let dMarkerIconUrl = null;
    let strokeColor = null;

    switch (parseInt(orderStatusId, 10)) {
        case 2:
            sMarkerIconUrl = '/img/marker-start-allocated.png';
            dMarkerIconUrl = '/img/marker-arrival-allocated.png';
            strokeColor = '#ff6d8b';
            break;

        case 3:
            sMarkerIconUrl = '/img/marker-start.png';
            dMarkerIconUrl = '/img/marker-arrival-pickup.png';
            strokeColor = '#c043ff';
            break;

        default:
            return;
    }

    const polyline = createPolyline({
        map,
        path: [start, destination],
        strokeColor,
    });

    polylines.push(polyline);

    const sMarker = createMarker({
        map,
        position: start,
        icon: sMarkerIconUrl,
    });

    const dMarker = createMarker({
        map,
        position: destination,
        icon: dMarkerIconUrl,
    });

    markers.push(sMarker);
    markers.push(dMarker);

    pathMarker.push(sMarker);
    pathMarker.push(dMarker);
};

const drawOverlay = (targetMap, coord, name, userGroup, id) => {
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
        position: coord,
        icon: markerIcon,
    });

    markers.push(marker);

    const info = createInfoWindow({
        map: targetMap,
        position: coord,
        infoName: name,
        icon: infoIcon,
        textColor: infoTextColor,
    });

    infos.push(info);

    switch (userGroup) {
        case Group.BRANCH:
            addListener(info, 'click', () => {
                getRiderControl(id);
            });
            addListener(marker, 'click', () => {
                getRiderControl(id);
            });
            break;

        case Group.SHOP:
            addListener(info, 'click', () => {
                getShopStatus(id);
            });
            addListener(marker, 'click', () => {
                getShopStatus(id);
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
            jibun,
            startingLatitude, startingLongitude,
            destinationLatitude, destinationLongitude,
        } = order;

        drawOrder(orderStatusId,
            new Coord(startingLatitude, startingLongitude),
            new Coord(destinationLatitude, destinationLongitude));

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
            + `<span>${jibun}</span>`;

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

    $('rider-name').innerHTML = `기사명 : ${name}`;
    $('rider-tel').innerHTML = `전화번호 : ${tel}`;

    mapDown.style.display = 'initial';
    const mapDownHeight = mapDown.offsetHeight;

    $('map').style.height = `calc(100% - ${mapDownHeight}px)`;
});

const getShopStatus = shopId => getJSON(`/api/shops/${shopId}/riders`).then((obj) => {
    const {riders} = obj;

    const table = $('rider-order-status');
    table.innerHTML = '';

    $('rider-name').innerHTML = `상점명 : ${shopId}`;
    $('rider-tel').innerHTML = `전화번호 : ${'shopTel'}`;

    removeViews(polylines);
    removeViews(pathMarker);

    riders.forEach((rider) => {
        const {
            orderId,
            orderStatusId,
            startingLatitude,
            startingLongitude,
            destinationLatitude,
            destinationLongitude,
            riderId,
            riderName,
            riderLatitude,
            riderLongitude,
            shopName,
            jibun,
        } = rider;

        drawOrder(orderStatusId,
            new Coord(startingLatitude, startingLongitude),
            new Coord(destinationLatitude, destinationLongitude));

        drawOverlay(map, new Coord(riderLatitude, riderLongitude), riderName, Group.RIDER, riderId);

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
            + `<span>${jibun}</span>`;

        const btnDetail = document.createElement('button');
        btnDetail.className = 'btn_detail';
        btnDetail.innerText = '주문상세보기';
        btnDetail.onclick = () => {
            loadDetail(orderId, $('group').value);
        };

        const row = createRow([btnStatus, div, btnDetail]);

        table.appendChild(row);
    });

    mapDown.style.display = 'initial';
    const mapDownHeight = mapDown.offsetHeight;

    $('map').style.height = `calc(100% - ${mapDownHeight}px)`;
});

const selectBranch = branchId => getJSON(`/api/branches/${branchId}/status`).then((obj) => {
    const {branchStatus} = obj;
    const {
        id, name,
        latitude, longitude,
        riderTotal, riderWorkOn,
        acceptCount, allocateCount, pickupCount, completeCount, orderTotalCount,
    } = branchStatus;

    $('branch-name').innerHTML = name;

    drawOverlay(map, new Coord(latitude, longitude), name, Group.BRANCH, id);

    riderBranchId.value = id;
    shopBranchId.value = id;

    $('count-worker').innerText = `${riderWorkOn}/${riderTotal}`;

    $('count-accept').innerHTML = acceptCount;
    $('count-allocate').innerHTML = allocateCount;
    $('count-pickup').innerHTML = pickupCount;
    $('count-complete').innerHTML = completeCount;
    $('count-all').innerHTML = orderTotalCount;
});

const getRiderControl = (branchId) => {
    const workOn = $('work-on');
    const workOff = $('work-off');

    workOn.onclick = () => {
        getRiderControl(branchId);
    };
    workOff.onclick = () => {
        getRiderControl(branchId);
    };

    const isWorkOn = workOn.checked;
    const isWorkOff = workOff.checked;

    const riderStatusMask = $('rider-status-id');

    if (isWorkOn === false || isWorkOff === false) {
        riderStatusMask.value = isWorkOn * 1 + isWorkOff * 2;
    } else {
        riderStatusMask.value = 0;
    }

    const formData = new FormData(formRiderSearch);

    formData.set('branch-id', branchId);

    removeViews(markers);
    removeViews(infos);
    removeViews(polylines);

    Promise.all([
        selectBranch(branchId),
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

                if (riderStatusId === 1) {
                    drawOverlay(map, new Coord(latitude, longitude), name, Group.RIDER, id);
                }

                const row = createRow(text);

                row.ondblclick = () => {
                    getRiderStatus(id);
                };

                tableRiders.appendChild(row);
            }
        })]).then(() => {
        setMapToCenterOfCoords(map, getMarkersPosition(markers));
        displayGroupControl(Group.RIDER);
    });
};

const getShopControl = (branchId) => {
    const formData = new FormData(formShopSearch);

    removeViews(markers);
    removeViews(infos);
    removeViews(polylines);

    Promise.all([
        selectBranch(branchId),
        getJSON(`/api/shops?${formSerialize(formData)}`).then((obj) => {
            const {shops} = obj;

            const tableShops = $('shops');
            tableShops.innerHTML = '';

            for (let i = 0; i < shops.length; i++) {
                const shop = shops[i];
                const {
                    id, name, tel,
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

                drawOverlay(map, new Coord(latitude, longitude), name, Group.SHOP, id);

                const row = createRow(text);

                row.ondblclick = () => {
                    getShopStatus(id);
                };

                tableShops.appendChild(row);
            }
        }),
        getJSON(`/api/riders?branch-id=${shopBranchId.value}`).then((obj) => {
            const {riders} = obj;

            for (let i = 0; i < riders.length; i++) {
                const rider = riders[i];
                const {id, name, riderStatusId, latitude, longitude} = rider;

                if (riderStatusId === 1) {
                    drawOverlay(map, new Coord(latitude, longitude), name, Group.RIDER, id);
                }
            }
        }),
    ]).then(() => {
        setMapToCenterOfCoords(map, getMarkersPosition(markers));
        displayGroupControl(Group.SHOP);
    });
};

const setOnclickOfGroupButton = (branchId) => {
    btnRiderControl.onclick = () => {
        getRiderControl(branchId);
    };
    btnShopControl.onclick = () => {
        getShopControl(branchId);
    };
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
                    setOnclickOfGroupButton(id);
                    getRiderControl(id);
                };

                text.push(btn);

                const row = createRow(text);

                tableBranches.appendChild(row);

                drawOverlay(map, new Coord(latitude, longitude), name, Group.BRANCH, id);
            });
        }).then(() => {
            setMapToCenterOfCoords(map, getMarkersPosition(markers));
            displayGroupControl(Group.BRANCH);
        });
    }
};

const group = $('group').value;
const id = $('userId').value;

switch (parseInt(group, 10)) {
    case Group.HEAD:
    case Group.DISTRIB:
        getBranchControl();
        $('btn-close').onclick = getBranchControl;
        break;

    case Group.BRANCH:
        riderBranchId.value = id;
        shopBranchId.value = id;
        getRiderControl(id);
        setOnclickOfGroupButton(id);
        break;

    case Group.SHOP:
        shopBranchId.value = id;
        getShopControl(id);
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
        getRiderControl(id);
        return false;
    };
}

formShopSearch.onsubmit = () => {
    getShopControl(id);
    return false;
};

$('afe').onclick = function () {
    if (this.checked === true) {
        showInfo(infos);
    } else {
        hideInfo(infos);
    }
};
