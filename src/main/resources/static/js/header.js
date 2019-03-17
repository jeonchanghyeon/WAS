import {$} from "./element.js";

const id = $('userId').value * 1;
const group = $('group').value * 1;

export const Group = {
    GUEST: 1,
    RIDER: 2,
    SHOP: 3,
    BRANCH: 5,
    DISTRIB: 6,
    HEAD: 7,
};

function addHeader(group) {
    const status = $('status');
    const control = $('control');
    const management = $('management');
    const statistics = $('statistics');
    const settings = $('setting');
    const notice = $('notice');

    switch(group) {
        case Group.HEAD:
        case Group.DISTRIB:
        case Group.BRANCH:
            management.setAttribute('href', '#/managements');
            statistics.setAttribute('href', '#/statistics');
            settings.setAttribute('href', '#/settings');
            break;
        case Group.SHOP:
            management.setAttribute('href', '#/management/shop_info');
            management.innerText = "상점정보";
            statistics.setAttribute('href', '#/statistics');
            settings.setAttribute('href', '#/settings');
            break;
        case Group.RIDER:
            control.innerText= '';
            control.setAttribute('href', '#');
            management.setAttribute('href', '#/managements/rider');
            management.innerText = "기사정보";
            statistics.setAttribute('href', '#/statistics');
            settings.setAttribute('href', '#/settings');
            break;
    }
}

addHeader(group);