import * as PIXI from 'pixi.js';

/**
 * UIComponent 类是所有可视组件（可定制皮肤和不可定制皮肤）的基类。
 * 
 * @export
 * @interface UIComponent
 * @extends {PIXI.DisplayObject}
 */
export interface UIComponent extends PIXI.DisplayObject
{


    /**
     * 距父级容器离左边距离。
     * 
     * @type {*}
     * @memberof UIComponent
     */
    left: any;

    /**
     * 距父级容器右边距离。
     * 
     * @type {*}
     * @memberof UIComponent
     */
    right: any;

    /**
     * 距父级容器顶部距离。
     * 
     * @type {*}
     * @memberof UIComponent
     */
    top: any;

    /**
     * 距父级容器底部距离。
     * 
     * @type {*}
     * @memberof UIComponent
     */
    bottom: any;

    /**
     * 在父级容器中距水平中心位置的距离。
     * 
     * @type {*}
     * @memberof UIComponent
     */
    horizontalCenter: any;

    /**
     * 在父级容器中距竖直中心位置的距离。
     * 
     * @type {*}
     * @memberof UIComponent
     */
    verticalCenter: any;
}
