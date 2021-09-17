import 'reflect-metadata';
import { ICommandConstructor } from "./command/ICommandConstructor";
import { IMessage } from "./message/IMessage";
import { IObservable } from "./observable/IObservable";
export interface IInjectableParams {
    type: IConstructor | string;
}
export declare class Core implements IObservable {
    private static _instance;
    get disposed(): boolean;
    constructor();
    private _observable;
    get observable(): IObservable;
    get parent(): IObservable;
    dispatch(msg: IMessage): void;
    dispatch(type: string, ...params: any[]): void;
    listen(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    unlisten(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    mapCommand(type: string, cmd: ICommandConstructor): void;
    unmapCommand(type: string, cmd: ICommandConstructor): void;
    private _injectDict;
    private _injectStrDict;
    mapInject(target: IConstructor, type?: any): void;
    mapInjectValue(value: any, type?: any): void;
    unmapInject(type: any): void;
    getInject(type: any): any;
    dispose(): void;
}
export declare const core: Core;
//# sourceMappingURL=Core.d.ts.map