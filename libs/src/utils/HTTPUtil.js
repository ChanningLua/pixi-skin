var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { cloneObject } from "./ObjectUtil";
import { joinQueryParams, trimURL, validateProtocol } from "./URLUtil";
export function load(params) {
    if (!params.url) {
        params.onResponse && params.onResponse();
        return;
    }
    if (params.url instanceof Array) {
        var urls = params.url;
        var results = [];
        var newParams = cloneObject(params);
        newParams.onResponse = function (result) {
            results.push(result);
            loadNext();
        };
        var loadNext = function () {
            if (urls.length <= 0) {
                params.onResponse && params.onResponse(results);
                return;
            }
            newParams.url = urls.shift();
            load(newParams);
        };
        loadNext();
        return;
    }
    var retryTimes = params.retryTimes || 2;
    var timeout = params.timeout || 10000;
    var method = params.method || "GET";
    var timeoutId = 0;
    var data = params.data || {};
    var url = params.url;
    url = validateProtocol(url, params.forceHTTPS ? "https:" : null);
    url = trimURL(url);
    var xhr = (window["XDomainRequest"] && navigator.userAgent.indexOf("MSIE 10.") < 0 ? new window["XDomainRequest"]() : new XMLHttpRequest());
    send();
    function send() {
        var sendData = null;
        switch (method) {
            case "POST":
                switch (params.headerDict && params.headerDict["Content-Type"]) {
                    case "application/x-www-form-urlencoded":
                        sendData = toFormParams(data);
                        break;
                    case "multipart/form-data":
                        sendData = new FormData();
                        for (var key_1 in data) {
                            sendData.append(key_1, data[key_1]);
                        }
                        break;
                    default:
                        sendData = JSON.stringify(data);
                        break;
                }
                break;
            case "GET":
                url = joinQueryParams(url, data);
                break;
            default:
                throw new Error("暂不支持的HTTP Method：" + method);
        }
        xhr.open(method, url, true);
        if (params.responseType)
            xhr.responseType = params.responseType;
        if (params.withCredentials)
            xhr.withCredentials = true;
        xhr.onload = onLoad;
        xhr.onerror = onError;
        if (xhr.setRequestHeader) {
            for (var key in params.headerDict) {
                xhr.setRequestHeader(key, params.headerDict[key]);
            }
        }
        xhr.send(sendData);
        timeoutId = window.setTimeout(onError, timeout);
    }
    function onLoad(evt) {
        var statusHead = xhr.status ? Math.floor(xhr.status * 0.01) : 2;
        switch (statusHead) {
            case 2:
            case 3:
                timeoutId && clearTimeout(timeoutId);
                timeoutId = 0;
                params.onResponse && params.onResponse(xhr.response || xhr.responseText);
                break;
            case 4:
            case 5:
                onError();
                break;
        }
    }
    function onError() {
        timeoutId && clearTimeout(timeoutId);
        timeoutId = 0;
        if (Math.floor(xhr.status / 100) === 5 && retryTimes > 0) {
            abortAndRetry();
        }
        else {
            params.onError && params.onError(new XHRError(xhr));
        }
    }
    function abortAndRetry() {
        retryTimes--;
        xhr.abort();
        url = joinQueryParams(url, { _r: Date.now() });
        send();
    }
}
export function asyncLoad(params) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2, new Promise(function (resolve, reject) {
                    params.onResponse = resolve;
                    params.onError = reject;
                    load(params);
                })];
        });
    });
}
export function toFormParams(data) {
    var keys = Object.keys(data);
    var params = keys.map(function (key) {
        return encodeURIComponent(key) + "=" + encodeURIComponent(data[key]);
    });
    return params.join("&");
}
var XHRError = (function (_super) {
    __extends(XHRError, _super);
    function XHRError(xhr) {
        var _this = _super.call(this, xhr.status ? xhr.status + " " + xhr.statusText : "请求错误，且无法获取错误信息") || this;
        _this._xhr = xhr;
        return _this;
    }
    Object.defineProperty(XHRError.prototype, "xhr", {
        get: function () {
            return this._xhr;
        },
        enumerable: false,
        configurable: true
    });
    return XHRError;
}(Error));
export { XHRError };
//# sourceMappingURL=HTTPUtil.js.map