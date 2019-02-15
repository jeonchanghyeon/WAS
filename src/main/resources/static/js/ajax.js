import {getMeta} from "./meta.js";

export const ajax = (url, method, content, pre) => new Promise(
    (resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open(method, url, true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        if (pre !== undefined) {
            pre(xhr);
        }

        xhr.onload = function () {
            if (this.status >= 200 && this.status < 400) {
                resolve(this.responseText);
            } else {
                reject(new Error("Server error"));
            }
        };

        xhr.onerror = reject;

        xhr.send(content);
    }
);

export const getJSON = (url) =>
    ajax(url, "GET").then(
        (res) => JSON.parse(res)
    );

export const setCSRFHeader = (xhr) => {
    const csrfHeader = getMeta("_csrf_header");
    const csrfToken = getMeta("_csrf");

    xhr.setRequestHeader(csrfHeader, csrfToken);
};