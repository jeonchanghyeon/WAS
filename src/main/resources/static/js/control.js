import {getJSON} from './ajax.js'
import {loadPoint} from "./point.js";
import {$, createCol, createRow, formSerialize} from "./element.js"
import {
    createInfoWindow,
    createMarker,
    drawPolyLine,
    hideInfo,
    initMap,
    removeInfo,
    removeMarkers,
    setMarkerCenter,
    showInfo,
} from "./naver.js"
import {fillZero} from "./format.js";

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

const group = $("group").value;
const id = $("userId").value;

const riders = $("rider-control-area");
const shops = $("shop-control-area");
const downs = $("down-control-area");
const branches = $("branch-control-area");
const formBranchSearch = $("form-branch-search");
const formRiderSearch = $("form-rider-search");
const formShopSearch = $("form-shop-search");
const shopBranchId = $("shop-branch-id");
const riderBranchId = $("rider-branch-id");

const displayRiderControl = () => {
    if (branches !== null) {
        branches.style.display = "none";
    }

    if (shops !== null) {
        shops.style.display = "none";
    }

    if (downs !== null) {
        downs.style.display = "initial";
    }

    if (riders !== null) {
        riders.style.display = "initial";
    }

    $("map-down").style.display = "none";
    $("map").style.height = "100%";

    $("btn-rider-control").className = "btn-control-selected";
    $("btn-shop-control").className = "btn-control-unselected";

};

const displayShopControl = () => {
    if (branches !== null) {
        branches.style.display = "none";
    }
    if (riders !== null) {
        riders.style.display = "none";
    }

    if (downs !== null) {
        downs.style.display = "initial";
    }
    if (shops !== null) {
        shops.style.display = "initial";
    }

    $("map-down").style.display = "none";
    $("map").style.height = "100%";

    $("btn-shop-control").className = "btn-control-selected";
    $("btn-rider-control").className = "btn-control-unselected";
};

const displayBranchControl = () => {
    if (downs !== null) {
        downs.style.display = "none";
    }
    if (branches !== null) {
        branches.style.display = "initial";
    }

    $("map-down").style.display = "none";
    $("map").style.height = "100%";
};

const getBranchControl = () => {
    const formBranchSearch = $("form-branch-search");
    const formData = new FormData(formBranchSearch);

    if (formBranchSearch !== null) {

        getJSON('/api/branches?' + formSerialize(formData)).then(
            (obj) => {
                const branches = obj["branches"];

                const tableBranches = $("branches");
                tableBranches.innerHTML = "";

                removeMarkers(markers);
                removeInfo(infos);

                for (let i = 0; i < branches.length; i++) {
                    const branch = branches[i];

                    const latitude = branch["latitude"];
                    const riderTotal = branch["riderTotal"];
                    const name = branch["name"];
                    const id = branch["id"];
                    const riderWorkOn = branch["riderWorkOn"];
                    const shareCallNum = branch["shareCallNum"];
                    const longitude = branch["longitude"];

                    const text = [
                        name,
                        fillZero(riderWorkOn, 2) + "명/" + fillZero(riderTotal, 2) + "명",
                        shareCallNum,
                    ];

                    const row = createRow(text, (row) => {
                        const btn = document.createElement('button');
                        btn.className = 'btn-select';
                        btn.innerHTML = "선택";

                        const col = createCol(btn, (col) => {
                            col.onclick = () => {

                                $("branch-name").innerText = name;
                                riderBranchId.value = id;
                                shopBranchId.value = id;
                                $("count-worker").innerText = riderWorkOn + "/" + riderTotal;

                                $("branch-latitude").value = latitude;
                                $("branch-longitude").value = longitude;

                                getRiderControl();
                            }
                        });

                        row.appendChild(col);
                    });

                    tableBranches.appendChild(row);

                    const marker = createMarker({
                            map: map,
                            position: {
                                latitude: latitude,
                                longitude: longitude,
                            },
                            icon: '/img/marker-branch.png'
                        }
                    );

                    markers.push(marker);

                    const info = createInfoWindow({
                        map: map,
                        position: {
                            latitude: latitude,
                            longitude: longitude
                        },
                        name: name,
                        icon: "/img/bubble-blue.png",
                        textColor: "#FFFFFF"
                    });

                    infos.push(info);

                }

                setMarkerCenter(map, markers);
                displayBranchControl();
            }
        ).catch((e) => {
            console.log(e);
        });
    }
};

const getRiderControl = () => {
    const formRiderSearch = $("form-rider-search");

    const workOn = $("work-on").checked;
    const workOff = $("work-off").checked;

    const riderStatusId = $("rider-status-id");

    if (workOn === false || workOff === false) {
        riderStatusId.value = workOn * 1 + workOff * 2;
    } else {
        riderStatusId.value = 0;
    }

    const formData = new FormData(formRiderSearch);

    removeMarkers(markers);
    removeInfo(infos);

    const latitude = $("branch-latitude").value;
    const longitude = $("branch-longitude").value;
    const name = $("branch-name").innerText;

    const marker = createMarker({
            map: map,
            position: {
                latitude: latitude,
                longitude: longitude,
            },
            icon: '/img/marker-branch.png'
        }
    );

    markers.push(marker);

    const info = createInfoWindow({
        map: map,
        position: {
            latitude: latitude,
            longitude: longitude
        },
        name: name,
        icon: "/img/bubble-blue.png",
        textColor: "#FFFFFF"
    });

    infos.push(info);

    getJSON('/api/riders?' + formSerialize(formData)).then(
        (obj) => {
            const riders = obj["riders"];

            const tableRiders = $("riders");
            tableRiders.innerHTML = "";

            for (let i = 0; i < riders.length; i++) {
                const rider = riders[i];

                const riderStatusId = rider["riderStatusId"];
                const name = rider["name"];
                const id = rider["id"];
                const latitude = rider["latitude"];
                const longitude = rider["longitude"];

                const text = [
                    "",
                    name,
                    fillZero(rider["allocateCount"], 2),
                    fillZero(rider["completeCount"], 2),
                    fillZero(rider["pickupCount"], 2),
                    rider["tel"]
                ];

                const marker = createMarker({
                        map: map,
                        position: {
                            latitude: latitude,
                            longitude: longitude,
                        },
                        icon: '/img/marker-rider.png'
                    }
                );

                markers.push(marker);

                const info = createInfoWindow({
                    map: map,
                    position: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    name: name,
                    icon: "/img/bubble-white.png",
                    textColor: "#4a4a4a"
                });

                infos.push(info);

                const row = createRow(text, (row) => {
                    row.ondblclick = () => {
                        getJSON("/api/riders/" + id).then(
                            (obj) => {
                                const rider = obj["rider"];

                                const tel = rider["tel"];
                                const name = rider["name"];
                                const orders = rider["orders"];

                                const table = $("rider-order-status");
                                table.innerHTML = '';

                                for (let i = 0; i < orders.length; i++) {
                                    const order = orders[i];

                                    const id = order['id'];
                                    const orderStatusId = order['orderStatusId'].toString();

                                    let sMarkerIconUrl = null;
                                    let dMarkerIconUrl = null;
                                    let strokeColor = null;

                                    if (orderStatusId === '2') {
                                        sMarkerIconUrl = '/img/marker-start-allocated.png';
                                        dMarkerIconUrl = '/img/marker-arrival-allocated.png';
                                        strokeColor = 'ff6d8b';
                                    } else if (orderStatusId === '3') {
                                        sMarkerIconUrl = '/img/marker-start-pickup.png';
                                        dMarkerIconUrl = '/img/marker-arrival-pickup.png';
                                        strokeColor = 'c043ff';
                                    }

                                    const startPosition = {
                                        latitude: order['startingLatitude'],
                                        Longitude: order['startingLongitude']
                                    };

                                    const destinationPosition = {
                                        latitude: order['destinationLatitude'],
                                        Longitude: order['destinationLongitude']
                                    };

                                    drawPolyLine({
                                        map: map,
                                        path: [startPosition, destinationPosition],
                                        strokeColor: strokeColor
                                    });

                                    markers.push(
                                        createMarker({
                                                map: map,
                                                position: startPosition,
                                                icon: sMarkerIconUrl
                                            }
                                        )
                                    );

                                    markers.push(
                                        createMarker({
                                                map: map,
                                                position: destinationPosition,
                                                icon: dMarkerIconUrl
                                            }
                                        )
                                    );

                                    const row = createRow(
                                        [
                                            '<button class="btn_pickup">픽업</button>',
                                            '<span>' + order['shopName'] + '</span>\n' +
                                            '<span> > </span>\n' +
                                            '<span>' + order['addressDetail'] + '</span>',
                                            '<button class="btn_detail">주문상세보기</button>'
                                        ]
                                    );

                                    table.appendChild(row)
                                }

                                $("rider-name").innerHTML = name;
                                $("rider-tel").innerHTML = tel;

                                // for (let i = 0; i < orders.length; i++) {
                                //     const order = orders[i];
                                // }

                                const mapDown = $("map-down");
                                mapDown.style.display = "initial";
                                const mapDownHeight = mapDown.offsetHeight;

                                $("map").style.height = "calc(100% - " + mapDownHeight + "px)";

                            }
                        );
                    }
                });

                tableRiders.appendChild(row);

            }

            setMarkerCenter(map, markers);
            displayRiderControl();
        }
    ).catch((e) => {
        console.log(e);
    })
};

const getShopControl = () => {
    const formShopSearch = $("form-shop-search");
    const formData = new FormData(formShopSearch);

    removeMarkers(markers);
    removeInfo(infos);

    const latitude = $("branch-latitude").value;
    const longitude = $("branch-longitude").value;
    const name = $("branch-name").innerText;

    const marker = createMarker({
            map: map,
            position: {
                latitude: latitude,
                longitude: longitude
            },
            icon: '/img/marker-branch.png'
        }
    );

    markers.push(marker);

    const info = createInfoWindow({
        map: map,
        position: {
            latitude: latitude,
            longitude: longitude
        },
        name: name,
        icon: "/img/bubble-blue.png",
        textColor: "#FFFFFF"
    });

    infos.push(info);

    getJSON('/api/shops?' + formSerialize(formData)).then(
        (obj) => {
            const shops = obj["shops"];

            const tableShops = $("shops");
            tableShops.innerHTML = "";

            for (let i = 0; i < shops.length; i++) {
                const shop = shops[i];

                const name = shop["name"];

                const text = [
                    name,
                    "",
                    fillZero(shop["allocateCount"], 2),
                    fillZero(shop["completeCount"], 2),
                    fillZero(shop["pickupCount"], 2),
                    shop["tel"]
                ];

                const marker = createMarker({
                        map: map,
                        position: {
                            latitude: shop["latitude"],
                            longitude: shop["longitude"]
                        },
                        icon: '/img/marker-shop.png'
                    }
                );
                markers.push(marker);

                const info = createInfoWindow({
                    map: map,
                    position: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    name: name,
                    icon: "/img/bubble-red.png",
                    textColor: "#FFFFFF"
                });

                infos.push(info);

                const row = createRow(text);

                tableShops.appendChild(row);
            }

            getJSON("/api/orders/statuses?branch-id=" + shopBranchId.value).then(
                (obj) => {
                    const info = obj["info"];

                    const infoKey = [
                        "acceptCount",
                        "allocateCount",
                        "pickupCount",
                        "completeCount"
                    ];

                    const countId = [
                        "count-accept",
                        "count-allocate",
                        "count-pickup",
                        "count-complete"
                    ];

                    let sum = 0;

                    for (let i = 0; i < infoKey.length; i++) {
                        sum += info[infoKey[i]];
                        $(countId[i]).innerHTML = info[infoKey[i]];
                    }

                    $("count-all").innerHTML = sum;

                    setMarkerCenter(map, markers);
                    displayShopControl()
                }
            );

        }
    ).catch((e) => {
        console.log(e);
    });

    getJSON('/api/riders?branch-id=' + shopBranchId.value).then(
        (obj) => {
            const riders = obj["riders"];

            for (let i = 0; i < riders.length; i++) {
                const rider = riders[i];

                const latitude = rider["latitude"];
                const longitude = rider["longitude"];
                const name = rider["name"];

                const marker = createMarker({
                        map: map,
                        position: {
                            latitude: latitude,
                            longitude: longitude
                        },
                        icon: '/img/marker-rider.png'
                    }
                );

                markers.push(marker);

                const info = createInfoWindow({
                    map: map,
                    position: {
                        latitude: latitude,
                        longitude: longitude
                    },
                    name: name,
                    icon: "/img/bubble-white.png",
                    textColor: "#4a4a4a"
                });

                infos.push(info);
            }
        }
    );
};

switch (parseInt(group)) {
    case Group.HEAD:
    case Group.DISTRIB:
        getBranchControl();
        break;
    case Group.BRANCH:

        riderBranchId.value = id;
        shopBranchId.value = id;

        getRiderControl();
        break;
    case Group.SHOP:

        shopBranchId.value = id;

        getRiderControl();
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

$("btn-rider-control").onclick = getRiderControl;
$("btn-shop-control").onclick = getShopControl;
$("btn-close").onclick = getBranchControl;

$("afe").onclick = function () {
    if (this.checked === true) {
        showInfo(infos);
    } else {
        hideInfo(infos);
    }
};