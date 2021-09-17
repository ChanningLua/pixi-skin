import * as PIXI from 'pixi.js';
import { CompatibilityContainer } from './../CompatibilityContainer'

export class Component extends CompatibilityContainer
{
    constructor()
    {
        super();
    }

    // 皮肤名字
    protected _skinName: string;
    // 是否启用 TODO
    protected _enable: boolean;


    public set enable(value: boolean)
    {
        this._enable = !!value;
    }
    public get enable(): boolean
    {
        return this._enable;
    }

    public set skinName(value: string)
    {
        if (value == null || value === this._skinName)
        {
            return;
        }
        this._skinName = value;
    }
    public get skinName(): string
    {
        return this._skinName;
    }

    protected clearChildren(): void
    {
        let children: PIXI.DisplayObject[] = this['children'];
        for (let i: number = children.length - 1; i >= 0; i--)
        {   
            // @ts-ignore
            children[i].destroy({
                children: true,
                texture: false,
                baseTexture: false,
            });
        }
    }
}
