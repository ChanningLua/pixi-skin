import { IMessage } from "../message/IMessage";
import { Command } from "./Command";
export interface ICommandConstructor {
    new (msg: IMessage): Command;
}
//# sourceMappingURL=ICommandConstructor.d.ts.map