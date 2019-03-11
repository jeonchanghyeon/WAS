/* eslint-disable */

class InfoOverlay extends naver.maps.OverlayView {
    constructor(options) {
        super();
        this.textColor = options.textColor;
        this.icon = options.icon;
        this.infoName = options.infoName;
        this._prepareDOM();
        this.setPosition(options.position);
        this.setMap(options.map || null);
    }

    setPosition(position) {
        this._position = position;
        this.draw();
    }

    getPosition() {
        return this._position;
    }

    onAdd() {
        const paneName = 'floatPane';
        const floatPane = this.getPanes()[paneName];

        floatPane.appendChild(this._element);
    }

    hide() {
        this._element.style.display = 'none';
    }

    show() {
        this._element.style.display = '';
    }

    draw() {
        if (!this.getMap()) {
            return;
        }

        const projection = this.getProjection();
        const position = this.getPosition();
        const pixelPosition = projection.fromCoordToOffset(position);

        const left = pixelPosition.x;
        const top = pixelPosition.y;

        this._element.style.left = `${left}px`;
        this._element.style.top = `${top}px`;
    }

    onRemove() {
        this._element.parentNode.removeChild(this._element);
    }

    _prepareDOM() {
        const info = document.createElement('div');

        info.style.position = 'absolute';
        info.innerHTML = `<div style="background-image: url( ${this.icon});background-size: 100% 100%; position: relative; left:-50%; bottom:80px;text-align: center;" >`
            + `<div style="font-size: 14px;padding: 5px 10px 15px;color:${this.textColor};font-weight: 500;">`
            + `<span>${this.infoName}</span>`
            + '</div>'
            + '</div>';

        this._element = info;
    }
}

export const createMarker = (option) => {
    try {
        return new naver.maps.Marker({
            position: new naver.maps.LatLng(option.position.latitude, option.position.longitude),
            map: option.map,
            icon: option.icon,
        });
    } catch (e) {
        console.log(e);
    }
};

export const setMarkerCenter = (map, markers) => {
    try {
        if (markers.length > 1) {
            const bounds = new naver.maps.PointBounds(markers[0].getPosition(),
                markers[1].getPosition());

            for (let i = 2; i < markers.length; i++) {
                bounds.extend(markers[i].getPosition());
            }

            map.fitBounds(bounds);
        }

        if (markers.length === 1) {
            map.setCenter(markers[0].getPosition());
        }
    } catch (e) {
        console.log(e);
    }
};

export const initMap = () => {
    try {
        return new naver.maps.Map('map', {
            center: new naver.maps.LatLng(35.768418, 128.6050579),
            zoom: 3,
        });
    } catch (e) {
        console.log(e);
    }
};

export const removeMarkers = (markers) => {
    try {
        markers.forEach((marker) => {
            marker.setMap(null);
        });

        markers.length = 0;
    } catch (e) {
        console.log(e);
    }
};

export const removeInfo = (infos) => {
    try {
        infos.forEach((info) => {
            info.setMap(null);
        });

        infos.length = 0;
    } catch (e) {
        console.log(e);
    }
};

export const hideInfo = (infos) => {
    try {
        infos.forEach((info) => {
            info.hide();
        });
    } catch (e) {
        console.log(e);
    }
};

export const showInfo = (infos) => {
    try {
        infos.forEach((info) => {
            info.show();
        });
    } catch (e) {
        console.log(e);
    }
};

export const createInfoWindow = option => {
    try {
        return new InfoOverlay({
            map: option.map,
            position: new naver.maps.LatLng(option.position.latitude, option.position.longitude),
            infoName: option.name,
            icon: option.icon,
            textColor: option.textColor,
        });
    } catch (e) {
        console.log(e);
    }
};

export const drawPolyLine = (option) => {
    try {
        return new naver.maps.Polyline({
            map: option.map,
            path: option.path.map(position => new naver.maps.LatLng(position.latitude,
                position.Longitude)),
            strokeColor: option.strokeColor,
        });
    } catch (e) {
        console.log(e);
    }
};

export const getDistance = (map, src, dst) => {
    try {
        return map.getProjection()
            .getDistance(new naver.maps.LatLng(src.latitude, src.Longitude),
                new naver.maps.LatLng(dst.latitude, dst.Longitude));
    } catch (e) {
        console.log(e);
    }
    return 0;
};

/* eslint-enable */
