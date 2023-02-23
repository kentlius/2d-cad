export class Container {
  constructor() {
    this.renderOrder = []; // 0: line, 1: square, 2: rectangle, 3: polygon
    this.lines = [];
    this.squares = [];
    this.rectangles = [];
    this.polygons = [];
  }
}

export class Line {
  constructor(x1, y1, x2, y2, colors) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;

    this.data = [
      this.x1, this.y1, colors[0], colors[1], colors[2], colors[3],
      this.x2, this.y2, colors[4], colors[5], colors[6], colors[7]
    ]

  }

  render(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);

    gl.drawArrays(gl.LINES, 0, 2);
  }
}