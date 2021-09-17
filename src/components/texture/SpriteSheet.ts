import { core } from './../../core/Core';
import { resourceManager } from './../../resource/ResourceManager';
import { RenderSheet } from '../renderSheet/RenderTextures';

export class SpriteSheet {
  
  private sheet: RenderSheet;
  private path: string;
  private textureFrames: Array<textureFrame>;

  private canvasBuffer: HTMLCanvasElement;
  private contextBuffer: CanvasRenderingContext2D;

  private loadCallBack: Function;
  public parse (name, callBack, width = 2048, height = 2048) {

      this.loadCallBack = callBack;

      const maxSize = Math.max(width, height);
      
      this.canvasBuffer = document.createElement('canvas');
      
      this.contextBuffer = this.canvasBuffer.getContext('2d');

      this.sheet = new RenderSheet({ maxSize: maxSize });
      
      // this.sheet.testBoxes = true;

      // this.sheet.show = { opacity: 0.3, pointerEvents: 'none' };

      resourceManager.loadAssets( resourceManager.getResourceItem(name).url, (assets, path) => {
          let assetsData = JSON.parse(assets);
          let file = assetsData.file;
          this.textureFrames = assetsData.frames;
          path = path.substring(0, path.lastIndexOf('/'));
          path = path.substring(0, path.lastIndexOf('/'));
          path += file.substring(file.indexOf('/'), file.length);
          this.sheet.addImage(path, path);
          this.sheet.render();
          this.path = path;
      });
      core.listen('render', this.sheetTexture, this);
  }

  private sheetTexture ()
  {
      core.unlisten('render', this.sheetTexture, this);

      const sheetTexture = this.sheet.getTexture(this.path);
      const canvas: any = sheetTexture.baseTexture.source;
      const context = canvas.getContext('2d');
      for (let key in this.textureFrames) {
          let textureFrame: textureFrame = this.textureFrames[key];
          let frame: textureFrame = this.createTextureFrame(key, textureFrame.x, textureFrame.y, 
                              textureFrame.w, textureFrame.h, textureFrame.offsetX, 
                              textureFrame.offsetY, textureFrame.sourceW, textureFrame.sourceH);
          let textureData = this.createTexture(context, frame);
          this.sheet.addData(key, textureData);
      }
      core.listen('render', this.sheetTextures, this);
      this.sheet.render();
  }

  private sheetTextures () {
      core.unlisten('render', this.sheetTextures, this);
      this.loadCallBack && this.loadCallBack();
  }

  public createTextureFrame(name:string, bitmapX:number, bitmapY:number, bitmapWidth:number, bitmapHeight:number, offsetX:number = 0, offsetY:number = 0, textureWidth?:number, textureHeight?:number): textureFrame {
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
      }
  }

  public createTexture (context: CanvasRenderingContext2D, frame: textureFrame) {
      const data = context.getImageData(frame.x, frame.y, frame.w, frame.h);
      this.canvasBuffer.width = frame.sourceW;
      this.canvasBuffer.height = frame.sourceH;
      this.contextBuffer.clearRect(0, 0, frame.sourceW, frame.sourceH);
      this.contextBuffer.putImageData(data, 0 + frame.offsetX, 0 + frame.offsetY);
                                      
      return this.canvasBuffer.toDataURL().replace(/^data:image\/(png|jpg);base64,/, '')
  }
}

interface textureFrame{
  x: number;
  y: number;
  w: number;
  h: number;
  offsetX: number;
  offsetY: number;
  sourceW: number;
  sourceH: number
}