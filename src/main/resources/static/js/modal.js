import {$} from './element.js';

export function addCloseModalEvent(bgId, closeBtnId) {
    const bgObj = $(bgId);

    $(closeBtnId).onclick = () => {
        bgObj.style.display = 'none';
    };

    bgObj.onclick = (ev) => {
        if (ev.target.id === bgId) {
            bgObj.style.display = 'none';
        }
    };

    document.addEventListener('keyup', (ev) => {
        // keyCode == ESC
        if (ev.keyCode === 27) {
            bgObj.style.display = 'none';
        }
    }, false);
}


