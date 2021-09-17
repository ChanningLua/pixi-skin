export declare type HTTPMethod = "GET" | "POST";
export interface IHTTPRequestParams {
    url: string | string[];
    data?: any;
    forceHTTPS?: boolean;
    method?: HTTPMethod;
    withCredentials?: boolean;
    responseType?: XMLHttpRequestResponseType;
    headerDict?: {
        [key: string]: string;
    };
    retryTimes?: number;
    timeout?: number;
    onResponse?: (result?: any | any[]) => void;
    onError?: (err: Error) => void;
}
export declare function load(params: IHTTPRequestParams): void;
export declare function asyncLoad(params: IHTTPRequestParams): Promise<any | any[]>;
export declare function toFormParams(data: any): string;
export declare class XHRError extends Error {
    private _xhr;
    get xhr(): XMLHttpRequest;
    constructor(xhr: XMLHttpRequest);
}
//# sourceMappingURL=HTTPUtil.d.ts.map