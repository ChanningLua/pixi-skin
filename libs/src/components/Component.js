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
var Component = (function (_super) {
    __extends(Component, _super);
    function Component() {
        return _super.call(this) || this;
    }
    Object.defineProperty(Component.prototype, "enable", {
        get: function () {
            return this._enable;
        },
        set: function (value) {
            this._enable = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Component.prototype, "skinName", {
        get: function () {
            return this._skinName;
        },
        set: function (value) {
            if (value == null || value === this._skinName) {
                return;
            }
            this._skinName = value;
        },
        enumerable: false,
        configurable: true
    });
    Component.prototype.clearChildren = function () {
        var children = this['children'];
        for (var i = children.length - 1; i >= 0; i--) {
            children[i].destroy({
                children: true,
                texture: false,
                baseTexture: false,
            });
        }
    };
    return Component;
}(CompatibilityContainer));
export { Component };
//# sourceMappingURL=Component.js.map