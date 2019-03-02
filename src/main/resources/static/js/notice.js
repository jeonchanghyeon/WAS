import {ajax, getJSON, setCSRFHeader} from "./ajax.js";
import {loadPoint} from "./point.js";
import {$, appendOptions, createRow, formSerialize, jsonifyFormData} from "./element.js";
import {fillZero} from "./format.js"

loadPoint();

const distribSelect = $("select-distrib-branch");
const userId = $("userId").value;

const displayDiv = (num) => {
    const ids = [
        "head-notice-area",
        "distrib-notice-area",
        "branch-notice-area",
        "notice-post-area",
        "notice-detail-area",
        "notice-modify-area"
    ];

    for (let i = 0; i < ids.length; i++) {
        const div = $(ids[i]);
        if (div !== null) {
            if (num === i) {
                div.style.display = "initial";
            } else {
                div.style.display = "none";
            }
        }
    }

    if (num === 3) {
        console.log(num);
        const checkboxIds = ["666", "555", "333", "444"];

        for (let checkboxId of checkboxIds) {
            const checkbox = $(checkboxId);
            if (checkbox !== null) {
                checkbox.checked = true;
            }
        }

        $("post-title").value = '';
        $("post-content").value = '';
    }
};

const changeButton = (num) => {
    const ids = [
        "btn-head-notice",
        "btn-distrib-notice",
        "btn-branch-notice"
    ];

    for (let i = 0; i < ids.length; i++) {
        const button = $(ids[i]);
        if (button !== null) {
            if (num === i) {
                button.className = "btn-notice-confirm-selected";
            } else {
                button.className = "btn-notice-confirm";
            }
        }
    }
};

const submitBranchForm = () => {
    const formData = new FormData($("branch-notice-form"));

    getJSON('/api/notices?' + formSerialize(formData)).then(
        (obj) => {
            const notices = obj["notices"];
            const tbody = $("result-branch-notice");

            createNoticeList(tbody, notices);
        }
    );
};

const submitDistribForm = () => {
    const formData = new FormData($("distrib-notice-form"));

    getJSON('/api/notices?' + formSerialize(formData)).then(
        (obj) => {
            const notices = obj["notices"];
            const tbody = $("result-distrib-notice");

            createNoticeList(tbody, notices);
        }
    );
};

const submitHeadForm = () => {
    const formData = new FormData($("head-notice-form"));

    getJSON('/api/notices?' + formSerialize(formData)).then(
        (obj) => {
            const notices = obj["notices"];
            const tbody = $("result-head-notice");

            createNoticeList(tbody, notices);
        }
    );
};

const parseTypes = (types) => {
    const parsedTypes = [];

    const strs = ["", "기사 전체", "상점 전체", "", "지사 전체", "총판 전체"];

    for (let i = 0; i < types.length; i++) {
        const group = parseInt(types[i]);

        parsedTypes.push(strs[group - 1]);
    }

    return parsedTypes;
};

const noticeIds = [];

const getPrevId = (noticeIds, currentId) => {

    for (let i = 1; i < noticeIds.length; i++) {
        if (currentId == noticeIds[i]) {
            return noticeIds[i - 1];
        }
    }

    return -1;
};

const getNextId = (noticeIds, currentId) => {

    for (let i = 0; i < noticeIds.length - 1; i++) {
        if (currentId == noticeIds[i]) {
            return noticeIds[i + 1];
        }
    }

    return -1;
};

const createNoticeList = (tbody, notices) => {
    tbody.innerHTML = '';
    noticeIds.length = 0;

    for (let i = 0; i < notices.length; i++) {
        const line = [];

        const sequence = fillZero((i + 1).toString(), 5);

        line.push(sequence);
        line.push(notices[i]["createDate"]);
        line.push(parseTypes(notices[i]["types"]));
        line.push(notices[i]["title"]);

        const noticeId = notices[i]["id"];

        noticeIds.push(noticeId);

        const row = createRow(line, (row) => {
            row.ondblclick = () => {
                getJSON("/api/notices/" + noticeId).then(
                    (obj) => {
                        const notice = obj["notice"];

                        const id = notice["id"];
                        const title = notice["title"];
                        const content = notice["content"];
                        const writerName = notice["writerName"];
                        const createDate = notice["createDate"];
                        const types = notice["types"];

                        $("detail-types").innerHTML = parseTypes(types);
                        $("detail-notice-id").value = id;
                        $("detail-writer-name").innerHTML = writerName;
                        $("detail-title").innerHTML = title;
                        $("detail-content").innerHTML = content;
                        $("detail-createDate").innerHTML = createDate;

                        displayDiv(4);
                    }
                );
            };
        });

        tbody.appendChild(row);
    }
};

const loadHeadNotice = () => {
    submitHeadForm();
    changeButton(0);
    displayDiv(0);
};

const loadDistribNotice = () => {
    submitDistribForm();
    changeButton(1);
    displayDiv(1);
};

const loadBranchNotice = () => {
    submitBranchForm();
    changeButton(2);
    displayDiv(2);
};

if ($("btn-head-notice") !== null) {
    $("btn-head-notice").onclick = loadHeadNotice;
}

if ($("btn-distrib-notice") !== null) {
    $("btn-distrib-notice").onclick = loadDistribNotice;
}

if ($("btn-branch-notice") !== null) {
    $("btn-branch-notice").onclick = loadBranchNotice;
}

if ($("btn-new-notice") !== null) {
    $("btn-new-notice").onclick = () => {
        displayDiv(3);
    };
}

const getDistribList = (headId, element) => {
    getJSON("/api/distribs?id=" + headId).then(
        (obj) => {
            const options = [{
                value: "",
                text: "총판 선택"
            }];

            for (let o of obj) {
                const id = o["id"];
                const name = o["name"];

                options.push({
                    value: id,
                    text: name
                });
            }

            appendOptions(element, options);
        });
};

const getBranchList = (distribId, element) => {
    getJSON("/api/branches/list?id=" + distribId).then(
        (obj) => {
            const options = [{
                value: "",
                text: "지사 선택"
            }];

            for (let o of obj) {
                const id = o["id"];
                const name = o["name"];

                options.push({
                    value: id,
                    text: name
                });
            }

            appendOptions(element, options);
        });
};

if (distribSelect !== null) {
    getDistribList(userId, distribSelect);
}
if ($("select-branch") !== null) {
    appendOptions($("select-branch"), [{text: "지사 선택", value: "-1"}]);
}

if ($("select-distrib-head") != null) {
    getDistribList(userId, $("select-distrib-head"));
}

if (distribSelect !== null) {
    distribSelect.onchange = function () {
        const distribId = this.options[this.selectedIndex].value;
        const branchSelect = $("select-branch");

        console.log(this.selectedIndex);
        if (this.selectedIndex === 0) {
            appendOptions(branchSelect, [{text: "지사 선택", value: "-1"}]);
        } else {
            getBranchList(distribId, branchSelect);
        }
    };
}

if ($("select-distrib-head") !== null) {
    $("select-distrib-head").onchange = () => {
        submitDistribForm();
    };
}

if ($("select-branch") !== null) {
    $("select-branch").onchange = () => {
        submitBranchForm();
    };
}

if ($("branch-notice-form") !== null) {
    $("branch-notice-form").onsubmit = () => {
        submitBranchForm();

        return false;
    };
}

if ($("distrib-notice-form") !== null) {
    $("distrib-notice-form").onsubmit = () => {
        submitDistribForm();

        return false;
    };
}

if ($("head-notice-form") !== null) {
    $("head-notice-form").onsubmit = () => {
        submitHeadForm();

        return false;
    };
}

if ($("checkbox-shop-branch") !== null) {
    $("checkbox-shop-branch").onclick
        = $("checkbox-rider-branch").onclick
        = () => {
        submitBranchForm();
    };
}


if ($("checkbox-branch-distrib") !== null) {
    $("checkbox-branch-distrib").onclick = () => {
        submitDistribForm();
    };
}

const checkboxIds = [
    "checkbox-branch-head",
    "checkbox-distrib-head",
    "checkbox-shop-head",
    "checkbox-rider-head"
];

for (let checkboxId of checkboxIds) {
    const checkbox = $(checkboxId);

    if (checkbox !== null) {
        checkbox.onclick = submitHeadForm;
    }
}

if ($("form-notice-post") !== null) {
    $("form-notice-post").onsubmit = () => {

        const formData = new FormData($("form-notice-post"));

        let jsonObject = jsonifyFormData(formData);

        const checkboxIds = ["666", "555", "333", "444"];

        let arr = [];

        for (let checkboxId of checkboxIds) {
            const checkbox = $(checkboxId);

            if (checkbox !== null) {
                if (checkbox.checked === true) {
                    arr.push(checkbox.value);
                }
            }
        }

        jsonObject["types"] = arr;

        ajax(
            "/api/notices",
            "PUT",
            JSON.stringify(jsonObject),
            setCSRFHeader
        ).then(loadHeadNotice);

        return false;
    };
}

if ($("form-notice-modify") !== null) {
    $("form-notice-modify").onsubmit = () => {
        const id = $("modify-notice-write-id").value;
        const formData = new FormData($("form-notice-modify"));

        let jsonObject = jsonifyFormData(formData);

        const checkboxIds = ["5555", "3333", "4444", "6666"];

        let arr = [];

        for (let checkboxId of checkboxIds) {
            const checkbox = $(checkboxId);

            if (checkbox !== null) {
                if (checkbox.checked === true) {
                    arr.push(checkbox.value);
                }
            }
        }

        jsonObject["types"] = arr;

        ajax(
            "/api/notices/" + id,
            "POST",
            JSON.stringify(jsonObject),
            setCSRFHeader
        ).then(loadHeadNotice);

        return false;
    };
}

$("btn-modify").onclick = () => {
    const noticeId = $("detail-notice-id").value;

    getJSON("/api/notices/" + noticeId).then(
        (obj) => {
            const notice = obj["notice"];

            const types = notice["types"];

            for (let i = 0; i < types.length; i++) {
                console.log(types[i]);
                if (types[i].toString() === "5") {
                    $("5555").checked = true;
                } else if (types[i].toString() === "3") {
                    $("3333").checked = true;
                } else if (types[i].toString() === "2") {
                    $("4444").checked = true;
                } else if (types[i].toString() === "6") {
                    $("6666").checked = true;
                }
            }

            const id = notice["id"];
            const title = notice["title"];
            const content = notice["content"];

            $("modify-notice-write-id").value = id;
            $("modify-title").value = title;
            $("modify-content").innerHTML = content;

            displayDiv(5);
        }
    );
};

$("btn-remove").onclick = () => {
    const id = $("detail-notice-id").value;

    ajax(
        "/api/notices/" + id,
        "DELETE",
        null,
        setCSRFHeader
    ).then(loadHeadNotice);
};

$("btn-pre").onclick = () => {

    const noticeId = $("detail-notice-id").value;
    const prevId = getPrevId(noticeIds, noticeId);

    if (prevId !== -1) {
        getJSON("/api/notices/" + prevId).then(
            (obj) => {
                const notice = obj["notice"];

                const id = notice["id"];
                const title = notice["title"];
                const content = notice["content"];
                const writerName = notice["writerName"];
                const createDate = notice["createDate"];
                const types = notice["types"];

                $("detail-types").innerHTML = parseTypes(types);
                $("detail-notice-id").value = id;
                $("detail-writer-name").innerHTML = writerName;
                $("detail-title").innerHTML = title;
                $("detail-content").innerHTML = content;
                $("detail-createDate").innerHTML = createDate;

                displayDiv(4);
            }
        );
    }
};

$("btn-post").onclick = () => {

    const noticeId = $("detail-notice-id").value;
    const nextId = getNextId(noticeIds, noticeId);

    if (nextId !== -1) {
        getJSON("/api/notices/" + nextId).then(
            (obj) => {
                const notice = obj["notice"];

                const id = notice["id"];
                const title = notice["title"];
                const content = notice["content"];
                const writerName = notice["writerName"];
                const createDate = notice["createDate"];
                const types = notice["types"];

                $("detail-types").innerHTML = parseTypes(types);
                $("detail-notice-id").value = id;
                $("detail-writer-name").innerHTML = writerName;
                $("detail-title").innerHTML = title;
                $("detail-content").innerHTML = content;
                $("detail-createDate").innerHTML = createDate;

                displayDiv(4);
            }
        );
    }
};

loadHeadNotice();
