import { getObjectHash } from "./ObjectUtil";
var Dictionary = (function () {
    function Dictionary() {
        this._keyDict = {};
        this._valueDict = {};
    }
    Object.defineProperty(Dictionary.prototype, "size", {
        get: function () {
            var size = 0;
            for (var hash in this._keyDict)
                size++;
            return size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "keys", {
        get: function () {
            var keys = [];
            for (var hash in this._keyDict) {
                keys.push(this._keyDict[hash]);
            }
            return keys;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Dictionary.prototype, "values", {
        get: function () {
            var values = [];
            for (var hash in this._valueDict) {
                values.push(this._valueDict[hash]);
            }
            return values;
        },
        enumerable: false,
        configurable: true
    });
    Dictionary.prototype.set = function (key, value) {
        var hash = getObjectHash(key);
        this._keyDict[hash] = key;
        this._valueDict[hash] = value;
    };
    Dictionary.prototype.get = function (key) {
        var hash = getObjectHash(key);
        return this._valueDict[hash];
    };
    Dictionary.prototype.delete = function (key) {
        var hash = getObjectHash(key);
        delete this._keyDict[hash];
        delete this._valueDict[hash];
    };
    Dictionary.prototype.forEach = function (callback) {
        for (var hash in this._keyDict) {
            var key = this._keyDict[hash];
            var value = this._valueDict[hash];
            callback(key, value);
        }
    };
    return Dictionary;
}());
export { Dictionary };
//# sourceMappingURL=Dictionary.js.map