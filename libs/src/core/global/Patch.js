import 'reflect-metadata';
if (Array.prototype.hasOwnProperty("findIndex")) {
    var desc = Object.getOwnPropertyDescriptor(Array.prototype, "findIndex");
    if (desc.enumerable) {
        desc.enumerable = false;
        Object.defineProperty(Array.prototype, "findIndex", desc);
    }
}
try {
    new ErrorEvent("");
}
catch (err) {
    window['ErrorEvent'] = function ErrorEvent(type, errorEventInitDict) {
        if (!errorEventInitDict)
            errorEventInitDict = {};
        if (Event instanceof Function) {
            Event.call(this, type, errorEventInitDict);
            this.initErrorEvent(type, errorEventInitDict.bubbles, errorEventInitDict.cancelable, errorEventInitDict.message, errorEventInitDict.filename, errorEventInitDict.lineno);
            this.error = errorEventInitDict.error;
            return this;
        }
        else {
            var evt = document.createEvent("ErrorEvent");
            evt['initErrorEvent'](type, errorEventInitDict.bubbles, errorEventInitDict.cancelable, errorEventInitDict.message, errorEventInitDict.filename, errorEventInitDict.lineno);
            return evt;
        }
    };
    window["ErrorEvent"].prototype['initErrorEvent'] = function initErrorEvent(typeArg, canBubbleArg, cancelableArg, messageArg, filenameArg, linenoArg) {
        this.type = typeArg;
        this.bubbles = canBubbleArg;
        this.cancelable = cancelableArg;
        this.message = messageArg;
        this.filename = filenameArg;
        this.lineno = linenoArg;
    };
}
export var decorateThis = {};
if (Reflect && Reflect.decorate) {
    var oriDecorate = Reflect.decorate;
    Reflect.decorate = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var oriRef = args[0][0];
        args[0][0] = function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return oriRef.apply(decorateThis, args);
        };
        var result = oriDecorate.apply(this, args);
        args[0][0] = oriRef;
        return result;
    };
}
//# sourceMappingURL=Patch.js.map