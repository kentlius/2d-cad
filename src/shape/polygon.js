export class Polygon {
    constructor() {
      this.vertices = [];
    }

    addVertex(x, y, colors) {
        this.vertices.push(x, y, colors[0], colors[1], colors[2], colors[3]);
    }

    updateVertex(x,y){
        this.vertices[this.vertices.length - 6] = x;
        this.vertices[this.vertices.length - 5] = y;
    }

    deleteLast(){
        this.vertices.splice(this.vertices.length - 6, 6);  
    }

    removeVertex(n){
        this.vertices.splice(n, 6);
    }

    touchVertex(x, y){
        for(let i = 0; i < this.vertices.length; i += 6){
            if(Math.abs(this.vertices[i] - x) < 0.1 && Math.abs(this.vertices[i+1] - y) < 0.1){
                return i;
            }
        }
        return -1;
    }


    render(gl) {
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
      if (this.vertices.length > 12) {
        gl.drawArrays(gl.TRIANGLE_FAN, 0, this.vertices.length / 6);
      }
      else if (this.vertices.length == 12) {
        gl.drawArrays(gl.LINES, 0, this.vertices.length / 6);
      }
      else{
        gl.drawArrays(gl.POINTS, 0, this.vertices.length / 6);
      }
    }
  }