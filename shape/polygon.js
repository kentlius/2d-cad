export class Polygon {
  constructor() {
    this.data = [];
    this.acceptedRadius = 0.1;
  }

  addVertex(x, y, colors) {
    this.data.push(x, y, colors[0], colors[1], colors[2], colors[3]);
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

  render(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
    if (this.data.length > 12) {
      gl.drawArrays(gl.TRIANGLE_FAN, 0, this.data.length / 6);
    }
    else if (this.data.length == 12) {
      gl.drawArrays(gl.LINES, 0, this.data.length / 6);
    }
    else{
      gl.drawArrays(gl.POINTS, 0, this.data.length / 6);
    }
  }
}