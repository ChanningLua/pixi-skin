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
export function extendObject(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        if (!source)
            return;
        for (var propName in source) {
            if (source.hasOwnProperty(propName)) {
                target[propName] = source[propName];
            }
        }
    });
    return target;
}
export function cloneObject(target, deep) {
    var e_1, _a;
    if (deep === void 0) { deep = false; }
    if (target == null)
        return null;
    var newObject = target instanceof Array ? [] : Object.create(Object.getPrototypeOf(target));
    var keys = Object.keys(target);
    try {
        for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
            var key = keys_1_1.value;
            var value = target[key];
            if (deep && typeof value == "object") {
                value = cloneObject(value, true);
            }
            newObject[key] = value;
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return newObject;
}
export function mergeObject(target) {
    var sources = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        sources[_i - 1] = arguments[_i];
    }
    sources.forEach(function (source) {
        if (!source)
            return;
        for (var propName in source) {
            if (source.hasOwnProperty(propName)) {
                var targetProp = target[propName];
                var sourceProp = source[propName];
                if (sourceProp && typeof sourceProp === "object") {
                    if (targetProp && typeof targetProp === "object") {
                        mergeObject(targetProp, sourceProp);
                    }
                    else {
                        target[propName] = cloneObject(sourceProp, true);
                    }
                }
                else {
                    target[propName] = sourceProp;
                }
            }
        }
    });
    return target;
}
export function getGUID() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4";
    s[19] = hexDigits.substr((parseInt(s[19]) & 0x3) | 0x8, 1);
    s[8] = s[13] = s[18] = s[23] = "-";
    return s.join("");
}
var _getAutoIncIdMap = {};
export function getAutoIncId(type) {
    var index = _getAutoIncIdMap[type] || 0;
    _getAutoIncIdMap[type] = index++;
    return type + "-" + index;
}
export function isEmpty(obj) {
    var result = true;
    for (var key in obj) {
        result = false;
        break;
    }
    return result;
}
export function trimData(data) {
    for (var key in data) {
        if (data[key] == null) {
            delete data[key];
        }
    }
    return data;
}
export var extendsClass = (function () {
    var extendStatics = Object["setPrototypeOf"] ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b)
            if (b.hasOwnProperty(p))
                d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var hash = 0;
var hashTypes = ["object", "function"];
export function getObjectHash(target) {
    if (target == null)
        return "__object_hash_0__";
    var key = "__object_hash__";
    var value;
    if (Object.prototype.hasOwnProperty.call(target, key))
        value = target[key];
    if (value)
        return value;
    var type = typeof target;
    if (hashTypes.indexOf(type) < 0)
        return type + ":" + target;
    var value = "__object_hash_" + (++hash) + "__";
    Object.defineProperty(target, key, {
        configurable: true,
        enumerable: false,
        writable: false,
        value: value
    });
    return value;
}
export function getObjectHashs() {
    var targets = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        targets[_i] = arguments[_i];
    }
    var values = targets.map(function (target) { return getObjectHash(target); });
    return values.join("|");
}
//# sourceMappingURL=ObjectUtil.js.map