import { numToStr } from './NumberUtil';
export function formatTimestamp(timestamp, format) {
    if (format === void 0) { format = "yyyy-MM-dd hh:mm:ss.S"; }
    var date = new Date(timestamp);
    return formatFromData({
        year: date.getFullYear(),
        quarter: Math.floor(date.getMonth() / 3) + 1,
        month: date.getMonth() + 1,
        date: date.getDate(),
        day: date.getDay(),
        hour: date.getHours(),
        minute: date.getMinutes(),
        second: date.getSeconds(),
        millisecond: date.getMilliseconds()
    }, format);
}
export function formatUTCTimestamp(timestamp, format) {
    if (format === void 0) { format = "yyyy-MM-dd hh:mm:ss.S"; }
    var date = new Date(timestamp);
    return formatFromData({
        year: date.getUTCFullYear(),
        quarter: Math.floor(date.getUTCMonth() / 3) + 1,
        month: date.getUTCMonth() + 1,
        date: date.getUTCDate(),
        day: date.getUTCDay(),
        hour: date.getUTCHours(),
        minute: date.getUTCMinutes(),
        second: date.getUTCSeconds(),
        millisecond: date.getUTCMilliseconds()
    }, format);
}
export function formatDuration(duration, format) {
    if (format === void 0) { format = "d hh:mm:ss.S"; }
    var data = {
        date: Math.floor(duration / 86400000),
        hour: Math.floor(duration / 3600000),
        minute: Math.floor(duration / 60000),
        second: Math.floor(duration / 1000),
        millisecond: duration
    };
    if (format.indexOf("d") >= 0)
        data.hour %= 24;
    if (format.indexOf("h") >= 0)
        data.minute %= 60;
    if (format.indexOf("m") >= 0)
        data.second %= 60;
    if (format.indexOf("s") >= 0)
        data.millisecond %= 1000;
    return formatFromData(data, format);
}
function formatFromData(data, format) {
    var dict = {
        "y+": data.year,
        "q+": data.quarter,
        "M+": data.month,
        "d+": data.date,
        "D+": data.day,
        "h+": data.hour,
        "m+": data.minute,
        "s+": data.second
    };
    for (var key in dict) {
        var value = dict[key];
        if (value >= 0) {
            var reg = new RegExp("(" + key + ")", "g");
            if (reg.test(format)) {
                format = format.replace(reg, numToStr(value, RegExp.$1.length));
            }
        }
    }
    if (data.millisecond >= 0) {
        format = format.replace(/S+/g, data.millisecond + "");
    }
    return format;
}
//# sourceMappingURL=TimeUtil.js.map