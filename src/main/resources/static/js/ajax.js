export function ajax(url, method, func, content = null) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);


    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

    xhr.onreadystatechange = function () {
        if (this.status === 200) {
            try {
                const obj = JSON.parse(this.responseText);
                console.log(obj);
                func(obj);
            } catch (error) {
            }
        }
    };

    xhr.send(content)
}

export function withGetMethod(url, func, form) {
    try {
        const formData = new FormData(form);
        url += "?";
        url += new URLSearchParams(formData).toString();

        ajax(url, "GET", func);

    } catch (error) {
        console.log(error.message);
    }
}

const jsonify = (formData) => {

    let jsonObject = {};

    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }

    return jsonObject;
};

export function withPostMethod(url, func, form) {
    try {
        const formData = new FormData(form);
        const jsonObject = jsonify(formData);

        ajax(url, "POST", func, JSON.stringify(jsonObject));

    } catch (error) {
        console.log(error.message);
    }
}