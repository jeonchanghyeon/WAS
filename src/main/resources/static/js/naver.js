export const createMarker = (option) => {

    return new naver.maps.Marker({
        position: new naver.maps.LatLng(
            option.position.latitude,
            option.position.longitude
        ),
        map: option.map,
        icon: option.icon
    });
};

export const setMarkerCenter = (map, markers) => {
    if (markers.length > 1) {

        let bounds = new naver.maps.PointBounds(
            markers[0].getPosition(),
            markers[1].getPosition());

        for (let i = 2; i < markers.length; i++) {

            bounds.extend(markers[i].getPosition());
        }

        map.fitBounds(bounds);
    }
    if (markers.length === 1) {

        map.setCenter(markers[0].getPosition());

    } else {

    }
};

export const initMap = () => {
    return new naver.maps.Map('map', {
        center: new naver.maps.LatLng(35.768418, 128.6050579),
        zoom: 3
    });
};

export const removeMarkers = (markers) => {

    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }

    markers.length = 0;
};

export const removeInfo = (infos) => {

    for (let i = 0; i < infos.length; i++) {
        infos[i].setMap(null);
    }

    infos.length = 0;
};

export const hideInfo = (infos) => {

    for (let i = 0; i < infos.length; i++) {
        infos[i].hide();
    }

};

export const showInfo = (infos) => {

    for (let i = 0; i < infos.length; i++) {
        infos[i].show();
    }

};

var InfoOverlay = function (options) {
    this.textColor = options.textColor;

    this.icon = options.icon;

    this.infoName = options.infoName;

    this._prepareDOM();

    this.setPosition(options.position);

    this.setMap(options.map || null);
};

InfoOverlay.prototype = new naver.maps.OverlayView();
InfoOverlay.prototype.constructor = InfoOverlay;

InfoOverlay.prototype.setPosition = function (position) {
    this._position = position;

    this.draw();
};

InfoOverlay.prototype.getPosition = function () {
    return this._position;
};

InfoOverlay.prototype.onAdd = function () {
    var paneName = 'floatPane',
        floatPane = this.getPanes()[paneName];

    floatPane.appendChild(this._element);
};

InfoOverlay.prototype.hide = function () {
    this._element.style.display = "none";
};

InfoOverlay.prototype.show = function () {
    this._element.style.display = "";
};

InfoOverlay.prototype.draw = function () {
    if (!this.getMap()) {
        return;
    }

    var projection = this.getProjection(),
        position = this.getPosition(),
        pixelPosition = projection.fromCoordToOffset(position);

    const left = pixelPosition.x;
    const top = pixelPosition.y;

    this._element.style.left = left + "px";
    this._element.style.top = top + "px";
};

InfoOverlay.prototype.onRemove = function () {

    this._element.parentNode.removeChild(this._element);
};

InfoOverlay.prototype._prepareDOM = function () {

    const info = document.createElement("div");

    info.style.position = "absolute";


    info.innerHTML = '<div style="background-image: url( ' + this.icon + ');background-size: 100% 100%; position: relative; left:-50%; bottom:80px;text-align: center;" >' +
        '<div style="font-size: 14px;padding: 5px 10px 15px;color:' + this.textColor + ';font-weight: 500;">' +
        '<span>' + this.infoName + '</span>' +
        '</div>' +
        '</div>';

    this._element = info;
};

export const createInfoWindow = (option) => {

    return new InfoOverlay({
        map: option.map,
        position: new naver.maps.LatLng(
            option.position.latitude,
            option.position.longitude
        ),
        infoName: option.name,
        icon: option.icon,
        textColor: option.textColor
    });
};

export const drawPolyLine = (option) => {

    return new naver.maps.Polyline({
        map: option.map,
        path: option.path.map(
            (position) => new naver.maps.LatLng(
                position.latitude,
                position.Longitude
            )
        ),
        strokeColor: option.strokeColor
    });
};