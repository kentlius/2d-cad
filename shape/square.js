export class Square {
    constructor(x, y, size, colors) {
      this.x1 = x;
      this.x2 = x + size;
      this.y1 = y;
      this.y2 = y + size;
  
      // prettier-ignore
      this.data = [
        this.x1, this.y1, colors[0], colors[1], colors[2], colors[3], // top left
        this.x2, this.y1, colors[4], colors[5], colors[6], colors[7], /// top right
        this.x1, this.y2, colors[8], colors[9], colors[10], colors[11], /// bottom left
        this.x2, this.y1, colors[4], colors[5], colors[6], colors[7], /// top right
        this.x1, this.y2, colors[8], colors[9], colors[10], colors[11], /// bottom left
        this.x2, this.y2, colors[12], colors[13], colors[14], colors[15], /// bottom right
      ]
    }
  
    render(gl) {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
  }

// TODO
// 1. updateVertex
// 2. touchVertex
// 3. updateColor