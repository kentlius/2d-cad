export class Polygon {
  constructor() {
    this.data = [];
    this.acceptedRadius = 0.1;
    this.lock = []
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
      this.lock.push(0)
    }
  }

  updateVertex(idx,x,y){
    if(this.lock[idx/6] == 0){
      this.data[idx] = x;
      this.data[idx+1] = y;
    }
  }

  deleteLast(){
    this.data.splice(this.data.length - 6, 6);  
    this.lock.splice(this.lock.length -1, 1);
  }

  removeVertex(n){
    this.data.splice(n, 6);
    this.lock.splice(n/6, 1);
    if (this.data.length <= 6){
      this.data.splice(0, this.data.length);
      this.lock.splice(0, this.lock.length);
    }
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

  touch(x, y, convexHull) {
    if (convexHull) {
      let hull = this.convexHull();
      let hullN = hull.length / 6;
      let isInside = false;
      let j = hullN - 1;
      for (let i = 0; i < hullN; i++) {
        if (hull[i * 6 + 1] > y != hull[j * 6 + 1] > y && x < (hull[j * 6] - hull[i * 6]) * (y - hull[i * 6 + 1]) / (hull[j * 6 + 1] - hull[i * 6 + 1]) + hull[i * 6]) {
          isInside = !isInside;
        }
        j = i;
      }
      return isInside;
    } else {
      let n = this.data.length / 6;
      let isInside = false;
      let j = n - 1;
      for (let i = 0; i < n; i++) {
        if (this.data[i * 6 + 1] > y != this.data[j * 6 + 1] > y && x < (this.data[j * 6] - this.data[i * 6]) * (y - this.data[i * 6 + 1]) / (this.data[j * 6 + 1] - this.data[i * 6 + 1]) + this.data[i * 6]) {
          isInside = !isInside;
        }
        j = i;
      }
      return isInside;
    }

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
      if (this.lock[i] == 0) {
        this.data[i * 6] += dx;
        this.data[i * 6 + 1] += dy;
      }
    }
  }

  rotate(angle) {
    const angleRad = angle * Math.PI / 180;
    let n = this.data.length / 6;
    let mid = this.midpoint();
    for (let i = 0; i < n; i++) {
      if (this.lock[i] == 0) {
        let x = this.data[i * 6] - mid[0];
        let y = this.data[i * 6 + 1] - mid[1];
        this.data[i * 6] = x * Math.cos(angleRad) - y * Math.sin(angleRad) + mid[0];
        this.data[i * 6 + 1] = x * Math.sin(angleRad) + y * Math.cos(angleRad) + mid[1];
      }
    }
  }

  dilate(scale) {
    let n = this.data.length / 6;
    let mid = this.midpoint();
    for (let i = 0; i < n; i++) {
      if (this.lock[i] == 0) {
        this.data[i * 6] = (this.data[i * 6] - mid[0]) * scale + mid[0];
        this.data[i * 6 + 1] = (this.data[i * 6 + 1] - mid[1]) * scale + mid[1];
      }
    }
  }

  changeLock(index) {
    if (this.lock[index/6] == 0) {
      this.lock[index/6] = 1;
    } else {
      this.lock[index/6] = 0;
    }
  }

  renderLocks(gl) {
    let n = this.data.length / 6;
    for (let i = 0; i < n; i++) {
      if (this.lock[i] == 1) {
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([this.data[i * 6], this.data[i * 6 + 1], 1, 0, 0, 1]), gl.STATIC_DRAW);
        gl.drawArrays(gl.POINTS, 0, 1);
      }
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

    this.renderLocks(gl);
  }
}