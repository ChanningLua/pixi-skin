var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
import { CompatibilityContainer } from './../CompatibilityContainer';
var Group = (function (_super) {
    __extends(Group, _super);
    function Group() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Group.prototype, "contentWidth", {
        get: function () {
            return this._contentWidth;
        },
        set: function (value) {
            this._contentWidth = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "contentHeight", {
        get: function () {
            return this._contentHeight;
        },
        set: function (value) {
            this._contentHeight = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "scrollH", {
        get: function () {
            return this._scrollH;
        },
        set: function (value) {
            this._scrollH = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "scrollV", {
        get: function () {
            return this._scrollV;
        },
        set: function (value) {
            this._scrollV = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "scrollEnabled", {
        get: function () {
            return this._scrollEnabled;
        },
        set: function (value) {
            this._scrollEnabled = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Group.prototype, "layout", {
        get: function () {
            return this._layout;
        },
        set: function (value) {
            this._layout = value;
        },
        enumerable: false,
        configurable: true
    });
    return Group;
}(CompatibilityContainer));
export { Group };
//# sourceMappingURL=Group.js.map