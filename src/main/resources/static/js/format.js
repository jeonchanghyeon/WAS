export const mmdd = date => {
    const mm = (date.getMonth() + 1).toString();
    const dd = date.getDate().toString();

    return (mm[1] ? mm : '0' + mm[0]) + "-" + (dd[1] ? dd : '0' + dd[0]);
};

export const HHMM = (date) => {
    if (isNaN(date)) {
        return "-"
    }

    const HH = date.getHours().toString();
    const MM = date.getMinutes().toString();

    return (HH[1] ? HH : '0' + HH[0]) + ":" + (MM[1] ? MM : '0' + MM[0]);
};

export const fillZero = (str, digit) => {
    const zeroNum = digit - str.length;
    if (zeroNum < 0) {
        return str;
    }
    return '00000'.substr(str.length, zeroNum) + str;
};

export const numberWithCommas = (str) => str.replace(/\B(?=(\d{3})+(?!\d))/g, ",");