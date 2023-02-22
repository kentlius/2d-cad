import { Container , Line} from "./container.js";


let canvas = document.querySelector("#canvas");
let gl = canvas.getContext("webgl");
let container = new Container();

const main = () => {

  // Get the strings for GLSL shaders
  const vertexShaderSource    = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSource  = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL sources, then compile them
  var vertexShader    = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader  = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program   = setupProgram(gl, vertexShader, fragmentShader);

  // look up transformation uniform location
  // const matrixUniformLocation = gl.getUniformLocation(program,"u_matrix");

  // var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  // var colorAttributeLocation = gl.getAttribLocation(program, "a_color");

  // var positionBuffer = gl.createBuffer();
  // var colorBuffer    = gl.createBuffer();

  // ------ MAIN RENDER LOOP ------ //
  eventHandler(gl, canvas);
  renderCanvas();
  // ------------------------------ //
  
  // function initRender(vBuff, cBuff) {
  //   initBuffer(gl, vBuff);
  //   initAttribute(gl, positionAttributeLocation, positionBuffer, 2);

  //   initBuffer(gl, cBuff);
  //   initAttribute(gl, colorAttributeLocation, colorBuffer, 4);
  // }

  function renderCanvas () {
    // clear canvas
    clearCanvas();
    gl.useProgram(program);
    // initialize pointer for each shapes' buffers
    let lineP = 0,
      squareP = 0,
      rectP = 0,
      polyP = 0;
  
    // render all shapes in rendering order
    container.renderOrder.forEach((shape) => {
      switch (shape) {
        case 1:
          const line = container.lines[lineP];
          // line.render(gl, program);

          // or

          // initRender(line.vertices, line.colors);
          // gl.drawArrays(gl.LINES, 0, 2);
          lineP++;
          break;
        case 2:
          container.squares[squareP].render(gl, program);
          squareP++;
          break;
        case 3:
          container.rectangles[rectP].render(gl, program);
          rectP++;
          break;
        case 4:
          container.polygons[polyP].render(gl, program);
          polyP++;
          break;
      }
    });
    window.requestAnimationFrame(renderCanvas);
  }
}

// clear canvas
// TODO : Uncaught ReferenceError: clearCanvas is not defined
function clearCanvas () {
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(244/255, 255/255, 255/255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}



// Add new Line object to container
function lineClickHandler(event) {
  const x = event.clientX;
  const y = event.clientY;

  let line = new Line(x, y, x + 50, y + 50, [0, 0, 0, 1]);
  container.lines.push(line);
  container.renderOrder.push(1);
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
