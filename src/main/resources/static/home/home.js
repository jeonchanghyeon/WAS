function ajax(url, method, func, content = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);

    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            try {
                const obj = JSON.parse(this.responseText);
                func(obj);
            } catch (error) {
            }
        }
    };

    xhr.send(content)
}

function changeDistributeSelect() {
    const distributorSelect = document.getElementById("select_distributor");
    const selectText = distributorSelect.options[distributorSelect.selectedIndex].text;

    ajax("status/distributors?distributorNum=" + selectText, "get", resultJsSelector)
}

function resultJsSelector(obj) {
    const selector = document.getElementById('select_branch');
    let option = document.createElement('option');

    selector.innerHTML = "";
    option.defaultSelected;
    option.value = "";
    option.text = "--";
    selector.appendChild(option);

    for (let i = 0; i < obj.length; i++) {
        option = document.createElement('option');
        option.value = obj[i];
        option.text = obj[i];
        selector.appendChild(option);
    }
}

function showSearchList() {
    let content = null;
    ajax("status/orders", "get", resultJsSearchList);
}

function resultJsSearchList(obj) {

}

document.getElementById("select_distributor").onchange = changeDistributeSelect;