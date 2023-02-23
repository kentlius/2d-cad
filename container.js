export class Container {
  constructor() {
    this.renderOrder = []; // 1: line, 2: square, 3: rectangle, 4: polygon
    this.lines = [];
    this.squares = [];
    this.rectangles = [];
    this.polygons = [];
  }

  clear() {
    this.renderOrder = [];
    this.lines = [];
    this.squares = [];
    this.rectangles = [];
    this.polygons = [];
  }
}