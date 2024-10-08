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
        console.log('/resolve-v3 received:' , e.data.type, e.data.url, e.data.data);
        const data = JSON.parse(e.data.data);
        lastPosting = {
            "id": data.id,
            "barcode": data.barcode,
            "address": data.address,
        };
    }

    if (e.data.url === "/api/inbound/clearing/articles/receive") {
        console.log('receive received:' , e.data.type, e.data.url, e.data.data);
        const data = JSON.parse(e.data.data);
        console.log(data, typeof data)
        console.log("preprint", data.state.articleId === lastPosting.id, data.state.articleId, lastPosting.id, data.state.articleBarcode === lastPosting.barcode, data.state.articleBarcode, lastPosting.barcode)
        if (data.state.articleId === lastPosting.id && lastPosting.address !== "19" && !lastPosting.address.startsWith("Дроп") && !lastPosting.address.startsWith("RET") && data.state.status === "Success") {
            // TODO: status Success
            
            console.warn('print', lastPosting.address, lastPosting.barcode)
            let xhr = new XMLHttpRequest();
            xhr.open("GET", "http://localhost:8000/print/" + lastPosting.address + "/" + lastPosting.barcode, true);
            xhr.send(null);
        }
    }



    // if (e.data.url === "/api/address-storage/Movement/put/v2") {
    //     console.log('content script received:' , e.data.type, e.data.url, e.data.data);
    // }

});


