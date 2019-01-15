
export const calendarListener = () => {
    let myCalendar;
    dhtmlXCalendarObject.prototype.langData["kr"] = {
        dateformat: '%Y-%m-%d 09:00:00',
        monthesFNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        monthesSNames: ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        daysFNames: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
        daysSNames: ["일", "월", "화", "수", "목", "금", "토"],
        weekstart: 1,
        weekname: "w",
        today: "Heute",
        clear: "Reinigen"
    };
    myCalendar = new dhtmlXCalendarObject(["select_start_date", "select_end_date"]);
    myCalendar.hideTime();
    myCalendar.loadUserLanguage('kr');
};