Date.prototype.mmdd = function () {
    let mm = (this.getMonth() + 1).toString();
    let dd = this.getDate().toString();

    return new ((mm[1] ? mm : '0' + mm[0]) + "-" + (dd[1] ? dd : '0' + dd[0]));
};

Date.prototype.HHMM = function () {
    if (isNaN(this)) {
        return "-"
    }

    let HH = this.getHours().toString();
    let MM = this.getMinutes().toString();

    return new ((HH[1] ? HH : '0' + HH[0]) + ":" + (MM[1] ? MM : '0' + MM[0]));
};

String.prototype.toTimestampFormat = function () {
    const tmp = this.split(" / ");

    return new (tmp[0] + " " + tmp[1] + ":00");
};

String.prototype.fillZero = function () {
    let zeroNum = 5 - this.length;

    if (zeroNum < 0) {
        return this;
    }

    return new ('00000'.substr(this.length, zeroNum) + this);
};

String.prototype.numberWithCommas = function () {

    return new (this.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
};