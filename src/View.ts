import * as PIXI from 'pixi.js';
import {parseSkinConfig} from './utils/SkinParser';
import {Component} from './components/Component';
export class View {

  // 解析自身SKIN
  private compoment: Component = null;
  public parseSkinConfig (name) {
    this.compoment = new Component();
    parseSkinConfig( this.compoment, name);
  }

  public getSkin () {
    return this.compoment;
  }
}