var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected.js');
s.onload = function () {
    this.remove();
};
(document.head || document.documentElement).appendChild(s);

let lastPosting = {};

// receive message from injected script
window.addEventListener('message', function (e) {
    if (e.data.url === "/api/inbound/articles/resolve-v3") {
        console.log('content script received:' , e.data.type, e.data.url, e.data.data);
        const data = JSON.parse(e.data.data);
        lastPosting = {
            "id": data.id,
            "barcode": data.barcode,
            "address": data.address,
        };
    }

    if (e.data.url === "/api/inbound/clearing/articles/receive") {
        console.warn('content script received:' , e.data.type, e.data.url, e.data.data);
        const data = JSON.parse(e.data.data);
        console.log(data, typeof data)
        console.log(data.state.articleId === lastPosting.id, data.state.articleId, lastPosting.id, data.state.articleBarcode === lastPosting.barcode, data.state.articleBarcode, lastPosting.barcode)
        if (data.state.articleId === lastPosting.id && data.state.articleBarcode === lastPosting.barcode && data.state.articleBarcode.startsWith('ii') && lastPosting.address !== "19") {
            // TODO: status Success
            console.log('print', lastPosting.address, lastPosting.barcode)
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "http://localhost:8000/print/" + lastPosting.address + "/" + lastPosting.barcode, true);
            xhr.send(null);
        }
    }



    // if (e.data.url === "/api/address-storage/Movement/put/v2") {
    //     console.log('content script received:' , e.data.type, e.data.url, e.data.data);
    // }

});


