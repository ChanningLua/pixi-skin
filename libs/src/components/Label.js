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
import { CompatibilityContainer } from './../CompatibilityContainer';
var Label = (function (_super) {
    __extends(Label, _super);
    function Label() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Object.defineProperty(Label.prototype, "width", {
        get: function () {
            return this['scale'].x * this['getLocalBounds']().width;
        },
        set: function (value) {
            var width = this['getLocalBounds']().width;
            if (width !== 0) {
                this['scale'].x = value / width;
            }
            else {
                this['scale'].x = 1;
            }
            this['_width'] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "height", {
        get: function () {
            return this['scale'].y * this['getLocalBounds']().height;
        },
        set: function (value) {
            var height = this['getLocalBounds']().height;
            if (height !== 0) {
                this['scale'].y = value / height;
            }
            else {
                this['scale'].y = 1;
            }
            this['_height'] = value;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "text", {
        get: function () {
            return this._value;
        },
        set: function (value) {
            this._value = value || '';
            if (!this._text) {
                this._text = new PIXI.Text('');
                this['addChild'](this._text);
            }
            this.style = {
                size: this.size,
                italic: this.italic,
                bold: this.bold,
                textAlign: this.textAlign,
                textColor: this.textColor,
                fontFamily: this.fontFamily
            };
            this._text.text = this._value;
            this.updateView();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "style", {
        get: function () {
            return this._style;
        },
        set: function (_style) {
            this._style = this.setStyle(_style);
            this._text.style = this._style;
        },
        enumerable: false,
        configurable: true
    });
    Label.prototype.setStyle = function (_style) {
        return new PIXI.TextStyle({
            align: (this.textAlign),
            fill: (this.textColor),
            fontWeight: ('' + (this.bold ? 500 : 400)),
            fontStyle: (this.italic ? 'italic' : 'normal'),
            fontSize: (this.size),
            fontFamily: (this.fontFamily)
        });
    };
    Object.defineProperty(Label.prototype, "size", {
        get: function () {
            return this._size || 26;
        },
        set: function (_size) {
            this._size = _size;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "italic", {
        get: function () {
            return this._italic || false;
        },
        set: function (_italic) {
            this._italic = _italic;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "bold", {
        get: function () {
            return this._bold || false;
        },
        set: function (_bold) {
            this._bold = _bold;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "textAlign", {
        get: function () {
            return this._textAlign || 'center';
        },
        set: function (_textAlign) {
            this._textAlign = _textAlign;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "textColor", {
        get: function () {
            return this._textColor || '0xffffff';
        },
        set: function (_textColor) {
            this._textColor = _textColor;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Label.prototype, "fontFamily", {
        get: function () {
            return this._fontFamily || 'Arial';
        },
        set: function (_fontFamily) {
            this._fontFamily = _fontFamily;
        },
        enumerable: false,
        configurable: true
    });
    Label.prototype.updateView = function () {
        this.width = this._text.width || this.explicitWidth;
        this.height = this._text.height || this.explicitHeight;
        this._config.width = this.width;
        this._config.height = this.height;
    };
    Label.prototype.destroy = function (options) {
        _super.prototype.destroy.call(this, options);
    };
    return Label;
}(CompatibilityContainer));
export { Label };
//# sourceMappingURL=Label.js.map