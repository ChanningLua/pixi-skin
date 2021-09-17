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
var Input = (function (_super) {
    __extends(Input, _super);
    function Input(styles) {
        var _this = _super.call(this) || this;
        _this._box_cache = {};
        _this._previous = {};
        _this._dom_added = false;
        _this._dom_visible = true;
        _this._placeholder = '';
        _this._placeholderColor = 0xa9a9a9;
        _this._selection = [0, 0];
        _this._restrict_value = '';
        _this._input_style = Object.assign({
            position: 'absolute',
            background: 'none',
            border: 'none',
            outline: 'none',
            transformOrigin: '0 0',
            lineHeight: '1'
        }, styles.input);
        if (styles.box) {
            _this._box_generator = typeof styles.box === 'function' ? styles.box : new DefaultBoxGenerator(styles.box);
        }
        else {
            _this._box_generator = null;
        }
        if (_this._input_style.hasOwnProperty('multiline')) {
            _this._multiline = !!_this._input_style.multiline;
            delete _this._input_style.multiline;
        }
        else {
            _this._multiline = false;
        }
        _this._createDOMInput();
        _this.substituteText = true;
        _this._setState('DEFAULT');
        _this._addListeners();
        return _this;
    }
    Object.defineProperty(Input.prototype, "substituteText", {
        get: function () {
            return this._substituted;
        },
        set: function (substitute) {
            if (this._substituted == substitute) {
                return;
            }
            this._substituted = substitute;
            if (substitute) {
                this._createSurrogate();
                this._dom_visible = false;
            }
            else {
                this._destroySurrogate();
                this._dom_visible = true;
            }
            this.placeholder = this._placeholder;
            this._update();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "placeholder", {
        get: function () {
            return this._placeholder;
        },
        set: function (text) {
            this._placeholder = text;
            if (this._substituted) {
                this._updateSurrogate();
                this._dom_input.placeholder = '';
            }
            else {
                this._dom_input.placeholder = text;
            }
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "disabled", {
        get: function () {
            return this._disabled;
        },
        set: function (disabled) {
            this._disabled = disabled;
            this._dom_input.disabled = disabled;
            this._setState(disabled ? 'DISABLED' : 'DEFAULT');
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "maxLength", {
        get: function () {
            return this._max_length;
        },
        set: function (length) {
            this._max_length = length;
            this._dom_input.setAttribute('maxlength', length);
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "restrict", {
        get: function () {
            return this._restrict_regex;
        },
        set: function (regex) {
            if (regex instanceof RegExp) {
                regex = regex.toString().slice(1, -1);
                if (regex.charAt(0) !== '^') {
                    regex = '^' + regex;
                }
                if (regex.charAt(regex.length - 1) !== '$') {
                    regex = regex + '$';
                }
                regex = new RegExp(regex);
            }
            else {
                regex = new RegExp('^[' + regex + ']*$');
            }
            this._restrict_regex = regex;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "text", {
        get: function () {
            return this._dom_input.value;
        },
        set: function (text) {
            this._dom_input.value = text;
            if (this._substituted)
                this._updateSurrogate();
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(Input.prototype, "htmlInput", {
        get: function () {
            return this._dom_input;
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype.focus = function () {
        if (this._substituted && !this.dom_visible) {
            this._setDOMInputVisible(true);
        }
        this._dom_input.focus();
    };
    Input.prototype.blur = function () {
        this._dom_input.blur();
    };
    Input.prototype.select = function () {
        this.focus();
        this._dom_input.select();
    };
    Input.prototype.setInputStyle = function (key, value) {
        this._input_style[key] = value;
        this._dom_input.style[key] = value;
        if (this._substituted && (key === 'fontFamily' || key === 'fontSize')) {
            this._updateFontMetrics();
        }
        if (this._last_renderer) {
            this._update();
        }
    };
    Input.prototype.destroy = function (options) {
        this._destroyBoxCache();
        _super.prototype.destroy.call(this, options);
    };
    Input.prototype._createDOMInput = function () {
        if (this._multiline) {
            this._dom_input = document.createElement('textarea');
            this._dom_input.style.resize = 'none';
        }
        else {
            this._dom_input = document.createElement('input');
            this._dom_input.type = 'text';
        }
        for (var key in this._input_style) {
            this._dom_input.style[key] = this._input_style[key];
        }
    };
    Input.prototype._addListeners = function () {
        this['on']('added', this._onAdded.bind(this));
        this['on']('removed', this._onRemoved.bind(this));
        this._dom_input.addEventListener('keydown', this._onInputKeyDown.bind(this));
        this._dom_input.addEventListener('input', this._onInputInput.bind(this));
        this._dom_input.addEventListener('keyup', this._onInputKeyUp.bind(this));
        this._dom_input.addEventListener('focus', this._onFocused.bind(this));
        this._dom_input.addEventListener('blur', this._onBlurred.bind(this));
    };
    Input.prototype._onInputKeyDown = function (e) {
        this._selection = [
            this._dom_input.selectionStart,
            this._dom_input.selectionEnd
        ];
        this['emit']('keydown', e.keyCode);
    };
    Input.prototype._onInputInput = function (e) {
        if (this._restrict_regex) {
            this._applyRestriction();
        }
        if (this._substituted) {
            this._updateSubstitution();
        }
        this['emit']('input', this.text);
    };
    Input.prototype._onInputKeyUp = function (e) {
        this['emit']('keyup', e.keyCode);
    };
    Input.prototype._onFocused = function () {
        this._setState('FOCUSED');
        this['emit']('focus');
    };
    Input.prototype._onBlurred = function () {
        this._setState('DEFAULT');
        this['emit']('blur');
    };
    Input.prototype._onAdded = function () {
        document.getElementById('imageEditorApp').appendChild(this._dom_input);
        this._dom_input.style.display = 'none';
        this._dom_added = true;
    };
    Input.prototype._onRemoved = function () {
        document.getElementById('imageEditorApp').removeChild(this._dom_input);
        this._dom_added = false;
    };
    Input.prototype._setState = function (state) {
        this.state = state;
        this._updateBox();
        if (this._substituted) {
            this._updateSubstitution();
        }
    };
    Input.prototype.render = function (renderer) {
        _super.prototype['render'].call(this, renderer);
        this._renderInternal(renderer);
    };
    Input.prototype._renderInternal = function (renderer) {
        this._resolution = renderer.resolution;
        this._last_renderer = renderer;
        this._canvas_bounds = this._getCanvasBounds();
        if (this._needsUpdate()) {
            this._update();
        }
    };
    Input.prototype._update = function () {
        this._updateDOMInput();
        if (this._substituted)
            this._updateSurrogate();
        this._updateBox();
    };
    Input.prototype._updateBox = function () {
        if (!this._box_generator) {
            return;
        }
        if (this._needsNewBoxCache()) {
            this._buildBoxCache();
        }
        if (this.state == this._previous['state'] &&
            this._box == this._box_cache[this.state]) {
            return;
        }
        if (this._box) {
            this['removeChild'](this._box);
        }
        this._box = this._box_cache[this.state];
        this['addChildAt'](this._box, 0);
        this._previous['state'] = this.state;
    };
    Input.prototype._updateSubstitution = function () {
        if (this.state === 'FOCUSED') {
            this._dom_visible = true;
            this._surrogate.visible = this.text.length === 0;
        }
        else {
            this._dom_visible = false;
            this._surrogate.visible = true;
        }
        this._updateDOMInput();
        this._updateSurrogate();
    };
    Input.prototype._updateDOMInput = function () {
        if (!this._canvas_bounds) {
            return;
        }
        this._dom_input.style.top = (this._canvas_bounds.top || 0) + 'px';
        this._dom_input.style.left = (this._canvas_bounds.left || 0) + 'px';
        this._dom_input.style.transform = this._pixiMatrixToCSS(this._getDOMRelativeWorldTransform());
        this._dom_input.style.opacity = this['worldAlpha'];
        this._setDOMInputVisible(this['worldVisible'] && this._dom_visible);
        this._previous['canvas_bounds'] = this._canvas_bounds;
        this._previous['world_transform'] = this['worldTransform'].clone();
        this._previous['world_alpha'] = this['worldAlpha'];
        this._previous['world_visible'] = this['worldVisible'];
    };
    Input.prototype._applyRestriction = function () {
        if (this._restrict_regex.test(this.text)) {
            this._restrict_value = this.text;
        }
        else {
            this.text = this._restrict_value;
            this._dom_input.setSelectionRange(this._selection[0], this._selection[1]);
        }
    };
    Input.prototype._needsUpdate = function () {
        return (!this._comparePixiMatrices(this['worldTransform'], this._previous['world_transform']) ||
            !this._compareClientRects(this._canvas_bounds, this._previous['canvas_bounds']) ||
            this['worldAlpha'] != this._previous['world_alpha'] ||
            this['worldVisible'] != this._previous['world_visible']);
    };
    Input.prototype._needsNewBoxCache = function () {
        var input_bounds = this._getDOMInputBounds();
        return (!this._previous['input_bounds'] ||
            input_bounds.width != this._previous['input_bounds'].width ||
            input_bounds.height != this._previous['input_bounds'].height);
    };
    Input.prototype._createSurrogate = function () {
        this._surrogate_hitbox = new PIXI.Graphics();
        this._surrogate_hitbox.alpha = 0;
        this._surrogate_hitbox.interactive = true;
        this._surrogate_hitbox.cursor = 'text';
        this._surrogate_hitbox.on('pointerdown', this._onSurrogateFocus.bind(this));
        this['addChild'](this._surrogate_hitbox);
        this._surrogate_mask = new PIXI.Graphics();
        this['addChild'](this._surrogate_mask);
        this._surrogate = new PIXI.Text('', {});
        this['addChild'](this._surrogate);
        this._surrogate.mask = this._surrogate_mask;
        this._updateFontMetrics();
        this._updateSurrogate();
    };
    Input.prototype._updateSurrogate = function () {
        var padding = this._deriveSurrogatePadding();
        var input_bounds = this._getDOMInputBounds();
        this._surrogate.style = this._deriveSurrogateStyle();
        this._surrogate.style.padding = Math.max.apply(Math, padding);
        this._surrogate.y = this._multiline ? padding[0] : (input_bounds.height - this._surrogate.height) / 2;
        this._surrogate.x = padding[3];
        this._surrogate.text = this._deriveSurrogateText();
        switch (this._surrogate.style.align) {
            case 'left':
                this._surrogate.x = padding[3];
                break;
            case 'center':
                this._surrogate.x = input_bounds.width * 0.5 - this._surrogate.width * 0.5;
                break;
            case 'right':
                this._surrogate.x = input_bounds.width - padding[1] - this._surrogate.width;
                break;
        }
        this._updateSurrogateHitbox(input_bounds);
        this._updateSurrogateMask(input_bounds, padding);
    };
    Input.prototype._updateSurrogateHitbox = function (bounds) {
        this._surrogate_hitbox.clear();
        this._surrogate_hitbox.beginFill(0);
        this._surrogate_hitbox.drawRect(0, 0, bounds.width, bounds.height);
        this._surrogate_hitbox.endFill();
        this._surrogate_hitbox.interactive = !this._disabled;
    };
    Input.prototype._updateSurrogateMask = function (bounds, padding) {
        this._surrogate_mask.clear();
        this._surrogate_mask.beginFill(0);
        this._surrogate_mask.drawRect(padding[3], 0, bounds.width - padding[3] - padding[1], bounds.height);
        this._surrogate_mask.endFill();
    };
    Object.defineProperty(Input.prototype, "textDisplay", {
        get: function () {
            return this._surrogate;
        },
        enumerable: false,
        configurable: true
    });
    Input.prototype._destroySurrogate = function () {
        if (!this._surrogate)
            return;
        this['removeChild'](this._surrogate);
        this['removeChild'](this._surrogate_hitbox);
        this._surrogate.destroy();
        this._surrogate_hitbox.destroy();
        this._surrogate = null;
        this._surrogate_hitbox = null;
    };
    Input.prototype._onSurrogateFocus = function () {
        this._setDOMInputVisible(true);
        setTimeout(this._ensureFocus.bind(this), 10);
    };
    Input.prototype._ensureFocus = function () {
        if (!this._hasFocus()) {
            this.focus();
        }
    };
    Input.prototype._deriveSurrogateStyle = function () {
        var style = new PIXI.TextStyle({});
        for (var key in this._input_style) {
            switch (key) {
                case 'color':
                    style.fill = this._input_style.color;
                    break;
                case 'fontFamily':
                case 'fontSize':
                case 'fontWeight':
                case 'fontVariant':
                case 'fontStyle':
                    style[key] = this._input_style[key];
                    break;
                case 'letterSpacing':
                    style.letterSpacing = parseFloat(this._input_style.letterSpacing);
                    break;
                case 'textAlign':
                    style.align = this._input_style.textAlign;
                    break;
            }
        }
        if (this._multiline) {
            style.lineHeight = ~~style.fontSize;
            style.wordWrap = true;
            style.wordWrapWidth = this._getDOMInputBounds().width;
        }
        if (this._dom_input.value.length === 0) {
            style.fill = this._placeholderColor;
        }
        ;
        return style;
    };
    Input.prototype._deriveSurrogatePadding = function () {
        var indent = this._input_style.textIndent ? parseFloat(this._input_style.textIndent) : 0;
        if (this._input_style.padding && this._input_style.padding.length > 0) {
            var components = this._input_style.padding.trim().split(' ');
            if (components.length == 1) {
                var padding = parseFloat(components[0]);
                return [padding, padding, padding, padding + indent];
            }
            else if (components.length == 2) {
                var paddingV = parseFloat(components[0]);
                var paddingH = parseFloat(components[1]);
                return [paddingV, paddingH, paddingV, paddingH + indent];
            }
            else if (components.length == 4) {
                var padding = components.map(function (component) {
                    return parseFloat(component);
                });
                padding[3] += indent;
                return padding;
            }
        }
        return [0, 0, 0, indent];
    };
    Input.prototype._deriveSurrogateText = function () {
        if (this._dom_input.value.length === 0) {
            return this._placeholder;
        }
        if (this._dom_input.type == 'password') {
            return '•'.repeat(this._dom_input.value.length);
        }
        return this._dom_input.value;
    };
    Input.prototype._updateFontMetrics = function () {
        var style = this._deriveSurrogateStyle();
        var font = style.toFontString();
        this._font_metrics = PIXI.TextMetrics.measureFont(font);
    };
    Input.prototype._buildBoxCache = function () {
        this._destroyBoxCache();
        var states = ['DEFAULT', 'FOCUSED', 'DISABLED'];
        var input_bounds = this._getDOMInputBounds();
        for (var i in states) {
            this._box_cache[states[i]] = this._box_generator(input_bounds.width, input_bounds.height, states[i]);
        }
        this._previous['input_bounds'] = input_bounds;
    };
    Input.prototype._destroyBoxCache = function () {
        if (this._box) {
            this['removeChild'](this._box);
            this._box = null;
        }
        for (var i in this._box_cache) {
            this._box_cache[i].destroy();
            this._box_cache[i] = null;
            delete this._box_cache[i];
        }
    };
    Input.prototype._hasFocus = function () {
        return document.activeElement === this._dom_input;
    };
    Input.prototype._setDOMInputVisible = function (visible) {
        this._dom_input.style.display = visible ? 'block' : 'none';
    };
    Input.prototype._getCanvasBounds = function () {
        var rect = this._last_renderer.view.getBoundingClientRect();
        var bounds = { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
        bounds.left += window.scrollX;
        bounds.top += window.scrollY;
        return bounds;
    };
    Input.prototype._getDOMInputBounds = function () {
        var remove_after = false;
        if (!this._dom_added) {
            document.body.appendChild(this._dom_input);
            remove_after = true;
        }
        var org_transform = this._dom_input.style.transform;
        var org_display = this._dom_input.style.display;
        this._dom_input.style.transform = '';
        this._dom_input.style.display = 'block';
        var bounds = this._dom_input.getBoundingClientRect();
        this._dom_input.style.transform = org_transform;
        this._dom_input.style.display = org_display;
        if (remove_after) {
            document.body.removeChild(this._dom_input);
        }
        return bounds;
    };
    Input.prototype._getDOMRelativeWorldTransform = function () {
        var canvas_bounds = this._last_renderer.view.getBoundingClientRect();
        var matrix = this['worldTransform'].clone();
        matrix.scale(this._resolution, this._resolution);
        matrix.scale(canvas_bounds.width / this._last_renderer.width, canvas_bounds.height / this._last_renderer.height);
        return matrix;
    };
    Input.prototype._pixiMatrixToCSS = function (m) {
        return 'matrix(' + [m.a, m.b, m.c, m.d, m.tx, m.ty].join(',') + ')';
    };
    Input.prototype._comparePixiMatrices = function (m1, m2) {
        if (!m1 || !m2)
            return false;
        return (m1.a == m2.a &&
            m1.b == m2.b &&
            m1.c == m2.c &&
            m1.d == m2.d &&
            m1.tx == m2.tx &&
            m1.ty == m2.ty);
    };
    Input.prototype._compareClientRects = function (r1, r2) {
        if (!r1 || !r2)
            return false;
        return (r1.left == r2.left &&
            r1.top == r2.top &&
            r1.width == r2.width &&
            r1.height == r2.height);
    };
    return Input;
}(PIXI.Container));
export { Input };
var DefaultBoxGenerator = (function () {
    function DefaultBoxGenerator(styles) {
        styles = styles || { fill: 0xcccccc };
        if (styles.default) {
            styles.focused = styles.focused || styles.default;
            styles.disabled = styles.disabled || styles.default;
        }
        else {
            var temp_styles = styles;
            styles = {};
            styles.default = styles.focused = styles.disabled = temp_styles;
        }
        return function (w, h, state) {
            var style = styles[state.toLowerCase()];
            var box = new PIXI.Graphics();
            if (style.fill) {
                box.beginFill(style.fill);
            }
            if (style.stroke) {
                box.lineStyle(style.stroke.width || 1, style.stroke.color || 0, style.stroke.alpha || 1);
            }
            if (style.rounded) {
                box.drawRoundedRect(0, 0, w, h, style.rounded);
            }
            else {
                box.drawRect(0, 0, w, h);
            }
            box.endFill();
            box.closePath();
            return box;
        };
    }
    return DefaultBoxGenerator;
}());
//# sourceMappingURL=Input.js.map