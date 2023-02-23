export class Rectangle {
  constructor(x, y, width, height, colors) {
    this.x1 = x;
    this.x2 = x + width;
    this.y1 = y;
    this.y2 = y + height;

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

  updateVertex(x, y) {
    this.data[6] = x
    this.data[18] = x
    this.data[30] = x
    this.data[13] = y
    this.data[25] = y
    this.data[31] = y
  }

  render(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}