export const mmdd = str => {
    const date = new Date(str);

    const mm = fillZero(date.getMonth() + 1, 2);
    const dd = fillZero(date.getDate(), 2);

    return [mm, dd].join('-');
};

export const HHMM = (str) => {
    const date = new Date(str);

    if (isNaN(date)) {
        return "-"
    }

    const HH = fillZero(date.getHours(), 2);
    const MM = fillZero(date.getMinutes(), 2);

    return [HH, MM].join(':');
};

export const fillZero = (number, digit) => {
    number = number.toString();
    const zeroNum = digit - number.length;

    if (zeroNum < 0) {
        return number;
    }

    return '0'.repeat(zeroNum) + number;
};

export const numberWithCommas = (number) =>
    number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const numberCommasRemove = (number) =>
    number.replace(/,/g, "");

export const YYYYmmdd = (date) => {
    const mm = fillZero(date.getMonth() + 1, 2);
    const dd = fillZero(date.getDate(), 2);
    const YYYY = fillZero(date.getFullYear(), 4);

    return [YYYY, mm, dd].join('-');
};

export function filterNumber(event) {
    event.stopPropagation();
    const ENTER = 13, BACKSPACE = 8, TAB = 9, DELETE = 46, NUMLOCK = 144, END = 35, HOME = 36;
    event.target.style.imeMode = 'disabled';
    event = event || window.event;

    let keyID = (event.which) ? event.which : event.keyCode;
    let result = (keyID >= 48 && keyID <= 57) || (keyID >= 96 && keyID <= 105)  //숫자키
        || (keyID >= 37 && keyID <= 40) //방향키
        || (keyID === ENTER || keyID === BACKSPACE || keyID === TAB || keyID === DELETE || keyID === NUMLOCK || keyID === END || keyID === HOME)
        || (event.ctrlKey || event.altKey); //특수키;
    if (!result) {
        event.preventDefault();
    }
    return result;
}

export function isNumber(v) {
    let reg = /^(\s|\d)+$/;
    return reg.test(v);
}
