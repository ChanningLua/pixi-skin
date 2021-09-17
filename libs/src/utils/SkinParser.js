import { skinDict, parseXML } from './Manager';
import { BasicLayout } from './Layout';
import { CompatibilityContainer } from './../CompatibilityContainer';
import { Component } from './../components/Component';
import { Group } from './../components/Group';
import { Image } from './../components/Image';
import { Label } from './../components/Label';
import { Button } from './../components/Button';
import { log, LOG_LEVEL_WARNING } from './../utils/Log';
import { STATE_DEFAULT } from './../Constant';
var invalidAttributes = {};
var orderAttributes = {
    Component: {
        list: ['skinName', 'visible', 'touchEnabled'],
        dict: {
            skinName: '',
        },
    },
    Group: {
        list: ['visible', 'touchEnabled', 'name'],
        dict: {
            skinName: '',
            scale9Grid: '',
        },
    },
    Image: {
        list: ['source', 'scale9Grid', 'visible', 'touchEnabled', 'name'],
        dict: {
            skinName: '',
            scale9Grid: '',
        },
    },
    Label: {
        list: ['size', 'italic', 'bold', 'textAlign', 'textColor', 'fontFamily', 'text', 'visible', 'touchEnabled', 'name'],
        dict: {
            skinName: ''
        }
    },
};
var skinAttributeOrder = ['states', 'width', 'height', 'children', 'currentState'];
export function parseSkinConfig(target, skinName) {
    console.log('parseSkinConfig');
    if (skinDict[skinName] == null) {
        log('解析皮肤配置没找到皮肤：' + skinName, LOG_LEVEL_WARNING);
        return;
    }
    var skinConfig = skinDict[skinName];
    if (typeof skinConfig === 'string') {
        skinConfig = parseXML(skinConfig);
    }
    for (var i = 0; i < skinAttributeOrder.length; i++) {
        var key = skinAttributeOrder[i];
        if (skinConfig[key] != null) {
            variablesHandler[key](target, skinConfig[key]);
        }
    }
}
export function setComponentAttributes(target, config) {
    var type = config.type;
    type = type.substr(2, type.length - 1);
    var dict;
    if (orderAttributes[type] != null) {
        var list = orderAttributes[type].list;
        dict = orderAttributes[type].dict;
        for (var i = 0; i < list.length; i++) {
            var key = list[i];
            if (config[key] != null) {
                variablesHandler[key](target, config[key]);
            }
        }
    }
    for (var key in config) {
        if (!config.hasOwnProperty(key)) {
            continue;
        }
        if (invalidAttributes[key] != null) {
            continue;
        }
        if (dict != null && dict[key] != null) {
            continue;
        }
        if (variablesHandler[key] == null) {
            continue;
        }
        variablesHandler[key](target, config[key]);
    }
}
var variablesHandler = {
    states: function (target, value) {
        var states = value.split(',');
        target.states = states;
    },
    x: function (target, value) {
        target.x = parseFloat(value) || target.x;
    },
    y: function (target, value) {
        target.y = parseFloat(value) || target.y;
    },
    visible: function (target, value) {
        target['visible'] = value !== 'false';
    },
    width: function (target, value) {
        if (value.indexOf('%') !== -1) {
            target.percentWidth = parseInt(value, 10);
        }
        else {
            target.explicitWidth = +value;
        }
    },
    height: function (target, value) {
        if (value.indexOf('%') !== -1) {
            target.percentHeight = parseInt(value, 10);
        }
        else {
            target.explicitHeight = +value;
        }
    },
    alpha: function (target, value) {
        target.alpha = parseFloat(value) || target.alpha;
    },
    anchorOffsetX: function (target, value) {
        target.anchorOffsetX = parseFloat(value) || target.anchorOffsetX;
    },
    anchorOffsetY: function (target, value) {
        target.anchorOffsetY = parseFloat(value) || target.anchorOffsetY;
    },
    skewX: function (target, value) {
        target.skewX = parseFloat(value) || target.skewX;
    },
    skewY: function (target, value) {
        target.skewY = parseFloat(value) || target.skewY;
    },
    scaleX: function (target, value) {
    },
    scaleY: function (target, value) {
    },
    rotation: function (target, value) {
        target.rotation = parseFloat(value) || target.rotation;
    },
    touchEnabled: function (target, value) {
        target.interactive = getBoolean(value);
    },
    touchChildren: function (target, value) {
        target.interactiveChildren = getBoolean(value);
    },
    name: function (target, value) {
        target.name = value;
    },
    id: function (target, value) {
        target.id = value;
    },
    hostComponentKey: function (target, value) {
        target.hostComponentKey = value;
    },
    includeIn: function (target, value, parent) {
        var states = value.split(',');
        if (parent && parent.currentState != null) {
            var visible = false;
            for (var i = 0; i < states.length; i++) {
                if (states[i] === parent.currentState) {
                    visible = true;
                    break;
                }
            }
            target.visible = visible;
        }
    },
    top: function (target, value) {
        target.top = value;
    },
    left: function (target, value) {
        target.left = value;
    },
    right: function (target, value) {
        target.right = value;
    },
    bottom: function (target, value) {
        target.bottom = value;
    },
    verticalCenter: function (target, value) {
        target.verticalCenter = value;
    },
    horizontalCenter: function (target, value) {
        target.horizontalCenter = value;
    },
    currentState: function (target, value) {
        var children = target.children;
        for (var i = 0; i < children.length; i++) {
            children[i].currentState = value;
        }
    },
    children: function (target, value) {
        var children = value;
        for (var i = 0; i < children.length; i++) {
            var config = children[i];
            var type = config.type;
            type = type.substr(2, type.length - 1);
            if (createComponentDict[type] != null) {
                var comp = createComponentDict[type](config, target);
                if (comp instanceof CompatibilityContainer) {
                    target.addChild(comp);
                    comp.config = config;
                }
            }
        }
        BasicLayout(target, target.explicitWidth, target.explicitHeight);
    },
    enable: function (target, value) {
        target.enable = getBoolean(value);
    },
    skinName: function (target, value) {
        target.skinName = value;
        target['clearChildren'] && target['clearChildren']();
        parseSkinConfig(target, value);
    },
    scale9Grid: function (target, value) {
        target.scale9Grid = value;
    },
    source: function (target, value) {
        target.source = value;
    },
    icon: function (target, value) {
        target.icon = value;
    },
    text: function (target, value) {
        target.text = value;
    },
    size: function (target, value) {
        target.size = parseInt(value);
    },
    italic: function (target, value) {
        target.italic = value === 'string';
    },
    bold: function (target, value) {
        target.bold = value === 'true';
    },
    textAlign: function (target, value) {
        target.textAlign = value;
    },
    textColor: function (target, value) {
        target.textColor = value;
    },
    fontFamily: function (target, value) {
        target.fontFamily = value;
    },
};
var createComponentDict = {
    Component: function (config) { return new Component(); },
    Group: function (config) { return new Group(); },
    Image: function (config) { return new Image(); },
    Button: function (config) { return new Button(); },
    Label: function (config) { return new Label(); },
    layout: function (config, parent) {
        if (!(parent instanceof Group)) {
            log('布局laytou，父级不是Group实例', LOG_LEVEL_WARNING);
            return;
        }
        if (config.children != null) {
            var type = config.type;
            type = type.substr(2, type.length - 1);
            parent.layout = type;
        }
    },
};
function getBoolean(value) {
    if (value === 'true' || value === true) {
        return true;
    }
    else {
        return false;
    }
}
export function convertSkinConfig(skinConfig) {
    var config = {};
    var defaultConfig = {};
    for (var key in skinConfig) {
        if (!skinConfig.hasOwnProperty(key)) {
            continue;
        }
        var value = skinConfig[key];
        var subs = key.split('.');
        if (subs.length === 1) {
            defaultConfig[key] = value;
        }
        else if (subs.length === 2) {
            var state = subs[1];
            if (config[state] == null) {
                config[state] = {};
            }
            config[state][subs[0]] = value;
        }
        else {
            log('配置组件状态属性出现超过一个"."作为分隔符的非法配置', LOG_LEVEL_WARNING);
        }
    }
    for (var cfgKey in config) {
        if (!config.hasOwnProperty(cfgKey)) {
            continue;
        }
        var stateConfig = config[cfgKey];
        for (var key in defaultConfig) {
            if (!defaultConfig.hasOwnProperty(key)) {
                continue;
            }
            if (stateConfig[key] != null) {
                continue;
            }
            stateConfig[key] = defaultConfig[key];
        }
    }
    config[STATE_DEFAULT] = defaultConfig;
    return config;
}
//# sourceMappingURL=SkinParser.js.map