import {ajax} from './ajax.js'

let receptForm = document.getElementById("recept_form");

const jsonify = (formData) => {

    let jsonObject = {};

    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }

    return jsonObject;
};

receptForm.onsubmit = function () {
    try {
        const url = "";
        const formData = new FormData(receptForm);
        const jsonObject = jsonify(formData);

        ajax(url, "POST", null, JSON.stringify(jsonObject));

    } catch (error) {
        console.log(error.message);
    }

    return false;
};