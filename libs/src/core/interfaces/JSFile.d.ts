export declare enum JSLoadMode {
    AUTO = 0,
    JSONP = 1,
    TAG = 2
}
export interface JSFileData {
    url: string;
    mode?: JSLoadMode;
}
export declare type JSFile = string | JSFileData;
//# sourceMappingURL=JSFile.d.ts.map