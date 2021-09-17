import { IMessage } from "../message/IMessage";
export declare abstract class Command {
    msg: IMessage;
    constructor(msg: IMessage);
    dispatch(msg: IMessage): void;
    dispatch(type: string, ...params: any[]): void;
    abstract exec(): void;
}
//# sourceMappingURL=Command.d.ts.map