
n = 10

numTasksSet = []
numTasksCompleted = []
for(i=0;i<n;i++) numTasksSet.push( Math.floor(Math.random() * 10) )
for(i=0;i<n;i++) numTasksCompleted.push( Math.min(numTasksSet[i], Math.floor(Math.random() * 10) ) )

previousDaysData = [
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

nextDaysData = [
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
]

window.onload  = function () {
    console.log('Loaded!')
    //construct the days

    //Request list of past n days
    //[[{day:7, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:false}] }],
    //[]]
    
    numTasksSetList = []
    numTasksCompletedList = []
    for (dayData of previousDaysData) {
        numTasks = 0
        numTasksCompleted = 0
        for (task of dayData.tasks) {
            numTasks += 1
            if (task.completed) numTasksCompleted += 1
        }
        numTasksSetList.push(numTasks)
        numTasksCompletedList.push(numTasksCompleted)
    }

    //Request list of next n days

    htmlSetup(previousDaysData, nextDaysData, numTasksSetList, numTasksCompletedList);

    graphSetup();
    drawGraph(numTasksCompletedList);

    window.onresize = function () {
        drawGraph(numTasksCompletedList);
    }

}

function GetTodayStringDate() {

    today = new Date()

    return today.getDate() +'/'+ (today.getMonth()+1) +'/'+ today.getFullYear()
}