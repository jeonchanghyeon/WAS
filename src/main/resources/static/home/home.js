function resultJsSelector(msg) {
    var container = document.getElementById("select_branch");
    container.innerHTML = '';
    var selector = document.createElement('select');
    selector.classList.add("select_branch");
    container.appendChild(selector);

    var option = document.createElement('option');
    option.defaultSelected;
    option.label = "--";
    selector.appendChild(option);

    console.log(msg);
    try {
        msg = JSON.parse(msg);
    } catch(error) {}

    var i;
    for(i = 0; i < msg.length; i++) {
        option = document.createElement('option');
        option.label = msg[i];
        selector.appendChild(option);
    }
}

function changeDistributeSelect(){
    var distributorSelect = document.getElementById("select_distributor");

    var selectText = distributorSelect.options[distributorSelect.selectedIndex].text;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "status/distributors?distributorNum=" + selectText, true);
    xhr.onreadystatechange = function() {
        if(xhr.status === 200) {
            resultJsSelector(xhr.responseText);
        }
    };
    xhr.send()
}

function resultJsSearchList(msg) {
    var container = document.getElementById('result_list')
    container.innerHTML = '';

}

function showSearchList() {

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "status/orders?data=" + 2, true);
    xhr.onreadystatechange = function() {
        if(xhr.status === 200) {
            resultJsSearchList(xhr.responseText);
        }
    };
    xhr.send()
}

document.getElementById("select_distributor").onchange = function() {changeDistributeSelect()};
