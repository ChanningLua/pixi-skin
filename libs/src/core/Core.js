import 'reflect-metadata';
import { Dictionary } from "../utils/Dictionary";
import * as Patch from "./global/Patch";
import { Observable } from "./observable/Observable";
Patch;
var Core = (function () {
    function Core() {
        this._observable = new Observable();
        this._injectDict = new Dictionary();
        this._injectStrDict = new Dictionary();
        if (Core._instance)
            throw new Error("已生成过Core实例，不允许多次生成");
        Core._instance = this;
        this.mapInjectValue(this);
    }
    Object.defineProperty(Core.prototype, "disposed", {
        get: function () {
            return false;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Core.prototype, "observable", {
        get: function () {
            return this._observable;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Core.prototype, "parent", {
        get: function () {
            return null;
        },
        enumerable: false,
        configurable: true
    });
    Core.prototype.dispatch = function () {
        var params = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            params[_i] = arguments[_i];
        }
        this._observable.dispatch.apply(this._observable, params);
    };
    Core.prototype.listen = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this._observable.listen(type, handler, thisArg, once);
    };
    Core.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        this._observable.unlisten(type, handler, thisArg, once);
    };
    Core.prototype.mapCommand = function (type, cmd) {
        this._observable.mapCommand(type, cmd);
    };
    Core.prototype.unmapCommand = function (type, cmd) {
        this._observable.unmapCommand(type, cmd);
    };
    Core.prototype.mapInject = function (target, type) {
        var oriTarget = target["__ori_constructor__"] || target;
        var value = this._injectDict.get(oriTarget) || new target();
        this.mapInjectValue(value, type);
    };
    Core.prototype.mapInjectValue = function (value, type) {
        if (!(type instanceof Function) || !type.prototype) {
            this._injectStrDict.set(type, value.constructor);
            type = value.constructor;
        }
        this._injectDict.set(value.constructor, value);
        Reflect.defineMetadata("design:type", value, type["__ori_constructor__"] || type);
    };
    Core.prototype.unmapInject = function (type) {
        if (!(type instanceof Function) || !type.prototype)
            type = this._injectStrDict.get(type);
        Reflect.deleteMetadata("design:type", type["__ori_constructor__"] || type);
    };
    Core.prototype.getInject = function (type) {
        if (!(type instanceof Function) || !type.prototype)
            type = this._injectStrDict.get(type);
        if (type) {
            type = type["__ori_constructor__"] || type;
            return Reflect.getMetadata("design:type", type);
        }
    };
    Core.prototype.dispose = function () {
    };
    return Core;
}());
export { Core };
export var core = new Core();
//# sourceMappingURL=Core.js.map