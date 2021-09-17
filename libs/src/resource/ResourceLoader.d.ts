import { ResourceItem } from './ResourceItem';
import { JSFile } from './../core/interfaces/JSFile';
export declare class ResourceLoader {
    private _assetsDict;
    thread: number;
    private loadingCount;
    callBack: Function;
    resInstance: any;
    private groupTotalDic;
    private numLoadedDic;
    private itemListDic;
    private groupErrorDic;
    private retryTimesDic;
    maxRetryTimes: number;
    private failedList;
    private priorityQueue;
    isGroupInLoading(groupName: string): boolean;
    loadGroup(list: Array<ResourceItem>, groupName: string, priority?: number): void;
    private lazyLoadList;
    loadItem(resourceItem: ResourceItem): void;
    private next;
    private queueIndex;
    private getOneResourceItem;
    private onItemComplete;
    private removeGroupName;
    getAssets(keyOrPath: string): any;
    loadAssets(keyOrPath: string | string[], complete: (assets?: any | any[], path?: string) => void, responseType?: XMLHttpRequestResponseType, oneComplete?: (keyOrPath?: string, assets?: any) => void): void;
    loadStyleFiles(cssFiles: string[], handler: (err?: Error) => void): void;
    loadJsFiles(jsFiles: JSFile[], handler: (err?: Error) => void, ordered?: boolean): void;
}
//# sourceMappingURL=ResourceLoader.d.ts.map