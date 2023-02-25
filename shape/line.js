export class Line {
  constructor(x1, y1, x2, y2, color) {
    // prettier-ignore
    this.data = [
      x1, y1, color[0], color[1], color[2], color[3], // start point
      x2, y2, color[4], color[5], color[6], color[7]  // end point
    ]
    this.acceptedRadius = 0.1;
  }

  updateVertex(idx, x, y) {
    //Update second vertex
    if (idx == 6){
      this.data[6] = x;
      this.data[7] = y;
    } else if (idx == 0){ // Update first vertex
      this.data[0] = x;
      this.data[1] = y;
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

  touch(x, y){
    let x1 = this.data[0];
    let y1 = this.data[1];
    let x2 = this.data[6];
    let y2 = this.data[7];
    let dx = x2 - x1;
    let dy = y2 - y1;
    let d = Math.abs(dy * x - dx * y + x2 * y1 - y2 * x1) / Math.sqrt(dx * dx + dy * dy);
    return d < this.acceptedRadius;
  }

  midpoint(){
    return [(this.data[0] + this.data[6])/2, (this.data[1] + this.data[7])/2];
  }

  translate(x, y){
    this.data[0] += x;
    this.data[1] += y;
    this.data[6] += x;
    this.data[7] += y;
  }

  rotate(angle){
    const angleRad = angle * Math.PI / 180;
    let x1 = this.data[0];
    let y1 = this.data[1];
    let x2 = this.data[6];
    let y2 = this.data[7];
    const [x, y] = this.midpoint();
    this.data[0] = (x1 - x) * Math.cos(angleRad) - (y1 - y) * Math.sin(angleRad) + x;
    this.data[1] = (x1 - x) * Math.sin(angleRad) + (y1 - y) * Math.cos(angleRad) + y;
    this.data[6] = (x2 - x) * Math.cos(angleRad) - (y2 - y) * Math.sin(angleRad) + x;
    this.data[7] = (x2 - x) * Math.sin(angleRad) + (y2 - y) * Math.cos(angleRad) + y;
  }

  dilate(scale){
    const [x, y] = this.midpoint();
    this.data[0] = (this.data[0] - x) * scale + x;
    this.data[1] = (this.data[1] - y) * scale + y;
    this.data[6] = (this.data[6] - x) * scale + x;
    this.data[7] = (this.data[7] - y) * scale + y;
  }
  
  render(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
    gl.drawArrays(gl.LINES, 0, 2);
  }
}
