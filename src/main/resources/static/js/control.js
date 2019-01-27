import {ajax, withGetMethod} from './ajax.js'
import {loadPoint} from "./point.js";
import {$, createCol, createRow} from "./element.js"
import {
    createInfoWindow,
    createMarker,
    hideInfo,
    initMap,
    removeInfo,
    removeMarkers,
    setMarkerCenter,
    showInfo
} from "./naver.js"

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

const map = initMap();

loadPoint();

const a = () => {
    const url = "/api/branches";
    const formBranchSearch = $("form-branch-search");
    const formData = new FormData(formBranchSearch);

    if (formBranchSearch !== null) {
        withGetMethod(
            url,
            formData,
            (obj) => {
                try {
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
                            riderWorkOn + "명/" + riderTotal + "명",
                            shareCallNum,
                        ];

                        const row = createRow(text, (row) => {

                            const col = createCol('<button class="btn-select">선택</button>', (col) => {
                                col.onclick = () => {

                                    $("branch-name").innerText = name;
                                    $("rider-branch-id").value = id;
                                    $("shop-branch-id").value = id;
                                    $("count-worker").innerText = riderWorkOn + "/" + riderTotal;

                                    $("branch-latitude").value = latitude;
                                    $("branch-longitude").value = longitude;

                                    b();
                                }
                            });

                            row.appendChild(col);
                        });

                        tableBranches.appendChild(row);

                        const marker = createMarker(map, latitude, longitude, '/img/marker-branch.png');
                        markers.push(marker);

                        const info = createInfoWindow({
                            map: map,
                            latitude: latitude,
                            longitude: longitude,
                            name: name,
                            icon: "/img/bubble-blue.png",
                            textColor: "#FFFFFF"
                        });

                        infos.push(info);

                    }

                    setMarkerCenter(map, markers);
                    displayBranchControl();

                } catch (e) {
                    console.log(e)
                }
            }
        )
    }
};

const b = () => {
    const url = "/api/riders";
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

    const marker = createMarker(map, latitude, longitude, '/img/marker-branch.png');
    markers.push(marker);

    const info = createInfoWindow({
        map: map,
        latitude: latitude,
        longitude: longitude,
        name: name,
        icon: "/img/bubble-blue.png",
        textColor: "#FFFFFF"
    });

    infos.push(info);

    withGetMethod(
        url,
        formData,
        (obj) => {
            try {
                const riders = obj["riders"];

                const tableRiders = $("riders");
                tableRiders.innerHTML = "";

                for (let i = 0; i < riders.length; i++) {
                    const rider = riders[i];

                    const riderStatusId = rider["additional"]["riderStatusId"];
                    const allocateCount = rider["allocateCount"];
                    const completeCount = rider["completeCount"];
                    const pickupCount = rider["pickupCount"];
                    const tel = rider["tel"];
                    const latitude = rider["latitude"];
                    const longitude = rider["longitude"];
                    const name = rider["name"];
                    const id = rider["id"];

                    const text = [
                        "",
                        name,
                        allocateCount,
                        completeCount,
                        pickupCount,
                        tel,
                    ];

                    const row = createRow(text, (row) => {
                        const marker = createMarker(map, latitude, longitude, '/img/marker-rider.png');
                        markers.push(marker);

                        const info = createInfoWindow({
                            map: map,
                            latitude: latitude,
                            longitude: longitude,
                            name: name,
                            icon: "/img/bubble-white.png",
                            textColor: "#4a4a4a"
                        });

                        infos.push(info);

                        row.ondblclick = () => {

                            ajax(
                                "/api/riders/" + id,
                                "GET",
                                (obj) => {
                                    const rider = obj["rider"];

                                    const tel = rider["tel"];
                                    const name = rider["name"];
                                    const orders = rider["orders"];

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
                displayRiderControl()

            } catch (e) {
                console.log(e)
            }
        }
    )
};

const c = () => {
    const url = "/api/shops";
    const formShopSearch = $("form-shop-search");
    const formData = new FormData(formShopSearch);

    removeMarkers(markers);
    removeInfo(infos);

    const latitude = $("branch-latitude").value;
    const longitude = $("branch-longitude").value;
    const name = $("branch-name").innerText;

    const marker = createMarker(map, latitude, longitude, '/img/marker-branch.png');
    markers.push(marker);

    const info = createInfoWindow({
        map: map,
        latitude: latitude,
        longitude: longitude,
        name: name,
        icon: "/img/bubble-blue.png",
        textColor: "#FFFFFF"
    });

    infos.push(info);

    withGetMethod(
        url,
        formData,
        (obj) => {
            try {
                const shops = obj["shops"];

                const tableShops = $("shops");
                tableShops.innerHTML = "";

                for (let i = 0; i < shops.length; i++) {
                    const shop = shops[i];

                    const allocateCount = shop["allocateCount"];
                    const completeCount = shop["completeCount"];
                    const pickupCount = shop["pickupCount"];
                    const tel = shop["tel"];
                    const latitude = shop["latitude"];
                    const longitude = shop["longitude"];
                    const name = shop["name"];

                    const text = [
                        name,
                        "",
                        allocateCount,
                        completeCount,
                        pickupCount,
                        tel,
                    ];

                    const row = createRow(text, () => {
                        const marker = createMarker(map, latitude, longitude, '/img/marker-shop.png');
                        markers.push(marker);

                        const info = createInfoWindow({
                            map: map,
                            latitude: latitude,
                            longitude: longitude,
                            name: name,
                            icon: "/img/bubble-red.png",
                            textColor: "#FFFFFF"
                        });

                        infos.push(info);
                    });

                    tableShops.appendChild(row);
                }

                ajax(
                    "/api/orders/statuses?branch-id=" + $("shop-branch-id").value,
                    "GET",
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
            } catch (e) {
                console.log(e)
            }
        }
    );
};

switch (parseInt(group)) {
    case Group.HEAD:
    case Group.DISTRIB:
        a();
        break;
    case Group.BRANCH:

        $("rider-branch-id").value = id;
        $("shop-branch-id").value = id;

        b();
        break;
    case Group.SHOP:

        $("shop-branch-id").value = id;

        b();
        break;
}

const formBranchSearch = $("form-branch-search");
const formRiderSearch = $("form-rider-search");
const formShopSearch = $("form-shop-search");

if (formBranchSearch !== null) {
    formBranchSearch.onsubmit = () => {
        a();
        return false;
    };
}

if (formBranchSearch !== null) {
    formRiderSearch.onsubmit = () => {
        b();
        return false;
    };
}

formShopSearch.onsubmit = () => {
    c();
    return false;
};

$("btn-rider-control").onclick = b;
$("btn-shop-control").onclick = c;
$("btn-close").onclick = a;

$("afe").onclick = function () {
    if (this.checked === true) {
        showInfo(infos);
    } else {
        hideInfo(infos);
    }
};