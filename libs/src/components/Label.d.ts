import { CompatibilityContainer } from './../CompatibilityContainer';
export declare class Label extends CompatibilityContainer {
    private _text;
    private _style;
    private _value;
    private _size;
    private _italic;
    private _bold;
    private _textAlign;
    private _textColor;
    private _fontFamily;
    set width(value: number);
    get width(): number;
    set height(value: number);
    get height(): number;
    get text(): string;
    set text(value: string);
    get style(): {
        size: number;
        italic: boolean;
        bold: boolean;
        textAlign: string;
        textColor: string;
        fontFamily: string;
    };
    set style(_style: {
        size: number;
        italic: boolean;
        bold: boolean;
        textAlign: string;
        textColor: string;
        fontFamily: string;
    });
    private setStyle;
    get size(): number;
    set size(_size: number);
    get italic(): boolean;
    set italic(_italic: boolean);
    get bold(): boolean;
    set bold(_bold: boolean);
    get textAlign(): string;
    set textAlign(_textAlign: string);
    get textColor(): string;
    set textColor(_textColor: string);
    get fontFamily(): string;
    set fontFamily(_fontFamily: string);
    private updateView;
    destroy(options?: boolean): void;
}
//# sourceMappingURL=Label.d.ts.map