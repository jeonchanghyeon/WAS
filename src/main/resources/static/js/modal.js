import {$} from './element.js';

export function addCloseModalEvent(bgId, closeBtnId) {
    addCloseButtonEvent(bgId, closeBtnId);
    addCloseBackgroundClickEvent(bgId);
    // addCloseKeyEvent(bgId);
}

export function addCloseBackgroundClickEvent(bgId) {
    const bgObj = $(bgId);

    bgObj.onclick = function(ev) {
        if (ev.target.id === bgId) {
            bgObj.style.display = 'none';
        }
    };
}

// export function addCloseKeyEvent(bgId) {
//     const bgObj = $(bgId);
//     bgObj.tabIndex = "0";
//
//     bgObj.onkeydown = function(ev) {
//         const ESC = 27;
//         ev = ev || window.event;
//         const keyID = (ev.which) ? ev.which : ev.keyCode;
//         console.log(keyID);
//         if(keyID === ESC) {
//             bgObj.style.display = "none";
//             return;
//         }
//         return false;
//     };
//
//     bgObj.focus();
// }

export function addCloseButtonEvent(bgId, closeBtnId) {
    const bgObj = $(bgId);
    const closeButton = $(closeBtnId);

    closeButton.onclick = function() {
        bgObj.style.display = "none";
    };
}
