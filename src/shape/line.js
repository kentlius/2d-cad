export class Line {
  constructor(x1, y1, x2, y2, colors) {
    // prettier-ignore
    this.data = [
      x1, y1, colors[0], colors[1], colors[2], colors[3], // start point
      x2, y2, colors[4], colors[5], colors[6], colors[7]  // end point
    ]
  }

  updateVertex(x, y) {
    this.data[6] = x;
    this.data[7] = y;
  }

  updateColor(r,g,b,a) {
    this.data[8] = r;
    this.data[9] = g;
    this.data[10] = b;
    this.data[11] = a;
  }
  
  render(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, 2);
  }
}
