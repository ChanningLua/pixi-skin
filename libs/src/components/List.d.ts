import { CompatibilityContainer } from './../CompatibilityContainer';
export declare class List extends CompatibilityContainer {
    private scroll;
    constructor();
    itemSkinName: string;
    protected _contentWidth: number;
    protected _contentHeight: number;
    protected _scrollH: number;
    protected _scrollV: number;
    protected _scrollEnabled: boolean;
    protected _layout: string;
    set contentWidth(value: number);
    get contentWidth(): number;
    set contentHeight(value: number);
    get contentHeight(): number;
    set scrollH(value: number);
    get scrollH(): number;
    set scrollV(value: number);
    get scrollV(): number;
    set scrollEnabled(value: boolean);
    get scrollEnabled(): boolean;
    get layout(): string;
    set layout(value: string);
    get itemRendererSkinName(): string;
    set itemRendererSkinName(value: string);
    private getItemRenderer;
}
//# sourceMappingURL=List.d.ts.map