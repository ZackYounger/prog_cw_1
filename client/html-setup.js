monthAbrebiations = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

taskContainerElements = []
currentVisibleDayI = 0;
let currentVisibleDay;

function htmlSetup(previousDaysTasks, futureDaysTasks, prevNumTasksSetList, prevNumTasksCompletedList) {

    console.log(previousDaysTasks)
    console.log()

    futureNumTasksSetList = []
    futureNumTasksCompletedList = []
    for (dayData of futureDaysTasks) {
        numTasks = 0
        numTasksCompleted = 0
        for (task of dayData.tasks) {
            numTasks += 1
            if (task.completed) numTasksCompleted += 1
        }
        futureNumTasksSetList.push(numTasks)
        futureNumTasksCompletedList.push(numTasksCompleted)
    }

    dayContainers = document.getElementsByClassName('days-container');

    for (dayI=0; dayI < previousDaysTasks.length; dayI++) {

        day = previousDaysTasks[dayI].stringDate.split('|')[0]
        sup = getSup(day)

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = day+sup +'\n'+ prevNumTasksCompletedList[dayI] + '/' + prevNumTasksSetList[dayI];

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container')

        dayContainers[0].appendChild(newDay)
    }


    selectorContainer = document.getElementById('display-tasks');
    
    for (dayI=0; dayI < nextDaysTasks.length; dayI++) {

        day = futureDaysTasks[dayI].stringDate.split('|')[0]
        sup = getSup(day)

        newDay = document.createElement('div');
        dayLabel = document.createElement("p");
        dayLabel.innerText = day+sup +'\n'+ futureNumTasksCompletedList[dayI] + '/' + futureNumTasksSetList[dayI];

        newDay.appendChild(dayLabel)

        newDay.classList.add('day-container')

        addSelectDayFunctionality(newDay, dayI)

        dayContainers[1].appendChild(newDay)


        tasksContainer = document.createElement('div');
        tasksContainer.classList.add('tasks-container')

        for (taskData of nextDaysTasks[dayI].tasks) {
            addTaskToContainer(tasksContainer, taskData.text)
        }
        selectorContainer.appendChild(tasksContainer)
        taskContainerElements.push(tasksContainer)

        if (dayI == 0) {
            currentVisibleDay = newDay
        } else {
            newDay.classList.add('not-active')
        }
    }

    taskContainerElements[0].classList.add('active')

    //Submit New Task Button
    document.getElementById('submit-button').addEventListener('click', async function() {
        var inputBox = document.getElementById('input-box');
        if (inputBox.value) addTaskToContainer(taskContainerElements[currentVisibleDayI], inputBox.value)
        console.log(futureDaysTasks[currentVisibleDayI].stringDate)
        try {
            await fetch('http://127.0.0.1:8000/addTask', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                  // Add any other headers if needed
                },
                body: JSON.stringify( {
                    stringDate : futureDaysTasks[currentVisibleDayI].stringDate,
                    taskText : inputBox.value} )
              })        } catch(e) {
            alert(e);
        }

        inputBox.value = '';

    });  
}


function addTaskToContainer(container, task) {
    taskContainer = document.createElement('div')

    taskContainer = document.createElement('div');
    taskContainer.classList.add('task-container', 'border');

    taskText = document.createElement('p')
    taskText.innerText = task
    taskText.classList.add('task-text');
    taskContainer.appendChild(taskText)

    buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-holder')

    completeTaskButton = document.createElement('button');
    completeTaskButton.classList.add('complete-task-button', 'task-button');
    buttonContainer.appendChild(completeTaskButton)

    removeTaskButton = document.createElement('button');
    removeTaskButton.classList.add('remove-task-button', 'task-button');
    buttonContainer.appendChild(removeTaskButton)

    taskContainer.appendChild(buttonContainer)

    container.appendChild(taskContainer);

    addTaskButtonsFunctionality(completeTaskButton, removeTaskButton)
}

function addTaskButtonsFunctionality(completeTaskButton, removeTaskButton) {

    completeTaskButton.addEventListener('click', function() {
        taskTextBox = completeTaskButton.parentNode.parentNode.childNodes[0]
        if (taskTextBox.classList.contains('completed')) {
            taskTextBox.classList.remove('completed')
        } else {
            taskTextBox.classList.add('completed')
        }

        //update backend
    })

    removeTaskButton.addEventListener('click', function() {
        removeTaskButton.parentNode.parentNode.parentNode.removeChild(removeTaskButton.parentNode.parentNode)

        //update backend
    })
}

function addSelectDayFunctionality(newDay, dayI) {
    newDay.onclick = function () {
        if (currentVisibleDay) {
            currentVisibleDay.classList.add('not-active')
        }
        newDay.classList.remove('not-active')
        if (dayI != currentVisibleDayI) {
            taskContainerElements[currentVisibleDayI].classList.remove('active');
            taskContainerElements[currentVisibleDayI].offsetHeight;
            taskContainerElements[dayI].classList.add('active');
            currentVisibleDayI = dayI
            currentVisibleDay = newDay
        }
    };
}


function getSup(day) {
    if (previousDaysTasks[dayI].day==1) return 'ˢᵗ'
    else if (previousDaysTasks[dayI].day==2) return 'ⁿᵈ'
    else if (previousDaysTasks[dayI].day==3) return 'ʳᵈ'
    else return 'ᵗʰ'
}
