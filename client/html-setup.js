let taskContainerElements

let futureDayLabels
let futureNumTasksSetList
let futureNumTasksCompletedList

let futureDaysTasks

let futureTasksLists

currentVisibleDayI = 0
let currentVisibleDay

function htmlSetup () {

  // Submit New Task Button
  document.getElementById('submit-button').addEventListener('click', async function () {
    const inputBox = document.getElementById('input-box')

    //dont allow submition if the task name is already in this day
    if (futureTasksLists[currentVisibleDayI].includes(inputBox.value)) {
      alert(inputBox.value + ' has already been added as a task')
    } else if (inputBox.value) {
      try {
        await fetch('http://127.0.0.1:8000/addTask', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            stringDate: futureDaysTasks[currentVisibleDayI].stringDate,
            taskText: inputBox.value
          })
        })

        futureTasksLists[currentVisibleDayI].push(inputBox.value)
        addTaskToContainer(taskContainerElements[currentVisibleDayI], { text: inputBox.value })

        //update total tasks in the day button
        totalTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1]
        futureNumTasksSetList[currentVisibleDayI] += 1
        totalTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI]
        inputBox.value = ''
      } catch (e) {
        alert('Cannot establish a connection right now.\nPlease try again later')
      }
    }
  })
}

function htmlUpdate (previousDaysTasks, futureDaysTasksLocal, prevNumTasksSetList, prevNumTasksCompletedList) {
  futureDaysTasks = futureDaysTasksLocal

  futureDayLabels = []
  taskContainerElements = []

  //calculate flat arrays for the total tasks set/completed in the future n days
  futureNumTasksSetList = []
  futureNumTasksCompletedList = []
  futureTasksLists = []
  for (dayData of futureDaysTasks) {
    numTasks = 0
    numTasksCompleted = 0
    dayTasksList = []
    for (task of dayData.tasks) {
      dayTasksList.push(task.text)
      numTasks += 1
      if (task.completed) numTasksCompleted += 1
    }
    futureTasksLists.push(dayTasksList)
    futureNumTasksSetList.push(numTasks)
    futureNumTasksCompletedList.push(numTasksCompleted)
  }

  dayContainers = document.getElementsByClassName('days-container')

  //append all the day labels for the past n days
  for (dayI = 0; dayI < previousDaysTasks.length; dayI++) {
    day = previousDaysTasks[dayI].stringDate.split('|')[0]
    sup = getSup(day)

    newDay = document.createElement('div')
    dayLabel = document.createElement('p')
    dayLabel.innerText = day + sup + '\n' + prevNumTasksCompletedList[dayI] + '/' + prevNumTasksSetList[dayI]

    newDay.appendChild(dayLabel)

    newDay.classList.add('day-container')

    dayContainers[0].appendChild(newDay)
  }

  selectorContainer = document.getElementById('display-tasks')
  
  //append all the day labels for the next n days
  for (dayI = 0; dayI < nextDaysTasks.length; dayI++) {
    day = futureDaysTasks[dayI].stringDate.split('|')[0]
    sup = getSup(day)

    newDay = document.createElement('div')
    // dayLabel = document.createElement("p");
    dayLabel = document.createElement('div')

    dayLabel.style.margin = '0px'
    dayLabel.style.padding = '0px'

    x = document.createElement('p')
    x.innerText = day + sup
    x.classList.add('day-container-element')
    y = document.createElement('p')
    y.innerText = futureNumTasksCompletedList[dayI] + '/' + futureNumTasksSetList[dayI]
    y.classList.add('day-container-element')
    dayLabel.appendChild(x)
    dayLabel.appendChild(y)

    newDay.appendChild(dayLabel)

    newDay.classList.add('day-container')

    addSelectDayFunctionality(newDay, dayI)

    dayContainers[1].appendChild(newDay)

    //add all the tasks in a hidden div to the left of the search bar
    tasksContainer = document.createElement('div')
    tasksContainer.classList.add('tasks-container')

    for (taskData of nextDaysTasks[dayI].tasks) {
      addTaskToContainer(tasksContainer, taskData)
    }
    selectorContainer.appendChild(tasksContainer)
    taskContainerElements.push(tasksContainer)

    if (dayI == 0) {
      currentVisibleDay = newDay
    } else {
      newDay.classList.add('not-active')
    }

    futureDayLabels.push(newDay)
  }

  taskContainerElements[0].classList.add('active')
}

function addTaskToContainer (container, task) {

  taskContainer = document.createElement('div')

  taskContainer = document.createElement('div')
  taskContainer.classList.add('task-container', 'border')

  taskText = document.createElement('p')

  taskText.innerText = task.text
  taskText.classList.add('task-text')
  taskContainer.appendChild(taskText)
  if (task.completed) { taskText.classList.add('completed') }

  buttonContainer = document.createElement('div')
  buttonContainer.classList.add('button-holder')

  completeTaskButton = document.createElement('button')
  completeTaskButton.classList.add('complete-task-button', 'task-button')
  buttonContainer.appendChild(completeTaskButton)

  removeTaskButton = document.createElement('button')
  removeTaskButton.classList.add('remove-task-button', 'task-button')
  buttonContainer.appendChild(removeTaskButton)

  taskContainer.appendChild(buttonContainer)

  container.appendChild(taskContainer)

  addTaskButtonsFunctionality(completeTaskButton, removeTaskButton, futureDaysTasks)
}

function addTaskButtonsFunctionality (completeTaskButton, removeTaskButton, futureDaysTasks) {
  completeTaskButton.addEventListener('click', async function () {
    taskTextBox = completeTaskButton.parentNode.parentNode.childNodes[0]
    completedTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1]

    try {
      await fetch('http://127.0.0.1:8000/toggleCompletion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stringDate: futureDaysTasks[currentVisibleDayI].stringDate,
          taskText: taskTextBox.innerText
        })
      })

      //keep the total amount of completed tasks in a day correct
      if (taskTextBox.classList.contains('completed')) {
        taskTextBox.classList.remove('completed')
        futureNumTasksCompletedList[currentVisibleDayI] -= 1
      } else {
        taskTextBox.classList.add('completed')
        futureNumTasksCompletedList[currentVisibleDayI] += 1
      }

      completedTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI]
    } catch (e) {
      alert('Cannot establish a connection right now.\nPlease try again later')
    }
  })

  removeTaskButton.addEventListener('click', async function () {
    taskTextBox = removeTaskButton.parentNode.parentNode.childNodes[0]

    // update backend
    try {
      await fetch('http://127.0.0.1:8000/removeTask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          stringDate: futureDaysTasks[currentVisibleDayI].stringDate,
          taskText: taskTextBox.innerText
        })
      })

      //keep the total number of tasks in a day correct
      if (taskTextBox.classList.contains('completed')) {
        futureNumTasksCompletedList[currentVisibleDayI] -= 1
      }

      removeTaskButton.parentNode.parentNode.parentNode.removeChild(removeTaskButton.parentNode.parentNode)

      totalTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1]
      futureNumTasksSetList[currentVisibleDayI] -= 1
      totalTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI]
    } catch (e) {
      alert('Cannot establish a connection right now.\nPlease try again later')
    }
  })
}

function addSelectDayFunctionality (newDay, dayI) {
  newDay.onclick = function () {
    //make the current day not active
    if (currentVisibleDay) {
      currentVisibleDay.classList.add('not-active')
    }
    //make the selected day active
    newDay.classList.remove('not-active')
    if (dayI != currentVisibleDayI) {
      taskContainerElements[currentVisibleDayI].classList.remove('active')
      taskContainerElements[currentVisibleDayI].offsetHeight
      taskContainerElements[dayI].classList.add('active')
      currentVisibleDayI = dayI
      currentVisibleDay = newDay
    }
  }
}

function getSup (day) {
  if (previousDaysTasks[dayI].day == 1) return 'ˢᵗ'
  else if (previousDaysTasks[dayI].day == 2) return 'ⁿᵈ'
  else if (previousDaysTasks[dayI].day == 3) return 'ʳᵈ'
  else return 'ᵗʰ'
}

//remove all dynamically added content from the page
function removeAddedElements () {
  daysContainers = document.getElementsByClassName('days-container')
  daysContainers[0].innerText = ''
  daysContainers[1].innerText = ''

  document.getElementById('display-tasks').innerText = ''
}
