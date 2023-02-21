class Rectangle {
  constructor(x, y, width, height, color) {
    this.x1 = x;
    this.x2 = x + width;
    this.y1 = y;
    this.y2 = y + height;

    this.vertices = [
      x1, y1, // top left
      x2, y1, // top right
      x1, y2, // bottom left
      x2, y1, // top right
      x1, y2, // bottom left
      x2, y2 // bottom right
    ]

    this.color = [
      Math.random(), Math.random(), Math.random(), 1,
      0.9, 0.7, 0.1, 1,
      0.1, 0.3, 0.5, 1,
      0.9, 0.7, 0.1, 1,
      0.1, 0.3, 0.5, 1,
      Math.random(), Math.random(), Math.random(), 1
    ];
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