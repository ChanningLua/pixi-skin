import { IConstructor } from "../core/interfaces/IConstructor";
import 'reflect-metadata';
export declare function wrapConstruct(cls: IConstructor): IConstructor;
export declare function getConstructor(cls: IConstructor): IConstructor;
export declare function listenConstruct(cls: IConstructor, handler: (instance?: any) => void): void;
export declare function unlistenConstruct(cls: IConstructor, handler: (instance?: any) => void): void;
export declare function listenDispose(cls: IConstructor, handler: (instance?: any) => void): void;
export declare function listenApply(target: IConstructor | any, name: string, before?: (instance: any, args?: any[]) => any[] | void, after?: (instance: any, args?: any[], result?: any) => any, once?: boolean): void;
//# sourceMappingURL=ConstructUtil.d.ts.map