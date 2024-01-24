const detail = 0.1;
const paddingPX = 15;
const bezierStengthConst = 0.7;

const lineColour = 'rgba(255,255,255,1)';
const backgroundColour = 'rgba(0,0,0,1)';

const circleWidth = 10;
const innerCircleWidth = 5;
const circlePadding = 4;

let canvasHeight;
let canvas;
let ctx;

let graph;

export function graphSetup () {
  graph = document.getElementById('graph');

  canvasHeight = graph.parentNode.clientHeight;
  canvas = document.getElementById('graph');
  if (canvas.getContext) {
    ctx = canvas.getContext('2d');
  } else {
    console.log('Canvas is not supported!!');
  }
  // equals window dimension
  canvas.height = canvasHeight;
}

export function drawGraph (numTasksCompletedList) {
  canvas.width = graph.parentNode.clientWidth;

  const bezierStength = bezierStengthConst / numTasksCompletedList.length;

  const gapBetweenDays = canvas.width / numTasksCompletedList.length;
  ctx.lineWidth = 5;

  const taskCoords = computeTaskCoords(numTasksCompletedList, canvas, gapBetweenDays, paddingPX);

  drawBeziers(ctx, canvas, taskCoords, numTasksCompletedList, bezierStength);

  drawDots(ctx, canvas, taskCoords);
}

function computeTaskCoords (numTasksCompletedList, canvas, gapBetweenDays, padding) {
  const maxTasks = Math.max(Math.max(...numTasksCompletedList), 1);

  const coords = [];
  for (let taskI = 0; taskI < numTasksCompletedList.length; taskI++) {
    const coord = [
      (taskI + 0.5) * gapBetweenDays,
      padding + (canvas.height - 2 * padding) * (maxTasks - numTasksCompletedList[taskI]) / maxTasks
    ];
    coords.push(coord);
  }
  return coords;
}

function drawDots (ctx, canvas, taskCoords) {
  for (const taskCoord of taskCoords) {
    drawCircle(ctx, taskCoord[0], taskCoord[1], circleWidth + circlePadding, backgroundColour);
    drawCircle(ctx, taskCoord[0], taskCoord[1], circleWidth, lineColour);
    drawCircle(ctx, taskCoord[0], taskCoord[1], innerCircleWidth, backgroundColour);
  }
}

function drawBeziers (ctx, canvas, taskCoords, numTasksCompletedList, bezierStength) {
  for (let bezierI = 0; bezierI < numTasksCompletedList.length - 1; bezierI++) {
    const controlPoints = [
      [taskCoords[bezierI][0], taskCoords[bezierI][1]],
      [taskCoords[bezierI][0] + bezierStength * canvas.width, taskCoords[bezierI][1]],
      [taskCoords[bezierI + 1][0] - bezierStength * canvas.width, taskCoords[bezierI + 1][1]],
      [taskCoords[bezierI + 1][0], taskCoords[bezierI + 1][1]]
    ];

    drawBezier(controlPoints);
  }
  drawLine(ctx, [0, taskCoords[0][1]], taskCoords[0], lineColour);
}

function drawBezier (controlPoints) {
  let lastPoint = null;
  for (let sectionI = 0; sectionI < 1; sectionI = sectionI + detail) {
    const point = GetBezierValue(controlPoints, sectionI);
    if (sectionI > 0) {
      drawLine(ctx, point, lastPoint, lineColour);
    }
    lastPoint = point;
  }
}

function GetBezierValue (CP, i) {
  const rI = 1 - i;

  const firstTerm = VectorFloatMult(rI ** 3, CP[0]);
  const secondTerm = VectorFloatMult(3 * rI ** 2 * i, CP[1]);
  const thirdTerm = VectorFloatMult(3 * rI * i ** 2, CP[2]);
  const fourthTerm = VectorFloatMult(i ** 3, CP[3]);
  // console.log(first_term, second_term, third_term, fourth_term)
  const value = addVecs(firstTerm, addVecs(secondTerm, addVecs(thirdTerm, fourthTerm)));

  return value;
}

function drawLine (ctx, p1, p2, fill) {
  ctx.beginPath();
  ctx.moveTo(p1[0], p1[1]);
  ctx.lineTo(p2[0], p2[1]);
  ctx.closePath();
  ctx.stroke();
  if (fill) {
    ctx.strokeStyle = fill;
    ctx.fill();
  }
}

function VectorFloatMult (f, v) {
  return [v[0] * f, v[1] * f];
}

function addVecs (a, b) {
  return [a[0] + b[0], a[1] + b[1]];
}

function drawCircle (ctx, x, y, radius, fill, stroke, strokeWidth) {
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
  if (fill) {
    ctx.fillStyle = fill;
    ctx.fill();
  }
  if (stroke) {
    ctx.lineWidth = strokeWidth;
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }
}

export function clearCanvas () {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
