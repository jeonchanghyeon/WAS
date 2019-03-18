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
    const pageTab = $('header_page_tab');
    const status = '<li><a href="/statuses">현황</a></li>';
    const control = '<li><a href="/controls">관제</a></li>';
    const management = '<li><a href="#/managements">관리</a></li>';
    const shopInfo = '<li><a href="#/managements/shop_info">상점정보</a></li>';
    const riderInfo = '<li><a href="#/managements/rider_info">기사정보</a></li>';
    const statistics = '<li><a href="#/statistics">통계</a></li>';
    const settings = '<li><a href="#/settings">설정</a></li>';
    const notice = '<li><a href="/notices">공지</a></li>';

    switch (group) {
        case Group.HEAD:
        case Group.DISTRIB:
        case Group.BRANCH:
            pageTab.innerHTML = status + control + management + statistics + settings + notice;
            break;
        case Group.SHOP:
            pageTab.innerHTML = status + control + shopInfo + statistics + settings + notice;
            break;
        case Group.RIDER:
            pageTab.innerHTML = status + riderInfo + statistics + settings + notice;
            break;
    }
}

addHeader(group);