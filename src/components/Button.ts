import * as PIXI from 'pixi.js';
import {Component} from './../components/Component';
import {Image} from './Image';
export class Button extends Component
{   
    constructor()
    {
        super();
        this.addListeners();
        // 没有声明文件所以会报错，改成反射的方式取值
        this['interactive'] = true;
    }

    private _label: string = '';
    public get label(): string
    {
        return this._label;
    }
    public set label(value: string)
    {
        this._label = value;
        let labelDisplay: PIXI.Text = this.getReference('labelDisplay');
        if (labelDisplay)
        {
            labelDisplay.text = value;
        }
    }


    private _icon: string | PIXI.Texture = null;
    public get icon(): string | PIXI.Texture
    {
        return this._icon;
    }

    public set icon(value: string | PIXI.Texture)
    {
        this._icon = value;
        let iconDisplay: Image = this.getReference('iconDisplay');
        if (iconDisplay)
        {
            iconDisplay.source = value;
        }
    }


    protected _downPoint: PIXI.Point;
    protected onPointerDown(evt: PIXI.InteractionEvent): void
    {
        this._downPoint = evt.data.global.clone();
        this.childrenState = 'down';
    }
    protected onPointerMove(evt: PIXI.InteractionEvent): void
    {
        if (this._downPoint == null)
        {
            return;
        }
        let pt: PIXI.Point = evt.data.global;
        if (Math.abs(pt.x - this._downPoint.x) > 10 || Math.abs(pt.y - this._downPoint.y) > 10)
        {
            this._downPoint = null;
            this.childrenState = 'up';
        }
    }
    protected onPointerOut(evt: PIXI.InteractionEvent): void
    {
        this.onCancel(evt);
    }
    protected onPointerUp(evt: PIXI.InteractionEvent): void
    {
        this.onCancel(evt);
    }
    protected onPointerOutside(evt: PIXI.InteractionEvent): void
    {
        this.onCancel(evt);
    }
    protected onPointerTap(evt: PIXI.InteractionEvent): void
    {
        this.childrenState = 'up';
    }

    private onCancel(evt: PIXI.InteractionEvent): void
    {
        if (this._downPoint == null)
        {
            evt.stopPropagation();
        }
        this._downPoint = null;
    }
}
