function main() {
  // initialize new Creator
  let creator = new Creator();

  creator.canvas= document.querySelector("#canvas");
  creator.gl = WebGLUtils.setupWebGL(creator.canvas);

<<<<<<< Updated upstream
  // Tell WebGL how to convert from clip space to pixels
  creator.gl.viewport(0, 0, creator.canvas.width, creator.canvas.height);
=======
let canvas = document.querySelector("#canvas");
let gl = canvas.getContext("webgl");
let container = new Container();

function renderCanvas () {
  // clear canvas
  clearCanvas();
  // gl.useProgram(program);
  // initialize pointer for each shapes' buffers
  let lineP = 0,
    squareP = 0,
    rectP = 0,
    polyP = 0;

  for(let i=0;i<container.lines.length;i++){
    container.lines[i].render(gl);
    console.log(container.lines[i].data);
  }
}

const main = () => {
>>>>>>> Stashed changes

  // Clear the canvas
  creator.gl.clearColor(0, 0, 0, 0);
  creator.gl.clear(creator.gl.COLOR_BUFFER_BIT);
  
  // Get the strings for GLSL shaders
  const vertexShaderSource   = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;
  
  // create GLSL shaders, upload the GLSL sources, then compile them
  const vertexShader   = createShader(creator.gl, creator.gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(creator.gl, creator.gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  // Link the two shaders into a program
  const program = createProgram(creator.gl, vertexShader, fragmentShader);
  creator.gl.useProgram(program);

  // look up where the vertex data needs to go
  const positionLocation = creator.gl.getAttribLocation(program, "a_position");
  const colorLocation = creator.gl.getAttribLocation(program, "a_color");
  creator.gl.enableVertexAttribArray(positionLocation);

<<<<<<< Updated upstream
  // look up transformation uniform location
  const matrixUniformLocation = creator.gl.getUniformLocation(program, "u_matrix");
  const colorUniformLocation = creator.gl.getUniformLocation(program, "u_color");
  creator.colorUniformLocation = colorUniformLocation;

// ------------------------------------------------------------------------------------
// TODO : pertimbangin alokasi bindBuffer di sini atau di setiap shape

  // Create a buffer for the positions
  const positionBuffer = creator.gl.createBuffer();
  creator.gl.bindBuffer(creator.gl.ARRAY_BUFFER, positionBuffer);

  // Create a buffer for the colors
  var colorBuffer = creator.gl.createBuffer();
  creator.gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

// ------------------------------------------------------------------------------------
  
  // // draw rectangle on mouse click
  canvas.onmousedown = function(event) {
    var x = event.clientX;
    var y = event.clientY;
    console.log(x, y);
     
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    
    drawRectangle(gl, x, y, 100, 100)
  };


  var translation = [0, 0];
  var angleInRadians = 0;
  var scale = [1, 1];

  // code above this line is initialization code.
  // code below this line is rendering code.

  drawScene();

  var slider = document.querySelector("#x-axis-translation");
  slider.value = translation[0];
  slider.max = gl.canvas.width;
  slider.oninput = function() {
    updatePosition(0)(null, {value: this.value});
  }

  var slider = document.querySelector("#y-axis-translation");
  slider.value = translation[1];
  slider.max = gl.canvas.height;
  slider.oninput = function() {
    updatePosition(1)(null, {value: this.value});
  }

  var slider = document.querySelector("#x-axis-dilation");
  slider.value = scale[0];
  slider.min = -5;
  slider.max = 5;
  slider.step = 0.01;
  slider.precision = 2;
  slider.oninput = function() {
    updateScale(0)(null, {value: this.value});
  }

  var slider = document.querySelector("#y-axis-dilation");
  slider.value = scale[1];
  slider.min = -5;
  slider.max = 5;
  slider.step = 0.01;
  slider.precision = 2;
  slider.oninput = function() {
    updateScale(1)(null, {value: this.value});
  }


  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function updateAngle(event, ui) {
    var angleInDegrees = 360 - ui.value;
    angleInRadians = angleInDegrees * Math.PI / 180;
    drawScene();
  }

  function updateScale(index) {
    return function(event, ui) {
      scale[index] = ui.value;
      drawScene();
    };
  }

  function drawScene() {
    function resizeCanvasToDisplaySize(canvas, multiplier) {
      multiplier = multiplier || 1;
      const width = (canvas.clientWidth * multiplier) | 0;
      const height = (canvas.clientHeight * multiplier) | 0;
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
        return true;
      }
      return false;
    }

    resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas.
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Turn on the position attribute
    gl.enableVertexAttribArray(positionLocation);

    // Bind the position buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2; // 2 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      positionLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // Turn on the color attribute
    gl.enableVertexAttribArray(colorLocation);

    // Bind the color buffer.
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
    var size = 4; // 4 components per iteration
    var type = gl.FLOAT; // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      colorLocation,
      size,
      type,
      normalize,
      stride,
      offset
    );

    // Compute the matrix
    var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
    matrix = m3.translate(matrix, translation[0], translation[1]);
    matrix = m3.scale(matrix, scale[0], scale[1]);

    // Set the matrix.
    gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
=======
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  var buffer = gl.createBuffer();
  // var colorBuffer    = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

  gl.vertexAttribPointer(
    positionAttributeLocation, 
    2, 
    gl.FLOAT, 
    false, 
    6 * Float32Array.BYTES_PER_ELEMENT,
    0);
  gl.enableVertexAttribArray(positionAttributeLocation);

  gl.vertexAttribPointer(
    colorAttributeLocation, 
    4, 
    gl.FLOAT, 
    false, 
    6 * Float32Array.BYTES_PER_ELEMENT,  
    2 * Float32Array.BYTES_PER_ELEMENT
    );
  gl.enableVertexAttribArray(colorAttributeLocation);

  gl.useProgram(program);

  var triangleVertices = 
    [
        -0.5,0.5,    1.0,1.0,0.0,1.0,
        -1.0,-0.5,  0.7,0.0,1.0,1.0,
        0.0,-0.5,   0.1,1.0,0.6,1.0,

        0.5,0.5,    1.0,1.0,0.0,1.0,
        0.0,-0.5,  0.7,0.0,1.0,1.0,
        1.0,-0.5,   0.1,1.0,0.6,1.0
    ]

    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array(triangleVertices),gl.STATIC_DRAW)

    gl.drawArrays(gl.TRIANGLES,0,6)

  // ------ MAIN RENDER LOOP ------ //
  eventHandler(gl, canvas);
  // renderCanvas();
  // ------------------------------ //
  
  function initRender(buff) {
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(buff), gl.STATIC_DRAW);


    gl.drawArrays(gl.LINES, 0, 2);
>>>>>>> Stashed changes
  }

  // function renderCanvas () {
  //   // clear canvas
  //   clearCanvas();
  //   // gl.useProgram(program);
  //   // initialize pointer for each shapes' buffers
  //   let lineP = 0,
  //     squareP = 0,
  //     rectP = 0,
  //     polyP = 0;

  //   for(let i=0;i<container.lines.length;i++){
  //     container.lines[i].render(gl);
  //   }
  // }
    // render all shapes in rendering order
    // container.renderOrder.forEach((shape) => {
  //     switch (shape) {
  //       case 1:
  //         const line = container.lines[lineP];
  //         // line.render(gl, program);
  //         initRender(line.data);
  //         lineP++;
  //         break;
  //       case 2:
  //         container.squares[squareP].render(gl, program);
  //         squareP++;
  //         break;
  //       case 3:
  //         container.rectangles[rectP].render(gl, program);
  //         rectP++;
  //         break;
  //       case 4:
  //         container.polygons[polyP].render(gl, program);
  //         polyP++;
  //         break;
  //     }
  //   });
  //   window.requestAnimationFrame(renderCanvas);
  // }
}

<<<<<<< Updated upstream
main();
=======
// clear canvas
// TODO : Uncaught ReferenceError: clearCanvas is not defined
function clearCanvas () {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(244/255, 255/255, 255/255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}


function recordMouse(event) {
  let x = (event.offsetX / canvas.clientWidth) * 2 - 1
  let y = (1 - (event.offsetY / canvas.clientHeight)) * 2 - 1
  return {x,y};
}

// Add new Line object to container
function lineClickHandler(event) {
  const {x , y} = recordMouse(event);
  let line = new Line(x,y,x+0.5, y+0.5, [1, 0, 0, 1, 1, 0, 0, 1]);
  container.lines.push(line);
  renderCanvas();
  // container.renderOrder.push(1);
}

function squareClickHandler(event) {}

function rectangleClickHandler(event) {}

function polygonClickHandler(event) {}


function eventHandler() {
  canvas.addEventListener("mousedown", function(event) {
    // only if 'draw' radio button is checked
    if (document.querySelector("#draw").checked){
      if (document.querySelector("#line").checked)            {lineClickHandler(event);} 
      else if (document.querySelector("#square").checked)     {squareClickHandler(event);}
      else if (document.querySelector("#rectangle").checked)  {rectangleClickHandler(event);}
      else if (document.querySelector("#polygon").checked)    {polygonClickHandler(event);} 
    }
  });
}
    
  // var translation = [0, 0];
  // var angleInRadians = 0;
  // var scale = [1, 1];

  // // code above this line is initialization code.
  // // code below this line is rendering code.

  // var slider = document.querySelector("#x-axis-translation");
  // slider.value = translation[0];
  // slider.max = gl.canvas.width;
  // slider.oninput = function () {
  //   updatePosition(0)(null, { value: this.value });
  // };

  // var slider = document.querySelector("#y-axis-translation");
  // slider.value = translation[1];
  // slider.max = gl.canvas.height;
  // slider.oninput = function () {
  //   updatePosition(1)(null, { value: this.value });
  // };

  // var slider = document.querySelector("#x-axis-dilation");
  // slider.value = scale[0];
  // slider.min = -5;
  // slider.max = 5;
  // slider.step = 0.01;
  // slider.precision = 2;
  // slider.oninput = function () {
  //   updateScale(0)(null, { value: this.value });
  // };

  // var slider = document.querySelector("#y-axis-dilation");
  // slider.value = scale[1];
  // slider.min = -5;
  // slider.max = 5;
  // slider.step = 0.01;
  // slider.precision = 2;
  // slider.oninput = function () {
  //   updateScale(1)(null, { value: this.value });
  // };

  // function updatePosition(index) {
  //   return function (event, ui) {
  //     translation[index] = ui.value;
  //     drawScene();
  //   };
  // }

  // function updateAngle(event, ui) {
  //   var angleInDegrees = 360 - ui.value;
  //   angleInRadians = (angleInDegrees * Math.PI) / 180;
  //   drawScene();
  // }

  // function updateScale(index) {
  //   return function (event, ui) {
  //     scale[index] = ui.value;
  //     drawScene();
  //   };
  // }

  // function drawScene() {
  //   function resizeCanvasToDisplaySize(canvas, multiplier) {
  //     multiplier = multiplier || 1;
  //     const width = (canvas.clientWidth * multiplier) | 0;
  //     const height = (canvas.clientHeight * multiplier) | 0;
  //     if (canvas.width !== width || canvas.height !== height) {
  //       canvas.width = width;
  //       canvas.height = height;
  //       return true;
  //     }
  //     return false;
  //   }

  //   resizeCanvasToDisplaySize(gl.canvas);

  //   // Tell WebGL how to convert from clip space to pixels
  //   gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  //   // Clear the canvas.
  //   gl.clear(gl.COLOR_BUFFER_BIT);

  //   // Tell it to use our program (pair of shaders)
  //   gl.useProgram(program);

  //   // Turn on the position attribute
  //   gl.enableVertexAttribArray(positionLocation);

  //   // Bind the position buffer.
  //   gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  //   // Tell the position attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  //   var size = 2; // 2 components per iteration
  //   var type = gl.FLOAT; // the data is 32bit floats
  //   var normalize = false; // don't normalize the data
  //   var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  //   var offset = 0; // start at the beginning of the buffer
  //   gl.vertexAttribPointer(
  //     positionLocation,
  //     size,
  //     type,
  //     normalize,
  //     stride,
  //     offset
  //   );

  //   // Turn on the color attribute
  //   gl.enableVertexAttribArray(colorLocation);

  //   // Bind the color buffer.
  //   gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

  //   // Tell the color attribute how to get data out of colorBuffer (ARRAY_BUFFER)
  //   var size = 4; // 4 components per iteration
  //   var type = gl.FLOAT; // the data is 32bit floats
  //   var normalize = false; // don't normalize the data
  //   var stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
  //   var offset = 0; // start at the beginning of the buffer
  //   gl.vertexAttribPointer(colorLocation, size, type, normalize, stride, offset);

  //   // Compute the matrix
  //   var matrix = m3.projection(gl.canvas.clientWidth, gl.canvas.clientHeight);
  //   matrix = m3.translate(matrix, translation[0], translation[1]);
  //   matrix = m3.scale(matrix, scale[0], scale[1]);

  //   // Set the matrix.
  //   gl.uniformMatrix3fv(matrixUniformLocation, false, matrix);

  //   // Draw the geometry.
  //   var primitiveType = gl.TRIANGLES;
  //   var offset = 0;
  //   var count = 6;
  //   gl.drawArrays(primitiveType, offset, count);
  // }


// run main
window.onload = main;

// posLoc :
// bindBuffer -> bufferData utk nyimpan vertex
// enableVertexAttribArray -> bindBUffer -> vertexAttribPointer

// colorLoc:
// bindBuffer -> bufferData utk nyimpan vertex
// enableVertexAttribArray -> bindBUffer -> vertexAttribPointer

// drawArrays
>>>>>>> Stashed changes
