let VERTEX_SHADER = `
  precision mediump float;
  attribute vec3 a_Position;
  uniform float u_Size;
  void main() {
    gl_Position = vec4(a_Position, 1.0);
    gl_PointSize = u_Size;
  }
`;
let FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec4 u_Color;
  void main() {
    gl_FragColor = u_Color;
  }
`;

let gl;
let canvas;
let a_Position;
let u_Color;
let u_Size;
let g_shapesList = [];
let g_selectedType = 'point';
let ShapeColor = [0.0, 0.1, 1.0];
let g_selectedSize = 10;
let g_selectedSegments = 12;

class Point {
constructor(x, y, color, size){
  this.x = x; this.y = y;
  this.color = color;
  this.size = size;
  this.alpha = 1.0;
}
render(){
  gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.alpha);
  gl.uniform1f(u_Size, this.size);
let verts = new Float32Array([this.x, this.y, 0.0]);
  loadBuffer(verts);
  gl.drawArrays(gl.POINTS, 0, 1);
}
}

class Triangle {
constructor(x, y, color, size){
  this.x = x; this.y = y;
  this.color = color;
  this.size = size / 200;
  this.alpha = 1.0;
}

render(){
  gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.alpha);
  let d = this.size;
  let verts = new Float32Array([
    this.x,       this.y + d,   0,
    this.x - d,   this.y - d,   0,
    this.x + d,   this.y - d,   0
]);

loadBuffer(verts);
gl.drawArrays(gl.TRIANGLES, 0, 3);
}
}

class Square {
constructor(x, y, color, size){
  this.x = x; this.y = y;
  this.color = color;
  this.size = size / 200;
  this.alpha = 1.0;
}
render(){

  gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.alpha);
  let d = this.size;
  let x = this.x, y = this.y;
  let verts = new Float32Array([
    x-d, y-d, 0,   x+d, y-d, 0,   x+d, y+d, 0,
    x-d, y-d, 0,   x+d, y+d, 0,   x-d, y+d, 0
  ]);
  loadBuffer(verts);
  gl.drawArrays(gl.TRIANGLES, 0, 6);
}
}

class Circle {
  constructor(x, y, color, size, segments){
    this.x = x; this.y = y;
    this.color = color;
    this.size = size / 200;
    this.segments = segments;
    this.alpha = 1.0;
  }

  render(){
    gl.uniform4f(u_Color, this.color[0], this.color[1], this.color[2], this.alpha);
    let r = this.size;
    let verts = [];
    for(let i = 0; i < this.segments; i++){
      let angle1 = (i / this.segments) * 2 * Math.PI;
      let angle2 = ((i + 1) / this.segments) * 2 * Math.PI;
      verts.push(this.x, this.y, 0);
      verts.push(this.x + r * Math.cos(angle1), this.y + r * Math.sin(angle1), 0);
      verts.push(this.x + r * Math.cos(angle2), this.y + r * Math.sin(angle2), 0);
    }
    loadBuffer(new Float32Array(verts));
    gl.drawArrays(gl.TRIANGLES, 0, this.segments * 3);
  }
}


function loadBuffer(verts){
  let buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, verts, gl.STATIC_DRAW);
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);
}


function setupWebGL(){
  canvas = document.getElementById("webgl");
  gl = canvas.getContext("webgl", { preserveDrawingBuffer: true});
  if(!gl){
    console.log("Failed to get WebGL context.")
    return;
  }
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
}

function connectVariablesToGLSL(){
  if(!initShaders(gl, VERTEX_SHADER, FRAGMENT_SHADER)){
    console.log("Failed to load shaders.");
    return -1;
}

a_Position = gl.getAttribLocation(gl.program, "a_Position");
u_Color = gl.getUniformLocation(gl.program, "u_Color");
u_Size = gl.getUniformLocation(gl.program, "u_Size");
}


function click(ev){
  if(ev.type === 'mousemove' && ev.buttons !== 1) return;
  let rect = canvas.getBoundingClientRect();
  let x = ((ev.clientX - rect.left) / canvas.width) * 2 - 1;
  let y = ((ev.clientY - rect.top) / canvas.height) * -2 + 1;
  let color = [ShapeColor[0], ShapeColor[1], ShapeColor[2]];
  let shape;
  if(g_selectedType === 'triangle') shape = new Triangle(x, y, color, g_selectedSize);
  else if(g_selectedType === 'square') shape = new Square(x, y, color, g_selectedSize);
  else if(g_selectedType === 'circle') shape = new Circle(x, y, color, g_selectedSize, g_selectedSegments);
  else shape = new Point(x, y, color, g_selectedSize);
  g_shapesList.push(shape);
}

function renderAllShapes(){
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  g_shapesList = g_shapesList.filter(shape => {
    shape.alpha -= 0.008;
    return shape.alpha > 0;
  });
  for(let shape of g_shapesList) shape.render();
}


function tick(){
  renderAllShapes();
  requestAnimationFrame(tick);
}

function main(){
  setupWebGL();
  connectVariablesToGLSL();
  canvas.onmousedown = click;
  canvas.onmousemove = click;
  document.getElementById("redSlider").oninput = function(){ ShapeColor[0] = this.value/100; };
  document.getElementById("greenSlider").oninput = function(){ ShapeColor[1] = this.value/100; };
  document.getElementById("blueSlider").oninput = function(){ ShapeColor[2] = this.value/100; };
  document.getElementById("sizeSlider").oninput = function(){ g_selectedSize = parseInt(this.value); };
  document.getElementById("segSlider").oninput = function(){ g_selectedSegments = parseInt(this.value); };
  tick();
}