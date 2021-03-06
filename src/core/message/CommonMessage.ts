import {Message} from "./Message";

/**
 * 框架内核通用消息
*/
export class CommonMessage extends Message
{
    /**
     * 消息参数列表
     * 
     * @type {any[]}
     * @memberof Message
     */
    public params:any[];

    /**
     * Creates an instance of Message.
     * @param {string} type 消息类型
     * @param {...any[]} params 可能的消息参数列表
     * @memberof Message
     */
    public constructor(type:string, ...params:any[])
    {
        super(type);
        this.params = params;
    }
}