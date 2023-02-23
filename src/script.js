import { Container } from "./container.js";
import { Line } from "./shape/line.js";
import { Rectangle } from "./shape/rectangle.js";
import { Square } from "./shape/square.js";
import { Polygon } from "./shape/polygon.js";

let canvas = document.querySelector("#canvas");
let gl = canvas.getContext("webgl");
let container = new Container();
let polygonClicked = false;

function renderCanvas() {
  clearCanvas();

  for (let i = 0; i < container.lines.length; i++) {
    container.lines[i].render(gl);
  }
  for (let i = 0; i < container.rectangles.length; i++) {
    container.rectangles[i].render(gl);
  }
  for (let i = 0; i < container.polygons.length; i++) {
    container.polygons[i].render(gl);
  }
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
  eventHandler(gl, canvas);
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

  resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(244 / 255, 255 / 255, 255 / 255, 1);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function recordMouse(event) {
  let x = (event.offsetX / canvas.clientWidth) * 2 - 1;
  let y = (1 - event.offsetY / canvas.clientHeight) * 2 - 1;
  return { x, y };
}

function lineClickHandler(event) {
  const { x, y } = recordMouse(event);
  let line = new Line(x, y, x + 0.5, y + 0.5, [1, 0, 0, 1, 1, 0, 0, 1]);
  container.lines.push(line);
  renderCanvas();
  // container.renderOrder.push(1);
}

function rectangleClickHandler(event) {
  const { x, y } = recordMouse(event);
  let rectangle = new Rectangle(
    x,
    y,
    0.9,
    0.4,
    [1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 1]
  );
  container.rectangles.push(rectangle);
  renderCanvas();
}

function squareClickHandler(event) {
  const { x, y } = recordMouse(event);
  let square = new Square(
    x,
    y,
    0.5,
    [1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]
  );
  container.squares.push(square);
  renderCanvas();
}

function polygonClickHandler(event) {
  const { x, y } = recordMouse(event);
  if (polygonClicked) {
    let polygon_idx = container.polygons.length - 1;
    container.polygons[polygon_idx].addVertex(x, y, [1,1,0,1]);
    
  }
  else {
    let polygon = new Polygon();
    polygon.addVertex(x, y,[1,0,0,1]);
    container.polygons.push(polygon);
    polygonClicked = true;
    console.log(container.polygons.length)
  }
  renderCanvas();
}

function eventHandler() {
  canvas.addEventListener("mousedown", function (event) {
    if (document.querySelector("#draw").checked) {
      if (document.querySelector("#line").checked) {
        polygonClicked = false;
        lineClickHandler(event);
      } else if (document.querySelector("#square").checked) {
        polygonClicked = false;
        squareClickHandler(event);
      } // TODO
      else if (document.querySelector("#rectangle").checked) {
        polygonClicked = false;
        rectangleClickHandler(event);
      } // TODO
      else if (document.querySelector("#polygon").checked) {
        polygonClickHandler(event);
      } // TODO
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
