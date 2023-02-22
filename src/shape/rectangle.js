export class Rectangle {
  constructor(x, y, width, height) {
    this.x1 = x;
    this.x2 = x + width;
    this.y1 = y;
    this.y2 = y + height;

    this.vertices = [
      this.x1, this.y1, // top left
      this.x2, this.y1, // top right
      this.x1, this.y2, // bottom left
      this.x2, this.y1, // top right
      this.x1, this.y2, // bottom left
      this.x2, this.y2 // bottom right
    ]

    this.colors = [
      Math.random(), Math.random(), Math.random(), 1,
      0.9, 0.7, 0.1, 1,
      0.1, 0.3, 0.5, 1,
      0.9, 0.7, 0.1, 1,
      0.1, 0.3, 0.5, 1,
      Math.random(), Math.random(), Math.random(), 1
    ];
  }

  render(gl, program) {
    // use initBuffers to draw
    const buffers = initBuffers(gl, program, this.vertices, this.colors);
    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    window.requestAnimFrame(() => {
      this.render(gl, program);
    });
  }
}