export class Container {
  constructor() {
    this.renderOrder = []; // 0: line, 1: square, 2: rectangle, 3: polygon
    this.lines = [];
    this.squares = [];
    this.rectangles = [];
    this.polygons = [];
  }
}