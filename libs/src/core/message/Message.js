var Message = (function () {
    function Message(type) {
        this.__observables = [];
        this._type = type;
    }
    Object.defineProperty(Message.prototype, "__type", {
        get: function () {
            return this._type;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "__observable", {
        get: function () {
            return this.__observables[0];
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Message.prototype, "__oriObservable", {
        get: function () {
            return this.__observables[this.__observables.length - 1];
        },
        enumerable: false,
        configurable: true
    });
    Message.prototype.redispatch = function () {
        this.__oriObservable.dispatch(this);
    };
    return Message;
}());
export { Message };
//# sourceMappingURL=Message.js.map