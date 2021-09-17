import * as PIXI from 'pixi.js';
import { CompatibilityContainer } from './../CompatibilityContainer';
export declare class Image extends CompatibilityContainer {
    constructor();
    protected _range: PIXI.Rectangle;
    protected _scale9Grid: string;
    protected _texture: PIXI.Texture;
    protected _scale9Textures: PIXI.Texture[];
    protected _source: string | PIXI.Texture;
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    set scale9Grid(value: string);
    get scale9Grid(): string;
    set fillMode(value: string);
    get fillMode(): string;
    get texture(): PIXI.Texture;
    set source(value: string | PIXI.Texture);
    get source(): string | PIXI.Texture;
    getSprite(): PIXI.Sprite;
    private _sprite;
    private updateView;
    private clearSprites;
    protected generateTextureByRange(texture: PIXI.Texture, range: PIXI.Rectangle): PIXI.Texture;
    private generateSprites;
    private updateLocs;
    destroy(options?: boolean): void;
}
//# sourceMappingURL=Image.d.ts.map