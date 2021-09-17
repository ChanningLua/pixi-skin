export function getCookie(name) {
    if (document.cookie.length > 0) {
        var start = document.cookie.indexOf(name + "=");
        if (start != -1) {
            start = start + name.length + 1;
            var end = document.cookie.indexOf(";", start);
            if (end == -1)
                end = document.cookie.length;
            return decodeURIComponent(document.cookie.substring(start, end));
        }
    }
    return undefined;
}
export function setCookie(name, value, expire) {
    var exstr = "";
    if (expire != null) {
        var exdate = new Date();
        exdate.setMilliseconds(exdate.getMilliseconds() + expire);
        exstr = ";expires=" + exdate.toUTCString();
    }
    document.cookie = name + "=" + encodeURIComponent(value) + exstr;
}
//# sourceMappingURL=CookieUtil.js.map