import * as PIXI from 'pixi.js';
import { BasicLayout } from './utils/Layout';
import { UIComponent } from './types/UIComponent';
import { STATE_DEFAULT } from './Constant';
import {
    EVENT_ADDED,
    EVENT_REMOVED,
    EVENT_POINTER_CANCEL,
    EVENT_POINTER_DOWN,
    EVENT_POINTER_MOVE,
    EVENT_POINTER_OUT,
    EVENT_POINTER_OVER,
    EVENT_POINTER_TAP,
    EVENT_POINTER_UP,
    EVENT_POINTER_OUTSIDE
} from './Event';

import {
    convertSkinConfig,
    setComponentAttributes
} from './utils/SkinParser';

export class CompatibilityContainer extends PIXI.Container implements UIComponent
{
    constructor()
    {
        super();
        // this.addListeners();
    }


    // 布局相关属性
    protected _left: string;
    protected _right: string;
    protected _top: string;
    protected _bottom: string;
    protected _horizontalCenter: string;
    protected _verticalCenter: string;

    // 宽度比例数值
    protected _percentWidth: number;
    // 高度比例数值
    protected _percentHeight: number;
    // 指定的宽度
    protected _explicitWidth: number;
    // 指定的高度
    protected _explicitHeight: number;

    // 是否应用父级的布局
    protected _includeInLayout: boolean = true;
    // 状态
    protected _states: string[];
    // 当前状态
    protected _currentState: string;

    // 皮肤传过来的配置
    protected _config: any;
    // 存放每个状态的配置信息
    protected _stateConfigDict: any;

    // ID
    public id: string;

    // 携带数据
    public userData: any;

    // 组件唯一的KEY
    public hostComponentKey: string;

    public set skewX(value: number)
    {
        this['skew'].x = +value;
    }
    public get skewX(): number
    {
        return this['skew'].x;
    }


    public set skewY(value: number)
    {
        this['skew'].y = +value;
    }
    public get skewY(): number
    {
        return this['skew'].y;
    }


    public set scaleX(value: number)
    {
        this['scale'].x = +value;
    }
    public get scaleX(): number
    {
        return this['scale'].x;
    }


    public set scaleY(value: number)
    {
        this['scale'].y = +value;
    }
    public get scaleY(): number
    {
        return this['scale'].y;
    }


    public set anchorOffsetX(value: number)
    {
        this['pivot'].x = +value;
    }
    public get anchorOffsetX(): number
    {
        return this['pivot'].x;
    }


    public set anchorOffsetY(value: number)
    {
        this['pivot'].y = +value;
    }
    public get anchorOffsetY(): number
    {
        return this['pivot'].y;
    }


    public set includeInLayout(value: boolean)
    {
        this._includeInLayout = !!value;
    }
    public get includeInLayout(): boolean
    {
        return this._includeInLayout;
    }


    public set left(value: string)
    {
        this._left = value.toString();
    }
    public get left(): string
    {
        return this._left;
    }


    public set right(value: string)
    {
        this._right = value.toString();
    }
    public get right(): string
    {
        return this._right;
    }


    public set top(value: string)
    {
        this._top = value.toString();
    }
    public get top(): string
    {
        return this._top;
    }


    public set bottom(value: string)
    {
        this._bottom = value.toString();
    }
    public get bottom(): string
    {
        return this._bottom;
    }


    public set horizontalCenter(value: string)
    {
        this._horizontalCenter = value.toString();
    }
    public get horizontalCenter(): string
    {
        return this._horizontalCenter;
    }


    public set verticalCenter(value: string)
    {
        this._verticalCenter = value.toString();
    }

    public get verticalCenter(): string
    {
        return this._verticalCenter;
    }

    public set percentWidth(value: number)
    {
        this._percentWidth = +value;
    }

    public get percentWidth(): number
    {
        return this._percentWidth;
    }

    public set percentHeight(value: number)
    {
        this._percentHeight = +value;
    }

    public get percentHeight(): number
    {
        return this._percentHeight;
    }

    public set explicitWidth(value: number)
    {
        this._explicitWidth = +value;
        this.changeBasicLayout(this._explicitWidth, this._explicitHeight);
    }
    public get explicitWidth(): number
    {
        return this._explicitWidth;
    }

    public set explicitHeight(value: number)
    {
        this._explicitHeight = +value;
        this.changeBasicLayout(this._explicitWidth, this._explicitHeight);
    }
    public changeBasicLayout(_width, _height)
    {
        // 宽可能没赋值
        if (isNaN(_width) || isNaN(_height)) {
            return
        }
        BasicLayout(this, _width, _height);
    }

    public get explicitHeight(): number
    {
        return this._explicitHeight;
    }

    public set states(value: string[])
    {
        this._states = value;
    }

    public get states(): string[]
    {
        return this._states;
    }


    public set currentState(value: string)
    {
        if (this._stateConfigDict == null)
        {
            return;
        }
        let config: any = this._stateConfigDict[value];
        if (config == null)
        {
            return;
        }
        setComponentAttributes(this, config);
        this._currentState = value;
    }
    public get currentState(): string
    {
        return this._currentState;
    }


    public set childrenState(value: string)
    {
        let children: PIXI.DisplayObject[] = this['children'];
        for (let i: number = 0; i < children.length; i++)
        {
            (children[i] as CompatibilityContainer).currentState = value;
        }
    }



    public set config(value: any)
    {
        this._config = value;
        this._stateConfigDict = convertSkinConfig(value);
        if (this.currentState == null)
        {
            this.currentState = STATE_DEFAULT;
        }
    }

    public get config(){
        return this._config;
    }

    protected addListeners(): void
    {
        this['on'](EVENT_ADDED, this.onAdded, this);
        this['on'](EVENT_REMOVED, this.onRemoved, this);

        this['on'](EVENT_POINTER_CANCEL, this.onPointerCancel, this);
        this['on'](EVENT_POINTER_DOWN, this.onPointerDown, this);
        this['on'](EVENT_POINTER_MOVE, this.onPointerMove, this);
        this['on'](EVENT_POINTER_OUT, this.onPointerOut, this);
        this['on'](EVENT_POINTER_OVER, this.onPointerOver, this);
        this['on'](EVENT_POINTER_TAP, this.onPointerTap, this);
        this['on'](EVENT_POINTER_UP, this.onPointerUp, this);
        this['on'](EVENT_POINTER_OUTSIDE, this.onPointerOutside, this);
    }

    protected removeListeners(): void
    {
        this['off'](EVENT_ADDED, this.onAdded, this);
        this['off'](EVENT_REMOVED, this.onRemoved, this);

        this['off'](EVENT_POINTER_CANCEL, this.onPointerCancel, this);
        this['off'](EVENT_POINTER_DOWN, this.onPointerDown, this);
        this['off'](EVENT_POINTER_MOVE, this.onPointerMove, this);
        this['off'](EVENT_POINTER_OUT, this.onPointerOut, this);
        this['off'](EVENT_POINTER_OVER, this.onPointerOver, this);
        this['off'](EVENT_POINTER_TAP, this.onPointerTap, this);
        this['off'](EVENT_POINTER_UP, this.onPointerUp, this);
        this['off'](EVENT_POINTER_OUTSIDE, this.onPointerOutside, this);
    }

    protected onAdded(parent: PIXI.Container): void
    {
        
    }
    protected onRemoved(parent: PIXI.Container): void
    {

    }

    protected onPointerCancel(evt: PIXI.interaction.InteractionEvent): void
    {

    }
    protected onPointerDown(evt: PIXI.interaction.InteractionEvent): void
    {

    }
    protected onPointerMove(evt: PIXI.interaction.InteractionEvent): void
    {
        
    }
    protected onPointerOut(evt: PIXI.interaction.InteractionEvent): void
    {
    }
    protected onPointerOver(evt: PIXI.interaction.InteractionEvent): void
    {

    }
    protected onPointerTap(evt: PIXI.interaction.InteractionEvent): void
    {

    }
    protected onPointerUp(evt: PIXI.interaction.InteractionEvent): void
    {
        
    }
    protected onPointerOutside(evt: PIXI.interaction.InteractionEvent): void
    {

    }


    // 根据名字获取子对象引用
    protected _referenceDict: {[key: string]: string};
    public getReference(id: string): any
    {
        if (id == null)
        {
            return null;
        }

        function bind(container: PIXI.Container, value: string): void
        {
            let children: CompatibilityContainer[] = container.children as CompatibilityContainer[];
            for (let i: number = 0, lenI: number = children.length; i < lenI; i++)
            {
                let child: CompatibilityContainer = children[i];
                if (child.id != null && child.id !== '')
                {
                    this._referenceDict[child.id] = value + i.toString() + ',';
                }
                if (child instanceof PIXI.Container)
                {
                    bind.call(this, child, value + i.toString() + ',');
                }
            }
        }

        if (this._referenceDict == null)
        {
            this._referenceDict = {};
            bind.call(this, this, '');
        }

        if (this._referenceDict[id] == null)
        {
            return null;
        }
        let value: string = this._referenceDict[id];
        let list: string[] = value.split(',');
        if (list[list.length - 1] === '')
        {
            list.pop();
        }
        let container: CompatibilityContainer = this;
        for (let i: number = 0; i < list.length; i++)
        {
            let child: CompatibilityContainer = container['children'][parseInt(list[i], 10)] as CompatibilityContainer;
            if (child == null)
            {
                break;
            }
            container = child;
            if (i === list.length - 1)
            {
                if (child.id === id)
                {
                    return child;
                }
            }
        }

        this._referenceDict = {};

        return this.getReference(name);
    }


    // override super
    public destroy(options?: boolean): void
    {
        this['removeAllListeners'] && this['removeAllListeners']();
        this.removeListeners();
        this._destroyed = true;
        super.destroy(options);
    }

    protected _destroyed: boolean;
    public get destroyed(): boolean
    {
        return this._destroyed;
    }
}
