const detail = 0.1;
const paddingPX = 30;
const bezierStength = .5;
const lineColour = 'rgba(255,255,255,1)'

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

    gapBetweenDays = canvas.width / tasksCompleted.length;
    ctx.lineWidth = 5;

    taskCoords = computeTaskCoords(tasksCompleted, canvas, gapBetweenDays, paddingPX);

    drawBeziers(ctx, canvas, tasksCompleted, paddingPX, gapBetweenDays);

    drawDots(ctx, canvas, tasksCompleted);
}

function computeTaskCoords(tasksCompleted, canvas, gapBetweenDays, padding) {
    
    maxTasks = Math.max(...tasksCompleted);

    coords = []
    for (taskI=0; taskI < tasksCompleted.length; taskI++) {
        coord = [
            (taskI+.5) * gapBetweenDays,
            padding + ( canvas.height - 2*padding ) * tasksCompleted[taskI]/maxTasks
        ];
        coords.push(coord);
    }
    return coords
}

function drawDots(ctx, canvas, tasksCompleted) {

    for(taskI=0; taskI < tasksCompleted.length; taskI++) {
        position = [endPointsX[0], padding + ( canvas.height - 2*padding ) * tasksCompleted[bezierI]/maxTasks]
        drawCircle(ctx, )
    }

}

function drawBeziers(ctx, canvas, tasksCompleted, padding, gapBetweenDays) {

    maxTasks = Math.max(...tasksCompleted);

    //ctx.fillStyle = "rgba(0, 100, 150, 1)";
    //ctx.fillRect(0, 0, canvas.width, canvas.height);

    for(bezierI=0; bezierI<tasksCompleted.length-1; bezierI++) {

        endPointsX = [(bezierI+.5) * gapBetweenDays, (bezierI+1.5) * gapBetweenDays]
        controlPoints = [
            [endPointsX[0], padding + ( canvas.height - 2*padding ) * tasksCompleted[bezierI]/maxTasks],
            [endPointsX[0] + bezierStength*gapBetweenDays, padding + ( canvas.height - 2*padding ) * tasksCompleted[bezierI]/maxTasks],
            [endPointsX[1] - bezierStength*gapBetweenDays, padding + ( canvas.height - 2*padding ) * tasksCompleted[bezierI+1]/maxTasks],
            [endPointsX[1], padding + ( canvas.height - 2*padding ) * tasksCompleted[bezierI+1]/maxTasks]
                        ]
                        console.log(controlPoints)
        
        drawBezier(controlPoints);

    }
}

function drawBezier(controlPoints) {

    for (CP of controlPoints) {
        //drawCircle(ctx, CP[0], CP[1], 5, 'rgba(255,255,255,1)')
    }

    for(sectionI=0; sectionI<1; sectionI = sectionI + detail) {

        point = GetBezierValue(controlPoints, sectionI)
        console.log(point)
        if (sectionI>0) {
            drawLine( ctx, point, lastPoint, lineColour );
            console.log('drawing')
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