import { Dictionary } from "./Dictionary";
export function shuffle(a) {
    var len = a.length;
    for (var i = 1; i < len; i++) {
        var end = len - i;
        var index = (Math.random() * (end + 1)) >> 0;
        var t = a[end];
        a[end] = a[index];
        a[index] = t;
    }
    return a;
}
export function randomize(arr, count, begin, end) {
    if (count === void 0) { count = -1; }
    if (begin === void 0) { begin = -1; }
    if (end === void 0) { end = -1; }
    if (!arr)
        throw new Error("invalid argument");
    arr = arr.concat();
    var len = arr.length;
    if (begin < 0)
        begin = 0;
    if (end < 0)
        end = len;
    if (count < 0)
        count = end - begin;
    var arr2 = [];
    var end2 = begin + count;
    for (var i = begin; i < end2; i++) {
        var index = (Math.random() * (end - i) + i) >> 0;
        arr2[i - begin] = arr[index];
        arr[index] = arr[i];
    }
    return arr2;
}
export function randomizeWeight(arr, weight) {
    if (!arr || !weight)
        throw new Error("invalid argument");
    if (weight.length < arr.length)
        throw new Error("权重数组的元素数量不应小于原始数组的元素数量");
    var regions = [];
    var sum = 0;
    for (var i in arr) {
        sum += weight[i];
        regions.push(sum);
    }
    var ran = Math.random() * sum;
    var index;
    for (var i = 0, len = regions.length; i < len; i++) {
        if (ran < regions[i]) {
            index = i;
            break;
        }
    }
    return arr[index];
}
export function unique(list) {
    if (!list)
        return list;
    var hash = new Dictionary(), result = [];
    for (var i = 0, len = list.length; i < len; i++) {
        if (!hash.get(list[i])) {
            hash.set(list[i], true);
            result.push(list[i]);
        }
    }
    return result;
}
//# sourceMappingURL=ArrayUtil.js.map