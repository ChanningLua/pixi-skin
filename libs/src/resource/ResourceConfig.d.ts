import { ResourceItem } from './ResourceItem';
export declare class ResourceConfig {
    getGroupByName(name: string): Array<ResourceItem>;
    getRawGroupByName(name: string): any[];
    createGroup(name: string, keys: string[], override?: boolean): boolean;
    private keyMap;
    private groupDic;
    parseConfig(data: any, folder: string): void;
    addSubkey(subkey: string, name: string): void;
    addItemToKeyMap(item: any): void;
    getName(key: string): string;
    getType(key: string): string;
    getResourceItem(key: string): ResourceItem;
    private parseResourceItem;
}
//# sourceMappingURL=ResourceConfig.d.ts.map