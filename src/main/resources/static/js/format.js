export const fillZero = (srcNumber, digit) => {
    const number = srcNumber.toString();
    const zeroNum = digit - number.length;

    if (zeroNum < 0) {
        return number;
    }

    return '0'.repeat(zeroNum) + number;
};

export const mmdd = (str) => {
    const date = new Date(str);

    const mm = fillZero(date.getMonth() + 1, 2);
    const dd = fillZero(date.getDate(), 2);

    return [mm, dd].join('-');
};

export const HHMM = (str) => {
    const date = new Date(str);

    if (Number.isNaN(Number(date))) {
        return '-';
    }

    const HH = fillZero(date.getHours(), 2);
    const MM = fillZero(date.getMinutes(), 2);

    return [HH, MM].join(':');
};

export const numberWithCommas = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const YYYYmmdd = (date) => {
    const mm = fillZero(date.getMonth() + 1, 2);
    const dd = fillZero(date.getDate(), 2);
    const YYYY = fillZero(date.getFullYear(), 4);

    return [YYYY, mm, dd].join('-');
};
