import * as PIXI from 'pixi.js';
import { CompatibilityContainer } from './../CompatibilityContainer';
import { getTexture, getTextureUrl } from './../utils/Manager';
import { log, LOG_LEVEL_WARNING } from './../utils/Log';
export class Image extends CompatibilityContainer
{

    constructor()
    {
        super();
    }
    // 九宫格配置
    protected _range: PIXI.Rectangle = new PIXI.Rectangle();
    // 九宫格原始配置
    protected _scale9Grid: string;
    // 原始贴图
    protected _texture: PIXI.Texture;
    // 九宫格贴图
    protected _scale9Textures: PIXI.Texture[];
    // 贴图资源
    protected _source: string | PIXI.Texture;

    public set width(value: number)
    {
        if (this._scale9Grid != null)
        {
            this.updateLocs();
        }
        else
        {
            let width = this['getLocalBounds']().width;

            if (width !== 0)
            {
                this['scale'].x = value / width;
            }
            else
            {
                this['scale'].x = 1;
            }

            this['_width'] = value;
        }
    }

    public get width(): number
    {
        return this['scale'].x * this['getLocalBounds']().width;
    }


    public set height(value: number)
    {
        if (this._scale9Grid != null)
        {
            this.updateLocs();
        }
        else
        {
            let height = this['getLocalBounds']().height;

            if (height !== 0)
            {
                this['scale'].y = value / height;
            }
            else
            {
                this['scale'].y = 1;
            }

            this['_height'] = value;
        }
    }

    public get height(): number
    {
        return this['scale'].y * this['getLocalBounds']().height;
    }


    public set scale9Grid(value: string)
    {
        if (value != null && value === this._scale9Grid)
        {
            return;
        }
        this._scale9Grid = value;
        this.updateView();
    }
    public get scale9Grid(): string
    {
        return this._scale9Grid;
    }


    // TODO clip, repeat, scale
    public set fillMode(value: string)
    {

    }
    public get fillMode(): string
    {
        return null;
    }


    public get texture(): PIXI.Texture
    {
        return this._texture;
    }

    public set source(value: string | PIXI.Texture)
    {   
        if (value == null)
        {
            this._texture = PIXI.Texture.EMPTY;
            this._source = null;
            this.updateView();
        }
        else if (value instanceof PIXI.Texture)
        {   
            this._texture = value;
            this._source = value;
            this.updateView();
        }
        else if (typeof value === 'string')
        {
            let texture: PIXI.Texture = getTexture(value);
            this._source = value;
            if (texture != null && texture instanceof PIXI.Texture)
            {
                this._texture = texture;
                this._source = value;
                this.updateView();
            }
            else
            {   
                if (value.length === 0) {
                    this._texture = null;
                    this._source = value;
                    this.updateView();
                    return
                }
                let _realUrl = getTextureUrl(value);
                this._texture = PIXI.Texture.fromImage(_realUrl);
                this._texture.once('update', () =>
                {
                    this.updateView();
                }, this);
            }
        }
        else
        {
            log('没有找到贴图：' + value, LOG_LEVEL_WARNING);
        }
    }
    public get source(): string | PIXI.Texture
    {
        return this._source;
    }

    public getSprite(): PIXI.Sprite 
    {
        return this._sprite;
    }

    private _sprite: PIXI.Sprite;
    // fixme 此处因为scale9所以每次变更都需要晴空，需要优化掉
    private updateView(): void
    {   
        // this['cacheAsBitmap'] = false;
        if (this._scale9Grid == null)
        {
            this._range.x = 0;
            this._range.y = 0;
            this._range.width = 0;
            this._range.height = 0;
            this.clearSprites();

            if (!this._sprite) {
                this._sprite = new PIXI.Sprite();
                this['addChild'](this._sprite)
            }
            this._sprite.texture = this._texture || PIXI.Texture.EMPTY;

            let _scaleX = this._config && Math.abs(parseFloat(this._config?.scaleX)) || 1,
                _scaleY = this._config && Math.abs(parseFloat(this._config?.scaleY)) || 1;
                
            let _textureWidth = this._explicitWidth || this._config && ~~this._config.width || this._sprite.texture.frame.width,
                _textureHeight = this._explicitHeight || this._config && ~~this._config.height || this._sprite.texture.frame.height;

            this.width = ~~(_textureWidth *　_scaleX);
            this.height = ~~(_textureHeight *　_scaleY);

        }
        else
        {
            let configList: string[] = this._scale9Grid.split(',');
            if (configList.length < 4)
            {
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
        // this['cacheAsBitmap'] = true;
    }


    private clearSprites(): void
    {
        // let children: PIXI.Sprite[] = this['children'] as PIXI.Sprite[];
        // for (let i: number = children.length - 1; i >= 0; i--)
        // {
        //     children[i].destroy();
        // }
        if (this._scale9Textures != null && this._scale9Textures.length > 0)
        {
            for (let i: number = this._scale9Textures.length - 1; i >= 0; i--)
            {
                this._scale9Textures[i].destroy();
            }
            this._scale9Textures.length = 0;
        }
    }


    protected generateTextureByRange(texture: PIXI.Texture, range: PIXI.Rectangle): PIXI.Texture
    {
        let newTexture: PIXI.Texture = texture.clone();
        let frame: PIXI.Rectangle = newTexture.frame.clone();
        frame.x += range.x;
        frame.y += range.y;
        frame.width = range.width;
        frame.height = range.height;
        newTexture.frame = frame;

        return newTexture;
    }


    private generateSprites(): void
    {
        if (this._texture == null)
        {
            return;
        }
        let width: number = this._range.width;
        let height: number = this._range.height;
        let left: number = this._range.x;
        let right: number = left + width;
        let top: number = this._range.y;
        let bottom: number = top + height;
        let ranges: PIXI.Rectangle[] = [
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
        for (let i: number = 0, len: number = ranges.length; i < len; i++)
        {
            let texture: PIXI.Texture = this.generateTextureByRange(this._texture, ranges[i]);
            let sprite: PIXI.Sprite = new PIXI.Sprite(texture);
            this._scale9Textures.push(texture);
            this['addChild'](sprite);
        }
    }

    private updateLocs(): void
    {
        let children: PIXI.Sprite[] = this['children'] as PIXI.Sprite[];
        if (children.length !== 9)
        {
            return;
        }
        let boundX: number = children[0].width + children[2].width;
        let boundY: number = children[0].height + children[6].height;
        let thisWidth: number = this._explicitWidth || this.texture.frame.width;
        let thisHeight: number = this._explicitHeight || this.texture.frame.height;
        if (thisWidth >= boundX)
        {
            children[0].scale.x = children[2].scale.x = children[3].scale.x = children[5].scale.x = children[6].scale.x = children[8].scale.x = 1;
            children[1].width = children[4].width = children[7].width = thisWidth - boundX;
        }
        else
        {
            children[0].width = children[2].width = children[3].width = children[5].width = children[6].width = children[8].width = thisWidth * 0.5;
            children[1].width = children[4].width = children[7].width = 0;
        }
        if (thisHeight >= boundY)
        {
            children[0].scale.y = children[1].scale.y = children[2].scale.y = children[6].scale.y = children[7].scale.y = children[8].scale.y = 1;
            children[3].height = children[4].height = children[5].height = thisHeight - boundY;
        }
        else
        {
            children[0].height = children[1].height = children[2].height = children[6].height = children[7].height = children[8].height = thisHeight * 0.5;
            children[3].height = children[4].height = children[5].height = 0;
        }
        let w1: number = children[0].width;
        let w2: number = w1 + children[1].width;
        let h1: number = children[0].height;
        let h2: number = h1 + children[3].height;
        for (let i: number = 0; i < 3; i++)
        {
            children[i * 3].x = 0 - this.anchorOffsetX;
            children[i * 3 + 1].x = w1 - this.anchorOffsetX;
            children[i * 3 + 2].x = w2 - this.anchorOffsetX;
            children[i].y = 0 - this.anchorOffsetY;
            children[i + 3].y = h1 - this.anchorOffsetY;
            children[i + 6].y = h2 - this.anchorOffsetY;
        }
    }


    // override super
    public destroy(options?: boolean): void
    {
        this.clearSprites();
        super.destroy(options);
    }
}
