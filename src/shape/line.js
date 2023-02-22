// Line constructor

export class Line {

    //  construct a Line object
    constructor(x1,y1,x2,y2,color) {
        this.x1 = x1;
        this.y1 = y1;
        this.x2 = x2;
        this.y2 = y2;
        this.color = color;
    }

    // set up the Line
    set(canv) {
        // set Line's position to buffer
        canv.gl.bufferData(
            canv.gl.ARRAY_BUFFER,
            new Float32Array([
                this.x1, this.y1, // start point
                this.x2, this.y2, // end point
            ]),
            gl.STATIC_DRAW
        );
        
        // set Line's color to buffer
        canv.gl.uniform4f(
            canv.colorUniformLocation,  // color uniform location
            this.color[0] /255,         // R
            this.color[1] /255,         // G
            this.color[2] /255,         // B
            1                           // A
        );
    }

    // render the Line
    render(canv) {
        // set up the Line
        this.set(canv);

        // draw the Line
        canv.gl.drawArrays(
            canv.gl.LINES,  // draw mode
            0,              // start index on the buffer
            2               // number of vertices
        );
    }
}