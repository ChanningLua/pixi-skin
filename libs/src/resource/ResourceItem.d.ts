export declare class ResourceItem {
    static TYPE_XML: string;
    static TYPE_IMAGE: string;
    static TYPE_SHEET: string;
    static TYPE_TEXT: string;
    static TYPE_JSON: string;
    static TYPE_SOUND: string;
    constructor(name: string, url: string, type: string);
    name: string;
    url: string;
    type: string;
    groupName: string;
    data: any;
    private _loaded;
    get loaded(): boolean;
    set loaded(value: boolean);
}
//# sourceMappingURL=ResourceItem.d.ts.map