(function (xhr) {

    let XHR = XMLHttpRequest.prototype;

    let open = XHR.open;
    let send = XHR.send;

    XHR.open = function (method, url) {
        this._method = method;
        this._url = url;
        return open.apply(this, arguments);
    };

    XHR.send = function (postData) {
        this.addEventListener('load', function () {
            window.postMessage({ type: 'xhr', url: this._url, data: this.response }, '*');  // send to content script
        });
        return send.apply(this, arguments);
    };
})(XMLHttpRequest);