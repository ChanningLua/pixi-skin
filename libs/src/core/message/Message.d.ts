import { IMessage } from "./IMessage";
import { IObservable } from "../observable/IObservable";
export declare abstract class Message implements IMessage {
    private _type;
    get __type(): string;
    get __observable(): IObservable;
    get __oriObservable(): IObservable;
    __observables: IObservable[];
    constructor(type: string);
    redispatch(): void;
}
//# sourceMappingURL=Message.d.ts.map