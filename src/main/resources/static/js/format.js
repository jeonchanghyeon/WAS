export const mmdd = date => {
    const mm = fillZero(date.getMonth() + 1, 2);
    const dd = fillZero(date.getDate(), 2);

    return [mm, dd].join('-');
};

export const HHMM = (date) => {
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

export const numberWithCommas = (str) =>
    str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

export const YYYYmmdd = (date) => {
    const mm = fillZero(date.getMonth() + 1, 2);
    const dd = fillZero(date.getDate(), 2);
    const YYYY = fillZero(date.getFullYear(), 4);

    return [YYYY, mm, dd].join('-');
};