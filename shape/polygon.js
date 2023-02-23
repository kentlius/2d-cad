export class Polygon {
    constructor() {
      this.vertices = [];
    }

    addVertex(x, y, colors) {
        console.log(x,y)
        this.vertices.push(x, y, colors[0], colors[1], colors[2], colors[3]);
    }

  
    render(gl) {
      console.log(this.vertices)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLE_FAN, 0, 6);
    }
  }