export const $ = id => document.getElementById(id);

export const appendOptions = (element, srcOptions) => {
    element.innerHTML = '';

    srcOptions.forEach((srcOption) => {
        const option = document.createElement('option');
        ({text: option.text, value: option.value} = srcOption);
        element.appendChild(option);
    });
};

export const createCol = (text, func) => {
    const col = document.createElement('td');
    col.append(text);
    if (func !== undefined) {
        func(col);
    }
    return col;
};

export const createRow = (texts, func) => {
    const row = document.createElement('tr');

    texts.forEach((text) => {
        const col = createCol(text);
        row.appendChild(col);
    });

    if (func !== undefined) {
        func(row);
    }
    return row;
};

export const jsonifyFormData = (formData) => {
    const jsonObject = {};

    const entry = formData.entries();
    /* eslint-disable */
    for (const [k, v] of entry) {
        jsonObject[k] = v;
    }
    /* eslint-enable */

    return jsonObject;
};

export const formSerialize = (formData) => {
    const jsonObject = jsonifyFormData(formData);
    return Object.entries(jsonObject)
        .map(entry => entry
            .map(element => encodeURIComponent(element))
            .join('='))
        .join('&');
};

export const getClosureToSelectButton = (buttons, selected, unselected) => (index) => {
    for (let i = 0; i < buttons.length; i++) {
        const button = buttons[i];
        if (button != null) {
            button.className = (i === index) ? selected : unselected;
        }
    }
};
