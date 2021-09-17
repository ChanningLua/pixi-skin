export function numToStr(num, len) {
    if (len === void 0) { len = 1; }
    var numStr = num + "";
    if (len <= 1)
        return numStr;
    var numLen = numStr.length;
    if (len <= numLen) {
        return numStr.substr(numLen - len);
    }
    else {
        for (var i = 0, lenI = len - numLen; i < lenI; i++) {
            numStr = "0" + numStr;
        }
        return numStr;
    }
}
//# sourceMappingURL=NumberUtil.js.map