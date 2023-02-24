export class Rectangle {
  constructor(x, y, width, height, colors) {
    this.x1 = x;
    this.x2 = x + width;
    this.y1 = y;
    this.y2 = y + height;
    this.acceptedRadius = 0.1;

    // prettier-ignore
    this.data = [
      this.x1, this.y1, colors[0], colors[1], colors[2], colors[3], // top left
      this.x2, this.y1, colors[4], colors[5], colors[6], colors[7], /// top right
      this.x1, this.y2, colors[8], colors[9], colors[10], colors[11], /// bottom left
      this.x2, this.y1, colors[4], colors[5], colors[6], colors[7], /// top right
      this.x1, this.y2, colors[8], colors[9], colors[10], colors[11], /// bottom left
      this.x2, this.y2, colors[12], colors[13], colors[14], colors[15], /// bottom right
    ]
  }

  updateVertex(idx, x, y) {
    // Top right, change x2 y1
    if (idx == 6){
      this.data[6] = x,
      this.data[18] = x,
      this.data[30] = x,
      this.data[1] = y,
      this.data[7] = y,
      this.data[19] = y,
      this.x2 = x
      this.y1 = y
    } else if (idx == 0){ // Top left change x1 y1
      this.data[0] = x,
      this.data[12] = x,
      this.data[24] = x,
      this.data[1] = y,
      this.data[7] = y,
      this.data[19] = y,
      this.x1 = x
      this.y1 = y
    } else if (idx == 12){ // Bottom left change x1 y2
      this.data[0] = x,
      this.data[12] = x,
      this.data[24] = x,
      this.data[13] = y,
      this.data[25] = y,
      this.data[31] = y,
      this.x1 = x
      this.y2 = y
    } else if (idx == 30){ // Bottom right change x2 y2
      this.data[6] = x,
      this.data[18] = x,
      this.data[30] = x,
      this.data[13] = y,
      this.data[25] = y,
      this.data[31] = y,
      this.x2 = x
      this.y2 = y
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

    //  HANDLE TOP RIGHT ADA 2
    if (i == 6){
      this.data[20] = color[0];
      this.data[21] = color[1];
      this.data[22] = color[2];
      this.data[23] = color[3];
    }

    if (i==18){
      this.data[8] = color[0];
      this.data[9] = color[1];
      this.data[10] = color[2];
      this.data[11] = color[3];
    }

    // HANDLE BOTTOM LEFT ADA 2
    if (i == 24){
      this.data[14] = color[0];
      this.data[15] = color[1];
      this.data[16] = color[2];
      this.data[17] = color[3];
    }

    if (i==12){
      this.data[26] = color[0];
      this.data[27] = color[1];
      this.data[28] = color[2];
      this.data[29] = color[3];
    }
  }

  render(gl) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.data), gl.STATIC_DRAW);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }
}

// TODO
// 1. touchVertex
// 2. updateColor