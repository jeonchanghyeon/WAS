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
<<<<<<< HEAD
    var xhr = new XMLHttpRequest();

    var branchSelect = document.getElementById("select_branch");
    var startDateSelect = document.getElementById("select_start_date");
    var endDateSelect = document.getElementById("select_end_date");

    var branchSelectText = branchSelect.options[branchSelect.selectedIndex].text;
    var startDateSelectText = startDateSelect.options[startDateSelect.selectedIndex].text;
    var endDateSelectText = endDateSelect.options[endDateSelect.selectedIndex].text;

    xhr.open("GET", "status/orders?branch=" + branchSelectText + "&start_date=" + startDateSelectText + "&end_date=" + endDateSelectText, true);
    xhr.onreadystatechange = function() {
        if(xhr.status === 200) {
            resultJsSearchList(xhr.responseText);
        }
    };
    xhr.send()
=======
    let content = null;
    ajax("status/orders", "get", resultJsSearchList);
}

function resultJsSearchList(obj) {
>>>>>>> 1527d4475cf432c4fa915fe24f4ab3bd9a794e97
}

document.getElementById("select_distributor").onchange = changeDistributeSelect;