
n = 10

numTasksSet = []
numTasksCompleted = []
for(i=0;i<n;i++) numTasksSet.push( Math.floor(Math.random() * 10) )
for(i=0;i<n;i++) numTasksCompleted.push( Math.min(numTasksSet[i], Math.floor(Math.random() * 10) ) )

window.onload  = function () {
    console.log('Loaded!')
    //construct the days

    //Request list of past n days
    //[[{day:7, month:7, year:2023, tasks: [{text:"Walk the Dog", completed:False}] }],[]]

    htmlSetup(numTasksSet, numTasksCompleted);

    graphAnimation(numTasksCompleted);

}

function GetTodayStringDate() {

    today = new Date()

    return today.getDate() +'/'+ (today.getMonth()+1) +'/'+ today.getFullYear()
}