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

export const setMapToCenterOfCoords = (map, coords) => {
    try {
        if (coords.length > 1) {
            const bounds = new naver.maps.PointBounds(coords[0], coords[1]);

            for (let i = 2; i < coords.length; i++) {
                bounds.extend(coords[i]);
            }

            map.fitBounds(bounds);
            map.setZoom(map.getZoom() - 1);
        } else if (coords.length === 1) {
            map.setCenter(coords[0]);
            map.setZoom(14);
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

export const removeViews = (views) => {
    try {
        views.forEach((view) => {
            view.setMap(null);
        });

        views.length = 0;
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

export const createPolyline = (option) => {
    try {
        const path = option.path.map(({latitude, longitude}) =>
            new naver.maps.LatLng(latitude, longitude));

        return new naver.maps.Polyline({
            map: option.map,
            path,
            strokeColor: option.strokeColor,
            strokeWeight: 2,
        });
    } catch (e) {
        console.log(e);
    }
};

export const getDistance = (map, src, dst) => {
    try {
        console.log(new naver.maps.LatLng(src.latitude, src.longitude), new naver.maps.LatLng(dst.latitude, dst.longitude));
        return map.getProjection()
            .getDistance(new naver.maps.LatLng(src.latitude, src.longitude),
                new naver.maps.LatLng(dst.latitude, dst.longitude));
    } catch (e) {
        console.log(e);
    }
    return 0;
};

export const addListener = (target, eventName, listener) => {
    try {
        naver.maps.Event.addListener(target, eventName, listener);
    } catch (e) {
        console.log(e);
    }
};

export const getMarkersPosition = (markers) => {
    try {
        return markers.map((marker) => marker.getPosition());
    } catch (e) {
        console.log(e);
    }
};

export const getPolylinesCoords = (polylines) => {
    const coords = [];
    polylines.forEach((polyline) => {
        polyline.getPath().forEach((coord) => {
            coords.push(coord);
        });
    });

    return coords;
};

/* eslint-enable */
