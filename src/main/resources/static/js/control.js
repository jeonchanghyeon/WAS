import {withGetMethod} from './ajax.js'
import {loadPoint} from "./point.js";

const $ = (id) => document.getElementById(id);

const riders = $("rider-control-area");
const shops = $("shop-control-area");

const downs = $("down-control-area");
const branches = $("branch-control-area");

const displayRiderControl = () => {
    branches.style.display = "none";
    shops.style.display = "none";

    downs.style.display = "initial";
    riders.style.display = "initial";

    $("btn-rider-control").className = "btn-control-selected";
    $("btn-shop-control").className = "btn-control-unselected";
};

const displayShopControl = () => {
    branches.style.display = "none";
    riders.style.display = "none";

    downs.style.display = "initial";
    shops.style.display = "initial";

    $("btn-shop-control").className = "btn-control-selected";
    $("btn-rider-control").className = "btn-control-unselected";
};

const displayBranchControl = () => {
    downs.style.display = "none";
    branches.style.display = "initial";
};

$("btn-rider-control").onclick = displayRiderControl;

$("btn-shop-control").onclick = displayShopControl;

$("btn-close").onclick = () => {
    a();
    displayBranchControl();
};

const map = new naver.maps.Map('map', {
    center: new naver.maps.LatLng(35.768418, 128.6050579),
    zoom: 3
});

let markers = [];
loadPoint();

a();
b();
c();

function removeMarkers(markers) {
    console.log("removeMarkers : start");
    console.log("removeMarkers : markers.length = " + markers.length);
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    console.log("removeMarkers : end");
}

const formBranchSearch = $("form-branch-search");
const formRiderSearch = $("form-rider-search");
const formShopSearch = $("form-shop-search");

formBranchSearch.onsubmit = () => {
    a();
    return false;
};
formRiderSearch.onsubmit = () => {
    b();
    return false;
};
formShopSearch.onsubmit = () => {
    c();
    return false;
};

function a() {
    const url = "/api/branches";
    const formBranchSearch = $("form-branch-search");
    const formData = new FormData(formBranchSearch);

    removeMarkers(markers);

    withGetMethod(
        url,
        formData,
        (obj) => {
            try {
                const branches = obj["branches"];

                const tableBranches = $("branches");
                tableBranches.innerHTML = "";

                for (let i = 0; i < branches.length; i++) {
                    const branch = branches[i];

                    // const address = branch["address"];
                    const latitude = branch["latitude"];
                    const riderTotal = branch["riderTotal"];
                    // const roadAddress = branch["roadAddress"];
                    const name = branch["name"];
                    const id = branch["id"];
                    // const riderWorkOff = branch["riderWorkOff"];
                    const riderWorkOn = branch["riderWorkOn"];
                    const shareCallNum = branch["shareCallNum"];
                    const longitude = branch["longitude"];


                    const row = document.createElement("tr");

                    /* table
                    name
                    riderWorkOn
                    riderTotal
                    shareCallNum
                    */

                    /* form
                    name
                    id
                    latitude
                    longitude
                    */

                    const text = [
                        name,
                        riderWorkOn + "명/" + riderTotal + "명",
                        shareCallNum,
                    ];

                    for (let j = 0; j < text.length; j++) {
                        const col = document.createElement("td");
                        col.innerHTML = text[j];
                        row.appendChild(col);
                    }

                    const col = document.createElement("td");

                    const form = document.createElement("form");

                    form.innerHTML = '<button class="btn-select">선택</button>';

                    form.onsubmit = () => {
                        removeMarkers(markers);

                        $("branch-name").innerText = name;

                        $("rider-branch-id").value = id;

                        $("count-worker").innerText = riderWorkOn + "/" + riderTotal;
                        b();

                        $("shop-branch-id").value = id;
                        c();

                        displayRiderControl();

                        const marker = new naver.maps.Marker({
                            position: new naver.maps.LatLng(latitude, longitude),
                            map: map,
                            icon: '/img/marker-branch.png'
                        });

                        markers.push(marker);

                        if (markers.length > 1) {
                            let bounds = new naver.maps.LatLngBounds(
                                markers[0].getPosition(),
                                markers[1].getPosition()
                            );

                            for (let i = 2; i < markers.length; i++) {
                                bounds.extend(markers[i].getPosition());
                            }

                            map.setCenter(bounds.getCenter());
                        }
                        if (markers.length === 1) {

                            map.setCenter(marker[0].getPosition());

                        } else {

                        }

                        // TODO ZOOM 설정

                        return false;
                    };

                    const names = [
                        "name",
                        "id",
                        "latitude",
                        "longitude",
                    ];

                    const value = [
                        name,
                        id,
                        latitude,
                        longitude,
                    ];

                    for (let j = 0; j < 4; j++) {
                        const input = document.createElement("input");

                        input.type = "hidden";
                        input.name = names[j];
                        input.value = value[j];

                        form.appendChild(input);
                    }

                    col.appendChild(form);

                    row.appendChild(col);

                    tableBranches.appendChild(row);

                    let marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(latitude, longitude),
                        map: map,
                        icon: '/img/marker-branch.png'
                    });

                    markers.push(marker);

                    let contentString = name;

                    let infowindow = new naver.maps.InfoWindow({
                        backgroundColor: "#FFFFFFFF",
                        borderWidth: 0,
                        position: new naver.maps.LatLng(latitude, longitude),
                        disableAnchor: true,
                        content: '<div style="float:left;background-image: url(/img/bubble-blue.png);background-size: 100% 100%;"><div style="font-size: 14px;float:right;padding: 5px 10px 15px;color: #ffffff;font-weight: 500;"><span>' + name + '</span></div></div>'
                    });

                    naver.maps.Event.addListener(marker, "click", function (e) {
                        if (infowindow.getMap()) {
                            infowindow.close();
                        } else {
                            infowindow.open(map, marker);
                        }
                    });
                }


                if (markers.length > 1) {
                    let bounds = new naver.maps.LatLngBounds(
                        markers[0].getPosition(),
                        markers[1].getPosition()
                    );

                    for (let i = 2; i < markers.length; i++) {
                        bounds.extend(markers[i].getPosition());
                    }

                    map.setCenter(bounds.getCenter());
                }
                if (markers.length === 1) {

                    map.setCenter(marker[0].getPosition());

                } else {

                }

            } catch (e) {
                console.log(e)
            }
        }
    )
}

function b() {
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

                    const riderStatusId = ["additional"]["riderStatusId"];
                    const allocateCount = rider["allocateCount"];
                    const completeCount = rider["completeCount"];
                    const pickupCount = rider["pickupCount"];
                    const tel = rider["tel"];
                    const latitude = rider["latitude"];
                    const longitude = rider["longitude"];
                    const name = rider["name"];
                    const id = rider["id"];

                    const row = document.createElement("tr");

                    const text = [
                        "",
                        name,
                        allocateCount,
                        completeCount,
                        pickupCount,
                        tel,
                    ];

                    for (let j = 0; j < text.length; j++) {
                        const col = document.createElement("td");
                        col.innerHTML = text[j];
                        row.appendChild(col);
                    }

                    // const col = document.createElement("td");
                    // const form = document.createElement("form");
                    //
                    // form.onsubmit = () => false;
                    //
                    // const names = [
                    //     "name",
                    //     "id",
                    //     "latitude",
                    //     "longitude",
                    // ];
                    //
                    // const value = [
                    //     name,
                    //     id,
                    //     latitude,
                    //     longitude,
                    // ];
                    //
                    // for (let j = 0; j < 4; j++) {
                    //     const input = document.createElement("input");
                    //
                    //     input.type = "hidden";
                    //     input.name = names[j];
                    //     input.value = value[j];
                    //
                    //     form.appendChild(input);
                    // }
                    //
                    // col.appendChild(form);
                    //
                    // row.appendChild(col);

                    tableRiders.appendChild(row);

                    const marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(latitude, longitude),
                        map: map,
                        icon: '/img/marker-rider.png'
                    });

                    markers.push(marker);
                }
            } catch (e) {
                console.log(e)
            }
        }
    )
}

function c() {
    const url = "/api/shops";
    const formShopSearch = $("form-shop-search");
    const formData = new FormData(formShopSearch);

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
                    const id = shop["id"];

                    const row = document.createElement("tr");

                    const text = [
                        name,
                        "",
                        allocateCount,
                        completeCount,
                        pickupCount,
                        tel,
                    ];

                    for (let j = 0; j < text.length; j++) {
                        const col = document.createElement("td");
                        col.innerHTML = text[j];
                        row.appendChild(col);
                    }

                    // const col = document.createElement("td");
                    // const form = document.createElement("form");
                    //
                    // form.onsubmit = () => false;
                    //
                    // const names = [
                    //     "name",
                    //     "id",
                    //     "latitude",
                    //     "longitude",
                    // ];
                    //
                    // const value = [
                    //     name,
                    //     id,
                    //     latitude,
                    //     longitude,
                    // ];
                    //
                    // for (let j = 0; j < 4; j++) {
                    //     const input = document.createElement("input");
                    //
                    //     input.type = "hidden";
                    //     input.name = names[j];
                    //     input.value = value[j];
                    //
                    //     form.appendChild(input);
                    // }
                    //
                    // col.appendChild(form);
                    //
                    // row.appendChild(col);

                    tableShops.appendChild(row);

                    const marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(latitude, longitude),
                        map: map,
                        icon: '/img/marker-shop.png'
                    });

                    markers.push(marker);
                }
            } catch (e) {
                console.log(e)
            }
        }
    )
}