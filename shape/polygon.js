export class Polygon {
    constructor() {
      this.vertices = []
      this.color = [
        Math.random(), Math.random(), Math.random(), 1,
        0.9, 0.7, 0.1, 1,
        0.1, 0.3, 0.5, 1,
        0.9, 0.7, 0.1, 1,
        0.1, 0.3, 0.5, 1,
        Math.random(), Math.random(), Math.random(), 1
      ];
    }

    addVertex(x, y) {
        this.vertices.push(x, y);
    }

  
    render(gl) {
      const rectBuffer = initBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.vertices));
      gl.bindBuffer(gl.ARRAY_BUFFER, rectBuffer);
      initAttribute(gl, rectBuffer, 2);
  
      const colorBuffer = initBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(this.color));
      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      initAttribute(gl, colorBuffer, 4);
  
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }