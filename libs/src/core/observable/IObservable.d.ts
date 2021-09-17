import { IConstructor } from "../interfaces/IConstructor";
import { IMessage } from "../message/IMessage";
import { ICommandConstructor } from "../command/ICommandConstructor";
import { IDisposable } from "../interfaces/IDisposable";
export interface IObservable extends IDisposable {
    readonly observable: IObservable;
    parent: IObservable;
    dispatch(msg: IMessage): void;
    dispatch(type: string, ...params: any[]): void;
    listen(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    unlisten(type: IConstructor | string, handler: Function, thisArg?: any, once?: boolean): void;
    mapCommand(type: string, cmd: ICommandConstructor): void;
    unmapCommand(type: string, cmd: ICommandConstructor): void;
}
//# sourceMappingURL=IObservable.d.ts.map