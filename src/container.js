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

    this.vertices = [
      this.x1, this.y1,
      this.x2, this.y2
    ];

    this.colors = colors;
  }

  render(gl, program) {
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const positionBuffer = initBuffer(gl, this.vertices);
    initAttribute(gl, positionAttributeLocation, positionBuffer, 2);
    
    var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
    const colorBuffer = initBuffer(gl, this.colors);
    initAttribute(gl, colorAttributeLocation, colorBuffer, 4);

    gl.drawArrays(gl.LINES, 0, 2);
  }
}