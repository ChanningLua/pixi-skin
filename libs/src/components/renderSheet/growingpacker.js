var GrowingPacker = (function () {
    function GrowingPacker(max, first, buffer) {
        this.max = max;
        this.buffer = buffer;
        this.root = { x: 0, y: 0, w: first.width + buffer, h: first.height + buffer };
    }
    GrowingPacker.prototype.finish = function (maxSize) {
        var n = 1, next;
        var squared = [];
        do {
            next = Math.pow(2, n++);
            squared.push(next);
        } while (next <= maxSize);
        var max = Math.max(this.root.w, this.root.h);
        for (var i = squared.length - 1; i >= 0; i--) {
            if (squared[i] < max) {
                return squared[i + 1];
            }
        }
    };
    GrowingPacker.prototype.add = function (block, canvasNumber) {
        var result, node;
        if (node = this.findNode(this.root, block.width + this.buffer, block.height + this.buffer)) {
            result = this.splitNode(node, block.width + this.buffer, block.height + this.buffer);
        }
        else {
            result = this.growNode(block.width + this.buffer, block.height + this.buffer);
            if (!result) {
                return false;
            }
        }
        block.x = result.x;
        block.y = result.y;
        block.canvas = canvasNumber;
        return true;
    };
    GrowingPacker.prototype.findNode = function (root, w, h) {
        if (root.used) {
            return this.findNode(root.right, w, h) || this.findNode(root.down, w, h);
        }
        else if ((w <= root.w) && (h <= root.h)) {
            return root;
        }
        else {
            return null;
        }
    };
    GrowingPacker.prototype.splitNode = function (node, w, h) {
        node.used = true;
        node.down = { x: node.x, y: node.y + h, w: node.w, h: node.h - h };
        node.right = { x: node.x + w, y: node.y, w: node.w - w, h: h };
        return node;
    };
    GrowingPacker.prototype.growNode = function (w, h) {
        var canGrowDown = (w <= this.root.w);
        var canGrowRight = (h <= this.root.h);
        var shouldGrowRight = canGrowRight && (this.root.h >= (this.root.w + w));
        var shouldGrowDown = canGrowDown && (this.root.w >= (this.root.h + h));
        if (shouldGrowRight) {
            return this.growRight(w, h);
        }
        else if (shouldGrowDown) {
            return this.growDown(w, h);
        }
        else if (canGrowRight) {
            return this.growRight(w, h);
        }
        else if (canGrowDown) {
            return this.growDown(w, h);
        }
        else {
            return null;
        }
    };
    GrowingPacker.prototype.growRight = function (w, h) {
        if (this.root.w + w >= this.max) {
            return null;
        }
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w + w,
            h: this.root.h,
            down: this.root,
            right: { x: this.root.w, y: 0, w: w, h: this.root.h }
        };
        var node;
        if (node = this.findNode(this.root, w, h)) {
            return this.splitNode(node, w, h);
        }
        else {
            return null;
        }
    };
    GrowingPacker.prototype.growDown = function (w, h) {
        if (this.root.h + h >= this.max) {
            return null;
        }
        this.root = {
            used: true,
            x: 0,
            y: 0,
            w: this.root.w,
            h: this.root.h + h,
            down: { x: 0, y: this.root.h, w: this.root.w, h: h },
            right: this.root
        };
        var node;
        if (node = this.findNode(this.root, w, h)) {
            return this.splitNode(node, w, h);
        }
        else {
            return null;
        }
    };
    return GrowingPacker;
}());
export { GrowingPacker };
//# sourceMappingURL=growingpacker.js.map