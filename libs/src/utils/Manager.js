import * as PIXI from 'pixi.js';
import { resourceManager } from './../resource/ResourceManager';
import { matchUrl } from './StringUtil';
export var skinDict = {};
export function getTexture(value) {
    var _value = getTextureUrl(value);
    return PIXI.utils.TextureCache[_value] || null;
}
export function getTextureUrl(value) {
    var isUrl = matchUrl(value);
    if (!isUrl) {
        var item = resourceManager.getResourceItem(value);
        if (item) {
            value = item.url;
        }
    }
    return value;
}
var TYPE_TEXT = '#text';
export function parseXML(data) {
    var xml;
    var tmp;
    if (!data || typeof data !== 'string') {
        return null;
    }
    try {
        if (window['DOMParser']) {
            tmp = new DOMParser();
            xml = tmp.parseFromString(data, 'text/xml');
        }
    }
    catch (e) {
        xml = undefined;
    }
    var reg = /^\s+$/;
    function docToObj(el) {
        if (el.nodeName === TYPE_TEXT) {
            if (reg.test(el.textContent)) {
                return;
            }
        }
        var obj = {};
        obj.type = el.nodeName;
        var attrib;
        if (el.attributes != null) {
            for (var i = 0; i < el.attributes.length; i++) {
                attrib = el.attributes[i];
                obj[attrib.name] = attrib.value;
            }
        }
        if (el.childNodes.length > 0) {
            var list = [];
            for (var i = 0; i < el.childNodes.length; i++) {
                var node = docToObj(el.childNodes[i]);
                if (node != null) {
                    list.push(node);
                    node.parent = obj;
                }
            }
            if (list.length > 0) {
                obj.children = list;
            }
        }
        if (el.nodeName === TYPE_TEXT) {
            obj.text = el.textContent;
        }
        return obj;
    }
    var object = docToObj(xml);
    var result = object.children[0];
    delete result.parent;
    if (result.type === 'html') {
        return data;
    }
    else {
        return result;
    }
}
//# sourceMappingURL=Manager.js.map