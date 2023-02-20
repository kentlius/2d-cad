// class Creator
// 1. define canvas
// 2. define gl
// 3. contains all shapes
// 4. records shapes' rendering order

class Creator {
    constructor() {
        // initialize canvas, gl, shapes' containers, and shapes' rendering rder
        this.canvas;
        this.gl;
        this.renderOrder = [];  // 0: line, 1: square, 2: rectangle, 3: polygon
        this.lines = [];
        this.squares = [];
        this.rectangles = [];
        this.polygons = [];
        this.color = new Color(0,0,0);
    }

    // clear canvas
    clearCanvas() {
        // clear all shapes' buffers
        this.renderOrder = [];
        this.lines = [];
        this.squares = [];
        this.rectangles = [];
        this.polygons = [];

        // 'clear' canvas to azure color (the early color of the canvas)
        this.gl.clearColor(240/255, 255/255, 255/255, 1.0);
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    }

    // render all shapes to canvas
    renderCanvas() {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        
        // initialize pointer for each shapes' buffers
        let lineP = 0, squareP = 0, rectP = 0, polyP = 0;

        // render shapes in rendering order with forEach
        this.renderOrder.forEach((shape) => {
            switch(shape) {
                case 1:
                    this.lines[lineP].render(this);
                    lineP++;
                case 2:
                    this.squares[squareP].render(this);
                    squareP++;
                case 3:
                    this.rectangles[rectP].render(this);
                    rectP++;
                case 4:
                    this.polygons[polyP].render(this);
                    polyP++;
            }
        });
        
    }
}