import { IObservable } from "../observable/IObservable";
export interface IMessage {
    readonly __type: string;
    readonly __observable: IObservable;
    readonly __oriObservable: IObservable;
    readonly __observables: IObservable[];
    redispatch(): void;
}
//# sourceMappingURL=IMessage.d.ts.map