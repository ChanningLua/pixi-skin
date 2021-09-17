import { View } from '../View';
import {CompatibilityContainer} from './../CompatibilityContainer';
import {ScrollerBase} from './base/ScrollerBase';
// import {skinDict} from './../utils/Manager';

/**
 * 时间成本暂不实现组件可视化
 */
export class List extends CompatibilityContainer
{
    private scroll: ScrollerBase;

    /**
     * create a List
     * @param {object} options
     * @param {boolean} [options.dragScroll=true]             是否可以通过拖动来滚动容器
     * @param {string} [options.overflow]                     (none, scroll, hidden, auto) 滚动条是否显示
     * @param {number} [options.boxWidth=100]                 滚动区域宽度
     * @param {number} [options.boxHeight=100]                滚动区域高度
     * @param {number} [options.scrollbarSize=10]             滚动条的大小
     * @param {number} [options.scrollbarOffsetHorizontal=0]  水平滚动条的偏移量
     * @param {number} [options.scrollbarOffsetVertical=0]    垂直滚动条的偏移量
     * @param {boolean} [options.stopPropagation=true]        对任何影响scroll的事件调用stopPropagation
     * @param {number} [options.scrollbarBackground=0xdddddd] 滚动条背景色
     * @param {number} [options.scrollbarBackgroundAlpha=1]   滚动条背景透明度
     * @param {number} [options.scrollbarForeground=0x888888] 滚动条前景色
     * @param {number} [options.scrollbarForegroundAlpha=1]   滚动条前景透明度
     * @param {string} [options.underflow=top-left]           当内容下溢滚动框时该做什么
     *                                                        (左/右/中心和上/下/中心);
     *                                                        或center(例如:'top-left'， 'center'， 'none'， 'bottomright')
     * @param {boolean} [options.noTicker]                    不使用PIXI默认的PIXI.Ticker，需在循环中手动调用updateLoop(elapsed)
     * @param {PIXI.Ticker} [options.ticker=PIXI.Ticker.shared] 更换默认PI                                                       XI.Ticker
     * @param {boolean} [options.fade]                        当不使用的时候隐藏滚动条
     * @param {number} [options.fadeScrollbarTime=1000]       滚动条淡出时间
     * @param {number} [options.fadeScrollboxWait=3000]       滚动条淡出等待时间
     * @param {(string|function)} [options.fadeScrollboxEase=easeInOutSine] 淡出缓动函数
     * @param {boolean} [options.passiveWheel=false]          是否在滚动容器外捕获滚轮事件
     * @param {boolean} [options.clampWheel=true]             滚轮事件防止抖动
     * @param {PIXI.InteractionManager} [options.interaction] 用于计算指针相对于画布在屏幕上的位置
     */
    constructor()
    {
        super();
    }

    // 容器条目的皮肤
    public itemSkinName: string;

    // 内容宽度
    protected _contentWidth: number;
    // 内容高度
    protected _contentHeight: number;
    // 横向滚动长度
    protected _scrollH: number;
    // 纵向滚动长度
    protected _scrollV: number;
    // 是否允许滚动
    protected _scrollEnabled: boolean;

    protected _layout: string;


    public set contentWidth(value: number)
    {
        this._contentWidth = +value;
    }
    public get contentWidth(): number
    {
        return this._contentWidth;
    }


    public set contentHeight(value: number)
    {
        this._contentHeight = +value;
    }
    public get contentHeight(): number
    {
        return this._contentHeight;
    }


    public set scrollH(value: number)
    {
        this._scrollH = +value;
    }
    public get scrollH(): number
    {
        return this._scrollH;
    }


    public set scrollV(value: number)
    {
        this._scrollV = +value;
    }
    public get scrollV(): number
    {
        return this._scrollV;
    }


    public set scrollEnabled(value: boolean)
    {
        this._scrollEnabled = !!value;
    }
    public get scrollEnabled(): boolean
    {
        return this._scrollEnabled;
    }


    public get layout(): string {
        return this._layout;
    }
    public set layout(value: string) {
        this._layout = value;
        // TODO
    }

    
    public get itemRendererSkinName(): string {
        return this.itemSkinName;
    }
    public set itemRendererSkinName(value: string) {
        this.itemSkinName = value;
        // FIXME TEST
        // let i = 0;
        // while (i < 10) {
        //     let skin = this.getItemRenderer(value);
        //     this['addChild'](this.getItemRenderer(value));
        //     i++;
        // }
    }

    private getItemRenderer(value) {
        let component: View = new View();
        component.parseSkinConfig(value);
        let skin = component.getSkin();
        return skin || null;
    }
}
