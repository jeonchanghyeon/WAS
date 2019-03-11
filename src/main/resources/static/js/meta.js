export const getMeta = (metaName) => {
    const metaList = document.getElementsByTagName('meta');

    for (let i = 0; i < metaList.length; i++) {
        const meta = metaList[i];
        if (meta.getAttribute('name') === metaName) {
            return meta.getAttribute('content');
        }
    }

    return null;
};
