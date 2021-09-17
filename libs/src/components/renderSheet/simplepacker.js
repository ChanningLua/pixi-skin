var SimplePacker = (function () {
    function SimplePacker(max, first, buffer) {
        this.max = max;
        this.buffer = buffer;
        this.list = [];
        this.x = 0;
        this.y = 0;
        this.largest = 0;
    }
    SimplePacker.prototype.finish = function (maxSize) {
        var n = 1, next;
        var squared = [];
        do {
            next = Math.pow(2, n++);
            squared.push(next);
        } while (next <= maxSize);
        var max = Math.max(this.x - this.buffer, this.y - this.buffer);
        for (var i = squared.length - 1; i >= 0; i--) {
            if (squared[i] < max) {
                return squared[i + 1];
            }
        }
    };
    SimplePacker.prototype.add = function (block, canvasNumber) {
        if (this.x + block.width < this.max) {
            if (this.y + block.height < this.max) {
                block.x = this.x;
                block.y = this.y;
                block.canvas = canvasNumber;
                this.largest = block.height > this.largest ? block.height : this.largest;
                this.x += block.width + this.buffer;
                return true;
            }
            else {
                return false;
            }
        }
        else {
            this.y += this.largest + this.buffer;
            if (this.y > this.max) {
                return false;
            }
            this.x = 0;
            this.largest = 0;
            return this.add(block, canvasNumber);
        }
    };
    return SimplePacker;
}());
export { SimplePacker };
//# sourceMappingURL=simplepacker.js.map