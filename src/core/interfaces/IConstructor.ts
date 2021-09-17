/// <reference path="../global/IConstructor.ts"/>

/**
 * 任意构造器接口
*/
export interface IConstructor extends Function
{
    new (...args:any[]):any;
}