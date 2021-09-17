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
import { listenConstruct } from "../../utils/ConstructUtil";
import { core } from "../Core";
import { decorateThis } from "../global/Patch";
export function Injectable() {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    if (this === decorateThis) {
        core.mapInject(args[0]);
    }
    else {
        return function (realCls) {
            var e_1, _a;
            try {
                for (var args_1 = __values(args), args_1_1 = args_1.next(); !args_1_1.done; args_1_1 = args_1.next()) {
                    var cls = args_1_1.value;
                    core.mapInject(realCls, cls);
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (args_1_1 && !args_1_1.done && (_a = args_1.return)) _a.call(args_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
            core.mapInject(realCls);
        };
    }
}
;
export function Inject(target, key) {
    if (key) {
        var cls = Reflect.getMetadata("design:type", target, key);
        doInject(target.constructor, key, cls);
    }
    else {
        return function (prototype, propertyKey) {
            doInject(prototype.constructor, propertyKey, target);
        };
    }
}
;
function doInject(cls, key, type) {
    var target;
    listenConstruct(cls, function (instance) {
        Object.defineProperty(instance, key, {
            configurable: true,
            enumerable: true,
            get: function () { return target || (target = core.getInject(type)); }
        });
    });
}
//# sourceMappingURL=Injector.js.map