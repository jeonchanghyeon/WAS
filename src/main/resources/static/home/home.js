// var httpRequest;
//
// function createRequest() {
//
//     if (window.XMLHttpRequest) { // 익스플로러 7과 그 이상의 버전, 크롬, 파이어폭스, 사파리, 오페라 등
//
//         return new XMLHttpRequest();
//
//     } else {                     // 익스플로러 6과 그 이하의 버전
//
//         return new ActiveXObject("Microsoft.XMLHTTP");
//
//     }
// }
//
//
// httpRequest = createRequest()
//
// httpRequest.open("GET",  "/status/orders? ", true);
// httpRequest.send();
//
// if (httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200 ) {
//
// }
//
// document.getElementById("status").innerHTML = currentState;
//
// if (httpRequest.readyState == XMLHttpRequest.DONE && httpRequest.status == 200 ) {
//     document.getElementById("text").innerHTML = httpRequest.responseText;
// }