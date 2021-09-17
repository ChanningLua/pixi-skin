import * as PIXI from 'pixi.js';
import { CompatibilityContainer } from './../CompatibilityContainer';
import { log, LOG_LEVEL_WARNING } from './../utils/Log';
export class Label extends CompatibilityContainer
{   

    // 文本的实例
    private _text: PIXI.Text;
    // 文本的style
    private _style: PIXI.TextStyle;
    // 文本的值
    private _value: string;
    // 文本大小
    private _size: number;
    // 文本是否是斜体
    private _italic: boolean;
    // 文本是否加粗
    private _bold: boolean;
    // 文本左右对齐方式
    private _textAlign: string; 
    // 文本上下对齐方式   PIXI不支持
    // private _verticalAlign: string;
    // 文本颜色
    private _textColor: string;
    // 文本字体
    private _fontFamily: string;


    public set width(value: number)
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
    public get width(): number
    {
        return this['scale'].x * this['getLocalBounds']().width;
    }


    public set height(value: number)
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
    public get height(): number
    {
        return this['scale'].y * this['getLocalBounds']().height;
    }


    public get text(): string
    {   
        return this._value;
    }
    public set text(value: string) {
        this._value = value || '';
        if (!this._text) {
            this._text = new PIXI.Text();
            this['addChild'](this._text);
        }
        this.style = {
            size: this.size,
            italic: this.italic,
            bold: this.bold,
            textAlign: this.textAlign,
            textColor: this.textColor,
            fontFamily: this.fontFamily
        }
        this._text.text = this._value;
        this.updateView();
    }

    public get style() {
        // @ts-ignore
        return this._style;
    }
    public set style( _style: {
        size: number,
        italic: boolean,
        bold: boolean,
        textAlign: string,
        // verticalAlign: string,
        textColor: string,
        fontFamily: string
    }) {
        this._style = this.setStyle(_style);
        this._text.style = this._style;
        // TODO pixi.js 的文本宽高是黑盒的，设置API提供的宽高实际上相当于egret中的scale
        // this._text.width = this._config.width;
        // this._text.height = this._config.height;
    }
    private setStyle (_style): PIXI.TextStyle {
        return new PIXI.TextStyle ({
            align: this.textAlign,
            fill: this.textColor,
            fontWeight: '' + (this.bold ? 500 : 400),
            fontStyle: this.italic ? 'italic' : 'normal',
            fontSize: this.size,
            fontFamily: this.fontFamily
        })
    }

    
    public get size(): number {
        return this._size || 26;
    }
    public set size(_size: number) {
        this._size = _size;
    }


    public get italic(): boolean {
        return this._italic || false;
    }
    public set italic(_italic: boolean) {
        this._italic = _italic;
    }


    public get bold(): boolean {
        return this._bold || false;
    }
    public set bold(_bold: boolean) {
        this._bold = _bold;
    }


    public get textAlign(): string {
        return this._textAlign || 'center';
    }
    public set textAlign(_textAlign: string) {
        this._textAlign = _textAlign;
    }


    // public get verticalAlign(): string {
    //     return this._verticalAlign;
    // }
    // public set verticalAlign(_verticalAlign: string) {
    //     this._verticalAlign = _verticalAlign
    // }


    public get textColor(): string {
        return this._textColor || '0xffffff';
    }
    public set textColor(_textColor: string) {
        this._textColor = _textColor;
    }

    
    public get fontFamily(): string {
        return this._fontFamily || 'Arial';
    }
    public set fontFamily(_fontFamily: string) {
        this._fontFamily = _fontFamily;
    }

    private updateView(): void
    {
    //   this['scale'].x = 1;
    //   this['scale'].y = 1;
      this.width = this._text.width || this.explicitWidth;
      this.height = this._text.height || this.explicitHeight;
      this._config.width = this.width;
      this._config.height = this.height;
    }

    // override super
    public destroy(options?: boolean): void
    {
        super.destroy(options);
    }
}
