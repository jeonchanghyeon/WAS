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

    col.innerHTML = text;

    func(col);

    return col;
};

export const createRow = (texts, func) => {
    const row = document.createElement("tr");

    for (let i = 0; i < texts.length; i++) {

        const col = createCol(
            texts[i],
            () => {
            }
        );

        row.appendChild(col);
    }

    func(row);

    return row;
};

export const createTbody = (lines, func) => {
    const tbody = document.createElement("tbody");

    for (let i = 0; i < lines.length; i++) {

        const row = createRow(lines[i]);

        tbody.appendChild(row);
    }

    func(tbody);

    return tbody;
};