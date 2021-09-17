export declare class SpriteSheet {
    private sheet;
    private path;
    private textureFrames;
    private canvasBuffer;
    private contextBuffer;
    private loadCallBack;
    parse(name: any, callBack: any, width?: number, height?: number): void;
    private sheetTexture;
    private sheetTextures;
    createTextureFrame(name: string, bitmapX: number, bitmapY: number, bitmapWidth: number, bitmapHeight: number, offsetX?: number, offsetY?: number, textureWidth?: number, textureHeight?: number): textureFrame;
    createTexture(context: CanvasRenderingContext2D, frame: textureFrame): string;
}
interface textureFrame {
    x: number;
    y: number;
    w: number;
    h: number;
    offsetX: number;
    offsetY: number;
    sourceW: number;
    sourceH: number;
}
export {};
//# sourceMappingURL=SpriteSheet.d.ts.map