import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import Penner from 'penner';

const scrollboxOptions = {
  'boxWidth': 100,
  'boxHeight': 100,
  'scrollbarSize': 10,
  'scrollbarBackground': 14540253,
  'scrollbarBackgroundAlpha': 1,
  'scrollbarForeground': 8947848,
  'scrollbarForegroundAlpha': 1,
  'dragScroll': true,
  'stopPropagation': true,
  'scrollbarOffsetHorizontal': 0,
  'scrollbarOffsetVertical': 0,
  'underflow': 'top-left',
  'fadeScrollbar': false,
  'fadeScrollbarTime': 1000,
  'fadeScrollboxWait': 3000,
  'fadeScrollboxEase': 'easeInOutSine',
  'passiveWheel': false,
  'clampWheel': true
}

/**
 * ScrollerBase: 可以使容器垂直或水平滚动
 */
export class ScrollerBase extends PIXI.Container {
  private options;
  private ease;
  private content;
  private scrollbar;
  private _maskContent;
  private tickerFunction;
  private pointerDown;
  /**
   * create a ScrollerBase
   * @param {object} options
   * @param {boolean} [options.dragScroll=true]             是否可以通过拖动来滚动容器
   * @param {string} [options.overflowX=auto]               (none, scroll, hidden, auto) 横向滚动条是否显示
   * @param {string} [options.overflowY=auto]               (none, scroll, hidden, auto) 纵向滚动条是否显示
   * @param {string} [options.overflow]                     (none, scroll, hidden, auto) 覆盖overflowX&overflowY的值
   * @param {number} [options.boxWidth=100]                 滚动区域宽度
   * @param {number} [options.boxHeight=100]                滚动区域高度
   * @param {number} [options.scrollbarSize=10]             滚动条的大小
   * @param {number} [options.scrollbarOffsetHorizontal=0]  水平滚动条的偏移量
   * @param {number} [options.scrollbarOffsetVertical=0]    垂直滚动条的偏移量
   * @param {boolean} [options.stopPropagation=true]        对任何影响scroll的事件调用stopPropagation
   * @param {number} [options.scrollbarBackground=0xdddddd] 滚动条背景色
   * @param {number} [options.scrollbarBackgroundAlpha=1]   滚动条背景透明度
   * @param {number} [options.scrollbarForeground=0x888888] 滚动条前景色
   * @param {number} [options.scrollbarForegroundAlpha=1]   滚动条前景透明度
   * @param {string} [options.underflow=top-left]           当内容下溢滚动框时该做什么
   *                                                        (左/右/中心和上/下/中心);
   *                                                        或center(例如:'top-left'， 'center'， 'none'， 'bottomright')
   * @param {boolean} [options.noTicker]                    不使用PIXI默认的PIXI.Ticker，需在循环中手动调用updateLoop(elapsed)
   * @param {PIXI.Ticker} [options.ticker=PIXI.Ticker.shared] 更换默认PI                                                       XI.Ticker
   * @param {boolean} [options.fade]                        当不使用的时候隐藏滚动条
   * @param {number} [options.fadeScrollbarTime=1000]       滚动条淡出时间
   * @param {number} [options.fadeScrollboxWait=3000]       滚动条淡出等待时间
   * @param {(string|function)} [options.fadeScrollboxEase=easeInOutSine] 淡出缓动函数
   * @param {boolean} [options.passiveWheel=false]          是否在滚动容器外捕获滚轮事件
   * @param {boolean} [options.clampWheel=true]             滚轮事件防止抖动
   * @param {PIXI.InteractionManager} [options.interaction] 用于计算指针相对于画布在屏幕上的位置
   */
  constructor (options) {
      super();
      
      this.options = Object.assign({}, scrollboxOptions, options)
      if (options.overflow) {
          this.options.overflowX = this.options.overflowY = options.overflow
      }
      this.ease = typeof this.options.fadeScrollboxEase === 'function' ? this.options.fadeScrollboxEase : Penner[this.options.fadeScrollboxEase]

      /**
       * 添加需要移动的容器
       * Viewport (see https://davidfig.github.io/pixi-viewport/jsdoc/)
       * @type {Viewport}
       */
      let viewport = new Viewport({ 
        passiveWheel:     this.options.passiveWheel, 
        // stopPropagation:  this.options.stopPropagation, 
        screenWidth:      this.options.boxWidth, 
        screenHeight:     this.options.boxHeight, 
        interaction:      this.options.interaction
      });
      this.content = this['addChild'](<any>viewport);
      this.content
          .decelerate()
          .on('moved', () => this._drawScrollbars());

      // 兼容pixi V4 V5
      if (options.ticker) {
          this.options.ticker = options.ticker;
      } else {
          let ticker
          const pixiNS = PIXI
        //   if (parseInt(/^(\d+)\./.exec(PIXI.VERSION)[1]) < 5) {
        //       ticker = pixiNS['ticker'].shared;
        //   } else {
              ticker = pixiNS['Ticker'].shared;
        //   }
          this.options.ticker = options.ticker || ticker;
      }

      /**
       * 用于绘制滚动条的图形元素
       * @type {PIXI.Graphics}
       */
      this.scrollbar = this['addChild'](new PIXI.Graphics())
      this.scrollbar.interactive = true
      this.scrollbar.on('pointerdown', this.scrollbarDown, this)
      this['interactive'] = true
      this['on']('pointermove', this.scrollbarMove, this)
      this['on']('pointerup', this.scrollbarUp, this)
      this['on']('pointercancel', this.scrollbarUp, this)
      this['on']('pointerupoutside', this.scrollbarUp, this)
      this._maskContent = this['addChild'](new PIXI.Graphics())
      this.update()

      if (!this.options.noTicker) {
        // 传入每帧时间
        this.tickerFunction = () => this.updateLoop(Math.min(this.options.ticker.elapsedMS, 16.6667))
        this.options.ticker.add(this.tickerFunction)
      }
  }

  public onDestroy () {
    this.options.ticker?.remove(this.tickerFunction)
    this.options.ticker = null;
    this.options;
    this.ease = null;
    this.content = null;
    this.scrollbar = null;
    this._maskContent = null;
    this.tickerFunction = null;
    this.pointerDown = null;
    this['destroy']({
        children: true,
        texture: false,
        baseTexture: false,
    })
  }

  /**
   * 水平滚动条偏移量
   * @type {number}
   */
  public get scrollbarOffsetHorizontal () {
      return this.options.scrollbarOffsetHorizontal
  }
  public set scrollbarOffsetHorizontal (value) {
      this.options.scrollbarOffsetHorizontal = value
  }

  /**
   * 垂直滚动条的偏移量
   * @type {number}
   */
  public get scrollbarOffsetVertical () {
      return this.options.scrollbarOffsetVertical
  }
  public set scrollbarOffsetVertical (value) {
      this.options.scrollbarOffsetVertical = value
  }
  
  private _disabled;
  /**
   * 禁用滚动框(如果设置为true，也会移除遮罩)
   * @type {boolean}
   */
  public get disable () {
      return this._disabled
  }
  public set disable (value) {
      if (this._disabled !== value) {
          this._disabled = value
          this.update()
      }
  }

  /**
   * 对任何影响ScrollerBase的事件调用stopPropagation
   * @type {boolean}
   */
  public get stopPropagation () {
      return this.options.stopPropagation
  }
  public set stopPropagation (value) {
      this.options.stopPropagation = value
  }

  /**
   * 是否可以拖动滚动区域
   * @type {boolean}
   */
  public get dragScroll () {
      return this.options.dragScroll
  }
  public set dragScroll (value) {
      this.options.dragScroll = value
      if (value) {
          this.content.drag()
      } else {
          if (typeof this.content.removePlugin !== 'undefined') {
              this.content.removePlugin('drag')
          } else {
              this.content.plugins.remove('drag')
          }
      }
      this.update()
  }

  /**
   * 滚动区域宽度
   * @type {number}
   */
  public get boxWidth () {
      return this.options.boxWidth
  }
  public set boxWidth (value) {
      this.options.boxWidth = value
      this.content.screenWidth = value
      this.update()
  }

  /**
   * 设置滚动区域的 overflowX 和 overflowY
   * scroll = 显示滚动条
   * hidden = 不显示滚动条
   * auto = 如果容器大于滚动区域，显示滚动条
   * @type {string}
   */
  public get overflow () {
      return this.options.overflow
  }
  public set overflow (value) {
      this.options.overflow = value
      this.options.overflowX = value
      this.options.overflowY = value
      this.update()
  }

  /**
   * 设置滚动区域的 overflowX
   * scroll = 显示滚动条
   * hidden = 不显示滚动条
   * auto = 如果容器大于滚动区域，显示滚动条
   * @type {string}
   */
  public get overflowX () {
      return this.options.overflowX
  }
  public set overflowX (value) {
      this.options.overflowX = value
      this.update()
  }

  /**
   * 设置滚动区域的 overflowY
   * scroll = 显示滚动条
   * hidden = 不显示滚动条
   * auto = 如果容器大于滚动区域，显示滚动条
   * @type {string}
   */
  public get overflowY () {
      return this.options.overflowY
  }
  public set overflowY (value) {
      this.options.overflowY = value
      this.update()
  }

  /**
   * 滚动区域的高度
   * @type {number}
   */
  public get boxHeight () {
      return this.options.boxHeight
  }
  public set boxHeight (value) {
      this.options.boxHeight = value
      this.content.screenHeight = value
      this.update()
  }

  /**
   * 滚动条的大小
   * @type {number}
   */
  public get scrollbarSize () {
      return this.options.scrollbarSize
  }
  public set scrollbarSize (value) {
      this.options.scrollbarSize = value
  }

  /**
   * 可滚动区域，减去滚动条后的宽度
   * @type {number}
   * @readonly
   */
  public get contentWidth () {
      return this.options.boxWidth - (this.isScrollbarVertical ? this.options.scrollbarSize : 0)
  }

  /**
   * 可滚动区域，减去滚动条后的高度
   * @type {number}
   * @readonly
   */
  public get contentHeight () {
      return this.options.boxHeight - (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
  }

  private _isScrollbarVertical;
  /**
   * 垂直滚动条是否可见
   * @type {boolean}
   * @readonly
   */
  public get isScrollbarVertical () {
      return this._isScrollbarVertical
  }

  private _isScrollbarHorizontal;
  /**
   * 水平滚动条是否可见
   * @type {boolean}
   * @readonly
   */
  public get isScrollbarHorizontal () {
      return this._isScrollbarHorizontal
  }

  /**
   * 滚动条的顶部坐标
   */
  public get scrollTop () {
      return this.content.top
  }
  public set scrollTop (top) {
      this.content.top = top
      this._drawScrollbars()
  }

  /**
   * 滚动条的左边坐标
   */
  public get scrollLeft () {
      return this.content.left
  }
  public set scrollLeft (left) {
      this.content.left = left
      this._drawScrollbars()
  }

  private _scrollWidth;
  /**
   * 内容区域的宽度
   */
  public get scrollWidth () {
      return this._scrollWidth || this.content.width
  }
  public set scrollWidth (value) {
      this._scrollWidth = value
  }

  private _scrollHeight;
  /**
   * 内容区域的高度
   */
  public get scrollHeight () {
      return this._scrollHeight || this.content.height
  }
  public set scrollHeight (value) {
      this._scrollHeight = value
  }

  
  private scrollbarLeft;
  private scrollbarTop;
  private scrollbarWidth;
  private scrollbarHeight;
  /**
   * draws scrollbars
   * @private
   */
  private _drawScrollbars () {
    //   console.log('_drawScrollbars')
      this._isScrollbarHorizontal = this.overflowX === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowX) !== -1 ? false : this.scrollWidth > this.options.boxWidth
      this._isScrollbarVertical = this.overflowY === 'scroll' ? true : ['hidden', 'none'].indexOf(this.overflowY) !== -1 ? false : this.scrollHeight > this.options.boxHeight
      this.scrollbar.clear()
      let options: any = {}
      options.left = 0
      options.right = this.scrollWidth + (this._isScrollbarVertical ? this.options.scrollbarSize : 0)
      options.top = 0
      options.bottom = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
      const width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0)
      const height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
      this.scrollbarTop = (this.content.top / height) * this.boxHeight
      this.scrollbarTop = this.scrollbarTop < 0 ? 0 : this.scrollbarTop
      this.scrollbarHeight = (this.boxHeight / height) * this.boxHeight
      this.scrollbarHeight = this.scrollbarTop + this.scrollbarHeight > this.boxHeight ? this.boxHeight - this.scrollbarTop : this.scrollbarHeight
      this.scrollbarLeft = (this.content.left / width) * this.boxWidth
      this.scrollbarLeft = this.scrollbarLeft < 0 ? 0 : this.scrollbarLeft
      this.scrollbarWidth = (this.boxWidth / width) * this.boxWidth
      this.scrollbarWidth = this.scrollbarWidth + this.scrollbarLeft > this.boxWidth ? this.boxWidth - this.scrollbarLeft : this.scrollbarWidth
      if (this.isScrollbarVertical) {
          this.scrollbar
              .beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha)
              .drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, 0, this.scrollbarSize, this.boxHeight)
              .endFill()
      }
      if (this.isScrollbarHorizontal) {
          this.scrollbar
              .beginFill(this.options.scrollbarBackground, this.options.scrollbarBackgroundAlpha)
              .drawRect(0, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.boxWidth, this.scrollbarSize)
              .endFill()
      }
      if (this.isScrollbarVertical) {
          this.scrollbar
              .beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha)
              .drawRect(this.boxWidth - this.scrollbarSize + this.options.scrollbarOffsetVertical, this.scrollbarTop, this.scrollbarSize, this.scrollbarHeight)
              .endFill()
      }
      if (this.isScrollbarHorizontal) {
          this.scrollbar
              .beginFill(this.options.scrollbarForeground, this.options.scrollbarForegroundAlpha)
              .drawRect(this.scrollbarLeft, this.boxHeight - this.scrollbarSize + this.options.scrollbarOffsetHorizontal, this.scrollbarWidth, this.scrollbarSize)
              .endFill()
      }
      // this.content.forceHitArea = new PIXI.Rectangle(0, 0 , this.boxWidth, this.boxHeight)
      this.activateFade()
  }

  /**
   * 绘制遮罩
   * @private
   */
  private _drawMask () {
      this._maskContent
          .beginFill(0)
          .drawRect(0, 0, this.boxWidth, this.boxHeight)
          .endFill()
      this.content.mask = this._maskContent
  }

  /**
   * ScrollerBase内容改变时调用
   */
  public update () {
      this.content.mask = null
      this._maskContent.clear()
      if (!this._disabled) {
          this._drawScrollbars()
          this._drawMask()
          const direction = this.isScrollbarHorizontal && this.isScrollbarVertical ? 'all' : this.isScrollbarHorizontal ? 'x' : 'y'
          if (direction !== null) {
              if (this.options.dragScroll) {
                  this.content.drag({ clampWheel: this.options.clampWheel, direction })
              }
              this.content.clamp({ direction, underflow: this.options.underflow })
          }
      }
  }

  private fade;
  /**
   * 如果启用淡出则每帧调用更新
   * @param {number} elapsed 毫秒
   */
  public updateLoop (elapsed) {
      if (this.fade) {
          if (this.fade.wait > 0) {
              this.fade.wait -= elapsed
              if (this.fade.wait <= 0) {
                  elapsed += this.fade.wait
              } else {
                  return
              }
          }
          this.fade.duration += elapsed
          if (this.fade.duration >= this.options.fadeScrollbarTime) {
              this.fade = null
              this.scrollbar.alpha = 0
          } else {
              this.scrollbar.alpha = this.ease(this.fade.duration, 1, -1, this.options.fadeScrollbarTime)
              console.log('this.fade.duration', this.fade.duration)
              console.log('this.scrollbar.alpha', this.scrollbar.alpha)
          }
          this.content.dirty = true
      }
  }

  /**
   * viewport的缓冲值
   * @type {boolean}
   */
  public get dirty () {
      return this.content.dirty
  }
  public set dirty (value) {
      this.content.dirty = value
  }

  /**
   * 显示滚动条并重置fade相关设置
   */
  public activateFade () {
      if (!this.fade && this.options.fade) {
          this.scrollbar.alpha = 1
          this.fade = { wait: this.options.fadeScrollboxWait, duration: 0 }
      }
  }

  /**
   * 从X点滑动到Y点
   */
//   public moveTo (touchPoint, movePoint) {
//     this.scrollbarDown({
//         data: {
//             global: touchPoint
//         }
//     });
//     this.scrollbarMove({
//         data: {
//             global: movePoint
//         }
//     });
//     this.scrollbarUp();
//   }

  /**
   * 
   * @param {PIXI.InteractionEvent} e
   * @private
   */
  public scrollbarDown (e) {
      const local = this['toLocal'](e.data.global)
      if (this.isScrollbarHorizontal) {
          if (local.y > this.boxHeight - this.scrollbarSize) {
              if (local.x >= this.scrollbarLeft && local.x <= this.scrollbarLeft + this.scrollbarWidth) {
                  this.pointerDown = { type: 'horizontal', last: local }
              } else {
                  if (local.x > this.scrollbarLeft) {
                      this.content.left += this.content.worldScreenWidth
                      this.update()
                  } else {
                      this.content.left -= this.content.worldScreenWidth
                      this.update()
                  }
              }
              if (this.options.stopPropagation) {
                  e?.stopPropagation()
              }
              return
          }
      }
      if (this.isScrollbarVertical) {
          if (local.x > this.boxWidth - this.scrollbarSize) {
              if (local.y >= this.scrollbarTop && local.y <= this.scrollbarTop + this.scrollbarWidth) {
                  this.pointerDown = { type: 'vertical', last: local }
              } else {
                  if (local.y > this.scrollbarTop) {
                      this.content.top += this.content.worldScreenHeight
                      this.update()
                  } else {
                      this.content.top -= this.content.worldScreenHeight
                      this.update()
                  }
              }
              if (this.options.stopPropagation) {
                  e?.stopPropagation()
              }
          }
      }
  }

  /**
   * 
   * @param {PIXI.InteractionEvent} e
   * @private
   */
  public scrollbarMove (e) {
      if (this.pointerDown) {
          if (this.pointerDown.type === 'horizontal') {
              const local = this['toLocal'](e.data.global)
              const width = this.scrollWidth + (this.isScrollbarVertical ? this.options.scrollbarSize : 0)
              this.scrollbarLeft += local.x - this.pointerDown.last.x
              this.content.left = this.scrollbarLeft / this.boxWidth * width
              this.pointerDown.last = local
              this.update()
          } else if (this.pointerDown.type === 'vertical') {
              const local = this['toLocal'](e.data.global)
              const height = this.scrollHeight + (this.isScrollbarHorizontal ? this.options.scrollbarSize : 0)
              this.scrollbarTop += local.y - this.pointerDown.last.y
              this.content.top = this.scrollbarTop / this.boxHeight * height
              this.pointerDown.last = local
              this.update()
          }
          if (this.options.stopPropagation) {
              e?.stopPropagation()
          }
      }
  }

  /**
   *
   * @private
   */
  public scrollbarUp () {
      this.pointerDown = null
  }

  /**
   * 容器遮罩自适应
   * @param {object} options
   * @param {number} [options.boxWidth] 容器宽度
   * @param {number} [options.boxHeight] 容器高度
   * @param {number} [options.scrollWidth] 滚动条宽度
   * @param {number} [options.scrollHeight] 滚动条高度
   */
  public resize (options) {
      this.options.boxWidth = typeof options.boxWidth !== 'undefined' ? options.boxWidth : this.options.boxWidth
      this.options.boxHeight = typeof options.boxHeight !== 'undefined' ? options.boxHeight : this.options.boxHeight
      if (options.scrollWidth) {
          this.scrollWidth = options.scrollWidth
      }
      if (options.scrollHeight) {
          this.scrollHeight = options.scrollHeight
      }
      this.content.resize(this.options.boxWidth, this.options.boxHeight, this.scrollWidth, this.scrollHeight)
      this.update()
  }

  /**
   * 确保宽度可见
   * @param {number} x  相对于容器的x坐标
   * @param {number} y  相对于容器的y坐标 
   * @param {number} width  相对于容器的宽度
   * @param {number} height 相对于容器的高度
   */
  public ensureVisible (x, y, width, height) {
      this.content.ensureVisible(x, y, width, height)
      this._drawScrollbars()
  }
}
