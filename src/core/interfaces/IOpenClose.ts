/**
 * 可开关的接口
*/
export interface IOpenClose<OD = any, CD = any>
{
    /**
     * 打开时传递的data对象
     * 
     * @type {OD}
     * @memberof IOpenClose
     */
    data:OD;

    open(data?:OD, ...args:any[]):Promise<any>;
    close(data?:CD, ...args:any[]):Promise<any>;
}