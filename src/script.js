function main() {
  const canvas = document.querySelector("#canvas");
  const gl = WebGLUtils.setupWebGL(canvas);
  if (!gl) {
    return;
  }

  // Get the strings for our GLSL shaders
  const vertexShaderSource = document.querySelector("#vertex-shader-2d").text;
  const fragmentShaderSource = document.querySelector("#fragment-shader-2d").text;

  // create GLSL shaders, upload the GLSL source, compile the shaders
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  const program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  const positionLocation = gl.getAttribLocation(program, "a_position");
  const colorLocation = gl.getAttribLocation(program, "a_color");

  // lookup uniforms
  const matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a buffer for the positions.
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  // // Set Geometry.
  drawRectangle(gl, 0, 0, 100, 100)

  // Create a buffer for the colors.
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  // Set the colors.
  setColors(gl);

  
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
    gl.uniformMatrix3fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

main();
