
n = 10

tasksCompleted = []
for(i=0;i<n;i++) tasksCompleted.push( Math.floor(Math.random() * 10) )

window.onload  = function () {
    console.log('Loaded!')
    //construct the days

    htmlSetup(n);

    graphAnimation(tasksCompleted);

}

function GetTodayStringDate() {

    today = new Date()

    return today.getDate() +'/'+ (today.getMonth()+1) +'/'+ today.getFullYear()
}