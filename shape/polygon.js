export class Polygon {
    constructor() {
      this.vertices = [];
    }

    addVertex(x, y, colors) {
        console.log(x,y)
        this.vertices.push(x, y, colors[0], colors[1], colors[2], colors[3]);
    }

    render(gl) {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      if (this.vertices.length > 12) {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 6);
      }
      else if (this.vertices.length == 12) {
        gl.drawArrays(gl.LINES, 0, this.vertices.length / 6);
      }
      else{
        gl.drawArrays(gl.POINTS, 0, this.vertices.length / 6);
      }
    }
  }