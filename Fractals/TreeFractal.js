/**
* TypeScript Tree Fractal
* Author: Donald Jones
* Date: May 28, 2014
*/
/**
* Contains properties of a block of pixels to be rendered.
*/
var Block = (function () {
    function Block(color, thickness) {
        this.color = color;
        this.thickness = thickness;
    }
    return Block;
})();

/**
* Contains a two dimensional array of Blocks and methods to render/manipulate.
*/
var BlockMap = (function () {
    /**
    * @param width The width of the BlockMap.
    * @param height The height of the BlockMap.
    */
    function BlockMap(width, height) {
        var _this = this;
        /*
        * Renders the BlockMap to the provided cavnas context.
        *
        * @param ctx HTML5 canvas 2d context;
        */
        this.render = function (ctx) {
            for (var i = 0; i < _this.map.length; i++) {
                for (var j = 0; j < _this.map[i].length; j++) {
                    if (_this.map[i][j] && _this.map[i][j].color) {
                        var thickness = _this.map[i][j].thickness;
                        ctx.fillStyle = _this.map[i][j].color;
                        ctx.fillRect(i, j, thickness, thickness);
                    }
                }
            }
        };
        this.map = new Array(width);
        for (var i = 0; i < this.map.length; i++) {
            this.map[i] = new Array(height);
        }
    }
    /**
    * Sets the properties for the block at the given coordinates.
    *
    * @param x The X coordinate.
    * @param y The Y coordinate.
    * @param thickness The hhickness of the current block.
    * @param color The color of the block.
    */
    BlockMap.prototype.setBlock = function (x, y, thickness, color) {
        if (typeof color === "undefined") { color = "#000000"; }
        if (x < this.map.length) {
            if (this.map[x]) {
                if (y < this.map[x].length) {
                    this.map[x][y] = new Block(color, thickness);
                }
            }
        }
    };

    /**
    * Gets the Block at the provided coordinates.
    *
    * @param x The X coordinate.
    * @param y The Y coordinate.
    */
    BlockMap.prototype.getBlock = function (x, y) {
        if (x <= this.map.length) {
            if (y <= this.map[x].length) {
                return this.map[x][y];
            }
            throw new RangeError("y is out of bounds");
        }
        throw new RangeError("x is out of bounds");
    };

    /*
    * A TypeScript implementation of Bresenham's line algorithm.
    *
    * @param x0 The X coordinate from the first point.
    * @param x1 The X coordinate from the second point.
    * @param y0 The Y coordinate from the first point.
    * @param y1 The Y coordinate from the second point.
    * @param thickness The hhickness of the current line.
    * @param color The color of the line.
    */
    BlockMap.prototype.drawLine = function (x0, x1, y0, y1, thickness, color) {
        if (typeof color === "undefined") { color = "#000000"; }
        var dx = Math.abs(x1 - x0);
        var sx = (x0 < x1) ? 1 : -1;
        var dy = Math.abs(y1 - y0);
        var sy = (y0 < y1) ? 1 : -1;
        var err = ((dx > dy) ? dx : -dy) / 2;

        while (!(x0 === x1 && y0 === y1)) {
            this.setBlock(x0, y0, thickness, color);
            var e2 = err;
            if (e2 > -dx) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dy) {
                err += dx;
                y0 += sy;
            }
        }
    };
    return BlockMap;
})();

/*
* Contains properties and methods for rendering a simple Fractal Tree.
*/
var FractalTree = (function () {
    /*
    * @param depth The number of recursive steps to process.
    * @param map The BlockMap to draw the Fractal Tree onto.
    */
    function FractalTree(depth, map) {
        this.deg2Rad = Math.PI / 180.0;
        this.map = map;
        this.drawTree(450, 700, -90, depth);
    }
    /*
    * Recursive function that draws the fractal tree.
    *
    * @param x1 Starting X coordinate for the tree.
    * @param y1 Starting Y coordinate for the tree.
    * @param angle Angle to draw the tree.
    * @param depth Number of recrusive steps to process.
    */
    FractalTree.prototype.drawTree = function (x1, y1, angle, depth) {
        if (depth > 0) {
            var x2 = x1 + (Math.cos(angle * this.deg2Rad) * depth * 10);
            var y2 = y1 + (Math.sin(angle * this.deg2Rad) * depth * 10);
            var color = "#000000";
            if (depth < 3) {
                color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
            }
            this.map.drawLine(Math.round(x1), Math.round(x2), Math.round(y1), Math.round(y2), depth, color);
            this.drawTree(x2, y2, angle - this.random(20, 30), depth - 1);
            this.drawTree(x2, y2, angle + this.random(20, 30), depth - 1);
        }
    };

    /*
    * Returns a random number within the provided range.
    *
    * @param min Minimum number that can be returned.
    * @param max Maximum number that can be returned.
    */
    FractalTree.prototype.random = function (min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };
    return FractalTree;
})();

/*
* Initializes the environment to render a tree.
*/
function exec() {
    var flakeMap = new BlockMap(900, 700);
    var tree = new FractalTree(10, flakeMap);

    // Render the tree to a hidden canvas.
    var canvas = document.getElementById("mapCanvas");
    var ctx = canvas.getContext("2d");
    flakeMap.render(ctx);
    ctx.font = "bold 9px Arial";
    ctx.fillText("donaldjones.us", canvas.width - 75, canvas.height - 10);

    // Copy the canvas data to an img tag so the user may save it.
    var displayImage = document.getElementById("imgCanvas");
    displayImage.src = canvas.toDataURL();
}

exec();
//# sourceMappingURL=TreeFractal.js.map
