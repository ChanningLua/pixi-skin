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
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { CommonMessage } from "../message/CommonMessage";
import { CoreMessage } from "../message/CoreMessage";
var Observable = (function () {
    function Observable(parent) {
        this._listenerDict = {};
        this._commandDict = {};
        this._disposed = false;
        this.parent = parent && parent.observable;
    }
    Object.defineProperty(Observable.prototype, "observable", {
        get: function () {
            return this;
        },
        enumerable: false,
        configurable: true
    });
    Observable.prototype.handleMessages = function (msg) {
        var e_1, _a, _b;
        var listeners1 = this._listenerDict[msg.__type];
        var listeners2 = this._listenerDict[msg.constructor.toString()];
        var listeners = (listeners1 && listeners2 ? listeners1.concat(listeners2) : listeners1 || listeners2);
        if (listeners) {
            listeners = listeners.concat();
            try {
                for (var listeners_1 = __values(listeners), listeners_1_1 = listeners_1.next(); !listeners_1_1.done; listeners_1_1 = listeners_1.next()) {
                    var temp = listeners_1_1.value;
                    if (msg instanceof CommonMessage)
                        (_b = temp.handler).call.apply(_b, __spread([temp.thisArg], msg.params));
                    else
                        temp.handler.call(temp.thisArg, msg);
                    if (temp.once) {
                        this.unlisten(msg.__type, temp.handler, temp.thisArg, temp.once);
                        this.unlisten(msg.constructor.toString(), temp.handler, temp.thisArg, temp.once);
                    }
                }
            }
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (listeners_1_1 && !listeners_1_1.done && (_a = listeners_1.return)) _a.call(listeners_1);
                }
                finally { if (e_1) throw e_1.error; }
            }
        }
    };
    Observable.prototype.doDispatch = function (msg) {
        msg.__observables.push(this);
        this.handleCommands(msg);
        this.handleMessages(msg);
    };
    Observable.prototype.dispatch = function (typeOrMsg) {
        var params = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            params[_i - 1] = arguments[_i];
        }
        if (this._disposed)
            return;
        var msg = typeOrMsg;
        if (typeof typeOrMsg == "string") {
            msg = new CommonMessage(typeOrMsg);
            msg.params = params;
        }
        this.doDispatch(msg);
        this.doDispatch(new CommonMessage(CoreMessage.MESSAGE_DISPATCHED, msg));
        this.parent && this.parent.dispatch(msg);
    };
    Observable.prototype.listen = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        if (this._disposed)
            return;
        type = (typeof type == "string" ? type : type.toString());
        var listeners = this._listenerDict[type];
        if (!listeners)
            this._listenerDict[type] = listeners = [];
        for (var i = 0, len = listeners.length; i < len; i++) {
            var temp = listeners[i];
            if (temp.handler == handler && temp.thisArg == thisArg)
                return;
        }
        listeners.push({ handler: handler, thisArg: thisArg, once: once });
    };
    Observable.prototype.unlisten = function (type, handler, thisArg, once) {
        if (once === void 0) { once = false; }
        if (this._disposed)
            return;
        type = (typeof type == "string" ? type : type.toString());
        var listeners = this._listenerDict[type];
        if (listeners) {
            for (var i = 0, len = listeners.length; i < len; i++) {
                var temp = listeners[i];
                if (temp.handler == handler && temp.thisArg == thisArg && temp.once == once) {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    };
    Observable.prototype.handleCommands = function (msg) {
        var e_2, _a;
        var commands = this._commandDict[msg.__type];
        if (commands) {
            commands = commands.concat();
            try {
                for (var commands_1 = __values(commands), commands_1_1 = commands_1.next(); !commands_1_1.done; commands_1_1 = commands_1.next()) {
                    var cls = commands_1_1.value;
                    new cls(msg).exec();
                }
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (commands_1_1 && !commands_1_1.done && (_a = commands_1.return)) _a.call(commands_1);
                }
                finally { if (e_2) throw e_2.error; }
            }
        }
    };
    Observable.prototype.mapCommand = function (type, cmd) {
        if (this._disposed)
            return;
        var commands = this._commandDict[type];
        if (!commands)
            this._commandDict[type] = commands = [];
        if (commands.indexOf(cmd) < 0)
            commands.push(cmd);
    };
    Observable.prototype.unmapCommand = function (type, cmd) {
        if (this._disposed)
            return;
        var commands = this._commandDict[type];
        if (!commands)
            return;
        var index = commands.indexOf(cmd);
        if (index < 0)
            return;
        commands.splice(index, 1);
    };
    Object.defineProperty(Observable.prototype, "disposed", {
        get: function () {
            return this._disposed;
        },
        enumerable: false,
        configurable: true
    });
    Observable.prototype.dispose = function () {
        if (this._disposed)
            return;
        this.parent = null;
        this._listenerDict = null;
        this._commandDict = null;
        this._disposed = true;
    };
    return Observable;
}());
export { Observable };
//# sourceMappingURL=Observable.js.map