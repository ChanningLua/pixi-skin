import * as PIXI from 'pixi.js';
import { CompatibilityContainer } from './../CompatibilityContainer';
export function BasicLayout(target: CompatibilityContainer, unscaledWidth: number, unscaledHeight: number): PIXI.Point
{
    // console.log('unscaledWidth',unscaledWidth,unscaledHeight)
    if (!target)
    {
        return;
    }

    let count = target['children'].length;

    let maxX = 0;
    let maxY = 0;
    for (let i: number = 0; i < count; i++)
    {
        let layoutElement = target['getChildAt'](i) as CompatibilityContainer | any;
        if (!layoutElement.includeInLayout)
        {
            continue;
        }

        // getBounds 有问题
        let _config = layoutElement._config;
        let bounds = {
            x: parseFloat(_config.x) || 0,
            y: parseFloat(_config.y) || 0,
            width: parseFloat(_config.width) || layoutElement.width || 0,
            height: parseFloat(_config.height) || layoutElement.height || 0,
        };

        let hCenter: number = formatRelative(layoutElement.horizontalCenter, unscaledWidth * 0.5);
        let vCenter: number = formatRelative(layoutElement.verticalCenter, unscaledHeight * 0.5);
        let left: number = formatRelative(layoutElement.left, unscaledWidth);
        let right: number = formatRelative(layoutElement.right, unscaledWidth);
        let top: number = formatRelative(layoutElement.top, unscaledHeight);
        let bottom: number = formatRelative(layoutElement.bottom, unscaledHeight);
        let percentWidth: number = layoutElement.percentWidth;
        let percentHeight: number = layoutElement.percentHeight;

        let childWidth: number = NaN;
        let childHeight: number = NaN;

        if (!isNaN(left) && !isNaN(right))
        {
            childWidth = unscaledWidth - right - left;
        }
        else if (!isNaN(percentWidth))
        {
            childWidth = Math.round(unscaledWidth * Math.min(percentWidth * 0.01, 1));
        }

        if (!isNaN(top) && !isNaN(bottom))
        {
            childHeight = unscaledHeight - bottom - top;
        }
        else if (!isNaN(percentHeight))
        {
            childHeight = Math.round(unscaledHeight * Math.min(percentHeight * 0.01, 1));
        }

        layoutElement.explicitWidth = childWidth;
        layoutElement.explicitHeight = childHeight;
        let elementWidth = bounds.width;
        let elementHeight = bounds.height;


        let childX: number = NaN;
        let childY: number = NaN;

        if (!isNaN(hCenter))
        {
            childX = Math.round((unscaledWidth - elementWidth) / 2 + hCenter);
        }
        else if (!isNaN(left))
        {
            childX = left;
        }
        else if (!isNaN(right))
        {
            childX = unscaledWidth - elementWidth - right;
        }
        else
        {
            childX = bounds.x;
        }

        if (!isNaN(vCenter))
        {
            childY = Math.round((unscaledHeight - elementHeight) / 2 + vCenter);
        }
        else if (!isNaN(top))
        {
            childY = top;
        }
        else if (!isNaN(bottom))
        {
            childY = unscaledHeight - elementHeight - bottom;
        }
        else
        {
            childY = bounds.y;
        }

        layoutElement.x = childX;
        layoutElement.y = childY;
        // console.log('------------------------------')
        // console.log('child',childX,childY)
        // maxX = Math.max(maxX, childX + elementWidth);
        // maxY = Math.max(maxY, childY + elementHeight);
        // console.log('child',maxX,maxY)
        // console.log('------------------------------')
    }
}



function formatRelative(value: number | string, total: number): number
{
    if (!value || typeof value === 'number')
    {
        return value as number;
    }
    let str: string = value as string;
    let index: number = str.indexOf('%');
    if (index === -1)
    {
        return +str;
    }
    let percent: number = +str.substring(0, index);

    return percent * 0.01 * total;
}
