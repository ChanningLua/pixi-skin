import {IDisposable} from "../interfaces/IDisposable";
import {IMessage} from "../message/IMessage";
import {CommonMessage} from "../message/CommonMessage";
import {CoreMessage} from "../message/CoreMessage";
import {ICommandConstructor} from "../command/ICommandConstructor";
import {IObservable} from "./IObservable";

/**
 * 可观察接口的默认实现对象，会将收到的消息通知给注册的回调
*/
export class Observable implements IObservable
{
    private _listenerDict:{[type:string]:IMessageData[]} = {};
    
    /**
     * 获取到IObservable实体，若本身就是IObservable实体则返回本身
     * 
     * @type {IObservable}
     * @memberof Observable
     */
    public get observable():IObservable
    {
        return this;
    }

    /**
     * 获取到父级IObservable
     * 
     * @type {IObservable}
     * @memberof Observable
     */
    public parent:IObservable;

    public constructor(parent?:IObservable)
    {
        this.parent = parent && parent.observable;
    }

    private handleMessages(msg:IMessage):void
    {
        var listeners1:IMessageData[] = this._listenerDict[msg.__type];
        var listeners2:IMessageData[] = this._listenerDict[msg.constructor.toString()];
        var listeners:IMessageData[] = (listeners1 && listeners2 ? listeners1.concat(listeners2) : listeners1 || listeners2);
        if(listeners)
        {
            listeners = listeners.concat();
            for(var temp of listeners)
            {
                if(msg instanceof CommonMessage)
                    temp.handler.call(temp.thisArg, ...msg.params);
                else
                    temp.handler.call(temp.thisArg, msg);
                if(temp.once)
                {
                    this.unlisten(msg.__type, temp.handler, temp.thisArg, temp.once);
                    this.unlisten(msg.constructor.toString(), temp.handler, temp.thisArg, temp.once);
                }
            }
        }
    }

    private doDispatch(msg:IMessage):void
    {
        msg.__observables.push(this);
        this.handleCommands(msg);
        this.handleMessages(msg);
    }

    /**
     * 派发内核消息
     * 
     * @param {IMessage} msg 内核消息实例
     * @memberof Observable
     */
    public dispatch(msg:IMessage):void;
    /**
     * 派发内核消息，消息会转变为CommonMessage类型对象
     * 
     * @param {string} type 消息类型
     * @param {...any[]} params 消息参数列表
     * @memberof Observable
     */
    public dispatch(type:string, ...params:any[]):void;
    /** dispatch方法实现 */
    public dispatch(typeOrMsg:string|IMessage, ...params:any[]):void
    {
        if(this._disposed) return;
        var msg:IMessage = typeOrMsg as IMessage;
        if(typeof typeOrMsg == "string")
        {
            msg = new CommonMessage(typeOrMsg);
            (msg as CommonMessage).params = params;
        }
        this.doDispatch(msg);
        this.doDispatch(new CommonMessage(CoreMessage.MESSAGE_DISPATCHED, msg));
        this.parent && this.parent.dispatch(msg);
    }

    /**
     * 监听内核消息
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @memberof Observable
     */
    public listen(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        if(this._disposed) return;
        type = (typeof type == "string" ? type : type.toString());
        var listeners:IMessageData[] = this._listenerDict[type];
        if(!listeners) this._listenerDict[type] = listeners = [];
        for(var i:number = 0, len:number = listeners.length; i < len; i++)
        {
            var temp:IMessageData = listeners[i];
            if(temp.handler == handler && temp.thisArg == thisArg) return;
        }
        listeners.push({handler: handler, thisArg: thisArg, once: once});
    }

    /**
     * 移除内核消息监听
     * 
     * @param {string} type 消息类型
     * @param {Function} handler 消息处理函数
     * @param {*} [thisArg] 消息this指向
     * @param {boolean} [once=false] 是否一次性监听
     * @memberof Observable
     */
    public unlisten(type:IConstructor|string, handler:Function, thisArg?:any, once:boolean=false):void
    {
        if(this._disposed) return;
        type = (typeof type == "string" ? type : type.toString());
        var listeners:IMessageData[] = this._listenerDict[type];
        if(listeners)
        {
            for(var i:number = 0, len:number = listeners.length; i < len; i++)
            {
                var temp:IMessageData = listeners[i];
                if(temp.handler == handler && temp.thisArg == thisArg && temp.once == once)
                {
                    listeners.splice(i, 1);
                    break;
                }
            }
        }
    }

    private _commandDict:{[type:string]:(ICommandConstructor)[]} = {};
    
    private handleCommands(msg:IMessage):void
    {
        var commands:(ICommandConstructor)[] = this._commandDict[msg.__type];
        if(commands)
        {
            commands = commands.concat();
            for(var cls of commands)
            {
                new cls(msg).exec();
            }
        }
    }

    /**
     * 注册命令到特定消息类型上，当这个类型的消息派发到框架内核时会触发Command运行
     * 
     * @param {string} type 要注册的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器，可以是方法形式，也可以使类形式
     * @memberof Observable
     */
    public mapCommand(type:string, cmd:ICommandConstructor):void
    {
        if(this._disposed) return;
        var commands:(ICommandConstructor)[] = this._commandDict[type];
        if(!commands) this._commandDict[type] = commands = [];
        if(commands.indexOf(cmd) < 0) commands.push(cmd);
    }

    /**
     * 注销命令
     * 
     * @param {string} type 要注销的消息类型
     * @param {(ICommandConstructor)} cmd 命令处理器
     * @returns {void} 
     * @memberof Observable
     */
    public unmapCommand(type:string, cmd:ICommandConstructor):void
    {
        if(this._disposed) return;
        var commands:(ICommandConstructor)[] = this._commandDict[type];
        if(!commands) return;
        var index:number = commands.indexOf(cmd);
        if(index < 0) return;
        commands.splice(index, 1);
    }

    private _disposed:boolean = false;
    /** 是否已经被销毁 */
    public get disposed():boolean
    {
        return this._disposed;
    }
    /** 销毁 */
    public dispose():void
    {
        if(this._disposed) return;
        this.parent = null;
        this._listenerDict = null;
        this._commandDict = null;
        this._disposed = true;
    }
}

/**
 * 上下文模块内部使用的记录转发数据的接口
 * 
 * @interface IMessageData
 */
interface IMessageData
{
    handler:Function;
    thisArg:any;
    once:boolean;
}