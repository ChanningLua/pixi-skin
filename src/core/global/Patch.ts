import 'reflect-metadata';

/** 修复Array.findIndex会被遍历到的问题 */
if(Array.prototype.hasOwnProperty("findIndex"))
{
    var desc:PropertyDescriptor = Object.getOwnPropertyDescriptor(Array.prototype, "findIndex");
    if(desc.enumerable)
    {
        desc.enumerable = false;
        Object.defineProperty(Array.prototype, "findIndex", desc);
    }
}

/** 为某些不支持ErrorEvent的浏览器添加ErrorEvent支持 */
try
{
    new ErrorEvent("");
}
catch(err)
{
    window['ErrorEvent'] = <any>function ErrorEvent(type:string, errorEventInitDict?:ErrorEventInit):ErrorEvent
    {
        if (!errorEventInitDict)
            errorEventInitDict = {};
        if(Event instanceof Function)
        {
            Event.call(this, type, errorEventInitDict);
            this.initErrorEvent(type, errorEventInitDict.bubbles, errorEventInitDict.cancelable, errorEventInitDict.message, errorEventInitDict.filename, errorEventInitDict.lineno);
            this.error = errorEventInitDict.error;
            return this;
        }
        else
        {
            var evt:ErrorEvent = document.createEvent("ErrorEvent");
            evt['initErrorEvent'](type, errorEventInitDict.bubbles, errorEventInitDict.cancelable, errorEventInitDict.message, errorEventInitDict.filename, errorEventInitDict.lineno);
            return evt;
        }
    };
    window["ErrorEvent"].prototype['initErrorEvent'] = function initErrorEvent(typeArg:string, canBubbleArg:boolean, cancelableArg:boolean, messageArg:string, filenameArg:string, linenoArg:number):void
    {
        this.type = typeArg;
        this.bubbles = canBubbleArg;
        this.cancelable = cancelableArg;
        this.message = messageArg;
        this.filename = filenameArg;
        this.lineno = linenoArg;
    };
}

/** 篡改Reflect.decorate方法，用于为装饰器方法打个flag，标记装饰器是否为参数化装饰 */
export const decorateThis:any = {};
if(Reflect && Reflect.decorate)
{
    var oriDecorate:Function = Reflect.decorate;
    Reflect.decorate = function(...args:any[]):any
    {
        var oriRef:Function = args[0][0];
        args[0][0] = function(...args:any[]):any
        {
            return oriRef.apply(decorateThis, args);
        };
        // 调用原始方法
        var result:any = oriDecorate.apply(this, args);
        // 还原篡改项
        args[0][0] = oriRef;
        // 返回结果
        return result;
    };
}