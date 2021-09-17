import { IMessage } from "../message/IMessage";
import { ICommandConstructor } from "../command/ICommandConstructor";
import { IObservable } from "./IObservable";
export declare class Observable implements IObservable {
    private _listenerDict;
    get observable(): IObservable;
    parent: IObservable;
    constructor(parent?: IObservable);
    private handleMessages;
    private doDispatch;
    dispatch(msg: IMessage): void;
    dispatch(type: string, ...params: any[]): void;
    listen(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    unlisten(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    private _commandDict;
    private handleCommands;
    mapCommand(type: string, cmd: ICommandConstructor): void;
    unmapCommand(type: string, cmd: ICommandConstructor): void;
    private _disposed;
    get disposed(): boolean;
    dispose(): void;
}
//# sourceMappingURL=Observable.d.ts.map