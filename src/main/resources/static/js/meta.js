export const getMeta = (metaName) =>
    [...document.getElementsByTagName("meta")].find(
        (meta) => meta.getAttribute("name") === metaName
    ).getAttribute("content");