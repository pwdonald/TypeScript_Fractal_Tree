/**
 * TypeScript Tree Fractal
 * Author: Donald Jones
 * Date: May 28, 2014
 */


/** 
 * Contains properties of a block of pixels to be rendered.
 */
class Block {
    color: string;
    thickness: number;

    constructor(color: string, thickness: number) {
        this.color = color;
        this.thickness = thickness;
    }
}

/**
 * Contains a two dimensional array of Blocks and methods to render/manipulate.
 */
class BlockMap {
    private map: Array<Array<Block>>;

    /**
     * @param width The width of the BlockMap.
     * @param height The height of the BlockMap.
     */
    constructor(width: number, height: number) {
        this.map = new Array<Array<Block>>(width);
        for (var i: number = 0; i < this.map.length; i++) {
            this.map[i] = new Array<Block>(height);
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
    setBlock(x: number, y: number, thickness: number, color: string = "#000000") {
        if (x < this.map.length) {
            if (this.map[x]) {
                if (y < this.map[x].length) {
                    this.map[x][y] = new Block(color, thickness);
                }   
            }
        }
    }

    /**
     * Gets the Block at the provided coordinates.
     *
     * @param x The X coordinate.
     * @param y The Y coordinate.
     */
    getBlock(x: number, y: number):Block {
        if (x <= this.map.length) {
            if (y <= this.map[x].length) {
                return this.map[x][y];
            }
            throw new RangeError("y is out of bounds");
        }
        throw new RangeError("x is out of bounds");
    }

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
    drawLine(x0: number, x1: number, y0: number, y1: number, thickness:number, color:string = "#000000") {
        var dx:number = Math.abs(x1 - x0);
        var sx:number = (x0 < x1) ? 1 : -1;
        var dy:number = Math.abs(y1 - y0);
        var sy:number = (y0 < y1) ? 1 : -1;
        var err:number = ((dx > dy) ? dx : -dy) / 2;

        while (!(x0 === x1 && y0 === y1)) {
            this.setBlock(x0, y0, thickness, color);
            var e2:number = err;
            if (e2 > -dx) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dy) {
                err += dx;
                y0 += sy;
            }
        }

    }

    /*
     * Renders the BlockMap to the provided cavnas context.
     * 
     * @param ctx HTML5 canvas 2d context;
     */
    render = (ctx:CanvasRenderingContext2D) => {
        for (var i: number = 0; i < this.map.length; i++) {
            for (var j: number = 0; j < this.map[i].length; j++) {
                if (this.map[i][j] && this.map[i][j].color) {
                    var thickness:number = this.map[i][j].thickness;
                    ctx.fillStyle = this.map[i][j].color;
                    ctx.fillRect(i, j,thickness,thickness);
                }
            }
        }
    }

}

/*
 * Contains properties and methods for rendering a simple Fractal Tree. 
 */
class FractalTree {
    private deg2Rad: number = Math.PI / 180.0;
    private map: BlockMap;
    
    /*
     * @param depth The number of recursive steps to process.
     * @param map The BlockMap to draw the Fractal Tree onto. 
     */
    constructor(depth: number, map: BlockMap) {
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
    drawTree(x1:number, y1:number, angle:number, depth:number) {
        if (depth > 0) {
            var x2:number = x1 + (Math.cos(angle * this.deg2Rad) * depth * 10);
            var y2: number = y1 + (Math.sin(angle * this.deg2Rad) * depth * 10);
            var color: string = "#000000";
            if (depth < 3) {
                color = '#' + (Math.random() * 0xFFFFFF << 0).toString(16);
            }
            this.map.drawLine(Math.round(x1), Math.round(x2), Math.round(y1), Math.round(y2), depth, color);
            this.drawTree(x2, y2, angle - this.random(20,30), depth - 1);
            this.drawTree(x2, y2, angle + this.random(20, 30), depth - 1);
        } 
    }

    /*
     * Returns a random number within the provided range.
     * 
     * @param min Minimum number that can be returned.
     * @param max Maximum number that can be returned. 
     */
    random(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

/*
 * Initializes the environment to render a tree.
 */
function exec() {
    var flakeMap = new BlockMap(900, 700);
    var tree = new FractalTree(10, flakeMap);

    // Render the tree to a hidden canvas.
    var canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("mapCanvas");
    var ctx = canvas.getContext("2d");
    flakeMap.render(ctx);
    ctx.font = "bold 9px Arial";
    ctx.fillText("donaldjones.us", canvas.width - 75, canvas.height - 10);

    // Copy the canvas data to an img tag so the user may save it.
    var displayImage: HTMLImageElement = <HTMLImageElement>document.getElementById("imgCanvas");
    displayImage.src = canvas.toDataURL();
}


exec();