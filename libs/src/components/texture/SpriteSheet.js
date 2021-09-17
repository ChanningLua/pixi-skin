import { core } from './../../core/Core';
import { resourceManager } from './../../resource/ResourceManager';
import { RenderSheet } from '../renderSheet/RenderTextures';
var SpriteSheet = (function () {
    function SpriteSheet() {
    }
    SpriteSheet.prototype.parse = function (name, callBack, width, height) {
        var _this = this;
        if (width === void 0) { width = 2048; }
        if (height === void 0) { height = 2048; }
        this.loadCallBack = callBack;
        var maxSize = Math.max(width, height);
        this.canvasBuffer = document.createElement('canvas');
        this.contextBuffer = this.canvasBuffer.getContext('2d');
        this.sheet = new RenderSheet({ maxSize: maxSize });
        resourceManager.loadAssets(resourceManager.getResourceItem(name).url, function (assets, path) {
            var assetsData = JSON.parse(assets);
            var file = assetsData.file;
            _this.textureFrames = assetsData.frames;
            path = path.substring(0, path.lastIndexOf('/'));
            path = path.substring(0, path.lastIndexOf('/'));
            path += file.substring(file.indexOf('/'), file.length);
            _this.sheet.addImage(path, path);
            _this.sheet.render();
            _this.path = path;
        });
        core.listen('render', this.sheetTexture, this);
    };
    SpriteSheet.prototype.sheetTexture = function () {
        core.unlisten('render', this.sheetTexture, this);
        var sheetTexture = this.sheet.getTexture(this.path);
        var canvas = sheetTexture.baseTexture['resource'];
        var context = canvas.getContext('2d');
        for (var key in this.textureFrames) {
            var textureFrame = this.textureFrames[key];
            var frame = this.createTextureFrame(key, textureFrame.x, textureFrame.y, textureFrame.w, textureFrame.h, textureFrame.offsetX, textureFrame.offsetY, textureFrame.sourceW, textureFrame.sourceH);
            var textureData = this.createTexture(context, frame);
            this.sheet.addData(key, textureData);
        }
        core.listen('render', this.sheetTextures, this);
        this.sheet.render();
    };
    SpriteSheet.prototype.sheetTextures = function () {
        core.unlisten('render', this.sheetTextures, this);
        this.loadCallBack && this.loadCallBack();
    };
    SpriteSheet.prototype.createTextureFrame = function (name, bitmapX, bitmapY, bitmapWidth, bitmapHeight, offsetX, offsetY, textureWidth, textureHeight) {
        if (offsetX === void 0) { offsetX = 0; }
        if (offsetY === void 0) { offsetY = 0; }
        if (textureWidth === void 0) {
            textureWidth = offsetX + bitmapWidth;
        }
        if (textureHeight === void 0) {
            textureHeight = offsetY + bitmapHeight;
        }
        return {
            x: bitmapX,
            y: bitmapY,
            w: bitmapWidth,
            h: bitmapHeight,
            offsetX: offsetX,
            offsetY: offsetY,
            sourceW: textureWidth,
            sourceH: textureHeight
        };
    };
    SpriteSheet.prototype.createTexture = function (context, frame) {
        var data = context.getImageData(frame.x, frame.y, frame.w, frame.h);
        this.canvasBuffer.width = frame.sourceW;
        this.canvasBuffer.height = frame.sourceH;
        this.contextBuffer.clearRect(0, 0, frame.sourceW, frame.sourceH);
        this.contextBuffer.putImageData(data, 0 + frame.offsetX, 0 + frame.offsetY);
        return this.canvasBuffer.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '');
    };
    return SpriteSheet;
}());
export { SpriteSheet };
//# sourceMappingURL=SpriteSheet.js.map