export enum JSLoadMode
{
    AUTO,
    JSONP,
    TAG
}

export interface JSFileData
{
    url:string;
    mode?:JSLoadMode;
}

export type JSFile = string | JSFileData;
