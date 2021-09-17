var _cache = {};
export function isOperating(name) {
    var ctx = _cache[name];
    return (ctx != null && ctx.operating);
}
export function wait(name, fn, thisArg) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
        args[_i - 3] = arguments[_i];
    }
    var ctx = _cache[name];
    if (ctx == null) {
        _cache[name] = ctx = { operating: false, datas: [] };
    }
    if (ctx.operating) {
        ctx.datas.push({ fn: fn, thisArg: thisArg, args: args });
    }
    else {
        ctx.operating = true;
        fn.apply(thisArg, args);
    }
}
export function notify(name) {
    var ctx = _cache[name];
    if (ctx == null || ctx.datas.length <= 0) {
        ctx.operating = false;
        return;
    }
    var data = ctx.datas.shift();
    data.fn.apply(data.thisArg, data.args);
}
//# sourceMappingURL=SyncUtil.js.map