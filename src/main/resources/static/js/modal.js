import {$} from "./element.js";

export function addCloseModalEvent(bgId, closeBtnId) {
    let bgObj = $(bgId);

    addCloseButtonEvent(bgId, closeBtnId);

    if (bgObj !== null) {
        bgObj.onclick = (ev) => {
            if (ev.target.id === bgId) {
                bgObj.style.display = "none";
            }
        };
    }

    // document.addEventListener("keyup", function(ev) {
    //     //keyCode == ESC
    //     console.log(ev.target.id);
    //
    // }, false);
}

export function addCloseButtonEvent(bgId, closeBtnId) {
    let bgObj = $(bgId);
    let closeButton = $(closeBtnId);

    if (closeButton !== null && bgObj !== null) {
        closeButton.onclick = () => {
            bgObj.style.display = "none";
        };
    }
}
