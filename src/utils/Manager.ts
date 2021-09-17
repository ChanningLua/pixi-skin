import * as PIXI from 'pixi.js';
import { resourceManager } from './../resource/ResourceManager';
import { matchUrl } from './StringUtil';

// 存放所有皮肤配置
export const skinDict: any = {

};



/**
 * 获取贴图
 * @export
 * @param {string} value 
 * @returns {PIXI.Texture} 
 */
export function getTexture(value: string): PIXI.Texture | null
{
    let _value = getTextureUrl(value);
    return PIXI.utils.TextureCache[_value] || null;
}
/**
 * 获取贴图URL
 * @export
 * @param {string} value 
 * @returns {string} 
 */
export function getTextureUrl(value: string): string
{
    let isUrl = matchUrl(value);
    if (!isUrl) {
        let item = resourceManager.getResourceItem(value);
        if (item) {
            value = item.url;
        }
    }
    return value;
}



const TYPE_TEXT: string = '#text';

/***
 * 解析XML
 * @param data
 * @returns {any}
 */
export function parseXML(data: string): Object
{
    let xml;
    let tmp;
    if (!data || typeof data !== 'string')
    {
        return null;
    }
    try
    {
        if (window['DOMParser'])
        { // Standard
            tmp = new DOMParser();
            xml = tmp.parseFromString(data, 'text/xml');
        }
        // else
        // {   // IE, 引入scripthost解决报错
        //     xml = new ActiveXObject('Microsoft.XMLDOM');
        //     xml.async = 'false';
        //     xml.loadXML(data);
        // }
    }
    catch (e)
    {
        xml = undefined;
    }

    let reg: RegExp = /^\s+$/;

    function docToObj(el: Node | any): any
    {
        if (el.nodeName === TYPE_TEXT)
        {
            if (reg.test(el.textContent))
            {
                return;
            }
        }

        let obj: any = {};
        obj.type = el.nodeName;
        let attrib: Attr;
        if (el.attributes != null)
        {
            for (let i: number = 0; i < el.attributes.length; i++)
            {
                attrib = el.attributes[i];
                obj[attrib.name] = attrib.value;
            }
        }

        if (el.childNodes.length > 0)
        {
            let list: any[] = [];
            for (let i: number = 0; i < el.childNodes.length; i++)
            {
                let node = docToObj(el.childNodes[i]);
                if (node != null)
                {
                    list.push(node);
                    node.parent = obj;
                }
            }
            if (list.length > 0)
            {
                obj.children = list;
            }
        }

        if (el.nodeName === TYPE_TEXT)
        {
            obj.text = el.textContent;
        }

        return obj;
    }

    let object: any = docToObj(xml);
    let result: any = object.children[0];
    delete result.parent;
    if (result.type === 'html')
    {
        return data;
    }
    else
    {
        return result;
    }
}
