export const $ = (id) => document.getElementById(id);

export const appendOptions = (element, options) => {
    element.innerHTML = "";

    for (let i = 0; i < options.length; i++) {
        const option = document.createElement('option');

        option.text = options[i].text;
        option.value = options[i].value;

        if (i === 0) {
            option.defaultSelected;
        }

        element.appendChild(option);
    }
};

export const createCol = (text, func) => {
    const col = document.createElement("td");

    col.append(text);

    if (func !== undefined) {
        func(col);
    }

    return col;
};

export const createRow = (texts, func) => {
    const row = document.createElement("tr");

    for (let i = 0; i < texts.length; i++) {
        const col = createCol(texts[i]);

        row.appendChild(col);
    }

    if (func !== undefined) {
        func(row);
    }

    return row;
};

export const createTbody = (lines, func) => {
    const tbody = document.createElement("tbody");

    for (let i = 0; i < lines.length; i++) {
        const row = createRow(lines[i]);

        tbody.appendChild(row);
    }

    if (func !== undefined) {
        func(tbody);
    }

    return tbody;
};

export const formSerialize = (formData) => {
    const jsonObject = jsonifyFormData(formData);

    return Object.entries(jsonObject).map(
        entry => entry.map(
            element => encodeURIComponent(element)
        ).join('=')
    ).join('&');
};

export const jsonifyFormData = (formData) => {
    const jsonObject = {};

    for (const [key, value] of formData.entries()) {
        jsonObject[key] = value;
    }

    return jsonObject;
};

export const getClosureToSelectButton = (buttons, selected, unselected) => {
    return (index) => {
        for (let i = 0; i < buttons.length; i++) {
            buttons[i].className = (i === index) ? selected : unselected;
        }
    };
};