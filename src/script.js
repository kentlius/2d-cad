import { Container } from "./container.js"; 
import { Line } from "./shape/line.js";
import { Rectangle } from "./shape/rectangle.js";
import { Square } from "./shape/square.js";

let canvas = document.querySelector("#canvas");
let gl = canvas.getContext("webgl");
let container = new Container();

function renderCanvas () {
  // clear canvas
  clearCanvas();

  for(let i=0;i<container.lines.length;i++){
    container.lines[i].render(gl);
    console.log(container.lines[i].data);
  }
}

const main = () => {
  clearCanvas();

  // Get the strings for GLSL shaders
  const vertexShaderSource   = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL sources, then compile them
  const vertexShader   = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  
  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragmentShader);
  
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var colorAttributeLocation = gl.getAttribLocation(program, "a_color");
  
  gl.vertexAttribPointer(
    positionAttributeLocation, 
    2, 
    gl.FLOAT, 
    false, 
    6 * Float32Array.BYTES_PER_ELEMENT,
    0
  );
    
  gl.vertexAttribPointer(
    colorAttributeLocation, 
    4, 
    gl.FLOAT,
    false, 
    6 * Float32Array.BYTES_PER_ELEMENT,  
    2 * Float32Array.BYTES_PER_ELEMENT
  );

  gl.enableVertexAttribArray(positionAttributeLocation);
  gl.enableVertexAttribArray(colorAttributeLocation);

  gl.useProgram(program);
  
  // ------ MAIN RENDER LOOP ------ //
  eventHandler(gl, canvas);
  renderCanvas();
  // ------------------------------ //

}

// clear canvas
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

function rectangleClickHandler(event) {
  const {x , y} = recordMouse(event);
  let rectangle = new Rectangle(x, y, 0.9, 0.4, [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1]);
  container.lines.push(rectangle);
  renderCanvas();
}

function squareClickHandler(event) {
  const {x , y} = recordMouse(event);
  let square = new Square(x, y, 0.5, [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]);
  container.lines.push(square);
  renderCanvas();
}

function eventHandler() {
  canvas.addEventListener("mousedown", function(event) {
    // only if 'draw' radio button is checked
    if (document.querySelector("#draw").checked){
      if (document.querySelector("#line").checked)            {lineClickHandler(event);} 
      else if (document.querySelector("#square").checked)     {squareClickHandler(event);}    // TODO
      else if (document.querySelector("#rectangle").checked)  {rectangleClickHandler(event);} // TODO
      else if (document.querySelector("#polygon").checked)    {polygonClickHandler(event);}   // TODO
    }
  });

  const clearbtn = document.querySelector("#clear");
  clearbtn.addEventListener("click", function(event) {
    clearCanvas();
  });
}

window.onload = main;