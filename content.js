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
        console.log(data.articleId === lastPosting.id, data.articleId, lastPosting.id, data.articleBarcode === lastPosting.barcode, data.articleBarcode, lastPosting.barcode)
        if (data.articleId === lastPosting.id && data.articleBarcode === lastPosting.barcode) {
            // TODO: status Success
            console.log('print', lastPosting.address, lastPosting.barcode)
        }

        // console.log(lastPosting)

        // let xhr = new XMLHttpRequest();
        // xhr.open("POST", "http://localhost:8989", true);
        // xhr.setRequestHeader('Content-Type', 'application/json');
        // xhr.send(JSON.stringify({
        //     hello: "world",
        // }));
    }



    // if (e.data.url === "/api/address-storage/Movement/put/v2") {
    //     console.log('content script received:' , e.data.type, e.data.url, e.data.data);
    // }

    // TODO: post request to backend
});


