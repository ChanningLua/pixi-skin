import * as PIXI from 'pixi.js';
import { Component } from './../components/Component';
export declare class Button extends Component {
    constructor();
    private _label;
    get label(): string;
    set label(value: string);
    private _icon;
    get icon(): string | PIXI.Texture;
    set icon(value: string | PIXI.Texture);
    protected _downPoint: PIXI.Point;
    protected onPointerDown(evt: PIXI.interaction.InteractionEvent): void;
    protected onPointerMove(evt: PIXI.interaction.InteractionEvent): void;
    protected onPointerOut(evt: PIXI.interaction.InteractionEvent): void;
    protected onPointerUp(evt: PIXI.interaction.InteractionEvent): void;
    protected onPointerOutside(evt: PIXI.interaction.InteractionEvent): void;
    protected onPointerTap(evt: PIXI.interaction.InteractionEvent): void;
    private onCancel;
}
//# sourceMappingURL=Button.d.ts.map