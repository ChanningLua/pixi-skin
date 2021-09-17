/**
 * 可回收接口
*/
export interface IDisposable
{
    readonly disposed:boolean;
    dispose():void;
}