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
import { Component } from './../components/Component';
var Button = (function (_super) {
    __extends(Button, _super);
    function Button() {
        var _this = _super.call(this) || this;
        _this._label = '';
        _this._icon = null;
        _this.addListeners();
        _this['interactive'] = true;
        return _this;
    }
    Object.defineProperty(Button.prototype, "label", {
        get: function () {
            return this._label;
        },
        set: function (value) {
            this._label = value;
            var labelDisplay = this.getReference('labelDisplay');
            if (labelDisplay) {
                labelDisplay.text = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Button.prototype, "icon", {
        get: function () {
            return this._icon;
        },
        set: function (value) {
            this._icon = value;
            var iconDisplay = this.getReference('iconDisplay');
            if (iconDisplay) {
                iconDisplay.source = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Button.prototype.onPointerDown = function (evt) {
        this._downPoint = evt.data.global.clone();
        this.childrenState = 'down';
    };
    Button.prototype.onPointerMove = function (evt) {
        if (this._downPoint == null) {
            return;
        }
        var pt = evt.data.global;
        if (Math.abs(pt.x - this._downPoint.x) > 10 || Math.abs(pt.y - this._downPoint.y) > 10) {
            this._downPoint = null;
            this.childrenState = 'up';
        }
    };
    Button.prototype.onPointerOut = function (evt) {
        this.onCancel(evt);
    };
    Button.prototype.onPointerUp = function (evt) {
        this.onCancel(evt);
    };
    Button.prototype.onPointerOutside = function (evt) {
        this.onCancel(evt);
    };
    Button.prototype.onPointerTap = function (evt) {
        this.childrenState = 'up';
    };
    Button.prototype.onCancel = function (evt) {
        if (this._downPoint == null) {
            evt.stopPropagation();
        }
        this._downPoint = null;
    };
    return Button;
}(Component));
export { Button };
//# sourceMappingURL=Button.js.map