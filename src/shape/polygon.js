export class Polygon {
  constructor() {
    this.data = [];
    this.acceptedRadius = 0.1;
  }

  isVertexAlreadyExist(x, y) {
    for (let i = 0; i < this.data.length; i += 6) {
      if (this.data[i] == x && this.data[i] == y) {
        return true;
      }
    }
    return false
  }

  addVertex(x, y, colors) {
    if (!this.isVertexAlreadyExist(x, y)) {
    this.data.push(x, y, colors[0], colors[1], colors[2], colors[3]);
    }
  }

  updateVertex(idx,x,y){
    this.data[idx] = x;
    this.data[idx+1] = y;
  }

  deleteLast(){
    this.data.splice(this.data.length - 6, 6);  
  }

  removeVertex(n){
    this.data.splice(n, 6);
  }
  
  touchVertex(x, y){
    for(let i = 0; i < this.data.length; i += 6){
      if(Math.abs(this.data[i] - x) < this.acceptedRadius && Math.abs(this.data[i+1] - y) < this.acceptedRadius){
        return i;
      }
    }
    return -1;
  }

  updateColor(i, color){
    this.data[i+2] = color[0];
    this.data[i+3] = color[1];
    this.data[i+4] = color[2];
    this.data[i+5] = color[3];
  }

  orientation(a, b, c) { 
    // Untuk mementukan arah sudut yang dibentuk oleh titik p, q, dan r.
    // referensi: https://www.geeksforgeeks.org/check-if-two-given-line-segments-intersect/amp/
    // Lebih besar hasilnya, maka sudut yang dibentuk semakin berlawanan arah jarum jam

    return (b.y - a.y) * (c.x - b.x) - (b.x - a.x) * (c.y - b.y); 
  } 

  convexHull() {
    // Menggunakan algoritma Jarvis March
    // referensi: https://www.geeksforgeeks.org/convex-hull-using-jarvis-algorithm-or-wrapping/amp/
    
    let n = this.data.length / 6;
    let hullVertices = []
    let orientation = 0
    let tempOrientation = 0

    if (n <= 3) {
      return this.data;
    } else {
      // Mencari titik dengan nilai x paling kiri
      let leftMost = 0;
      for (let i = 1; i < n; i++) {
        if (this.data[i * 6] < this.data[leftMost * 6]) {
          leftMost = i;
        }
      } 

      let p = leftMost;
      let q = 0;
      do {
        // Mencari titik yang paling berorientasi searah jarum jam
        hullVertices.push(this.data[p * 6], this.data[p * 6 + 1], this.data[p * 6 + 2], this.data[p * 6 + 3], this.data[p * 6 + 4], this.data[p * 6 + 5]);
        q = (p+1) % n;
        for (let i = 0; i < n; i++) {
          tempOrientation = this.orientation({x: this.data[p * 6], y: this.data[p * 6 + 1]}, {x: this.data[i * 6], y: this.data[i * 6 + 1]}, {x: this.data[q * 6], y: this.data[q * 6 + 1]})
          if (tempOrientation < 0) {
            q = i;
          }
        }
        p = q;
      } while (p != leftMost);
    }
    return hullVertices
  }

  touch(x, y) {
    let n = this.data.length / 6;
    let hullVertices = this.convexHull();
    let hullVerticesLength = hullVertices.length / 6;

    if (n <= 3) {
      for (let i = 0; i < n; i++) {
        if (Math.abs(this.data[i * 6] - x) < this.acceptedRadius && Math.abs(this.data[i * 6 + 1] - y) < this.acceptedRadius) {
          return true;
        }
      }
    } else {
      for (let i = 0; i < hullVerticesLength; i++) {
        if (Math.abs(hullVertices[i * 6] - x) < this.acceptedRadius && Math.abs(hullVertices[i * 6 + 1] - y) < this.acceptedRadius) {
          return true;
        }
      }
    }
    return false;
  }

  midpoint() {
    let n = this.data.length / 6;
    let x = 0;
    let y = 0;
    for (let i = 0; i < n; i++) {
      x += this.data[i * 6];
      y += this.data[i * 6 + 1];
    }
    return [x / n, y / n];
  }

  translate(dx, dy) {
    let n = this.data.length / 6;
    for (let i = 0; i < n; i++) {
      this.data[i * 6] += dx;
      this.data[i * 6 + 1] += dy;
    }
  }

  render(gl, convexHull) {
    let n = 0
    
    if (convexHull){
      let temp = this.convexHull()
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(temp), gl.STATIC_DRAW);
      n = temp.length / 6;
    } else{
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
      n = this.data.length / 6;
    }

    if (this.data.length > 12) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
    }
    else if (this.data.length == 12) {
      gl.drawArrays(gl.LINES, 0, n);
    }
    else{
      gl.drawArrays(gl.POINTS, 0, n);
    }
  }
}