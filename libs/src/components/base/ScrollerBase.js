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
import { Viewport } from 'pixi-viewport';
import Penner from 'penner';
var scrollboxOptions = {
    'boxWidth': 100,
    'boxHeight': 100,
    'scrollbarSize': 10,
    'scrollbarBackground': 14540253,
    'scrollbarBackgroundAlpha': 1,
    'scrollbarForeground': 8947848,
    'scrollbarForegroundAlpha': 1,
    'dragScroll': true,
    'stopPropagation': true,
    'scrollbarOffsetHorizontal': 0,
    'scrollbarOffsetVertical': 0,
    'underflow': 'top-left',
    'fadeScrollbar': false,
    'fadeScrollbarTime': 1000,
    'fadeScrollboxWait': 3000,
    'fadeScrollboxEase': 'easeInOutSine',
    'passiveWheel': false,
    'clampWheel': true
};
var ScrollerBase = (function (_super) {
    __extends(ScrollerBase, _super);
    function ScrollerBase(options) {
        var _this = _super.call(this) || this;
        _this.options = Object.assign({}, scrollboxOptions, options);
        if (options.overflow) {
            _this.options.overflowX = _this.options.overflowY = options.overflow;
        }
        _this.ease = typeof _this.options.fadeScrollboxEase === 'function' ? _this.options.fadeScrollboxEase : Penner[_this.options.fadeScrollboxEase];
        var viewport = new Viewport({
            passiveWheel: _this.options.passiveWheel,
            screenWidth: _this.options.boxWidth,
            screenHeight: _this.options.boxHeight,
            interaction: _this.options.interaction
        });
        _this.content = _this['addChild'](viewport);
        _this.content
            .decelerate()
            .on('moved', function () { return _this._drawScrollbars(); });
        if (options.ticker) {
            _this.options.ticker = options.ticker;
        }
        else {
            var ticker = void 0;
            var pixiNS = PIXI;
            if (parseInt(/^(\d+)\./.exec(PIXI.VERSION)[1]) < 5) {
                ticker = pixiNS.ticker.shared;
            }
            else {
                ticker = pixiNS['Ticker'].shared;
            }
            _this.options.ticker = options.ticker || ticker;
        }
        _this.scrollbar = _this['addChild'](new PIXI.Graphics());
        _this.scrollbar.interactive = true;
        _this.scrollbar.on('pointerdown', _this.scrollbarDown, _this);
        _this['interactive'] = true;
        _this['on']('pointermove', _this.scrollbarMove, _this);
        _this['on']('pointerup', _this.scrollbarUp, _this);
        _this['on']('pointercancel', _this.scrollbarUp, _this);
        _this['on']('pointerupoutside', _this.scrollbarUp, _this);
        _this._maskContent = _this['addChild'](new PIXI.Graphics());
        _this.update();
        if (!_this.options.noTicker) {
            _this.tickerFunction = function () { return _this.updateLoop(Math.min(_this.options.ticker.elapsedMS, 16.6667)); };
            _this.options.ticker.add(_this.tickerFunction);
        }
        return _this;
    }
    ScrollerBase.prototype.onDestroy = function () {
        var _a;
        (_a = this.options.ticker) === null || _a === void 0 ? void 0 : _a.remove(this.tickerFunction);
        this.options.ticker = null;
        this.options;
        this.ease = null;
        this.content = null;
        this.scrollbar = null;
        this._maskContent = null;
        this.tickerFunction = null;
        this.pointerDown = null;
        this['destroy']({
            children: true,
            texture: false,
            baseTexture: false,
        });
    };
    Object.defineProperty(ScrollerBase.prototype, "scrollbarOffsetHorizontal", {
        get: function () {
            return this.options.scrollbarOffsetHorizontal;
        },
        set: function (value) {
            this.options.scrollbarOffsetHorizontal = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "scrollbarOffsetVertical", {
        get: function () {
            return this.options.scrollbarOffsetVertical;
        },
        set: function (value) {
            this.options.scrollbarOffsetVertical = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "disable", {
        get: function () {
            return this._disabled;
        },
        set: function (value) {
            if (this._disabled !== value) {
                this._disabled = value;
                this.update();
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "stopPropagation", {
        get: function () {
            return this.options.stopPropagation;
        },
        set: function (value) {
            this.options.stopPropagation = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "dragScroll", {
        get: function () {
            return this.options.dragScroll;
        },
        set: function (value) {
            this.options.dragScroll = value;
            if (value) {
                this.content.drag();
            }
            else {
                if (typeof this.content.removePlugin !== 'undefined') {
                    this.content.removePlugin('drag');
                }
                else {
                    this.content.plugins.remove('drag');
                }
            }
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "boxWidth", {
        get: function () {
            return this.options.boxWidth;
        },
        set: function (value) {
            this.options.boxWidth = value;
            this.content.screenWidth = value;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "overflow", {
        get: function () {
            return this.options.overflow;
        },
        set: function (value) {
            this.options.overflow = value;
            this.options.overflowX = value;
            this.options.overflowY = value;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "overflowX", {
        get: function () {
            return this.options.overflowX;
        },
        set: function (value) {
            this.options.overflowX = value;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "overflowY", {
        get: function () {
            return this.options.overflowY;
        },
        set: function (value) {
            this.options.overflowY = value;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "boxHeight", {
        get: function () {
            return this.options.boxHeight;
        },
        set: function (value) {
            this.options.boxHeight = value;
            this.content.screenHeight = value;
            this.update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "scrollbarSize", {
        get: function () {
            return this.options.scrollbarSize;
        },
        set: function (value) {
            this.options.scrollbarSize = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "contentWidth", {
        get: function () {
            return this.options.boxWidth - (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "contentHeight", {
        get: function () {
            return this.options.boxHeight - (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "isScrollbarVertical", {
        get: function () {
            return this._isScrollbarVertical;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "isScrollbarHorizontal", {
        get: function () {
            return this._isScrollbarHorizontal;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "scrollTop", {
        get: function () {
            return this.content.top;
        },
        set: function (top) {
            this.content.top = top;
            this._drawScrollbars();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "scrollLeft", {
        get: function () {
            return this.content.left;
        },
        set: function (left) {
            this.content.left = left;
            this._drawScrollbars();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "scrollWidth", {
        get: function () {
            return this._scrollWidth || this.content.width;
        },
        set: function (value) {
            this._scrollWidth = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(ScrollerBase.prototype, "scrollHeight", {
        get: function () {
            return this._scrollHeight || this.content.height;
        },
        set: function (value) {
            this._scrollHeight = value;
        },
        enumerable: false,
        configurable: true
    });
    ScrollerBase.prototype._drawScrollbars = function () {
        this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowX) !== -1 ? false : this.scrollWidth > this.options.boxWidth;
        this._isScrollbarVertical = this.overflowY === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowY) !== -1 ? false : this.scrollHeight > this.options.boxHeight;
        this.scrollbar.clear();
        var options = {};
        options.left = 0;
        options.right = this.scrollWidth + (this._isScrollbarVertical ? this.options.scrollbarSize : 0);
        options.top = 0;
        options.bottom = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
        var width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
        var height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
        this.scrollbarTop = (this.content.top / height) * this.boxHeight;
        this.scrollbarTop = this.scrollbarTop < 0 ? 0 : this.scrollbarTop;
        this.scrollbarHeight = (this.boxHeight / height) * this.boxHeight;
        this.scrollbarHeight = this.scrollbarTop + this.scrollbarHeight > this.boxHeight ? this.boxHeight - this.scrollbarTop : this.scrollbarHeight;
        this.scrollbarLeft = (this.content.left / width) * this.boxWidth;
        this.scrollbarLeft = this.scrollbarLeft < 0 ? 0 : this.scrollbarLeft;
        this.scrollbarWidth = (this.boxWidth / width) * this.boxWidth;
        this.scrollbarWidth = this.scrollbarWidth + this.scrollbarLeft > this.boxWidth ? this.boxWidth - this.scrollbarLeft : this.scrollbarWidth;
        if (this.isScrollbarVertical) {
            this.scrollbar
                .beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha)
                .drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, 0, this.scrollbarSize, this.boxHeight)
                .endFill();
        }
        if (this.isScrollbarHorizontal) {
            this.scrollbar
                .beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha)
                .drawRect(0, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.boxWidth, this.scrollbarSize)
                .endFill();
        }
        if (this.isScrollbarVertical) {
            this.scrollbar
                .beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha)
                .drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight)
                .endFill();
        }
        if (this.isScrollbarHorizontal) {
            this.scrollbar
                .beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha)
                .drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.scrollbarWidth, this.scrollbarSize)
                .endFill();
        }
        this.activateFade();
    };
    ScrollerBase.prototype._drawMask = function () {
        this._maskContent
            .beginFill(0)
            .drawRect(0, 0, this.boxWidth, this.boxHeight)
            .endFill();
        this.content.mask = this._maskContent;
    };
    ScrollerBase.prototype.update = function () {
        this.content.mask = null;
        this._maskContent.clear();
        if (!this._disabled) {
            this._drawScrollbars();
            this._drawMask();
            var direction = this.isScrollbarHorizontal && this.isScrollbarVertical ? 'all' : this.isScrollbarHorizontal ? 'x' : 'y';
            if (direction !== null) {
                if (this.options.dragScroll) {
                    this.content.drag({ clampWheel: this.options.clampWheel, direction: direction });
                }
                this.content.clamp({ direction: direction, underflow: this.options.underflow });
            }
        }
    };
    ScrollerBase.prototype.updateLoop = function (elapsed) {
        if (this.fade) {
            if (this.fade.wait > 0) {
                this.fade.wait -= elapsed;
                if (this.fade.wait <= 0) {
                    elapsed += this.fade.wait;
                }
                else {
                    return;
                }
            }
            this.fade.duration += elapsed;
            if (this.fade.duration >= this.options.fadeScrollbarTime) {
                this.fade = null;
                this.scrollbar.alpha = 0;
            }
            else {
                this.scrollbar.alpha = this.ease(this.fade.duration, 1, -1, this.options.fadeScrollbarTime);
                console.log('this.fade.duration', this.fade.duration);
                console.log('this.scrollbar.alpha', this.scrollbar.alpha);
            }
            this.content.dirty = true;
        }
    };
    Object.defineProperty(ScrollerBase.prototype, "dirty", {
        get: function () {
            return this.content.dirty;
        },
        set: function (value) {
            this.content.dirty = value;
        },
        enumerable: false,
        configurable: true
    });
    ScrollerBase.prototype.activateFade = function () {
        if (!this.fade && this.options.fade) {
            this.scrollbar.alpha = 1;
            this.fade = { wait: this.options.fadeScrollboxWait, duration: 0 };
        }
    };
    ScrollerBase.prototype.scrollbarDown = function (e) {
        var local = this['toLocal'](e.data.global);
        if (this.isScrollbarHorizontal) {
            if (local.y > this.boxHeight - this.scrollbarSize) {
                if (local.x >= this.scrollbarLeft && local.x <= this.scrollbarLeft + this.scrollbarWidth) {
                    this.pointerDown = { type: 'horizontal', last: local };
                }
                else {
                    if (local.x > this.scrollbarLeft) {
                        this.content.left += this.content.worldScreenWidth;
                        this.update();
                    }
                    else {
                        this.content.left -= this.content.worldScreenWidth;
                        this.update();
                    }
                }
                if (this.options.stopPropagation) {
                    e === null || e === void 0 ? void 0 : e.stopPropagation();
                }
                return;
            }
        }
        if (this.isScrollbarVertical) {
            if (local.x > this.boxWidth - this.scrollbarSize) {
                if (local.y >= this.scrollbarTop && local.y <= this.scrollbarTop + this.scrollbarWidth) {
                    this.pointerDown = { type: 'vertical', last: local };
                }
                else {
                    if (local.y > this.scrollbarTop) {
                        this.content.top += this.content.worldScreenHeight;
                        this.update();
                    }
                    else {
                        this.content.top -= this.content.worldScreenHeight;
                        this.update();
                    }
                }
                if (this.options.stopPropagation) {
                    e === null || e === void 0 ? void 0 : e.stopPropagation();
                }
            }
        }
    };
    ScrollerBase.prototype.scrollbarMove = function (e) {
        if (this.pointerDown) {
            if (this.pointerDown.type === 'horizontal') {
                var local = this['toLocal'](e.data.global);
                var width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0);
                this.scrollbarLeft += local.x - this.pointerDown.last.x;
                this.content.left = this.scrollbarLeft / this.boxWidth * width;
                this.pointerDown.last = local;
                this.update();
            }
            else if (this.pointerDown.type === 'vertical') {
                var local = this['toLocal'](e.data.global);
                var height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0);
                this.scrollbarTop += local.y - this.pointerDown.last.y;
                this.content.top = this.scrollbarTop / this.boxHeight * height;
                this.pointerDown.last = local;
                this.update();
            }
            if (this.options.stopPropagation) {
                e === null || e === void 0 ? void 0 : e.stopPropagation();
            }
        }
    };
    ScrollerBase.prototype.scrollbarUp = function () {
        this.pointerDown = null;
    };
    ScrollerBase.prototype.resize = function (options) {
        this.options.boxWidth = typeof options.boxWidth !== 'undefined' ? options.boxWidth : this.options.boxWidth;
        this.options.boxHeight = typeof options.boxHeight !== 'undefined' ? options.boxHeight : this.options.boxHeight;
        if (options.scrollWidth) {
            this.scrollWidth = options.scrollWidth;
        }
        if (options.scrollHeight) {
            this.scrollHeight = options.scrollHeight;
        }
        this.content.resize(this.options.boxWidth, this.options.boxHeight, this.scrollWidth, this.scrollHeight);
        this.update();
    };
    ScrollerBase.prototype.ensureVisible = function (x, y, width, height) {
        this.content.ensureVisible(x, y, width, height);
        this._drawScrollbars();
    };
    return ScrollerBase;
}(PIXI.Container));
export { ScrollerBase };
//# sourceMappingURL=ScrollerBase.js.map