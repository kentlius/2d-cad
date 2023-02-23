import { Container } from "./container.js";
import { Line } from "./shape/line.js";
import { Rectangle } from "./shape/rectangle.js";
import { Square } from "./shape/square.js";
import { Polygon } from "./shape/polygon.js";

let canvas = document.querySelector("#canvas");
let gl = canvas.getContext("webgl");

// color data
let currentColor = [0, 0, 0, 1];

// Shape data
let container = new Container();
let polygonClicked = false;

let newLine = -1;
let isHover = false;

function renderCanvas() {
  clearCanvas();

  let lineP = 0, squareP = 0, rectangleP = 0, polygonP = 0;
  container.renderOrder.forEach((shape) => {
    switch (shape) {
      case 1:
        container.lines[lineP].render(gl);
        lineP++;
        break;
      case 2:
        container.squares[squareP].render(gl);
        squareP++;
        break;
      case 3:
        container.rectangles[rectangleP].render(gl);
        rectangleP++;
        break;
      case 4:
        container.polygons[polygonP].render(gl);
        polygonP++;
        break;
    }
  });
}

const main = () => {
  clearCanvas();

  // Get the strings for GLSL shaders
  const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL sources, then compile them
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
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
  eventHandler();
  renderCanvas();
  // ------------------------------ //
};


function resetCanvas() {
  container.clear();
  clearCanvas();
}

function clearCanvas() {
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
  // clear
  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1, 1, 1, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function recordMouse(event) {
  let x = (event.offsetX / canvas.clientWidth) * 2 - 1;
  let y = (1 - event.offsetY / canvas.clientHeight) * 2 - 1;
  return { x, y };
}


// -----------------LINE HANDLER----------------- //
function lineClickHandler(event) {
  const { x, y } = recordMouse(event);
  currentColor = getColor();

  if (newLine === -1) {   // tidak ada line baru yang sedang dibentuk
    let line = new Line(x,y,x,y,[...currentColor, ...currentColor]);
    container.renderOrder.push(1);
    container.lines.push(line);
    newLine = container.lines.length - 1;
    isHover = true;
  } else {                // ada line yang sedang dibentuk
    container.lines[newLine].updateVertex(x, y);
    newLine = -1;
    isHover = false;
  }
  renderCanvas();
}

function lineMoveHandler(event) {
  const { x, y } = recordMouse(event);
  if(!isHover) {
    return;
  } else if(newLine !== -1) {
    container.lines[newLine].updateVertex(x, y);
    console.log("line moved")
  }
  renderCanvas();
}


// -----------------SQUARE HANDLER----------------- //
function squareClickHandler(event) {
  const { x, y } = recordMouse(event);
  let square = new Square(
    x,
    y,
    0.5,
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]
  );
  container.renderOrder.push(2);
  container.squares.push(square);
  renderCanvas();
}


// -----------------RECTANGLE HANDLER----------------- //
function rectangleClickHandler(event) {
  const { x, y } = recordMouse(event);
  let rectangle = new Rectangle(
    x,
    y,
    0.9,
    0.4,
    [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1]
  );
  container.renderOrder.push(3);
  container.rectangles.push(rectangle);
  renderCanvas();
}


// -----------------POLYGON HANDLER----------------- //
function polygonClickHandler(event) {
  const { x, y } = recordMouse(event);
  if (polygonClicked) {
    let polygon_idx = container.polygons.length - 1;
    container.polygons[polygon_idx].addVertex(x, y, [1,1,0,1]);
  }
  else {
    let polygon = new Polygon();
    polygon.addVertex(x, y,[1,0,0,1]);
    container.renderOrder.push(4);
    container.polygons.push(polygon);
    polygonClicked = true;
  }
  renderCanvas();
}


// -----------------EVENT HANDLER----------------- //
function eventHandler() {
  canvas.addEventListener("mousedown", function (event) {
    if (document.querySelector("#draw").checked) {          // draw mode
      if (document.querySelector("#line").checked) {
        polygonClicked = false;
        lineClickHandler(event);
      } else if (document.querySelector("#square").checked) {
        polygonClicked = false;
        squareClickHandler(event);
      }
      else if (document.querySelector("#rectangle").checked) {
        polygonClicked = false;
        rectangleClickHandler(event);
      }
      else if (document.querySelector("#polygon").checked) {
        polygonClickHandler(event);
      }
    } else if (document.querySelector("#edit").checked) {    // edit mode
      // TODO
    }
  });

  canvas.addEventListener("mousemove", function (event) {
    if (document.querySelector("#draw").checked) {
      if (document.querySelector("#line").checked) {
        lineMoveHandler(event);
      }
    }
  });

  const clearbtn = document.querySelector("#clear");
  clearbtn.addEventListener("click", () => {
    resetCanvas();
  });

  const helpbtn = document.querySelector("#help");
  helpbtn.addEventListener("click", () => {
    document.querySelector("#help-content").style.display = "inline";
  });

  const closebtn = document.querySelector("#close");
  closebtn.addEventListener("click", () => {
    document.querySelector("#help-content").style.display = "none";
  });
}

window.onload = main;
