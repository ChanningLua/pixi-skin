export declare function getCurOrigin(): string;
export declare function trimURL(url: string): string;
export declare function isAbsolutePath(url: string): boolean;
export declare function validateProtocol(url: string, protocol?: string): string;
export declare function wrapHost(url: string, host: string, forced?: boolean): string;
export declare function wrapAbsolutePath(relativePath: string, host?: string): string;
export declare function getHostAndPathname(url: string): string;
export declare function getPath(url: string): string;
export declare function getName(url: string): string;
export declare function parseUrl(url: string): URLLocation;
export declare function getQueryParams(url: string): {
    [key: string]: string;
};
export declare function joinQueryParams(url: string, params: Object): string;
export declare function joinHashParams(url: string, params: Object): string;
export interface URLLocation {
    href: string;
    origin: string;
    protocol: string;
    host: string;
    hostname: string;
    port: string;
    pathname: string;
    search: string;
    hash: string;
}
//# sourceMappingURL=URLUtil.d.ts.map