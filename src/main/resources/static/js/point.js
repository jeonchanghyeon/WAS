import {ajax} from "./ajax.js";

export function loadPoint() {
    const url = "/api/point";

    ajax(
        url,
        "GET",
        (obj) => {
            document.getElementById("point").innerText = obj
            console.log(obj);
        }
    );
}