import {IMessage} from "../message/IMessage";
import {Command} from "./Command";

/**
 * 内核命令接口
*/
export interface ICommandConstructor
{
    new (msg:IMessage):Command;
}