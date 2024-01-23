dayWidth = 100

// runs on load to setup the page
window.onload = function () {
  htmlSetup()
  graphSetup()
  updatePage()
}

// runs anytime the amount of content on a page needs to change. eg on a resize
async function updatePage () {

  //remove all content added by htmlupdate()
  removeAddedElements()

  // window.innerWidth is extremely unreliable and sometimes produces horrifically huge results
  // I have a small check in place to ensure that two results agree with each other
  if (typeof n === 'undefined') n = Math.round(window.innerWidth / dayWidth)
  lastn = n
  n = Math.round(window.innerWidth / dayWidth)

  if (lastn != n) return

  // Fetch calander data for both the past and future days
  try {
    const response = await fetch('http://127.0.0.1:8000/getPastDaysData?numDays=' + n)
    previousDaysTasks = JSON.parse(await response.text())
  } catch (e) {
    alert(e)
  }
  try {
    const response = await fetch('http://127.0.0.1:8000/getFutureDaysData?numDays=' + n)
    nextDaysTasks = JSON.parse(await response.text())
  } catch (e) {
    alert(e)
  }


  //calculate arrays for the number of set and completed past days
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

  //populate the last n days with artificial data as they will be empty and i want to demonstrate the graph functionality
  for (i=0;i<n;i++) {
    prevNumTasksSetList[i] = Math.abs(hash( previousDaysTasks[i].stringDate))%9
    prevNumTasksCompletedList[i] = Math.min(Math.abs(hash( previousDaysTasks[i].stringDate + '0'))%9, prevNumTasksSetList[i])
}

  //draws all fetched data onto the page
  htmlUpdate(previousDaysTasks, nextDaysTasks, prevNumTasksSetList, prevNumTasksCompletedList)

  //draws the graph
  drawGraph(prevNumTasksCompletedList)
}


window.addEventListener('resize', updatePage)


function GetTodayStringDate () {
  newdate = new Date()

  return newdate.getDate() + '|' + (newdate.getMonth() + 1) + '|' + newdate.getFullYear()
}

//hash function for populating the past days
//https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
function hash(s) {
    return s.split("").reduce(function(a, b) {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
  }