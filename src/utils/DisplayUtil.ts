/**
 * 显示工具
*/

/**
 * 替换显示
 * 
 * @export
 * @param {IBridge} bridge 要使用的桥
 * @param {*} current 被替换的显示
 * @param {*} target 替换成为的显示
 */
export function replaceDisplay(bridge, current:any, target:any):void
{
    // 如果俩皮肤一样，则啥也不干
    if(current === target) return;
    // 两个皮肤必须都是隶属桥的皮肤
    if(bridge.isMySkin(target) && bridge.isMySkin(current))
    {
        var parent:any = bridge.getParent(current);
        if(parent)
        {
            var index:number = bridge.getChildIndex(parent, current);
            bridge.addChildAt(parent, target, index);
            bridge.removeChild(parent, current);
        }
    }
}