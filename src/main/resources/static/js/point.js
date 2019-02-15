import {$} from "./element.js";
import {getJSON} from "./ajax.js";

export const loadPoint = () =>
    getJSON("/api/point").then(
        (obj) => {
            const point = obj["point"]["point"].toString();
            $("point").innerText = point;
        }
    );
