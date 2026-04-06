// asg0.js
var canvas;
var ctx;

function main() {
  canvas = document.getElementById('cnv1');
  if (!canvas) {
    console.log('Failed to retrieve the <canvas> element');
    return false;
  }
  ctx = canvas.getContext('2d');
  // Black background
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Draw a vector v (Vector3) from the canvas center, using the given color.
 * Coordinates are scaled by 20 so that unit vectors are clearly visible.
 */
function drawVector(v, color) {
  let cx = canvas.width / 2;
  let cy = canvas.height / 2;
  let scale = 20;

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  // Canvas y-axis is flipped relative to math convention
  ctx.lineTo(cx + v.elements[0] * scale, cy - v.elements[1] * scale);
  ctx.stroke();
}

/**
 * Called when the user clicks the "Draw" button (v1 / v2 only).
 */
function handleDrawEvent() {
  // Clear canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Read v1
  let x1 = parseFloat(document.getElementById('v1x').value) || 0;
  let y1 = parseFloat(document.getElementById('v1y').value) || 0;
  let v1 = new Vector3([x1, y1, 0]);
  drawVector(v1, 'red');

  // Read v2
  let x2 = parseFloat(document.getElementById('v2x').value) || 0;
  let y2 = parseFloat(document.getElementById('v2y').value) || 0;
  let v2 = new Vector3([x2, y2, 0]);
  drawVector(v2, 'blue');
}

/**
 * Called when the user clicks the operation "Draw" button.
 */
function handleDrawOperationEvent() {
  // Clear canvas
  ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Read v1 and v2
  let x1 = parseFloat(document.getElementById('v1x').value) || 0;
  let y1 = parseFloat(document.getElementById('v1y').value) || 0;
  let v1 = new Vector3([x1, y1, 0]);
  drawVector(v1, 'red');

  let x2 = parseFloat(document.getElementById('v2x').value) || 0;
  let y2 = parseFloat(document.getElementById('v2y').value) || 0;
  let v2 = new Vector3([x2, y2, 0]);
  drawVector(v2, 'blue');

  let op = document.getElementById('op-select').value;
  let scalar = parseFloat(document.getElementById('scalar').value) || 1;

  if (op === 'add') {
    let v3 = new Vector3([x1, y1, 0]);
    v3.add(v2);
    drawVector(v3, 'green');

  } else if (op === 'sub') {
    let v3 = new Vector3([x1, y1, 0]);
    v3.sub(v2);
    drawVector(v3, 'green');

  } else if (op === 'mul') {
    let v3 = new Vector3([x1, y1, 0]);
    v3.mul(scalar);
    drawVector(v3, 'green');

    let v4 = new Vector3([x2, y2, 0]);
    v4.mul(scalar);
    drawVector(v4, 'green');

  } else if (op === 'div') {
    let v3 = new Vector3([x1, y1, 0]);
    v3.div(scalar);
    drawVector(v3, 'green');

    let v4 = new Vector3([x2, y2, 0]);
    v4.div(scalar);
    drawVector(v4, 'green');

  } else if (op === 'magnitude') {
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();
    console.log('Magnitude of v1: ' + mag1);
    console.log('Magnitude of v2: ' + mag2);

    let v3 = new Vector3([x1, y1, 0]);
    v3.normalize();
    drawVector(v3, 'green');

    let v4 = new Vector3([x2, y2, 0]);
    v4.normalize();
    drawVector(v4, 'green');

  } else if (op === 'normalize') {
    let mag1 = v1.magnitude();
    let mag2 = v2.magnitude();
    console.log('Magnitude of v1: ' + mag1);
    console.log('Magnitude of v2: ' + mag2);

    let v3 = new Vector3([x1, y1, 0]);
    v3.normalize();
    drawVector(v3, 'green');

    let v4 = new Vector3([x2, y2, 0]);
    v4.normalize();
    drawVector(v4, 'green');

  } else if (op === 'angle') {
    let angle = angleBetween(v1, v2);
    console.log('Angle between v1 and v2: ' + angle + ' degrees');

  } else if (op === 'area') {
    let area = areaTriangle(v1, v2);
    console.log('Area of triangle formed by v1 and v2: ' + area);
  }
}

/**
 * Compute the angle (in degrees) between v1 and v2 using the dot product.
 */
function angleBetween(v1, v2) {
  let dotVal = Vector3.dot(v1, v2);
  let mag1 = v1.magnitude();
  let mag2 = v2.magnitude();
  if (mag1 === 0 || mag2 === 0) return 0;
  let cosAlpha = dotVal / (mag1 * mag2);
  // Clamp to [-1, 1] to avoid NaN from floating point errors
  cosAlpha = Math.max(-1, Math.min(1, cosAlpha));
  let angleRad = Math.acos(cosAlpha);
  return angleRad * (180 / Math.PI);
}

/**
 * Compute the area of the triangle formed by v1 and v2.
 * Area = ||v1 x v2|| / 2
 */
function areaTriangle(v1, v2) {
  let crossVec = Vector3.cross(v1, v2);
  return crossVec.magnitude() / 2;
}