/* eslint-disable */

class InfoOverlay extends naver.maps.OverlayView {
    constructor({textColor, icon, infoName, position, map}) {
        super();

        this.textColor = textColor;
        this.icon = icon;
        this.infoName = infoName;
        this._prepareDOM();
        this.setPosition(position);
        this.setMap(map || null);
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

export class Coord {
    constructor(latitude, longitude) {
        this.latitude = latitude;
        this.longitude = longitude;
    }

    toLatLng() {
        return new naver.maps.LatLng(this.latitude, this.longitude);
    }
}

export const createMarker = ({map, position, icon}) => {
    try {
        return new naver.maps.Marker({
            map,
            position: position.toLatLng(),
            icon,
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
            center: new Coord(35.768418, 128.6050579).toLatLng(),
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

export const createInfoWindow = ({map, position, infoName, icon, textColor}) => {
    try {
        return new InfoOverlay({
            map,
            position: position.toLatLng(),
            infoName,
            icon,
            textColor,
        });
    } catch (e) {
        console.log(e);
    }
};

export const createPolyline = ({map, strokeColor, path}) => {
    try {
        return new naver.maps.Polyline({
            map,
            path: path.map(position => position.toLatLng()),
            strokeColor,
            strokeWeight: 2,
        });
    } catch (e) {
        console.log(e);
    }
};

export const getDistance = (map, src, dst) => {
    try {
        return map.getProjection().getDistance(src.toLatLng(), dst.toLatLng());
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
        return markers.map(marker => marker.getPosition());
    } catch (e) {
        console.log(e);
    }
};

export const getPolylinesCoords = (polylines) => {
    try {
        const coords = [];
        polylines.forEach((polyline) => {
            polyline.getPath().forEach((coord) => {
                coords.push(coord);
            });
        });

        return coords;
    } catch (e) {
        console.log(e);
    }
};

/* eslint-enable */
