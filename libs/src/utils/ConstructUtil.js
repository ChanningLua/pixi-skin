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
import 'reflect-metadata';
import { Dictionary } from "./Dictionary";
import { extendsClass } from "./ObjectUtil";
var hasProxy = false;
(window["Proxy"] && Proxy.revocable instanceof Function);
var instanceDict = new Dictionary();
function handleInstance(instance) {
    var e_1, _a;
    var cls = instance.constructor;
    cls = cls["__ori_constructor__"] || cls;
    var funcs = instanceDict.get(cls);
    if (funcs)
        try {
            for (var funcs_1 = __values(funcs), funcs_1_1 = funcs_1.next(); !funcs_1_1.done; funcs_1_1 = funcs_1.next()) {
                var func = funcs_1_1.value;
                func(instance);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (funcs_1_1 && !funcs_1_1.done && (_a = funcs_1.return)) _a.call(funcs_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
}
export function wrapConstruct(cls) {
    if (hasProxy) {
        return new Proxy(cls, {
            construct: function (target, args, newTarget) {
                var result = Reflect["construct"](target, args, newTarget);
                if (newTarget)
                    result.constructor = newTarget;
                handleInstance(result);
                return result;
            }
        });
    }
    else {
        var func;
        try {
            eval('func = function ' + cls["name"] + '(){onConstruct.call(this, arguments)}');
        }
        catch (err) {
            func = onConstruct;
        }
        extendsClass(func, cls);
        func["__ori_constructor__"] = cls;
        cls["__wrap_constructor__"] = func;
        return func;
    }
    function onConstruct(args) {
        Object.defineProperty(this, "__proto__", {
            configurable: true,
            enumerable: false,
            writable: true,
            value: cls.prototype
        });
        cls.apply(this, args);
        handleInstance(this);
    }
}
export function getConstructor(cls) {
    return (cls["__wrap_constructor__"] || cls);
}
export function listenConstruct(cls, handler) {
    cls = cls["__ori_constructor__"] || cls;
    var list = instanceDict.get(cls);
    if (!list)
        instanceDict.set(cls, list = []);
    if (list.indexOf(handler) < 0)
        list.push(handler);
}
export function unlistenConstruct(cls, handler) {
    cls = cls["__ori_constructor__"] || cls;
    var list = instanceDict.get(cls);
    if (list) {
        var index = list.indexOf(handler);
        if (index >= 0)
            list.splice(index, 1);
    }
}
export function listenDispose(cls, handler) {
    var dispose = cls.prototype.dispose;
    if (dispose) {
        cls.prototype.dispose = function () {
            handler(this);
            return dispose.apply(this, arguments);
        };
    }
}
export function listenApply(target, name, before, after, once) {
    if (once === void 0) { once = true; }
    if (target instanceof Function)
        listenConstruct(target, onGetInstance);
    else
        onGetInstance(target);
    function onGetInstance(instance) {
        var oriFunc = instance.hasOwnProperty(name) ? instance[name] : null;
        instance[name] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var tempArgs = before && before(instance, args);
            if (tempArgs)
                args = tempArgs;
            if (once) {
                if (oriFunc)
                    instance[name] = oriFunc;
                else
                    delete instance[name];
            }
            var result = instance[name].apply(this, args);
            var tempResult = after && after(instance, args, result);
            if (tempResult)
                result = tempResult;
            return result;
        };
    }
}
//# sourceMappingURL=ConstructUtil.js.map