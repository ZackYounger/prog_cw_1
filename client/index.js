n = 10
/*
numTasksSet = []
numTasksCompleted = []
for(i=0;i<n;i++) numTasksSet.push( Math.floor(Math.random() * 10) )
for(i=0;i<n;i++) numTasksCompleted.push( Math.min(numTasksSet[i], Math.floor(Math.random() * 10) ) )

previousDaysTasks = [
    {day:1, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:2, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:3, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:true},{text:"Walk the Cat", completed:true}] },
    {day:4, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:5, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:6, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:true}] },
    {day:7, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:8, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:9, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:10,month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
]

nextDaysTasks = [
    {day:1, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:2, month:7, year:2023, tasks: [{text:"Get Soup", completed:false}] },
    {day:3, month:7, year:2023, tasks: [{text:"Go for a run", completed:false},{text:"Walk the Cat", completed:true}] },
    {day:4, month:7, year:2023, tasks: [{text:"Feed my sister", completed:false}] },
    {day:5, month:7, year:2023, tasks: [{text:"Buy more soup", completed:false}] },
    {day:6, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}, {text:"Buy more soup", completed:false}, {text:"Buy even more soup", completed:false}] },
    {day:7, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}, {text:"Message my mother", completed:false}] },
    {day:8, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:9, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
    {day:10,month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] },
]*/

window.onload  = async function () {
    console.log('Loaded!')
    //construct the days
    
    try {
        let response = await fetch('http://127.0.0.1:8000/getPastDaysData?numDays=10');
        previousDaysTasks = JSON.parse( await response.text() )
    } catch(e) {
        alert(e);
    }
    try {
        let response = await fetch('http://127.0.0.1:8000/getFutureDaysData?numDays=10');
        nextDaysTasks = JSON.parse( await response.text() )
    } catch(e) {
        alert(e);
    }

    //Request list of past n days
    //[[{day:7, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] }],
    //[]]
    
    prevNumTasksSetList = []
    prevNumTasksCompletedList = []
    for (dayData of previousDaysTasks) {
        numTasks = 0
        numTasksCompleted = 0
        for (task of dayData.tasks) {
            numTasks += 1
            if (task.completed) numTasksCompleted += 1
        }
        prevNumTasksSetList.push(numTasks)
        prevNumTasksCompletedList.push(numTasksCompleted)
    }

    for(i=0;i<n;i++) prevNumTasksCompletedList[i] = Math.floor(Math.random() * 10)

    //Request list of next n days

    htmlSetup(previousDaysTasks, nextDaysTasks, prevNumTasksSetList, prevNumTasksCompletedList);

    graphSetup();
    drawGraph(prevNumTasksCompletedList);

    window.onresize = function () {
        drawGraph(prevNumTasksCompletedList);
    }

}

function GetTodayStringDate() {

    newdate = new Date()

    return newdate.getDate() +'|'+ (newdate.getMonth()+1) +'|'+ newdate.getFullYear()
}