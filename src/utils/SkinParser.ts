import { skinDict, parseXML } from './Manager';
import * as PIXI from 'pixi.js';

import { BasicLayout } from './Layout';
import { getTexture } from './Manager';

import { CompatibilityContainer } from './../CompatibilityContainer';
import { Component } from './../components/Component';
import { Group } from './../components/Group';
import { Image } from './../components/Image';
import { Label } from './../components/Label';
import { Button } from './../components/Button';
// import {List} from '../components/List';

import { log, LOG_LEVEL_WARNING } from './../utils/Log';
import {STATE_DEFAULT} from './../Constant';

// 非法属性
const invalidAttributes: any = {

};

// 需要在组件创建后立即按顺序赋值的属性
const orderAttributes: any = {
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

    // List: {
    //     list: ['visible', 'touchEnabled', 'itemRendererSkinName'],
    //     dict: {
    //         skinName: ''
    //     }
    // }
};

// 解析皮肤时属性顺序
const skinAttributeOrder: string[] = ['states', 'width', 'height', 'children', 'currentState'];
// 解析皮肤配置
export function parseSkinConfig(target: any, skinName: string): void
{
    console.log('parseSkinConfig')
    if (skinDict[skinName] == null)
    {
        log('解析皮肤配置没找到皮肤：' + skinName, LOG_LEVEL_WARNING);
        return;
    }
    let skinConfig: any = skinDict[skinName];
    if (typeof skinConfig === 'string')
    {
        skinConfig = parseXML(skinConfig);
    }
    for (let i: number = 0; i < skinAttributeOrder.length; i++)
    {
        let key: string = skinAttributeOrder[i];
        if (skinConfig[key] != null)
        {
            variablesHandler[key](target, skinConfig[key]);
        }
    }
}

// 使用配置设置组件属性
export function setComponentAttributes(target: CompatibilityContainer, config: any): void
{
    let type: string = config.type;
    // TODO 配置里带了 e: 以后可能去掉
    type = type.substr(2, type.length - 1);
    let dict: any;
    if (orderAttributes[type] != null)
    {
        let list: string[] = orderAttributes[type].list;
        dict = orderAttributes[type].dict;
        // 优先执行一次
        for (let i: number = 0; i < list.length; i++)
        {
            let key: string = list[i];
            if (config[key] != null)
            {   
                variablesHandler[key](target, config[key]);
            }
        }
    }

    // TODO 会重复执行优先执行的属性
    for (let key in config)
    {
        if (!config.hasOwnProperty(key))
        {
            continue;
        }
        // 排除非法属性
        if (invalidAttributes[key] != null)
        {
            continue;
        }
        // 已经赋值过的不再赋值
        if (dict != null && dict[key] != null)
        {
            continue;
        }
        // 处理方法里没有的不进行赋值
        if (variablesHandler[key] == null)
        {
            continue;
        }
        variablesHandler[key](target, config[key]);
    }
}

// 属性赋值处理方法
const variablesHandler: any = {
  // 通用
  states: (target: CompatibilityContainer, value: string) =>
  {
      let states: string[] = value.split(',');
      target.states = states;
  },

  x: (target: CompatibilityContainer | any, value: string) =>
  {
      target.x = parseFloat(value) || target.x;
  },
  y: (target: CompatibilityContainer | any, value: string) =>
  {
      target.y = parseFloat(value) || target.y;
  },
  visible: (target: CompatibilityContainer, value: string) =>
  {
      // FIXME 暂时不支持visible, pixi和egret对visible的实现不同
      // 先简单实现
      target['visible'] = value !== 'false';
  },
  width: (target: CompatibilityContainer, value: string) =>
  {
      if (value.indexOf('%') !== -1)
      {
          target.percentWidth = parseInt(value, 10);
      }
      else
      {
          target.explicitWidth = +value;
      }
  },
  height: (target: CompatibilityContainer, value: string) =>
  {
      if (value.indexOf('%') !== -1)
      {
          target.percentHeight = parseInt(value, 10);
      }
      else
      {
          target.explicitHeight = +value;
      }
  },
  alpha: (target: CompatibilityContainer | any, value: string) =>
  {
      target.alpha = parseFloat(value) || target.alpha;
  },
  anchorOffsetX: (target: CompatibilityContainer, value: string) =>
  {
      target.anchorOffsetX = parseFloat(value) || target.anchorOffsetX;
  },
  anchorOffsetY: (target: CompatibilityContainer, value: string) =>
  {
      target.anchorOffsetY = parseFloat(value) || target.anchorOffsetY;
  },
  skewX: (target: CompatibilityContainer, value: string) =>
  {
      target.skewX = parseFloat(value) || target.skewX;
  },
  skewY: (target: CompatibilityContainer, value: string) =>
  {
      target.skewY = parseFloat(value) || target.skewY;
  },
  scaleX: (target: CompatibilityContainer, value: string) =>
  {

  },
  scaleY: (target: CompatibilityContainer, value: string) =>
  {

  },
  rotation: (target: CompatibilityContainer | any, value: string) =>
  {
      target.rotation = parseFloat(value) || target.rotation;
  },
  touchEnabled: (target: CompatibilityContainer | any, value: string) =>
  {
      target.interactive = getBoolean(value);
  },
  touchChildren: (target: CompatibilityContainer | any, value: string) =>
  {
      target.interactiveChildren = getBoolean(value);
  },
  name: (target: CompatibilityContainer | any, value: string) =>
  {
      target.name = value;
  },
  id: (target: CompatibilityContainer, value: string) =>
  {
      target.id = value;
  },
  hostComponentKey: (target: CompatibilityContainer, value: string) =>
  {
      target.hostComponentKey = value;
  },
  includeIn: (target: CompatibilityContainer | any, value: string, parent?: CompatibilityContainer) =>
  {
      // 用visible实现状态切换，实际切换状态时对象还在显示列表
      let states: string[] = value.split(',');
      if (parent && parent.currentState != null)
      {
          let visible: boolean = false;
          for (let i: number = 0; i < states.length; i++)
          {
              if (states[i] === parent.currentState)
              {
                  visible = true;
                  break;
              }
          }
          target.visible = visible;
      }
  },
  top: (target: CompatibilityContainer, value: string) =>
  {
      target.top = value;
  },
  left: (target: CompatibilityContainer, value: string) =>
  {
      target.left = value;
  },
  right: (target: CompatibilityContainer, value: string) =>
  {
      target.right = value;
  },
  bottom: (target: CompatibilityContainer, value: string) =>
  {
      target.bottom = value;
  },
  verticalCenter: (target: CompatibilityContainer, value: string) =>
  {
      target.verticalCenter = value;
  },
  horizontalCenter: (target: CompatibilityContainer, value: string) =>
  {
      target.horizontalCenter = value;
  },

  currentState: (target: CompatibilityContainer | any, value: string) =>
  {
      let children: PIXI.DisplayObject[] = target.children;
      for (let i: number = 0; i < children.length; i++)
      {
          (children[i] as CompatibilityContainer).currentState = value;
      }
  },
  children: (target: CompatibilityContainer | any, value: any) =>
  {
    let children: any[] = value;
    for (let i: number = 0; i < children.length; i++)
    {
        let config: any = children[i];
        let type: string = config.type;
        // TODO 配置里带了 e: 以后可能去掉
        type = type.substr(2, type.length - 1);
        if (createComponentDict[type] != null)
        {
            let comp: any = createComponentDict[type](config, target);
            if (comp instanceof CompatibilityContainer)
            {
                target.addChild(comp);
                comp.config = config;
            }
        }
    }
    BasicLayout(target, target.explicitWidth, target.explicitHeight);
  },


  // Component
  enable: (target: Component, value: string) =>
  {
    target.enable = getBoolean(value);
  },
  skinName: (target: Component, value: string) =>
  {
    target.skinName = value;
    // FIXME
    target['clearChildren'] && target['clearChildren']();
    parseSkinConfig(target, value);
  },

  // Image
  scale9Grid: (target: Image, value: string) =>
  {
    target.scale9Grid = value;
  },
  source: (target: Image, value: string) =>
  {
    target.source = value;
  },

  // Button
  icon: (target: Button, value: string) =>
  {
    target.icon = value;
  },

  // Label
  text: (target: Label, value: string) => 
  {
    target.text = value;
  },
  size: (target: Label, value: string) => 
  {
    target.size = parseInt(value);
  }, 
  italic: (target: Label, value: string) => 
  {
    target.italic = value === 'string';
  }, 
  bold: (target: Label, value: string) => 
  {
    target.bold = value === 'true';
  }, 
  textAlign: (target: Label, value: string) => 
  {
    target.textAlign = value;
  }, 
  textColor: (target: Label, value: string) => 
  {
    target.textColor = value;
  }, 
  fontFamily: (target: Label, value: string) => 
  {
    target.fontFamily = value;
  },

  // List
//   itemRendererSkinName: (target: List, value: string) => 
//   {
//     target.itemRendererSkinName = value;
//   }
};

// 根据配置构建显示对象
const createComponentDict: any = {
  Component: (config: any) => new Component(),
  Group: (config: any) => new Group(),
  Image: (config: any) => new Image(),
  Button: (config: any) => new Button(),
  Label: (config: any) => new Label(),
//   List: (config: any) => new List(),

  // 布局要做特殊处理
  layout: (config: any, parent: Group) =>
  {
      if (!(parent instanceof Group))
      {
          log('布局laytou，父级不是Group实例', LOG_LEVEL_WARNING);

          return;
      }
      if (config.children != null)
      {
          let type: string = config.type;
          // TODO 配置里带了 e: 以后可能去掉
          type = type.substr(2, type.length - 1);

          parent.layout = type;
      }
  },
};
function getBoolean(value: any): boolean
{
  if (value === 'true' || value === true)
  {
      return true;
  }
  else
  {
      return false;
  }
}
// 根据传入配置转换成组件可用带状态的配置
export function convertSkinConfig(skinConfig: any): any
{
  let config: any = {};
  let defaultConfig: any = {};
  for (let key in skinConfig)
  {
      if (!skinConfig.hasOwnProperty(key))
      {
          continue;
      }
      let value: string = skinConfig[key];
      // 暂时使用点分隔符判定属性和状态
      let subs: string[] = key.split('.');
      if (subs.length === 1)
      {
          defaultConfig[key] = value;
      }
      else if (subs.length === 2)
      {
          let state: string = subs[1];
          if (config[state] == null)
          {
              config[state] = {};
          }
          config[state][subs[0]] = value;
      }
      else
      {
          // TODO throw error?
          log('配置组件状态属性出现超过一个"."作为分隔符的非法配置', LOG_LEVEL_WARNING);
      }
  }

  for (let cfgKey in config)
  {
      if (!config.hasOwnProperty(cfgKey))
      {
          continue;
      }
      let stateConfig = config[cfgKey];
      for (let key in defaultConfig)
      {
          if (!defaultConfig.hasOwnProperty(key))
          {
              continue;
          }
          if (stateConfig[key] != null)
          {
              continue;
          }
          stateConfig[key] = defaultConfig[key];
      }
  }

  config[STATE_DEFAULT] = defaultConfig;

  return config;
}
