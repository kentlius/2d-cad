import { Container } from "./container.js";
import { Line } from "./shape/line.js";
import { Rectangle } from "./shape/rectangle.js";
import { Square } from "./shape/square.js";
import { Polygon } from "./shape/polygon.js";

let canvas = document.querySelector("#canvas");
let gl = canvas.getContext("webgl");

// color models
let currentColor = [0, 0, 0, 1];

// Shape data
let container = new Container();
let mouseX = 0;
let mouseY = 0;
let previoustranslateX = 0;
let previoustranslateY = 0;
let previousScale = 0;
let previousRotate = 0;

let newLine = -1;
let isLineHover = false;
let lineDragged = -1;
let lineVertexDragged = -1
let selectedLine = -1;

let newSquare = -1;
let isSquareHover = false;
let squareDragged = -1;
let squareVertexDragged = -1
let selectedSquare = -1;

let newRect = -1;
let isRectHover = false;
let rectDragged = -1;
let rectVertexDragged = -1
let selectedRect = -1;

let newPolygon = -1;
let isPolygonHover = false;
let polygonDragged = -1;
let polygonVertexDragged = -1
let selectedPolygon = -1;

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
        container.polygons[polygonP].render(gl, document.querySelector("#convexhull").checked);
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

// -----------------COLOR HANDLER----------------- //
function changeColor(shapeType, idxOnContainer, idx) {
  currentColor = getColor();
  switch (shapeType) {
    case 1: // line
      container.lines[idxOnContainer].updateColor(idx, currentColor);
      break;
    case 2: // square
      container.squares[idxOnContainer].updateColor(idx, currentColor);
      break;
    case 3: // rectangle
      container.rectangles[idxOnContainer].updateColor(idx, currentColor);
      break;
    case 4: // polygon
      container.polygons[idxOnContainer].updateColor(idx, currentColor);
      break;
    default:
      break;
  }
  renderCanvas();
}

// -----------------TRANSFORMATION HANDLER----------------- //
function changeTranslateValue(shapeType, idxOnContainer) {
  document.querySelector("#x-axis-translation").disabled = false;
  document.querySelector("#y-axis-translation").disabled = false;
  document.querySelector("#dilation").disabled = false;
  document.querySelector("#dilation").value = 1;
  previousScale = 0;
  document.querySelector("#rotation").disabled = false;
  previousRotate = 0;
  switch (shapeType) {
    case 1: // line
      document.querySelector("#x-axis-translation").value = container.lines[idxOnContainer].midpoint()[0];
      document.querySelector("#y-axis-translation").value = container.lines[idxOnContainer].midpoint()[1];
      previoustranslateX = container.lines[idxOnContainer].midpoint()[0];
      previoustranslateY = container.lines[idxOnContainer].midpoint()[1];
      break;
    case 2: // square
      document.querySelector("#x-axis-translation").value = container.squares[idxOnContainer].midpoint()[0];
      document.querySelector("#y-axis-translation").value = container.squares[idxOnContainer].midpoint()[1];
      previoustranslateX = container.squares[idxOnContainer].midpoint()[0];
      previoustranslateY = container.squares[idxOnContainer].midpoint()[1];
      break;
    case 3: // rectangle
      document.querySelector("#x-axis-translation").value = container.rectangles[idxOnContainer].midpoint()[0];
      document.querySelector("#y-axis-translation").value = container.rectangles[idxOnContainer].midpoint()[1];
      previoustranslateX = container.rectangles[idxOnContainer].midpoint()[0];
      previoustranslateY = container.rectangles[idxOnContainer].midpoint()[1];
      break;
    case 4: // polygon
      document.querySelector("#x-axis-translation").value = container.polygons[idxOnContainer].midpoint()[0];
      document.querySelector("#y-axis-translation").value = container.polygons[idxOnContainer].midpoint()[1];
      previoustranslateX = container.polygons[idxOnContainer].midpoint()[0];
      previoustranslateY = container.polygons[idxOnContainer].midpoint()[1];
      break;
    default:
      document.querySelector("#x-axis-translation").disabled = true;
      document.querySelector("#y-axis-translation").disabled = true;
      document.querySelector("#dilation").disabled = true;
      document.querySelector("#rotation").disabled = true;
      document.querySelector("#x-axis-translation").value = 0;
      document.querySelector("#y-axis-translation").value = 0;
      break;
  }
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
    isLineHover = true;
  } else {                // ada line yang sedang dibentuk
    container.lines[newLine].updateVertex(6,x, y);
    newLine = -1;
    isLineHover = false;
  }
  renderCanvas();
}

function lineMoveHandler(event) {
  const { x, y } = recordMouse(event);
  if(!isLineHover) {
    return;
  } else if(newLine !== -1) {
    container.lines[newLine].updateVertex(6,x, y);
  }
  renderCanvas();

}

function lineSelectHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.lines.length; i++) {
    if (container.lines[i].touch(x, y)) {
      selectedLine = i;
      changeTranslateValue(1, i);
      break;
    }
  }
}

function lineDragenterHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.lines.length; i++) {
    lineVertexDragged = container.lines[i].touchVertex(x, y);
    if (lineVertexDragged !== -1) {
      lineDragged = i
      break
    }
  }
}

function lineDragoverHandler(event){
  const { x, y } = recordMouse(event);
  if (lineDragged !== -1){
    container.lines[lineDragged].updateVertex(lineVertexDragged, x, y);
  }
  renderCanvas();
}

function lineDragleaveHandler(event){
  lineDragged = -1;
  lineVertexDragged = -1;
}


// -----------------SQUARE HANDLER----------------- //
function squareClickHandler(event) {
  const { x, y } = recordMouse(event);
  currentColor = getColor();
  if (newSquare === -1){
    let square = new Square(
      x,
      y,
      0,
      [...currentColor, ...currentColor,...currentColor, ...currentColor]
    );
    container.renderOrder.push(2);
    container.squares.push(square);
    newSquare = container.squares.length - 1;
    isSquareHover = true
  }
  else{
    container.squares[newSquare].updateVertex(30,x);
    newSquare = -1;
    isSquareHover = false;
  }
  renderCanvas();
}

function squareMoveHandler(event) {
  const { x, y } = recordMouse(event);
  if(!isSquareHover) {
    return;
  } else if(newSquare !== -1) {
    container.squares[newSquare].updateVertex(30,x);
  }
  renderCanvas();
}

function squareSelectHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.squares.length; i++) {
    if (container.squares[i].touch(x, y)) {
      selectedSquare = i;
      changeTranslateValue(2, i);
      break;
    }
  }
}

function squareDragenterHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.squares.length; i++) {
    squareVertexDragged = container.squares[i].touchVertex(x, y);
    if (squareVertexDragged !== -1) {
      squareDragged = i
      break
    }
  }
}

function squareDragoverHandler(event){
  const { x, y } = recordMouse(event);
  if (squareDragged !== -1){
    container.squares[squareDragged].updateVertex(squareVertexDragged, x, y);
  }
  renderCanvas();
}

function squareDragleaveHandler(event){
  squareDragged = -1;
  squareVertexDragged = -1;
}


// -----------------RECTANGLE HANDLER----------------- //
function rectangleClickHandler(event) {
  const { x, y } = recordMouse(event);
  currentColor = getColor();
  if (newRect === -1){
    let rectangle = new Rectangle(
      x,
      y,
      0,
      0,
      [...currentColor, ...currentColor,...currentColor, ...currentColor]
    );
    container.renderOrder.push(3);
    container.rectangles.push(rectangle);
    newRect = container.rectangles.length - 1;
    isRectHover = true
  }
  else{
    let rectangle_idx = container.rectangles.length - 1;
    container.rectangles[rectangle_idx].updateVertex(30, x, y);
    newRect = -1;
    isRectHover = false;
  }
  renderCanvas();
}

function rectangleMoveHandler(event) {
  const { x, y } = recordMouse(event);
  if(!isRectHover) {
    return;
  } else if(newRect !== -1) {
    container.rectangles[newRect].updateVertex(30, x, y);
  }
  renderCanvas();
}

function rectangleSelectHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.rectangles.length; i++) {
    if (container.rectangles[i].touch(x, y)) {
      selectedRect = i;
      changeTranslateValue(3, i);
      break;
    }
  }
}

function rectangleDragenterHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.rectangles.length; i++) {
    rectVertexDragged = container.rectangles[i].touchVertex(x, y);
    if (rectVertexDragged !== -1) {
      rectDragged = i
      break
    }
  }
}

function rectangleDragoverHandler(event){
  const { x, y } = recordMouse(event);
  if (rectDragged !== -1){
    container.rectangles[rectDragged].updateVertex(rectVertexDragged, x, y);
  }
  renderCanvas();
}

function rectangleDragleaveHandler(event){
  rectDragged = -1;
  rectVertexDragged = -1;
}


// -----------------POLYGON HANDLER----------------- //

function polygonClickHandler(event) {
  const { x, y } = recordMouse(event);
  currentColor = getColor();

  if (newPolygon === -1){
    let polygon = new Polygon();
    container.renderOrder.push(4);
    polygon.addVertex(x, y,[...currentColor]);
    polygon.addVertex(x, y,[...currentColor]);
    container.polygons.push(polygon);
    newPolygon = container.polygons.length - 1;
    isPolygonHover = true
  }
  else{
    let polygon_idx = container.polygons.length - 1;
    container.polygons[polygon_idx].addVertex(x, y, [...currentColor]);
  }
  renderCanvas();
}

function polygonMoveHandler(event) {
  const { x, y } = recordMouse(event);
  if(!isPolygonHover) {
    return;
  } else if(newPolygon !== -1) {
    container.polygons[newPolygon].updateVertex(container.polygons[newPolygon].data.length -6, x, y);
  }
  renderCanvas();
}

function polygonSelectHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.polygons.length; i++) {
    if (container.polygons[i].touch(x, y, document.querySelector("#convexhull").checked)) {
      selectedPolygon = i;
      changeTranslateValue(4, i);
      break;
    }
  }
}

function polygonDragenterHandler(event) {
  const { x, y } = recordMouse(event);
  for (let i = 0; i < container.polygons.length; i++) {
    polygonVertexDragged = container.polygons[i].touchVertex(x, y);
    if (polygonVertexDragged !== -1) {
      polygonDragged = i
      break
    }
  }
}

function polygonDragoverHandler(event){
  const { x, y } = recordMouse(event);
  if (polygonDragged !== -1){
    container.polygons[polygonDragged].updateVertex(polygonVertexDragged, x, y);
  }
  renderCanvas();
}

function polygonDragleaveHandler(event){
  polygonDragged = -1;
  polygonVertexDragged = -1;
}

// -----------------SHAPE HANDLER----------------- //

// get chosen shape's information
function getShapeInfo(event) {
  let shapeType = 0,
      idxOnContainer = -1,
      idx = -1,
      touchedPoint = -1,
      isFound = false;
  let { x, y } = recordMouse(event);

  // check Lines
  for (let i = 0; !isFound && i < container.lines.length; i++) {
    touchedPoint = container.lines[i].touchVertex(x, y);
    if (touchedPoint !== -1) {
      shapeType = 1;
      idxOnContainer = i;
      idx = touchedPoint;
      isFound = true;
      break;
    }
  }

  // check Squares
  for (let i = 0; !isFound && i < container.squares.length; i++) {
    touchedPoint = container.squares[i].touchVertex(x, y);
    if (touchedPoint !== -1) {
      shapeType = 2;
      idxOnContainer = i;
      idx = touchedPoint;
      isFound = true;
      break;
    }
  }

  // check Rectangles
  for (let i = 0; !isFound && i < container.rectangles.length; i++) {
    touchedPoint = container.rectangles[i].touchVertex(x, y);
    if (touchedPoint !== -1) {
      shapeType = 3;
      idxOnContainer = i;
      idx = touchedPoint;
      isFound = true;
      break;
    }
  }

  // check Polygons
  for (let i = 0; !isFound && i < container.polygons.length; i++) {
    touchedPoint = container.polygons[i].touchVertex(x, y);
    if (touchedPoint !== -1) {
      shapeType = 4;
      idxOnContainer = i;
      idx = touchedPoint;
      break;
    }
  }
  return { shapeType, idxOnContainer, idx };
}

// -----------------EVENT HANDLER----------------- //
function eventHandler() {
  canvas.addEventListener("mousedown", function (event) {

    if (document.querySelector("#draw").checked) {          // draw mode
      if (document.querySelector("#line").checked) {
        lineClickHandler(event);
      } else if (document.querySelector("#square").checked) {
        squareClickHandler(event);
      }
      else if (document.querySelector("#rectangle").checked) {
        rectangleClickHandler(event);
      }
      else if (document.querySelector("#polygon").checked) {
        polygonClickHandler(event);
      }
    } else if (document.querySelector("#edit").checked) {    // edit mode
      // get shape's information
      let { shapeType, idxOnContainer, idx } = getShapeInfo(event);
      // change color
      changeColor(shapeType, idxOnContainer, idx);

      // translate
      if(shapeType == 0) {
        changeTranslateValue(shapeType, idxOnContainer);
      }

      // Change shape's vertex by dragging

      if (document.querySelector("#line").checked) {
        lineSelectHandler(event);
        lineDragenterHandler(event);
      } else if (document.querySelector("#square").checked) {
        squareSelectHandler(event);
        squareDragenterHandler(event);
      }
      else if (document.querySelector("#rectangle").checked) {
        rectangleSelectHandler(event);
        rectangleDragenterHandler(event);
      }
      else if (document.querySelector("#polygon").checked) {
        polygonSelectHandler(event);
        polygonDragenterHandler(event);
      }
    }
  });

  canvas.addEventListener("mousemove", function (event) {
    const {x,y} = recordMouse(event);
    mouseX = x
    mouseY = y 

    if (document.querySelector("#draw").checked) {
      if (document.querySelector("#line").checked) {
        lineMoveHandler(event);
      } else if (document.querySelector("#square").checked) {
        squareMoveHandler(event);
      } else if (document.querySelector("#rectangle").checked) {
        rectangleMoveHandler(event);
      } else if (document.querySelector("#polygon").checked) {
        polygonMoveHandler(event);
      }
    } else if (document.querySelector("#edit").checked) {    // edit mode

      // MOVE VERTEX
        if (document.querySelector("#line").checked) {
          lineDragoverHandler(event);
        } else if (document.querySelector("#square").checked) {
          squareDragoverHandler(event);
        }
        else if (document.querySelector("#rectangle").checked) {
          rectangleDragoverHandler(event);
        }
        else if (document.querySelector("#polygon").checked) {
          polygonDragoverHandler(event);
        }
    }
  })

  canvas.addEventListener("mouseup", function (event) {

    if (document.querySelector("#line").checked) {
      lineDragleaveHandler(event);
    } else if (document.querySelector("#square").checked) {
      squareDragleaveHandler(event);
    }
    else if (document.querySelector("#rectangle").checked) {
      rectangleDragleaveHandler(event);
    }
    else if (document.querySelector("#polygon").checked) {
      polygonDragleaveHandler(event);
    }
    });

  window.addEventListener("keydown", function (event) {
    console.log(event.key , event.code)
    if (document.querySelector("#draw").checked){   // draw mode
      if (isPolygonHover){
        if (event.code == "Enter") {
          event.preventDefault();
          isPolygonHover = false;
          newPolygon = -1;
          renderCanvas();
        }
      }
    }else{                                          // edit mode
      if (event.code == "Backspace" || event.code == "Delete") {
        let idx_poligon = -1;
        for (let i = 0; i < container.polygons.length; i++) {
          idx_poligon = container.polygons[i].touchVertex(mouseX, mouseY);
          if (idx_poligon != -1) {
            container.polygons[i].removeVertex(idx_poligon);
            renderCanvas();
            break;
          }
        }
      }
      if(event.code == "Space"){
        let idx_poligon = -1;
        for (let i = 0; i < container.polygons.length; i++) {
          idx_poligon = container.polygons[i].touchVertex(mouseX, mouseY);
          if (idx_poligon != -1) {
            container.polygons[i].changeLock(idx_poligon);
            renderCanvas();
            break;
          }
        }
      }
    }
  });

  const translateX = document.querySelector("#x-axis-translation");
  translateX.addEventListener("input", () => {
    if (document.querySelector("#line").checked) {
      container.lines[selectedLine].translate(translateX.value - previoustranslateX, 0);
      previoustranslateX = translateX.value;
    } else if (document.querySelector("#square").checked) {
      container.squares[selectedSquare].translate(translateX.value - previoustranslateX, 0);
      previoustranslateX = translateX.value;
    } else if (document.querySelector("#rectangle").checked) {
      container.rectangles[selectedRect].translate(translateX.value - previoustranslateX, 0);
      previoustranslateX = translateX.value;
    } else if (document.querySelector("#polygon").checked) {
      container.polygons[selectedPolygon].translate(translateX.value - previoustranslateX, 0);
      previoustranslateX = translateX.value;
    }
    renderCanvas();
  });

  const translateY = document.querySelector("#y-axis-translation");
  translateY.addEventListener("input", () => {
    if (document.querySelector("#line").checked) {
      container.lines[selectedLine].translate(0, translateY.value - previoustranslateY);
      previoustranslateY = translateY.value;
    } else if (document.querySelector("#square").checked) {
      container.squares[selectedSquare].translate(0, translateY.value - previoustranslateY);
      previoustranslateY = translateY.value;
    } else if (document.querySelector("#rectangle").checked) {
      container.rectangles[selectedRect].translate(0, translateY.value - previoustranslateY);
      previoustranslateY = translateY.value;
    } else if (document.querySelector("#polygon").checked) {
      container.polygons[selectedPolygon].translate(0, translateY.value - previoustranslateY);
      previoustranslateY = translateY.value;
    }
    renderCanvas();
  });

  const dilation = document.querySelector("#dilation");
  dilation.addEventListener("input", () => {
    if (document.querySelector("#line").checked) {
      container.lines[selectedLine].dilate(dilation.value - previousScale);
      previousScale = dilation.value - 1;
    } else if (document.querySelector("#square").checked) {
      container.squares[selectedSquare].dilate(dilation.value - previousScale);
      previousScale = dilation.value - 1;
    } else if (document.querySelector("#rectangle").checked) {
      container.rectangles[selectedRect].dilate(dilation.value - previousScale);
      previousScale = dilation.value - 1;
    } else if (document.querySelector("#polygon").checked) {
      container.polygons[selectedPolygon].dilate(dilation.value - previousScale);
      previousScale = dilation.value - 1;
    }
    renderCanvas();
  });

  const rotation = document.querySelector("#rotation");
  rotation.addEventListener("input", () => {
    if (document.querySelector("#line").checked) {
      container.lines[selectedLine].rotate(previousRotate - rotation.value);
      previousRotate = rotation.value;
    } else if (document.querySelector("#square").checked) {
      container.squares[selectedSquare].rotate(previousRotate - rotation.value);
      previousRotate = rotation.value;
    } else if (document.querySelector("#rectangle").checked) {
      container.rectangles[selectedRect].rotate(previousRotate - rotation.value);
      previousRotate = rotation.value;
    } else if (document.querySelector("#polygon").checked) {
      container.polygons[selectedPolygon].rotate(previousRotate - rotation.value);
      previousRotate = rotation.value;
    }
    renderCanvas();
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

  const convexHull = document.querySelector("#convexhull")
  convexHull.addEventListener("click", () => {
    renderCanvas();
  }
  );
  const saveBtn = document.querySelector("#save");
  saveBtn.addEventListener("click", () => {
    // define models
    const models = {
      renderOrder : container.renderOrder,
      lines       : container.lines,
      squares     : container.squares,
      rectangles  : container.rectangles,
      polygons    : container.polygons
    };
    // parse to JSON
    let content = JSON.stringify(models);

    // create BLOB to store models
    const a = document.createElement("a");
    const blob = new Blob([content], { type: "json" });
    a.href = URL.createObjectURL(blob);
    a.download = "models.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });


  const loadFile = document.querySelector('#load-src');
  loadFile.addEventListener('change', (e) => {
    // prevent reloading page
    e.preventDefault();

    if (!loadFile.value.length) return;

    // get file
    let reader = new FileReader();
	  reader.onload = (e) => {
      function retrieveColor(data) {
        let color = [];
        for (let i = 0; i < data.length; i+=6) {
          color.push([data[i+2], data[i+3], data[i+4], data[i+5]]);
        }
        return color;
      }

      // parse JSON
      const models = JSON.parse(e.target.result);
      // load models
      container.renderOrder = models.renderOrder;

      models.lines.forEach((line) => {
        const x1 = line.data[0], y1 = line.data[1], x2 = line.data[6], y2 = line.data[7];
        const color = retrieveColor(line.data);
        container.lines.push(new Line(x1, y1, x2, y2, [...color[0], ...color[1]]));
      });
      models.squares.forEach((square) => {
        const x = square.data[0], y = square.data[1];
        const size = square.data[6] - x;
        const color = retrieveColor(square.data);
        container.squares.push(new Square(x, y, size, [...color[0], ...color[1], ...color[2], ...color[5]]));
      });
      models.rectangles.forEach((rectangle) => {
        const x = rectangle.data[0], y = rectangle.data[1];
        const width = rectangle.data[6] - x;
        const height = y - rectangle.data[13];
        const color = retrieveColor(rectangle.data);
        container.rectangles.push(new Rectangle(x, y, width, height, [...color[0], ...color[1], ...color[2], ...color[5]]));
      });
      models.polygons.forEach((polygon) => {
        let loadedPoly = new Polygon();
        loadedPoly.data=[...polygon.data];
        loadedPoly.lock=[...polygon.lock];
        container.polygons.push(loadedPoly);
      });
      // render canvas
      renderCanvas();
    }

    reader.readAsText(loadFile.files[0]);

  });

}

window.onload = main;
