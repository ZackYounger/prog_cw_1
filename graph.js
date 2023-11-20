const detail = 0.1;
const paddingPX = 30;
var bezierStength = .7;

const lineColour = 'rgba(255,255,255,1)'
const backgroundColour = 'rgba(0,0,0,1)'

const circleWidth = 10;
const innerCircleWidth = 5;
const circlePadding = 4;

function graphAnimation(tasksCompleted) {

    canvas = document.getElementById('graph');
    console.log(graph.parentNode)
    canvas.width = graph.parentNode.clientWidth;     // equals window dimension
    canvas.height = graph.parentNode.clientHeight;

    if (canvas.getContext) {
        ctx = canvas.getContext('2d');
    } else {
        console.log("Canvas is not supported!!")
    }

    bezierStength = bezierStength / tasksCompleted.length;

    gapBetweenDays = canvas.width / tasksCompleted.length;
    ctx.lineWidth = 5;

    taskCoords = computeTaskCoords(tasksCompleted, canvas, gapBetweenDays, paddingPX);

    drawBeziers(ctx, canvas, taskCoords, tasksCompleted);

    drawDots(ctx, canvas, taskCoords);
}

function computeTaskCoords(tasksCompleted, canvas, gapBetweenDays, padding) {
    
    maxTasks = Math.max(...tasksCompleted);

    coords = []
    for (taskI=0; taskI < tasksCompleted.length; taskI++) {
        coord = [
            (taskI+.5) * gapBetweenDays,
            padding + ( canvas.height - 2*padding ) * (maxTasks - tasksCompleted[taskI])/maxTasks
        ];
        coords.push(coord);
    }
    return coords
}

function drawDots(ctx, canvas, taskCoords) {

    for(taskCoord of taskCoords) {

        drawCircle(ctx, taskCoord[0], taskCoord[1], circleWidth + circlePadding, backgroundColour)
        drawCircle(ctx, taskCoord[0], taskCoord[1], circleWidth, lineColour)
        drawCircle(ctx, taskCoord[0], taskCoord[1], innerCircleWidth, backgroundColour)

    }

}

function drawBeziers(ctx, canvas, taskCoords, tasksCompleted) {

    maxTasks = Math.max(...tasksCompleted);

    //ctx.fillStyle = "rgba(0, 100, 150, 1)";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(bezierI=0; bezierI<tasksCompleted.length-1; bezierI++) {


        controlPoints = [
            [taskCoords[bezierI][0], taskCoords[bezierI][1]],
            [taskCoords[bezierI][0] + bezierStength * canvas.width, taskCoords[bezierI][1]],
            [taskCoords[bezierI+1][0] - bezierStength * canvas.width, taskCoords[bezierI+1][1]],
            [taskCoords[bezierI+1][0], taskCoords[bezierI+1][1]]
                        ]
        
        drawBezier(controlPoints);

    }
    //connect the end
    drawLine(ctx, [0, taskCoords[0][1]], taskCoords[0], lineColour)
}

function drawBezier(controlPoints) {

    for(sectionI=0; sectionI<1; sectionI = sectionI + detail) {

        point = GetBezierValue(controlPoints, sectionI)
        if (sectionI>0) {
            drawLine( ctx, point, lastPoint, lineColour );
        }
        lastPoint = point;

    }
}

function GetBezierValue(CP, i) {
    r_i = 1-i;

    first_term = VectorFloatMult( r_i**3, CP[0])
    second_term = VectorFloatMult( 3 * r_i**2 * i, CP[1])
    third_term = VectorFloatMult( 3 * r_i * i**2, CP[2])
    fourth_term = VectorFloatMult( i**3 , CP[3])
    //console.log(first_term, second_term, third_term, fourth_term)
    value = addVecs( first_term, addVecs( second_term, addVecs( third_term, fourth_term ) ) )

    return value
}


function drawLine(ctx, p1,p2, fill) {
    ctx.beginPath();
    ctx.moveTo(p1[0],p1[1]);
    ctx.lineTo(p2[0],p2[1]);
    ctx.closePath();
    ctx.stroke();
    if (fill) {
        ctx.strokeStyle = fill;
        ctx.fill();
    }
}

function VectorFloatMult(f, v) {
    return [v[0]*f, v[1]*f]
}

function addVecs(a, b) {
    return [a[0]+b[0], a[1]+b[1]]
}

function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
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