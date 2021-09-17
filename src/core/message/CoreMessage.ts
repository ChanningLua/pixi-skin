/**
 * 核心事件类型
*/
export class CoreMessage
{
    /**
     * 任何消息派发到框架后都会派发这个消息
     * 
     * @static
     * @type {string}
     * @memberof CoreMessage
     */
    public static MESSAGE_DISPATCHED:string = "messageDispatched";
}