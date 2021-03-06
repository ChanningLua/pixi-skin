/* eslint-disable */

import * as PIXI from 'pixi.js';
import { core } from './../../core/Core';
import { GrowingPacker } from './growingpacker'; 
import { SimplePacker } from './simplepacker';

// types
const CANVAS = 0 // default
const IMAGE = 1 // image url
const DATA = 2 // data src (e.g., result of .toDataURL())

// default ms to wait to check if an image has finished loading
const WAIT = 50

export class RenderSheet {
    /**
     * @param {object} options
     * @param {number} [options.maxSize=2048]
     * @param {number} [options.buffer=5] around each texture
     * @param {number} [options.scale=1] of texture
     * @param {number} [options.resolution=1] of rendersheet
     * @param {number} [options.extrude] the edges--useful for removing gaps in sprites when tiling
     * @param {number} [options.wait=250] number of milliseconds to wait between checks for onload of addImage images before rendering
     * @param {boolean} [options.testBoxes] draw a different colored boxes behind each rendering (useful for debugging)
     * @param {number|boolean} [options.scaleMode] PIXI.settings.SCALE_MODE to set for rendersheet (use =true for PIXI.SCALE_MODES.NEAREST for pixel art)
     * @param {boolean} [options.useSimplePacker] use a stupidly simple packer instead of growing packer algorithm
     * @param {boolean|object} [options.show] set to true or a CSS object (e.g., {zIndex: 10, background: 'blue'}) to attach the final canvas to document.body--useful for debugging
     * @fire render
     */
    constructor (options) {
        options = options || {}
        this.wait = options.wait || WAIT
        this.testBoxes = options.testBoxes || false
        this.maxSize = options.maxSize || 2048
        this.buffer = options.buffer || 5
        this.scale = options.scale || 1
        this.scaleMode = options.scaleMode === true ? PIXI.SCALE_MODES.NEAREST : options.scaleMode
        this.resolution = options.resolution || 1
        this.show = options.show
        this.extrude = options.extrude
        if (this.extrude && this.buffer < 2) {
            this.buffer = 2
        }
        this.packer = options.useSimplePacker ? SimplePacker : GrowingPacker
        this.clear()
    }

    /**
     * removes all textures from rendersheets
     */
    clear () {
        this.canvases = []
        this.baseTextures = []
        this.textures = {}
    }

    /**
     * adds a canvas rendering
     * @param {string} name of rendering
     * @param {Function} draw function(context) - use the context to draw within the bounds of the measure function
     * @param {Function} measure function(context) - needs to return {width: width, height: height} for the rendering
     * @param {object} params - object to pass the draw() and measure() functions
     * @return {object} rendersheet object for texture
     */
    add (name, draw, measure, param) {
        const object = this.textures[name] = { name: name, draw: draw, measure: measure, param: param, type: CANVAS, texture: new PIXI.Texture(PIXI.Texture.EMPTY) }
        return object
    }

    /**
     * adds an image rendering
     * @param {string} name of rendering
     * @param {string} src for image
     * @return {object} rendersheet object for texture
     */
    addImage (name, src) {
        const object = this.textures[name] = { name, file: src, type: IMAGE, texture: new PIXI.Texture(PIXI.Texture.EMPTY) }
        object.image = new Image()
        object.image.onload = () => object.loaded = true
        object.image.src = src
        return object
    }

    /**
     * adds a data source (e.g., a PNG file in data format)
     * @param {object} data of rendering (not filename)
     * @param {string} [header=data:image/png;base64,] for data
     * @return {object} rendersheet object for texture
     */
    addData (name, data, header) {
        header = typeof header !== 'undefined' ? header : 'data:image/png;base64,'
        const object = this.textures[name] = { name, type: DATA, texture: new PIXI.Texture(PIXI.Texture.EMPTY) }
        object.image = new Image()
        object.image.src = header + data
        if (object.image.complete) {
            object.loaded = true
        } else {
            object.image.onload = () => object.loaded = true
        }
        return object
    }

    /**
     * attaches RenderSheet to DOM for testing
     * @param {object} styles - CSS styles to use for rendersheet
     * @private
     */
    showCanvases () {
        if (!this.divCanvases) {
            this.divCanvases = document.createElement('div')
            document.body.appendChild(this.divCanvases)
        } else {
            while (this.divCanvases.hasChildNodes()) {
                this.divCanvases.removeChild(this.divCanvases.lastChild)
            }
        }
        const percent = 1 / this.canvases.length
        for (let i = 0; i < this.canvases.length; i++) {
            const canvas = this.canvases[i]
            const style = canvas.style
            style.position = 'fixed'
            style.left = '0px'
            style.top = i * Math.round(percent * 100) + '%'
            style.width = 'auto'
            style.height = Math.round(percent * 100) + '%'
            style.zIndex = 1000
            if (this.scaleMode === PIXI.SCALE_MODES.NEAREST) {
                style.imageRendering = 'pixelated'
            }
            style.background = this.randomColor()
            if (typeof this.show === 'object') {
                for (let key in this.show) {
                    style[key] = this.show[key]
                }
            }
            this.divCanvases.appendChild(canvas)
        }
    }

    /**
     * tests whether a texture exists
     * @param {string} name of texture
     * @return {boolean}
     */
    exists (name) {
        return !!this.textures[name]
    }

    /**
     * @param {string} name of texture
     * @return {(PIXI.Texture|null)}
     */
    getTexture (name) {
        const texture = this.textures[name]
        if (texture) {
            return texture.texture
        } else {
            console.warn('yy-rendersheet: texture ' + name + ' not found in spritesheet.')
            return null
        }
    }

    /**
     * returns a PIXI.Sprite (with anchor set to 0.5, because that's where it should be)
     * @param {string} name of texture
     * @return {PIXI.Sprite}
     */
    getSprite (name, anchorValue = 0.5) {
        const texture = this.getTexture(name)
        if (texture) {
            const sprite = new PIXI.Sprite(texture)
            sprite.anchor.set(anchorValue)
            return sprite
        } else {
            return null
        }
    }

    /**
     * alias for getSprite()
     * @param {string} name of texture
     * @return {PIXI.Sprite}
     */
    get (name) {
        return this.getSprite(name)
    }

    /**
     * @return {number} amount of textures in this rendersheet
     */
    entries () {
        return Object.keys(this.textures).length
    }

    /**
     * prints statistics of canvases to console.log
     */
    debug () {
        for (let i = 0; i < this.canvases.length; i++) {
            const canvas = this.canvases[i]
            console.log('yy-rendersheet: Sheet #' + (i + 1) + ' | size: ' + canvas.width + 'x' + canvas.height + ' | resolution: ' + this.resolution)
        }
    }

    /**
     * find the index of the texture based on the texture object
     * @param {number} find this indexed texture
     * @returns {PIXI.Texture}
     */
    getIndex (find) {
        let i = 0
        for (let key in this.textures) {
            if (i === find) {
                return this.textures[key].texture
            }
            i++
        }
        return null
    }

    /**
     * checks if all textures are loaded
     * @return {boolean}
     */
    checkLoaded () {
        for (let key in this.textures) {
            const current = this.textures[key]
            if ((current.type === IMAGE || current.type === DATA) && !current.loaded) {
                return false
            }
        }
        return true
    }

    /**
     * create (or refresh) the rendersheet (supports async instead of callback)
     * @param {boolean} skipTextures - don't create PIXI.BaseTextures and PIXI.Textures (useful for generating external spritesheets)
     */
    asyncRender (skipTextures) {
        return new Promise(resolve => {
            this.render(resolve, skipTextures)
        })
    }

    /**
     * create (or refresh) the rendersheet
     * @param {boolean} skipTextures - don't create PIXI.BaseTextures and PIXI.Textures (useful for generating external spritesheets)
     * @param {function} callback - convenience function that calls RenderSheet.once('render', callback)
     * @param {function} callbackThisArag - call target
     */
    render (callback = null, callbackThisArag = null, skipTextures = null) {
        if (callback) {
            // this.once('render', callback)
            core.listen('render', callback, callbackThisArag, true);
        }
        if (!Object.keys(this.textures).length) {
            // this.emit('render')
            core.dispatch('render');
            return
        }
        if (!this.checkLoaded()) {
            setTimeout(() => this.render(), this.wait)
            return
        }
        this.canvases = []
        this.sorted = []

        this.measure()
        this.sort()
        this.pack()
        this.draw()
        if (!skipTextures) {
            this.createBaseTextures()

            for (let key in this.textures) {
                const current = this.textures[key]
                current.texture.baseTexture = this.baseTextures[current.canvas]
                current.texture.frame = new PIXI.Rectangle(current.x, current.y, current.width, current.height)
                current.texture.update()
            }
        }
        if (this.show) {
            this.showCanvases()
        }
        core.dispatch('render')
    }

    /**
     * measures canvas renderings
     * @private
     */
    measure () {
        const c = document.createElement('canvas')
        c.width = this.maxSize
        c.height = this.maxSize
        const context = c.getContext('2d')
        const multiplier = Math.ceil(this.scale * this.resolution)
        for (let key in this.textures) {
            const texture = this.textures[key]
            switch (texture.type) {
                case CANVAS:
                    const size = texture.measure(context, texture.param, c)
                    texture.width = Math.ceil(size.width * multiplier)
                    texture.height = Math.ceil(size.height * multiplier)
                    break

                case IMAGE: case DATA:
                    texture.width = Math.ceil(texture.image.width * multiplier)
                    texture.height = Math.ceil(texture.image.height * multiplier)
                    break
            }
            this.sorted.push(texture)
        }
    }

    /**
     * sort textures by largest dimension
     * @private
     */
    sort () {
        this.sorted.sort(
            function (a, b) {
                let aSize = Math.max(a.height, a.width)
                let bSize = Math.max(b.height, b.width)
                if (aSize === bSize) {
                    aSize = Math.min(a.height, a.width)
                    bSize = Math.max(b.height, b.width)
                }
                return bSize - aSize
            }
        )
    }

    /**
     * create square canvas
     * @param {number} [size=this.maxSize]
     * @private
     */
    createCanvas (size) {
        const canvas = document.createElement('canvas')
        canvas.width = canvas.height = size || this.maxSize
        this.canvases.push(canvas)
    }

    /**
     * returns a random rgb color
     * @private
     */
    randomColor () {
        function r () {
            return Math.floor(Math.random() * 255)
        }
        return 'rgba(' + r() + ',' + r() + ',' + r() + ', 0.2)'
    }

    /**
     * draw renderings to rendertexture
     * @private
     */
    draw () {
        let current, context
        const multiplier = Math.ceil(this.scale * this.resolution)
        for (let key in this.textures) {
            const texture = this.textures[key]
            if (texture.canvas !== current) {
                if (typeof current !== 'undefined') {
                    context.restore()
                }
                current = texture.canvas
                context = this.canvases[current].getContext('2d')
                context.save()
                context.scale(multiplier, multiplier)
            }
            context.save()
            context.translate(Math.ceil(texture.x / multiplier), Math.ceil(texture.y / multiplier))
            if (this.testBoxes) {
                context.fillStyle = this.randomColor()
                context.fillRect(0, 0, Math.ceil(texture.width / multiplier), Math.ceil(texture.height / multiplier))
            }
            switch (texture.type) {
                case CANVAS:
                    texture.draw(context, texture.param, this.canvases[current])
                    break

                case IMAGE: case DATA:
                    context.drawImage(texture.image, 0, 0)
                    break
            }
            if (this.extrude) {
                this.extrudeEntry(texture, context, current)
            }
            context.restore()
        }
        context.restore()
    }

    /**
     * extrude pixels for entry
     * @param {object} texture
     * @param {CanvasRenderingContext2D} context
     * @private
     */
    extrudeEntry (texture, context, current) {
        function get (x, y) {
            const entry = (x + y * texture.width) * 4
            const d = data.data
            return 'rgba(' + d[entry] + ',' + d[entry + 1] + ',' + d[entry + 2] + ',' + (d[entry + 3] / 0xff) + ')'
        }

        const canvas = this.canvases[current]
        const data = context.getImageData(texture.x, texture.y, texture.width, texture.height)
        if (texture.x !== 0) {
            for (let y = 0; y < texture.height; y++) {
                context.fillStyle = get(0, y)
                context.fillRect(-1, y, 1, 1)
            }
            if (texture.y !== 0) {
                context.fillStyle = get(0, 0)
                context.fillRect(-1, -1, 1, 1)
            }
        }
        if (texture.x + texture.width !== canvas.width - 1) {
            for (let y = 0; y < texture.height; y++) {
                context.fillStyle = get(texture.width - 1, y)
                context.fillRect(texture.width, y, 1, 1)
            }
            if (texture.y + texture.height !== canvas.height - 1) {
                context.fillStyle = get(texture.width - 1, texture.height - 1)
                context.fillRect(texture.width, texture.height, 1, 1)
            }
        }
        if (texture.y !== 0) {
            for (let x = 0; x < texture.width; x++) {
                context.fillStyle = get(x, 0)
                context.fillRect(x, -1, 1, 1)
            }
        }
        if (texture.y + texture.height !== canvas.height - 1) {
            for (let x = 0; x < texture.width; x++) {
                context.fillStyle = get(x, texture.height - 1)
                context.fillRect(x, texture.height, 1, 1)
            }
        }
    }

    /**
     * @private
     */
    createBaseTextures () {
        while (this.baseTextures.length) {
            this.baseTextures.pop().destroy()
        }
        for (let i = 0; i < this.canvases.length; i++) {
            const from = PIXI.BaseTexture.fromCanvas || PIXI.BaseTexture.from
            const base = from(this.canvases[i])
            base.scaleMode = this.scaleMode
            this.baseTextures.push(base)
        }
    }

    /**
     * pack textures after measurement
     * @private
     */
    pack () {
        const packers = [new this.packer(this.maxSize, this.sorted[0], this.buffer)]
        for (let i = 0; i < this.sorted.length; i++) {
            const block = this.sorted[i]
            let packed = false
            for (var j = 0; j < packers.length; j++) {
                if (packers[j].add(block, j)) {
                    block.canvas = j
                    packed = true
                    break
                }
            }
            if (!packed) {
                packers.push(new this.packer(this.maxSize, block, this.buffer))
                if (!packers[j].add(block, j)) {
                    console.warn('yy-rendersheet: ' + block.name + ' is too big for the spritesheet.')
                    return
                } else {
                    block.canvas = j
                }
            }
        }

        for (let i = 0; i < packers.length; i++) {
            const size = packers[i].finish(this.maxSize)
            this.createCanvas(size)
        }
    }

    /**
     * Changes the drawing function of a texture
     * NOTE: this only works if the texture remains the same size; use Sheet.render() to resize the texture
     * @param {string} name
     * @param {function} draw
     */
    changeDraw (name, draw) {
        const texture = this.textures[name]
        if (texture.type !== CANVAS) {
            console.warn('yy-sheet.changeTextureDraw only works with type: CANVAS.')
            return
        }
        texture.draw = draw
        const context = this.canvases[texture.canvas].getContext('2d')
        const multiplier = this.scale * this.resolution
        context.save()
        context.scale(multiplier, multiplier)
        context.translate(texture.x / multiplier, texture.y / multiplier)
        texture.draw(context, texture.param)
        context.restore()
        texture.texture.update()
    }
}

