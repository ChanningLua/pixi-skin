export interface IOpenClose<OD = any, CD = any> {
    data: OD;
    open(data?: OD, ...args: any[]): Promise<any>;
    close(data?: CD, ...args: any[]): Promise<any>;
}
//# sourceMappingURL=IOpenClose.d.ts.map