let taskContainerElements;

let futureDayLabels;
let futureNumTasksSetList;
let futureNumTasksCompletedList;

let futureDaysTasks;

let futureTasksLists;

let currentVisibleDayI = 0;
let currentVisibleDay;

let totalTaskNumContainer;

export function htmlSetup () {
  // Submit New Task Button
  document.getElementById('submit-button').addEventListener('click', async function () {
    const inputBox = document.getElementById('input-box');

    // dont allow submition if the task name is already in this day
    if (futureTasksLists[currentVisibleDayI].includes(inputBox.value)) {
      alert(inputBox.value + ' has already been added as a task');
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
        });

        futureTasksLists[currentVisibleDayI].push(inputBox.value);
        addTaskToContainer(taskContainerElements[currentVisibleDayI], { text: inputBox.value });

        // update total tasks in the day button
        totalTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1];
        futureNumTasksSetList[currentVisibleDayI] += 1;
        totalTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI];
        inputBox.value = '';
      } catch (e) {
        alert('Cannot establish a connection right now.\nPlease try again later');
      }
    }
  });
}

export function htmlUpdate (previousDaysTasks, futureDaysTasksLocal, prevNumTasksSetList, prevNumTasksCompletedList) {
  futureDaysTasks = futureDaysTasksLocal;

  futureDayLabels = [];
  taskContainerElements = [];

  // calculate flat arrays for the total tasks set/completed in the future n days
  futureNumTasksSetList = [];
  futureNumTasksCompletedList = [];
  futureTasksLists = [];
  for (const dayData of futureDaysTasks) {
    let numTasks = 0;
    let numTasksCompleted = 0;
    const dayTasksList = [];
    for (const task of dayData.tasks) {
      dayTasksList.push(task.text);
      numTasks += 1;
      if (task.completed) numTasksCompleted += 1;
    }
    futureTasksLists.push(dayTasksList);
    futureNumTasksSetList.push(numTasks);
    futureNumTasksCompletedList.push(numTasksCompleted);
  }

  const dayContainers = document.getElementsByClassName('days-container');

  // append all the day labels for the past n days
  for (let dayI = 0; dayI < previousDaysTasks.length; dayI++) {
    const day = previousDaysTasks[dayI].stringDate.split('|')[0];
    const sup = getSup(day, dayI, previousDaysTasks);

    const newDay = document.createElement('div');
    const dayLabel = document.createElement('p');
    dayLabel.innerText = day + sup + '\n' + prevNumTasksCompletedList[dayI] + '/' + prevNumTasksSetList[dayI];

    newDay.appendChild(dayLabel);

    newDay.classList.add('day-container');

    dayContainers[0].appendChild(newDay);
  }

  const selectorContainer = document.getElementById('display-tasks');

  // append all the day labels for the next n days
  // for (let dayI = 0; dayI < nextDaysTasks.length; dayI++) {
  for (let dayI = 0; dayI < futureDaysTasks.length; dayI++) {
    const day = futureDaysTasks[dayI].stringDate.split('|')[0];
    const sup = getSup(day, dayI, previousDaysTasks);

    const newDay = document.createElement('div');
    // dayLabel = document.createElement("p");
    const dayLabel = document.createElement('div');

    dayLabel.style.margin = '0px';
    dayLabel.style.padding = '0px';

    const tasksCompletedLabel = document.createElement('p');
    tasksCompletedLabel.innerText = day + sup;
    tasksCompletedLabel.classList.add('day-container-element');
    const totalTasksLabel = document.createElement('p');
    totalTasksLabel.innerText = futureNumTasksCompletedList[dayI] + '/' + futureNumTasksSetList[dayI];
    totalTasksLabel.classList.add('day-container-element');
    dayLabel.appendChild(tasksCompletedLabel);
    dayLabel.appendChild(totalTasksLabel);

    newDay.appendChild(dayLabel);

    newDay.classList.add('day-container');

    addSelectDayFunctionality(newDay, dayI);

    dayContainers[1].appendChild(newDay);

    // add all the tasks in a hidden div to the left of the search bar
    const tasksContainer = document.createElement('div');
    tasksContainer.classList.add('tasks-container');

    for (const taskData of futureDaysTasks[dayI].tasks) {
      addTaskToContainer(tasksContainer, taskData);
    }
    selectorContainer.appendChild(tasksContainer);
    taskContainerElements.push(tasksContainer);

    if (dayI === 0) {
      currentVisibleDay = newDay;
    } else {
      newDay.classList.add('not-active');
    }

    futureDayLabels.push(newDay);
  }

  taskContainerElements[0].classList.add('active');
}

function addTaskToContainer (container, task) {
  const taskContainer = document.createElement('div');
  taskContainer.classList.add('task-container', 'border');

  const taskText = document.createElement('p');

  taskText.innerText = task.text;
  taskText.classList.add('task-text');
  taskContainer.appendChild(taskText);
  if (task.completed) { taskText.classList.add('completed'); }

  const buttonContainer = document.createElement('div');
  buttonContainer.classList.add('button-holder');

  const completeTaskButton = document.createElement('button');
  completeTaskButton.classList.add('complete-task-button', 'task-button');
  buttonContainer.appendChild(completeTaskButton);

  const removeTaskButton = document.createElement('button');
  removeTaskButton.classList.add('remove-task-button', 'task-button');
  buttonContainer.appendChild(removeTaskButton);

  taskContainer.appendChild(buttonContainer);

  container.appendChild(taskContainer);

  addTaskButtonsFunctionality(completeTaskButton, removeTaskButton, futureDaysTasks);
}

function addTaskButtonsFunctionality (completeTaskButton, removeTaskButton, futureDaysTasks) {
  completeTaskButton.addEventListener('click', async function () {
    const taskTextBox = completeTaskButton.parentNode.parentNode.childNodes[0];
    const completedTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1];

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
      });

      // keep the total amount of completed tasks in a day correct
      if (taskTextBox.classList.contains('completed')) {
        taskTextBox.classList.remove('completed');
        futureNumTasksCompletedList[currentVisibleDayI] -= 1;
      } else {
        taskTextBox.classList.add('completed');
        futureNumTasksCompletedList[currentVisibleDayI] += 1;
      }

      completedTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI];
    } catch (e) {
      alert('Cannot establish a connection right now.\nPlease try again later');
    }
  });

  removeTaskButton.addEventListener('click', async function () {
    const taskTextBox = removeTaskButton.parentNode.parentNode.childNodes[0];

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
      });

      // keep the total number of tasks in a day correct
      if (taskTextBox.classList.contains('completed')) {
        futureNumTasksCompletedList[currentVisibleDayI] -= 1;
      }

      removeTaskButton.parentNode.parentNode.parentNode.removeChild(removeTaskButton.parentNode.parentNode);

      totalTaskNumContainer = currentVisibleDay.childNodes[0].childNodes[1];
      futureNumTasksSetList[currentVisibleDayI] -= 1;
      totalTaskNumContainer.innerText = futureNumTasksCompletedList[currentVisibleDayI] + '/' + futureNumTasksSetList[currentVisibleDayI];
    } catch (e) {
      alert('Cannot establish a connection right now.\nPlease try again later');
    }
  });
}

function addSelectDayFunctionality (newDay, dayI) {
  newDay.onclick = function () {
    // make the current day not active
    if (currentVisibleDay) {
      currentVisibleDay.classList.add('not-active');
    }
    // make the selected day active
    newDay.classList.remove('not-active');
    if (dayI !== currentVisibleDayI) {
      taskContainerElements[currentVisibleDayI].classList.remove('active');

      taskContainerElements[dayI].classList.add('active');
      currentVisibleDayI = dayI;
      currentVisibleDay = newDay;
    }
  };
}

function getSup (day, dayI, previousDaysTasks) {
  if (previousDaysTasks[dayI].day === 1) return 'ˢᵗ';
  else if (previousDaysTasks[dayI].day === 2) return 'ⁿᵈ';
  else if (previousDaysTasks[dayI].day === 3) return 'ʳᵈ';
  else return 'ᵗʰ';
}

// remove all dynamically added content from the page
export function removeAddedElements () {
  const daysContainers = document.getElementsByClassName('days-container');
  daysContainers[0].innerText = '';
  daysContainers[1].innerText = '';

  document.getElementById('display-tasks').innerText = '';
}
