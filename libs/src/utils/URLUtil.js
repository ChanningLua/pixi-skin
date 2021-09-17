var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
import { extendObject } from "./ObjectUtil";
export function getCurOrigin() {
    if (window.location.origin)
        return window.location.origin;
    return (window.location.protocol + "//" + window.location.host);
}
export function trimURL(url) {
    url = url.replace(/([^:\/]|(:\/))\/+/g, "$1/");
    if (url.charAt(0) == "/")
        url = url.substr(1);
    var reg = /(?!:\/{2,}[^\/]+\/)([^\/\.]+)\/[^\/\.]+?\/\.\.\//;
    while (reg.test(url)) {
        url = url.replace(reg, "/$1");
    }
    var reg = /\/\.{1,2}\//;
    while (reg.test(url)) {
        url = url.replace(reg, "/");
    }
    return url;
}
export function isAbsolutePath(url) {
    if (url == null)
        return false;
    return (url.indexOf("://") >= 0);
}
export function validateProtocol(url, protocol) {
    if (url == null)
        return null;
    var index = url.indexOf("://");
    if (index < 0)
        return url;
    index++;
    if (protocol) {
        return protocol + url.substr(index);
    }
    else {
        protocol = url.substring(0, index);
        if (protocol == "http:" || protocol == "https:") {
            return window.location.protocol + url.substr(index);
        }
        if (protocol == "ws:" || protocol == "wss:") {
            if (window.location.protocol == "https:")
                protocol = "wss:";
            else
                protocol = "ws:";
            return protocol + url.substr(index);
        }
        return url;
    }
}
export function wrapHost(url, host, forced) {
    if (forced === void 0) { forced = false; }
    if (url == null)
        return url;
    host = host || getCurOrigin();
    var re = /^(?:[^\/]+):\/{2,}(?:[^\/]+)\//;
    var arr = url.match(re);
    if (arr && arr.length > 0) {
        if (forced) {
            url = url.substr(arr[0].length);
            url = host + "/" + url;
            url = validateProtocol(url);
        }
    }
    else {
        url = host + "/" + url;
        url = validateProtocol(url);
    }
    url = trimURL(url);
    return url;
}
export function wrapAbsolutePath(relativePath, host) {
    var curPath = getPath(window.location.href);
    var url = trimURL(curPath + "/" + relativePath);
    if (host != null) {
        url = wrapHost(url, host, true);
    }
    return url;
}
export function getHostAndPathname(url) {
    if (url == null)
        throw new Error("url不能为空");
    url = url.split("#")[0].split("?")[0];
    url = trimURL(url);
    return url;
}
export function getPath(url) {
    url = getHostAndPathname(url);
    var urlArr = url.split("/");
    urlArr.pop();
    return urlArr.join("/") + "/";
}
export function getName(url) {
    url = url.split("#")[0].split("?")[0];
    var urlArr = url.split("/");
    var fileName = urlArr[urlArr.length - 1];
    return fileName;
}
export function parseUrl(url) {
    var regExp = /(([^:]+:)\/{2,}(([^:\/\?#]+)(:(\d+))?))?(\/[^?#]*)?(\?[^#]*)?(#.*)?/;
    var match = regExp.exec(url);
    if (match) {
        return {
            href: match[0] || "",
            origin: match[1] || "",
            protocol: match[2] || "",
            host: match[3] || "",
            hostname: match[4] || "",
            port: match[6] || "",
            pathname: match[7] || "",
            search: match[8] || "",
            hash: (match[9] == "#" ? "" : match[9]) || ""
        };
    }
    else {
        throw new Error("传入parseUrl方法的参数不是一个完整的URL：" + url);
    }
}
export function getQueryParams(url) {
    var e_1, _a;
    var index = url.indexOf("#");
    if (index >= 0) {
        url = url.substring(0, index);
    }
    index = url.indexOf("?");
    if (index < 0)
        return {};
    var queryString = url.substring(index + 1);
    var params = {};
    var kvs = queryString.split("&");
    try {
        for (var kvs_1 = __values(kvs), kvs_1_1 = kvs_1.next(); !kvs_1_1.done; kvs_1_1 = kvs_1.next()) {
            var kv = kvs_1_1.value;
            var pair = kv.split("=", 2);
            if (pair.length !== 2 || !pair[0]) {
                console.log("[URLUtil] invalid query params: " + kv);
                continue;
            }
            var name = decodeURIComponent(pair[0]);
            var value = decodeURIComponent(pair[1]);
            params[name] = value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (kvs_1_1 && !kvs_1_1.done && (_a = kvs_1.return)) _a.call(kvs_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return params;
}
export function joinQueryParams(url, params) {
    if (url == null)
        throw new Error("url不能为空");
    var oriParams = getQueryParams(url);
    var targetParams = extendObject(oriParams, params);
    var hash = parseUrl(url).hash;
    url = getHostAndPathname(url);
    var isFirst = true;
    for (var key in targetParams) {
        if (isFirst) {
            url += "?" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
            isFirst = false;
        }
        else {
            url += "&" + encodeURIComponent(key) + "=" + encodeURIComponent(targetParams[key]);
        }
    }
    url += hash;
    return url;
}
export function joinHashParams(url, params) {
    if (url == null)
        throw new Error("url不能为空");
    var hash = parseUrl(url).hash;
    if (hash == null || hash == "")
        return url;
    for (var key in params) {
        var value = params[key];
        if (value && typeof value != "string")
            value = value.toString();
        hash += ((hash.indexOf("?") < 0 ? "?" : "&") + encodeURIComponent(key) + "=" + encodeURIComponent(value));
    }
    return (url.split("#")[0] + hash);
}
//# sourceMappingURL=URLUtil.js.map