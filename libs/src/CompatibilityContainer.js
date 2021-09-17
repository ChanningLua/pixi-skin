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
import * as PIXI from 'pixi.js';
import { BasicLayout } from './utils/Layout';
import { STATE_DEFAULT } from './Constant';
import { EVENT_ADDED, EVENT_REMOVED, EVENT_POINTER_CANCEL, EVENT_POINTER_DOWN, EVENT_POINTER_MOVE, EVENT_POINTER_OUT, EVENT_POINTER_OVER, EVENT_POINTER_TAP, EVENT_POINTER_UP, EVENT_POINTER_OUTSIDE } from './Event';
import { convertSkinConfig, setComponentAttributes } from './utils/SkinParser';
var CompatibilityContainer = (function (_super) {
    __extends(CompatibilityContainer, _super);
    function CompatibilityContainer() {
        var _this = _super.call(this) || this;
        _this._includeInLayout = true;
        return _this;
    }
    Object.defineProperty(CompatibilityContainer.prototype, "skewX", {
        get: function () {
            return this['skew'].x;
        },
        set: function (value) {
            this['skew'].x = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "skewY", {
        get: function () {
            return this['skew'].y;
        },
        set: function (value) {
            this['skew'].y = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "scaleX", {
        get: function () {
            return this['scale'].x;
        },
        set: function (value) {
            this['scale'].x = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "scaleY", {
        get: function () {
            return this['scale'].y;
        },
        set: function (value) {
            this['scale'].y = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "anchorOffsetX", {
        get: function () {
            return this['pivot'].x;
        },
        set: function (value) {
            this['pivot'].x = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "anchorOffsetY", {
        get: function () {
            return this['pivot'].y;
        },
        set: function (value) {
            this['pivot'].y = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "includeInLayout", {
        get: function () {
            return this._includeInLayout;
        },
        set: function (value) {
            this._includeInLayout = !!value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "left", {
        get: function () {
            return this._left;
        },
        set: function (value) {
            this._left = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "right", {
        get: function () {
            return this._right;
        },
        set: function (value) {
            this._right = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "top", {
        get: function () {
            return this._top;
        },
        set: function (value) {
            this._top = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "bottom", {
        get: function () {
            return this._bottom;
        },
        set: function (value) {
            this._bottom = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "horizontalCenter", {
        get: function () {
            return this._horizontalCenter;
        },
        set: function (value) {
            this._horizontalCenter = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "verticalCenter", {
        get: function () {
            return this._verticalCenter;
        },
        set: function (value) {
            this._verticalCenter = value.toString();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "percentWidth", {
        get: function () {
            return this._percentWidth;
        },
        set: function (value) {
            this._percentWidth = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "percentHeight", {
        get: function () {
            return this._percentHeight;
        },
        set: function (value) {
            this._percentHeight = +value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "explicitWidth", {
        get: function () {
            return this._explicitWidth;
        },
        set: function (value) {
            this._explicitWidth = +value;
            this.changeBasicLayout(this._explicitWidth, this._explicitHeight);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "explicitHeight", {
        get: function () {
            return this._explicitHeight;
        },
        set: function (value) {
            this._explicitHeight = +value;
            this.changeBasicLayout(this._explicitWidth, this._explicitHeight);
        },
        enumerable: false,
        configurable: true
    });
    CompatibilityContainer.prototype.changeBasicLayout = function (_width, _height) {
        if (isNaN(_width) || isNaN(_height)) {
            return;
        }
        BasicLayout(this, _width, _height);
    };
    Object.defineProperty(CompatibilityContainer.prototype, "states", {
        get: function () {
            return this._states;
        },
        set: function (value) {
            this._states = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "currentState", {
        get: function () {
            return this._currentState;
        },
        set: function (value) {
            if (this._stateConfigDict == null) {
                return;
            }
            var config = this._stateConfigDict[value];
            if (config == null) {
                return;
            }
            setComponentAttributes(this, config);
            this._currentState = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "childrenState", {
        set: function (value) {
            var children = this['children'];
            for (var i = 0; i < children.length; i++) {
                children[i].currentState = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(CompatibilityContainer.prototype, "config", {
        get: function () {
            return this._config;
        },
        set: function (value) {
            this._config = value;
            this._stateConfigDict = convertSkinConfig(value);
            if (this.currentState == null) {
                this.currentState = STATE_DEFAULT;
            }
        },
        enumerable: false,
        configurable: true
    });
    CompatibilityContainer.prototype.addListeners = function () {
        this['on'](EVENT_ADDED, this.onAdded, this);
        this['on'](EVENT_REMOVED, this.onRemoved, this);
        this['on'](EVENT_POINTER_CANCEL, this.onPointerCancel, this);
        this['on'](EVENT_POINTER_DOWN, this.onPointerDown, this);
        this['on'](EVENT_POINTER_MOVE, this.onPointerMove, this);
        this['on'](EVENT_POINTER_OUT, this.onPointerOut, this);
        this['on'](EVENT_POINTER_OVER, this.onPointerOver, this);
        this['on'](EVENT_POINTER_TAP, this.onPointerTap, this);
        this['on'](EVENT_POINTER_UP, this.onPointerUp, this);
        this['on'](EVENT_POINTER_OUTSIDE, this.onPointerOutside, this);
    };
    CompatibilityContainer.prototype.removeListeners = function () {
        this['off'](EVENT_ADDED, this.onAdded, this);
        this['off'](EVENT_REMOVED, this.onRemoved, this);
        this['off'](EVENT_POINTER_CANCEL, this.onPointerCancel, this);
        this['off'](EVENT_POINTER_DOWN, this.onPointerDown, this);
        this['off'](EVENT_POINTER_MOVE, this.onPointerMove, this);
        this['off'](EVENT_POINTER_OUT, this.onPointerOut, this);
        this['off'](EVENT_POINTER_OVER, this.onPointerOver, this);
        this['off'](EVENT_POINTER_TAP, this.onPointerTap, this);
        this['off'](EVENT_POINTER_UP, this.onPointerUp, this);
        this['off'](EVENT_POINTER_OUTSIDE, this.onPointerOutside, this);
    };
    CompatibilityContainer.prototype.onAdded = function (parent) {
    };
    CompatibilityContainer.prototype.onRemoved = function (parent) {
    };
    CompatibilityContainer.prototype.onPointerCancel = function (evt) {
    };
    CompatibilityContainer.prototype.onPointerDown = function (evt) {
    };
    CompatibilityContainer.prototype.onPointerMove = function (evt) {
    };
    CompatibilityContainer.prototype.onPointerOut = function (evt) {
    };
    CompatibilityContainer.prototype.onPointerOver = function (evt) {
    };
    CompatibilityContainer.prototype.onPointerTap = function (evt) {
    };
    CompatibilityContainer.prototype.onPointerUp = function (evt) {
    };
    CompatibilityContainer.prototype.onPointerOutside = function (evt) {
    };
    CompatibilityContainer.prototype.getReference = function (id) {
        if (id == null) {
            return null;
        }
        function bind(container, value) {
            var children = container.children;
            for (var i = 0, lenI = children.length; i < lenI; i++) {
                var child = children[i];
                if (child.id != null && child.id !== '') {
                    this._referenceDict[child.id] = value + i.toString() + ',';
                }
                if (child instanceof PIXI.Container) {
                    bind.call(this, child, value + i.toString() + ',');
                }
            }
        }
        if (this._referenceDict == null) {
            this._referenceDict = {};
            bind.call(this, this, '');
        }
        if (this._referenceDict[id] == null) {
            return null;
        }
        var value = this._referenceDict[id];
        var list = value.split(',');
        if (list[list.length - 1] === '') {
            list.pop();
        }
        var container = this;
        for (var i = 0; i < list.length; i++) {
            var child = container['children'][parseInt(list[i], 10)];
            if (child == null) {
                break;
            }
            container = child;
            if (i === list.length - 1) {
                if (child.id === id) {
                    return child;
                }
            }
        }
        this._referenceDict = {};
        return this.getReference(name);
    };
    CompatibilityContainer.prototype.destroy = function (options) {
        this['removeAllListeners'] && this['removeAllListeners']();
        this.removeListeners();
        this._destroyed = true;
        _super.prototype.destroy.call(this, options);
    };
    Object.defineProperty(CompatibilityContainer.prototype, "destroyed", {
        get: function () {
            return this._destroyed;
        },
        enumerable: false,
        configurable: true
    });
    return CompatibilityContainer;
}(PIXI.Container));
export { CompatibilityContainer };
//# sourceMappingURL=CompatibilityContainer.js.map