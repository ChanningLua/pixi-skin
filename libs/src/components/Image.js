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
import { getTexture, getTextureUrl } from './../utils/Manager';
import { log, LOG_LEVEL_WARNING } from './../utils/Log';
var Image = (function (_super) {
    __extends(Image, _super);
    function Image() {
        var _this = _super.call(this) || this;
        _this._range = new PIXI.Rectangle();
        return _this;
    }
    Object.defineProperty(Image.prototype, "width", {
        get: function () {
            return this['scale'].x * this['getLocalBounds']().width;
        },
        set: function (value) {
            if (this._scale9Grid != null) {
                this.updateLocs();
            }
            else {
                var width = this['getLocalBounds']().width;
                if (width !== 0) {
                    this['scale'].x = value / width;
                }
                else {
                    this['scale'].x = 1;
                }
                this['_width'] = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "height", {
        get: function () {
            return this['scale'].y * this['getLocalBounds']().height;
        },
        set: function (value) {
            if (this._scale9Grid != null) {
                this.updateLocs();
            }
            else {
                var height = this['getLocalBounds']().height;
                if (height !== 0) {
                    this['scale'].y = value / height;
                }
                else {
                    this['scale'].y = 1;
                }
                this['_height'] = value;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "scale9Grid", {
        get: function () {
            return this._scale9Grid;
        },
        set: function (value) {
            if (value != null && value === this._scale9Grid) {
                return;
            }
            this._scale9Grid = value;
            this.updateView();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "fillMode", {
        get: function () {
            return null;
        },
        set: function (value) {
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "texture", {
        get: function () {
            return this._texture;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Image.prototype, "source", {
        get: function () {
            return this._source;
        },
        set: function (value) {
            var _this = this;
            if (value == null) {
                this._texture = PIXI.Texture.EMPTY;
                this._source = null;
                this.updateView();
            }
            else if (value instanceof PIXI.Texture) {
                this._texture = value;
                this._source = value;
                this.updateView();
            }
            else if (typeof value === 'string') {
                var texture = getTexture(value);
                this._source = value;
                if (texture != null && texture instanceof PIXI.Texture) {
                    this._texture = texture;
                    this._source = value;
                    this.updateView();
                }
                else {
                    if (value.length === 0) {
                        this._texture = null;
                        this._source = value;
                        this.updateView();
                        return;
                    }
                    var _realUrl = getTextureUrl(value);
                    this._texture = PIXI.Texture.from(_realUrl);
                    this._texture.once('update', function () {
                        _this.updateView();
                    }, this);
                }
            }
            else {
                log('没有找到贴图：' + value, LOG_LEVEL_WARNING);
            }
        },
        enumerable: false,
        configurable: true
    });
    Image.prototype.getSprite = function () {
        return this._sprite;
    };
    Image.prototype.updateView = function () {
        var _a, _b;
        if (this._scale9Grid == null) {
            this._range.x = 0;
            this._range.y = 0;
            this._range.width = 0;
            this._range.height = 0;
            this.clearSprites();
            if (!this._sprite) {
                this._sprite = new PIXI.Sprite();
                this['addChild'](this._sprite);
            }
            this._sprite.texture = this._texture || PIXI.Texture.EMPTY;
            var _scaleX = this._config && Math.abs(parseFloat((_a = this._config) === null || _a === void 0 ? void 0 : _a.scaleX)) || 1, _scaleY = this._config && Math.abs(parseFloat((_b = this._config) === null || _b === void 0 ? void 0 : _b.scaleY)) || 1;
            var _textureWidth = this._explicitWidth || this._config && ~~this._config.width || this._sprite.texture.frame.width, _textureHeight = this._explicitHeight || this._config && ~~this._config.height || this._sprite.texture.frame.height;
            this.width = ~~(_textureWidth * _scaleX);
            this.height = ~~(_textureHeight * _scaleY);
        }
        else {
            var configList = this._scale9Grid.split(',');
            if (configList.length < 4) {
                return;
            }
            this._range.x = parseInt(configList[0], 10);
            this._range.y = parseInt(configList[1], 10);
            this._range.width = parseInt(configList[2], 10);
            this._range.height = parseInt(configList[3], 10);
            this.width = this._explicitWidth || this.texture.frame.width;
            this.height = this._explicitHeight || this.texture.frame.height;
            this.generateSprites();
            this.updateLocs();
        }
    };
    Image.prototype.clearSprites = function () {
        if (this._scale9Textures != null && this._scale9Textures.length > 0) {
            for (var i = this._scale9Textures.length - 1; i >= 0; i--) {
                this._scale9Textures[i].destroy();
            }
            this._scale9Textures.length = 0;
        }
    };
    Image.prototype.generateTextureByRange = function (texture, range) {
        var newTexture = texture.clone();
        var frame = newTexture.frame.clone();
        frame.x += range.x;
        frame.y += range.y;
        frame.width = range.width;
        frame.height = range.height;
        newTexture.frame = frame;
        return newTexture;
    };
    Image.prototype.generateSprites = function () {
        if (this._texture == null) {
            return;
        }
        var width = this._range.width;
        var height = this._range.height;
        var left = this._range.x;
        var right = left + width;
        var top = this._range.y;
        var bottom = top + height;
        var ranges = [
            new PIXI.Rectangle(0, 0, left, top),
            new PIXI.Rectangle(left, 0, width, top),
            new PIXI.Rectangle(right, 0, this._texture.width - right, top),
            new PIXI.Rectangle(0, top, left, height),
            new PIXI.Rectangle(left, top, width, height),
            new PIXI.Rectangle(right, top, this._texture.width - right, height),
            new PIXI.Rectangle(0, bottom, left, this._texture.height - bottom),
            new PIXI.Rectangle(left, bottom, width, this._texture.height - bottom),
            new PIXI.Rectangle(right, bottom, this._texture.width - right, this._texture.height - bottom),
        ];
        this._scale9Textures = this._scale9Textures || [];
        this.clearSprites();
        for (var i = 0, len = ranges.length; i < len; i++) {
            var texture = this.generateTextureByRange(this._texture, ranges[i]);
            var sprite = new PIXI.Sprite(texture);
            this._scale9Textures.push(texture);
            this['addChild'](sprite);
        }
    };
    Image.prototype.updateLocs = function () {
        var children = this['children'];
        if (children.length !== 9) {
            return;
        }
        var boundX = children[0].width + children[2].width;
        var boundY = children[0].height + children[6].height;
        var thisWidth = this._explicitWidth || this.texture.frame.width;
        var thisHeight = this._explicitHeight || this.texture.frame.height;
        if (thisWidth >= boundX) {
            children[0].scale.x = children[2].scale.x = children[3].scale.x = children[5].scale.x = children[6].scale.x = children[8].scale.x = 1;
            children[1].width = children[4].width = children[7].width = thisWidth - boundX;
        }
        else {
            children[0].width = children[2].width = children[3].width = children[5].width = children[6].width = children[8].width = thisWidth * 0.5;
            children[1].width = children[4].width = children[7].width = 0;
        }
        if (thisHeight >= boundY) {
            children[0].scale.y = children[1].scale.y = children[2].scale.y = children[6].scale.y = children[7].scale.y = children[8].scale.y = 1;
            children[3].height = children[4].height = children[5].height = thisHeight - boundY;
        }
        else {
            children[0].height = children[1].height = children[2].height = children[6].height = children[7].height = children[8].height = thisHeight * 0.5;
            children[3].height = children[4].height = children[5].height = 0;
        }
        var w1 = children[0].width;
        var w2 = w1 + children[1].width;
        var h1 = children[0].height;
        var h2 = h1 + children[3].height;
        for (var i = 0; i < 3; i++) {
            children[i * 3].x = 0 - this.anchorOffsetX;
            children[i * 3 + 1].x = w1 - this.anchorOffsetX;
            children[i * 3 + 2].x = w2 - this.anchorOffsetX;
            children[i].y = 0 - this.anchorOffsetY;
            children[i + 3].y = h1 - this.anchorOffsetY;
            children[i + 6].y = h2 - this.anchorOffsetY;
        }
    };
    Image.prototype.destroy = function (options) {
        this.clearSprites();
        _super.prototype.destroy.call(this, options);
    };
    return Image;
}(CompatibilityContainer));
export { Image };
//# sourceMappingURL=Image.js.map