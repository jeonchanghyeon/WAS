import {getMeta} from './meta.js';

export const ajax = (url, method, content, pre) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            resolve(this.responseText);
        } else {
            ajaxReTry(url, method, content, pre, 1, 3)
        }
    };

    xhr.onerror = reject;

    if (pre !== undefined) {
        pre(xhr);
    }

    xhr.send(content);
});

export const ajaxReTry = (url, method, content, pre, tryCount, tryLimit) => new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            resolve(this.responseText);
        } else {
            if (tryCount < tryLimit) {
                ajaxReTry(url, method, content, pre, tryCount + 1, tryLimit)
            } else {
                reject(new Error('Server error'));
            }
        }
    };

    xhr.onerror = reject;

    if (pre !== undefined) {
        pre(xhr);
    }

    xhr.send(content);
});

export const getJSON = url => ajax(url, 'GET')
    .then(res => JSON.parse(res));

export const setCSRFHeader = (xhr) => {
    const csrfHeader = getMeta('_csrf_header');
    const csrfToken = getMeta('_csrf');

    xhr.setRequestHeader(csrfHeader, csrfToken);
};
