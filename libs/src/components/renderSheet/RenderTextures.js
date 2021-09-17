import * as PIXI from 'pixi.js';
import { core } from './../../core/Core';
import { GrowingPacker } from './growingpacker';
import { SimplePacker } from './simplepacker';
var CANVAS = 0;
var IMAGE = 1;
var DATA = 2;
var WAIT = 50;
var RenderSheet = (function () {
    function RenderSheet(options) {
        options = options || {};
        this.wait = options.wait || WAIT;
        this.testBoxes = options.testBoxes || false;
        this.maxSize = options.maxSize || 2048;
        this.buffer = options.buffer || 5;
        this.scale = options.scale || 1;
        this.scaleMode = options.scaleMode === true ? PIXI.SCALE_MODES.NEAREST : options.scaleMode;
        this.resolution = options.resolution || 1;
        this.show = options.show;
        this.extrude = options.extrude;
        if (this.extrude && this.buffer < 2) {
            this.buffer = 2;
        }
        this.packer = options.useSimplePacker ? SimplePacker : GrowingPacker;
        this.clear();
    }
    RenderSheet.prototype.clear = function () {
        this.canvases = [];
        this.baseTextures = [];
        this.textures = {};
    };
    RenderSheet.prototype.add = function (name, draw, measure, param) {
        var object = this.textures[name] = { name: name, draw: draw, measure: measure, param: param, type: CANVAS, texture: new PIXI.Texture(PIXI.Texture.EMPTY) };
        return object;
    };
    RenderSheet.prototype.addImage = function (name, src) {
        var object = this.textures[name] = { name: name, file: src, type: IMAGE, texture: new PIXI.Texture(PIXI.Texture.EMPTY) };
        object.image = new Image();
        object.image.onload = function () { return object.loaded = true; };
        object.image.src = src;
        return object;
    };
    RenderSheet.prototype.addData = function (name, data, header) {
        header = typeof header !== 'undefined' ? header : 'data:image/png;base64,';
        var object = this.textures[name] = { name: name, type: DATA, texture: new PIXI.Texture(PIXI.Texture.EMPTY) };
        object.image = new Image();
        object.image.src = header + data;
        if (object.image.complete) {
            object.loaded = true;
        }
        else {
            object.image.onload = function () { return object.loaded = true; };
        }
        return object;
    };
    RenderSheet.prototype.showCanvases = function () {
        if (!this.divCanvases) {
            this.divCanvases = document.createElement('div');
            document.body.appendChild(this.divCanvases);
        }
        else {
            while (this.divCanvases.hasChildNodes()) {
                this.divCanvases.removeChild(this.divCanvases.lastChild);
            }
        }
        var percent = 1 / this.canvases.length;
        for (var i = 0; i < this.canvases.length; i++) {
            var canvas = this.canvases[i];
            var style = canvas.style;
            style.position = 'fixed';
            style.left = '0px';
            style.top = i * Math.round(percent * 100) + '%';
            style.width = 'auto';
            style.height = Math.round(percent * 100) + '%';
            style.zIndex = 1000;
            if (this.scaleMode === PIXI.SCALE_MODES.NEAREST) {
                style.imageRendering = 'pixelated';
            }
            style.background = this.randomColor();
            if (typeof this.show === 'object') {
                for (var key in this.show) {
                    style[key] = this.show[key];
                }
            }
            this.divCanvases.appendChild(canvas);
        }
    };
    RenderSheet.prototype.exists = function (name) {
        return !!this.textures[name];
    };
    RenderSheet.prototype.getTexture = function (name) {
        var texture = this.textures[name];
        if (texture) {
            return texture.texture;
        }
        else {
            console.warn('yy-rendersheet: texture ' + name + ' not found in spritesheet.');
            return null;
        }
    };
    RenderSheet.prototype.getSprite = function (name, anchorValue) {
        if (anchorValue === void 0) { anchorValue = 0.5; }
        var texture = this.getTexture(name);
        if (texture) {
            var sprite = new PIXI.Sprite(texture);
            sprite.anchor.set(anchorValue);
            return sprite;
        }
        else {
            return null;
        }
    };
    RenderSheet.prototype.get = function (name) {
        return this.getSprite(name);
    };
    RenderSheet.prototype.entries = function () {
        return Object.keys(this.textures).length;
    };
    RenderSheet.prototype.debug = function () {
        for (var i = 0; i < this.canvases.length; i++) {
            var canvas = this.canvases[i];
            console.log('yy-rendersheet: Sheet #' + (i + 1) + ' | size: ' + canvas.width + 'x' + canvas.height + ' | resolution: ' + this.resolution);
        }
    };
    RenderSheet.prototype.getIndex = function (find) {
        var i = 0;
        for (var key in this.textures) {
            if (i === find) {
                return this.textures[key].texture;
            }
            i++;
        }
        return null;
    };
    RenderSheet.prototype.checkLoaded = function () {
        for (var key in this.textures) {
            var current = this.textures[key];
            if ((current.type === IMAGE || current.type === DATA) && !current.loaded) {
                return false;
            }
        }
        return true;
    };
    RenderSheet.prototype.asyncRender = function (skipTextures) {
        var _this = this;
        return new Promise(function (resolve) {
            _this.render(resolve, skipTextures);
        });
    };
    RenderSheet.prototype.render = function (callback, callbackThisArag, skipTextures) {
        var _this = this;
        if (callback === void 0) { callback = null; }
        if (callbackThisArag === void 0) { callbackThisArag = null; }
        if (skipTextures === void 0) { skipTextures = null; }
        if (callback) {
            core.listen('render', callback, callbackThisArag, true);
        }
        if (!Object.keys(this.textures).length) {
            core.dispatch('render');
            return;
        }
        if (!this.checkLoaded()) {
            setTimeout(function () { return _this.render(); }, this.wait);
            return;
        }
        this.canvases = [];
        this.sorted = [];
        this.measure();
        this.sort();
        this.pack();
        this.draw();
        if (!skipTextures) {
            this.createBaseTextures();
            for (var key in this.textures) {
                var current = this.textures[key];
                current.texture.baseTexture = this.baseTextures[current.canvas];
                current.texture.frame = new PIXI.Rectangle(current.x, current.y, current.width, current.height);
                current.texture.update();
            }
        }
        if (this.show) {
            this.showCanvases();
        }
        core.dispatch('render');
    };
    RenderSheet.prototype.measure = function () {
        var c = document.createElement('canvas');
        c.width = this.maxSize;
        c.height = this.maxSize;
        var context = c.getContext('2d');
        var multiplier = Math.ceil(this.scale * this.resolution);
        for (var key in this.textures) {
            var texture = this.textures[key];
            switch (texture.type) {
                case CANVAS:
                    var size = texture.measure(context, texture.param, c);
                    texture.width = Math.ceil(size.width * multiplier);
                    texture.height = Math.ceil(size.height * multiplier);
                    break;
                case IMAGE:
                case DATA:
                    texture.width = Math.ceil(texture.image.width * multiplier);
                    texture.height = Math.ceil(texture.image.height * multiplier);
                    break;
            }
            this.sorted.push(texture);
        }
    };
    RenderSheet.prototype.sort = function () {
        this.sorted.sort(function (a, b) {
            var aSize = Math.max(a.height, a.width);
            var bSize = Math.max(b.height, b.width);
            if (aSize === bSize) {
                aSize = Math.min(a.height, a.width);
                bSize = Math.max(b.height, b.width);
            }
            return bSize - aSize;
        });
    };
    RenderSheet.prototype.createCanvas = function (size) {
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = size || this.maxSize;
        this.canvases.push(canvas);
    };
    RenderSheet.prototype.randomColor = function () {
        function r() {
            return Math.floor(Math.random() * 255);
        }
        return 'rgba(' + r() + ',' + r() + ',' + r() + ', 0.2)';
    };
    RenderSheet.prototype.draw = function () {
        var current, context;
        var multiplier = Math.ceil(this.scale * this.resolution);
        for (var key in this.textures) {
            var texture = this.textures[key];
            if (texture.canvas !== current) {
                if (typeof current !== 'undefined') {
                    context.restore();
                }
                current = texture.canvas;
                context = this.canvases[current].getContext('2d');
                context.save();
                context.scale(multiplier, multiplier);
            }
            context.save();
            context.translate(Math.ceil(texture.x / multiplier), Math.ceil(texture.y / multiplier));
            if (this.testBoxes) {
                context.fillStyle = this.randomColor();
                context.fillRect(0, 0, Math.ceil(texture.width / multiplier), Math.ceil(texture.height / multiplier));
            }
            switch (texture.type) {
                case CANVAS:
                    texture.draw(context, texture.param, this.canvases[current]);
                    break;
                case IMAGE:
                case DATA:
                    context.drawImage(texture.image, 0, 0);
                    break;
            }
            if (this.extrude) {
                this.extrudeEntry(texture, context, current);
            }
            context.restore();
        }
        context.restore();
    };
    RenderSheet.prototype.extrudeEntry = function (texture, context, current) {
        function get(x, y) {
            var entry = (x + y * texture.width) * 4;
            var d = data.data;
            return 'rgba(' + d[entry] + ',' + d[entry + 1] + ',' + d[entry + 2] + ',' + (d[entry + 3] / 0xff) + ')';
        }
        var canvas = this.canvases[current];
        var data = context.getImageData(texture.x, texture.y, texture.width, texture.height);
        if (texture.x !== 0) {
            for (var y = 0; y < texture.height; y++) {
                context.fillStyle = get(0, y);
                context.fillRect(-1, y, 1, 1);
            }
            if (texture.y !== 0) {
                context.fillStyle = get(0, 0);
                context.fillRect(-1, -1, 1, 1);
            }
        }
        if (texture.x + texture.width !== canvas.width - 1) {
            for (var y = 0; y < texture.height; y++) {
                context.fillStyle = get(texture.width - 1, y);
                context.fillRect(texture.width, y, 1, 1);
            }
            if (texture.y + texture.height !== canvas.height - 1) {
                context.fillStyle = get(texture.width - 1, texture.height - 1);
                context.fillRect(texture.width, texture.height, 1, 1);
            }
        }
        if (texture.y !== 0) {
            for (var x = 0; x < texture.width; x++) {
                context.fillStyle = get(x, 0);
                context.fillRect(x, -1, 1, 1);
            }
        }
        if (texture.y + texture.height !== canvas.height - 1) {
            for (var x = 0; x < texture.width; x++) {
                context.fillStyle = get(x, texture.height - 1);
                context.fillRect(x, texture.height, 1, 1);
            }
        }
    };
    RenderSheet.prototype.createBaseTextures = function () {
        while (this.baseTextures.length) {
            this.baseTextures.pop().destroy();
        }
        for (var i = 0; i < this.canvases.length; i++) {
            var from = PIXI.BaseTexture.fromCanvas || PIXI.BaseTexture.from;
            var base = from(this.canvases[i]);
            base.scaleMode = this.scaleMode;
            this.baseTextures.push(base);
        }
    };
    RenderSheet.prototype.pack = function () {
        var packers = [new this.packer(this.maxSize, this.sorted[0], this.buffer)];
        for (var i = 0; i < this.sorted.length; i++) {
            var block = this.sorted[i];
            var packed = false;
            for (var j = 0; j < packers.length; j++) {
                if (packers[j].add(block, j)) {
                    block.canvas = j;
                    packed = true;
                    break;
                }
            }
            if (!packed) {
                packers.push(new this.packer(this.maxSize, block, this.buffer));
                if (!packers[j].add(block, j)) {
                    console.warn('yy-rendersheet: ' + block.name + ' is too big for the spritesheet.');
                    return;
                }
                else {
                    block.canvas = j;
                }
            }
        }
        for (var i = 0; i < packers.length; i++) {
            var size = packers[i].finish(this.maxSize);
            this.createCanvas(size);
        }
    };
    RenderSheet.prototype.changeDraw = function (name, draw) {
        var texture = this.textures[name];
        if (texture.type !== CANVAS) {
            console.warn('yy-sheet.changeTextureDraw only works with type: CANVAS.');
            return;
        }
        texture.draw = draw;
        var context = this.canvases[texture.canvas].getContext('2d');
        var multiplier = this.scale * this.resolution;
        context.save();
        context.scale(multiplier, multiplier);
        context.translate(texture.x / multiplier, texture.y / multiplier);
        texture.draw(context, texture.param);
        context.restore();
        texture.texture.update();
    };
    return RenderSheet;
}());
export { RenderSheet };
//# sourceMappingURL=RenderTextures.js.map